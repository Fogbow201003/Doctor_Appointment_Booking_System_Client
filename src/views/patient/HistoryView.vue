<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <main class="flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <router-link to="/find-doctor"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            + Đặt lịch mới
          </router-link>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bác sĩ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng khám</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading" class="text-center">
                <td colspan="5" class="py-4 text-gray-500">Đang tải...</td>
              </tr>
              <tr v-else-if="appointments.length === 0" class="text-center">
                <td colspan="5" class="py-4 text-gray-500">Chưa có lịch hẹn.</td>
              </tr>
              <tr v-for="app in appointments" :key="app._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">BS. {{ app.doctor?.fullName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ app.timeSlot }}</div>
                  <div class="text-sm font-medium text-blue-600">{{ app.date }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ app.clinic?.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(app.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatusText(app.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button v-if="app.status === 'booked'" @click="handleCancel(app._id)"
                    class="text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition">Hủy</button>

                  <button v-if="app.status === 'completed' && !feedbackedAppointmentIds.has(app._id)"
                    @click="openFeedback(app)"
                    class="text-yellow-600 border border-yellow-200 px-3 py-1 rounded hover:bg-yellow-50 transition">Đánh
                    giá</button>

                  <span v-else-if="app.status === 'completed' && feedbackedAppointmentIds.has(app._id)"
                    class="text-gray-400 border border-gray-200 bg-gray-50 px-3 py-1 rounded cursor-not-allowed">Đã đánh
                    giá</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="selectedApp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg w-full max-w-md p-6">
            <h3 class="text-xl font-bold mb-4">Gửi Phản Hồi Dịch Vụ</h3>
            <p class="text-sm text-gray-600 mb-4">Bác sĩ: BS. {{ selectedApp.doctor?.fullName }}</p>

            <form @submit.prevent="submitFeedback">
              <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Đánh giá (Số sao)</label>
                <select v-model="feedbackForm.rating" class="w-full border rounded px-3 py-2">
                  <option value="5">⭐⭐⭐⭐⭐ - Rất hài lòng</option>
                  <option value="4">⭐⭐⭐⭐ - Hài lòng</option>
                  <option value="3">⭐⭐⭐ - Bình thường</option>
                  <option value="2">⭐⭐ - Không hài lòng</option>
                  <option value="1">⭐ - Rất tệ</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Nội dung góp ý</label>
                <textarea v-model="feedbackForm.content" required rows="3" class="w-full border rounded px-3 py-2"
                  placeholder="Chia sẻ trải nghiệm của bạn..."></textarea>
              </div>
              <div class="flex justify-end space-x-3">
                <button type="button" @click="selectedApp = null"
                  class="px-4 py-2 border rounded hover:bg-gray-50">Đóng</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Gửi Phản
                  Hồi</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { appointmentService } from '../../services/appointmentService';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../stores/authStore';

const appointments = ref([]);
const feedbackedAppointmentIds = ref(new Set()); // Biến mới để lưu các ID lịch khám đã được đánh giá
const isLoading = ref(true);
const authStore = useAuthStore();
const router = useRouter();

// Feedback logic
const selectedApp = ref(null);
const feedbackForm = reactive({ rating: 5, content: '' });

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const getStatusText = (status) => {
  const map = { 'booked': 'Chờ khám', 'cancelled': 'Đã hủy', 'completed': 'Đã khám' };
  return map[status] || status;
};

const getStatusClass = (status) => {
  const map = { 'booked': 'bg-blue-100 text-blue-800', 'cancelled': 'bg-red-100 text-red-800', 'completed': 'bg-green-100 text-green-800' };
  return map[status] || '';
};

// Đã cập nhật logic load cả lịch khám và lịch sử feedback cùng lúc
const loadData = async () => {
  isLoading.value = true;
  try {
    const [appRes, fbRes] = await Promise.all([
      appointmentService.getMyAppointments(),
      userService.getMyFeedbacks()
    ]);

    appointments.value = appRes.data.appointments;

    // Lưu lại danh sách ID của các lịch khám đã có feedback
    const ids = fbRes.data.feedbacks.map(fb => fb.appointment._id || fb.appointment);
    feedbackedAppointmentIds.value = new Set(ids);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleCancel = async (id) => {
  if (!window.confirm('Xác nhận hủy lịch? Tiền sẽ hoàn lại vào ví.')) return;
  try {
    const res = await appointmentService.cancelAppointment(id);
    authStore.user.balance = res.data.balance;
    localStorage.setItem('user', JSON.stringify(authStore.user));
    loadData();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi hủy lịch');
  }
};

const openFeedback = (app) => {
  selectedApp.value = app;
  feedbackForm.rating = 5;
  feedbackForm.content = '';
};

const submitFeedback = async () => {
  try {
    await userService.submitFeedback({
      appointmentId: selectedApp.value._id,
      rating: Number(feedbackForm.rating),
      content: feedbackForm.content
    });
    alert('Cảm ơn bạn đã gửi phản hồi!');

    // Đổi trạng thái thành đã đánh giá ngay lập tức trên UI
    feedbackedAppointmentIds.value.add(selectedApp.value._id);

    selectedApp.value = null;
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi gửi phản hồi');
  }
};

onMounted(loadData);
</script>