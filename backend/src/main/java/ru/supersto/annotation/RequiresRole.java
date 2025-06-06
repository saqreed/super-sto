package ru.supersto.annotation;

import org.springframework.security.access.prepost.PreAuthorize;
import ru.supersto.entity.UserRole;

import java.lang.annotation.*;

/**
 * Аннотация для проверки ролей пользователя
 */
@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@PreAuthorize("hasAnyRole(@target.requiredRoles)")
public @interface RequiresRole {

    /**
     * Требуемые роли
     */
    UserRole[] value();

    /**
     * Сообщение об ошибке доступа
     */
    String message() default "Недостаточно прав доступа";
}