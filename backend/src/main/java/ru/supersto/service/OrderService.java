package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.OrderDTO;
import ru.supersto.dto.OrderItemDTO;
import ru.supersto.dto.ProductDTO;
import ru.supersto.entity.*;
import ru.supersto.exception.BusinessException;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.repository.OrderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ProductService productService;

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO findById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заказ не найден с ID: " + id));
        return mapToOrderDTO(order);
    }

    public List<OrderDTO> findByCurrentClient() {
        User currentUser = userService.getCurrentUser();
        // Для администратора возвращаем все заказы
        if (currentUser.getRole() == ru.supersto.entity.UserRole.ADMIN) {
            return getAllOrders();
        }
        return findByClientId(currentUser.getId());
    }

    public List<OrderDTO> findByClientId(String clientId) {
        return orderRepository.findByClientId(clientId).stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByDateRange(startDate, endDate).stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO createOrder(OrderDTO orderDTO) {
        User currentUser = userService.getCurrentUser();

        // Проверяем наличие товаров и создаем элементы заказа
        List<OrderItem> orderItems = orderDTO.getItems().stream()
                .map(this::createOrderItem)
                .collect(Collectors.toList());

        Order order = Order.builder()
                .client(currentUser)
                .items(orderItems)
                .shippingAddress(orderDTO.getShippingAddress())
                .contactPhone(orderDTO.getContactPhone())
                .notes(orderDTO.getNotes())
                .status(OrderStatus.PENDING)
                .build();

        order.prePersist();

        // Резервируем товары на складе
        reserveProducts(orderItems);

        Order savedOrder = orderRepository.save(order);
        log.info("Создан новый заказ: {} для клиента {}", savedOrder.getId(), currentUser.getEmail());

        return mapToOrderDTO(savedOrder);
    }

    public OrderDTO updateOrderStatus(String id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заказ не найден с ID: " + id));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);

        // Устанавливаем временные метки в зависимости от статуса
        switch (newStatus) {
            case CONFIRMED:
                if (order.getConfirmedAt() == null) {
                    order.setConfirmedAt(LocalDateTime.now());
                }
                break;
            case SHIPPED:
                if (order.getShippedAt() == null) {
                    order.setShippedAt(LocalDateTime.now());
                }
                break;
            case DELIVERED:
                if (order.getDeliveredAt() == null) {
                    order.setDeliveredAt(LocalDateTime.now());
                }
                break;
            case CANCELLED:
                // Возвращаем товары на склад
                returnProductsToStock(order.getItems());
                break;
        }

        Order updatedOrder = orderRepository.save(order);
        log.info("Статус заказа {} изменен с {} на {}", id, oldStatus, newStatus);

        return mapToOrderDTO(updatedOrder);
    }

    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заказ не найден с ID: " + id));

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new BusinessException("Нельзя удалить заказ в статусе: " + order.getStatus());
        }

        // Возвращаем товары на склад если заказ не отменен
        if (order.getStatus() != OrderStatus.CANCELLED) {
            returnProductsToStock(order.getItems());
        }

        orderRepository.delete(order);
        log.info("Заказ {} удален", id);
    }

    public OrderDTO addItemToOrder(String orderId, OrderItemDTO itemDTO) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Заказ не найден с ID: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("Можно добавлять товары только в заказы со статусом PENDING");
        }

        OrderItem newItem = createOrderItem(itemDTO);
        order.getItems().add(newItem);
        order.calculateTotalAmount();

        // Резервируем добавленный товар
        reserveProducts(List.of(newItem));

        Order updatedOrder = orderRepository.save(order);
        log.info("Добавлен товар в заказ {}: {} (количество: {})",
                orderId, newItem.getProduct().getName(), newItem.getQuantity());

        return mapToOrderDTO(updatedOrder);
    }

    private OrderItem createOrderItem(OrderItemDTO itemDTO) {
        ProductDTO productDTO = productService.findById(itemDTO.getProductId());

        // Проверяем наличие товара на складе
        if (productDTO.getQuantity() < itemDTO.getQuantity()) {
            throw new BusinessException(
                    String.format("Недостаточно товара '%s' на складе. Доступно: %d, запрошено: %d",
                            productDTO.getName(), productDTO.getQuantity(), itemDTO.getQuantity()));
        }

        // Создаем объект Product для OrderItem
        Product product = Product.builder()
                .id(productDTO.getId())
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .quantity(productDTO.getQuantity())
                .category(productDTO.getCategory())
                .brand(productDTO.getBrand())
                .partNumber(productDTO.getPartNumber())
                .isActive(productDTO.getIsActive())
                .build();

        OrderItem orderItem = OrderItem.builder()
                .product(product)
                .quantity(itemDTO.getQuantity())
                .unitPrice(productDTO.getPrice())
                .build();

        orderItem.calculateTotalPrice();
        return orderItem;
    }

    private void reserveProducts(List<OrderItem> items) {
        for (OrderItem item : items) {
            productService.decreaseStock(item.getProduct().getId(), item.getQuantity());
        }
    }

    private void returnProductsToStock(List<OrderItem> items) {
        for (OrderItem item : items) {
            productService.increaseStock(item.getProduct().getId(), item.getQuantity());
        }
    }

    private OrderDTO mapToOrderDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(this::mapToOrderItemDTO)
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .clientId(order.getClient().getId())
                .items(itemDTOs)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .contactPhone(order.getContactPhone())
                .notes(order.getNotes())
                .clientName(order.getClient().getFirstName() + " " + order.getClient().getLastName())
                .clientEmail(order.getClient().getEmail())
                .createdAt(order.getCreatedAt())
                .confirmedAt(order.getConfirmedAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .build();
    }

    private OrderItemDTO mapToOrderItemDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .productId(item.getProduct().getId())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .productName(item.getProduct().getName())
                .productDescription(item.getProduct().getDescription())
                .productPartNumber(item.getProduct().getPartNumber())
                .productBrand(item.getProduct().getBrand())
                .build();
    }
}