<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Tìm kiếm Bác sĩ</h2>

      <div class="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tìm theo tên</label>
          <input v-model="filters.search" @keyup.enter="fetchDoctors" type="text" placeholder="Nhập tên bác sĩ..."
            class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Khu vực Phòng khám</label>
          <select v-model="filters.clinicId"
            class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">-- Tất cả phòng khám --</option>
            <option v-for="clinic in clinics" :key="clinic._id" :value="clinic._id">
              {{ clinic.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
          <select v-model="filters.specialty"
            class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">-- Tất cả chuyên khoa --</option>
            <option v-for="spec in specialties" :key="spec._id" :value="spec._id">
              {{ spec.name }}
            </option>
          </select>
        </div>

        <div>
          <button @click="fetchDoctors"
            class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition flex justify-center items-center h-[42px]">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Tìm kiếm
          </button>
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
                  {{ doctor.specialty?.name }}
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
import api from '../../services/api';

const authStore = useAuthStore();
const router = useRouter();

const clinics = ref([]);
const specialties = ref([]);
const doctors = ref([]);
const isLoading = ref(true);

const filters = reactive({
  search: '',
  clinicId: '',
  specialty: ''
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const loadInitialData = async () => {
  try {
    isLoading.value = true;
    const [clinicRes, specRes] = await Promise.all([
      doctorService.getClinics(),
      api.get('/specialties')
    ]);

    clinics.value = clinicRes.data.clinics;
    specialties.value = specRes.data.specialties;

    await fetchDoctors();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchDoctors = async () => {
  try {
    isLoading.value = true; // Thêm loading cho mỗi lần bấm tìm kiếm
    const res = await doctorService.getDoctors(filters);
    doctors.value = res.data.doctors;
  } catch (error) {
    console.error('Lỗi khi tìm bác sĩ:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadInitialData();
});
</script>