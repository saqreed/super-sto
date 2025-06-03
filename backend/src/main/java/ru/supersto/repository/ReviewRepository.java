package ru.supersto.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ru.supersto.entity.Review;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByClientId(String clientId);

    List<Review> findByMasterId(String masterId);

    List<Review> findByServiceId(String serviceId);

    List<Review> findByAppointmentId(String appointmentId);

    Optional<Review> findByAppointmentIdAndClientId(String appointmentId, String clientId);

    @Query("{'isVisible': true}")
    List<Review> findAllVisible();

    @Query("{'serviceId': ?0, 'isVisible': true}")
    List<Review> findByServiceIdAndVisible(String serviceId);

    @Query("{'masterId': ?0, 'isVisible': true}")
    List<Review> findByMasterIdAndVisible(String masterId);

    @Query("{'rating': {'$gte': ?0}}")
    List<Review> findByRatingGreaterThanEqual(Integer minRating);

    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<Review> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'serviceId': ?0, 'isVisible': true, 'rating': {'$gte': ?1}}")
    List<Review> findByServiceAndMinRating(String serviceId, Integer minRating);

    @Query("{'masterId': ?0, 'isVisible': true, 'rating': {'$gte': ?1}}")
    List<Review> findByMasterAndMinRating(String masterId, Integer minRating);

    // Агрегации для рейтингов
    @Query(value = "{'serviceId': ?0, 'isVisible': true}", count = true)
    long countByServiceIdAndVisible(String serviceId);

    @Query(value = "{'masterId': ?0, 'isVisible': true}", count = true)
    long countByMasterIdAndVisible(String masterId);
}