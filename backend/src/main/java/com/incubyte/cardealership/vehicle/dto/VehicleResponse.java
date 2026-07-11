package com.incubyte.cardealership.vehicle.dto;

import com.incubyte.cardealership.vehicle.entity.VehicleStatus;

import java.math.BigDecimal;

public record VehicleResponse(
        Long id,
        String vin,
        String make,
        String model,
        Integer year,
        BigDecimal price,
        VehicleStatus status
) {}
