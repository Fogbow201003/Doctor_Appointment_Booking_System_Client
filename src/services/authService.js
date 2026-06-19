import api from "./api";

export const authService = {
  login(credentials) {
    // credentials bao gồm: { email, password }
    return api.post("/auth/login", credentials);
  },

  register(userData) {
    // userData bao gồm: { fullName, email, password, phone }
    return api.post("/auth/register", userData);
  },
};
