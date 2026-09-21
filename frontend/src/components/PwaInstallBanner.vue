<template>
  <div>
    <!-- Install Banner -->
    <div
      v-if="!isStandalone && !isDismissed"
      class="alert alert-primary alert-dismissible fade show shadow-sm mb-4 border-0 d-flex align-items-center justify-content-between flex-wrap gap-2"
      role="alert"
    >
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-phone-vibrate-fill fs-4 text-primary"></i>
        <div>
          <strong class="d-block">Pasang Aplikasi Expense Tracker (PWA)</strong>
          <div class="small text-muted">
            Install ke layar utama HP atau Laptop untuk akses cepat, tampilan full-screen, dan hemat kuota!
          </div>
        </div>
      </div>
      <div class="d-flex gap-2 align-items-center">
        <button @click="handleInstallClick" class="btn btn-sm btn-primary rounded-pill px-3 shadow-sm">
          <i class="bi bi-download me-1"></i> Install Aplikasi
        </button>
        <button @click="dismissBanner" type="button" class="btn-close ms-1" aria-label="Close"></button>
      </div>
    </div>

    <!-- Instruction Modal for Desktop/iOS where beforeinstallprompt isn't automatic -->
    <div
      v-if="showInstructionModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <i class="bi bi-phone text-primary fs-4"></i> Panduan Pasang Aplikasi PWA
            </h5>
            <button @click="showInstructionModal = false" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body py-3">
            <p class="small text-muted">
              PWA dapat di-install secara langsung tanpa melalui Play Store / App Store:
            </p>

            <div class="list-group list-group-flush gap-2">
              <div class="list-group-item border rounded-3 p-3 bg-light">
                <div class="fw-bold text-dark small mb-1">
                  <i class="bi bi-laptop text-primary me-1"></i> Di Google Chrome / Edge (Laptop & PC):
                </div>
                <div class="small text-muted">
                  Lihat ke <strong>ujung kanan address bar browser</strong> kamu (tempat mengetik URL). Klik ikon <strong>Install / Download</strong> (gambar monitor dengan panah bawah), lalu klik <strong>Install</strong>.
                  <br/>Atau klik menu titik tiga [<strong>&vellip;</strong>] di pojok kanan atas browser &gt; pilih <strong>"Install Expense Tracker..."</strong>.
                </div>
              </div>

              <div class="list-group-item border rounded-3 p-3 bg-light">
                <div class="fw-bold text-dark small mb-1">
                  <i class="bi bi-android2 text-success me-1"></i> Di HP Android (Chrome):
                </div>
                <div class="small text-muted">
                  Klik menu titik tiga [<strong>&vellip;</strong>] di kanan atas layar &gt; pilih <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong>.
                </div>
              </div>

              <div class="list-group-item border rounded-3 p-3 bg-light">
                <div class="fw-bold text-dark small mb-1">
                  <i class="bi bi-apple text-dark me-1"></i> Di iPhone / iPad (Safari):
                </div>
                <div class="small text-muted">
                  Klik tombol <strong>Bagikan (Share)</strong> <i class="bi bi-box-arrow-up"></i> di bar bawah Safari &gt; gulir ke bawah dan pilih <strong>"Add to Home Screen" (Tambah ke Layar Utama)</strong>.
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button @click="showInstructionModal = false" class="btn btn-primary rounded-pill px-4 w-100">
              Mengerti, Terima Kasih
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const deferredPrompt = ref(null);
const isStandalone = ref(false);
const isDismissed = ref(false);
const showInstructionModal = ref(false);

onMounted(() => {
  // Check if running inside installed standalone PWA
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  ) {
    isStandalone.value = true;
  }

  // Check if user dismissed recently
  const dismissedTime = sessionStorage.getItem('pwa_banner_dismissed');
  if (dismissedTime) {
    isDismissed.value = true;
  }

  // Capture beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    console.log('beforeinstallprompt captured!');
  });

  window.addEventListener('appinstalled', () => {
    isStandalone.value = true;
    deferredPrompt.value = null;
    console.log('PWA was installed successfully.');
  });
});

const handleInstallClick = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    console.log('User response to install prompt:', outcome);
    if (outcome === 'accepted') {
      isStandalone.value = true;
    }
    deferredPrompt.value = null;
  } else {
    // If browser doesn't support or hasn't fired beforeinstallprompt yet
    showInstructionModal.value = true;
  }
};

const dismissBanner = () => {
  isDismissed.value = true;
  sessionStorage.setItem('pwa_banner_dismissed', 'true');
};
</script>
