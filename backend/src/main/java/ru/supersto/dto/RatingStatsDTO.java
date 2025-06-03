package ru.supersto.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RatingStatsDTO {

    private String entityId; // ID услуги или мастера
    private String entityName; // Название услуги или имя мастера
    private Double averageRating; // Средний рейтинг
    private Long totalReviews; // Общее количество отзывов
    private Long ratingCount1; // Количество рейтингов 1
    private Long ratingCount2; // Количество рейтингов 2
    private Long ratingCount3; // Количество рейтингов 3
    private Long ratingCount4; // Количество рейтингов 4
    private Long ratingCount5; // Количество рейтингов 5
}