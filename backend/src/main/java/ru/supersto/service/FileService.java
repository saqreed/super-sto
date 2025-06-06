package ru.supersto.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.supersto.exception.BusinessException;
import ru.supersto.util.Constants;
import ru.supersto.util.ValidationUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.UUID;

/**
 * Сервис для работы с файлами
 */
@Service
@Slf4j
public class FileService {

    @Value("${app.upload.path:uploads}")
    private String uploadPath;

    @Value("${app.upload.max-size:10485760}") // 10MB по умолчанию
    private long maxFileSize;

    /**
     * Сохранить файл
     */
    public String saveFile(MultipartFile file, String category) {
        validateFile(file);

        try {
            String fileName = generateFileName(file.getOriginalFilename());
            String categoryPath = category != null ? category : "general";
            Path uploadDir = createUploadDirectory(categoryPath);
            Path filePath = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = categoryPath + "/" + fileName;
            log.info("Файл сохранен: {}", relativePath);

            return relativePath;
        } catch (IOException e) {
            log.error("Ошибка сохранения файла: {}", e.getMessage(), e);
            throw new BusinessException("Не удалось сохранить файл");
        }
    }

    /**
     * Удалить файл
     */
    public void deleteFile(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return;
        }

        try {
            Path path = Paths.get(uploadPath, filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                log.info("Файл удален: {}", filePath);
            }
        } catch (IOException e) {
            log.error("Ошибка удаления файла {}: {}", filePath, e.getMessage(), e);
            // Не выбрасываем исключение, так как это не критично
        }
    }

    /**
     * Проверить существование файла
     */
    public boolean fileExists(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return false;
        }

        Path path = Paths.get(uploadPath, filePath);
        return Files.exists(path);
    }

    /**
     * Получить размер файла
     */
    public long getFileSize(String filePath) {
        if (!fileExists(filePath)) {
            return 0;
        }

        try {
            Path path = Paths.get(uploadPath, filePath);
            return Files.size(path);
        } catch (IOException e) {
            log.error("Ошибка получения размера файла {}: {}", filePath, e.getMessage());
            return 0;
        }
    }

    /**
     * Валидация файла
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Файл не может быть пустым");
        }

        if (file.getSize() > maxFileSize) {
            throw new BusinessException(
                    String.format("Размер файла превышает максимально допустимый (%d байт)", maxFileSize));
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new BusinessException("Не удалось определить тип файла");
        }

        // Проверяем тип файла
        boolean isValidType = Arrays.stream(Constants.Files.ALLOWED_IMAGE_TYPES)
                .anyMatch(contentType::equals) ||
                Arrays.stream(Constants.Files.ALLOWED_DOCUMENT_TYPES)
                        .anyMatch(contentType::equals);

        if (!isValidType) {
            throw new BusinessException("Недопустимый тип файла: " + contentType);
        }

        // Дополнительная проверка размера для изображений
        if (Arrays.stream(Constants.Files.ALLOWED_IMAGE_TYPES).anyMatch(contentType::equals)) {
            if (file.getSize() > Constants.Files.MAX_IMAGE_SIZE) {
                throw new BusinessException(
                        String.format("Размер изображения превышает максимально допустимый (%d байт)",
                                Constants.Files.MAX_IMAGE_SIZE));
            }
        }
    }

    /**
     * Создать директорию для загрузки
     */
    private Path createUploadDirectory(String category) throws IOException {
        Path uploadDir = Paths.get(uploadPath, category);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
            log.info("Создана директория для загрузки: {}", uploadDir);
        }
        return uploadDir;
    }

    /**
     * Сгенерировать уникальное имя файла
     */
    private String generateFileName(String originalFileName) {
        String extension = getFileExtension(originalFileName);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);

        return String.format("%s_%s%s", timestamp, uuid, extension);
    }

    /**
     * Получить расширение файла
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }

        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(lastDotIndex);
    }

    /**
     * Получить MIME тип по расширению файла
     */
    public String getMimeType(String fileName) {
        String extension = getFileExtension(fileName).toLowerCase();

        switch (extension) {
            case ".jpg":
            case ".jpeg":
                return "image/jpeg";
            case ".png":
                return "image/png";
            case ".webp":
                return "image/webp";
            case ".pdf":
                return "application/pdf";
            case ".doc":
                return "application/msword";
            case ".docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default:
                return "application/octet-stream";
        }
    }

    /**
     * Форматировать размер файла для отображения
     */
    public String formatFileSize(long size) {
        if (size < 1024) {
            return size + " Б";
        } else if (size < 1024 * 1024) {
            return String.format("%.1f КБ", size / 1024.0);
        } else if (size < 1024 * 1024 * 1024) {
            return String.format("%.1f МБ", size / (1024.0 * 1024.0));
        } else {
            return String.format("%.1f ГБ", size / (1024.0 * 1024.0 * 1024.0));
        }
    }
}