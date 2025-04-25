package io.pentacore.backend;

import io.pentacore.backend.admin.domain.Admin;
import io.pentacore.backend.product.domain.Order;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.PaymentRequestDto;
import io.pentacore.backend.product.dto.ProductDto;
import io.pentacore.backend.global.utils.TestPaymentDtoBuilder;
import io.pentacore.backend.global.utils.TestProductBuilder;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
public class OrderCRUDTest extends MockMvcTestBase {

    private static final Random random = new Random();
    private Admin admin;

    @BeforeEach
    void setUp() {
        admin = adminRepository.findById(1L).get();
    }

    @Test
    @DisplayName("단일 상품에 대한 주문 결제")
    void paymentSingleProduct() throws Exception {
        // given
        Product savedProduct = productRepository.save(TestProductBuilder.build(admin));
        PaymentRequestDto paymentRequestDto = TestPaymentDtoBuilder.build(List.of(savedProduct));

        // when
        mockPerformPayment(paymentRequestDto);

        // then
        ProductDto productDto = paymentRequestDto.getProducts().getFirst();
        Optional<Product> findProductOptional = productRepository.findById(productDto.getProductId());

        assertThat(findProductOptional.isPresent()).isTrue();

        Product findProduct = findProductOptional.get();
        assertThat(findProduct.getStock()).isGreaterThanOrEqualTo(0);
        assertThat(findProduct).isEqualTo(savedProduct);
    }

    @Test
    @DisplayName("여러 개의 상품에 대한 주문 결제")
    void paymentMultiProducts() throws Exception {
        // given
        int testSize = random.nextInt(10) + 1;
        List<Product> products = new ArrayList<>();
        for (int i = 0; i < testSize; ++i) {
            products.add(productRepository.save(TestProductBuilder.build(admin)));
        }
        PaymentRequestDto paymentRequestDto = TestPaymentDtoBuilder.build(products);

        // when
        mockPerformPayment(paymentRequestDto);

        // then
        orderRepository.findAll().forEach(order -> {
            assertThat(order.getAddress()).isEqualTo(paymentRequestDto.getAddress());
            assertThat(order.getEmail()).isEqualTo(paymentRequestDto.getEmail());
            assertThat(order.getPostalCode()).isEqualTo(paymentRequestDto.getPostalCode());

            order.getOrderProducts().forEach(orderProduct -> {
                Optional<Product> findProductOptional =
                        productRepository.findById(orderProduct.getProduct().getId());
                assertThat(findProductOptional.isPresent()).isTrue();

                Product findProduct = findProductOptional.get();
                assertThat(findProduct).isIn(products);
            });
        });
    }

    @Test
    @DisplayName("주문 조회")
    void findOrder() throws Exception {
        // given
        Product savedProduct = productRepository.save(TestProductBuilder.build(admin));
        PaymentRequestDto paymentRequestDto = TestPaymentDtoBuilder.build(List.of(savedProduct));

        // when
        mockPerformPayment(paymentRequestDto);

        // then
        Order order = orderRepository.findAll().getFirst();
        mockMvc.perform(
                get("/orders?email=" + paymentRequestDto.getEmail())
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].order_id").value(order.getOrderId()))
        .andExpect(jsonPath("$.data[0].address").value(order.getAddress()))
        .andExpect(jsonPath("$.data[0].email").value(order.getEmail()))
        .andExpect(jsonPath("$.data[0].postal_code").value(order.getPostalCode()))
        .andExpect(jsonPath("$.data[0].order_products[0].product_id").value(savedProduct.getId()))
        .andExpect(jsonPath("$.data[0].order_products[0].product_name").value(savedProduct.getName()))
        .andExpect(jsonPath("$.data[0].order_products[0].price").value(savedProduct.getPrice()));

    }
    
    @Test
    @DisplayName("주문 취소")
    void deleteOrder() throws Exception {
        // given
        Product savedProduct = productRepository.save(TestProductBuilder.build(admin));
        PaymentRequestDto paymentRequestDto = TestPaymentDtoBuilder.build(List.of(savedProduct));

        // when
        mockPerformPayment(paymentRequestDto);

        Order order = orderRepository.findAll().getFirst();

        mockMvc.perform(
                delete("/orders/" + order.getOrderId())
        ).andExpect(status().isOk());

        // then
        assertThat(orderRepository.findById(order.getOrderId())).isEmpty();
        assertThat(orderProductRepository.findAll()).isEmpty();
    }

    private void mockPerformPayment(PaymentRequestDto paymentRequestDto) throws Exception {
        mockMvc.perform(
                post("/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentRequestDto))
        ).andExpect(status().isCreated());
    }
}
