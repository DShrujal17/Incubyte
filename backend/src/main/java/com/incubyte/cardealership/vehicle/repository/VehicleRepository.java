package com.incubyte.cardealership.vehicle.repository;

import com.incubyte.cardealership.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
