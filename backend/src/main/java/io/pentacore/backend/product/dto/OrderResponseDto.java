package io.pentacore.backend.product.dto;

import io.pentacore.backend.product.domain.Order;
import io.pentacore.backend.product.domain.OrderProduct;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
public class OrderResponseDto {
    private Long orderId;
    private String email;
    private String address;
    private String postalCode;
    private LocalDateTime orderedAt = LocalDateTime.now();
    private Integer totalPrice;
    private List<OrderProductDto> orderProducts;

    private OrderResponseDto(Long orderId, String email, String address, String postalCode, LocalDateTime orderedAt,
                            Integer totalPrice, List<OrderProductDto> orderProducts) {
        this.orderId = orderId;
        this.email = email;
        this.address = address;
        this.postalCode = postalCode;
        this.orderedAt = orderedAt;
        this.totalPrice = totalPrice;
        this.orderProducts = orderProducts;
    }

    public static OrderResponseDto from(Order order) {
        List<OrderProductDto> orderProductDtos = new ArrayList<>();
        for (OrderProduct orderProduct : order.getOrderProducts()) {
            orderProductDtos.add(OrderProductDto.from(orderProduct));
        }

        return new OrderResponseDto(
                order.getOrderId(),
                order.getEmail(),
                order.getAddress(),
                order.getPostalCode(),
                order.getOrderedAt(),
                order.getTotalPrice(),
                orderProductDtos
        );
    }
}
