package com.incubyte.cardealership.sale.controller;

import com.incubyte.cardealership.sale.dto.SaleResponse;
import com.incubyte.cardealership.sale.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    // Any authenticated user — returns only their own purchases
    @GetMapping("/my")
    public ResponseEntity<List<SaleResponse>> getMySales(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(saleService.getSalesForUser(email));
    }

    // ADMIN only — returns all purchases from all users
    @GetMapping
    public ResponseEntity<List<SaleResponse>> getAllSales() {
        return ResponseEntity.ok(saleService.getAllSales());
    }
}
