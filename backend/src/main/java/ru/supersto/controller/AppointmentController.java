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
import ru.supersto.dto.AppointmentDTO;
import ru.supersto.entity.AppointmentStatus;
import ru.supersto.service.AppointmentService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Записи", description = "API для управления записями на обслуживание")
@SecurityRequirement(name = "bearerAuth")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    @Operation(summary = "Получить все записи")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        List<AppointmentDTO> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить запись по ID")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable String id) {
        AppointmentDTO appointment = appointmentService.findById(id);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/my")
    @Operation(summary = "Получить записи текущего клиента")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments() {
        List<AppointmentDTO> appointments = appointmentService.findByCurrentClient();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/master/my")
    @Operation(summary = "Получить записи текущего мастера")
    @PreAuthorize("hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentDTO>> getMyMasterAppointments() {
        List<AppointmentDTO> appointments = appointmentService.findByCurrentMaster();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Получить записи клиента по ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByClient(@PathVariable String clientId) {
        List<AppointmentDTO> appointments = appointmentService.findByClientId(clientId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/master/{masterId}")
    @Operation(summary = "Получить записи мастера по ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByMaster(@PathVariable String masterId) {
        List<AppointmentDTO> appointments = appointmentService.findByMasterId(masterId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Получить записи по статусу")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByStatus(@PathVariable AppointmentStatus status) {
        List<AppointmentDTO> appointments = appointmentService.findByStatus(status);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/date-range")
    @Operation(summary = "Получить записи в диапазоне дат")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MASTER')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<AppointmentDTO> appointments = appointmentService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    @Operation(summary = "Создать новую запись")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<AppointmentDTO> createAppointment(@Valid @RequestBody AppointmentDTO appointmentDTO) {
        AppointmentDTO createdAppointment = appointmentService.createAppointment(appointmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Изменить статус записи")
    @PreAuthorize("hasRole('MASTER') or hasRole('ADMIN')")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(
            @PathVariable String id,
            @RequestParam AppointmentStatus status) {
        AppointmentDTO updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(updatedAppointment);
    }

    @PutMapping("/{id}/assign-master")
    @Operation(summary = "Назначить мастера на запись")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentDTO> assignMaster(
            @PathVariable String id,
            @RequestParam String masterId) {
        AppointmentDTO updatedAppointment = appointmentService.assignMaster(id, masterId);
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить запись")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available-slots/{masterId}")
    @Operation(summary = "Получить доступные слоты мастера")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(
            @PathVariable String masterId,
            @RequestParam LocalDateTime date) {
        List<LocalDateTime> availableSlots = appointmentService.getAvailableSlots(masterId, date);
        return ResponseEntity.ok(availableSlots);
    }

    @GetMapping("/statuses")
    @Operation(summary = "Получить все статусы записей")
    public ResponseEntity<AppointmentStatus[]> getAllAppointmentStatuses() {
        return ResponseEntity.ok(AppointmentStatus.values());
    }
}