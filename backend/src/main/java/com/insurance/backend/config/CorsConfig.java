// src/main/java/com/insurance/backend/config/CorsConfig.java

package com.insurance.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        // Allow local dev and deployed frontend
        config.setAllowedOrigins(Arrays.asList(
                "*",
                "https://vehicle-insurance-yyxc-ce64v5qqd-prasanth-ms-projects-56fe251d.vercel.app",
                "https://vehicle-insurance-yyxc-q8zl2stio-prasanth-ms-projects-56fe251d.vercel.app"
        ));
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Authorization");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}