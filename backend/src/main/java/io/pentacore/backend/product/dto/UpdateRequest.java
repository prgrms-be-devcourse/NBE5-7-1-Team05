package io.pentacore.backend.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRequest {

    @NotNull(message = "재고 변화량 입력은 필수입니다.")
    private Integer stock;

}
