import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaFileAlt,
  FaCalendarAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardCheck,
  FaChevronDown,
  FaBookOpen, // icon untuk Rapor
} from "react-icons/fa";

export default function SidebarSiswa() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nilaiOpen, setNilaiOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const siswa = JSON.parse(localStorage.getItem("siswa_data") || "{}");

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard-siswa/nilai")) {
      setNilaiOpen(true);
    }
  }, [location.pathname]);

  const navLinkClass = (path, exact = false) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
    ${
      isActive(path, exact)
        ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
    }
  `;

  const childLinkClass = (path) => `
    flex items-center px-4 py-2 rounded-xl text-sm transition-all duration-200
    ${
      isActive(path)
        ? "bg-orange-100 text-orange-700 font-semibold"
        : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
    }
  `;

  // ✅ FIX: logout sekarang invalidate token di server (Sanctum) dulu,
  // baru hapus data lokal. Ini juga pola yang akan dipakai di mobile nanti.
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await api.post("/api/logout");
    } catch (e) {
      console.error("Gagal logout dari server:", e);
      // tetap lanjut hapus data lokal walau request gagal (misal offline)
    } finally {
      localStorage.removeItem("siswa_token");
      localStorage.removeItem("siswa_data");
      setLoggingOut(false);
      navigate("/login-siswa");
    }
  };

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-orange-500 text-white p-3 rounded-xl shadow-lg"
      >
        <FaBars />
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky h-screen flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center rounded-2xl shadow-lg font-bold text-xl">
                {siswa?.nama?.charAt(0).toUpperCase() || "S"}
              </div>
              <div>
                <h2 className="font-bold text-slate-800 leading-tight truncate w-36 text-sm">
                  {siswa?.nama || "Siswa"}
                </h2>
                <p className="text-[10px] text-slate-400">
                  NIS: {siswa?.nis || "-"}
                </p>
              </div>
            </div>
            <button
              className="md:hidden text-slate-400"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-slate-100" />

        {/* Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">
            Menu Utama
          </p>

          {/* Dashboard */}
          <Link
            to="/dashboard-siswa"
            className={navLinkClass("/dashboard-siswa", true)}
            onClick={() => setSidebarOpen(false)}
          >
            <FaTachometerAlt
              className={
                isActive("/dashboard-siswa", true)
                  ? "text-white"
                  : "text-slate-400 group-hover:text-orange-500"
              }
            />
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* DROPDOWN NILAI */}
          <button
            onClick={() => setNilaiOpen(!nilaiOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive("/dashboard-siswa/nilai")
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaFileAlt
                className={
                  isActive("/dashboard-siswa/nilai")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-orange-500"
                }
              />
              <span className="font-medium">Nilai</span>
            </div>
            <FaChevronDown
              className={`text-sm transition-transform duration-200 ${
                nilaiOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {nilaiOpen && (
            <div className="ml-6 mt-2 space-y-1">
              <Link
                to="/dashboard-siswa/nilai"
                className={childLinkClass("/dashboard-siswa/nilai")}
                onClick={() => setSidebarOpen(false)}
              >
                Intra Kurikuler
              </Link>
              <Link
                to="/dashboard-siswa/nilai/kokurikuler"
                className={childLinkClass("/dashboard-siswa/nilai/kokurikuler")}
                onClick={() => setSidebarOpen(false)}
              >
                Nilai Ko-Kurikuler
              </Link>
              <Link
                to="/dashboard-siswa/nilai/ekstrakurikuler"
                className={childLinkClass("/dashboard-siswa/nilai/ekstrakurikuler")}
                onClick={() => setSidebarOpen(false)}
              >
                Nilai Ekstrakurikuler
              </Link>
            </div>
          )}

          {/* Absensi */}
          <Link
            to="/dashboard-siswa/absensi"
            className={navLinkClass("/dashboard-siswa/absensi")}
            onClick={() => setSidebarOpen(false)}
          >
            <FaClipboardCheck
              className={
                isActive("/dashboard-siswa/absensi")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-orange-500"
              }
            />
            <span className="font-medium">Absensi Saya</span>
          </Link>

          {/* ✅ FIX: path highlight disamakan (lowercase, sesuai route "to") */}
          <Link
            to="/dashboard-siswa/rapor"
            className={navLinkClass("/dashboard-siswa/rapor")}
            onClick={() => setSidebarOpen(false)}
          >
            <FaBookOpen
              className={
                isActive("/dashboard-siswa/rapor")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-orange-500"
              }
            />
            <span className="font-medium">Rapor Saya</span>
          </Link>

          {/* Jadwal */}
          <Link
            to="/dashboard-siswa/jadwal"
            className={navLinkClass("/dashboard-siswa/jadwal")}
            onClick={() => setSidebarOpen(false)}
          >
            <FaCalendarAlt
              className={
                isActive("/dashboard-siswa/jadwal")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-orange-500"
              }
            />
            <span className="font-medium">Jadwal Pelajaran</span>
          </Link>

          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 mt-6">
            Akun
          </p>

          {/* Profil */}
          <Link
            to="/dashboard-siswa/profil"
            className={navLinkClass("/dashboard-siswa/profil")}
            onClick={() => setSidebarOpen(false)}
          >
            <FaUserCircle
              className={
                isActive("/dashboard-siswa/profil")
                  ? "text-white"
                  : "text-slate-400 group-hover:text-orange-500"
              }
            />
            <span className="font-medium">Profil Saya</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all group font-semibold text-sm disabled:opacity-50"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            <span>{loggingOut ? "Keluar..." : "Keluar"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}