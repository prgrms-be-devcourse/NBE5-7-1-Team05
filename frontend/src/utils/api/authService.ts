import api from "./axiosConfig";
import LoginForm from "@/interface/LoginForm";
import SignupForm from "@/interface/SignupForm";

export const authService = {
  login: async (credentials: LoginForm) => {
    const response = await api.post(
      import.meta.env.VITE_API_LOGIN,
      credentials
    );

    const accessToken = response.headers["authorization"];
    const refreshToken = response.headers["refresh"];

    return {
      accessToken: accessToken?.replace("Bearer ", ""),
      refreshToken,
      user: response.data.user || response.data,
    };
  },

  signup: async (signupData: Omit<SignupForm, "confirmPassword">) => {
    const response = await api.post(
      import.meta.env.VITE_API_SIGNUP,
      signupData
    );
    return response.data;
  },

  logout: async () => {
    const response = await api.post(import.meta.env.VITE_API_LOGOUT);
    return response.data;
  },

  reissueToken: async (refreshToken: string) => {
    const response = await api.post(import.meta.env.VITE_API_REISSUE_TOKEN, {
      refreshToken,
    });
    return response.data;
  },
};
