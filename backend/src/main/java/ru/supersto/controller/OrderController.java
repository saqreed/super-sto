package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.OrderDTO;
import ru.supersto.dto.OrderItemDTO;
import ru.supersto.entity.OrderStatus;
import ru.supersto.service.OrderService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Заказы", description = "API для управления заказами запчастей")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "Получить все заказы")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить заказ по ID")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable String id) {
        OrderDTO order = orderService.findById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my")
    @Operation(summary = "Получить заказы текущего клиента")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        List<OrderDTO> orders = orderService.findByCurrentClient();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Получить заказы клиента по ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByClient(@PathVariable String clientId) {
        List<OrderDTO> orders = orderService.findByClientId(clientId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Получить заказы по статусу")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<OrderDTO> orders = orderService.findByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/date-range")
    @Operation(summary = "Получить заказы в диапазоне дат")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrdersByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<OrderDTO> orders = orderService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    @Operation(summary = "Создать новый заказ")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус заказа")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable String id,
            @RequestParam OrderStatus status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @PostMapping("/{id}/items")
    @Operation(summary = "Добавить товар в заказ")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> addItemToOrder(
            @PathVariable String id,
            @Valid @RequestBody OrderItemDTO itemDTO) {
        OrderDTO updatedOrder = orderService.addItemToOrder(id, itemDTO);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить заказ")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statuses")
    @Operation(summary = "Получить все статусы заказов")
    public ResponseEntity<OrderStatus[]> getAllOrderStatuses() {
        return ResponseEntity.ok(OrderStatus.values());
    }
}