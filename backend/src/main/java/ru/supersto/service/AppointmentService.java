package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.AppointmentDTO;
import ru.supersto.entity.Appointment;
import ru.supersto.entity.AppointmentStatus;
import ru.supersto.entity.User;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.exception.BusinessException;
import ru.supersto.repository.AppointmentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserService userService;
    private final ServiceService serviceService;

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToAppointmentDTO)
                .collect(Collectors.toList());
    }

    public AppointmentDTO findById(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Запись не найдена с ID: " + id));
        return mapToAppointmentDTO(appointment);
    }

    public List<AppointmentDTO> findByClientId(String clientId) {
        return appointmentRepository.findByClientId(clientId).stream()
                .map(this::mapToAppointmentDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> findByMasterId(String masterId) {
        return appointmentRepository.findByMasterId(masterId).stream()
                .map(this::mapToAppointmentDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> findByCurrentClient() {
        User currentUser = userService.getCurrentUser();
        // Для администратора возвращаем все записи
        if (currentUser.getRole() == ru.supersto.entity.UserRole.ADMIN) {
            return getAllAppointments();
        }
        return findByClientId(currentUser.getId());
    }

    public List<AppointmentDTO> findByCurrentMaster() {
        User currentUser = userService.getCurrentUser();
        return findByMasterId(currentUser.getId());
    }

    public List<AppointmentDTO> findByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status).stream()
                .map(this::mapToAppointmentDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.findByDateRange(startDate, endDate).stream()
                .map(this::mapToAppointmentDTO)
                .collect(Collectors.toList());
    }

    public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO) {
        // Проверяем, что клиент существует
        User client = userService.getUserById(appointmentDTO.getClientId());

        // Проверяем, что услуга существует
        ru.supersto.entity.Service service = serviceService.findById(appointmentDTO.getServiceId());

        // Проверяем доступность мастера в указанное время (если мастер указан)
        if (appointmentDTO.getMasterId() != null) {
            User master = userService.getUserById(appointmentDTO.getMasterId());
            validateMasterAvailability(appointmentDTO.getMasterId(), appointmentDTO.getAppointmentDate());
        }

        Appointment appointment = Appointment.builder()
                .client(client)
                .master(appointmentDTO.getMasterId() != null ? userService.getUserById(appointmentDTO.getMasterId())
                        : null)
                .service(service)
                .appointmentDate(appointmentDTO.getAppointmentDate())
                .description(appointmentDTO.getDescription())
                .totalPrice(
                        appointmentDTO.getTotalPrice() != null ? appointmentDTO.getTotalPrice() : service.getPrice())
                .status(AppointmentStatus.PENDING)
                .build();

        appointment.prePersist();
        Appointment savedAppointment = appointmentRepository.save(appointment);
        log.info("Создана новая запись: {} для клиента {}", savedAppointment.getId(), client.getEmail());

        return mapToAppointmentDTO(savedAppointment);
    }

    public AppointmentDTO updateAppointmentStatus(String id, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Запись не найдена с ID: " + id));

        AppointmentStatus oldStatus = appointment.getStatus();
        appointment.setStatus(newStatus);

        // Устанавливаем время завершения если запись завершена
        if (newStatus == AppointmentStatus.COMPLETED && oldStatus != AppointmentStatus.COMPLETED) {
            appointment.setCompletedAt(LocalDateTime.now());
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        log.info("Статус записи {} изменен с {} на {}", id, oldStatus, newStatus);

        return mapToAppointmentDTO(updatedAppointment);
    }

    public AppointmentDTO assignMaster(String appointmentId, String masterId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Запись не найдена с ID: " + appointmentId));

        User master = userService.getUserById(masterId);

        // Проверяем доступность мастера
        validateMasterAvailability(masterId, appointment.getAppointmentDate());

        appointment.setMaster(master);
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        log.info("Мастер {} назначен на запись {}", master.getEmail(), appointmentId);

        return mapToAppointmentDTO(updatedAppointment);
    }

    public void deleteAppointment(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Запись не найдена с ID: " + id));

        if (appointment.getStatus() == AppointmentStatus.IN_PROGRESS ||
                appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BusinessException("Нельзя удалить запись в статусе: " + appointment.getStatus());
        }

        appointmentRepository.delete(appointment);
        log.info("Запись {} удалена", id);
    }

    public List<LocalDateTime> getAvailableSlots(String masterId, LocalDateTime date) {
        // Получаем занятые слоты мастера на указанную дату
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<Appointment> existingAppointments = appointmentRepository
                .findByMasterAndDateRange(masterId, startOfDay, endOfDay);

        // Генерируем доступные слоты (с 9:00 до 18:00 каждый час)
        List<LocalDateTime> availableSlots = java.util.stream.IntStream.range(9, 18)
                .mapToObj(hour -> date.toLocalDate().atTime(hour, 0))
                .filter(slot -> slot.isAfter(LocalDateTime.now())) // Только будущие слоты
                .filter(slot -> existingAppointments.stream()
                        .noneMatch(app -> app.getAppointmentDate().equals(slot)))
                .collect(Collectors.toList());

        return availableSlots;
    }

    private void validateMasterAvailability(String masterId, LocalDateTime appointmentDate) {
        List<Appointment> conflictingAppointments = appointmentRepository
                .findByMasterAndDateRange(masterId, appointmentDate, appointmentDate);

        if (!conflictingAppointments.isEmpty()) {
            throw new BusinessException("Мастер уже занят в указанное время");
        }
    }

    private AppointmentDTO mapToAppointmentDTO(Appointment appointment) {
        return AppointmentDTO.builder()
                .id(appointment.getId())
                .clientId(appointment.getClient().getId())
                .masterId(appointment.getMaster() != null ? appointment.getMaster().getId() : null)
                .serviceId(appointment.getService().getId())
                .appointmentDate(appointment.getAppointmentDate())
                .status(appointment.getStatus())
                .description(appointment.getDescription())
                .totalPrice(appointment.getTotalPrice())
                .clientName(appointment.getClient().getFirstName() + " " + appointment.getClient().getLastName())
                .clientEmail(appointment.getClient().getEmail())
                .clientPhone(appointment.getClient().getPhone())
                .masterName(appointment.getMaster() != null
                        ? appointment.getMaster().getFirstName() + " " + appointment.getMaster().getLastName()
                        : null)
                .serviceName(appointment.getService().getName())
                .serviceDescription(appointment.getService().getDescription())
                .createdAt(appointment.getCreatedAt())
                .completedAt(appointment.getCompletedAt())
                .build();
    }
}