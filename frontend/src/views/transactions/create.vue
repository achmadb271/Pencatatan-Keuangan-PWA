<template>
  <div class="row justify-content-center">
    <div class="col-lg-7">
      <div class="d-flex align-items-center mb-3">
        <router-link to="/transactions" class="btn btn-sm btn-outline-secondary rounded-circle me-3 p-2 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
          <i class="bi bi-arrow-left"></i>
        </router-link>
        <div>
          <h3 class="fw-bold text-dark mb-0">Catat Transaksi Baru</h3>
          <p class="text-muted small mb-0">Simpan arus kas pengeluaran atau pemasukan kamu</p>
        </div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show small" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
        <button @click="errorMessage = ''" type="button" class="btn-close"></button>
      </div>

      <div class="card card-custom p-4 bg-white">
        <form @submit.prevent="handleSubmit">
          <!-- Transaction Type Toggle -->
          <div class="mb-4">
            <label class="form-label small fw-semibold">Tipe Transaksi</label>
            <div class="row g-2">
              <div class="col-6">
                <input
                  type="radio"
                  class="btn-check"
                  name="type"
                  id="typeExpense"
                  value="EXPENSE"
                  v-model="form.type"
                  @change="onTypeChange"
                />
                <label class="btn btn-outline-danger w-100 py-3 rounded-3 fw-bold d-flex flex-column align-items-center gap-1" for="typeExpense">
                  <i class="bi bi-arrow-up-right fs-4"></i>
                  <span>Pengeluaran</span>
                </label>
              </div>
              <div class="col-6">
                <input
                  type="radio"
                  class="btn-check"
                  name="type"
                  id="typeIncome"
                  value="INCOME"
                  v-model="form.type"
                  @change="onTypeChange"
                />
                <label class="btn btn-outline-success w-100 py-3 rounded-3 fw-bold d-flex flex-column align-items-center gap-1" for="typeIncome">
                  <i class="bi bi-arrow-down-left fs-4"></i>
                  <span>Pemasukan</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Judul -->
          <div class="mb-3">
            <label class="form-label small fw-semibold">Judul Transaksi</label>
            <input
              v-model="form.title"
              type="text"
              class="form-control"
              placeholder="Contoh: Beli Kopi & Makan Siang"
              required
            />
            <div v-if="validationErrors.title" class="text-danger small mt-1">
              {{ validationErrors.title }}
            </div>
          </div>

          <!-- Nominal -->
          <div class="mb-3">
            <label class="form-label small fw-semibold">Nominal (Rp)</label>
            <div class="input-group">
              <span class="input-group-text bg-light">Rp</span>
              <input
                v-model="form.amount"
                type="number"
                min="1"
                step="any"
                class="form-control"
                placeholder="0"
                required
              />
            </div>
            <div v-if="form.amount" class="form-text text-primary small">
              Terbaca: <strong>{{ formatRupiah(form.amount) }}</strong>
            </div>
            <div v-if="validationErrors.amount" class="text-danger small mt-1">
              {{ validationErrors.amount }}
            </div>
          </div>

          <!-- Kategori & Tanggal -->
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label small fw-semibold">Kategori</label>
              <select v-model="form.category" class="form-select" required>
                <option value="" disabled>Pilih Kategori</option>
                <option
                  v-for="cat in availableCategories"
                  :key="cat.label"
                  :value="cat.label"
                >
                  {{ cat.label }}
                </option>
              </select>
              <div v-if="validationErrors.category" class="text-danger small mt-1">
                {{ validationErrors.category }}
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-semibold">Tanggal Transaksi</label>
              <input
                v-model="form.date"
                type="date"
                class="form-control"
                required
              />
              <div v-if="validationErrors.date" class="text-danger small mt-1">
                {{ validationErrors.date }}
              </div>
            </div>
          </div>

          <!-- Catatan / Deskripsi -->
          <div class="mb-4">
            <label class="form-label small fw-semibold">Catatan Tambahan (Opsional)</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="form-control"
              placeholder="Tulis catatan atau keterangan transaksi..."
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="d-flex justify-content-end gap-2">
            <router-link to="/transactions" class="btn btn-outline-secondary rounded-pill px-4">
              Batal
            </router-link>
            <button
              type="submit"
              :disabled="isLoading"
              class="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Transaksi' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Api from '../../services/api';
import { formatRupiah, categories } from '../../utils/formatters';

const router = useRouter();

const today = new Date().toISOString().split('T')[0];

const form = reactive({
  title: '',
  amount: '',
  type: 'EXPENSE',
  category: 'Makanan & Minuman',
  date: today,
  description: '',
});

const isLoading = ref(false);
const errorMessage = ref('');
const validationErrors = reactive({});

const availableCategories = computed(() => {
  return categories[form.type] || [];
});

const onTypeChange = () => {
  if (form.type === 'INCOME') {
    form.category = 'Gaji & Upah';
  } else {
    form.category = 'Makanan & Minuman';
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  Object.keys(validationErrors).forEach((k) => delete validationErrors[k]);

  try {
    await Api.post('/transactions', {
      title: form.title,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
      description: form.description,
    });

    router.push({ name: 'transactions.index' });
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const errs = error.response.data.errors;
      if (Array.isArray(errs)) {
        errs.forEach((e) => {
          validationErrors[e.path] = e.msg;
        });
      }
    } else if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Terjadi kesalahan saat menyimpan data transaksi.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
