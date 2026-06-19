import api from "./api";

export const appointmentService = {
  // Lấy danh sách ô lịch (trống/đã đặt)
  getAvailableSlots(doctorId, date) {
    return api.get("/appointments/available", { params: { doctorId, date } });
  },

  // Thực hiện đặt lịch
  bookAppointment(appointmentId) {
    return api.post("/appointments/book", { appointmentId });
  },

  // Hủy lịch
  cancelAppointment(appointmentId) {
    return api.post("/appointments/cancel", { appointmentId });
  },

  // Lấy lịch sử khám của User đang đăng nhập
  getMyAppointments() {
    return api.get("/appointments/my");
  },
};
