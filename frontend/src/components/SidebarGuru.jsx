import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

import {
  FaBars,
  FaTachometerAlt,
  FaClipboardCheck,
  FaFileAlt,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaTimes,
  FaBookOpen,
  FaQuran,
  FaClock,
  FaUserCircle,
} from "react-icons/fa";

export default function SidebarGuru() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const location = useLocation();
  const { logout, user } = useAuth();

  // Efek untuk otomatis membuka dropdown Penilaian Kelas jika sub-menunya aktif
  useEffect(() => {
    if (
      location.pathname.startsWith("/dashboardgurusd/nilai") ||
      location.pathname.startsWith("/dashboardgurusd/penilaian-kokurikuler") ||
      location.pathname.startsWith("/dashboardgurusd/ekstrakurikuler") ||
      location.pathname.startsWith("/dashboardgurusd/penilaian-quran") // Menjaga dropdown terbuka jika halaman penilaian baru diakses
    ) {
      setOpenDropdown("penilaian");
    }
  }, [location.pathname]);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      toast.loading("Sedang keluar...", { id: "logout" });
      await logout?.();
      toast.success("Berhasil keluar", { id: "logout" });
      window.location.href = "/login";
    } catch (err) {
      toast.error("Gagal keluar");
      setTimeout(() => (window.location.href = "/login"), 800);
    }
  };

  const navLinkClass = (path, exact = false) => `
    flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
    ${
      isActive(path, exact)
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
    }
  `;

  const subLinkClass = (path) => `
    block py-2.5 px-10 rounded-lg text-sm transition-all duration-200
    ${
      isActive(path)
        ? "text-indigo-600 font-semibold bg-indigo-50/50"
        : "text-slate-500 hover:text-indigo-600 hover:translate-x-1"
    }
  `;

  // Cek apakah salah satu sub-menu penilaian sedang aktif
  const isPenilaianActive =
    location.pathname.includes("/nilai") ||
    location.pathname.includes("/penilaian-kokurikuler") ||
    location.pathname.includes("/ekstrakurikuler") ||
    location.pathname.includes("/penilaian-quran"); // Ditambahkan di sini

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-3 rounded-xl shadow-lg"
      >
        <FaBars size={20} />
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky h-screen flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header - Profil User */}
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboardgurusd/profil"
              className="flex items-center gap-3 group transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center rounded-2xl shadow-inner font-bold text-lg overflow-hidden group-hover:ring-2 ring-indigo-100 ring-offset-2 transition-all">
                {user?.foto_url ? (
                  <img
                    src={user.foto_url}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "G"
                )}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-slate-800 leading-tight truncate w-32 group-hover:text-indigo-600 transition-colors">
                  {user?.name || "Memuat..."}
                </h2>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {user?.role === "guru" ? "Tenaga Pengajar" : "Panel Guru"}
                </p>
              </div>
            </Link>
            <button
              className="md:hidden text-slate-400"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 pb-6 space-y-1 overflow-y-auto custom-scrollbar">
          {/* BERANDA */}
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 mt-4">
            Beranda
          </p>

          <Link
            to="/dashboardgurusd"
            className={navLinkClass("/dashboardgurusd", true)}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaTachometerAlt
                className={
                  isActive("/dashboardgurusd", true)
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Dashboard</span>
            </div>
          </Link>

          {/* AKADEMIK */}
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 mt-6">
            Akademik
          </p>

          <Link
            to="/dashboardgurusd/jadwal-saya"
            className={navLinkClass("/dashboardgurusd/jadwal-saya")}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaClock
                className={
                  isActive("/dashboardgurusd/jadwal-saya")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Jadwal Mengajar</span>
            </div>
          </Link>

          {/* Tetap di sini untuk bimbingan / input harian kelompok */}
          <Link
            to="/dashboardgurusd/KelompokQuranGuru"
            className={navLinkClass("/dashboardgurusd/KelompokQuranGuru")}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaQuran
                className={
                  isActive("/dashboardgurusd/KelompokQuranGuru")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Penilaian Kelompok Qur'an</span>
            </div>
          </Link>

          <Link
            to="/dashboardgurusd/penugasan-saya"
            className={navLinkClass("/dashboardgurusd/penugasan-saya")}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaBookOpen
                className={
                  isActive("/dashboardgurusd/penugasan-saya")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Mata Pelajaran</span>
            </div>
          </Link>

          <Link
            to="/dashboardgurusd/kalenderkelas"
            className={navLinkClass("/dashboardgurusd/kalenderkelas")}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaCalendarAlt
                className={
                  isActive("/dashboardgurusd/kalenderkelas")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Kalender Kelas</span>
            </div>
          </Link>

          {/* ABSENSI */}
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 mt-6">
            Absensi
          </p>

          <Link
            to="/dashboardgurusd/absensi"
            className={navLinkClass("/dashboardgurusd/absensi")}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaClipboardCheck
                className={
                  isActive("/dashboardgurusd/absensi")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Absensi Siswa</span>
            </div>
          </Link>

          {/* PENILAIAN */}
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 mt-6">
            Penilaian
          </p>

          <div>
            <button
              onClick={() => toggleDropdown("penilaian")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
              ${
                isPenilaianActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <FaFileAlt
                  className={
                    isPenilaianActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-indigo-600"
                  }
                />
                <span className="font-medium">Penilaian Kelas</span>
              </div>
              <FaChevronDown
                className={`text-[10px] transition-transform ${openDropdown === "penilaian" ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${openDropdown === "penilaian" ? "max-h-64 mt-1" : "max-h-0"}`}
            >
              <Link
                to="/dashboardgurusd/nilai"
                className={subLinkClass("/dashboardgurusd/nilai")}
                onClick={() => setSidebarOpen(false)}
              >
                Intra Kurikuler
              </Link>
              <Link
                to="/dashboardgurusd/penilaian-kokurikuler"
                className={subLinkClass(
                  "/dashboardgurusd/penilaian-kokurikuler",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                Ko-Kurikuler
              </Link>
              <Link
                to="/dashboardgurusd/ekstrakurikuler"
                className={subLinkClass("/dashboardgurusd/ekstrakurikuler")}
                onClick={() => setSidebarOpen(false)}
              >
                Ekstrakurikuler
              </Link>
              {/* SUB-MENU MENU BARU KHUSUS HALAMAN PENILAIAN AL-QUR'AN */}
              <Link
                to="/dashboardgurusd/penilaian-quran"
                className={subLinkClass("/dashboardgurusd/penilaian-quran")}
                onClick={() => setSidebarOpen(false)}
              >
                Al-Qur'an
              </Link>
            </div>
          </div>

          {/* RAPOR */}
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 mt-6">
            Rapor
          </p>

          <Link
            to="/dashboardgurusd/rapor"
            className={navLinkClass("/dashboardgurusd/rapor")}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaFileAlt
                className={
                  isActive("/dashboardgurusd/rapor")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Rapor Kelas</span>
            </div>
          </Link>

          {/* PENGATURAN */}
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2 mt-6">
            Pengaturan
          </p>

          <Link
            to="/dashboardgurusd/template-deskripsi"
            className={navLinkClass("/dashboardgurusd/template-deskripsi")}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaFileAlt
                className={
                  isActive("/dashboardgurusd/template-deskripsi")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Template Deskripsi</span>
            </div>
          </Link>

          <Link
            to="/dashboardgurusd/profil"
            className={navLinkClass("/dashboardgurusd/profil")}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <FaUserCircle
                className={
                  isActive("/dashboardgurusd/profil")
                    ? "text-white"
                    : "text-slate-400 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium">Profil Saya</span>
            </div>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-200 group font-semibold"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
