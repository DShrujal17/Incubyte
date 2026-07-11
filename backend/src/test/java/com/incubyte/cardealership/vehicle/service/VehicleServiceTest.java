package com.incubyte.cardealership.vehicle.service;

import com.incubyte.cardealership.vehicle.dto.*;
import com.incubyte.cardealership.vehicle.entity.Vehicle;
import com.incubyte.cardealership.vehicle.entity.VehicleStatus;
import com.incubyte.cardealership.vehicle.exception.VehicleNotFoundException;
import com.incubyte.cardealership.vehicle.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    void shouldCreateVehicleSuccessfully() {
        VehicleRequest request = new VehicleRequest(
                "Toyota",
                "Camry",
                2024,
                new BigDecimal("35000.00"),
                VehicleStatus.AVAILABLE,
                "Sedan",
                5
        );

        when(vehicleRepository.save(any(Vehicle.class)))
                .thenAnswer(invocation -> {
                    Vehicle v = invocation.getArgument(0);
                    return Vehicle.builder()
                            .id(1L)
                            .make(v.getMake())
                            .model(v.getModel())
                            .year(v.getYear())
                            .price(v.getPrice())
                            .status(v.getStatus())
                            .category(v.getCategory())
                            .quantity(v.getQuantity())
                            .build();
                });

        VehicleResponse response = vehicleService.createVehicle(request);

        assertNotNull(response.id());
        assertEquals("Toyota", response.make());
        assertEquals("Camry", response.model());
        assertEquals(2024, response.year());
        assertEquals(new BigDecimal("35000.00"), response.price());
        assertEquals(VehicleStatus.AVAILABLE, response.status());
        assertEquals("Sedan", response.category());
        assertEquals(5, response.quantity());

        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void shouldGetVehicleByIdSuccessfully() {
        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .year(2024)
                .price(new BigDecimal("35000.00"))
                .status(VehicleStatus.AVAILABLE)
                .category("Sedan")
                .quantity(5)
                .build();

        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(vehicle));

        VehicleResponse response = vehicleService.getVehicleById(1L);

        assertEquals(1L, response.id());
        assertEquals("Toyota", response.make());
        assertEquals("Sedan", response.category());
        assertEquals(5, response.quantity());
    }

    @Test
    void shouldThrowVehicleNotFoundExceptionWhenIdDoesNotExist() {
        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(VehicleNotFoundException.class, () -> vehicleService.getVehicleById(1L));
    }

    @Test
    void shouldGetAllVehiclesSuccessfully() {
        Vehicle vehicle1 = Vehicle.builder().id(1L).make("Toyota").category("Sedan").quantity(5).build();
        Vehicle vehicle2 = Vehicle.builder().id(2L).make("Honda").category("SUV").quantity(2).build();

        when(vehicleRepository.findAll())
                .thenReturn(List.of(vehicle1, vehicle2));

        List<VehicleResponse> responses = vehicleService.getAllVehicles();

        assertEquals(2, responses.size());
        assertEquals("Toyota", responses.get(0).make());
        assertEquals("Honda", responses.get(1).make());
    }

    @Test
    void shouldUpdateVehicleSuccessfully() {
        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .year(2024)
                .price(new BigDecimal("35000.00"))
                .status(VehicleStatus.AVAILABLE)
                .category("Sedan")
                .quantity(5)
                .build();

        VehicleRequest updateRequest = new VehicleRequest(
                "Toyota Updated",
                "Camry Updated",
                2025,
                new BigDecimal("38000.00"),
                VehicleStatus.SOLD,
                "Sedan",
                10
        );

        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(vehicle));

        when(vehicleRepository.save(any(Vehicle.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        VehicleResponse response = vehicleService.updateVehicle(1L, updateRequest);

        assertEquals("Toyota Updated", response.make());
        assertEquals("Camry Updated", response.model());
        assertEquals(2025, response.year());
        assertEquals(new BigDecimal("38000.00"), response.price());
        assertEquals(VehicleStatus.SOLD, response.status());
        assertEquals("Sedan", response.category());
        assertEquals(10, response.quantity());
    }

    @Test
    void shouldDeleteVehicleSuccessfully() {
        Vehicle vehicle = Vehicle.builder().id(1L).build();

        when(vehicleRepository.findById(1L))
                .thenReturn(Optional.of(vehicle));

        vehicleService.deleteVehicle(1L);

        verify(vehicleRepository).delete(vehicle);
    }
}
