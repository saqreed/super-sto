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
import ru.supersto.dto.ServiceDTO;
import ru.supersto.entity.Service;
import ru.supersto.entity.ServiceCategory;
import ru.supersto.service.ServiceService;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Услуги", description = "API для управления услугами автосервиса")
@SecurityRequirement(name = "bearerAuth")
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping
    @Operation(summary = "Получить все активные услуги")
    public ResponseEntity<List<Service>> getAllActiveServices() {
        List<Service> services = serviceService.getAllActiveServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить услугу по ID")
    public ResponseEntity<Service> getServiceById(@PathVariable String id) {
        Service service = serviceService.findById(id);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Получить услуги по категории")
    public ResponseEntity<List<Service>> getServicesByCategory(@PathVariable ServiceCategory category) {
        List<Service> services = serviceService.findByCategory(category);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск услуг")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String query) {
        List<Service> services = serviceService.searchServices(query);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/price/max/{maxPrice}")
    @Operation(summary = "Получить услуги до указанной цены")
    public ResponseEntity<List<Service>> getServicesByMaxPrice(@PathVariable double maxPrice) {
        List<Service> services = serviceService.findByMaxPrice(maxPrice);
        return ResponseEntity.ok(services);
    }

    @PostMapping
    @Operation(summary = "Создать новую услугу")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> createService(@Valid @RequestBody ServiceDTO serviceDTO) {
        Service createdService = serviceService.createService(serviceDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить услугу")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> updateService(@PathVariable String id, @Valid @RequestBody ServiceDTO serviceDTO) {
        Service updatedService = serviceService.updateService(id, serviceDTO);
        return ResponseEntity.ok(updatedService);
    }

    @PutMapping("/{id}/toggle-status")
    @Operation(summary = "Изменить статус услуги (активна/неактивна)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> toggleServiceStatus(@PathVariable String id) {
        Service service = serviceService.toggleServiceStatus(id);
        return ResponseEntity.ok(service);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить услугу")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable String id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    @Operation(summary = "Получить все категории услуг")
    public ResponseEntity<ServiceCategory[]> getAllServiceCategories() {
        return ResponseEntity.ok(ServiceCategory.values());
    }
}