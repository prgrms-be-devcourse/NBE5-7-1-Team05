package io.pentacore.backend.product.api;

import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.global.util.EmailValidator;
import io.pentacore.backend.product.app.OrderService;
import io.pentacore.backend.product.dto.OrderResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @DeleteMapping("/orders/{orderId}")
    public BaseResponse<?> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);

        return BaseResponse.ok();
    }


    @GetMapping("/orders")
    public ResponseEntity<BaseResponse<?>> getOrdersByEmail(
            @RequestParam String email) {

        if (!EmailValidator.isValid(email)) {  // 변경된 부분
            return ResponseEntity.badRequest()
                    .body(BaseResponse.error("이메일 형식이 올바르지 않습니다."));
        }

        List<OrderResponseDto> orders = orderService.getOrdersByEmail(email);

        if (orders.isEmpty()) {
            return ResponseEntity.ok(BaseResponse.error("해당 이메일로 주문 내역이 없습니다."));
        }

        return ResponseEntity.ok(BaseResponse.ok(orders));
    }
}
