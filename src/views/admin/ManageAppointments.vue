<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Lịch hẹn Hệ thống</h2>
    </div>

    <div class="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
        <select v-model="filters.status" @change="fetchAppointments" class="border rounded px-3 py-2 min-w-37.5">
          <option value="">Tất cả</option>
          <option value="available">Trống</option>
          <option value="booked">Đã đặt</option>
          <option value="completed">Đã khám</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
        <input type="date" v-model="filters.date" @change="fetchAppointments" class="border rounded px-3 py-2">
      </div>
      <button @click="resetFilters" class="text-blue-600 hover:underline text-sm font-medium pb-2">
        Xóa bộ lọc
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bác sĩ / Phòng khám</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading" class="text-center">
            <td colspan="5" class="py-6 text-gray-500">Đang tải...</td>
          </tr>
          <tr v-else-if="appointments.length === 0" class="text-center">
            <td colspan="5" class="py-6 text-gray-500">Không có dữ liệu lịch hẹn phù hợp.</td>
          </tr>
          <tr v-for="app in appointments" :key="app._id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div v-if="app.patient" class="text-sm font-medium text-gray-900">{{ app.patient.fullName }}</div>
              <div v-if="app.patient" class="text-sm text-gray-500">{{ app.patient.phone }}</div>
              <span v-else class="text-sm text-gray-400 italic">Chưa có người đặt</span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">BS. {{ app.doctor?.fullName }}</div>
              <div class="text-sm text-gray-500">{{ app.clinic?.name }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-blue-600">{{ app.date }}</div>
              <div class="text-sm text-gray-500">{{ app.timeSlot }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(app.status)" class="px-2 py-1 text-xs rounded-full font-semibold">
                {{ getStatusText(app.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <select v-model="app.status" @change="handleStatusChange(app._id, app.status)"
                class="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="available" :disabled="app.patient">Trống</option>
                <option value="booked">Đã đặt</option>
                <option value="completed">Đã khám</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { adminService } from '../../services/adminService';

const appointments = ref([]);
const isLoading = ref(true);

const filters = reactive({
  status: '',
  date: ''
});

const getStatusText = (status) => {
  const map = { 'available': 'Trống', 'booked': 'Đã đặt', 'cancelled': 'Đã hủy', 'completed': 'Đã khám' };
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

const fetchAppointments = async () => {
  isLoading.value = true;
  try {
    const res = await adminService.getAllAppointments(filters);
    appointments.value = res.data.appointments;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const resetFilters = () => {
  filters.status = '';
  filters.date = '';
  fetchAppointments();
};

const handleStatusChange = async (id, newStatus) => {
  if (!window.confirm('Bạn có chắc muốn cập nhật trạng thái lịch hẹn này?')) {
    fetchAppointments(); // Revert back if cancelled
    return;
  }
  try {
    await adminService.updateAppointmentStatus(id, newStatus);
    // Nếu chuyển sang completed hoặc cancelled, có thể backend của bạn đã gửi mail thông báo
    alert('Cập nhật trạng thái thành công!');
    fetchAppointments();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi cập nhật');
    fetchAppointments(); // Revert ui
  }
};

onMounted(fetchAppointments);
</script>