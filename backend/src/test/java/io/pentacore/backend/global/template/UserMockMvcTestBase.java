package io.pentacore.backend.global.template;

import io.pentacore.backend.admin.domain.Admin;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.security.test.context.support.WithMockUser;

@WithMockUser
public abstract class UserMockMvcTestBase extends MockMvcTestBase {

    public Admin admin;

    @BeforeEach
    public void setUp() throws Exception {
        admin = adminRepository.save(new Admin("admin@gmail.com", "password"));
    }
}
