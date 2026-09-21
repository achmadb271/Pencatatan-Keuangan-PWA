export const formatRupiah = (number) => {
  if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const categories = {
  INCOME: [
    { label: 'Gaji & Upah', icon: 'bi-cash-stack' },
    { label: 'Bonus & THR', icon: 'bi-gift' },
    { label: 'Penjualan / Bisnis', icon: 'bi-shop' },
    { label: 'Investasi / Dividen', icon: 'bi-graph-up-arrow' },
    { label: 'Pemasukan Lainnya', icon: 'bi-wallet' },
  ],
  EXPENSE: [
    { label: 'Makanan & Minuman', icon: 'bi-cup-hot' },
    { label: 'Transportasi', icon: 'bi-car-front' },
    { label: 'Belanja Kebutuhan', icon: 'bi-cart' },
    { label: 'Tagihan & Utilitas', icon: 'bi-lightning-charge' },
    { label: 'Hiburan & Liburan', icon: 'bi-controller' },
    { label: 'Kesehatan & Medis', icon: 'bi-heart-pulse' },
    { label: 'Pendidikan & Kursus', icon: 'bi-book' },
    { label: 'Pengeluaran Lainnya', icon: 'bi-credit-card' },
  ],
};
