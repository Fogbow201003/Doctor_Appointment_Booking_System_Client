<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <h1 class="text-2xl font-bold text-blue-600">Hệ thống Đặt lịch Khám</h1>
        <div class="space-x-4">
          <router-link to="/" class="text-gray-600 hover:text-blue-600 font-medium">Trang chủ</router-link>
          <button v-if="authStore.isAuthenticated" @click="handleLogout"
            class="text-red-500 hover:underline font-medium">
            Đăng xuất
          </button>
        </div>
      </div>

      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Tìm kiếm Bác sĩ</h2>

      <div class="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tìm theo tên</label>
          <input v-model="filters.search" @input="fetchDoctors" type="text" placeholder="Nhập tên bác sĩ..."
            class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Khu vực Phòng khám</label>
          <select v-model="filters.clinicId" @change="fetchDoctors"
            class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">-- Tất cả phòng khám --</option>
            <option v-for="clinic in clinics" :key="clinic._id" :value="clinic._id">
              {{ clinic.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
          <select v-model="filters.specialty" @change="fetchDoctors"
            class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">-- Tất cả chuyên khoa --</option>
            <option value="Nội khoa">Nội khoa</option>
            <option value="Ngoại khoa">Ngoại khoa</option>
            <option value="Nhi khoa">Nhi khoa</option>
            <option value="Da liễu">Da liễu</option>
            <option value="Tai Mũi Họng">Tai Mũi Họng</option>
          </select>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="doctor in doctors" :key="doctor._id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div
                class="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                {{ doctor.fullName.charAt(0) }}
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">BS. {{ doctor.fullName }}</h3>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ doctor.specialty }}
                </span>
              </div>
            </div>

            <div class="text-sm text-gray-600 space-y-2 mb-4">
              <p><strong>Phòng khám:</strong> {{ doctor.clinic?.name || 'Đang cập nhật' }}</p>
              <p><strong>Phí khám:</strong> <span class="text-red-600 font-semibold">{{
                formatCurrency(doctor.consultationFee) }}</span></p>
            </div>

            <button
              class="w-full bg-blue-50 text-blue-600 border border-blue-200 font-medium py-2 px-4 rounded hover:bg-blue-600 hover:text-white transition-colors duration-200"
              @click="$router.push(`/booking/${doctor._id}`)">
              Xem lịch trống & Đặt hẹn
            </button>
          </div>
        </div>

        <div v-if="doctors.length === 0"
          class="col-span-full text-center py-10 bg-white rounded-lg shadow-sm text-gray-500">
          Không tìm thấy bác sĩ nào phù hợp với tiêu chí của bạn.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { doctorService } from '../../services/doctorService';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const clinics = ref([]);
const doctors = ref([]);
const isLoading = ref(true);

// State cho bộ lọc
const filters = reactive({
  search: '',
  clinicId: '',
  specialty: ''
});

// Format tiền tệ VNĐ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Đăng xuất
const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

// Fetch dữ liệu từ API
const loadInitialData = async () => {
  try {
    isLoading.value = true;
    const clinicRes = await doctorService.getClinics();
    clinics.value = clinicRes.data.clinics;
    await fetchDoctors();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchDoctors = async () => {
  try {
    const res = await doctorService.getDoctors(filters);
    doctors.value = res.data.doctors;
  } catch (error) {
    console.error('Lỗi khi tìm bác sĩ:', error);
  }
};

onMounted(() => {
  loadInitialData();
});
</script>