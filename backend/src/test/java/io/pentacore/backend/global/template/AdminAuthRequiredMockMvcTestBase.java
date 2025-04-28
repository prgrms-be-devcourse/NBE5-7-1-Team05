package io.pentacore.backend.global.template;

import io.pentacore.backend.admin.domain.Admin;
import io.pentacore.backend.admin.dto.LoginRequestDto;
import io.pentacore.backend.admin.dto.SignUpRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public abstract class AdminAuthRequiredMockMvcTestBase extends MockMvcTestBase {
    public Admin admin;

    public String authorizationHeader;
    public String refreshToken;

    @BeforeEach
    void setUp() throws Exception {
        String adminEmail = "admin@email.com";
        String adminPassword = "password";

        signup(adminEmail, adminPassword);
        login(adminEmail, adminPassword);
    }

    private void login(String adminEmail, String adminPassword) throws Exception {
        LoginRequestDto loginRequestDto = new LoginRequestDto(adminEmail, adminPassword);
        ResultActions resultActions = mockMvc.perform(
                post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequestDto))
        );
        MockHttpServletResponse response = resultActions.andReturn().getResponse();
        authorizationHeader = response.getHeader("Authorization");
        refreshToken = response.getHeader("Refresh");
    }

    private void signup(String adminEmail, String adminPassword) throws Exception {
        SignUpRequestDto signUpRequestDto = new SignUpRequestDto(adminEmail, adminPassword);
        mockMvc.perform(
                post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequestDto))
        );
    }
}
