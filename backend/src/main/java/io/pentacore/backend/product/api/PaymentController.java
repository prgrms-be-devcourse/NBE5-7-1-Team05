package io.pentacore.backend.product.api;

import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.global.unit.response.SuccessCode;
import io.pentacore.backend.product.app.PaymentService;
import io.pentacore.backend.product.dto.PaymentRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<BaseResponse<?>> payment(@RequestBody PaymentRequestDto request) {

        paymentService.addOrder(request);

        return BaseResponse.ok(SuccessCode.ADDED_SUCCESS.getMessage(), SuccessCode.ADDED_SUCCESS.getStatus());
    }
}
