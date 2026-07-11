package com.incubyte.cardealership.auth.controller;

import com.incubyte.cardealership.auth.dto.LoginRequest;
import com.incubyte.cardealership.auth.dto.LoginResponse;
import com.incubyte.cardealership.auth.dto.RegisterRequest;
import com.incubyte.cardealership.auth.dto.RegisterResponse;
import com.incubyte.cardealership.auth.exception.EmailAlreadyExistsException;
import com.incubyte.cardealership.auth.exception.InvalidCredentialsException;
import com.incubyte.cardealership.auth.service.AuthService;
import com.incubyte.cardealership.auth.service.JwtService;
import com.incubyte.cardealership.config.SecurityConfig;
import com.incubyte.cardealership.user.entity.Role;
import com.incubyte.cardealership.user.entity.User;
import com.incubyte.cardealership.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void shouldRegisterUserSuccessfully() throws Exception {

        RegisterResponse response = new RegisterResponse(
                "Shrujal",
                "shrujal@gmail.com"
        );

        when(authService.register(any(RegisterRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name":"Shrujal",
                                  "email":"shrujal@gmail.com",
                                  "password":"password123"
                                }
                                """))
                .andExpect(status().isCreated());
    }

    @Test
    void shouldReturnConflictWhenEmailAlreadyExists() throws Exception {

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new EmailAlreadyExistsException("Email already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "name":"Shrujal",
                                "email":"shrujal@gmail.com",
                                "password":"password123"
                            }
                            """))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldReturnBadRequestWhenEmailIsInvalid() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "name":"Shrujal",
                                "email":"invalid-email",
                                "password":"password123"
                            }
                            """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestWhenNameIsBlank() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "name":"",
                                "email":"shrujal@gmail.com",
                                "password":"password123"
                            }
                            """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestWhenPasswordIsBlank() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "name":"Shrujal",
                                "email":"shrujal@gmail.com",
                                "password":""
                            }
                            """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestWhenEmailIsMissing() throws Exception {

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "name":"Shrujal",
                                "password":"password123"
                            }
                            """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldBlockProtectedEndpointWithoutJwt() throws Exception {
        mockMvc.perform(get("/api/test-protected"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldAllowProtectedEndpointWithValidJwt() throws Exception {
        when(jwtService.extractEmail("valid-jwt")).thenReturn("shrujal@gmail.com");
        when(jwtService.isTokenValid("valid-jwt", "shrujal@gmail.com")).thenReturn(true);

        User user = User.builder()
                .email("shrujal@gmail.com")
                .role(Role.USER)
                .build();
        when(userRepository.findByEmail("shrujal@gmail.com")).thenReturn(Optional.of(user));

        mockMvc.perform(get("/api/test-protected")
                        .header("Authorization", "Bearer valid-jwt"))
                .andExpect(status().isNotFound()); // non-401/403 status (returns 404 because the endpoint does not exist)
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {
        LoginResponse response = new LoginResponse(
                "Login successful",
                "dummy-jwt-token",
                "USER"
        );

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email":"shrujal@gmail.com",
                                  "password":"password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void shouldReturnUnauthorizedWhenLoginFails() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new InvalidCredentialsException("Invalid email or password"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email":"wrong@gmail.com",
                                  "password":"wrongpassword"
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }
}