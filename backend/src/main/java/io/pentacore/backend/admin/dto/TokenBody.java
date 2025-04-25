package io.pentacore.backend.admin.dto;

import io.pentacore.backend.admin.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenBody {
    private Long adminId;
    private Role role;
}
