// src/screens/NilaiSiswa.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Modal,
  FlatList,
} from "react-native";
import { Calculator, ChevronDown, FileText } from "lucide-react-native";
import api from "../api";

const TABS = [
  { key: "intra", label: "Intra" },
  { key: "kokurikuler", label: "Ko-Kurikuler" },
  { key: "ekstrakurikuler", label: "Ekstrakurikuler" },
];

export default function NilaiSiswa() {
  const [tab, setTab] = useState("intra");
  const [semester, setSemester] = useState("1");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [tahunList, setTahunList] = useState([]);
  const [tahunPickerVisible, setTahunPickerVisible] = useState(false);

  const [data, setData] = useState([]);
  const [pjblJudul, setPjblJudul] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab, semester, tahunAjaran]);

  const endpointForTab = () => {
    if (tab === "kokurikuler") return "/api/siswa/nilai/kokurikuler";
    if (tab === "ekstrakurikuler") return "/api/siswa/nilai/ekstrakurikuler";
    return "/api/siswa/nilai";
  };

  const fetchData = async () => {
    try {
      const params = { semester };
      if (tahunAjaran) params.tahun_ajaran = tahunAjaran;

      const res = await api.get(endpointForTab(), { params });

      setData(res.data?.data || []);
      setPjblJudul(res.data?.pjbl_judul || null);

      if (res.data?.tahun_list?.length > 0) {
        setTahunList(res.data.tahun_list);
        if (!tahunAjaran) setTahunAjaran(res.data.tahun_list[0]);
      }
    } catch (e) {
      console.error("Gagal mengambil nilai:", e);
      setData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [tab, semester, tahunAjaran]);

  const getRataUH = (row) => {
    const uh = [row.uh1, row.uh2, row.uh3, row.uh4, row.uh5].filter(
      (v) => v !== null && v !== undefined && v !== "" && v !== 0
    );
    return uh.length ? Math.round(uh.reduce((a, b) => a + Number(b), 0) / uh.length) : 0;
  };

  const hitungNilaiRaport = (row) => {
    const rataUH = getRataUH(row);
    const pts = Number(row.pts) || 0;
    const pas = Number(row.pas) || 0;
    if (!rataUH && !row.pts && !row.pas) return "-";
    return Math.round(rataUH * 0.4 + pts * 0.3 + pas * 0.3);
  };

  const nilaiColor = (val) => {
    if (val === "-" || val === null || val === undefined || val === "") return "#cbd5e1";
    const n = Number(val);
    if (n >= 80) return "#059669";
    if (n >= 70) return "#2563eb";
    if (n >= 60) return "#d97706";
    return "#e11d48";
  };

  return (
    <View style={styles.screen}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabButton, tab === t.key && styles.tabButtonActive]}
            onPress={() => {
              setTab(t.key);
              setLoading(true);
            }}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filter semester + tahun */}
      <View style={styles.filterBar}>
        <View style={styles.semesterToggle}>
          {["1", "2"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.semesterBtn, semester === s && styles.semesterBtnActive]}
              onPress={() => setSemester(s)}
            >
              <Text
                style={[styles.semesterText, semester === s && styles.semesterTextActive]}
              >
                Sem {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.tahunPicker}
          onPress={() => setTahunPickerVisible(true)}
        >
          <Text style={styles.tahunPickerText}>{tahunAjaran || "Tahun Ajaran"}</Text>
          <ChevronDown size={14} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <Modal visible={tahunPickerVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTahunPickerVisible(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pilih Tahun Ajaran</Text>
            <FlatList
              data={tahunList}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item === tahunAjaran && styles.modalItemActive]}
                  onPress={() => {
                    setTahunAjaran(item);
                    setTahunPickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item === tahunAjaran && styles.modalItemTextActive,
                    ]}
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
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
        }
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : tab === "intra" ? (
          <IntraTab data={data} getRataUH={getRataUH} hitungNilaiRaport={hitungNilaiRaport} nilaiColor={nilaiColor} />
        ) : tab === "kokurikuler" ? (
          <KokurikulerTab data={data} pjblJudul={pjblJudul} />
        ) : (
          <EkstrakurikulerTab data={data} />
        )}
      </ScrollView>
    </View>
  );
}

