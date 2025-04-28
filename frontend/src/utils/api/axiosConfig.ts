import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// refreshAccessToken 함수를 직접 정의해서 순환 참조 제거
const refreshAccessToken = async () => {
  try {
    console.group("Token Refresh Attempt");
    console.log("Attempting to refresh token");

    const refreshToken = localStorage.getItem("refreshToken");

    console.log("cur access token", localStorage.getItem("adminToken"));
    console.log("Current refresh token:", refreshToken);

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/reissue-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    console.log("Token refresh response:", response);

    const newAccessToken = response.headers["authorization"]?.replace(
      "Bearer ",
      ""
    );
    const newRefreshToken = response.headers["refresh"];

    console.log("New access token:", newAccessToken);
    console.log("New refresh token:", newRefreshToken);

    if (!newAccessToken) {
      throw new Error("Token refresh failed: No new access token");
    }

    localStorage.setItem("adminToken", newAccessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    console.log(
      "%c 🎉 토큰 리프레시 성공! 🎉 ",
      "background: #4CAF50; color: white; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 4px;"
    );
    console.log("토큰 갱신 시간:", new Date().toLocaleString());
    console.log("토큰 유효성 확인:", newAccessToken.substring(0, 10) + "...");

    console.groupEnd();
    return newAccessToken;
  } catch (error: any) {
    console.group("Token Refresh Error");

    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    console.error("Full error object:", error);
    console.groupEnd();

    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // 토큰 갱신 응답인 경우 성공 로그 추가
    if (response.config.url?.includes("/reissue-token")) {
      console.group("Token Refresh Success");
      console.log(
        "%c 토큰 갱신 응답 수신 성공 ",
        "background: #2196F3; color: white; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 4px;"
      );
      console.log("응답 상태:", response.status);
      console.log("응답 헤더:", response.headers);
      console.groupEnd();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._retry) {
      window.location.href = "/admin/login";
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/reissue-token") ||
      originalRequest.url?.includes("/login")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      // 이미 재시도한 요청이면 로그아웃하지 말고 그냥 에러 반환
      if (originalRequest._retry) {
        console.log("이미 토큰 갱신을 시도했지만 실패했습니다");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        console.log(
          "%c 원본 요청 재시도 중 ",
          "background: #4CAF50; color: white; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 4px;"
        );
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        // 토큰 갱신 실패시에만 로그아웃 처리
        localStorage.removeItem("adminToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("adminUser");

        // 로그인 페이지로 리다이렉트하기 전에 사용자에게 알림
        console.log(
          "%c 세션이 만료되어 로그인 페이지로 이동합니다 ",
          "background: #F44336; color: white; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 4px;"
        );

        // 현재 URL이 로그인 페이지가 아닌 경우에만 리다이렉트
        if (!window.location.href.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { refreshAccessToken };
export default api;
