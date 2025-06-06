package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.supersto.service.BaseService;
import ru.supersto.util.ResponseUtils;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Базовый контроллер с общими CRUD операциями
 */
@Slf4j
public abstract class BaseController<T, ID, CreateDTO, UpdateDTO> {

    protected abstract BaseService<T, ID> getService();

    protected abstract String getEntityName();

    protected abstract T convertFromCreateDTO(CreateDTO createDTO);

    protected abstract T convertFromUpdateDTO(UpdateDTO updateDTO, ID id);

    protected abstract Object convertToResponseDTO(T entity);

    @GetMapping
    @Operation(summary = "Получить все записи")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Записи найдены"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    public ResponseEntity<ResponseUtils.PaginatedResponse<Object>> findAll(
            @Parameter(description = "Номер страницы (начиная с 0)") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "Размер страницы") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "Поле для сортировки") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Направление сортировки (asc/desc)") @RequestParam(defaultValue = "desc") String sortDir) {

        log.info("Запрос на получение всех {} с пагинацией: page={}, size={}, sortBy={}, sortDir={}",
                getEntityName(), page, size, sortBy, sortDir);

        Pageable pageable = ResponseUtils.createPageable(page, size, sortBy, sortDir);
        Page<T> entityPage = getService().findAll(pageable);

        Page<Object> responsePage = entityPage.map(this::convertToResponseDTO);

        log.info("Найдено {} записей {}", responsePage.getTotalElements(), getEntityName());
        return ResponseUtils.paginated(responsePage);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить запись по ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Запись найдена"),
            @ApiResponse(responseCode = "404", description = "Запись не найдена"),
            @ApiResponse(responseCode = "400", description = "Некорректный ID"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<Object>> findById(
            @Parameter(description = "ID записи", required = true) @PathVariable ID id) {

        log.info("Запрос на получение {} по ID: {}", getEntityName(), id);

        T entity = getService().findByIdOrThrow(id);
        Object responseDTO = convertToResponseDTO(entity);

        log.info("{} найден по ID: {}", getEntityName(), id);
        return ResponseUtils.success(responseDTO);
    }

    @PostMapping
    @Operation(summary = "Создать новую запись")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Запись создана"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<Object>> create(
            @Parameter(description = "Данные для создания", required = true) @Valid @RequestBody CreateDTO createDTO) {

        log.info("Запрос на создание {}: {}", getEntityName(), createDTO);

        T entity = convertFromCreateDTO(createDTO);
        T savedEntity = getService().save(entity);
        Object responseDTO = convertToResponseDTO(savedEntity);

        log.info("{} создан успешно", getEntityName());
        return ResponseUtils.success(responseDTO, String.format("%s успешно создан", getEntityName()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить запись")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Запись обновлена"),
            @ApiResponse(responseCode = "404", description = "Запись не найдена"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<Object>> update(
            @Parameter(description = "ID записи", required = true) @PathVariable ID id,
            @Parameter(description = "Данные для обновления", required = true) @Valid @RequestBody UpdateDTO updateDTO) {

        log.info("Запрос на обновление {} с ID {}: {}", getEntityName(), id, updateDTO);

        // Проверяем существование
        getService().findByIdOrThrow(id);

        T entity = convertFromUpdateDTO(updateDTO, id);
        T updatedEntity = getService().update(entity);
        Object responseDTO = convertToResponseDTO(updatedEntity);

        log.info("{} обновлен успешно", getEntityName());
        return ResponseUtils.success(responseDTO, String.format("%s успешно обновлен", getEntityName()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить запись")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Запись удалена"),
            @ApiResponse(responseCode = "404", description = "Запись не найдена"),
            @ApiResponse(responseCode = "400", description = "Некорректный ID"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<Void>> delete(
            @Parameter(description = "ID записи", required = true) @PathVariable ID id) {

        log.info("Запрос на удаление {} с ID: {}", getEntityName(), id);

        getService().deleteById(id);

        log.info("{} удален успешно", getEntityName());
        return ResponseUtils.success(null, String.format("%s успешно удален", getEntityName()));
    }

    @GetMapping("/count")
    @Operation(summary = "Получить количество записей")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Количество получено"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<Long>> count() {
        log.info("Запрос на получение количества {}", getEntityName());

        long count = getService().count();

        log.info("Количество {}: {}", getEntityName(), count);
        return ResponseUtils.success(count);
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск записей")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Поиск выполнен"),
            @ApiResponse(responseCode = "400", description = "Некорректные параметры поиска"),
            @ApiResponse(responseCode = "500", description = "Внутренняя ошибка сервера")
    })
    public ResponseEntity<ResponseUtils.PaginatedResponse<Object>> search(
            @Parameter(description = "Поисковый запрос") @RequestParam(required = false) String query,
            @Parameter(description = "Номер страницы (начиная с 0)") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "Размер страницы") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "Поле для сортировки") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Направление сортировки (asc/desc)") @RequestParam(defaultValue = "desc") String sortDir) {

        log.info("Запрос на поиск {} с запросом: {}", getEntityName(), query);

        Pageable pageable = ResponseUtils.createPageable(page, size, sortBy, sortDir);
        Page<T> entityPage = performSearch(query, pageable);

        Page<Object> responsePage = entityPage.map(this::convertToResponseDTO);

        log.info("Найдено {} записей {} по запросу: {}", responsePage.getTotalElements(), getEntityName(), query);
        return ResponseUtils.paginated(responsePage);
    }

    /**
     * Выполнить поиск (должно быть переопределено в наследниках)
     */
    protected Page<T> performSearch(String query, Pageable pageable) {
        // По умолчанию возвращаем все записи
        return getService().findAll(pageable);
    }

    /**
     * Дополнительная валидация при создании (может быть переопределена)
     */
    protected void validateCreate(CreateDTO createDTO) {
        // Базовая реализация - ничего не делаем
    }

    /**
     * Дополнительная валидация при обновлении (может быть переопределена)
     */
    protected void validateUpdate(UpdateDTO updateDTO, ID id) {
        // Базовая реализация - ничего не делаем
    }
}