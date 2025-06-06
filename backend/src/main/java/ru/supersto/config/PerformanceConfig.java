package ru.supersto.config;

import org.springframework.boot.autoconfigure.cache.CacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.List;

@Configuration
@EnableCaching
@EnableAsync
@EnableScheduling
public class PerformanceConfig {

    @Bean("performanceTaskExecutor")
    public Executor performanceTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("SuperSTO-Perf-");
        executor.initialize();
        return executor;
    }

    @Bean
    @Profile("!test")
    public CacheManagerCustomizer<ConcurrentMapCacheManager> cacheManagerCustomizer() {
        return cacheManager -> {
            cacheManager.setCacheNames(List.of(
                    "users", // Кэш пользователей
                    "services", // Кэш услуг
                    "products", // Кэш товаров
                    "analytics", // Кэш аналитики
                    "notifications" // Кэш уведомлений
            ));
        };
    }
}