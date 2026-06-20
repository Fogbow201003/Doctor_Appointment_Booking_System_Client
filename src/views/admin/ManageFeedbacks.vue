<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Quản lý Phản Hồi Khách Hàng</h2>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bác sĩ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading" class="text-center">
            <td colspan="5" class="py-6">Đang tải...</td>
          </tr>
          <tr v-for="fb in feedbacks" :key="fb._id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ fb.patient?.fullName }}</div>
              <div class="text-xs text-gray-500">{{ fb.patient?.email }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">BS. {{ fb.doctor?.fullName }}</td>
            <td class="px-6 py-4">
              <div class="flex text-yellow-400 text-sm">
                <span v-for="i in fb.rating" :key="i">★</span>
              </div>
              <div class="text-xs text-gray-600 mt-1 truncate max-w-xs">{{ fb.content }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="fb.adminReply ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                class="px-2 py-1 text-xs rounded-full">
                {{ fb.adminReply ? 'Đã trả lời' : 'Chờ xử lý' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button @click="openReplyModal(fb)" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Xem
                & Trả lời</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedFb" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-lg p-6">
        <h3 class="text-xl font-bold mb-4">Chi tiết Phản hồi</h3>
        <div class="bg-gray-50 p-4 rounded mb-4">
          <p class="text-sm"><strong>Khách hàng:</strong> {{ selectedFb.patient?.fullName }}</p>
          <p class="text-sm mt-2"><strong>Đánh giá:</strong> {{ selectedFb.rating }} / 5 Sao</p>
          <p class="text-sm mt-2 italic">"{{ selectedFb.content }}"</p>
        </div>

        <form @submit.prevent="submitReply">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Nội dung phản hồi từ Admin (Sẽ gửi Email cho khách)</label>
            <textarea v-model="replyContent" required rows="3" :disabled="!!selectedFb.adminReply"
              class="w-full border rounded px-3 py-2 disabled:bg-gray-100"></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="selectedFb = null" class="px-4 py-2 border rounded">Đóng</button>
            <button v-if="!selectedFb.adminReply" type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Gửi Email Trả lời
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminService } from '../../services/adminService';

const feedbacks = ref([]);
const isLoading = ref(true);
const selectedFb = ref(null);
const replyContent = ref('');

const fetchFeedbacks = async () => {
  isLoading.value = true;
  try {
    const res = await adminService.getAllFeedbacks();
    feedbacks.value = res.data.feedbacks;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const openReplyModal = (fb) => {
  selectedFb.value = fb;
  replyContent.value = fb.adminReply || '';
};

const submitReply = async () => {
  try {
    await adminService.replyFeedback(selectedFb.value._id, replyContent.value);
    alert('Đã gửi phản hồi thành công qua Email!');
    selectedFb.value = null;
    fetchFeedbacks();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi gửi phản hồi');
  }
};

onMounted(fetchFeedbacks);
</script>