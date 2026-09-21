import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker
registerSW({ immediate: true });

const app = createApp(App);
app.use(router);
app.mount('#app');
