package io.pentacore.backend.global.utils;

import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.PaymentRequestDto;
import io.pentacore.backend.product.dto.ProductDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class TestPaymentDtoBuilder {

    private static Integer sequence = 0;
    private static final Random random = new Random();

    public static PaymentRequestDto build(List<Product> products) {
        ++sequence;

        List<ProductDto> productDtoList = new ArrayList<>();

        String email = "test" + sequence + "@gmail.com";
        String address = "ADDR-" + sequence;
        String postalCode = Integer.toString(10000 + random.nextInt(50000));
        int totalPrice = 0;

        for (Product product : products) {
            ProductDto productDto = new ProductDto(
                    product.getId(),
                    product.getStock() - random.nextInt(product.getStock())
            );
            productDtoList.add(productDto);
            totalPrice += product.getPrice() * productDto.getQuantity();
        }

        return new PaymentRequestDto(
                email,
                address,
                postalCode,
                totalPrice,
                productDtoList
        );
    }
}
