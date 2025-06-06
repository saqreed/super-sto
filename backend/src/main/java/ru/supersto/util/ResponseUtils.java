package ru.supersto.util;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

/**
 * Утилиты для создания стандартизированных ответов API
 */
public final class ResponseUtils {

    private ResponseUtils() {
        // Утилитарный класс
    }

    /**
     * Создать успешный ответ с данными
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return success(data, null);
    }

    /**
     * Создать успешный ответ с данными и сообщением
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message) {
        ApiResponse<T> response = new ApiResponse<>(true, message, data);
        return ResponseEntity.ok(response);
    }

    /**
     * Создать ответ об ошибке
     */
    public static <T> ResponseEntity<ApiResponse<T>> error(String message, HttpStatus status) {
        ApiResponse<T> response = new ApiResponse<>(false, message, null);
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Создать ответ об ошибке валидации
     */
    public static <T> ResponseEntity<ApiResponse<T>> validationError(String message) {
        return error(message, HttpStatus.BAD_REQUEST);
    }

    /**
     * Создать ответ "не найдено"
     */
    public static <T> ResponseEntity<ApiResponse<T>> notFound(String message) {
        return error(message, HttpStatus.NOT_FOUND);
    }

    /**
     * Создать ответ "доступ запрещен"
     */
    public static <T> ResponseEntity<ApiResponse<T>> forbidden(String message) {
        return error(message, HttpStatus.FORBIDDEN);
    }

    /**
     * Создать ответ "не авторизован"
     */
    public static <T> ResponseEntity<ApiResponse<T>> unauthorized(String message) {
        return error(message, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Создать пагинированный ответ
     */
    public static <T> ResponseEntity<PaginatedResponse<T>> paginated(Page<T> page) {
        PaginatedResponse<T> response = new PaginatedResponse<>(
                true,
                null,
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast());
        return ResponseEntity.ok(response);
    }

    /**
     * Создать объект пагинации
     */
    public static Pageable createPageable(Integer page, Integer size, String sortBy, String sortDir) {
        int pageNumber = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0 && size <= Constants.Pagination.MAX_PAGE_SIZE)
                ? size
                : Constants.Pagination.DEFAULT_PAGE_SIZE;

        String sortField = (sortBy != null && !sortBy.trim().isEmpty())
                ? sortBy
                : Constants.Pagination.DEFAULT_SORT_FIELD;

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        return PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortField));
    }

    /**
     * Создать мета-информацию для ответа
     */
    public static Map<String, Object> createMeta(long total, int page, int size) {
        Map<String, Object> meta = new HashMap<>();
        meta.put("total", total);
        meta.put("page", page);
        meta.put("size", size);
        meta.put("totalPages", (int) Math.ceil((double) total / size));
        return meta;
    }

    /**
     * Стандартная структура ответа API
     */
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;
        private Long timestamp;

        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }

        // Геттеры и сеттеры
        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public T getData() {
            return data;
        }

        public void setData(T data) {
            this.data = data;
        }

        public Long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Long timestamp) {
            this.timestamp = timestamp;
        }
    }

    /**
     * Структура пагинированного ответа
     */
    public static class PaginatedResponse<T> extends ApiResponse<java.util.List<T>> {
        private int currentPage;
        private int pageSize;
        private long totalElements;
        private int totalPages;
        private boolean first;
        private boolean last;

        public PaginatedResponse(boolean success, String message, java.util.List<T> data,
                int currentPage, int pageSize, long totalElements, int totalPages,
                boolean first, boolean last) {
            super(success, message, data);
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.first = first;
            this.last = last;
        }

        // Геттеры и сеттеры для пагинации
        public int getCurrentPage() {
            return currentPage;
        }

        public void setCurrentPage(int currentPage) {
            this.currentPage = currentPage;
        }

        public int getPageSize() {
            return pageSize;
        }

        public void setPageSize(int pageSize) {
            this.pageSize = pageSize;
        }

        public long getTotalElements() {
            return totalElements;
        }

        public void setTotalElements(long totalElements) {
            this.totalElements = totalElements;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }

        public boolean isFirst() {
            return first;
        }

        public void setFirst(boolean first) {
            this.first = first;
        }

        public boolean isLast() {
            return last;
        }

        public void setLast(boolean last) {
            this.last = last;
        }
    }
}