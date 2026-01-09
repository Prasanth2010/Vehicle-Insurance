// src/main/java/com/insurance/backend/config/SecurityConfig.java

package com.insurance.backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(auth -> auth
                // === ACTUATOR MUST BE FIRST ===
                .requestMatchers("/actuator/**", "/actuator/health", "/actuator/info").permitAll()

                // Public endpoints
                .requestMatchers("/", "/auth/login", "/auth/register").permitAll()
                .requestMatchers("/api/profile/**").authenticated()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/profile").authenticated()  // Any logged-in user

                // Admin creation
                .requestMatchers("/admin/register-admin", "/admin/register-surveyor").hasRole("ADMIN")

                // Role-based
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/surveyor/**").hasRole("SURVEYOR")
                .requestMatchers("/user/**").hasRole("USER")
                .requestMatchers("/api/**").authenticated()
                .requestMatchers("/admin/users/me").authenticated()  // Any logged-in user can access their own profile

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of(
            "*"
        ));

        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

}