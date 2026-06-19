<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">Lịch sử Đặt khám</h2>
        <router-link to="/doctors" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          + Đặt lịch mới
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ / Chuyên
                khoa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng khám</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading" class="text-center">
              <td colspan="5" class="py-4 text-gray-500">Đang tải dữ liệu...</td>
            </tr>
            <tr v-else-if="appointments.length === 0" class="text-center">
              <td colspan="5" class="py-4 text-gray-500">Bạn chưa có lịch hẹn nào.</td>
            </tr>
            <tr v-for="app in appointments" :key="app._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">BS. {{ app.doctor?.fullName }}</div>
                <div class="text-sm text-gray-500">{{ app.doctor?.specialty }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ app.timeSlot }}</div>
                <div class="text-sm font-medium text-blue-600">{{ app.date }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ app.clinic?.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(app.status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ getStatusText(app.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="app.status === 'booked'" @click="handleCancel(app._id)"
                  class="text-red-600 hover:text-red-900 border border-red-200 px-3 py-1 rounded hover:bg-red-50">
                  Hủy lịch
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { appointmentService } from '../../services/appointmentService';
import { useAuthStore } from '../../stores/authStore';

const appointments = ref([]);
const isLoading = ref(true);
const authStore = useAuthStore();

const getStatusText = (status) => {
  const map = {
    'available': 'Trống',
    'booked': 'Đã đặt',
    'cancelled': 'Đã hủy',
    'completed': 'Đã khám'
  };
  return map[status] || status;
};

const getStatusClass = (status) => {
  const map = {
    'booked': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'completed': 'bg-gray-100 text-gray-800'
  };
  return map[status] || 'bg-blue-100 text-blue-800';
};

const fetchMyAppointments = async () => {
  try {
    const res = await appointmentService.getMyAppointments();
    appointments.value = res.data.appointments;
  } catch (error) {
    console.error('Lỗi tải lịch sử:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = async (id) => {
  if (!window.confirm('Bạn có chắc chắn muốn hủy lịch khám này? Tiền sẽ được hoàn lại vào tài khoản.')) return;

  try {
    const res = await appointmentService.cancelAppointment(id);
    alert(res.data.message);

    authStore.user.balance = res.data.balance;
    localStorage.setItem('user', JSON.stringify(authStore.user));

    fetchMyAppointments(); // Tải lại bảng
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi khi hủy lịch');
  }
};

onMounted(() => {
  fetchMyAppointments();
});
</script>