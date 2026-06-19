<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Tổng quan Hệ thống</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Tổng số Bệnh nhân</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.totalUsers }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Lịch hẹn Đã đặt</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.bookedAppointments }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 flex items-center">
        <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z">
            </path>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500 font-medium">Tổng Feedback</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.totalFeedbacks }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4">Các bước khởi tạo dữ liệu hệ thống:</h3>
      <ol class="list-decimal list-inside space-y-2 text-gray-600">
        <li>Thêm ít nhất 1 <strong>Phòng khám</strong> (Dùng Postman hoặc MongoDB Compass do chưa có giao diện).</li>
        <li>Chuyển sang tab <strong>Quản lý Bác sĩ</strong> để thêm mới bác sĩ và gán vào Phòng khám.</li>
        <li>Tạo tài khoản Patient ở giao diện bên ngoài.</li>
        <li>Patient tiến hành đặt lịch, khi đó lịch hẹn sẽ đổ về tab <strong>Quản lý Lịch hẹn</strong>.</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { adminService } from '../../services/adminService';

const stats = reactive({
  totalUsers: 0,
  bookedAppointments: 0,
  totalFeedbacks: 0
});

const loadStats = async () => {
  try {
    const [usersRes, appRes, feedbackRes] = await Promise.all([
      adminService.getAllUsers(),
      adminService.getAllAppointments({ status: 'booked' }),
      adminService.getAllFeedbacks()
    ]);

    stats.totalUsers = usersRes.data.users.length;
    stats.bookedAppointments = appRes.data.appointments.length;
    stats.totalFeedbacks = feedbackRes.data.feedbacks.length;
  } catch (error) {
    console.error('Lỗi khi tải thống kê:', error);
  }
};

onMounted(loadStats);
</script>