package io.pentacore.backend.product.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "order_product")
public class OrderProduct {
    @Id
    @Column(name = "order_product_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderProductId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(columnDefinition = "INT UNSIGNED", nullable = false)
    private Integer quantity;

}
