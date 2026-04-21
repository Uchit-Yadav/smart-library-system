package com.smartlibrary.smart_library.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 401
                            response.setContentType("application/json");
                            response.getWriter().write(
                                    "{\"status\": 401, \"message\": \"Unauthorized — please login first\"}"
                            );
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);  // 403
                            response.setContentType("application/json");
                            response.getWriter().write(
                                    "{\"status\": 403, \"message\": \"Forbidden — you don't have permission\"}"
                            );
                        })
                )

                .authorizeHttpRequests(auth -> auth
                        // PUBLIC endpoints — no token needed
                        .requestMatchers("/api/auth/**").permitAll()

                        // ADMIN-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Seat management (POST/PUT/DELETE) — ADMIN only
                        // But GET requests to /api/seats — any authenticated user
                        .requestMatchers(HttpMethod.POST, "/api/seats").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/seats/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/seats/**").hasRole("ADMIN")

                        // Everything else requires authentication (any role)
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // ── PASSWORD ENCODER ─────────────────────────────────────────────────
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Which origins can make requests
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",    // React dev server
                "http://localhost:5173",    // Vite dev server
                "http://localhost:5174"     // Vite alternate port
        ));

        // Which HTTP methods are allowed
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        // Which headers the client can send
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",    // JWT token header
                "Content-Type",     // JSON content type
                "X-User-Email"      // Our temporary header (can remove later)
        ));

        // Allow the browser to include credentials (cookies, auth headers)
        configuration.setAllowCredentials(true);

        // Apply this CORS config to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}