package io.pentacore.backend.global.unit.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SuccessCode {

    PRODUCT_MODIFIED_SUCCESS(200, "상품 수정이 정상적으로 수행되었습니다."),

    PRODUCT_ADDED_SUCCESS(201, "상품 추가가 정상적으로 수행되었습니다."),

}
