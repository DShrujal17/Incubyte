package com.incubyte.cardealership.sale.service;

import com.incubyte.cardealership.sale.dto.SaleResponse;
import com.incubyte.cardealership.sale.entity.Sale;
import com.incubyte.cardealership.sale.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;

    public List<SaleResponse> getSalesForUser(String email) {
        return saleRepository.findByBuyerEmail(email).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SaleResponse> getAllSales() {
        return saleRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private SaleResponse mapToResponse(Sale sale) {
        return new SaleResponse(
                sale.getId(),
                sale.getBuyerEmail(),
                sale.getVehicleMake(),
                sale.getVehicleModel(),
                sale.getVehicleYear(),
                sale.getPurchasePrice(),
                sale.getPurchasedAt()
        );
    }
}
