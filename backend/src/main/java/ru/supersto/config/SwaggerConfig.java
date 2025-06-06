package ru.supersto.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.supersto.util.Constants;

import java.util.List;

/**
 * Конфигурация Swagger/OpenAPI
 */
@Configuration
@Slf4j
public class SwaggerConfig {

    @Value("${app.version:1.0.0}")
    private String appVersion;

    @Value("${server.port:8082}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        log.info("Настройка Swagger/OpenAPI документации");

        return new OpenAPI()
                .info(new Info()
                        .title("SuperSTO API")
                        .description("API для платформы автосервиса СуперСТО")
                        .version(appVersion)
                        .contact(new Contact()
                                .name("Команда разработки SuperSTO")
                                .email("dev@supersto.ru")
                                .url("https://supersto.ru"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:" + serverPort)
                                .description("Локальный сервер разработки"),
                        new Server()
                                .url("https://api.supersto.ru")
                                .description("Продакшн сервер")))
                .addSecurityItem(new SecurityRequirement()
                        .addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .in(SecurityScheme.In.HEADER)
                                        .name(Constants.Security.JWT_HEADER)
                                        .description("JWT токен авторизации")));
    }
}