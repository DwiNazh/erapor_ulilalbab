// src/screens/LoginSiswa.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Eye, EyeOff, BookOpen } from "lucide-react-native";
import api from "../api";

export default function LoginSiswa({ navigation }) {
  const [form, setForm] = useState({ nis: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/siswa/login", form);

      // ✅ Sama seperti localStorage di web, tapi pakai SecureStore (async)
      await SecureStore.setItemAsync("siswa_token", res.data.token);
      await SecureStore.setItemAsync(
        "siswa_data",
        JSON.stringify(res.data.siswa)
      );

      navigation.replace("DashboardSiswa");
    } catch (e) {
      setError(
        e.response?.data?.message || "Login gagal. Periksa NIS dan password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <BookOpen size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Portal Siswa</Text>
          <Text style={styles.subtitle}>Masuk dengan NIS dan password kamu</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>NIS</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan NIS kamu"
            placeholderTextColor="#94a3b8"
            value={form.nis}
            onChangeText={(v) => setForm({ ...form, nis: v })}
            autoCapitalize="none"
            keyboardType="default"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Masukkan password"
              placeholderTextColor="#94a3b8"
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              secureTextEntry={!showPass}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPass(!showPass)}
            >
              {showPass ? (
                <EyeOff size={18} color="#94a3b8" />
              ) : (
                <Eye size={18} color="#94a3b8" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Masuk ke Portal</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          Password default adalah NIS kamu. Lupa password? Hubungi wali kelas
          atau admin TU.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff7ed" },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoWrap: { alignItems: "center", marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "900", color: "#1e293b" },
  subtitle: { fontSize: 13, color: "#64748b", marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#f97316",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  errorBox: {
    backgroundColor: "#fff1f2",
    borderWidth: 1,
    borderColor: "#fecdd3",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#e11d48", fontSize: 13 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1e293b",
  },
  passwordWrap: { position: "relative", justifyContent: "center" },
  passwordInput: { paddingRight: 44 },
  eyeButton: { position: "absolute", right: 14 },
  button: {
    backgroundColor: "#f97316",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 24,
  },
});