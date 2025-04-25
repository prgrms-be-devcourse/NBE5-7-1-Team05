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
        PaymentRequestDto paymentRequestDto = new PaymentRequestDto();
        paymentRequestDto.setAddress("ADDR-" + sequence);
        paymentRequestDto.setEmail("test" + sequence + "@gmail.com");
        paymentRequestDto.setPostalCode(Integer.toString(10000 + random.nextInt(50000)));
        paymentRequestDto.setTotalPrice(0);

        List<ProductDto> productDtoList = new ArrayList<>();
        products.forEach(product -> {
            ProductDto productDto = new ProductDto();
            productDto.setProductId(product.getId());
            productDto.setQuantity(product.getStock() - random.nextInt(product.getStock()));
            productDtoList.add(productDto);
            paymentRequestDto.setTotalPrice(
                    paymentRequestDto.getTotalPrice() + product.getPrice() * productDto.getQuantity()
            );
        });
        paymentRequestDto.setProducts(productDtoList);

        return paymentRequestDto;
    }
}
