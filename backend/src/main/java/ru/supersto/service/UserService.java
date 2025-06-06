package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.supersto.dto.UserProfileDTO;
import ru.supersto.entity.User;
import ru.supersto.entity.UserRole;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService extends BaseService<User, String> {

    private final UserRepository userRepository;

    @Override
    protected UserRepository getRepository() {
        return userRepository;
    }

    @Override
    protected String getEntityName() {
        return "Пользователь";
    }

    public User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public UserProfileDTO getCurrentUserProfile() {
        User user = getCurrentUser();
        return mapToUserProfileDTO(user);
    }

    public UserProfileDTO updateCurrentUserProfile(UserProfileDTO profileDTO) {
        User currentUser = getCurrentUser();

        // Обновляем только разрешенные поля
        currentUser.setFirstName(profileDTO.getFirstName());
        currentUser.setLastName(profileDTO.getLastName());
        currentUser.setPhone(profileDTO.getPhone());

        User updatedUser = userRepository.save(currentUser);
        log.info("Профиль пользователя {} обновлен", currentUser.getEmail());

        return mapToUserProfileDTO(updatedUser);
    }

    public User getUserById(String id) {
        return findByIdOrThrow(id);
    }

    public List<User> findAllActive() {
        return userRepository.findAllActive();
    }

    public List<User> findByRole(UserRole role) {
        return userRepository.findActiveByRole(role);
    }

    public List<User> searchUsers(String searchTerm) {
        return userRepository.searchByNameOrEmail(searchTerm);
    }

    public User updateUserRole(String userId, UserRole newRole) {
        User user = findByIdOrThrow(userId);
        user.setRole(newRole);
        User updatedUser = update(user);
        log.info("Роль пользователя {} изменена на {}", user.getEmail(), newRole);
        return updatedUser;
    }

    public User deactivateUser(String userId) {
        User user = findByIdOrThrow(userId);
        user.setIsActive(false);
        User updatedUser = update(user);
        log.info("Пользователь {} деактивирован", user.getEmail());
        return updatedUser;
    }

    public User activateUser(String userId) {
        User user = findByIdOrThrow(userId);
        user.setIsActive(true);
        User updatedUser = update(user);
        log.info("Пользователь {} активирован", user.getEmail());
        return updatedUser;
    }

    private UserProfileDTO mapToUserProfileDTO(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .loyaltyLevel(user.getLoyaltyLevel())
                .loyaltyPoints(user.getLoyaltyPoints())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}