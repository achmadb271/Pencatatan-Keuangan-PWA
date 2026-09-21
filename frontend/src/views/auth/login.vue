<template>
  <div class="row justify-content-center py-4">
    <div class="col-md-6 col-lg-5">
      <div class="card card-custom p-4 bg-white">
        <div class="text-center mb-4">
          <div class="d-inline-flex p-3 bg-primary bg-opacity-10 rounded-circle text-primary mb-2">
            <i class="bi bi-person-fill-lock fs-2"></i>
          </div>
          <h3 class="fw-bold">Masuk ke Akun</h3>
          <p class="text-muted small">Kelola pencatatan keuangan pribadi kamu</p>
        </div>

        <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show small" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ errorMessage }}
          <button @click="errorMessage = ''" type="button" class="btn-close"></button>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Alamat Email</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-envelope"></i></span>
              <input
                v-model="form.email"
                type="email"
                class="form-control border-start-0"
                placeholder="nama@email.com"
                required
              />
            </div>
            <div v-if="validationErrors.email" class="text-danger small mt-1">
              {{ validationErrors.email }}
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-semibold">Kata Sandi</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0"><i class="bi bi-key"></i></span>
              <input
                v-model="form.password"
                type="password"
                class="form-control border-start-0"
                placeholder="••••••••"
                required
              />
            </div>
            <div v-if="validationErrors.password" class="text-danger small mt-1">
              {{ validationErrors.password }}
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="btn btn-primary w-100 rounded-pill py-2 fw-semibold shadow-sm"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <span>{{ isLoading ? 'Memproses...' : 'Masuk Sekarang' }}</span>
          </button>
        </form>

        <div class="text-center mt-4 pt-3 border-top small text-muted">
          Belum punya akun?
          <router-link to="/register" class="text-primary fw-semibold text-decoration-none">
            Daftar Sekarang
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import Api from '../../services/api';

const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref('');
const validationErrors = reactive({});

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  Object.keys(validationErrors).forEach((key) => delete validationErrors[key]);

  try {
    const response = await Api.post('/login', {
      email: form.email,
      password: form.password,
    });

    const { token, user } = response.data.data;

    // Save token & user profile in cookies
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });

    router.push({ name: 'dashboard' });
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
      errorMessage.value = 'Gagal terhubung ke server backend. Pastikan server aktif.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
