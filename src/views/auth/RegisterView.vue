<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">Đăng Ký Tài Khoản</h2>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div v-if="authStore.error" class="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ authStore.error }}
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Họ và Tên</label>
          <input v-model="form.fullName" type="text" required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Số điện thoại</label>
          <input v-model="form.phone" type="tel"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input v-model="form.email" type="email" required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
          <input v-model="form.password" type="password" required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <button type="submit" :disabled="authStore.isLoading"
          class="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 flex justify-center items-center disabled:opacity-50">
          <svg v-if="authStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ authStore.isLoading ? 'Đang xử lý...' : 'Đăng Ký' }}
        </button>
      </form>

      <p class="text-center mt-4 text-sm text-gray-600">
        Đã có tài khoản?
        <router-link to="/login" class="text-blue-600 hover:underline">Đăng nhập</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  password: ''
});

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    await authStore.register(form);
    router.push('/'); // Đẩy về trang chủ sau khi đăng ký thành công
  } catch (error) {
    console.error('Lỗi register:', error);
  }
};
</script>