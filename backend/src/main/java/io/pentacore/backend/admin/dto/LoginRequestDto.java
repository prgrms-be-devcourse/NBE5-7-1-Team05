package io.pentacore.backend.admin.dto;


import lombok.*;

@Getter
@RequiredArgsConstructor
public class LoginRequestDto {
    private final String email;
    private final String password;

}
