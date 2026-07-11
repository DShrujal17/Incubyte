package com.incubyte.cardealership.sale.controller;

import com.incubyte.cardealership.auth.service.JwtService;
import com.incubyte.cardealership.config.SecurityConfig;
import com.incubyte.cardealership.sale.dto.SaleResponse;
import com.incubyte.cardealership.sale.service.SaleService;
import com.incubyte.cardealership.user.entity.Role;
import com.incubyte.cardealership.user.entity.User;
import com.incubyte.cardealership.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SaleController.class)
@Import(SecurityConfig.class)
class SaleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SaleService saleService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();

        // Admin user setup
        when(jwtService.extractEmail("admin-jwt")).thenReturn("admin@gmail.com");
        when(jwtService.isTokenValid("admin-jwt", "admin@gmail.com")).thenReturn(true);
        User admin = User.builder().email("admin@gmail.com").role(Role.ADMIN).build();
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(admin));

        // Regular user setup
        when(jwtService.extractEmail("user-jwt")).thenReturn("user@test.com");
        when(jwtService.isTokenValid("user-jwt", "user@test.com")).thenReturn(true);
        User user = User.builder().email("user@test.com").role(Role.USER).build();
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
    }

    @Test
    void shouldReturnMySalesForAuthenticatedUser() throws Exception {
        SaleResponse sale = new SaleResponse(
                1L, "user@test.com", "Toyota", "Camry", 2024,
                new BigDecimal("35000.00"), LocalDateTime.now()
        );
        when(saleService.getSalesForUser("user@test.com")).thenReturn(List.of(sale));

        mockMvc.perform(get("/api/sales/my")
                        .header("Authorization", "Bearer user-jwt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].vehicleMake").value("Toyota"))
                .andExpect(jsonPath("$[0].buyerEmail").value("user@test.com"));
    }

    @Test
    void shouldReturnAllSalesForAdmin() throws Exception {
        SaleResponse sale1 = new SaleResponse(1L, "user1@test.com", "Toyota", "Camry", 2024,
                new BigDecimal("35000.00"), LocalDateTime.now());
        SaleResponse sale2 = new SaleResponse(2L, "user2@test.com", "Honda", "Civic", 2023,
                new BigDecimal("28000.00"), LocalDateTime.now());

        when(saleService.getAllSales()).thenReturn(List.of(sale1, sale2));

        mockMvc.perform(get("/api/sales")
                        .header("Authorization", "Bearer admin-jwt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldReturn403WhenUserTriesToAccessAllSales() throws Exception {
        mockMvc.perform(get("/api/sales")
                        .header("Authorization", "Bearer user-jwt"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturn401WhenUnauthenticatedAccessesMySales() throws Exception {
        mockMvc.perform(get("/api/sales/my"))
                .andExpect(status().isUnauthorized());
    }
}
