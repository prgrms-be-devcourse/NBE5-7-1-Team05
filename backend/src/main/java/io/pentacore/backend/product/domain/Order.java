package io.pentacore.backend.product.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(length = 40, nullable = false)
    private String email;

    @Column(length = 50, nullable = false)
    private String address;

    @Column(name = "postal_code", length = 5, nullable = false)
    private String postalCode;

    @Column(name = "ordered_at", nullable = false)
    private LocalDateTime orderedAt;

    @Column(name = "total_price", nullable = false, columnDefinition = "INT UNSIGNED")
    private Integer totalPrice;

    // OrderProduct는 나중에 추가
//    @OneToMany(mappedBy = "order")
//    private List<OrderProduct> orderProductList = new ArrayList<>();
}
