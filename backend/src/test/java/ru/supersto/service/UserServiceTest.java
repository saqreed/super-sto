package ru.supersto.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.supersto.dto.UserProfileDTO;
import ru.supersto.entity.User;
import ru.supersto.entity.UserRole;
import ru.supersto.exception.ResourceNotFoundException;
import ru.supersto.repository.UserRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserProfileDTO testUserProfile;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id("test-id")
                .email("test@example.com")
                .firstName("Тест")
                .lastName("Пользователь")
                .phone("+7-900-123-45-67")
                .role(UserRole.CLIENT)
                .isActive(true)
                .build();

        testUserProfile = UserProfileDTO.builder()
                .id("test-id")
                .email("test@example.com")
                .firstName("Тест")
                .lastName("Пользователь")
                .phone("+7-900-123-45-67")
                .role(UserRole.CLIENT)
                .isActive(true)
                .build();
    }

    @Test
    void getUserById_ExistingUser_ReturnsUser() {
        // Arrange
        when(userRepository.findById("test-id")).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserById("test-id");

        // Assert
        assertNotNull(result);
        assertEquals("test-id", result.getId());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).findById("test-id");
    }

    @Test
    void getUserById_NonExistingUser_ThrowsException() {
        // Arrange
        when(userRepository.findById("non-existing-id")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class,
                () -> userService.getUserById("non-existing-id"));
        verify(userRepository).findById("non-existing-id");
    }

    @Test
    void findAllActive_ReturnsActiveUsers() {
        // Arrange
        List<User> activeUsers = Arrays.asList(testUser);
        when(userRepository.findAllActive()).thenReturn(activeUsers);

        // Act
        List<User> result = userService.findAllActive();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("test@example.com", result.get(0).getEmail());
        verify(userRepository).findAllActive();
    }

    @Test
    void findByRole_ValidRole_ReturnsUsersWithRole() {
        // Arrange
        List<User> clientUsers = Arrays.asList(testUser);
        when(userRepository.findActiveByRole(UserRole.CLIENT)).thenReturn(clientUsers);

        // Act
        List<User> result = userService.findByRole(UserRole.CLIENT);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(UserRole.CLIENT, result.get(0).getRole());
        verify(userRepository).findActiveByRole(UserRole.CLIENT);
    }

    @Test
    void searchUsers_ValidSearchTerm_ReturnsMatchingUsers() {
        // Arrange
        List<User> searchResults = Arrays.asList(testUser);
        when(userRepository.searchByNameOrEmail("тест")).thenReturn(searchResults);

        // Act
        List<User> result = userService.searchUsers("тест");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userRepository).searchByNameOrEmail("тест");
    }

    @Test
    void updateUserRole_ValidUser_UpdatesRole() {
        // Arrange
        when(userRepository.findById("test-id")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.updateUserRole("test-id", UserRole.MASTER);

        // Assert
        assertNotNull(result);
        verify(userRepository).findById("test-id");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void deactivateUser_ExistingUser_DeactivatesUser() {
        // Arrange
        when(userRepository.findById("test-id")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.deactivateUser("test-id");

        // Assert
        assertNotNull(result);
        verify(userRepository).findById("test-id");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void activateUser_ExistingUser_ActivatesUser() {
        // Arrange
        when(userRepository.findById("test-id")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.activateUser("test-id");

        // Assert
        assertNotNull(result);
        verify(userRepository).findById("test-id");
        verify(userRepository).save(any(User.class));
    }
}