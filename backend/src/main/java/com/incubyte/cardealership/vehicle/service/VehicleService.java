package com.incubyte.cardealership.vehicle.service;

import com.incubyte.cardealership.vehicle.dto.*;
import com.incubyte.cardealership.vehicle.entity.Vehicle;
import com.incubyte.cardealership.vehicle.entity.VehicleStatus;
import com.incubyte.cardealership.vehicle.exception.OutOfStockException;
import com.incubyte.cardealership.vehicle.exception.VehicleNotFoundException;
import com.incubyte.cardealership.vehicle.repository.VehicleRepository;
import com.incubyte.cardealership.sale.entity.Sale;
import com.incubyte.cardealership.sale.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final SaleRepository saleRepository;

    public VehicleResponse createVehicle(VehicleRequest request) {
        VehicleStatus status = request.status() != null ? request.status() : VehicleStatus.AVAILABLE;

        Vehicle vehicle = Vehicle.builder()
                .make(request.make())
                .model(request.model())
                .year(request.year())
                .price(request.price())
                .status(status)
                .category(request.category())
                .quantity(request.quantity())
                .build();

        return mapToResponse(vehicleRepository.save(vehicle));
    }

    public VehicleResponse getVehicleById(Long id) {
        return mapToResponse(findOrThrow(id));
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = findOrThrow(id);

        vehicle.setMake(request.make());
        vehicle.setModel(request.model());
        vehicle.setYear(request.year());
        vehicle.setPrice(request.price());
        if (request.status() != null) {
            vehicle.setStatus(request.status());
        }
        vehicle.setCategory(request.category());
        vehicle.setQuantity(request.quantity());

        return mapToResponse(vehicleRepository.save(vehicle));
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.delete(findOrThrow(id));
    }

    public List<VehicleResponse> searchVehicles(String make, String model, String category,
                                                BigDecimal minPrice, BigDecimal maxPrice) {
        return vehicleRepository.findAll().stream()
                .filter(v -> make == null || make.isBlank()
                        || v.getMake().toLowerCase().contains(make.toLowerCase()))
                .filter(v -> model == null || model.isBlank()
                        || v.getModel().toLowerCase().contains(model.toLowerCase()))
                .filter(v -> category == null || category.isBlank()
                        || v.getCategory().toLowerCase().contains(category.toLowerCase()))
                .filter(v -> minPrice == null || v.getPrice().compareTo(minPrice) >= 0)
                .filter(v -> maxPrice == null || v.getPrice().compareTo(maxPrice) <= 0)
                .map(this::mapToResponse)
                .toList();
    }

    public VehicleResponse purchaseVehicle(Long id, String buyerEmail) {
        Vehicle vehicle = findOrThrow(id);

        if (vehicle.getQuantity() <= 0) {
            throw new OutOfStockException("Vehicle with id " + id + " is out of stock");
        }

        vehicle.setQuantity(vehicle.getQuantity() - 1);
        if (vehicle.getQuantity() == 0) {
            vehicle.setStatus(VehicleStatus.SOLD);
        }

        VehicleResponse saved = mapToResponse(vehicleRepository.save(vehicle));

        saleRepository.save(Sale.builder()
                .buyerEmail(buyerEmail)
                .vehicleMake(vehicle.getMake())
                .vehicleModel(vehicle.getModel())
                .vehicleYear(vehicle.getYear())
                .purchasePrice(vehicle.getPrice())
                .purchasedAt(LocalDateTime.now())
                .build());

        return saved;
    }

    public VehicleResponse restockVehicle(Long id, Integer quantity) {
        Vehicle vehicle = findOrThrow(id);

        vehicle.setQuantity(vehicle.getQuantity() + quantity);
        if (vehicle.getQuantity() > 0 && vehicle.getStatus() == VehicleStatus.SOLD) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }

        return mapToResponse(vehicleRepository.save(vehicle));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private Vehicle findOrThrow(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle with id " + id + " not found"));
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getPrice(),
                vehicle.getStatus(),
                vehicle.getCategory(),
                vehicle.getQuantity()
        );
    }
}
