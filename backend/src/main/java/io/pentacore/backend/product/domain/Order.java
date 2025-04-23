package io.pentacore.backend.product.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @Column(name = "order_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(length = 40, nullable = false)
    private String email;

    @Column(length = 50, nullable = false)
    private String address;

    @Column(name = "postal_code", length = 5, nullable = false)
    private String postalCode;

    @Column(name = "ordered_at", nullable = false)
    private LocalDateTime orderedAt = LocalDateTime.now();

    @Column(name = "total_price", nullable = false, columnDefinition = "INT UNSIGNED")
    private Integer totalPrice;

//    상품 목록 생기면 작성
//    @OneToMany(mappedBy = "order")
//    private List<OrderProduct> orderProducts = new ArrayList<>();
}