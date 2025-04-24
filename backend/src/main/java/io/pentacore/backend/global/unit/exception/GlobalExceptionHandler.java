package io.pentacore.backend.global.unit.exception;

import io.pentacore.backend.global.unit.BaseResponse;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler( {CustomException.class })
    protected ResponseEntity<BaseResponse<?>> handleCustomException(CustomException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        Long targetId = ex.getTargetId();

        if(targetId != -1L) {
            return ResponseEntity.status(errorCode.getStatus())
                    .body(BaseResponse.error(targetId + "번 상품은 " + errorCode.getMessage()));
        }

        return ResponseEntity.status(errorCode.getStatus())
                .body(BaseResponse.error(errorCode.getMessage()));
    }

    @ExceptionHandler( {MethodArgumentNotValidException.class} )
    protected ResponseEntity<BaseResponse<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {

        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();

        String errorMessage = fieldErrors.stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorCode errorCode = ErrorCode.INVALID_REQUEST;

        return ResponseEntity.status(errorCode.getStatus())
                .body(BaseResponse.error(errorMessage));
    }

    @ExceptionHandler( {Exception.class} )
    protected ResponseEntity<BaseResponse<?>> handleException(Exception ex) {
        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(BaseResponse.error(ErrorCode.INTERNAL_SERVER_ERROR.getMessage()));
    }

}
