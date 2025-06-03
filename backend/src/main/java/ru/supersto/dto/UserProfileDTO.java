package ru.supersto.dto;

import lombok.Builder;
import lombok.Data;
import ru.supersto.entity.LoyaltyLevel;
import ru.supersto.entity.UserRole;

import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileDTO {

    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role;
    private LoyaltyLevel loyaltyLevel;
    private Integer loyaltyPoints;
    private Boolean isActive;
    private LocalDateTime createdAt;
}