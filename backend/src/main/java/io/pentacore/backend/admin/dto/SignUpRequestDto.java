package io.pentacore.backend.admin.dto;


import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequestDto {
    private String email;
    private String password;
}
