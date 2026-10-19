// src/api.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Base URL dari .env (EXPO_PUBLIC_API_URL). Ganti IP di .env sesuai
// alamat IP lokal komputer kamu saat testing lewat Expo Go di HP fisik.
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR
// Sama pola dengan api.js web: ambil token, attach sebagai Bearer.
// Bedanya, di mobile tidak ada localStorage — pakai SecureStore (async).
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("siswa_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ✅ RESPONSE INTERCEPTOR
// Sama seperti web: kalau 401, hapus token tersimpan.
// Redirect ke login ditangani di level navigasi (lihat AppNavigator.js),
// bukan di sini, karena tidak ada "window.location" di mobile.
let onUnauthorized = null;

export function setOnUnauthorized(callback) {
  onUnauthorized = callback;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("siswa_token");
      await SecureStore.deleteItemAsync("siswa_data");
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;