<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Lịch Khám Của Tôi</h2>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày & Giờ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading" class="text-center">
            <td colspan="5" class="py-6">Đang tải lịch...</td>
          </tr>
          <tr v-else-if="appointments.length === 0" class="text-center">
            <td colspan="5" class="py-6 text-gray-500">Bạn chưa có lịch hẹn nào.</td>
          </tr>

          <tr v-for="app in appointments" :key="app._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-bold text-blue-600">{{ app.date }}</div>
              <div class="text-sm text-gray-900">{{ app.timeSlot }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
              {{ app.patient?.fullName || 'Khách vãng lai' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ app.patient?.phone || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="app.status === 'booked' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
                class="px-2 py-1 text-xs rounded-full font-semibold">
                {{ app.status === 'booked' ? 'Chờ khám' : 'Đã khám xong' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <button v-if="app.status === 'booked'" @click="markAsCompleted(app._id)"
                class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                Hoàn thành
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api'; // Gọi thẳng api instance

const appointments = ref([]);
const isLoading = ref(true);

const fetchSchedule = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/appointments/doctor-schedule');
    appointments.value = res.data.appointments;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const markAsCompleted = async (id) => {
  if (!window.confirm('Xác nhận bệnh nhân đã khám xong?')) return;
  try {
    // Tận dụng API update status của admin (Nhớ thêm quyền isDoctor vào route PUT status ở admin.routes nếu muốn bác sĩ tự update, hoặc tạo API riêng)
    await api.put(`/appointments/doctor-schedule/${id}/status`, { status: 'completed' });
    fetchSchedule();
  } catch (error) {
    alert('Lỗi cập nhật');
  }
};

onMounted(fetchSchedule);
</script>