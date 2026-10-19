// src/api.js
import axios from "axios";

// ✅ FIX: base URL sekarang dari environment variable, fallback ke localhost
// untuk dev. Sebelumnya hardcoded "http://localhost:8000" sehingga akan
// tetap mencoba localhost walau sudah di-deploy ke production.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ✅ REQUEST INTERCEPTOR
// Catatan: withCredentials + XSRF cookie logic dihapus karena seluruh sistem
// ini pakai Sanctum token-based auth (Bearer token), bukan Sanctum SPA mode
// (cookie + CSRF). Dua pola ini tidak boleh dicampur, dan pola cookie tidak
// akan bisa dipakai sama sekali di React Native nanti — jadi lebih baik
// dibersihkan dari sekarang supaya logic-nya sama persis dengan yang akan
// dipakai di mobile.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("siswa_token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  const selectedJenjangId = localStorage.getItem("selected_jenjang_id");
  if (selectedJenjangId) {
    config.headers["X-Jenjang-Id"] = selectedJenjangId;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR
// FIX: sekarang menangani 401 (token invalid/expired) dengan auto-redirect
// ke halaman login yang sesuai, supaya user tidak "stuck" di halaman dengan
// request yang terus gagal diam-diam.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isSiswa = !!localStorage.getItem("siswa_token");

      localStorage.removeItem("siswa_token");
      localStorage.removeItem("siswa_data");
      localStorage.removeItem("token");

      // Hindari redirect loop kalau memang sudah di halaman login
      const loginPath = isSiswa ? "/login-siswa" : "/login";
      if (window.location.pathname !== loginPath) {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(error);
  }
);

export default api;