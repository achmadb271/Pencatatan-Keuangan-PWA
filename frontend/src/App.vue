<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar />

    <main class="flex-grow-1 py-4 pb-5 pb-lg-4">
      <div class="container pb-4 pb-lg-0">
        <PwaInstallBanner />
        <router-view />
      </div>
    </main>

    <footer class="bg-white border-top py-3 text-center text-muted small mt-auto d-none d-lg-block">
      <div class="container">
        <span>Expense Tracker PWA &copy; 2026 &bull; Express.js + Prisma + Vue 3</span>
      </div>
    </footer>

    <!-- Mobile App Bottom Navigation Bar for PWA -->
    <BottomNav />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import BottomNav from './components/BottomNav.vue';
import PwaInstallBanner from './components/PwaInstallBanner.vue';
</script>
