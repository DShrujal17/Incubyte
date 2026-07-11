package com.incubyte.cardealership.sale.service;

import com.incubyte.cardealership.sale.dto.SaleResponse;
import com.incubyte.cardealership.sale.entity.Sale;
import com.incubyte.cardealership.sale.repository.SaleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @InjectMocks
    private SaleService saleService;

    @Test
    void shouldReturnSalesForSpecificBuyer() {
        Sale sale = Sale.builder()
                .id(1L)
                .buyerEmail("user@test.com")
                .vehicleMake("Toyota")
                .vehicleModel("Camry")
                .vehicleYear(2024)
                .purchasePrice(new BigDecimal("35000.00"))
                .purchasedAt(LocalDateTime.now())
                .build();

        when(saleRepository.findByBuyerEmail("user@test.com")).thenReturn(List.of(sale));

        List<SaleResponse> result = saleService.getSalesForUser("user@test.com");

        assertEquals(1, result.size());
        assertEquals("Toyota", result.get(0).vehicleMake());
        assertEquals("user@test.com", result.get(0).buyerEmail());
        verify(saleRepository).findByBuyerEmail("user@test.com");
    }

    @Test
    void shouldReturnAllSalesForAdmin() {
        Sale sale1 = Sale.builder()
                .id(1L).buyerEmail("user1@test.com").vehicleMake("Toyota")
                .vehicleModel("Camry").vehicleYear(2024)
                .purchasePrice(new BigDecimal("35000.00")).purchasedAt(LocalDateTime.now()).build();

        Sale sale2 = Sale.builder()
                .id(2L).buyerEmail("user2@test.com").vehicleMake("Honda")
                .vehicleModel("Civic").vehicleYear(2023)
                .purchasePrice(new BigDecimal("28000.00")).purchasedAt(LocalDateTime.now()).build();

        when(saleRepository.findAll()).thenReturn(List.of(sale1, sale2));

        List<SaleResponse> result = saleService.getAllSales();

        assertEquals(2, result.size());
        verify(saleRepository).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenUserHasNoPurchases() {
        when(saleRepository.findByBuyerEmail("nobody@test.com")).thenReturn(List.of());

        List<SaleResponse> result = saleService.getSalesForUser("nobody@test.com");

        assertTrue(result.isEmpty());
    }
}
