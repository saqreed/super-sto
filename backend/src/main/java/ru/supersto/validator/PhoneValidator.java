package ru.supersto.validator;

import ru.supersto.util.ValidationUtils;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Валидатор для проверки номера телефона
 */
public class PhoneValidator implements ConstraintValidator<ValidPhone, String> {

    @Override
    public void initialize(ValidPhone constraintAnnotation) {
        // Инициализация не требуется
    }

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext context) {
        if (phone == null || phone.trim().isEmpty()) {
            return true; // @NotNull должен обрабатывать null значения
        }

        return ValidationUtils.isValidPhone(phone);
    }
}