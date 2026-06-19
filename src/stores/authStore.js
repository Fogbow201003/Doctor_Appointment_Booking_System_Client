import { defineStore } from "pinia";
import { authService } from "../services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // Khôi phục user và token từ localStorage nếu có
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    error: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(credentials) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await authService.login(credentials);
        this.token = response.data.token;
        this.user = response.data.user;

        // Lưu vào localStorage để duy trì đăng nhập
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        return response.data;
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng thử lại!";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async register(userData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await authService.register(userData);
        this.token = response.data.token;
        this.user = response.data.user;

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        return response.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
