<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Chi nhánh Phòng khám</h2>
      <button @click="openAddModal"
        class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
        + Thêm Chi nhánh mới
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Chi nhánh</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ làm việc</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading" class="text-center">
            <td colspan="5" class="py-6 text-gray-500">Đang tải dữ liệu...</td>
          </tr>
          <tr v-for="clinic in clinics" :key="clinic._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">{{ clinic.name }}</td>
            <td class="px-6 py-4 text-gray-500">{{ clinic.address }}</td>
            <td class="px-6 py-4 text-gray-500">{{ clinic.phone || 'Chưa cập nhật' }}</td>
            <td class="px-6 py-4 text-gray-500">{{ clinic.workingHours }}</td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button @click="openEditModal(clinic)" class="text-indigo-600 hover:text-indigo-900">Chỉnh sửa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4">{{ editMode ? 'Cập nhật Chi nhánh' : 'Thêm Chi nhánh mới' }}</h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tên Chi nhánh / Phòng khám</label>
            <input v-model="form.name" type="text" required placeholder="VD: Phòng khám Cơ sở 1"
              class="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Địa chỉ cụ thể</label>
            <textarea v-model="form.address" required rows="2"
              class="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Số điện thoại Hotline</label>
            <input v-model="form.phone" type="tel"
              class="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Khung giờ làm việc</label>
            <input v-model="form.workingHours" type="text" placeholder="VD: 07:00 - 17:00"
              class="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="closeModal"
              class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Hủy bỏ</button>
            <button type="submit" :disabled="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {{ isSubmitting ? 'Đang lưu...' : 'Lưu thông tin' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { adminService } from '../../services/adminService';

const clinics = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const isModalOpen = ref(false);
const editMode = ref(false);
const currentClinicId = ref(null);

const form = reactive({
  name: '',
  address: '',
  phone: '',
  workingHours: '07:00 - 17:00'
});

const fetchClinics = async () => {
  isLoading.value = true;
  try {
    const res = await adminService.getClinics();
    clinics.value = res.data.clinics;
  } catch (error) {
    console.error('Lỗi khi tải phòng khám:', error);
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  editMode.value = false;
  Object.assign(form, { name: '', address: '', phone: '', workingHours: '07:00 - 17:00' });
  isModalOpen.value = true;
};

const openEditModal = (clinic) => {
  editMode.value = true;
  currentClinicId.value = clinic._id;
  Object.assign(form, {
    name: clinic.name,
    address: clinic.address,
    phone: clinic.phone || '',
    workingHours: clinic.workingHours || '07:00 - 17:00'
  });
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (editMode.value) {
      await adminService.updateClinic(currentClinicId.value, form);
    } else {
      await adminService.createClinic(form);
    }
    closeModal();
    fetchClinics();
  } catch (error) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin chi nhánh');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchClinics);
</script>