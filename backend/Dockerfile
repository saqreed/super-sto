# Многоступенчатая сборка для Spring Boot приложения

# Этап 1: Сборка приложения
FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# Копируем файлы Maven
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Устанавливаем права на выполнение
RUN chmod +x mvnw

# Загружаем зависимости
RUN ./mvnw dependency:go-offline -B

# Копируем исходный код
COPY src ./src

# Собираем приложение
RUN ./mvnw clean package -DskipTests

# Этап 2: Создание образа для запуска
FROM openjdk:17-jre-slim

WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup --system supersto && adduser --system --group supersto

# Копируем собранное приложение
COPY --from=builder /app/target/*.jar app.jar

# Создаем директории
RUN mkdir -p /app/logs /app/uploads

# Изменяем владельца файлов
RUN chown -R supersto:supersto /app

# Переключаемся на созданного пользователя
USER supersto

# Открываем порт
EXPOSE 8080

# Настраиваем JVM
ENV JAVA_OPTS="-Xmx512m -Xms256m -Dspring.profiles.active=prod"

# Проверка здоровья
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Запускаем приложение
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 