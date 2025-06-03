package ru.supersto.entity;

public enum AppointmentStatus {
    PENDING, // Ожидает подтверждения
    CONFIRMED, // Подтверждена
    IN_PROGRESS, // В работе
    COMPLETED, // Завершена
    CANCELLED // Отменена
}