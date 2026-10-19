// src/screens/AbsensiSiswa.js
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react-native";
import api from "../api";

export default function AbsensiSiswa() {
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterSemester, setFilterSemester] = useState("all");

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const fetchAbsensi = async () => {
    try {
      const res = await api.get("/api/siswa/absensi");
      if (res.data?.success) {
        setAbsensi(res.data.data || []);
      }
    } catch (e) {
      console.error("Gagal mengambil absensi:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAbsensi();
  };

  const filteredAbsensi = useMemo(() => {
    if (filterSemester === "all") return absensi;
    return absensi.filter((item) => item.semester === filterSemester);
  }, [absensi, filterSemester]);

  const summary = useMemo(() => {
    let hadir = 0,
      sakit = 0,
      izin = 0,
      alfa = 0;

    filteredAbsensi.forEach((item) => {
      const status = item.status?.toLowerCase();
      if (status === "hadir") hadir++;
      if (status === "sakit") sakit++;
      if (status === "izin") izin++;
      if (status === "alfa") alfa++;
    });

    return { hadir, sakit, izin, alfa };
  }, [filteredAbsensi]);

  const StatusBadge = ({ status }) => {
    const st = status?.toLowerCase();
    const config = {
      hadir: { bg: "#ecfdf5", color: "#059669", Icon: CheckCircle2, label: "Hadir" },
      izin: { bg: "#eff6ff", color: "#2563eb", Icon: Clock, label: "Izin" },
      sakit: { bg: "#fffbeb", color: "#d97706", Icon: Clock, label: "Sakit" },
      alfa: { bg: "#fff1f2", color: "#e11d48", Icon: XCircle, label: "Alfa" },
    };
    const c = config[st];
    if (!c) return <Text style={styles.dashText}>-</Text>;

    return (
      <View style={[styles.badge, { backgroundColor: c.bg }]}>
        <c.Icon size={12} color={c.color} />
        <Text style={[styles.badgeText, { color: c.color }]}>{c.label}</Text>
      </View>
    );
  };

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
      {/* Filter semester */}
      <View style={styles.filterRow}>
        {[
          { key: "all", label: "Semua" },
          { key: "semester1", label: "Semester 1" },
          { key: "semester2", label: "Semester 2" },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filterSemester === f.key && styles.filterChipActive]}
            onPress={() => setFilterSemester(f.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                filterSemester === f.key && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary cards */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Hadir</Text>
          <Text style={[styles.summaryValue, { color: "#059669" }]}>{summary.hadir}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Izin</Text>
          <Text style={[styles.summaryValue, { color: "#2563eb" }]}>{summary.izin}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Sakit</Text>
          <Text style={[styles.summaryValue, { color: "#d97706" }]}>{summary.sakit}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Alfa</Text>
          <Text style={[styles.summaryValue, { color: "#e11d48" }]}>{summary.alfa}</Text>
        </View>
      </View>

      {/* List riwayat */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Riwayat Absensi</Text>

        {filteredAbsensi.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Tidak ada data absensi untuk filter ini.</Text>
          </View>
        ) : (
          filteredAbsensi.map((item, i) => (
            <View key={i} style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowTanggal}>{item.tanggal || "-"}</Text>
                <Text style={styles.rowGuru}>{item.guru || "-"}</Text>
                {item.keterangan && item.keterangan !== "-" ? (
                  <Text style={styles.rowKeterangan}>{item.keterangan}</Text>
                ) : null}
              </View>
              <StatusBadge status={item.status} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },
  loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" },
  container: { padding: 16, paddingBottom: 40 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterChipActive: { backgroundColor: "#f97316", borderColor: "#f97316" },
  filterChipText: { fontSize: 12, fontWeight: "700", color: "#64748b" },
  filterChipTextActive: { color: "#fff" },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  summaryCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  summaryLabel: { fontSize: 10, fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" },
  summaryValue: { fontSize: 24, fontWeight: "900", marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    padding: 16,
  },
  cardTitle: { fontWeight: "800", color: "#334155", marginBottom: 8, fontSize: 14 },
  emptyWrap: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#94a3b8", fontStyle: "italic", fontSize: 13 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  rowLeft: { flex: 1, marginRight: 8 },
  rowTanggal: { fontWeight: "700", color: "#334155", fontSize: 13 },
  rowGuru: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  rowKeterangan: { fontSize: 11, color: "#64748b", marginTop: 2, fontStyle: "italic" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 11, fontWeight: "800" },
  dashText: { color: "#cbd5e1" },
});