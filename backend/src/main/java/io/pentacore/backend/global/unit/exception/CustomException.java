package io.pentacore.backend.global.unit.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException {
    private final ErrorCode errorCode;
    private Long targetId = -1L;

    public CustomException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
