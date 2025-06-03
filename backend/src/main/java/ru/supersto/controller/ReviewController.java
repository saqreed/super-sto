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
import ru.supersto.dto.RatingStatsDTO;
import ru.supersto.dto.ReviewDTO;
import ru.supersto.service.ReviewService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Отзывы", description = "API для управления отзывами и рейтингами")
@SecurityRequirement(name = "bearerAuth")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Получить все видимые отзывы")
    public ResponseEntity<List<ReviewDTO>> getAllVisibleReviews() {
        List<ReviewDTO> reviews = reviewService.getAllVisibleReviews();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить отзыв по ID")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable String id) {
        ReviewDTO review = reviewService.findById(id);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/my")
    @Operation(summary = "Получить отзывы текущего клиента")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<ReviewDTO>> getMyReviews() {
        List<ReviewDTO> reviews = reviewService.findByCurrentClient();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/service/{serviceId}")
    @Operation(summary = "Получить отзывы для услуги")
    public ResponseEntity<List<ReviewDTO>> getReviewsByService(@PathVariable String serviceId) {
        List<ReviewDTO> reviews = reviewService.findByService(serviceId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/master/{masterId}")
    @Operation(summary = "Получить отзывы для мастера")
    public ResponseEntity<List<ReviewDTO>> getReviewsByMaster(@PathVariable String masterId) {
        List<ReviewDTO> reviews = reviewService.findByMaster(masterId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/rating/{minRating}")
    @Operation(summary = "Получить отзывы с минимальным рейтингом")
    public ResponseEntity<List<ReviewDTO>> getReviewsByMinRating(@PathVariable Integer minRating) {
        List<ReviewDTO> reviews = reviewService.findByMinRating(minRating);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/date-range")
    @Operation(summary = "Получить отзывы в диапазоне дат")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDTO>> getReviewsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<ReviewDTO> reviews = reviewService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    @Operation(summary = "Создать отзыв")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO createdReview = reviewService.createReview(reviewDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить отзыв")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable String id,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO updatedReview = reviewService.updateReview(id, reviewDTO);
        return ResponseEntity.ok(updatedReview);
    }

    @PutMapping("/{id}/toggle-visibility")
    @Operation(summary = "Изменить видимость отзыва")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDTO> toggleReviewVisibility(@PathVariable String id) {
        ReviewDTO review = reviewService.toggleVisibility(id);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить отзыв")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats/service/{serviceId}")
    @Operation(summary = "Получить статистику рейтингов для услуги")
    public ResponseEntity<RatingStatsDTO> getServiceRatingStats(@PathVariable String serviceId) {
        RatingStatsDTO stats = reviewService.getServiceRatingStats(serviceId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/master/{masterId}")
    @Operation(summary = "Получить статистику рейтингов для мастера")
    public ResponseEntity<RatingStatsDTO> getMasterRatingStats(@PathVariable String masterId) {
        RatingStatsDTO stats = reviewService.getMasterRatingStats(masterId);
        return ResponseEntity.ok(stats);
    }
}