package io.pentacore.backend.product.dao;

import io.pentacore.backend.product.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository <Product, Long> {
}

