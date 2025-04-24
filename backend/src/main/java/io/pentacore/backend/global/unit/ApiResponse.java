package io.pentacore.backend.global.unit;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(staticName = "of")
public class ApiResponse<T> {

    private int status;
    private String message;
    private T data;

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, "성공", data);
    }

    public static ApiResponse<?> ok() {
        return new ApiResponse<>(200, "성공", null);
    }

    public static <T> ApiResponse<T> ok(int status, String message) {
        return new ApiResponse<>(status, message, null);
    }

    public static <T> ApiResponse<T> ok(int status, String message, T data) {
        return new ApiResponse<>(status, message, data);
    }

    public static ApiResponse<?> error(String message) {
        return new ApiResponse<>(400, message, null);
    }

    public static ApiResponse<?> error(int status, String message) {
        return new ApiResponse<>(status, message, null);
    }

}
