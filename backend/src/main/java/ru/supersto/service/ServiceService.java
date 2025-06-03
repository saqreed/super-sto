package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.ServiceDTO;
import ru.supersto.entity.ServiceCategory;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.repository.ServiceRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<ru.supersto.entity.Service> getAllActiveServices() {
        return serviceRepository.findAllActive();
    }

    public ru.supersto.entity.Service findById(String id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Услуга не найдена с ID: " + id));
    }

    public List<ru.supersto.entity.Service> findByCategory(ServiceCategory category) {
        return serviceRepository.findActiveByCategoryCategory(category);
    }

    public List<ru.supersto.entity.Service> searchServices(String searchTerm) {
        return serviceRepository.searchByNameAndDescription(searchTerm);
    }

    public List<ru.supersto.entity.Service> findByMaxPrice(double maxPrice) {
        return serviceRepository.findActiveByMaxPrice(maxPrice);
    }

    public ru.supersto.entity.Service createService(ServiceDTO serviceDTO) {
        ru.supersto.entity.Service service = ru.supersto.entity.Service.builder()
                .name(serviceDTO.getName())
                .description(serviceDTO.getDescription())
                .price(serviceDTO.getPrice())
                .duration(serviceDTO.getDuration())
                .category(serviceDTO.getCategory())
                .isActive(true)
                .build();

        service.prePersist();
        ru.supersto.entity.Service savedService = serviceRepository.save(service);
        log.info("Создана новая услуга: {}", savedService.getName());
        return savedService;
    }

    public ru.supersto.entity.Service updateService(String id, ServiceDTO serviceDTO) {
        ru.supersto.entity.Service existingService = findById(id);

        existingService.setName(serviceDTO.getName());
        existingService.setDescription(serviceDTO.getDescription());
        existingService.setPrice(serviceDTO.getPrice());
        existingService.setDuration(serviceDTO.getDuration());
        existingService.setCategory(serviceDTO.getCategory());

        if (serviceDTO.getIsActive() != null) {
            existingService.setIsActive(serviceDTO.getIsActive());
        }

        ru.supersto.entity.Service updatedService = serviceRepository.save(existingService);
        log.info("Услуга {} обновлена", updatedService.getName());
        return updatedService;
    }

    public ru.supersto.entity.Service toggleServiceStatus(String id) {
        ru.supersto.entity.Service service = findById(id);
        service.setIsActive(!service.getIsActive());
        ru.supersto.entity.Service updatedService = serviceRepository.save(service);
        log.info("Статус услуги {} изменен на: {}", service.getName(), service.getIsActive());
        return updatedService;
    }

    public void deleteService(String id) {
        ru.supersto.entity.Service service = findById(id);
        serviceRepository.delete(service);
        log.info("Услуга {} удалена", service.getName());
    }

    public ServiceDTO mapToServiceDTO(ru.supersto.entity.Service service) {
        return ServiceDTO.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .price(service.getPrice())
                .duration(service.getDuration())
                .category(service.getCategory())
                .isActive(service.getIsActive())
                .build();
    }
}