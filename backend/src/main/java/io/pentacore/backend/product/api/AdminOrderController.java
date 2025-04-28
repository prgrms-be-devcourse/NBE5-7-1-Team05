package io.pentacore.backend.product.api;


import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.global.unit.response.SuccessCode;
import io.pentacore.backend.product.app.OrderService;
import io.pentacore.backend.product.dto.OrderResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("admin/orders")
public class AdminOrderController {

    private final OrderService orderService;


    @GetMapping
    public ResponseEntity<BaseResponse<List<OrderResponseDto>>> getAllOrders() {
        List<OrderResponseDto> result = orderService.getAllOrders();

        return BaseResponse.ok(
                SuccessCode.GET_SUCCESS.getMessage(),
                result,
                SuccessCode.GET_SUCCESS.getStatus()
        );
    }

}
