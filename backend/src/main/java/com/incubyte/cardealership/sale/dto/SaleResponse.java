package com.incubyte.cardealership.sale.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SaleResponse(
        Long id,
        String buyerEmail,
        String vehicleMake,
        String vehicleModel,
        Integer vehicleYear,
        BigDecimal purchasePrice,
        LocalDateTime purchasedAt
) {}
