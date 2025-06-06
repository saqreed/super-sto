package ru.supersto.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.supersto.dto.UserProfileDTO;
import ru.supersto.entity.User;
import ru.supersto.entity.UserRole;
import ru.supersto.service.UserService;
import ru.supersto.util.Constants;
import ru.supersto.util.ResponseUtils;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.USERS)
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Пользователи", description = "API для управления пользователями")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Получить профиль текущего пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Профиль получен"),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<UserProfileDTO>> getCurrentUserProfile() {
        UserProfileDTO profile = userService.getCurrentUserProfile();
        return ResponseUtils.success(profile);
    }

    @PutMapping("/profile")
    @Operation(summary = "Обновить профиль текущего пользователя")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Профиль обновлен"),
            @ApiResponse(responseCode = "400", description = "Некорректные данные"),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<UserProfileDTO>> updateCurrentUserProfile(
            @Valid @RequestBody UserProfileDTO profileDTO) {
        UserProfileDTO updatedProfile = userService.updateCurrentUserProfile(profileDTO);
        return ResponseUtils.success(updatedProfile, Constants.Messages.USER_UPDATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить пользователя по ID")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Пользователь найден"),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден"),
            @ApiResponse(responseCode = "403", description = "Недостаточно прав")
    })
    public ResponseEntity<ResponseUtils.ApiResponse<User>> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseUtils.success(user);
    }

    @GetMapping
    @Operation(summary = "Получить список пользователей с пагинацией")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Список получен"),
            @ApiResponse(responseCode = "403", description = "Недостаточно прав")
    })
    public ResponseEntity<ResponseUtils.PaginatedResponse<User>> getAllUsers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Pageable pageable = ResponseUtils.createPageable(page, size, sortBy, sortDir);
        Page<User> users = userService.findAll(pageable);
        return ResponseUtils.paginated(users);
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