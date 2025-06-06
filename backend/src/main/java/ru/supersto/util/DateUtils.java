package ru.supersto.util;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Утилиты для работы с датами и временем
 */
public final class DateUtils {

    private static final ZoneId MOSCOW_ZONE = ZoneId.of("Europe/Moscow");

    private DateUtils() {
        // Утилитарный класс
    }

    /**
     * Получить текущую дату и время в московском часовом поясе
     */
    public static LocalDateTime nowInMoscow() {
        return LocalDateTime.now(MOSCOW_ZONE);
    }

    /**
     * Получить текущую дату в московском часовом поясе
     */
    public static LocalDate todayInMoscow() {
        return LocalDate.now(MOSCOW_ZONE);
    }

    /**
     * Форматировать дату и время
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern(Constants.DateFormats.DATE_TIME_PATTERN));
    }

    /**
     * Форматировать дату
     */
    public static String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DateTimeFormatter.ofPattern(Constants.DateFormats.DATE_PATTERN));
    }

    /**
     * Форматировать время
     */
    public static String formatTime(LocalTime time) {
        if (time == null) {
            return null;
        }
        return time.format(DateTimeFormatter.ofPattern(Constants.DateFormats.TIME_PATTERN));
    }

    /**
     * Парсинг даты и времени из строки
     */
    public static LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.trim().isEmpty()) {
            return null;
        }
        return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    /**
     * Парсинг даты из строки
     */
    public static LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(Constants.DateFormats.DATE_PATTERN));
    }

    /**
     * Проверка, что дата находится в рабочем диапазоне (не в прошлом и не слишком
     * далеко в будущем)
     */
    public static boolean isValidAppointmentDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return false;
        }

        LocalDateTime now = nowInMoscow();
        LocalDateTime maxFutureDate = now.plusDays(Constants.Limits.MAX_APPOINTMENT_ADVANCE_DAYS);

        return dateTime.isAfter(now) && dateTime.isBefore(maxFutureDate);
    }

    /**
     * Проверка, что время находится в рабочих часах (9:00 - 21:00)
     */
    public static boolean isWorkingHours(LocalTime time) {
        if (time == null) {
            return false;
        }

        LocalTime workStart = LocalTime.of(9, 0);
        LocalTime workEnd = LocalTime.of(21, 0);

        return !time.isBefore(workStart) && !time.isAfter(workEnd);
    }

    /**
     * Получить начало дня
     */
    public static LocalDateTime startOfDay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.atStartOfDay();
    }

    /**
     * Получить конец дня
     */
    public static LocalDateTime endOfDay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.atTime(LocalTime.MAX);
    }

    /**
     * Получить разность между датами в днях
     */
    public static long daysBetween(LocalDate start, LocalDate end) {
        if (start == null || end == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(start, end);
    }

    /**
     * Получить разность между датами в часах
     */
    public static long hoursBetween(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return 0;
        }
        return ChronoUnit.HOURS.between(start, end);
    }

    /**
     * Получить разность между датами в минутах
     */
    public static long minutesBetween(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return 0;
        }
        return ChronoUnit.MINUTES.between(start, end);
    }

    /**
     * Проверить, что дата сегодняшняя
     */
    public static boolean isToday(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.equals(todayInMoscow());
    }

    /**
     * Проверить, что дата вчерашняя
     */
    public static boolean isYesterday(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.equals(todayInMoscow().minusDays(1));
    }

    /**
     * Получить список дат между двумя датами
     */
    public static List<LocalDate> getDatesBetween(LocalDate start, LocalDate end) {
        List<LocalDate> dates = new ArrayList<>();
        if (start == null || end == null || start.isAfter(end)) {
            return dates;
        }

        LocalDate current = start;
        while (!current.isAfter(end)) {
            dates.add(current);
            current = current.plusDays(1);
        }

        return dates;
    }

    /**
     * Получить возраст по дате рождения
     */
    public static int calculateAge(LocalDate birthDate) {
        if (birthDate == null) {
            return 0;
        }
        return Period.between(birthDate, todayInMoscow()).getYears();
    }

    /**
     * Проверить, что дата не старше указанного количества дней
     */
    public static boolean isNotOlderThan(LocalDateTime dateTime, int days) {
        if (dateTime == null) {
            return false;
        }
        return dateTime.isAfter(nowInMoscow().minusDays(days));
    }

    /**
     * Получить начало недели (понедельник)
     */
    public static LocalDate getWeekStart(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.with(DayOfWeek.MONDAY);
    }

    /**
     * Получить конец недели (воскресенье)
     */
    public static LocalDate getWeekEnd(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.with(DayOfWeek.SUNDAY);
    }

    /**
     * Получить начало месяца
     */
    public static LocalDate getMonthStart(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.withDayOfMonth(1);
    }

    /**
     * Получить конец месяца
     */
    public static LocalDate getMonthEnd(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.withDayOfMonth(date.lengthOfMonth());
    }
}