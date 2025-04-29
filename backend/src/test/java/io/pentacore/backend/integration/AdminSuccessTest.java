package io.pentacore.backend.integration;

import com.fasterxml.jackson.core.type.TypeReference;
import io.pentacore.backend.global.template.AdminAuthRequiredMockMvcTestBase;
import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.global.utils.TestPaymentDtoBuilder;
import io.pentacore.backend.global.utils.TestProductBuilder;
import io.pentacore.backend.product.domain.Product;
import io.pentacore.backend.product.dto.OrderResponseDto;
import io.pentacore.backend.product.dto.PaymentRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
public class AdminSuccessTest extends AdminAuthRequiredMockMvcTestBase {
    @Test
    @DisplayName("모든 주문 조회")
    void findAllOrders() throws Exception {
        // given
        int testSize = random.nextInt(10) + 1;
        for (int i = 0; i < testSize; i++) {
            Product savedProduct = productRepository.save(TestProductBuilder.build(admin));
            mockPerformPayment(TestPaymentDtoBuilder.build(List.of(savedProduct)));
        }

        // when
        MvcResult mvcResult = mockMvc.perform(
                get("/admin/orders")
                        .header("Authorization", authorizationHeader)
                        .header("Refresh", refreshToken)
        ).andExpect(status().isOk()).andReturn();

        // then
        String responseJson = mvcResult.getResponse().getContentAsString();

        BaseResponse<List<OrderResponseDto>> resultDto = objectMapper.readValue(
                responseJson,
                new TypeReference<>() {}
        );

        assertThat(resultDto.getData().size()).isEqualTo(testSize);
    }

    private void mockPerformPayment(PaymentRequestDto paymentRequestDto) throws Exception {
        mockMvc.perform(
                post("/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentRequestDto))
        ).andExpect(status().isCreated());
    }

}
