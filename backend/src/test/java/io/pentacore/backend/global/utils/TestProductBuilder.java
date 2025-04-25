package io.pentacore.backend.global.utils;

import io.pentacore.backend.admin.domain.Admin;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.ProductRequestDto;

import java.util.Random;

public class TestProductBuilder {

    private static Integer sequence = 0;
    private static final Random random = new Random();

    public static Product build(Admin admin) {
        ++sequence;
        return Product.builder()
                .admin(admin)
                .name("EX-" + sequence)
                .price(1000 * random.nextInt(10))
                .imageUrl("IMAGE-" + sequence)
                .category("CAT-" + sequence)
                .stock(random.nextInt(100) + 1)
                .build();
    }

    public static ProductRequestDto buildDto() {
                return ProductRequestDto.builder()
                        .name("EX-" + sequence)
                        .price(1000 * random.nextInt(10))
                        .imageUrl("IMAGE-" + sequence)
                        .category("CAT-" + sequence)
                        .stock(random.nextInt(100) + 1)
                        .build();
    }
}
