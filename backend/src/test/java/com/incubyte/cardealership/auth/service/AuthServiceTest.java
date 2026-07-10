package com.incubyte.cardealership.auth.service;

import com.incubyte.cardealership.auth.dto.RegisterRequest;
import com.incubyte.cardealership.auth.dto.RegisterResponse;
import com.incubyte.cardealership.user.entity.User;
import com.incubyte.cardealership.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() {

        RegisterRequest request = new RegisterRequest(
                "Shrujal",
                "shrujal@gmail.com",
                "password123"
        );

        RegisterResponse response = authService.register(request);

        assertEquals("Shrujal", response.name());
        assertEquals("shrujal@gmail.com", response.email());
    }

    @Test
    void shouldSaveRegisteredUser() {

        RegisterRequest request = new RegisterRequest(
                "Shrujal",
                "shrujal@gmail.com",
                "password123"
        );

        authService.register(request);

        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        RegisterRequest request = new RegisterRequest(
                "Shrujal",
                "shrujal@gmail.com",
                "password123"
        );

        User existingUser = new User(
                "Existing User",
                "shrujal@gmail.com",
                "password"
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(existingUser));

        assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
        );
    }

    @Test
    void shouldThrowExceptionWhenEmailIsInvalid() {

        RegisterRequest request = new RegisterRequest(
                "Shrujal",
                "invalid-email",
                "password123"
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
        );
    }
}