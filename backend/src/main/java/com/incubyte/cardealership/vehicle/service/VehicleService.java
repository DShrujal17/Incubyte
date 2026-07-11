package com.incubyte.cardealership.vehicle.service;

import com.incubyte.cardealership.vehicle.dto.*;
import com.incubyte.cardealership.vehicle.entity.Vehicle;
import com.incubyte.cardealership.vehicle.entity.VehicleStatus;
import com.incubyte.cardealership.vehicle.exception.VehicleNotFoundException;
import com.incubyte.cardealership.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

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

        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle with id " + id + " not found"));
        return mapToResponse(vehicle);
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle with id " + id + " not found"));

        vehicle.setMake(request.make());
        vehicle.setModel(request.model());
        vehicle.setYear(request.year());
        vehicle.setPrice(request.price());
        if (request.status() != null) {
            vehicle.setStatus(request.status());
        }
        vehicle.setCategory(request.category());
        vehicle.setQuantity(request.quantity());

        Vehicle updated = vehicleRepository.save(vehicle);
        return mapToResponse(updated);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle with id " + id + " not found"));
        vehicleRepository.delete(vehicle);
    }

    public List<VehicleResponse> searchVehicles(String make, String model, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        Specification<Vehicle> spec = Specification.where((root, query, cb) -> cb.conjunction());
        if (make != null && !make.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("make")), "%" + make.toLowerCase() + "%"));
        }
        if (model != null && !model.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("model")), "%" + model.toLowerCase() + "%"));
        }
        if (category != null && !category.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("category")), "%" + category.toLowerCase() + "%"));
        }
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.ge(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.le(root.get("price"), maxPrice));
        }

        return vehicleRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
