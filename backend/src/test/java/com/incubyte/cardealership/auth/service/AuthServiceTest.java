package com.incubyte.cardealership.auth.service;

import com.incubyte.cardealership.auth.dto.LoginRequest;
import com.incubyte.cardealership.auth.dto.LoginResponse;
import com.incubyte.cardealership.auth.dto.RegisterRequest;
import com.incubyte.cardealership.auth.dto.RegisterResponse;
import com.incubyte.cardealership.user.entity.Role;
import com.incubyte.cardealership.user.entity.User;
import com.incubyte.cardealership.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    //Register User
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

    //Save User
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

    //Duplicate Email
    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        RegisterRequest request = new RegisterRequest(
                "Shrujal",
                "shrujal@gmail.com",
                "password123"
        );

        User existingUser = User.builder()
                .name("Existing User")
                .email("shrujal@gmail.com")
                .password("password")
                .role(Role.USER)
                .build();

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

    //Assign default Role
    @Test
    void shouldAssignDefaultUserRoleToRegisteredUser() {

        RegisterRequest request = new RegisterRequest(
                "Shrujal",
                "shrujal@gmail.com",
                "password123"
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.empty());

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();

        assertEquals(Role.USER, savedUser.getRole());
    }

    //Password encode
    @Test
    void shouldEncryptPasswordBeforeSavingUser() {

        RegisterRequest request = new RegisterRequest(
                "Shrujal",
                "shrujal@gmail.com",
                "password123"
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(captor.capture());

        User savedUser = captor.getValue();

        assertEquals("encodedPassword", savedUser.getPassword());
    }

    // LOGIN //
    @Test
    void shouldLoginSuccessfully() {

        User user = User.builder()
                .name("Shrujal")
                .email("shrujal@gmail.com")
                .password("encodedPassword")
                .role(Role.USER)
                .build();

        LoginRequest request = new LoginRequest(
                "shrujal@gmail.com",
                "password123"
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                request.password(),
                user.getPassword()))
                .thenReturn(true);

        LoginResponse response = authService.login(request);

        assertEquals("Login successful", response.message());

        verify(userRepository).findByEmail(request.email());
    }

    @Test
    void shouldReturnJwtTokenAfterSuccessfulLogin() {

        User user = User.builder()
                .name("Shrujal")
                .email("shrujal@gmail.com")
                .password("encodedPassword")
                .role(Role.USER)
                .build();

        LoginRequest request = new LoginRequest(
                "shrujal@gmail.com",
                "password123"
        );

        when(userRepository.findByEmail(request.email()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                request.password(),
                user.getPassword()))
                .thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("dummy-jwt-token");

        LoginResponse response = authService.login(request);

        assertEquals("Login successful", response.message());
        assertEquals("dummy-jwt-token", response.token());

        verify(userRepository).findByEmail(request.email());
        verify(passwordEncoder).matches(request.password(), user.getPassword());
        verify(jwtService).generateToken(user);
    }
}