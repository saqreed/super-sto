package ru.supersto.entity;

public enum OrderStatus {
    PENDING, // Ожидает обработки
    CONFIRMED, // Подтвержден
    PREPARING, // Готовится к отправке
    SHIPPED, // Отправлен
    DELIVERED, // Доставлен
    CANCELLED // Отменен
}