import { createRouter, createWebHistory } from "vue-router";
//Client/main view
import PatientLayout from "../components/layout/PatientLayout.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import FindDoctorView from "../views/patient/FindDoctorView.vue";
import BookingView from "../views/patient/BookingView.vue";
import HistoryView from "../views/patient/HistoryView.vue";
import DepositView from "../views/patient/DepositView.vue";

//Admin view
import AdminLayout from "../components/layout/AdminLayout.vue";
import ManageDoctors from "../views/admin/ManageDoctors.vue";
import DashboardView from "../views/admin/DashboardView.vue";
import ManageAppointments from "../views/admin/ManageAppointments.vue";
import ManageSpecialties from "../views/admin/ManageSpecialties.vue";
import ManageClinics from "../views/admin/ManageClinics.vue";
import ManageFeedbacks from "../views/admin/ManageFeedbacks.vue";

//Doctor view
import DoctorLayout from "../components/layout/DoctorLayout.vue";
import DoctorSchedule from "../views/doctor/DoctorSchedule.vue";

// trang chủ
import HomeView from "../views/patient/HomeView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/",
    component: PatientLayout,
    children: [
      { path: "", name: "Home", component: HomeView },
      { path: "find-doctor", name: "FindDoctor", component: FindDoctorView },
      { path: "booking/:id", name: "Booking", component: BookingView },
      { path: "history", name: "History", component: HistoryView },
      { path: "deposit", name: "Deposit", component: DepositView },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "", redirect: "/admin/dashboard" },
      { path: "dashboard", name: "AdminDashboard", component: DashboardView },
      { path: "doctors", name: "ManageDoctors", component: ManageDoctors },
      {
        path: "appointments",
        name: "ManageAppointments",
        component: ManageAppointments,
      },
      {
        path: "specialties",
        name: "ManageSpecialties",
        component: ManageSpecialties,
      },
      {
        path: "clinics",
        name: "ManageClinics",
        component: ManageClinics,
      },
      {
        path: "feedbacks",
        name: "ManageFeedbacks",
        component: ManageFeedbacks,
      },
    ],
  },
  {
    path: "/doctor",
    component: DoctorLayout,
    children: [
      { path: "", redirect: "/doctor/schedule" },
      { path: "schedule", name: "DoctorSchedule", component: DoctorSchedule },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register", "/", "/doctors"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("token");

  // 1. Chặn: Cần đăng nhập nhưng chưa có token
  if (authRequired && !loggedIn) {
    return next("/login");
  }

  // 2. Chặn: Đã đăng nhập nhưng cố vào lại trang Auth
  if (loggedIn && (to.path === "/login" || to.path === "/register")) {
    return next("/");
  }

  // 3. BẢO VỆ ROUTE ADMIN
  if (to.path.startsWith("/admin")) {
    let user = null;

    // Đưa JSON.parse vào try...catch để chống crash ứng dụng
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        user = JSON.parse(userString);
      }
    } catch (error) {
      console.error("Dữ liệu user trong localStorage bị lỗi định dạng", error);
      // Có thể thêm logic xóa localStorage bị hỏng tại đây: localStorage.removeItem("user")
    }

    // Kiểm tra quyền Admin
    if (!user || user.role !== "admin") {
      alert("Bạn không có quyền truy cập trang này!"); // Cân nhắc đổi sang Toast notification
      return next("/");
    }
  }
  // 4. BẢO VỆ ROUTE DOCTOR
  if (to.path.startsWith("/doctor")) {
    let user = null;

    // Đưa JSON.parse vào try...catch để chống crash ứng dụng
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        user = JSON.parse(userString);
      }
    } catch (error) {
      console.error("Dữ liệu user trong localStorage bị lỗi định dạng", error);
      // Có thể thêm logic xóa localStorage bị hỏng tại đây: localStorage.removeItem("user")
    }
    if (!user || user.role !== "doctor") {
      alert("Chỉ Bác sĩ mới được truy cập!");
      return next("/");
    }
  }

  // 5. Mọi điều kiện đều thỏa mãn -> Cho phép đi tiếp
  next();
});

export default router;
