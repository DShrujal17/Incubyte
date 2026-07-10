package com.incubyte.cardealership.auth.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AuthServiceTest {

    @Test
    void shouldRegisterUserSuccessfully() {

        AuthService authService = new AuthService();

        RegisterRequest request = new RegisterRequest(
                "Shrujal",
                "shrujal@gmail.com",
                "password123"
        );

        RegisterResponse response = authService.register(request);

        assertEquals("Shrujal", response.name());
        assertEquals("shrujal@gmail.com", response.email());
    }
}