function EmptyState({ text }) {
  return (
    <View style={styles.emptyWrap}>
      <FileText size={40} color="#e2e8f0" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function IntraTab({ data, getRataUH, hitungNilaiRaport, nilaiColor }) {
  if (data.length === 0) return <EmptyState text="Data nilai belum tersedia untuk semester ini." />;

  return (
    <View>
      <View style={styles.infoBox}>
        <Calculator size={14} color="#4f46e5" />
        <Text style={styles.infoBoxText}>
          (Rata UH × 40%) + (PTS × 30%) + (PAS × 30%)
        </Text>
      </View>

      {data.map((row, i) => {
        const rataUH = getRataUH(row);
        const nRapor = hitungNilaiRaport(row);
        return (
          <View key={i} style={styles.mapelCard}>
            <View style={styles.mapelHeader}>
              <Text style={styles.mapelNama}>{row.nama_mapel}</Text>
              <View style={[styles.raporBadge]}>
                <Text style={[styles.raporBadgeText, { color: nilaiColor(nRapor) }]}>
                  {nRapor}
                </Text>
              </View>
            </View>
            <View style={styles.uhRow}>
              {[row.uh1, row.uh2, row.uh3, row.uh4, row.uh5].map((v, idx) => (
                <View key={idx} style={styles.uhChip}>
                  <Text style={styles.uhChipLabel}>UH{idx + 1}</Text>
                  <Text style={[styles.uhChipValue, { color: nilaiColor(v) }]}>{v || "-"}</Text>
                </View>
              ))}
            </View>
            <View style={styles.subRow}>
              <Text style={styles.subLabel}>Rata UH: <Text style={styles.subValue}>{rataUH || "-"}</Text></Text>
              <Text style={styles.subLabel}>PTS: <Text style={styles.subValue}>{row.pts ?? "-"}</Text></Text>
              <Text style={styles.subLabel}>PAS: <Text style={styles.subValue}>{row.pas ?? "-"}</Text></Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function parseDeskripsi(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function KokurikulerTab({ data, pjblJudul }) {
  if (data.length === 0) return <EmptyState text="Tidak ada data untuk semester ini." />;

  return (
    <View>
      {data.map((row, i) => {
        const deskripsi = parseDeskripsi(row.deskripsi_aspek);
        const aspekList = [
          { label: "Mutabaah Yaumiyah", grade: row.mutabaah_yaumiyah, desk: deskripsi[0] },
          { label: "Bina Pribadi Islam", grade: row.bina_pribadi_islam, desk: deskripsi[1] },
          { label: "Literasi", grade: row.literasi, desk: deskripsi[2] },
          { label: pjblJudul ? `PJBL (${pjblJudul})` : "PJBL", grade: row.pjbl, desk: deskripsi[3] },
        ];
        return (
          <View key={i}>
            {aspekList.map((a, idx) => (
              <View key={idx} style={styles.aspekCard}>
                <View style={styles.aspekHeader}>
                  <Text style={styles.aspekLabel}>{a.label}</Text>
                  {a.grade ? (
                    <View style={styles.gradeBadge}>
                      <Text style={styles.gradeBadgeText}>Grade {a.grade}</Text>
                    </View>
                  ) : (
                    <Text style={styles.dashText}>-</Text>
                  )}
                </View>
                <Text style={styles.aspekDesk}>"{a.desk || "Belum ada deskripsi"}"</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

function EkstrakurikulerTab({ data }) {
  if (data.length === 0) return <EmptyState text="Tidak ada data ekstrakurikuler untuk periode ini." />;

  return (
    <View>
      {data.map((row, i) => (
        <View key={i} style={styles.ekskulCard}>
          <View style={styles.ekskulHeader}>
            <Text style={styles.ekskulNama}>{row.nama_ekstrakurikuler}</Text>
            <View style={styles.ekskulNilaiBadge}>
              <Text style={styles.ekskulNilaiText}>{row.nilai || "-"}</Text>
            </View>
          </View>
          <Text style={styles.ekskulDesk}>
            {row.deskripsi ? `"${row.deskripsi}"` : "Belum ada deskripsi."}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff8f3" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ffedd5",
  },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabButtonActive: { borderBottomColor: "#f97316" },
  tabText: { fontSize: 12, fontWeight: "700", color: "#94a3b8" },
  tabTextActive: { color: "#ea580c" },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  semesterToggle: { flexDirection: "row", backgroundColor: "#f1f5f9", borderRadius: 12, padding: 3 },
  semesterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  semesterBtnActive: { backgroundColor: "#fff" },
  semesterText: { fontSize: 12, fontWeight: "700", color: "#94a3b8" },
  semesterTextActive: { color: "#ea580c" },
  tahunPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tahunPickerText: { fontSize: 12, fontWeight: "700", color: "#475569" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(15,23,42,0.4)", justifyContent: "center", padding: 32 },
  modalBox: { backgroundColor: "#fff", borderRadius: 20, padding: 16, maxHeight: 360 },
  modalTitle: { fontWeight: "900", fontSize: 15, color: "#1e293b", marginBottom: 8, paddingHorizontal: 8 },
  modalItem: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12 },
  modalItemActive: { backgroundColor: "#fff7ed" },
  modalItemText: { fontSize: 14, color: "#475569" },
  modalItemTextActive: { color: "#ea580c", fontWeight: "800" },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingTop: 4 },
  loadingWrap: { paddingVertical: 60, alignItems: "center" },
  emptyWrap: { paddingVertical: 60, alignItems: "center", gap: 12 },
  emptyText: { color: "#94a3b8", fontStyle: "italic", fontSize: 13, textAlign: "center" },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#eef2ff",
    borderWidth: 1,
    borderColor: "#e0e7ff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  infoBoxText: { fontSize: 11, color: "#4338ca", fontWeight: "600", flex: 1 },
  mapelCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ffedd5",
    padding: 16,
    marginBottom: 12,
  },
  mapelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  mapelNama: { fontWeight: "800", color: "#1e293b", fontSize: 14, flex: 1 },
  raporBadge: { backgroundColor: "#fff7ed", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  raporBadgeText: { fontWeight: "900", fontSize: 16 },
  uhRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  uhChip: { backgroundColor: "#f8fafc", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignItems: "center", minWidth: 48 },
  uhChipLabel: { fontSize: 9, color: "#94a3b8", fontWeight: "700" },
  uhChipValue: { fontSize: 13, fontWeight: "800", marginTop: 2 },
  subRow: { flexDirection: "row", gap: 16, borderTopWidth: 1, borderTopColor: "#f8fafc", paddingTop: 10 },
  subLabel: { fontSize: 11, color: "#94a3b8" },
  subValue: { fontWeight: "800", color: "#334155" },
  aspekCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#f1f5f9", padding: 14, marginBottom: 10 },
  aspekHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  aspekLabel: { fontWeight: "700", color: "#334155", fontSize: 13, flex: 1 },
  gradeBadge: { backgroundColor: "#eff6ff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  gradeBadgeText: { color: "#2563eb", fontWeight: "800", fontSize: 11 },
  aspekDesk: { fontSize: 11, color: "#64748b", fontStyle: "italic", lineHeight: 16 },
  dashText: { color: "#cbd5e1" },
  ekskulCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#f1f5f9", padding: 14, marginBottom: 10 },
  ekskulHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  ekskulNama: { fontWeight: "800", color: "#1e293b", fontSize: 13, flex: 1 },
  ekskulNilaiBadge: { backgroundColor: "#fff7ed", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  ekskulNilaiText: { color: "#ea580c", fontWeight: "900", fontSize: 12 },
  ekskulDesk: { fontSize: 11, color: "#64748b", fontStyle: "italic", lineHeight: 16 },
});