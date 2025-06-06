package ru.supersto.util;

/**
 * Константы приложения
 */
public final class Constants {

    private Constants() {
        // Утилитарный класс
    }

    // Валидация
    public static final class Validation {
        public static final int PASSWORD_MIN_LENGTH = 6;
        public static final int PASSWORD_MAX_LENGTH = 50;
        public static final int NAME_MIN_LENGTH = 2;
        public static final int NAME_MAX_LENGTH = 50;
        public static final int PHONE_MIN_LENGTH = 10;
        public static final int PHONE_MAX_LENGTH = 15;
        public static final int EMAIL_MAX_LENGTH = 100;
        public static final int DESCRIPTION_MAX_LENGTH = 1000;
        public static final int COMMENT_MAX_LENGTH = 500;

        // Регулярные выражения
        public static final String PHONE_PATTERN = "^(\\+7|8)?[\\s\\-]?\\(?[489][0-9]{2}\\)?[\\s\\-]?[0-9]{3}[\\s\\-]?[0-9]{2}[\\s\\-]?[0-9]{2}$";
        public static final String EMAIL_PATTERN = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
    }

    // Пагинация
    public static final class Pagination {
        public static final int DEFAULT_PAGE_SIZE = 10;
        public static final int MAX_PAGE_SIZE = 100;
        public static final String DEFAULT_SORT_FIELD = "createdAt";
        public static final String DEFAULT_SORT_DIRECTION = "desc";
    }

    // JWT
    public static final class Security {
        public static final String JWT_HEADER = "Authorization";
        public static final String JWT_PREFIX = "Bearer ";
        public static final String ROLE_PREFIX = "ROLE_";
        public static final long ACCESS_TOKEN_VALIDITY = 24 * 60 * 60 * 1000L; // 24 часа
        public static final long REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60 * 1000L; // 7 дней
    }

    // Файлы
    public static final class Files {
        public static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
        public static final long MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB
        public static final String[] ALLOWED_IMAGE_TYPES = { "image/jpeg", "image/jpg", "image/png", "image/webp" };
        public static final String[] ALLOWED_DOCUMENT_TYPES = { "application/pdf", "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
    }

    // Кэширование
    public static final class Cache {
        public static final String USER_CACHE = "users";
        public static final String SERVICE_CACHE = "services";
        public static final String PRODUCT_CACHE = "products";
        public static final int DEFAULT_TTL_SECONDS = 3600; // 1 час
    }

    // API пути
    public static final class ApiPaths {
        public static final String API_PREFIX = "/api";
        public static final String AUTH = "/auth";
        public static final String USERS = "/users";
        public static final String SERVICES = "/services";
        public static final String PRODUCTS = "/products";
        public static final String APPOINTMENTS = "/appointments";
        public static final String ORDERS = "/orders";
        public static final String CHAT = "/chat";
        public static final String ANALYTICS = "/analytics";
        public static final String REPORTS = "/reports";
    }

    // Сообщения
    public static final class Messages {
        // Успешные операции
        public static final String USER_CREATED = "Пользователь успешно создан";
        public static final String USER_UPDATED = "Пользователь успешно обновлен";
        public static final String USER_DELETED = "Пользователь успешно удален";
        public static final String LOGIN_SUCCESS = "Успешная авторизация";
        public static final String LOGOUT_SUCCESS = "Успешный выход из системы";

        // Ошибки
        public static final String USER_NOT_FOUND = "Пользователь не найден";
        public static final String USER_ALREADY_EXISTS = "Пользователь с таким email уже существует";
        public static final String INVALID_CREDENTIALS = "Неверный email или пароль";
        public static final String ACCESS_DENIED = "Доступ запрещен";
        public static final String TOKEN_EXPIRED = "Токен истек";
        public static final String TOKEN_INVALID = "Недействительный токен";
        public static final String VALIDATION_ERROR = "Ошибка валидации данных";
        public static final String INTERNAL_ERROR = "Внутренняя ошибка сервера";

        // Сущности
        public static final String SERVICE_NOT_FOUND = "Услуга не найдена";
        public static final String PRODUCT_NOT_FOUND = "Продукт не найден";
        public static final String APPOINTMENT_NOT_FOUND = "Запись не найдена";
        public static final String ORDER_NOT_FOUND = "Заказ не найден";
        public static final String INSUFFICIENT_STOCK = "Недостаточно товара на складе";
    }

    // Значения по умолчанию
    public static final class Defaults {
        public static final int DEFAULT_LOYALTY_POINTS = 0;
        public static final double DEFAULT_RATING = 0.0;
        public static final int DEFAULT_REVIEW_COUNT = 0;
        public static final int DEFAULT_STOCK_QUANTITY = 0;
        public static final boolean DEFAULT_ACTIVE_STATUS = true;
        public static final int DEFAULT_SERVICE_DURATION = 60; // минуты
    }

    // Лимиты и ограничения
    public static final class Limits {
        public static final int MAX_APPOINTMENT_ADVANCE_DAYS = 30;
        public static final int MAX_ORDER_ITEMS = 50;
        public static final int MAX_CART_ITEMS = 20;
        public static final int MAX_SEARCH_RESULTS = 1000;
        public static final int MAX_NOTIFICATION_AGE_DAYS = 30;
    }

    // Форматы даты и времени
    public static final class DateFormats {
        public static final String DATE_TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";
        public static final String DATE_PATTERN = "yyyy-MM-dd";
        public static final String TIME_PATTERN = "HH:mm";
        public static final String ISO_DATE_TIME_PATTERN = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    }
}