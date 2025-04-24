package io.pentacore.backend.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PaymentRequestDto {

    @NotBlank(message = "이메일은 필수입니다.")
    private String email;

    @NotBlank(message = "주소는 필수입니다.")
    private String address;

    @NotBlank(message = "우편번호는 필수입니다.")
    private String postalCode;

    @NotNull(message = "총 구매 금액은 필수입니다.")
    @Min(value = 0, message = "총 구매 금액은 0원 이상이어야 합니다.")
    private Integer totalPrice;

    @NotEmpty(message = "주문 상품 내역은 필수입니다.")
    private List<ProductDto> products;

}
