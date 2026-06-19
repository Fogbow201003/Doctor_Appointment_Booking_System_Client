import api from "./api";

export const doctorService = {
  // Lấy danh sách 3 phòng khám
  getClinics() {
    return api.get("/doctors/clinics");
  },

  // Lấy danh sách bác sĩ (có hỗ trợ filter: clinicId, specialty, search)
  getDoctors(params) {
    return api.get("/doctors", { params });
  },

  // Lấy chi tiết 1 bác sĩ
  getDoctorById(id) {
    return api.get(`/doctors/${id}`);
  },
};
