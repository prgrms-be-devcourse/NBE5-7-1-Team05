package io.pentacore.backend.product.dao;

import io.pentacore.backend.product.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
