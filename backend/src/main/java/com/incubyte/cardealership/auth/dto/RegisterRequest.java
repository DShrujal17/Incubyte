package com.incubyte.cardealership.auth.dto;

public record RegisterRequest(
        String name,
        String email,
        String password
) {}
