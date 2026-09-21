<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-dark mb-1">Riwayat Transaksi</h2>
        <p class="text-muted mb-0 small">Semua catatan pemasukan dan pengeluaran keuangan kamu.</p>
      </div>
      <router-link to="/transactions/create" class="btn btn-primary rounded-pill px-3 shadow-sm">
        <i class="bi bi-plus-lg me-1"></i> Tambah Transaksi
      </router-link>
    </div>

    <!-- Alert Success or Error -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show small" role="alert">
      <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
      <button @click="successMessage = ''" type="button" class="btn-close"></button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show small" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
      <button @click="errorMessage = ''" type="button" class="btn-close"></button>
    </div>

    <!-- Filter & Search Card -->
    <div class="card card-custom p-3 bg-white mb-4">
      <div class="row g-2 align-items-center">
        <!-- Search Box -->
        <div class="col-md-5">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
            <input
              v-model="filters.search"
              @input="debounceFetch"
              type="text"
              class="form-control border-start-0"
              placeholder="Cari judul atau keterangan..."
            />
          </div>
        </div>

        <!-- Filter Tipe -->
        <div class="col-6 col-md-3">
          <select v-model="filters.type" @change="fetchTransactions" class="form-select">
            <option value="">Semua Tipe</option>
            <option value="INCOME">Pemasukan (+)</option>
            <option value="EXPENSE">Pengeluaran (-)</option>
          </select>
        </div>

        <!-- Reset Button -->
        <div class="col-6 col-md-4 d-flex justify-content-end gap-2">
          <button @click="resetFilters" class="btn btn-outline-secondary w-100 rounded-pill">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Memuat transaksi...</span>
      </div>
    </div>

    <!-- Content Table -->
    <div v-else class="card card-custom p-3 bg-white">
      <div v-if="transactions.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-folder-x fs-1 d-block mb-2 text-secondary opacity-50"></i>
        <p class="mb-2">Tidak ada data transaksi yang sesuai filter.</p>
        <router-link to="/transactions/create" class="btn btn-sm btn-primary rounded-pill px-3">
          Tambah Transaksi Sekarang
        </router-link>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light small text-muted text-uppercase">
            <tr>
              <th>Tanggal</th>
              <th>Transaksi</th>
              <th>Kategori</th>
              <th>Tipe</th>
              <th class="text-end">Nominal</th>
              <th class="text-center" style="width: 120px;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transactions" :key="item.id">
              <td class="small text-muted text-nowrap">
                {{ formatDate(item.date) }}
              </td>
              <td>
                <div class="fw-semibold text-dark">{{ item.title }}</div>
                <div v-if="item.description" class="text-muted small text-truncate" style="max-width: 250px;">
                  {{ item.description }}
                </div>
              </td>
              <td>
                <span class="badge rounded-pill bg-light text-secondary border px-2 py-1 small">
                  {{ item.category }}
                </span>
              </td>
              <td>
                <span class="badge rounded-pill small" :class="item.type === 'INCOME' ? 'badge-income' : 'badge-expense'">
                  {{ item.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran' }}
                </span>
              </td>
              <td class="text-end fw-bold text-nowrap" :class="item.type === 'INCOME' ? 'text-success' : 'text-danger'">
                {{ item.type === 'INCOME' ? '+' : '-' }} {{ formatRupiah(item.amount) }}
              </td>
              <td class="text-center">
                <div class="btn-group btn-group-sm">
                  <router-link
                    :to="`/transactions/edit/${item.id}`"
                    class="btn btn-outline-primary"
                    title="Edit"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </router-link>
                  <button
                    @click="deleteTransaction(item.id, item.title)"
                    class="btn btn-outline-danger"
                    title="Hapus"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Api from '../../services/api';
import { formatRupiah, formatDate } from '../../utils/formatters';

const transactions = ref([]);
const isLoading = ref(true);
const successMessage = ref('');
const errorMessage = ref('');

const filters = reactive({
  search: '',
  type: '',
});

let debounceTimer = null;
const debounceFetch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchTransactions();
  }, 400);
};

const resetFilters = () => {
  filters.search = '';
  filters.type = '';
  fetchTransactions();
};

const fetchTransactions = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;

    const response = await Api.get('/transactions', { params });
    transactions.value = response.data.data;
  } catch (error) {
    errorMessage.value = 'Gagal mengambil daftar transaksi.';
  } finally {
    isLoading.value = false;
  }
};

const deleteTransaction = async (id, title) => {
  if (!confirm(`Apakah kamu yakin ingin menghapus transaksi "${title}"?`)) {
    return;
  }

  try {
    await Api.delete(`/transactions/${id}`);
    successMessage.value = `Transaksi "${title}" berhasil dihapus.`;
    fetchTransactions();
  } catch (error) {
    errorMessage.value = 'Gagal menghapus transaksi.';
  }
};

onMounted(() => {
  fetchTransactions();
});
</script>
