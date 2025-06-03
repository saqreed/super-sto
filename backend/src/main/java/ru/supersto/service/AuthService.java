package ru.supersto.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.supersto.dto.AuthRequest;
import ru.supersto.dto.AuthResponse;
import ru.supersto.dto.RegisterRequest;
import ru.supersto.entity.LoyaltyLevel;
import ru.supersto.entity.User;
import ru.supersto.entity.UserRole;
import ru.supersto.exception.AuthenticationException;
import ru.supersto.exception.UserAlreadyExistsException;
import ru.supersto.repository.UserRepository;
import ru.supersto.security.JwtTokenProvider;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        log.info("Попытка регистрации пользователя с email: {}", request.getEmail());

        // Проверяем, не существует ли уже пользователь с таким email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Пользователь с email " + request.getEmail() + " уже существует");
        }

        // Создаем нового пользователя
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(UserRole.CLIENT) // По умолчанию новые пользователи - клиенты
                .isActive(true)
                .loyaltyLevel(LoyaltyLevel.BRONZE)
                .loyaltyPoints(0)
                .build();

        user.prePersist();
        User savedUser = userRepository.save(user);

        // Генерируем токены
        String accessToken = jwtTokenProvider.generateToken(savedUser);
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser);

        log.info("Пользователь {} успешно зарегистрирован", savedUser.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        log.info("Попытка входа пользователя с email: {}", request.getEmail());

        try {
            // Аутентифицируем пользователя
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            User user = (User) authentication.getPrincipal();

            // Генерируем токены
            String accessToken = jwtTokenProvider.generateToken(user);
            String refreshToken = jwtTokenProvider.generateRefreshToken(user);

            log.info("Пользователь {} успешно аутентифицирован", user.getEmail());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .userId(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .build();

        } catch (Exception e) {
            log.error("Ошибка аутентификации для пользователя {}: {}", request.getEmail(), e.getMessage());
            throw new AuthenticationException("Неверный email или пароль");
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        log.info("Попытка обновления токена");

        try {
            String userEmail = jwtTokenProvider.extractUsername(refreshToken);
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new AuthenticationException("Пользователь не найден"));

            if (jwtTokenProvider.isTokenValid(refreshToken, user)) {
                String newAccessToken = jwtTokenProvider.generateToken(user);
                String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

                log.info("Токены успешно обновлены для пользователя {}", user.getEmail());

                return AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .tokenType("Bearer")
                        .userId(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .role(user.getRole())
                        .build();
            } else {
                throw new AuthenticationException("Недействительный refresh токен");
            }
        } catch (Exception e) {
            log.error("Ошибка обновления токена: {}", e.getMessage());
            throw new AuthenticationException("Не удалось обновить токен");
        }
    }
}