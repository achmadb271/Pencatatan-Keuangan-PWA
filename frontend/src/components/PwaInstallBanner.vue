<template>
  <div v-if="showInstallPrompt" class="alert alert-primary alert-dismissible fade show shadow-sm mb-4 border-0 d-flex align-items-center justify-content-between flex-wrap gap-2" role="alert">
    <div class="d-flex align-items-center gap-2">
      <i class="bi bi-phone-vibrate-fill fs-4 text-primary"></i>
      <div>
        <strong>Pasang Aplikasi PWA</strong>
        <div class="small text-muted">Install Expense Tracker ke layar HP atau Laptop untuk akses cepat tanpa buka browser!</div>
      </div>
    </div>
    <div class="d-flex gap-2">
      <button @click="installApp" class="btn btn-sm btn-primary rounded-pill px-3">
        <i class="bi bi-download me-1"></i> Install Sekarang
      </button>
      <button @click="dismissPrompt" type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3">
        Nanti Saja
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const deferredPrompt = ref(null);
const showInstallPrompt = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent standard browser banner
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallPrompt.value = true;
  });

  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false;
    deferredPrompt.value = null;
    console.log('Expense Tracker PWA was installed successfully.');
  });
});

const installApp = async () => {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  const choiceResult = await deferredPrompt.value.userChoice;
  if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the PWA install prompt');
  }
  showInstallPrompt.value = false;
  deferredPrompt.value = null;
};

const dismissPrompt = () => {
  showInstallPrompt.value = false;
};
</script>
