package ru.supersto.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import ru.supersto.util.Constants;

/**
 * Конфигурация кэширования
 */
@Configuration
@EnableCaching
@Slf4j
public class CacheConfig {

    @Bean
    @Profile("!redis")
    public CacheManager cacheManager() {
        log.info("Настройка простого кэш-менеджера");

        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(java.util.List.of(
                Constants.Cache.USER_CACHE,
                Constants.Cache.SERVICE_CACHE,
                Constants.Cache.PRODUCT_CACHE));

        return cacheManager;
    }

    // TODO: Добавить Redis конфигурацию при необходимости
    /*
     * @Bean
     * 
     * @Profile("redis")
     * public CacheManager redisCacheManager(RedisConnectionFactory
     * connectionFactory) {
     * log.info("Настройка Redis кэш-менеджера");
     * 
     * RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
     * .entryTtl(Duration.ofSeconds(Constants.Cache.DEFAULT_TTL_SECONDS))
     * .serializeKeysWith(RedisSerializationContext.SerializationPair
     * .fromSerializer(new StringRedisSerializer()))
     * .serializeValuesWith(RedisSerializationContext.SerializationPair
     * .fromSerializer(new GenericJackson2JsonRedisSerializer()));
     * 
     * return RedisCacheManager.builder(connectionFactory)
     * .cacheDefaults(config)
     * .build();
     * }
     */
}