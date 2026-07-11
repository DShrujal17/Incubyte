package com.incubyte.cardealership.sale.repository;

import com.incubyte.cardealership.sale.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByBuyerEmail(String buyerEmail);
}
