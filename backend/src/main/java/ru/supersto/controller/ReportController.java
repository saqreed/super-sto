package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.reports.AppointmentReportDTO;
import ru.supersto.dto.reports.OrderReportDTO;
import ru.supersto.entity.AppointmentStatus;
import ru.supersto.entity.OrderStatus;
import ru.supersto.service.ReportService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Отчеты", description = "API для генерации отчетов")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/appointments")
    @Operation(summary = "Отчет по записям за период")
    public ResponseEntity<List<AppointmentReportDTO>> getAppointmentReport(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<AppointmentReportDTO> report = reportService.generateAppointmentReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/appointments/status/{status}")
    @Operation(summary = "Отчет по записям с определенным статусом")
    public ResponseEntity<List<AppointmentReportDTO>> getAppointmentReportByStatus(
            @PathVariable AppointmentStatus status,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<AppointmentReportDTO> report = reportService.generateAppointmentReportByStatus(status, startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/appointments/master/{masterId}")
    @Operation(summary = "Отчет по записям мастера")
    public ResponseEntity<List<AppointmentReportDTO>> getMasterAppointmentReport(
            @PathVariable String masterId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<AppointmentReportDTO> report = reportService.generateMasterAppointmentReport(masterId, startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/orders")
    @Operation(summary = "Отчет по заказам за период")
    public ResponseEntity<List<OrderReportDTO>> getOrderReport(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<OrderReportDTO> report = reportService.generateOrderReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/orders/status/{status}")
    @Operation(summary = "Отчет по заказам с определенным статусом")
    public ResponseEntity<List<OrderReportDTO>> getOrderReportByStatus(
            @PathVariable OrderStatus status,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<OrderReportDTO> report = reportService.generateOrderReportByStatus(status, startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/orders/client/{clientId}")
    @Operation(summary = "Отчет по заказам клиента")
    public ResponseEntity<List<OrderReportDTO>> getClientOrderReport(
            @PathVariable String clientId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<OrderReportDTO> report = reportService.generateClientOrderReport(clientId, startDate, endDate);
        return ResponseEntity.ok(report);
    }
}