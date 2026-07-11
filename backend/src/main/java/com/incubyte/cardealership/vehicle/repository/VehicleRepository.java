package com.incubyte.cardealership.vehicle.repository;

import com.incubyte.cardealership.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
