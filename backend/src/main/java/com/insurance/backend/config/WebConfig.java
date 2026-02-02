package com.insurance.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // @Override
    // public void addResourceHandlers(ResourceHandlerRegistry registry) {
    //     String uploadDir = Paths.get("uploads/claims/").toAbsolutePath().toUri().toString();
    //     registry.addResourceHandler("/uploads/claims/**")
    //             .addResourceLocations(uploadDir);
    // }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                          // apply to all endpoints
                .allowedOrigins("https://vehicle-insurance-pi.vercel.app")   // ← your exact Vercel URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)                     // if you use cookies / auth headers
                .maxAge(3600);                              // cache preflight for 1 hour
    }
}