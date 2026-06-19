// src/services/api.js
import axios from "axios";

// Khởi tạo instance
const api = axios.create({
  // Tùy chỉnh /api nếu route backend của bạn có tiền tố này
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động đính kèm Token (nếu có)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
