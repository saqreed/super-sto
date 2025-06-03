package ru.supersto.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.Appointment;
import ru.supersto.entity.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    List<Appointment> findByClientId(String clientId);

    List<Appointment> findByMasterId(String masterId);

    List<Appointment> findByServiceId(String serviceId);

    List<Appointment> findByStatus(AppointmentStatus status);

    @Query("{'appointmentDate': {'$gte': ?0, '$lte': ?1}}")
    List<Appointment> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'masterId': ?0, 'appointmentDate': {'$gte': ?1, '$lte': ?2}}")
    List<Appointment> findByMasterAndDateRange(String masterId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'clientId': ?0, 'status': ?1}")
    List<Appointment> findByClientAndStatus(String clientId, AppointmentStatus status);

    @Query("{'masterId': ?0, 'status': ?1}")
    List<Appointment> findByMasterAndStatus(String masterId, AppointmentStatus status);
}