# 💰 Expense Tracker PWA - Fullstack Express & Vue 3

Proyek showcase aplikasi manajemen keuangan pribadi (_personal finance tracker_) modern berbasis **Progressive Web App (PWA)** dengan arsitektur Fullstack JavaScript: **Express.js**, **Prisma ORM**, **MySQL**, dan **Vue 3 (Vite)**.

Aplikasi ini dirancang sebagai proyek portofolio/sertifikasi yang mendemonstrasikan penguasaan:

1. **Relasi Database One-to-Many (`User` -> `Transaction`)** dengan Prisma ORM & MySQL.
2. **Autentikasi & Otorisasi Berbasis JWT** dengan enkripsi password (Bcrypt).
3. **Agregasi Data Finansial** (Total Saldo, Pemasukan, Pengeluaran, & Rincian per Kategori).
4. **Progressive Web App (PWA)** yang dapat di-install langsung di HP Android/iOS maupun Desktop Chrome layaknya aplikasi native.

---

## 🌟 Fitur Utama

- 🔐 **Autentikasi Pengguna:** Registrasi, Login, dan proteksi rute berbasis JWT & Http Cookie.
- 📊 **Dashboard Finansial:**
  - Card Saldo Bersih, Akumulasi Pemasukan, dan Total Pengeluaran.
  - Rincian pengeluaran/pemasukan per kategori (Makanan, Gaji, Transportasi, Tagihan, dll).
  - Ringkasan 5 transaksi terbaru.
- 💳 **Manajemen Transaksi (CRUD):**
  - Catat transaksi baru (Pemasukan / Pengeluaran) dengan format nominal Rupiah otomatis.
  - Filter transaksi berdasarkan Tipe (_Income_ / _Expense_) dan pencarian judul/catatan.
  - Edit & Hapus transaksi dengan konfirmasi.
- 📱 **Progressive Web App (PWA):**
  - Web App Manifest (`manifest.webmanifest`) dengan tema warna andalan & icon adaptif.
  - Service Worker untuk caching asset (`sw.js` & Workbox) sehingga loading instan.
  - _Install Prompt Banner_ yang mengajak pengguna meng-install aplikasi ke layar utama.
  - _Bottom Navigation Bar_ khusus tampilan layar mobile menyerupai aplikasi smartphone native.

---

## 🛠️ Tech Stack

### **Backend (`/backend`)**

- **Node.js & Express.js (v4.19)**
- **Prisma ORM (v5.13)**
- **MySQL Database**
- **JSON Web Token (`jsonwebtoken`) & `bcryptjs`**
- **`express-validator`**

### **Frontend (`/frontend`)**

- **Vue 3 (Composition API `<script setup>`)**
- **Vite (v5.2)**
- **Vue Router (v4.3)** dengan Navigation Guards
- **Axios & `js-cookie`**
- **Bootstrap 5.3 & Bootstrap Icons**
- **`vite-plugin-pwa`** (Workbox, Service Worker, Manifest)

---

## 🚀 Panduan Menjalankan Project

### 1. Prasyarat

- Node.js (v18+)
- MySQL Server aktif (misal melalui XAMPP/Laragon) pada port `3306`

---

### 2. Menjalankan Backend API

1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd D:/kodingan/framework/express_vue/expense-tracker-pwa/backend
   ```
2. Pastikan file `.env` sudah sesuai dengan kredensial MySQL lokal kamu:
   ```env
   PORT=3000
   DATABASE_URL="mysql://root:@localhost:3306/expense_tracker_pwa"
   JWT_SECRET=bf3e9f427f7db2061e8cfb8a69d7bdf5144b61ef3aaec36279f75ec50e68e0d6
   ```
3. Sinkronisasi database dengan Prisma (database akan otomatis dibuat jika belum ada):
   ```bash
   npx prisma db push
   ```
4. Jalankan backend:

   ```bash
   node index.js
   # atau untuk mode dev (auto restart):
   npm run dev
   ```

   _Backend akan berjalan di `http://localhost:3000`._

5. **Uji Coba Otomatis Backend API:**
   Kamu bisa menjalankan automated test suite yang sudah disiapkan:
   ```bash
   npm test
   ```

---

### 3. Menjalankan Frontend Vue 3

1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd D:/kodingan/framework/express_vue/expense-tracker-pwa/frontend
   ```
2. Jalankan server pengembangan Vite:

   ```bash
   npm run dev
   ```

   _Frontend akan berjalan di `http://localhost:5173`._

3. Buka browser di `http://localhost:5173`:
   - Daftar akun baru atau masuk ke akun yang ada.
   - Tambahkan transaksi pemasukan dan pengeluaran.
   - Cek Dashboard untuk melihat kalkulasi saldo dan rincian kategori secara _real-time_.

---

### 4. Menguji Fitur PWA (Install App)

1. Buka aplikasi di Google Chrome atau Microsoft Edge (`http://localhost:5173` atau saat production preview `npm run preview`).
2. Di address bar browser (atau banner di atas halaman), akan muncul ikon / tombol **"Install App"** / **"Pasang Aplikasi"**.
3. Klik tombol install: aplikasi akan terpasang di Desktop / Homescreen HP kamu dan dapat dibuka secara _standalone_ tanpa address bar browser.
