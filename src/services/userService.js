import api from "./api";

export const userService = {
  depositMoney(amount) {
    return api.post("/users/deposit", { amount });
  },
  getBalance() {
    return api.get("/users/balance");
  },
  getTransactions() {
    return api.get("/users/transactions");
  },
  getReceipt(appointmentId) {
    return api.get(`/users/receipts/${appointmentId}`);
  },
  submitFeedback(data) {
    // data: { appointmentId, rating, content }
    return api.post("/users/feedbacks", data);
  },
  getMyFeedbacks() {
    return api.get("/users/feedbacks");
  },
};
