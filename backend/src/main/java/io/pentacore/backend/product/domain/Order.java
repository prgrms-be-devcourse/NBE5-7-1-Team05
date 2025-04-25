package io.pentacore.backend.product.domain;

import io.pentacore.backend.product.dto.PaymentRequestDto;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderProduct> orderProducts = new ArrayList<>();

    public static Order from (PaymentRequestDto request) {
        Order order = new Order();
        order.email = request.getEmail();
        order.address = request.getAddress();
        order.postalCode = request.getPostalCode();
        order.totalPrice = request.getTotalPrice();
        order.orderedAt = LocalDateTime.now();
        return order;
    }
}