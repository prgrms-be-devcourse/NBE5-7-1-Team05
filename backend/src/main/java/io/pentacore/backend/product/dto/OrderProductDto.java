package io.pentacore.backend.product.dto;

import io.pentacore.backend.product.domain.OrderProduct;
import lombok.Getter;

@Getter
public class OrderProductDto {
    private Long orderProductId;
    private Long productId;
    private String productName;
    private Integer price;
    private Integer quantity;

    private OrderProductDto(Long orderProductId, Long productId, String productName, Integer price, Integer quantity) {
        this.orderProductId = orderProductId;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    public static OrderProductDto from(OrderProduct orderProduct) {
        return new OrderProductDto(
                orderProduct.getOrderProductId(),
                orderProduct.getProduct().getId(),
                orderProduct.getProduct().getName(),
                orderProduct.getProduct().getPrice(),
                orderProduct.getQuantity()
        );
    }
}
