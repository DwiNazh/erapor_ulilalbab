// src/screens/DashboardSiswa.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { FileText, ClipboardCheck, Calendar, BookOpen, LogOut } from "lucide-react-native";
import api from "../api";

export default function DashboardSiswa({ navigation }) {
  const [siswa, setSiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLocalThenFetch();
  }, []);

  const loadLocalThenFetch = async () => {
    const local = await SecureStore.getItemAsync("siswa_data");
    if (local) setSiswa(JSON.parse(local));
    fetchDashboard();
  };

  const fetchDashboard = async () => {
    setError("");
    try {
      const res = await api.get("/api/siswa/dashboard");
      if (res.data?.success) {
        setSiswa(res.data.data);
        await SecureStore.setItemAsync("siswa_data", JSON.stringify(res.data.data));
      } else {
        setError(res.data?.message || "Gagal memuat data dashboard.");
      }
    } catch (e) {
      console.error(e);
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
    } catch (e) {
      console.error("Gagal logout dari server:", e);
    } finally {
      await SecureStore.deleteItemAsync("siswa_token");
      await SecureStore.deleteItemAsync("siswa_data");
      navigation.replace("LoginSiswa");
    }
  };

  const menus = [
    { label: "Nilai Akademik", desc: "Lihat nilai UH, PTS, dan PAS kamu", Icon: FileText, screen: "NilaiSiswa" },
    { label: "Absensi Saya", desc: "Rekap kehadiran kamu", Icon: ClipboardCheck, screen: "AbsensiSiswa" },
    { label: "Jadwal Pelajaran", desc: "Jadwal kelas minggu ini", Icon: Calendar, screen: "JadwalSiswa" },
    { label: "Profil Saya", desc: "Data diri dan akun kamu", Icon: BookOpen, screen: "ProfilSiswa" },
  ];

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Selamat datang,</Text>
        <Text style={styles.name}>{siswa?.nama || "Siswa"} 👋</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>NIS: {siswa?.nis || "-"}</Text>
          {siswa?.kelas ? (
            <Text style={styles.infoText}>
              Kelas: {siswa.kelas}
              {siswa?.sub_kelas ? ` ${siswa.sub_kelas}` : ""}
            </Text>
          ) : null}
        </View>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Menu Grid */}
      <View style={styles.grid}>
        {menus.map((m, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuCard}
            onPress={() => navigation.navigate(m.screen)}
          >
            <View style={styles.menuIcon}>
              <m.Icon size={22} color="#fff" />
            </View>
            <Text style={styles.menuLabel}>{m.label}</Text>
            <Text style={styles.menuDesc}>{m.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={18} color="#e11d48" />
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff8f3" },
  loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff8f3" },
  container: { padding: 16, paddingTop: 48 },
  header: {
    backgroundColor: "#f97316",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  greeting: { color: "#fed7aa", fontSize: 13, marginBottom: 4 },
  name: { color: "#fff", fontSize: 22, fontWeight: "900" },
  infoRow: { flexDirection: "row", gap: 16, marginTop: 10 },
  infoText: { color: "#fed7aa", fontSize: 12 },
  errorBox: {
    backgroundColor: "#fff1f2",
    borderWidth: 1,
    borderColor: "#fecdd3",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#e11d48", fontSize: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  menuCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 12,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  menuLabel: { fontWeight: "700", color: "#1e293b", marginBottom: 2 },
  menuDesc: { fontSize: 11, color: "#64748b" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: { color: "#e11d48", fontWeight: "700" },
});