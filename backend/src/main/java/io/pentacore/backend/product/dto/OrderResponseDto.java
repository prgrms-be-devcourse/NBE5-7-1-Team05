package io.pentacore.backend.product.dto;

import io.pentacore.backend.product.domain.Order;
import io.pentacore.backend.product.domain.OrderProduct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@RequiredArgsConstructor
public class OrderResponseDto {
    private final Long orderId;
    private final String email;
    private final String address;
    private final String postalCode;
    private final LocalDateTime orderedAt;
    private final Integer totalPrice;
    private final List<OrderProductDto> orderProducts;

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
