// src/main/java/com/insurance/backend/config/JwtFilter.java

package com.insurance.backend.config;

import com.insurance.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;  // ← ADD THIS
import org.slf4j.LoggerFactory;  // ← ADD THIS
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class); // ← Now works

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;
        String role = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(jwt);
                role = jwtUtil.extractRole(jwt);
                logger.info("JWT Token found - Email: {}, Role: {}", email, role);
            } catch (Exception e) {
                logger.warn("Invalid JWT token: {}", e.getMessage());
            }
        } else {
            logger.debug("No Authorization header found");
        }

        
        // if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        //     if (jwtUtil.validateToken(jwt, email)) {
        //         SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());

        //         UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
        //                 email, null, List.of(authority));
        //         authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        //         SecurityContextHolder.getContext().setAuthentication(authToken);

        //         logger.info("Authenticated user: {} with role: {}", email, role);
        //     } else {
        //         logger.warn("Token validation failed for email: {}", email);
        //     }
        // }
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

    if (jwtUtil.validateToken(jwt, email)) {

        String normalizedRole =
                role.startsWith("ROLE_") ? role : "ROLE_" + role;

        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(normalizedRole);

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        List.of(authority)
                );

        authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        logger.info(
            "Authenticated user: {} with authority: {}",
            email,
            normalizedRole
        );
    }
}


        chain.doFilter(request, response);
    }
}