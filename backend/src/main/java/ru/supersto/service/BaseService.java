package ru.supersto.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.util.Constants;
import ru.supersto.util.DateUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Базовый сервис с общими методами для всех сервисов
 */
@Slf4j
public abstract class BaseService<T, ID> {

    protected abstract MongoRepository<T, ID> getRepository();

    protected abstract String getEntityName();

    /**
     * Найти все записи
     */
    public List<T> findAll() {
        log.debug("Поиск всех записей {}", getEntityName());
        return getRepository().findAll();
    }

    /**
     * Найти все записи с пагинацией
     */
    public Page<T> findAll(Pageable pageable) {
        log.debug("Поиск всех записей {} с пагинацией: page={}, size={}",
                getEntityName(), pageable.getPageNumber(), pageable.getPageSize());
        return getRepository().findAll(pageable);
    }

    /**
     * Найти по ID
     */
    public Optional<T> findById(ID id) {
        log.debug("Поиск {} по ID: {}", getEntityName(), id);
        return getRepository().findById(id);
    }

    /**
     * Найти по ID или выбросить исключение
     */
    public T findByIdOrThrow(ID id) {
        log.debug("Поиск {} по ID: {}", getEntityName(), id);
        return getRepository().findById(id)
                .orElseThrow(() -> {
                    String message = String.format("%s с ID %s не найден", getEntityName(), id);
                    log.warn(message);
                    return new ResourceNotFoundException(message);
                });
    }

    /**
     * Проверить существование по ID
     */
    public boolean existsById(ID id) {
        log.debug("Проверка существования {} по ID: {}", getEntityName(), id);
        return getRepository().existsById(id);
    }

    /**
     * Сохранить
     */
    public T save(T entity) {
        log.debug("Сохранение {}", getEntityName());
        setAuditFields(entity, false);
        T saved = getRepository().save(entity);
        log.info("{} сохранен с ID: {}", getEntityName(), getId(saved));
        return saved;
    }

    /**
     * Обновить
     */
    public T update(T entity) {
        log.debug("Обновление {}", getEntityName());
        setAuditFields(entity, true);
        T updated = getRepository().save(entity);
        log.info("{} обновлен с ID: {}", getEntityName(), getId(updated));
        return updated;
    }

    /**
     * Удалить по ID
     */
    public void deleteById(ID id) {
        log.debug("Удаление {} по ID: {}", getEntityName(), id);
        if (!existsById(id)) {
            String message = String.format("%s с ID %s не найден", getEntityName(), id);
            log.warn(message);
            throw new ResourceNotFoundException(message);
        }
        getRepository().deleteById(id);
        log.info("{} удален с ID: {}", getEntityName(), id);
    }

    /**
     * Удалить
     */
    public void delete(T entity) {
        log.debug("Удаление {}", getEntityName());
        getRepository().delete(entity);
        log.info("{} удален с ID: {}", getEntityName(), getId(entity));
    }

    /**
     * Получить количество записей
     */
    public long count() {
        log.debug("Подсчет записей {}", getEntityName());
        return getRepository().count();
    }

    /**
     * Установить поля аудита (дата создания/обновления)
     */
    protected void setAuditFields(T entity, boolean isUpdate) {
        LocalDateTime now = DateUtils.nowInMoscow();

        try {
            if (!isUpdate) {
                // Установить дату создания только при создании
                entity.getClass().getMethod("setCreatedAt", LocalDateTime.class).invoke(entity, now);
            }
            // Всегда обновлять дату изменения
            entity.getClass().getMethod("setUpdatedAt", LocalDateTime.class).invoke(entity, now);
        } catch (Exception e) {
            // Если методы не найдены, просто игнорируем
            log.debug("Поля аудита не найдены для {}", getEntityName());
        }
    }

    /**
     * Получить ID сущности
     */
    protected ID getId(T entity) {
        try {
            return (ID) entity.getClass().getMethod("getId").invoke(entity);
        } catch (Exception e) {
            log.debug("Метод getId не найден для {}", getEntityName());
            return null;
        }
    }

    /**
     * Валидация входных данных
     */
    protected void validateInput(Object input, String fieldName) {
        if (input == null) {
            throw new IllegalArgumentException(String.format("Поле '%s' не может быть null", fieldName));
        }

        if (input instanceof String && ((String) input).trim().isEmpty()) {
            throw new IllegalArgumentException(String.format("Поле '%s' не может быть пустым", fieldName));
        }
    }

    /**
     * Валидация ID
     */
    protected void validateId(ID id) {
        if (id == null) {
            throw new IllegalArgumentException("ID не может быть null");
        }

        if (id instanceof Number && ((Number) id).longValue() <= 0) {
            throw new IllegalArgumentException("ID должен быть положительным числом");
        }
    }

    /**
     * Проверка лимитов пагинации
     */
    protected void validatePagination(Pageable pageable) {
        if (pageable.getPageSize() > Constants.Pagination.MAX_PAGE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("Размер страницы не может превышать %d", Constants.Pagination.MAX_PAGE_SIZE));
        }
    }
}