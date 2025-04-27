package io.pentacore.backend.admin.app;

import io.pentacore.backend.admin.domain.Admin;
import io.pentacore.backend.admin.dto.AdminDetails;
import io.pentacore.backend.global.unit.BaseResponse;
import io.pentacore.backend.global.unit.exception.CustomException;
import io.pentacore.backend.global.unit.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

//알아서 admin 추출되게 만들어야 함

@Component
public class AdminContextService {

    public Long getCurrentAdminId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AdminDetails)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        AdminDetails adminDetails = (AdminDetails) auth.getPrincipal();
        return adminDetails.getId();
    }
}
