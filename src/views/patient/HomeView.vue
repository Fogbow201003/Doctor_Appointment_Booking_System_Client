<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <main class="flex-1">
      <div class="bg-blue-600 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 pr-0 md:pr-10 text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Chăm sóc sức khỏe thông minh & Tiện lợi
            </h1>
            <p class="text-lg md:text-xl text-blue-100 mb-8">
              Hệ thống đặt lịch khám bệnh trực tuyến tại 3 khu vực phòng khám. Lựa chọn bác sĩ, xem lịch trống và thanh
              toán
              nhanh chóng chỉ với vài cú click.
            </p>
            <div class="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
              <router-link to="find-doctor"
                class="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg text-lg">
                Đặt Lịch Ngay
              </router-link>
              <a href="#features"
                class="border border-white text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition text-lg text-center">
                Tìm hiểu thêm
              </a>
            </div>
          </div>
          <div class="md:w-1/2 mt-12 md:mt-0 flex justify-center">
            <div class="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <h1 class="w-64 h-64 md:w-80 md:h-80 rounded-full shadow-2xl object-cover bg-white">
                <span
                  class="d-block text-cyan-500 w-full h-full flex items-center justify-center font-bold font-size: 2rem;">Logo
                  here</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div id="features" class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-12">Tại sao chọn chúng tôi?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div
                class="w-14 h-14 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Chủ động thời gian</h3>
              <p class="text-gray-600">Dễ dàng theo dõi lịch trống của bác sĩ và đặt trước các khung giờ phù hợp với
                bạn.
              </p>
            </div>
            <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div
                class="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.963 11.963 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                  </path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Thông tin minh bạch</h3>
              <p class="text-gray-600">Niêm yết rõ ràng phòng khám, thông tin chuyên khoa và mức phí khám của từng bác
                sĩ.
              </p>
            </div>
            <div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div
                class="w-14 h-14 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Thanh toán liền mạch</h3>
              <p class="text-gray-600">Tích hợp nạp tiền và trừ phí tự động. Hoàn tiền 100% nếu bạn thao tác hủy lịch
                hợp
                lệ.</p>
            </div>
          </div>
        </div>
      </div>
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

<style scoped>
/* Chức năng smooth scrolling cho nút anchor link (#features) */
html {
  scroll-behavior: smooth;
}
</style>