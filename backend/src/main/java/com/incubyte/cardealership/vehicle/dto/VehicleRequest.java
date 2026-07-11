package com.incubyte.cardealership.vehicle.dto;

import com.incubyte.cardealership.vehicle.entity.VehicleStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record VehicleRequest(
        @NotBlank(message = "Make is required")
        String make,

        @NotBlank(message = "Model is required")
        String model,

        @NotNull(message = "Year is required")
        @Min(value = 1886, message = "Year must be valid")
        Integer year,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        BigDecimal price,

        VehicleStatus status
) {}
