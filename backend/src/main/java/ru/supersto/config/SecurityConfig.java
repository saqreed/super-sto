package ru.supersto.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.supersto.security.JwtAuthenticationEntryPoint;
import ru.supersto.security.JwtAuthenticationFilter;
import ru.supersto.util.Constants;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private List<String> allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("Настройка безопасности приложения");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Заголовки безопасности
                .headers(headers -> headers
                        .frameOptions().deny()
                        .contentTypeOptions().and()
                        .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                                .maxAgeInSeconds(31536000)
                                .includeSubDomains(true))
                        .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                        .and())

                .authorizeHttpRequests(authz -> authz
                        // Публичные endpoints
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.AUTH + "/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + "/health/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("GET", Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.SERVICES + "/**")
                        .permitAll()
                        .requestMatchers("GET", Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.PRODUCTS + "/**")
                        .permitAll()

                        // Endpoints для клиентов
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.APPOINTMENTS + "/my/**")
                        .hasAnyRole("CLIENT", "ADMIN")
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.APPOINTMENTS + "/my")
                        .hasAnyRole("CLIENT", "ADMIN")
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.ORDERS + "/my/**")
                        .hasAnyRole("CLIENT", "ADMIN")
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.ORDERS + "/my")
                        .hasAnyRole("CLIENT", "ADMIN")
                        .requestMatchers("POST",
                                Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.APPOINTMENTS + "/**")
                        .hasAnyRole("CLIENT", "ADMIN")
                        .requestMatchers("POST", Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.ORDERS + "/**")
                        .hasAnyRole("CLIENT", "ADMIN")
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.CHAT + "/**")
                        .hasAnyRole("CLIENT", "MASTER", "ADMIN")
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + "/notifications/**")
                        .hasAnyRole("CLIENT", "MASTER", "ADMIN")
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + "/notifications")
                        .hasAnyRole("CLIENT", "MASTER", "ADMIN")

                        // Endpoints для мастеров
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.APPOINTMENTS + "/master/**")
                        .hasRole("MASTER")

                        // Endpoints для администраторов
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + "/admin/**").hasRole("ADMIN")
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.ANALYTICS + "/**")
                        .hasRole("ADMIN")
                        .requestMatchers(Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.REPORTS + "/**")
                        .hasRole("ADMIN")
                        .requestMatchers("DELETE", Constants.ApiPaths.API_PREFIX + "/**").hasRole("ADMIN")
                        .requestMatchers("PUT", Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.SERVICES + "/**")
                        .hasRole("ADMIN")
                        .requestMatchers("PUT", Constants.ApiPaths.API_PREFIX + Constants.ApiPaths.PRODUCTS + "/**")
                        .hasRole("ADMIN")

                        // Все остальные запросы требуют аутентификации
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        log.info("Конфигурация безопасности завершена");
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        log.info("Настройка CORS с разрешенными источниками: {}", allowedOrigins);

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of(Constants.Security.JWT_HEADER, "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Кэшировать предварительные запросы на час

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}