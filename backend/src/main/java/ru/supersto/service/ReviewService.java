package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.supersto.dto.RatingStatsDTO;
import ru.supersto.dto.ReviewDTO;
import ru.supersto.entity.*;
import ru.supersto.exception.BusinessException;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.repository.ReviewRepository;
import ru.supersto.repository.AppointmentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final AppointmentRepository appointmentRepository;
    private final ServiceService serviceService;

    public List<ReviewDTO> getAllVisibleReviews() {
        return reviewRepository.findAllVisible().stream()
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());
    }

    public ReviewDTO findById(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Отзыв не найден с ID: " + id));
        return mapToReviewDTO(review);
    }

    public List<ReviewDTO> findByCurrentClient() {
        User currentUser = userService.getCurrentUser();
        return reviewRepository.findByClientId(currentUser.getId()).stream()
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> findByService(String serviceId) {
        return reviewRepository.findByServiceIdAndVisible(serviceId).stream()
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> findByMaster(String masterId) {
        return reviewRepository.findByMasterIdAndVisible(masterId).stream()
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> findByMinRating(Integer minRating) {
        return reviewRepository.findByRatingGreaterThanEqual(minRating).stream()
                .filter(review -> review.getIsVisible())
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return reviewRepository.findByDateRange(startDate, endDate).stream()
                .map(this::mapToReviewDTO)
                .collect(Collectors.toList());
    }

    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        User currentUser = userService.getCurrentUser();

        // Получаем информацию о записи
        Appointment appointment = appointmentRepository.findById(reviewDTO.getAppointmentId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Запись не найдена с ID: " + reviewDTO.getAppointmentId()));

        // Проверяем, что текущий пользователь является клиентом этой записи
        if (!appointment.getClient().getId().equals(currentUser.getId())) {
            throw new BusinessException("Вы можете оставлять отзывы только для своих записей");
        }

        // Проверяем, что запись завершена
        if (appointment.getStatus() != AppointmentStatus.COMPLETED) {
            throw new BusinessException("Отзыв можно оставить только для завершенной записи");
        }

        // Проверяем, что отзыв еще не был оставлен
        if (reviewRepository.findByAppointmentIdAndClientId(
                reviewDTO.getAppointmentId(), currentUser.getId()).isPresent()) {
            throw new BusinessException("Вы уже оставили отзыв для этой записи");
        }

        Review review = Review.builder()
                .client(appointment.getClient())
                .master(appointment.getMaster())
                .service(appointment.getService())
                .appointment(appointment)
                .rating(reviewDTO.getRating())
                .comment(reviewDTO.getComment())
                .isVisible(true)
                .build();

        review.prePersist();
        Review savedReview = reviewRepository.save(review);
        log.info("Создан отзыв: {} для записи {} (рейтинг: {})",
                savedReview.getId(), appointment.getId(), reviewDTO.getRating());

        return mapToReviewDTO(savedReview);
    }

    public ReviewDTO updateReview(String id, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Отзыв не найден с ID: " + id));

        User currentUser = userService.getCurrentUser();

        // Проверяем права доступа (только автор отзыва может его редактировать)
        if (!review.getClient().getId().equals(currentUser.getId())) {
            throw new BusinessException("Вы можете редактировать только свои отзывы");
        }

        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.prePersist(); // Обновляет updatedAt

        Review updatedReview = reviewRepository.save(review);
        log.info("Отзыв {} обновлен", id);

        return mapToReviewDTO(updatedReview);
    }

    public ReviewDTO toggleVisibility(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Отзыв не найден с ID: " + id));

        review.setIsVisible(!review.getIsVisible());
        review.prePersist();

        Review updatedReview = reviewRepository.save(review);
        log.info("Видимость отзыва {} изменена на: {}", id, review.getIsVisible());

        return mapToReviewDTO(updatedReview);
    }

    public void deleteReview(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Отзыв не найден с ID: " + id));

        User currentUser = userService.getCurrentUser();

        // Проверяем права доступа (только автор отзыва может его удалить)
        if (!review.getClient().getId().equals(currentUser.getId())) {
            throw new BusinessException("Вы можете удалять только свои отзывы");
        }

        reviewRepository.delete(review);
        log.info("Отзыв {} удален", id);
    }

    public RatingStatsDTO getServiceRatingStats(String serviceId) {
        List<Review> reviews = reviewRepository.findByServiceIdAndVisible(serviceId);
        return calculateRatingStats(serviceId, reviews, "service");
    }

    public RatingStatsDTO getMasterRatingStats(String masterId) {
        List<Review> reviews = reviewRepository.findByMasterIdAndVisible(masterId);
        return calculateRatingStats(masterId, reviews, "master");
    }

    private RatingStatsDTO calculateRatingStats(String entityId, List<Review> reviews, String entityType) {
        if (reviews.isEmpty()) {
            return RatingStatsDTO.builder()
                    .entityId(entityId)
                    .averageRating(0.0)
                    .totalReviews(0L)
                    .ratingCount1(0L)
                    .ratingCount2(0L)
                    .ratingCount3(0L)
                    .ratingCount4(0L)
                    .ratingCount5(0L)
                    .build();
        }

        Map<Integer, Long> ratingCounts = reviews.stream()
                .collect(Collectors.groupingBy(Review::getRating, Collectors.counting()));

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        String entityName = getEntityName(entityId, entityType);

        return RatingStatsDTO.builder()
                .entityId(entityId)
                .entityName(entityName)
                .averageRating(Math.round(averageRating * 10.0) / 10.0) // Округляем до 1 знака
                .totalReviews((long) reviews.size())
                .ratingCount1(ratingCounts.getOrDefault(1, 0L))
                .ratingCount2(ratingCounts.getOrDefault(2, 0L))
                .ratingCount3(ratingCounts.getOrDefault(3, 0L))
                .ratingCount4(ratingCounts.getOrDefault(4, 0L))
                .ratingCount5(ratingCounts.getOrDefault(5, 0L))
                .build();
    }

    private String getEntityName(String entityId, String entityType) {
        try {
            if ("service".equals(entityType)) {
                ru.supersto.entity.Service service = serviceService.findById(entityId);
                return service.getName();
            } else if ("master".equals(entityType)) {
                User master = userService.getUserById(entityId);
                return master.getFirstName() + " " + master.getLastName();
            }
        } catch (Exception e) {
            log.warn("Не удалось получить название для {} с ID: {}", entityType, entityId);
        }
        return "Неизвестно";
    }

    private ReviewDTO mapToReviewDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .clientId(review.getClient().getId())
                .masterId(review.getMaster() != null ? review.getMaster().getId() : null)
                .serviceId(review.getService().getId())
                .appointmentId(review.getAppointment().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .isVisible(review.getIsVisible())
                .clientName(review.getClient().getFirstName() + " " + review.getClient().getLastName())
                .clientEmail(review.getClient().getEmail())
                .masterName(review.getMaster() != null
                        ? review.getMaster().getFirstName() + " " + review.getMaster().getLastName()
                        : null)
                .serviceName(review.getService().getName())
                .serviceDescription(review.getService().getDescription())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}