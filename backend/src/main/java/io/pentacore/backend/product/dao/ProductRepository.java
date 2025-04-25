package io.pentacore.backend.product.dao;

import io.pentacore.backend.product.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface ProductRepository extends JpaRepository <Product, Long> {

    @Modifying
    @Query("DELETE FROM Product p WHERE p.isDeleted = true AND p.deletedAt <= :expiredDate")
    void deleteOldSoftDeletedRecords(@Param("expiredDate") LocalDateTime expiredDate);
}

