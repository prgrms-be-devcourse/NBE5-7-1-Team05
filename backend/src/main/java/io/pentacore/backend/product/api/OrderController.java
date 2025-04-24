package io.pentacore.backend.product.api;

import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.global.unit.exception.CustomException;
import io.pentacore.backend.global.unit.exception.ErrorCode;
import io.pentacore.backend.global.util.EmailValidator;
import io.pentacore.backend.product.app.OrderService;
import io.pentacore.backend.product.dto.OrderResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
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

        if (!EmailValidator.isValid(email)) {
            throw new CustomException(ErrorCode.INVALID_FORMAT_EMAIL);
        }

        List<OrderResponseDto> orders = orderService.getOrdersByEmail(email);

        if (orders.isEmpty()) {
            throw new CustomException(ErrorCode.ORDER_FROM_USER_NOT_FOUND);
        }

        return ResponseEntity.ok(BaseResponse.ok(orders));
    }
}
