<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý Bác sĩ</h2>
      <button @click="openAddModal" class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
        + Thêm Bác sĩ
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Bác sĩ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chuyên khoa</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng khám</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phí khám</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading" class="text-center">
            <td colspan="6" class="py-4">Đang tải...</td>
          </tr>
          <tr v-for="doctor in doctors" :key="doctor._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ doctor.fullName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ doctor.specialty?.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ doctor.clinic?.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ formatCurrency(doctor.consultationFee) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-1 text-xs rounded-full font-semibold">
                {{ doctor.isActive ? 'Hoạt động' : 'Đã ẩn' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(doctor)" class="text-indigo-600 hover:text-indigo-900 mr-3">Sửa</button>
              <button v-if="doctor.isActive" @click="handleDelete(doctor._id)"
                class="text-red-600 hover:text-red-900">Ẩn</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4">{{ editMode ? 'Cập nhật Bác sĩ' : 'Thêm Bác sĩ mới' }}</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Họ và Tên</label>
            <input v-model="form.fullName" type="text" required class="w-full border rounded px-3 py-2">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Chuyên khoa</label>
            <select v-model="form.specialty" required class="w-full border rounded px-3 py-2">
              <option v-for="s in specialties" :key="s._id" :value="s._id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Phòng khám</label>
            <select v-model="form.clinic" required class="w-full border rounded px-3 py-2">
              <option v-for="c in clinics" :key="c._id" :value="c._id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Phí khám (VNĐ)</label>
            <input v-model="form.consultationFee" type="number" required class="w-full border rounded px-3 py-2">
          </div>
          <div v-if="editMode" class="flex items-center mt-2">
            <input v-model="form.isActive" type="checkbox" class="mr-2 h-4 w-4 text-blue-600">
            <label class="text-sm font-medium">Hoạt động (Hiển thị trên hệ thống)</label>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="closeModal"
              class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Hủy</button>
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
import { doctorService } from '../../services/doctorService';

const doctors = ref([]);
const clinics = ref([]);
const specialties = ref([]);
const isLoading = ref(true);

const isModalOpen = ref(false);
const editMode = ref(false);
const currentDoctorId = ref(null);

const form = reactive({
  fullName: '',
  specialty: '',
  clinic: '',
  consultationFee: 100000,
  isActive: true
});

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [docRes, clinicRes, specRes] = await Promise.all([
      // Truyền tham số rỗng để lấy toàn bộ, kể cả bác sĩ đã ẩn (nếu backend bạn viết getDoctors có filter isActive, có thể cần chỉnh lại API backend xíu cho admin thấy cả người đã ẩn, tạm thời mình cứ gọi api thường)
      doctorService.getDoctors({}),
      doctorService.getClinics(),
      adminService.getSpecialties()
    ]);
    doctors.value = docRes.data.doctors;
    specialties.value = specRes.data.specialties;
    clinics.value = clinicRes.data.clinics;

  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  editMode.value = false;
  Object.assign(form, { fullName: '', specialty: '', clinic: '', consultationFee: 100000, isActive: true });
  isModalOpen.value = true;
};

const openEditModal = (doctor) => {
  editMode.value = true;
  currentDoctorId.value = doctor._id;
  Object.assign(form, {
    fullName: doctor.fullName,
    specialty: doctor.specialty?.name,
    clinic: doctor.clinic._id || doctor.clinic,
    consultationFee: doctor.consultationFee,
    isActive: doctor.isActive
  });
  console.log('Edit form data:', form);
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const handleSubmit = async () => {
  try {
    if (editMode.value) {
      await adminService.updateDoctor(currentDoctorId.value, form);
    } else {
      await adminService.createDoctor(form);
    }
    closeModal();
    fetchData(); // Reload table
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi xử lý');
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Bạn có chắc muốn ẩn bác sĩ này khỏi hệ thống?')) return;
  try {
    await adminService.deleteDoctor(id);
    fetchData();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi xóa bác sĩ');
  }
};

onMounted(fetchData);
</script>