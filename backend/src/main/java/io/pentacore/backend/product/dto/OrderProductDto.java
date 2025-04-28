package io.pentacore.backend.product.dto;

import io.pentacore.backend.product.domain.OrderProduct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class OrderProductDto {
    private final Long orderProductId;
    private final Long productId;
    private final String productName;
    private final Integer price;
    private final Integer quantity;
    private final Boolean isDeleted;

    public static OrderProductDto from(OrderProduct orderProduct) {
        return new OrderProductDto(
                orderProduct.getOrderProductId(),
                orderProduct.getProduct().getId(),
                orderProduct.getProduct().getName(),
                orderProduct.getProduct().getPrice(),
                orderProduct.getQuantity(),
                orderProduct.getProduct().isDeleted()
        );
    }
}
