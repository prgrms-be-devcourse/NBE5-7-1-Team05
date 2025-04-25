package io.pentacore.backend.product.dao;

import io.pentacore.backend.product.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o " +
            "LEFT JOIN FETCH o.orderProducts op " +
            "LEFT JOIN FETCH op.product " +
            "WHERE o.email = :email")
    List<Order> findByEmailWithOrderProducts(@Param("email") String email);
}
