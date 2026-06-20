<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto space-y-6">

      <div class="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-blue-600 text-white rounded-xl p-6 flex flex-col justify-between shadow-lg">
          <div>
            <p class="text-blue-100 font-medium mb-1">Số dư hiện tại</p>
            <h3 class="text-4xl font-bold">{{ formatCurrency(authStore.user?.balance || 0) }}</h3>
          </div>
          <p class="text-sm text-blue-200 mt-4">* Số dư được sử dụng để thanh toán phí đặt lịch khám bệnh trực tuyến.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-4">Nạp tiền vào tài khoản</h3>
          <form @submit.prevent="handleDeposit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nhập số tiền cần nạp (VNĐ)</label>
              <input v-model="depositAmount" type="number" min="10000" step="10000" required placeholder="VD: 100000"
                class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <button type="submit" :disabled="isProcessing"
              class="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition">
              {{ isProcessing ? 'Đang xử lý...' : 'Xác nhận Nạp tiền' }}
            </button>
          </form>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b">
          <h3 class="text-lg font-bold text-gray-900">Lịch sử Giao dịch</h3>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày giờ</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại giao dịch</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="isLoading" class="text-center">
              <td colspan="4" class="py-4">Đang tải...</td>
            </tr>
            <tr v-else-if="transactions.length === 0" class="text-center">
              <td colspan="4" class="py-4 text-gray-500">Chưa có giao dịch nào.</td>
            </tr>

            <tr v-for="txn in transactions" :key="txn._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new
                Date(txn.createdAt).toLocaleString('vi-VN') }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="txn.type === 'deposit'" class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Nạp
                  tiền</span>
                <span v-else-if="txn.type === 'payment'"
                  class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Thanh toán</span>
                <span v-else class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Hoàn tiền</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-bold"
                :class="txn.type === 'payment' ? 'text-red-600' : 'text-green-600'">
                {{ txn.type === 'payment' ? '-' : '+' }}{{ formatCurrency(txn.amount) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ txn.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
const depositAmount = ref('');
const transactions = ref([]);
const isProcessing = ref(false);
const isLoading = ref(true);

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const res = await userService.getTransactions();
    transactions.value = res.data.transactions;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleDeposit = async () => {
  if (!depositAmount.value || depositAmount.value <= 0) return;
  isProcessing.value = true;
  try {
    const res = await userService.depositMoney(depositAmount.value);
    alert('Nạp tiền thành công!');

    // Cập nhật state và localStorage
    authStore.user.balance = res.data.balance;
    localStorage.setItem('user', JSON.stringify(authStore.user));

    depositAmount.value = '';
    fetchTransactions();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi nạp tiền');
  } finally {
    isProcessing.value = false;
  }
};

onMounted(fetchTransactions);
</script>