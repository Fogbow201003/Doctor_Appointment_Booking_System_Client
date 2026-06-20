<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-blue-700 text-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Cổng Thông Tin Bác Sĩ</h1>
        <div class="flex items-center space-x-4">
          <span class="font-medium">BS. {{ authStore.user?.fullName }}</span>
          <button @click="handleLogout"
            class="bg-blue-800 hover:bg-blue-900 px-3 py-1.5 rounded text-sm transition">Đăng xuất</button>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <router-view></router-view>
    </main>
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