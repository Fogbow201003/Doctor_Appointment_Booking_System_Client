import api from "./api";

export const adminService = {
  // --- Quản lý Bác sĩ ---
  createDoctor(doctorData) {
    return api.post("/admin/doctors", doctorData);
  },
  updateDoctor(id, doctorData) {
    return api.put(`/admin/doctors/${id}`, doctorData);
  },
  deleteDoctor(id) {
    return api.delete(`/admin/doctors/${id}`);
  },

  // --- Quản lý Phòng khám ---
  createClinic(clinicData) {
    return api.post("/admin/clinics", clinicData);
  },
  updateClinic(id, clinicData) {
    return api.put(`/admin/clinics/${id}`, clinicData);
  },

  // --- Quản lý Lịch hẹn ---
  getAllAppointments(params) {
    // params có thể chứa: clinicId, date, status, doctorId
    return api.get("/admin/appointments", { params });
  },
  updateAppointmentStatus(id, status) {
    return api.put(`/admin/appointments/${id}/status`, { status });
  },

  // --- Quản lý Người dùng ---
  getAllUsers() {
    return api.get("/admin/users");
  },
  toggleUserStatus(id) {
    return api.put(`/admin/users/${id}/status`);
  },

  // --- Quản lý Feedback ---
  getAllFeedbacks() {
    return api.get("/admin/feedbacks");
  },
  replyFeedback(id, adminReply) {
    return api.put(`/admin/feedbacks/${id}/reply`, { adminReply });
  },
  // --- Quản lý Chuyên khoa ---
  getSpecialties() {
    return api.get("/specialties");
  },
  createSpecialty(data) {
    return api.post("/specialties", data);
  },
  updateSpecialty(id, data) {
    return api.put(`/specialties/${id}`, data);
  },
  deleteSpecialty(id) {
    return api.delete(`/specialties/${id}`);
  },
  getClinics() {
    return api.get("/doctors/clinics");
  }, // Dùng chung API public để lấy danh sách
  createClinic(clinicData) {
    return api.post("/admin/clinics", clinicData);
  },
  updateClinic(id, clinicData) {
    return api.put(`/admin/clinics/${id}`, clinicData);
  },
};
