package com.incubyte.cardealership.vehicle.controller;

import com.incubyte.cardealership.auth.service.JwtService;
import com.incubyte.cardealership.config.SecurityConfig;
import com.incubyte.cardealership.user.entity.Role;
import com.incubyte.cardealership.user.entity.User;
import com.incubyte.cardealership.user.repository.UserRepository;
import com.incubyte.cardealership.vehicle.dto.*;
import com.incubyte.cardealership.vehicle.entity.VehicleStatus;
import com.incubyte.cardealership.vehicle.exception.DuplicateVinException;
import com.incubyte.cardealership.vehicle.exception.VehicleNotFoundException;
import com.incubyte.cardealership.vehicle.service.VehicleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VehicleController.class)
@Import(SecurityConfig.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VehicleService vehicleService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
        when(jwtService.extractEmail("valid-jwt")).thenReturn("shrujal@gmail.com");
        when(jwtService.isTokenValid("valid-jwt", "shrujal@gmail.com")).thenReturn(true);

        User admin = User.builder()
                .email("shrujal@gmail.com")
                .role(Role.ADMIN)
                .build();
        when(userRepository.findByEmail("shrujal@gmail.com")).thenReturn(Optional.of(admin));

        when(jwtService.extractEmail("user-jwt")).thenReturn("user@gmail.com");
        when(jwtService.isTokenValid("user-jwt", "user@gmail.com")).thenReturn(true);

        User user = User.builder()
                .email("user@gmail.com")
                .role(Role.USER)
                .build();
        when(userRepository.findByEmail("user@gmail.com")).thenReturn(Optional.of(user));
    }

    @Test
    void shouldCreateVehicleSuccessfully() throws Exception {
        VehicleResponse response = new VehicleResponse(
                1L,
                "12345678901234567",
                "Toyota",
                "Camry",
                2024,
                new BigDecimal("35000.00"),
                VehicleStatus.AVAILABLE
        );

        when(vehicleService.createVehicle(any(VehicleRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/vehicles")
                        .header("Authorization", "Bearer valid-jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "vin":"12345678901234567",
                                  "make":"Toyota",
                                  "model":"Camry",
                                  "year":2024,
                                  "price":35000.00,
                                  "status":"AVAILABLE"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.vin").value("12345678901234567"))
                .andExpect(jsonPath("$.make").value("Toyota"));
    }

    @Test
    void shouldReturnConflictWhenVinIsDuplicate() throws Exception {
        when(vehicleService.createVehicle(any(VehicleRequest.class)))
                .thenThrow(new DuplicateVinException("Vehicle with VIN already exists"));

        mockMvc.perform(post("/api/vehicles")
                        .header("Authorization", "Bearer valid-jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "vin":"12345678901234567",
                                  "make":"Toyota",
                                  "model":"Camry",
                                  "year":2024,
                                  "price":35000.00,
                                  "status":"AVAILABLE"
                                }
                                """))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldReturnBadRequestWhenVinIsBlank() throws Exception {
        mockMvc.perform(post("/api/vehicles")
                        .header("Authorization", "Bearer valid-jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "vin":"",
                                  "make":"Toyota",
                                  "model":"Camry",
                                  "year":2024,
                                  "price":35000.00
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestWhenVinLengthIsInvalid() throws Exception {
        mockMvc.perform(post("/api/vehicles")
                        .header("Authorization", "Bearer valid-jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "vin":"12345",
                                  "make":"Toyota",
                                  "model":"Camry",
                                  "year":2024,
                                  "price":35000.00
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldGetVehicleByIdSuccessfully() throws Exception {
        VehicleResponse response = new VehicleResponse(
                1L,
                "12345678901234567",
                "Toyota",
                "Camry",
                2024,
                new BigDecimal("35000.00"),
                VehicleStatus.AVAILABLE
        );

        when(vehicleService.getVehicleById(1L))
                .thenReturn(response);

        mockMvc.perform(get("/api/vehicles/1")
                        .header("Authorization", "Bearer valid-jwt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.make").value("Toyota"));
    }

    @Test
    void shouldReturnNotFoundWhenVehicleDoesNotExist() throws Exception {
        when(vehicleService.getVehicleById(1L))
                .thenThrow(new VehicleNotFoundException("Vehicle not found"));

        mockMvc.perform(get("/api/vehicles/1")
                        .header("Authorization", "Bearer valid-jwt"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetAllVehiclesSuccessfully() throws Exception {
        VehicleResponse response1 = new VehicleResponse(1L, "VIN1", "Toyota", "Camry", 2024, new BigDecimal("35000.00"), VehicleStatus.AVAILABLE);
        VehicleResponse response2 = new VehicleResponse(2L, "VIN2", "Honda", "Civic", 2024, new BigDecimal("28000.00"), VehicleStatus.AVAILABLE);

        when(vehicleService.getAllVehicles())
                .thenReturn(List.of(response1, response2));

        mockMvc.perform(get("/api/vehicles")
                        .header("Authorization", "Bearer valid-jwt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[1].make").value("Honda"));
    }

    @Test
    void shouldUpdateVehicleSuccessfully() throws Exception {
        VehicleResponse response = new VehicleResponse(
                1L,
                "12345678901234567",
                "Toyota Updated",
                "Camry Updated",
                2025,
                new BigDecimal("38000.00"),
                VehicleStatus.SOLD
        );

        when(vehicleService.updateVehicle(eq(1L), any(VehicleRequest.class)))
                .thenReturn(response);

        mockMvc.perform(put("/api/vehicles/1")
                        .header("Authorization", "Bearer valid-jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "vin":"12345678901234567",
                                  "make":"Toyota Updated",
                                  "model":"Camry Updated",
                                  "year":2025,
                                  "price":38000.00,
                                  "status":"SOLD"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value("Toyota Updated"))
                .andExpect(jsonPath("$.status").value("SOLD"));
    }

    @Test
    void shouldDeleteVehicleSuccessfully() throws Exception {
        doNothing().when(vehicleService).deleteVehicle(1L);

        mockMvc.perform(delete("/api/vehicles/1")
                        .header("Authorization", "Bearer valid-jwt"))
                .andExpect(status().isNoContent());

        verify(vehicleService).deleteVehicle(1L);
    }

    @Test
    void shouldReturnForbiddenWhenNonAdminTriesToCreateVehicle() throws Exception {
        mockMvc.perform(post("/api/vehicles")
                        .header("Authorization", "Bearer user-jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "vin":"12345678901234567",
                                  "make":"Toyota",
                                  "model":"Camry",
                                  "year":2024,
                                  "price":35000.00,
                                  "status":"AVAILABLE"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnForbiddenWhenNonAdminTriesToUpdateVehicle() throws Exception {
        mockMvc.perform(put("/api/vehicles/1")
                        .header("Authorization", "Bearer user-jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "vin":"12345678901234567",
                                  "make":"Toyota Updated",
                                  "model":"Camry Updated",
                                  "year":2025,
                                  "price":38000.00,
                                  "status":"SOLD"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnForbiddenWhenNonAdminTriesToDeleteVehicle() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1")
                        .header("Authorization", "Bearer user-jwt"))
                .andExpect(status().isForbidden());
    }
}
