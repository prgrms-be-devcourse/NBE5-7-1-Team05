package io.pentacore.backend.global.unit;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(staticName = "of")
public class BaseResponse<T> {
    private int status;
    private String message;
    private T data;

    public static <T> BaseResponse<T> ok(T data) {
        return new BaseResponse<>(200, "성공", data);
    }

    public static BaseResponse<?> ok() {
        return new BaseResponse<>(200, "성공", null);
    }

    public static BaseResponse<?> error(String message) {
        return new BaseResponse<>(400, message, null);
    }
}