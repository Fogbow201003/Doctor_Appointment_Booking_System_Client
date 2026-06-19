<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <button @click="router.back()" class="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Quay lại tìm bác sĩ
      </button>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6" v-if="doctor">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Đặt lịch khám: BS. {{ doctor.fullName }}</h2>
        <p class="text-gray-600 mb-1"><strong>Chuyên khoa:</strong> {{ doctor.specialty }}</p>
        <p class="text-gray-600 mb-1"><strong>Phòng khám:</strong> {{ doctor.clinic.name }} - {{ doctor.clinic.address
          }}</p>
        <p class="text-red-600 font-semibold mt-2 text-lg">Phí khám: {{ formatCurrency(doctor.consultationFee) }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Chọn ngày khám</label>
          <input type="date" v-model="selectedDate" @change="fetchSlots" :min="today"
            class="w-full md:w-1/3 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div v-if="isLoading" class="text-center py-8">
          <span class="text-gray-500">Đang tải lịch trống...</span>
        </div>

        <div v-else>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Các khung giờ trong ngày</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button v-for="slot in slots" :key="slot._id" @click="handleBook(slot)"
              :disabled="slot.status !== 'available' || isBooking" :class="[
                'py-2 px-4 rounded-md border text-center transition-colors font-medium',
                slot.status === 'available' ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white cursor-pointer' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              ]">
              {{ slot.timeSlot }}
            </button>
          </div>
          <div v-if="slots.length === 0" class="text-center text-gray-500 py-4">
            Vui lòng chọn ngày để xem lịch trống.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { useAuthStore } from '../../stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const doctorId = route.params.id;
const doctor = ref(null);
const slots = ref([]);
const isLoading = ref(false);
const isBooking = ref(false);

// Lấy ngày hôm nay định dạng YYYY-MM-DD để làm min date
const today = new Date().toISOString().split('T')[0];
const selectedDate = ref(today);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const fetchDoctorInfo = async () => {
  try {
    const res = await doctorService.getDoctorById(doctorId);
    doctor.value = res.data.doctor;
  } catch (error) {
    alert('Không tìm thấy thông tin bác sĩ');
    router.push('/doctors');
  }
};

const fetchSlots = async () => {
  if (!selectedDate.value) return;
  isLoading.value = true;
  try {
    const res = await appointmentService.getAvailableSlots(doctorId, selectedDate.value);
    slots.value = res.data.slots;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleBook = async (slot) => {
  const confirmBook = window.confirm(`Xác nhận đặt lịch lúc ${slot.timeSlot} ngày ${selectedDate.value}? Phí khám sẽ được trừ vào tài khoản của bạn.`);
  if (!confirmBook) return;

  isBooking.value = true;
  try {
    const res = await appointmentService.bookAppointment(slot._id);
    alert(res.data.message);

    // Cập nhật lại số dư trong store
    authStore.user.balance = res.data.balance;
    localStorage.setItem('user', JSON.stringify(authStore.user));

    // Chuyển sang trang lịch sử
    router.push('/history');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Lỗi đặt lịch';
    alert(errorMsg);
    // Nếu lỗi do hết tiền, bạn có thể redirect về trang nạp tiền
    // if (errorMsg.includes('số dư')) router.push('/deposit');
  } finally {
    isBooking.value = false;
    fetchSlots(); // Cập nhật lại grid slot để ô vừa đặt thành màu xám
  }
};

onMounted(() => {
  fetchDoctorInfo();
  fetchSlots();
});
</script>