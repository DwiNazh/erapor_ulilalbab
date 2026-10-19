import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",  // ← hapus /api di sini
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  // ✅ Cek kedua jenis token sesuai konteks
  const token = localStorage.getItem("token") || localStorage.getItem("siswa_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;