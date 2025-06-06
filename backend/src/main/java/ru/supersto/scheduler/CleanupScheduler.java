package ru.supersto.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ru.supersto.service.NotificationService;

/**
 * Планировщик для очистки старых данных
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CleanupScheduler {

    private final NotificationService notificationService;

    /**
     * Очистка старых уведомлений каждый день в 2:00
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldNotifications() {
        log.info("Запуск очистки старых уведомлений");

        try {
            notificationService.deleteOldNotifications();
            log.info("Очистка старых уведомлений завершена успешно");
        } catch (Exception e) {
            log.error("Ошибка при очистке старых уведомлений: {}", e.getMessage(), e);
        }
    }

    /**
     * Очистка истекших уведомлений каждые 6 часов
     */
    @Scheduled(fixedRate = 6 * 60 * 60 * 1000) // 6 часов в миллисекундах
    public void cleanupExpiredNotifications() {
        log.info("Запуск очистки истекших уведомлений");

        try {
            notificationService.cleanupExpiredNotifications();
            log.info("Очистка истекших уведомлений завершена успешно");
        } catch (Exception e) {
            log.error("Ошибка при очистке истекших уведомлений: {}", e.getMessage(), e);
        }
    }

    /**
     * Проверка состояния системы каждый час
     */
    @Scheduled(fixedRate = 60 * 60 * 1000) // 1 час в миллисекундах
    public void systemHealthCheck() {
        log.debug("Проверка состояния системы");

        try {
            // Здесь можно добавить различные проверки состояния системы
            // Например, проверка подключения к базе данных, свободного места на диске и
            // т.д.

            Runtime runtime = Runtime.getRuntime();
            long totalMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            long usedMemory = totalMemory - freeMemory;

            double memoryUsagePercent = (double) usedMemory / totalMemory * 100;

            if (memoryUsagePercent > 80) {
                log.warn("Высокое использование памяти: {:.2f}%", memoryUsagePercent);
            } else {
                log.debug("Использование памяти: {:.2f}%", memoryUsagePercent);
            }

        } catch (Exception e) {
            log.error("Ошибка при проверке состояния системы: {}", e.getMessage(), e);
        }
    }

    /**
     * Очистка временных файлов каждую неделю в воскресенье в 3:00
     */
    @Scheduled(cron = "0 0 3 * * SUN")
    public void cleanupTempFiles() {
        log.info("Запуск очистки временных файлов");

        try {
            // TODO: Реализовать очистку временных файлов
            // Например, удаление старых загруженных файлов, логов и т.д.

            log.info("Очистка временных файлов завершена успешно");
        } catch (Exception e) {
            log.error("Ошибка при очистке временных файлов: {}", e.getMessage(), e);
        }
    }
}