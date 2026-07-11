package com.incubyte.cardealership.auth.dto;

public record LoginResponse(
        String message,
        String token
) {}