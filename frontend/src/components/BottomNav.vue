<template>
  <nav v-if="isAuthenticated" class="d-lg-none fixed-bottom bg-white border-top py-2 shadow">
    <div class="container d-flex justify-content-around align-items-center">
      <router-link to="/dashboard" class="d-flex flex-column align-items-center text-decoration-none small text-secondary" active-class="text-primary fw-bold">
        <i class="bi bi-speedometer2 fs-5"></i>
        <span style="font-size: 0.72rem;">Beranda</span>
      </router-link>

      <router-link to="/transactions" class="d-flex flex-column align-items-center text-decoration-none small text-secondary" active-class="text-primary fw-bold">
        <i class="bi bi-receipt fs-5"></i>
        <span style="font-size: 0.72rem;">Transaksi</span>
      </router-link>

      <router-link to="/transactions/create" class="d-flex flex-column align-items-center text-decoration-none text-primary" active-class="fw-bold">
        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 42px; height: 42px; margin-top: -15px;">
          <i class="bi bi-plus-lg fs-5"></i>
        </div>
        <span class="small text-primary mt-1" style="font-size: 0.72rem;">Catat</span>
      </router-link>

      <a href="#" @click.prevent="handleLogout" class="d-flex flex-column align-items-center text-decoration-none small text-secondary">
        <i class="bi bi-box-arrow-right fs-5"></i>
        <span style="font-size: 0.72rem;">Keluar</span>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const router = useRouter();
const token = computed(() => Cookies.get('token'));
const isAuthenticated = computed(() => !!token.value);

const handleLogout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  router.push({ name: 'login' });
};
</script>
