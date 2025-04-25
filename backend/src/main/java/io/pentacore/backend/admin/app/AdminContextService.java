package io.pentacore.backend.admin.app;

import io.pentacore.backend.admin.domain.Admin;
import io.pentacore.backend.admin.dto.AdminDetails;
import io.pentacore.backend.global.unit.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

///알아서 admin 추출되게 만들어야 함

//@Component
//public class AdminContextService {
//    public Admin getCurrentAdmin() throws IllegalAccessException {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        if (auth != null || (auth.getPrincipal() instanceof AdminDetails)) {
//            BaseResponse.error("인증된 관리자가 아닙니다", HttpStatus.ACCEPTED);
//
//        }
//        AdminDetails adminDetails = (AdminDetails) auth.getPrincipal();
//        return adminDetails.getAdmin();
//    }
//}
