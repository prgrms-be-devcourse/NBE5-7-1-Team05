package io.pentacore.backend.admin.dto;


import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class SignUpRequestDto {
    private final String email;
    private final String password;
}
