package io.pentacore.backend;

import io.pentacore.backend.admin.domain.Admin;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.ProductRequestDto;
import io.pentacore.backend.product.dto.UpdateRequest;
import io.pentacore.backend.global.utils.TestProductBuilder;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
class ProductCRUDTest extends MockMvcTestBase{

    private Admin admin;
    private final Random random = new Random();

    @BeforeEach
    void setUp() {
        admin = adminRepository.findAll().getFirst();
    }

    @Test
    @DisplayName("상품 추가")
    void addProduct() throws Exception {
        // given
        ProductRequestDto productRequestDto = TestProductBuilder.buildDto();
        String productRequestDtoJson = objectMapper.writeValueAsString(productRequestDto);

        // when
        mockMvc.perform(
                    post("/admin/products")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(productRequestDtoJson)
        ).andExpect(status().isCreated());

        // then
        assertThat(productRepository.findAll().size()).isEqualTo(1);

        productRepository.findAll().forEach(product -> {
            assertThat(product.getName()).isEqualTo(productRequestDto.getName());
            assertThat(product.getPrice()).isEqualTo(productRequestDto.getPrice());
            assertThat(product.getImageUrl()).isEqualTo(productRequestDto.getImageUrl());
            assertThat(product.getCategory()).isEqualTo(productRequestDto.getCategory());
            assertThat(product.getStock()).isEqualTo(productRequestDto.getStock());
        });
    }

    @Test
    @DisplayName("상품 정보 수정")
    void updateProduct() throws Exception {
        // given
        Product savedProduct = productRepository.save(TestProductBuilder.build(admin));
        Integer beforeStock = savedProduct.getStock();
        int deltaStock = random.nextInt(1000);
        String updateRequestJson = objectMapper.writeValueAsString(new UpdateRequest(deltaStock));

        // when
        mockMvc.perform(
                put("/admin/products/" + savedProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequestJson)
        ).andExpect(status().isOk());

        // then
        productRepository.findById(savedProduct.getId())
                .ifPresent(product -> {
                    assertThat(product.getStock()).isEqualTo(beforeStock + deltaStock);
                });
    }

    @Test
    @DisplayName("상품 목록 전체 조회")
    void findAllProducts() throws Exception {
        // given
        int testSize = random.nextInt(100);
        List<Product> products = new ArrayList<>();
        for (int i = 0; i < testSize; i++) {
            products.add(productRepository.save(TestProductBuilder.build(admin)));
        }

        // when
        mockMvc.perform(
                get("/products")
        ).andExpect(status().isOk());

        // then
        List<Product> findProducts = productRepository.findAll();
        assertThat(findProducts).hasSize(testSize);
        assertThat(findProducts).isEqualTo(products);
    }

    @Test
    @DisplayName("상품 삭제")
    void deleteProduct() throws Exception {
        // given
        Product savedProduct = productRepository.save(TestProductBuilder.build(admin));

        // when
        mockMvc.perform(
                delete("/admin/products/" + savedProduct.getId())
        ).andExpect(status().isOk());

        // then
        productRepository.findById(savedProduct.getId()).ifPresent(product -> {
            assertThat(product.isDeleted()).isTrue();
        });
    }

}
