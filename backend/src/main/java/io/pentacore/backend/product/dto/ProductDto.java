package io.pentacore.backend.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    @NotNull(message = "상품 수량은 필수입니다.")
    @Min(value = 1, message = "상품은 한 개 이상 주문해야 합니다.")
    private Integer quantity;
}
