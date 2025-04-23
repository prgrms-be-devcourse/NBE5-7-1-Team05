package io.pentacore.backend.product.dao;

import io.pentacore.backend.product.domain.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {
}
