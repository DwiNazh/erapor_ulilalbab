// src/screens/ProfilSiswa.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { User, Hash, GraduationCap, CalendarDays, Lock, Eye, EyeOff } from "lucide-react-native";
import api from "../api";

function InfoRow({ Icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Icon size={18} color="#f97316" />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "—"}</Text>
      </View>
    </View>
  );
}

export default function ProfilSiswa() {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profil"); // "profil" | "password"

  const [form, setForm] = useState({ password_lama: "", password_baru: "", konfirmasi: "" });
  const [showPass, setShowPass] = useState({ lama: false, baru: false, konfirmasi: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/siswa/profil");
      if (res.data?.success) {
        setProfil(res.data.data);
      }
    } catch (e) {
      console.error("Gagal mengambil profil", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPass = (key) => setShowPass((p) => ({ ...p, [key]: !p[key] }));

  const handleGantiPassword = async () => {
    if (form.password_baru.length < 6) {
      setToast({ type: "error", message: "Password baru minimal 6 karakter." });
      return;
    }
    if (form.password_baru !== form.konfirmasi) {
      setToast({ type: "error", message: "Konfirmasi password tidak cocok." });
      return;
    }

    setSaving(true);
    setToast(null);
    try {
      const res = await api.post("/api/siswa/profil/ganti-password", form);
      if (res.data?.success) {
        setToast({ type: "success", message: "Password berhasil diubah!" });
        setForm({ password_lama: "", password_baru: "", konfirmasi: "" });
      } else {
        setToast({ type: "error", message: res.data?.message || "Gagal mengubah password." });
      }
    } catch (e) {
      setToast({
        type: "error",
        message: e.response?.data?.message || "Terjadi kesalahan jaringan.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
        {/* Header identitas */}
        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profil?.nama?.charAt(0)?.toUpperCase()}</Text>
          </View>
          <Text style={styles.nama}>{profil?.nama}</Text>
          <Text style={styles.nis}>NIS: {profil?.nis}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badgeOrange}>
              <Text style={styles.badgeOrangeText}>{profil?.kelas || "Belum ada kelas"}</Text>
            </View>
            <View style={styles.badgeGray}>
              <Text style={styles.badgeGrayText}>{profil?.tahun_ajaran || "—"}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabWrap}>
          <TouchableOpacity
            style={[styles.tabButton, tab === "profil" && styles.tabButtonActive]}
            onPress={() => setTab("profil")}
          >
            <Text style={[styles.tabText, tab === "profil" && styles.tabTextActive]}>
              Data Personal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === "password" && styles.tabButtonActive]}
            onPress={() => setTab("password")}
          >
            <Text style={[styles.tabText, tab === "password" && styles.tabTextActive]}>
              Keamanan Akun
            </Text>
          </TouchableOpacity>
        </View>

        {toast ? (
          <View style={[styles.toast, toast.type === "success" ? styles.toastSuccess : styles.toastError]}>
            <Text style={toast.type === "success" ? styles.toastSuccessText : styles.toastErrorText}>
              {toast.message}
            </Text>
          </View>
        ) : null}

        {/* Content */}
        <View style={styles.card}>
          {tab === "profil" ? (
            <View>
              <InfoRow Icon={User} label="Nama Lengkap" value={profil?.nama} />
              <InfoRow Icon={Hash} label="NIS Siswa" value={profil?.nis} />
              <InfoRow Icon={Hash} label="Nomor NISN" value={profil?.nisn} />
              <InfoRow Icon={GraduationCap} label="Kelas / Rombel" value={profil?.kelas} />
              <InfoRow Icon={CalendarDays} label="Tahun Ajaran" value={profil?.tahun_ajaran} />
            </View>
          ) : (
            <View>
              <PasswordField
                label="Password Lama"
                value={form.password_lama}
                onChange={(v) => setForm((p) => ({ ...p, password_lama: v }))}
                show={showPass.lama}
                onToggle={() => toggleShowPass("lama")}
              />
              <PasswordField
                label="Password Baru"
                value={form.password_baru}
                onChange={(v) => setForm((p) => ({ ...p, password_baru: v }))}
                show={showPass.baru}
                onToggle={() => toggleShowPass("baru")}
              />
              <PasswordField
                label="Konfirmasi Baru"
                value={form.konfirmasi}
                onChange={(v) => setForm((p) => ({ ...p, konfirmasi: v }))}
                show={showPass.konfirmasi}
                onToggle={() => toggleShowPass("konfirmasi")}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleGantiPassword}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Lock size={18} color="#fff" />
                    <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.passwordWrap}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChange}
          secureTextEntry={!show}
          placeholder={`Masukkan ${label.toLowerCase()}`}
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.eyeButton} onPress={onToggle}>
          {show ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: "#fffcf9" },
  loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fffcf9" },
  container: { padding: 16, paddingBottom: 40 },
  identityCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffedd5",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "900" },
  nama: { fontSize: 18, fontWeight: "900", color: "#1e293b" },
  nis: { fontSize: 11, color: "#94a3b8", fontWeight: "700", marginTop: 2 },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  badgeOrange: { backgroundColor: "#ffedd5", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  badgeOrangeText: { color: "#ea580c", fontSize: 11, fontWeight: "900" },
  badgeGray: { backgroundColor: "#f1f5f9", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  badgeGrayText: { color: "#64748b", fontSize: 11, fontWeight: "900" },
  tabWrap: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff7ed",
    padding: 6,
    marginBottom: 16,
  },
  tabButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  tabButtonActive: { backgroundColor: "#f97316" },
  tabText: { fontSize: 13, fontWeight: "900", color: "#94a3b8" },
  tabTextActive: { color: "#fff" },
  toast: { borderRadius: 12, padding: 12, marginBottom: 12 },
  toastSuccess: { backgroundColor: "#ecfdf5", borderWidth: 1, borderColor: "#a7f3d0" },
  toastError: { backgroundColor: "#fff1f2", borderWidth: 1, borderColor: "#fecdd3" },
  toastSuccessText: { color: "#047857", fontWeight: "700", fontSize: 12 },
  toastErrorText: { color: "#e11d48", fontWeight: "700", fontSize: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffedd5",
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#fff7ed",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextWrap: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { fontSize: 12, color: "#64748b" },
  infoValue: { fontSize: 13, fontWeight: "700", color: "#1e293b" },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: 6 },
  passwordWrap: { position: "relative", justifyContent: "center" },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 44,
    fontSize: 14,
    color: "#1e293b",
  },
  eyeButton: { position: "absolute", right: 16 },
  saveButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#f97316",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveButtonText: { color: "#fff", fontWeight: "900", fontSize: 14 },
});