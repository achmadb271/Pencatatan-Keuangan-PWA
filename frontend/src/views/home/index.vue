<template>
  <div class="row align-items-center py-5">
    <div class="col-lg-6 mb-4 mb-lg-0">
      <div class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill mb-3 fw-semibold">
        <i class="bi bi-stars me-1"></i> Fullstack Express + Vue 3 PWA
      </div>
      <h1 class="display-4 fw-bold text-dark mb-3">
        Kelola Keuangan Harian Lebih Cerdas & Praktis
      </h1>
      <p class="lead text-muted mb-4">
        Catat pemasukan dan pengeluaran kamu kapan saja dan di mana saja. Dilengkapi fitur Progressive Web App (PWA) yang bisa di-install langsung ke smartphone atau desktop kamu.
      </p>

      <div class="d-flex gap-3 flex-wrap">
        <router-link v-if="!isAuthenticated" to="/register" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm">
          <i class="bi bi-person-plus me-1"></i> Mulai Sekarang
        </router-link>
        <router-link v-else to="/dashboard" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm">
          <i class="bi bi-speedometer2 me-1"></i> Buka Dashboard
        </router-link>
        
        <router-link v-if="!isAuthenticated" to="/login" class="btn btn-outline-secondary btn-lg rounded-pill px-4">
          <i class="bi bi-box-arrow-in-right me-1"></i> Masuk Akun
        </router-link>
      </div>

      <div class="row mt-5 pt-3 border-top g-3">
        <div class="col-4">
          <h4 class="fw-bold text-dark mb-0">100%</h4>
          <span class="text-muted small">Gratis & Mandiri</span>
        </div>
        <div class="col-4">
          <h4 class="fw-bold text-primary mb-0">PWA</h4>
          <span class="text-muted small">Installable App</span>
        </div>
        <div class="col-4">
          <h4 class="fw-bold text-success mb-0">JWT</h4>
          <span class="text-muted small">Aman & Terenkripsi</span>
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="card card-custom p-4 bg-white">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <div class="fw-bold text-dark">
            <i class="bi bi-wallet2 text-primary me-2"></i> Pratinjau Dashboard
          </div>
          <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
            Aktif
          </span>
        </div>

        <div class="bg-primary text-white p-4 rounded-4 shadow-sm mb-3">
          <div class="small opacity-75">Total Saldo Kamu</div>
          <h2 class="fw-bold my-2">Rp 12.450.000</h2>
          <div class="d-flex justify-content-between pt-2 border-top border-white border-opacity-25 small">
            <div><i class="bi bi-arrow-down-left text-light"></i> Masuk: <strong>Rp 15.000.000</strong></div>
            <div><i class="bi bi-arrow-up-right text-light"></i> Keluar: <strong>Rp 2.550.000</strong></div>
          </div>
        </div>

        <div class="list-group list-group-flush border rounded-3 overflow-hidden">
          <div class="list-group-item d-flex justify-content-between align-items-center py-2">
            <div>
              <div class="fw-semibold small">Gaji Bulanan</div>
              <span class="badge badge-income rounded-pill" style="font-size: 0.7rem;">Pemasukan &bull; Gaji</span>
            </div>
            <span class="text-success fw-bold small">+ Rp 15.000.000</span>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center py-2">
            <div>
              <div class="fw-semibold small">Belanja Mingguan</div>
              <span class="badge badge-expense rounded-pill" style="font-size: 0.7rem;">Pengeluaran &bull; Makanan</span>
            </div>
            <span class="text-danger fw-bold small">- Rp 850.000</span>
          </div>
          <div class="list-group-item d-flex justify-content-between align-items-center py-2">
            <div>
              <div class="fw-semibold small">Bayar Tagihan Listrik & Internet</div>
              <span class="badge badge-expense rounded-pill" style="font-size: 0.7rem;">Pengeluaran &bull; Tagihan</span>
            </div>
            <span class="text-danger fw-bold small">- Rp 1.700.000</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Cookies from 'js-cookie';

const isAuthenticated = computed(() => !!Cookies.get('token'));
</script>
