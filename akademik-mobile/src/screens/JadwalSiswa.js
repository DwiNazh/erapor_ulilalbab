// src/screens/JadwalSiswa.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Calendar, ChevronDown } from "lucide-react-native";
import api from "../api";

const HARI_LIST = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function JadwalSiswa() {
  const [jadwal, setJadwal] = useState([]);
  const [hari, setHari] = useState("Senin");
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    fetchJadwal();
  }, [hari]);

  const fetchJadwal = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/siswa/jadwal", { params: { hari } });
      setJadwal(res.data?.data || []);
    } catch (e) {
      console.error("Gagal mengambil jadwal:", e);
      setJadwal([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Filter */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.dayPicker} onPress={() => setPickerVisible(true)}>
          <Calendar size={16} color="#f97316" />
          <Text style={styles.dayPickerText}>{hari}</Text>
          <ChevronDown size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Modal pilih hari */}
      <Modal visible={pickerVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pilih Hari</Text>
            <FlatList
              data={HARI_LIST}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item === hari && styles.modalItemActive]}
                  onPress={() => {
                    setHari(item);
                    setPickerVisible(false);
                  }}
                >
                  <Text
                    style={[styles.modalItemText, item === hari && styles.modalItemTextActive]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Calendar size={18} color="#f97316" />
            <Text style={styles.cardHeaderText}>Hari {hari}</Text>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#f97316" />
            </View>
          ) : jadwal.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Jadwal belum tersedia untuk hari ini.</Text>
            </View>
          ) : (
            jadwal.map((row, i) => (
              <View key={i} style={styles.jadwalRow}>
                <View style={styles.jamBox}>
                  <Text style={styles.jamText}>
                    {row.jam_mulai} - {row.jam_selesai}
                  </Text>
                </View>
                <View style={styles.jadwalInfo}>
                  <Text style={styles.mapelText}>{row.nama_mapel}</Text>
                  <Text style={styles.guruText}>{row.nama_guru || "-"}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footerNote}>Jadwal ditampilkan sesuai hari yang dipilih.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff8f3" },
  filterBar: { padding: 16, paddingBottom: 8 },
  dayPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  dayPickerText: { fontWeight: "700", color: "#1e293b", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.4)",
    justifyContent: "center",
    padding: 32,
  },
  modalBox: { backgroundColor: "#fff", borderRadius: 20, padding: 16, maxHeight: 360 },
  modalTitle: { fontWeight: "900", fontSize: 15, color: "#1e293b", marginBottom: 8, paddingHorizontal: 8 },
  modalItem: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12 },
  modalItemActive: { backgroundColor: "#fff7ed" },
  modalItemText: { fontSize: 14, color: "#475569" },
  modalItemTextActive: { color: "#ea580c", fontWeight: "800" },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingTop: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffedd5",
    overflow: "hidden",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  cardHeaderText: { fontWeight: "800", color: "#334155" },
  loadingWrap: { paddingVertical: 48, alignItems: "center" },
  emptyWrap: { paddingVertical: 48, alignItems: "center" },
  emptyText: { color: "#94a3b8", fontStyle: "italic", fontSize: 13 },
  jadwalRow: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
    gap: 12,
  },
  jamBox: { width: 100 },
  jamText: { fontSize: 12, fontWeight: "700", color: "#475569" },
  jadwalInfo: { flex: 1 },
  mapelText: { fontSize: 14, fontWeight: "800", color: "#1e293b" },
  guruText: { fontSize: 12, color: "#64748b", marginTop: 2 },
  footerNote: { fontSize: 11, color: "#94a3b8", textAlign: "center" },
});