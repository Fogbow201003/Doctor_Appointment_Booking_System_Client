<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-slate-800 text-white flex flex-col">
      <div class="p-6 border-b border-slate-700">
        <h1 class="text-2xl font-bold text-blue-400">Clinic Admin</h1>
        <p class="text-sm text-slate-400 mt-1">Xin chào, {{ authStore.user?.fullName }}</p>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <router-link to="/admin/dashboard"
          class="block py-2.5 px-4 rounded transition hover:bg-slate-700 hover:text-white"
          active-class="bg-blue-600 text-white">
          Tổng quan
        </router-link>
        <router-link to="/admin/clinics"
          class="block py-2.5 px-4 rounded transition hover:bg-slate-700 hover:text-white"
          active-class="bg-blue-600 text-white">
          Quản lý Phòng khám
        </router-link>
        <router-link to="/admin/specialties"
          class="block py-2.5 px-4 rounded transition hover:bg-slate-700 hover:text-white"
          active-class="bg-blue-600 text-white">
          Quản lý Chuyên khoa
        </router-link>
        <router-link to="/admin/doctors"
          class="block py-2.5 px-4 rounded transition hover:bg-slate-700 hover:text-white"
          active-class="bg-blue-600 text-white">
          Quản lý Bác sĩ
        </router-link>
        <router-link to="/admin/appointments"
          class="block py-2.5 px-4 rounded transition hover:bg-slate-700 hover:text-white"
          active-class="bg-blue-600 text-white">
          Quản lý Lịch hẹn
        </router-link>
        <router-link to="/admin/feedbacks"
          class="block py-2.5 px-4 rounded transition hover:bg-slate-700 hover:text-white"
          active-class="bg-blue-600 text-white">Quản lý Phản hồi</router-link>
      </nav>

      <div class="p-4 border-t border-slate-700">
        <button @click="handleLogout"
          class="w-full flex items-center text-red-400 hover:text-red-300 hover:bg-slate-700 px-4 py-2 rounded transition">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
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