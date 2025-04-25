package io.pentacore.backend.global.unit.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum SuccessCode {

    MODIFIED_SUCCESS(200, "수정이 정상적으로 수행되었습니다."),
    GET_SUCCESS(200, "데이터를 성공적으로 가져왔습니다."),

    ADDED_SUCCESS(201, "추가가 정상적으로 수행되었습니다."),

    DELETED_SUCCESS(204, "삭제가 정상적으로 수행되었습니다."),

    private final int status;
    private final String message;

    public HttpStatus getStatus() {
        return HttpStatus.valueOf(status);
    }
}
