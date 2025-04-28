package io.pentacore.backend;

import io.pentacore.backend.admin.domain.Admin;
import io.pentacore.backend.global.template.AdminAuthRequiredMockMvcTestBase;
import io.pentacore.backend.global.template.MockMvcTestBase;
import io.pentacore.backend.global.utils.TestProductBuilder;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.ProductRequestDto;
import io.pentacore.backend.product.dto.UpdateRequest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Optional;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
public class ProductFailureTest extends AdminAuthRequiredMockMvcTestBase {

    @Test
    @DisplayName("저장할 상품에 대한 필수 값이 결여된 상태로 Request가 도착할 경우 400 에러")
    void saveProductDtoNullValue() throws Exception {
        // given
        String productRequestDtoJson = objectMapper.writeValueAsString(
                ProductRequestDto.builder()
                        .name("NULL_PRODUCT")
                        .price(10000)
                        .build()
        );

        // when & then
        mockMvc.perform(
                post("/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productRequestDtoJson)
                        .header("Authorization", authorizationHeader)
                        .header("Refresh", refreshToken)
        ).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("상품의 재고보다 더 많은 재고를 감소시키면 상품의 재고를 0으로 설정")
    void updateStockToBeMinusValue() throws Exception {
        // given
        Product savedProduct = productRepository.save(TestProductBuilder.build(admin));
        int deltaStock = (savedProduct.getStock() + 1) * -1;
        String updateRequestJson = objectMapper.writeValueAsString(
                new UpdateRequest(deltaStock)
        );

        // when
        mockMvc.perform(
                put("/admin/products/" + savedProduct.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequestJson)
                        .header("Authorization", authorizationHeader)
                        .header("Refresh", refreshToken)
        ).andExpect(status().isOk());

        // then
        Optional<Product> findProductOptional = productRepository.findById(savedProduct.getId());
        assertThat(findProductOptional.isPresent()).isTrue();
        assertThat(findProductOptional.get().getStock()).isEqualTo(0);
    }

    @Test
    @DisplayName("수정할 상품이 없을 경우 404 에러")
    void putRequestToNullProduct() throws Exception {
        // given
        String updateRequestJson = objectMapper.writeValueAsString(
                new UpdateRequest(random.nextInt(100))
        );

        // when & then
        mockMvc.perform(
                put("/admin/products/" + random.nextInt(100))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequestJson)
                        .header("Authorization", authorizationHeader)
                        .header("Refresh", refreshToken)
        ).andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("삭제할 상품이 없을 경우 404 에러")
    void deleteRequestToNullProduct() throws Exception {
        // given
        int productId = random.nextInt(100);

        // when & then
        mockMvc.perform(
                delete("/admin/products/" + productId)
                        .header("Authorization", authorizationHeader)
                        .header("Refresh", refreshToken)
        ).andExpect(status().isNotFound());
    }
}
