<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Chuyên khoa</h2>
      <button @click="openAddModal" class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
        + Thêm Chuyên khoa
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Chuyên khoa</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading" class="text-center">
            <td colspan="3" class="py-4">Đang tải...</td>
          </tr>
          <tr v-for="item in specialties" :key="item._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.name }}</td>
            <td class="px-6 py-4 text-gray-500">{{ item.description || 'Không có mô tả' }}</td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <button @click="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900 ">Sửa</button>
              <button @click="handleDelete(item._id)" class="text-red-600 hover:text-red-900">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4">{{ editMode ? 'Cập nhật' : 'Thêm mới' }}</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tên chuyên khoa</label>
            <input v-model="form.name" type="text" required class="w-full border rounded px-3 py-2">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Mô tả (Tùy chọn)</label>
            <textarea v-model="form.description" rows="3" class="w-full border rounded px-3 py-2"></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 border text-gray-600">Hủy</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { adminService } from '../../services/adminService';

const specialties = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const editMode = ref(false);
const currentId = ref(null);

const form = reactive({ name: '', description: '' });

const fetchSpecialties = async () => {
  isLoading.value = true;
  try {
    const res = await adminService.getSpecialties();
    specialties.value = res.data.specialties;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  editMode.value = false;
  Object.assign(form, { name: '', description: '' });
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  editMode.value = true;
  currentId.value = item._id;
  Object.assign(form, { name: item.name, description: item.description });
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const handleSubmit = async () => {
  try {
    if (editMode.value) {
      await adminService.updateSpecialty(currentId.value, form);
    } else {
      await adminService.createSpecialty(form);
    }
    closeModal();
    fetchSpecialties();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi lưu dữ liệu');
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Chắc chắn xóa?')) return;
  try {
    await adminService.deleteSpecialty(id);
    fetchSpecialties();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi xóa (Có thể đang có bác sĩ dùng chuyên khoa này)');
  }
};

onMounted(fetchSpecialties);
</script>