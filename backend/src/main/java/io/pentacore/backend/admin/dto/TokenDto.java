package io.pentacore.backend.admin.dto;

import lombok.*;

@Data
@RequiredArgsConstructor

public class TokenDto {
    private String accessToken;
    private String refreshToken;
}





