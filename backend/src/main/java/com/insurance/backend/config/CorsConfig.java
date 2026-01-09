// // src/main/java/com/insurance/backend/config/CorsConfig.java

// package com.insurance.backend.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
// import org.springframework.web.filter.CorsFilter;

// import java.util.Arrays;

// @Configuration
// public class CorsConfig {

//     @Bean
//     public CorsFilter corsFilter() {
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         CorsConfiguration config = new CorsConfiguration();

//         config.setAllowCredentials(true);
//         // Allow local dev and deployed frontend
//         config.setAllowedOrigins(Arrays.asList(
//                 "*"
//         ));
//         config.addAllowedHeader("*");
//         config.addAllowedMethod("*");
//         config.addExposedHeader("Authorization");

//         source.registerCorsConfiguration("/**", config);
//         return new CorsFilter(source);
//     }
// }