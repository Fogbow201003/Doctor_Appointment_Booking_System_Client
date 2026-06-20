<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div class="flex items-center space-x-2 cursor-pointer" @click="router.push('/')">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
            </path>
          </svg>
          <span class="text-xl font-bold text-blue-600">MediCare Booking</span>
        </div>

        <nav class="hidden md:flex space-x-8">
          <router-link to="/" class="text-gray-500 hover:text-blue-600 font-medium transition"
            exact-active-class="text-gray-900 border-b-2 border-blue-600">Trang chủ</router-link>
          <router-link to="/find-doctor" class="text-gray-500 hover:text-blue-600 font-medium transition"
            active-class="text-gray-900 border-b-2 border-blue-600">Tìm Bác Sĩ</router-link>
          <router-link v-if="authStore.isAuthenticated" to="/history"
            class="text-gray-500 hover:text-blue-600 font-medium transition"
            active-class="text-gray-900 border-b-2 border-blue-600">Lịch sử khám</router-link>
          <router-link v-if="authStore.isAuthenticated" to="/deposit"
            class="text-gray-500 hover:text-blue-600 font-medium transition"
            active-class="text-gray-900 border-b-2 border-blue-600">Ví của tôi</router-link>
        </nav>

        <div class="flex items-center space-x-4">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="text-gray-600 hover:text-blue-600 font-medium transition">Đăng
              nhập</router-link>
            <router-link to="/register"
              class="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">Đăng
              ký</router-link>
          </template>
          <template v-else>
            <span class="text-sm text-gray-600 font-medium">Chào, {{ authStore.user?.fullName }}</span>
            <button @click="handleLogout"
              class="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md font-medium transition">Đăng xuất</button>
          </template>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-800 text-white py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-400">&copy; 2026 Hệ thống đặt lịch khám bệnh thông minh (Doctor Appointment Booking System).
          Đồ
          án môn học.</p>
        <p class="text-gray-500 text-sm mt-2">Thực hiện bởi: Nguyễn Văn Thành Đạt & Nguyễn Phan Văn Huy & Trần Minh
          Thắng
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>