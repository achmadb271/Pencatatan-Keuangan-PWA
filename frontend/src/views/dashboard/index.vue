<template>
  <div>
    <!-- Header Greeting -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h2 class="fw-bold text-dark mb-1">Dashboard Keuangan</h2>
        <p class="text-muted mb-0 small">Pantau ringkasan saldo, pemasukan, dan pengeluaran kamu.</p>
      </div>
      <div class="d-flex gap-2">
        <router-link to="/transactions/create" class="btn btn-primary rounded-pill shadow-sm px-3">
          <i class="bi bi-plus-lg me-1"></i> Catat Transaksi
        </router-link>
        <button @click="fetchSummary" :disabled="isLoading" class="btn btn-outline-secondary rounded-pill px-3">
          <i class="bi bi-arrow-clockwise" :class="{ 'spin-icon': isLoading }"></i>
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
      <button @click="errorMessage = ''" type="button" class="btn-close"></button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Memuat data...</span>
      </div>
      <div class="text-muted small mt-2">Menyiapkan ringkasan data keuanganmu...</div>
    </div>

    <div v-else>
      <!-- Summary Cards -->
      <div class="row g-3 mb-4">
        <!-- Saldo Card -->
        <div class="col-md-4">
          <div class="card card-custom p-4 text-white bg-primary position-relative overflow-hidden">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="small text-white-50 fw-semibold text-uppercase">Total Saldo Bersih</span>
              <div class="p-2 bg-white bg-opacity-25 rounded-circle">
                <i class="bi bi-wallet2 fs-5"></i>
              </div>
            </div>
            <h3 class="fw-bold mb-1">{{ formatRupiah(summary.totalBalance) }}</h3>
            <span class="small opacity-75">
              {{ summary.totalBalance >= 0 ? 'Kondisi kas surplus' : 'Kondisi kas defisit' }}
            </span>
          </div>
        </div>

        <!-- Total Pemasukan -->
        <div class="col-md-4">
          <div class="card card-custom p-4 bg-white border-start border-success border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="small text-muted fw-semibold text-uppercase">Total Pemasukan</span>
              <div class="p-2 bg-success bg-opacity-10 text-success rounded-circle">
                <i class="bi bi-arrow-down-left fs-5"></i>
              </div>
            </div>
            <h3 class="fw-bold text-success mb-1">{{ formatRupiah(summary.totalIncome) }}</h3>
            <span class="small text-muted">Akumulasi seluruh pemasukan</span>
          </div>
        </div>

        <!-- Total Pengeluaran -->
        <div class="col-md-4">
          <div class="card card-custom p-4 bg-white border-start border-danger border-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="small text-muted fw-semibold text-uppercase">Total Pengeluaran</span>
              <div class="p-2 bg-danger bg-opacity-10 text-danger rounded-circle">
                <i class="bi bi-arrow-up-right fs-5"></i>
              </div>
            </div>
            <h3 class="fw-bold text-danger mb-1">{{ formatRupiah(summary.totalExpense) }}</h3>
            <span class="small text-muted">Akumulasi seluruh pengeluaran</span>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Recent Transactions -->
        <div class="col-lg-8">
          <div class="card card-custom p-4 bg-white">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-dark mb-0">
                <i class="bi bi-clock-history text-primary me-2"></i> Transaksi Terbaru
              </h5>
              <router-link to="/transactions" class="btn btn-sm btn-link text-primary text-decoration-none fw-semibold p-0">
                Lihat Semua <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>

            <div v-if="!summary.recentTransactions || summary.recentTransactions.length === 0" class="text-center py-5 text-muted">
              <i class="bi bi-receipt-cutoff fs-1 d-block mb-2 text-secondary opacity-50"></i>
              <p class="mb-2">Belum ada catatan transaksi tersimpan.</p>
              <router-link to="/transactions/create" class="btn btn-sm btn-primary rounded-pill px-3">
                Catat Transaksi Pertama
              </router-link>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light small text-muted text-uppercase">
                  <tr>
                    <th>Transaksi</th>
                    <th>Kategori</th>
                    <th>Tanggal</th>
                    <th class="text-end">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in summary.recentTransactions" :key="item.id">
                    <td>
                      <div class="fw-semibold text-dark">{{ item.title }}</div>
                      <div v-if="item.description" class="text-muted small text-truncate" style="max-width: 200px;">
                        {{ item.description }}
                      </div>
                    </td>
                    <td>
                      <span class="badge rounded-pill bg-light text-secondary border px-2 py-1 small">
                        {{ item.category }}
                      </span>
                    </td>
                    <td class="small text-muted">
                      {{ formatDate(item.date) }}
                    </td>
                    <td class="text-end fw-bold" :class="item.type === 'INCOME' ? 'text-success' : 'text-danger'">
                      {{ item.type === 'INCOME' ? '+' : '-' }} {{ formatRupiah(item.amount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="col-lg-4">
          <div class="card card-custom p-4 bg-white">
            <h5 class="fw-bold text-dark mb-3">
              <i class="bi bi-pie-chart text-primary me-2"></i> Rincian Kategori
            </h5>

            <div v-if="!summary.categoryBreakdown || summary.categoryBreakdown.length === 0" class="text-center py-4 text-muted small">
              Belum ada data rincian kategori.
            </div>

            <div v-else class="d-flex flex-column gap-3">
              <div v-for="cat in summary.categoryBreakdown" :key="cat.category" class="p-2 border rounded-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-semibold small text-dark">{{ cat.category }}</span>
                  <span class="badge rounded-pill small" :class="cat.type === 'INCOME' ? 'badge-income' : 'badge-expense'">
                    {{ cat.type === 'INCOME' ? 'Masuk' : 'Keluar' }}
                  </span>
                </div>
                <div class="d-flex justify-content-between align-items-center small text-muted">
                  <span>{{ cat.count }} transaksi</span>
                  <span class="fw-bold" :class="cat.type === 'INCOME' ? 'text-success' : 'text-danger'">
                    {{ formatRupiah(cat.total) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Api from '../../services/api';
import { formatRupiah, formatDate } from '../../utils/formatters';

const summary = ref({
  totalBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
  totalCount: 0,
  recentTransactions: [],
  categoryBreakdown: [],
});

const isLoading = ref(true);
const errorMessage = ref('');

const fetchSummary = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await Api.get('/transactions/summary');
    summary.value = response.data.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Gagal memuat ringkasan data transaksi.';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchSummary();
});
</script>

<style scoped>
.spin-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
