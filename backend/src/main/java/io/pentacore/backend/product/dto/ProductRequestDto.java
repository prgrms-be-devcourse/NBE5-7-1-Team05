package io.pentacore.backend.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductRequestDto {
    @NotBlank(message = "상품명은 필수입니다.")
    private String name;

    @NotBlank(message = "카테고리는 필수입니다.")
    private String category;

    @NotNull
    @Min(value=0, message = "가격은 0원 이상이어야 합니다.")
    private Integer price;

    @NotBlank(message = "이미지 URL은 필수입니다.")
    private String imageUrl;

    @NotNull(message = "재고는 필수입니다.")
    @Min(value=0, message = "재고는 0개 이상이어야 합니다.")
    private Integer stock;

    @Builder
    public ProductRequestDto(String name, String category, Integer price, String imageUrl, Integer stock) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.imageUrl = imageUrl;
        this.stock = stock;
    }
}
