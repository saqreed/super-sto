package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.reports.AppointmentReportDTO;
import ru.supersto.dto.reports.OrderReportDTO;
import ru.supersto.entity.*;
import ru.supersto.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final AppointmentRepository appointmentRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    public List<AppointmentReportDTO> generateAppointmentReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByDateRange(startDate, endDate);

        return appointments.stream()
                .map(this::mapToAppointmentReport)
                .collect(Collectors.toList());
    }

    public List<AppointmentReportDTO> generateAppointmentReportByStatus(AppointmentStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByDateRange(startDate, endDate)
                .stream()
                .filter(a -> a.getStatus() == status)
                .collect(Collectors.toList());

        return appointments.stream()
                .map(this::mapToAppointmentReport)
                .collect(Collectors.toList());
    }

    public List<AppointmentReportDTO> generateMasterAppointmentReport(String masterId,
            LocalDateTime startDate,
            LocalDateTime endDate) {
        List<Appointment> appointments = appointmentRepository.findByMasterAndDateRange(masterId, startDate, endDate);

        return appointments.stream()
                .map(this::mapToAppointmentReport)
                .collect(Collectors.toList());
    }

    public List<OrderReportDTO> generateOrderReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByDateRange(startDate, endDate);

        return orders.stream()
                .map(this::mapToOrderReport)
                .collect(Collectors.toList());
    }

    public List<OrderReportDTO> generateOrderReportByStatus(OrderStatus status,
            LocalDateTime startDate,
            LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByDateRange(startDate, endDate)
                .stream()
                .filter(o -> o.getStatus() == status)
                .collect(Collectors.toList());

        return orders.stream()
                .map(this::mapToOrderReport)
                .collect(Collectors.toList());
    }

    public List<OrderReportDTO> generateClientOrderReport(String clientId,
            LocalDateTime startDate,
            LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByClientAndDateRange(clientId, startDate, endDate);

        return orders.stream()
                .map(this::mapToOrderReport)
                .collect(Collectors.toList());
    }

    private AppointmentReportDTO mapToAppointmentReport(Appointment appointment) {
        // Проверяем есть ли отзыв для этой записи
        Optional<Review> review = reviewRepository.findByAppointmentIdAndClientId(
                appointment.getId(), appointment.getClient().getId());

        return AppointmentReportDTO.builder()
                .appointmentId(appointment.getId())
                .appointmentDate(appointment.getAppointmentDate())
                .status(appointment.getStatus())
                .clientName(appointment.getClient().getFirstName() + " " + appointment.getClient().getLastName())
                .clientEmail(appointment.getClient().getEmail())
                .clientPhone(appointment.getClient().getPhone())
                .masterName(appointment.getMaster() != null
                        ? appointment.getMaster().getFirstName() + " " + appointment.getMaster().getLastName()
                        : "Не назначен")
                .masterEmail(appointment.getMaster() != null ? appointment.getMaster().getEmail() : null)
                .serviceName(appointment.getService().getName())
                .serviceCategory(appointment.getService().getCategory())
                .servicePrice(appointment.getService().getPrice())
                .serviceDuration(appointment.getService().getDuration())
                .totalPrice(appointment.getTotalPrice())
                .createdAt(appointment.getCreatedAt())
                .completedAt(appointment.getCompletedAt())
                .description(appointment.getDescription())
                .hasReview(review.isPresent())
                .reviewRating(review.map(Review::getRating).orElse(null))
                .build();
    }

    private OrderReportDTO mapToOrderReport(Order order) {
        List<OrderReportDTO.OrderItemReportDTO> itemReports = order.getItems().stream()
                .map(item -> OrderReportDTO.OrderItemReportDTO.builder()
                        .productName(item.getProduct().getName())
                        .productPartNumber(item.getProduct().getPartNumber())
                        .productBrand(item.getProduct().getBrand())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderReportDTO.builder()
                .orderId(order.getId())
                .status(order.getStatus())
                .clientName(order.getClient().getFirstName() + " " + order.getClient().getLastName())
                .clientEmail(order.getClient().getEmail())
                .clientPhone(order.getClient().getPhone())
                .shippingAddress(order.getShippingAddress())
                .contactPhone(order.getContactPhone())
                .totalItems(order.getItems().size())
                .items(itemReports)
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .confirmedAt(order.getConfirmedAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .notes(order.getNotes())
                .build();
    }
}