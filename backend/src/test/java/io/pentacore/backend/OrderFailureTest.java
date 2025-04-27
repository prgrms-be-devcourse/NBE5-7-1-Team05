package io.pentacore.backend;

import io.pentacore.backend.global.template.MockMvcTestBase;
import io.pentacore.backend.global.template.UserMockMvcTestBase;
import io.pentacore.backend.global.utils.TestProductBuilder;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.PaymentRequestDto;
import io.pentacore.backend.product.dto.ProductDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
public class OrderFailureTest extends UserMockMvcTestBase {

    @Test
    @DisplayName("재고보다 많은 수량 주문 시 400 에러")
    void payMoreThanStock() throws Exception {
        // given
        Product savedProduct = productRepository.save(TestProductBuilder.build(admin));
        int orderQuantity = savedProduct.getStock() + 1;

        PaymentRequestDto paymentRequestDto = new PaymentRequestDto();
        paymentRequestDto.setAddress("ADDR");
        paymentRequestDto.setEmail("test@gmail.com");
        paymentRequestDto.setPostalCode(Integer.toString(10000 + random.nextInt(50000)));
        paymentRequestDto.setTotalPrice(savedProduct.getPrice() * orderQuantity);

        ProductDto productDto = new ProductDto();
        productDto.setProductId(savedProduct.getId());
        productDto.setQuantity(orderQuantity);
        paymentRequestDto.setProducts(List.of(productDto));
                
        // when
        ResultActions resultActions = mockPerformPayment(paymentRequestDto);

        // then
        resultActions.andExpect(status().isBadRequest());

    }
    
    @Test
    @DisplayName("존재하지 않는 상품 주문 시 404 에러")
    void payNullProduct() throws Exception {
        // given
        int orderQuantity = random.nextInt(100) + 1;
        int orderPrice = random.nextInt(1000);

        PaymentRequestDto paymentRequestDto = new PaymentRequestDto();
        paymentRequestDto.setAddress("ADDR");
        paymentRequestDto.setEmail("test@gmail.com");
        paymentRequestDto.setPostalCode(Integer.toString(10000 + random.nextInt(50000)));
        paymentRequestDto.setTotalPrice(orderPrice * orderQuantity);

        ProductDto productDto = new ProductDto();
        productDto.setProductId(random.nextLong(100));
        productDto.setQuantity(orderQuantity);
        paymentRequestDto.setProducts(List.of(productDto));

        // when
        ResultActions resultActions = mockPerformPayment(paymentRequestDto);

        // then
        resultActions.andExpect(status().isNotFound());
        
    }

    @Test
    @DisplayName("존재하지 않는 주문 취소 시 404 에러")
    void deleteRequestToNullOrder() throws Exception {
        // given
        long orderId = random.nextLong();
                
        // when & then
        mockMvc.perform(
                delete("/orders/" + orderId)
        ).andExpect(status().isNotFound());

    }

    @Test
    @DisplayName("주어진 이메일로 주문된 내역이 존재하지 않을 경우 404 에러")
    void getRequestToNullOrder() throws Exception {
        // given
        String email = "test@gmail.com";

        // when & then
        mockMvc.perform(
                get("/orders?email=" + email)
        ).andExpect(status().isNotFound());

    }

    private ResultActions mockPerformPayment(PaymentRequestDto paymentRequestDto) throws Exception {
        return mockMvc.perform(
                post("/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentRequestDto))
        );
    }
}
