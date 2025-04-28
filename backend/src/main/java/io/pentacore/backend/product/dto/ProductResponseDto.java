package io.pentacore.backend.product.dto;

import io.pentacore.backend.product.domain.Product;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ProductResponseDto {
    private final Long id;
    private final String name;
    private final String category;
    private final Integer price;
    private final String imageUrl;
    private final Integer stock;

    public ProductResponseDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.category = product.getCategory();
        this.price = product.getPrice();
        this.imageUrl = product.getImageUrl();
        this.stock = product.getStock();
    }
}