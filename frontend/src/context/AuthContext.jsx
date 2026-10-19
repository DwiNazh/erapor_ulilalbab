import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      const userToken = localStorage.getItem("token");
      const siswaToken = localStorage.getItem("siswa_token");

      if (!userToken && !siswaToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        if (userToken) {
          const res = await api.get("/api/user", {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          setUser(res.data);
          return;
        }

        if (siswaToken) {
          const res = await api.get("/api/siswa/me", {
            headers: { Authorization: `Bearer ${siswaToken}` },
          });
          setUser({ ...res.data.siswa, role: "siswa" });
          return;
        }
      } catch (err) {
        console.error("Auth init error:", err.response?.data || err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("siswa_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // LOGIN PEGAWAI / GURU / ADMIN
  const login = async (nipy, password) => {
    await api.get("/sanctum/csrf-cookie");
    const response = await api.post("/api/login", { nipy, password });

    if (response.data.token) {
      localStorage.removeItem("siswa_token");
      localStorage.setItem("token", response.data.token);
    }

    setUser(response.data.user);
    return response.data;
  };

  // LOGIN SISWA
  const loginSiswa = async (nis, password) => {
    const response = await api.post("/api/siswa/login", { nis, password });

    if (response.data.token) {
      localStorage.removeItem("token");
      localStorage.setItem("siswa_token", response.data.token);
    }

    const siswa = { ...response.data.siswa, role: "siswa" };
    setUser(siswa);
    return response.data;
  };

  // LOGOUT
  const logout = async () => {
    try {
      const userToken = localStorage.getItem("token");
      const siswaToken = localStorage.getItem("siswa_token");

      if (userToken && !siswaToken) {
        await api.get("/sanctum/csrf-cookie");
        await api.post("/api/logout");
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("siswa_token");
      localStorage.removeItem("siswa_data");
      sessionStorage.clear();
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginSiswa, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);