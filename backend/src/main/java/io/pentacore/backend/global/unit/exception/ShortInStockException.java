package io.pentacore.backend.global.unit.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShortInStockException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String productName;
    private final Integer requestedQuantity;
    private final Integer storedQuantity;
}
