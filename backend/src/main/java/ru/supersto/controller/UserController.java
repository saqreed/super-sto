package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.UserProfileDTO;
import ru.supersto.entity.User;
import ru.supersto.entity.UserRole;
import ru.supersto.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Пользователи", description = "API для управления пользователями")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Получить профиль текущего пользователя")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile() {
        UserProfileDTO profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @Operation(summary = "Обновить профиль текущего пользователя")
    public ResponseEntity<UserProfileDTO> updateCurrentUserProfile(@RequestBody UserProfileDTO profileDTO) {
        UserProfileDTO updatedProfile = userService.updateCurrentUserProfile(profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить пользователя по ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    @Operation(summary = "Получить список всех активных пользователей")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllActiveUsers() {
        List<User> users = userService.findAllActive();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Получить пользователей по роли")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable UserRole role) {
        List<User> users = userService.findByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    @Operation(summary = "Поиск пользователей")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/role")
    @Operation(summary = "Изменить роль пользователя")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserRole(@PathVariable String id, @RequestParam UserRole role) {
        User updatedUser = userService.updateUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Деактивировать пользователя")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> deactivateUser(@PathVariable String id) {
        User deactivatedUser = userService.deactivateUser(id);
        return ResponseEntity.ok(deactivatedUser);
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Активировать пользователя")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> activateUser(@PathVariable String id) {
        User activatedUser = userService.activateUser(id);
        return ResponseEntity.ok(activatedUser);
    }

    @GetMapping("/masters")
    @Operation(summary = "Получить список всех мастеров")
    public ResponseEntity<List<User>> getAllMasters() {
        List<User> masters = userService.findByRole(UserRole.MASTER);
        return ResponseEntity.ok(masters);
    }
}