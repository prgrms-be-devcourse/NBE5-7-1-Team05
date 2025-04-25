import axios from "axios";

// axios 인스턴스 생성 - 모든 API 요청에 공통으로 사용할 설정을 미리 정의
const api = axios.create({
  // 환경변수에서 API 기본 URL 가져오기 (예: http://localhost:8080)
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    // 모든 요청의 기본 Content-Type을 JSON으로 설정
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 모든 API 요청이 서버로 전송되기 전에 실행됨
api.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 관리자 액세스 토큰 가져오기
    const token = localStorage.getItem("adminToken");

    // 토큰이 존재하면 요청 헤더에 Authorization 추가
    if (token) {
      // Bearer 스키마를 사용하여 JWT 토큰을 헤더에 추가
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 수정된 config 객체 반환
    return config;
  },
  (error) => {
    // 요청 전 에러 발생 시 에러를 그대로 반환
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 서버에서 응답을 받은 후 실행됨
api.interceptors.response.use(
  // 성공 응답(200번대)은 그대로 반환
  (response) => response,

  // 에러 응답 처리
  async (error) => {
    // 실패한 요청의 원본 설정 저장
    const originalRequest = error.config;

    // 401 Unauthorized 에러(토큰 만료) 처리
    // _retry 플래그로 무한 재시도 방지
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 재시도 플래그 설정 - 이 요청이 이미 한 번 실패했음을 표시
      originalRequest._retry = true;

      try {
        // 로컬 스토리지에서 리프레시 토큰 가져오기
        const refreshToken = localStorage.getItem("refreshToken");

        // 리프레시 토큰이 없으면 에러 발생
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // 토큰 재발급 API 호출
        // 주의: 여기서는 api 인스턴스가 아닌 순수 axios를 사용 (인터셉터 무한 루프 방지)
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_API_REISSUE_TOKEN
          }`,
          { refreshToken } // 요청 본문에 리프레시 토큰 포함
        );

        // 응답 헤더에서 새로운 액세스 토큰 추출
        // 서버가 access-token 또는 authorization 헤더로 전달할 수 있음
        const newAccessToken =
          response.headers["access-token"] || response.headers["authorization"];
        // 응답 헤더에서 새로운 리프레시 토큰 추출
        const newRefreshToken = response.headers["refresh-token"];

        // 새로운 액세스 토큰이 있는 경우
        if (newAccessToken) {
          // Bearer 접두사 제거
          const cleanAccessToken = newAccessToken.replace("Bearer ", "");

          // 새 액세스 토큰을 로컬 스토리지에 저장
          localStorage.setItem("adminToken", cleanAccessToken);

          // 새 리프레시 토큰이 있으면 교체
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // 실패했던 원래 요청에 새 액세스 토큰 적용
          originalRequest.headers.Authorization = `Bearer ${cleanAccessToken}`;

          // 원래 요청 재시도
          return api(originalRequest);
        } else {
          // 새 토큰을 받지 못한 경우 에러 발생
          throw new Error("No new token received");
        }
      } catch (refreshError) {
        // 토큰 재발급 실패 (리프레시 토큰 만료 등)

        // 모든 인증 정보 삭제
        localStorage.removeItem("adminToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("adminUser");

        // 로그인 페이지로 강제 이동
        window.location.href = "/admin/login";

        // 에러 반환
        return Promise.reject(refreshError);
      }
    }

    // 401이 아닌 다른 에러는 그대로 반환
    return Promise.reject(error);
  }
);

// 설정된 axios 인스턴스 내보내기
export default api;
