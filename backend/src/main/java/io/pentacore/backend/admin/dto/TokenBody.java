package io.pentacore.backend.admin.dto;

import io.pentacore.backend.admin.domain.Role;
import lombok.*;

@Getter
@RequiredArgsConstructor
public class TokenBody {
    private final Long adminId;
    private final Role role;
}
