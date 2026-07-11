package com.incubyte.cardealership.auth.service;

import com.incubyte.cardealership.user.entity.Role;
import com.incubyte.cardealership.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private JwtService jwtService;
    private User user;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        user = User.builder()
                .name("Shrujal")
                .email("shrujal@gmail.com")
                .password("password123")
                .role(Role.USER)
                .build();
    }

    @Test
    void shouldExtractEmailFromToken() {
        String token = jwtService.generateToken(user);
        String extractedEmail = jwtService.extractEmail(token);
        assertEquals("shrujal@gmail.com", extractedEmail);
    }

    @Test
    void shouldValidateTokenSuccessfully() {
        String token = jwtService.generateToken(user);
        assertTrue(jwtService.isTokenValid(token, user.getEmail()));
    }
}
