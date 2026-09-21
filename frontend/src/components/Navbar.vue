<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-wallet2 fs-4"></i>
        <span>ExpenseTracker</span>
        <span class="badge bg-white text-primary rounded-pill small" style="font-size: 0.65rem;">PWA</span>
      </router-link>

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul v-if="isAuthenticated" class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="active">
              <i class="bi bi-speedometer2 me-1"></i> Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transactions" class="nav-link" active-class="active">
              <i class="bi bi-receipt me-1"></i> Transaksi
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/transactions/create" class="nav-link" active-class="active">
              <i class="bi bi-plus-circle me-1"></i> Tambah Baru
            </router-link>
          </li>
        </ul>

        <div class="ms-auto d-flex align-items-center gap-2">
          <template v-if="isAuthenticated">
            <span class="text-white-50 small me-2 d-none d-md-inline">
              Halo, <strong class="text-white">{{ user?.name || 'Pengguna' }}</strong>
            </span>
            <button @click="handleLogout" class="btn btn-sm btn-outline-light rounded-pill px-3">
              <i class="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-sm btn-light text-primary rounded-pill px-3 fw-bold">
              Login
            </router-link>
            <router-link to="/register" class="btn btn-sm btn-outline-light rounded-pill px-3">
              Register
            </router-link>
          </template>
        </div>
      </div>
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

const user = computed(() => {
  const userCookie = Cookies.get('user');
  if (!userCookie) return null;
  try {
    return JSON.parse(userCookie);
  } catch (e) {
    return null;
  }
});

const handleLogout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  router.push({ name: 'login' });
};
</script>
