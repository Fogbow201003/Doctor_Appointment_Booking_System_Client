<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Đăng Nhập</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="authStore.error" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ authStore.error }}
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input v-model="email" type="email" required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập email của bạn">
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
          <input v-model="password" type="password" required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mật khẩu">
        </div>

        <button type="submit" :disabled="authStore.isLoading"
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex justify-center items-center disabled:opacity-50">
          <svg v-if="authStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ authStore.isLoading ? 'Đang xử lý...' : 'Đăng Nhập' }}
        </button>
      </form>

      <p class="text-center mt-4 text-sm text-gray-600">
        Chưa có tài khoản?
        <router-link to="/register" class="text-blue-600 hover:underline">Đăng ký ngay</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    const { user } = await authStore.login({ email: email.value, password: password.value });
    if (user.role === 'admin') {
      router.push('/admin/dashboard'); // Đẩy về dashboard admin nếu là admin
    } else {
      router.push('/'); // Đẩy về trang chủ nếu là bệnh nhân
    }
  } catch (error) {
    console.error('Lỗi login:', error);
  }
};
</script>