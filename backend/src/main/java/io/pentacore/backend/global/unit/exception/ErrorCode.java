package io.pentacore.backend.global.unit.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    INVALID_REQUEST(400, "요청 데이터가 올바르지 않습니다."),
    INVALID_FORMAT_EMAIL(400, "이메일 형식이 올바르지 않습니다."),
    NOT_ENOUGH_STOCK(400, "재고가 부족합니다."),

    ADMIN_NOT_FOUND(404, "존재하지 않는 관리자입니다."),
    PRODUCT_NOT_FOUND(404, "존재하지 않는 상품입니다."),
    ORDER_FROM_USER_NOT_FOUND(404, "사용자의 주문 내역이 존재하지 않습니다."),
    ORDER_NOT_FOUND(404, "존재하지 않는 주문 내역입니다."),

    INTERNAL_SERVER_ERROR(500, "서버 에러입니다. 서버 팀에 연락주세요!");

    private final int status;
    private final String message;

    public HttpStatus getStatus() {
        return HttpStatus.valueOf(status);
    }

}

