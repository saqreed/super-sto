package ru.supersto.util;

import java.util.regex.Pattern;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

/**
 * Утилиты для валидации данных
 */
public final class ValidationUtils {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(Constants.Validation.EMAIL_PATTERN);
    private static final Pattern PHONE_PATTERN = Pattern.compile(Constants.Validation.PHONE_PATTERN);

    private ValidationUtils() {
        // Утилитарный класс
    }

    /**
     * Проверяет валидность email
     */
    public static boolean isValidEmail(String email) {
        return email != null &&
                !email.trim().isEmpty() &&
                email.length() <= Constants.Validation.EMAIL_MAX_LENGTH &&
                EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Проверяет валидность телефона
     */
    public static boolean isValidPhone(String phone) {
        return phone != null &&
                !phone.trim().isEmpty() &&
                phone.length() >= Constants.Validation.PHONE_MIN_LENGTH &&
                phone.length() <= Constants.Validation.PHONE_MAX_LENGTH &&
                PHONE_PATTERN.matcher(phone.trim()).matches();
    }

    /**
     * Проверяет валидность пароля
     */
    public static boolean isValidPassword(String password) {
        return password != null &&
                password.length() >= Constants.Validation.PASSWORD_MIN_LENGTH &&
                password.length() <= Constants.Validation.PASSWORD_MAX_LENGTH;
    }

    /**
     * Проверяет валидность имени
     */
    public static boolean isValidName(String name) {
        return name != null &&
                !name.trim().isEmpty() &&
                name.trim().length() >= Constants.Validation.NAME_MIN_LENGTH &&
                name.trim().length() <= Constants.Validation.NAME_MAX_LENGTH;
    }

    /**
     * Проверяет, что строка не null и не пустая
     */
    public static boolean isNotEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }

    /**
     * Проверяет, что строка не превышает максимальную длину
     */
    public static boolean isValidLength(String str, int maxLength) {
        return str == null || str.length() <= maxLength;
    }

    /**
     * Проверяет валидность даты и времени
     */
    public static boolean isValidDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.trim().isEmpty()) {
            return false;
        }

        try {
            LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            return true;
        } catch (DateTimeParseException e) {
            return false;
        }
    }

    /**
     * Проверяет, что дата не в прошлом
     */
    public static boolean isNotInPast(LocalDateTime dateTime) {
        return dateTime != null && dateTime.isAfter(LocalDateTime.now());
    }

    /**
     * Проверяет, что число положительное
     */
    public static boolean isPositive(Number number) {
        return number != null && number.doubleValue() > 0;
    }

    /**
     * Проверяет, что число не отрицательное
     */
    public static boolean isNonNegative(Number number) {
        return number != null && number.doubleValue() >= 0;
    }

    /**
     * Проверяет валидность рейтинга (от 1 до 5)
     */
    public static boolean isValidRating(Integer rating) {
        return rating != null && rating >= 1 && rating <= 5;
    }

    /**
     * Проверяет валидность количества
     */
    public static boolean isValidQuantity(Integer quantity) {
        return quantity != null && quantity > 0;
    }

    /**
     * Очищает и нормализует строку
     */
    public static String normalizeString(String str) {
        if (str == null) {
            return null;
        }
        return str.trim().replaceAll("\\s+", " ");
    }

    /**
     * Очищает телефон от лишних символов
     */
    public static String normalizePhone(String phone) {
        if (phone == null) {
            return null;
        }

        String cleaned = phone.replaceAll("[^\\d+]", "");

        // Приводим к стандартному формату +7xxxxxxxxxx
        if (cleaned.startsWith("8") && cleaned.length() == 11) {
            cleaned = "+7" + cleaned.substring(1);
        } else if (cleaned.startsWith("7") && cleaned.length() == 11) {
            cleaned = "+" + cleaned;
        }

        return cleaned;
    }

    /**
     * Валидация цены
     */
    public static boolean isValidPrice(Double price) {
        return price != null && price >= 0 && price <= 999999.99;
    }

    /**
     * Валидация процента (0-100)
     */
    public static boolean isValidPercentage(Double percentage) {
        return percentage != null && percentage >= 0 && percentage <= 100;
    }
}