package io.pentacore.backend.product.dto;

import io.pentacore.backend.product.domain.Product;
import lombok.Getter;

@Getter
public class ProductResponseDto {
    private Long id;
    private String name;
    private String category;
    private Integer price;
    private String imageUrl;
    private Integer stock;

    public ProductResponseDto(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.category = product.getCategory();
        this.price = product.getPrice();
        this.imageUrl = product.getImageUrl();
        this.stock = product.getStock();
    }
}