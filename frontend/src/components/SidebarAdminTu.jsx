import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaGraduationCap,
  FaCalendarCheck,
  FaUserFriends,
  FaCalendarAlt,
  FaRunning,
  FaUserShield,
  FaChevronDown,
  FaUserGraduate,
  FaLock,
  FaUserPlus,
  FaThLarge,
  FaChalkboardTeacher,
  FaCog,
  FaSignOutAlt,
  FaExchangeAlt,
  FaChartPie,
  FaBook,
  FaUsers,
  FaCheckCircle,
  FaLayerGroup,
} from "react-icons/fa";

export default function SidebarAdminTu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/dashboardtusd/tahunajaran") || location.pathname.startsWith("/dashboardtusd/datasiswa")) {
      setOpenDropdown("akademik");
    } else if (
      ["promosi", "penempatan-siswa", "wali-kelas", "finalisasi-total"].some((path) =>
        location.pathname.startsWith(`/dashboardtusd/${path}`)
      )
    ) {
      setOpenDropdown("kenaikan");
    } else if (
      ["manajemen-rombel", "siswabaru"].some((path) =>
        location.pathname.startsWith(`/dashboardtusd/${path}`)
      )
    ) {
      setOpenDropdown("ppdb");
    } else if (
      ["Matapelajaran", "EkskulTU", "Pjbljudulpage"].some((path) =>
        location.pathname.startsWith(`/dashboardtusd/${path}`)
      )
    ) {
      setOpenDropdown("kurikulum");
    }
    else if (
      location.pathname.startsWith("/dashboardtusd/kelompok-quran") ||
      location.pathname.startsWith("/dashboardtusd/manajemen-kelompok-quran")
    ) {
      setOpenDropdown("quran");
    }
  }, [location.pathname]);

  // Tambahkan ini di dalam komponen, setelah baris const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const navLinkClass = (path, exact = false) => `
    flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group w-full text-left
    ${isActive(path, exact)
      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"} 
  `;

  const subLinkClass = (path) => `
    flex items-center gap-3 py-2.5 px-10 rounded-xl text-sm transition-all duration-200
    ${isActive(path)
      ? "text-emerald-600 font-bold bg-emerald-50"
      : "text-slate-500 hover:text-emerald-600 hover:translate-x-1"}
  `;

  // Backend mengembalikan user.jenjang sebagai string kode (misal "SMP"), bukan objek
  const jenjangBadge = user?.jenjang || (user?.role === "superadmin"
    ? (localStorage.getItem("selected_jenjang_id") === "2" ? "SMP"
      : localStorage.getItem("selected_jenjang_id") === "3" ? "SMA" : "SD")
    : "SD");

  return (
    <>
      {/* Mobile Trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-emerald-600 text-white p-3 rounded-xl shadow-lg hover:bg-emerald-700 transition-colors"
      >
        <FaBars />
      </button>

      {/* Glassmorphism Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky h-screen flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex-shrink-0 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center rounded-2xl shadow-inner font-black text-lg tracking-wider">
                {jenjangBadge}
              </div>
              <div>
                <h2 className="font-bold text-slate-800 leading-tight">Admin TU</h2>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {user?.role === "superadmin" ? "Mode Superadmin" : `Jenjang ${jenjangBadge}`}
                </p>
              </div>
            </div>
            <button className="md:hidden text-slate-400 hover:text-slate-600 p-1" onClick={() => setSidebarOpen(false)}>
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Menu Area */}
        <nav className="flex-1 px-4 pb-6 space-y-1.5 overflow-y-auto custom-scrollbar pt-4">
          {user?.role === "superadmin" && (
            <div className="mb-3 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Akses Superadmin</span>
                <Link to="/dashboardsuperadmin" className="text-[11px] font-semibold text-blue-600 hover:underline">
                  ← Keluar TU
                </Link>
              </div>
              <select
                value={localStorage.getItem("selected_jenjang_id") || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) localStorage.setItem("selected_jenjang_id", val);
                  else localStorage.removeItem("selected_jenjang_id");
                  window.location.reload();
                }}
                className="w-full text-xs font-medium bg-white border border-amber-300 text-amber-950 rounded-lg p-1.5 focus:outline-none"
              >
                <option value="">Semua Jenjang</option>
                <option value="1">Jenjang SD</option>
                <option value="2">Jenjang SMP</option>
                <option value="3">Jenjang SMA</option>
              </select>
            </div>
          )}

          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-3">Main Menu</p>

          {/* Dashboard */}
          <Link to="/dashboardtusd" className={navLinkClass("/dashboardtusd", true)}>
            <div className="flex items-center gap-3">
              <FaTachometerAlt className={isActive("/dashboardtusd", true) ? "text-white" : "text-slate-400 group-hover:text-emerald-600"} />
              <span className="font-medium">Dashboard</span>
            </div>
          </Link>

          {/* Data Akademik */}
          <div>
            <button
              onClick={() => toggleDropdown("akademik")}
              className={navLinkClass("/dashboardtusd/data-akademik-parent")}
            >
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-slate-400 group-hover:text-emerald-600 text-lg" />
                <span className="font-medium">Data Akademik</span>
              </div>
              <FaChevronDown className={`text-[10px] transition-transform duration-200 ${openDropdown === "akademik" ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openDropdown === "akademik" ? "max-h-40 opacity-100 mt-1 space-y-1" : "max-h-0 opacity-0"}`}>
              <Link to="/dashboardtusd/tahunajaran" className={subLinkClass("/dashboardtusd/tahunajaran")}>
                <FaCalendarCheck size={14} />
                <span>Tahun Ajaran</span>
              </Link>
              <Link to="/dashboardtusd/datasiswa" className={subLinkClass("/dashboardtusd/datasiswa")}>
                <FaUserFriends size={14} />
                <span>Data Siswa</span>
              </Link>
            </div>
          </div>

          {/* Kenaikan */}
          <div>
            <button
              onClick={() => toggleDropdown("kenaikan")}
              className={navLinkClass("/dashboardtusd/kenaikan-parent")}
            >
              <div className="flex items-center gap-3">
                <FaUserGraduate className="text-slate-400 group-hover:text-emerald-600" />
                <span className="font-medium">Kenaikan</span>
              </div>
              <FaChevronDown className={`text-[10px] transition-transform duration-200 ${openDropdown === "kenaikan" ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openDropdown === "kenaikan" ? "max-h-60 opacity-100 mt-1 space-y-1" : "max-h-0 opacity-0"}`}>
              <Link to="/dashboardtusd/promosi" className={subLinkClass("/dashboardtusd/promosi")}>Kenaikan Kelas</Link>
              <Link to="/dashboardtusd/penempatan-siswa" className={subLinkClass("/dashboardtusd/penempatan-siswa")}>Penempatan</Link>
              <Link to="/dashboardtusd/wali-kelas" className={subLinkClass("/dashboardtusd/wali-kelas")}>Wali Kelas</Link>
            </div>
          </div>

          {/* Siswa Baru */}
          <div>
            <button
              onClick={() => toggleDropdown("ppdb")}
              className={navLinkClass("/dashboardtusd/siswa-baru-parent")}
            >
              <div className="flex items-center gap-3">
                <FaUserPlus className="text-slate-400 group-hover:text-emerald-600" />
                <span className="font-medium">Siswa Baru</span>
              </div>
              <FaChevronDown className={`text-[10px] transition-transform duration-200 ${openDropdown === "ppdb" ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openDropdown === "ppdb" ? "max-h-40 opacity-100 mt-1 space-y-1" : "max-h-0 opacity-0"}`}>
              <Link to="/dashboardtusd/manajemen-rombel" className={subLinkClass("/dashboardtusd/manajemen-rombel")}>
                <FaThLarge size={13} />
                <span>Manajemen Rombel</span>
              </Link>
              <Link to="/dashboardtusd/siswabaru" className={subLinkClass("/dashboardtusd/siswabaru")}>
                <FaUserPlus size={13} />
                <span>Data Siswa Baru</span>
              </Link>
            </div>
          </div>

          {/* Finalisasi Total */}
          <Link to="/dashboardtusd/finalisasi-total" className={navLinkClass("/dashboardtusd/finalisasi-total")}>
            <div className="flex items-center gap-3">
              <FaLock className={isActive("/dashboardtusd/finalisasi-total") ? "text-white" : "text-slate-400 group-hover:text-emerald-600"} />
              <span className="font-medium">Finalisasi</span>
            </div>
          </Link>

          {/* Data Guru */}
          <Link to="/dashboardtusd/guru" className={navLinkClass("/dashboardtusd/guru")}>
            <div className="flex items-center gap-3">
              <FaChalkboardTeacher className={isActive("/dashboardtusd/guru") ? "text-white" : "text-slate-400 group-hover:text-emerald-600"} />
              <span className="font-medium">Data Guru</span>
            </div>
          </Link>

          {/* Jadwal Kelas */}
          <Link to="/dashboardtusd/jadwalsekolah" className={navLinkClass("/dashboardtusd/jadwalsekolah")}>
            <div className="flex items-center gap-3">
              <FaCalendarAlt className={isActive("/dashboardtusd/jadwalsekolah") ? "text-white" : "text-slate-400 group-hover:text-emerald-600"} />
              <span className="font-medium">Jadwal Kelas</span>
            </div>
          </Link>

          {/* Pembagian Quran */}
          <div>
            <button
              onClick={() => toggleDropdown("quran")}
              className={navLinkClass("/dashboardtusd/kelompok-quran")}
            >
              <div className="flex items-center gap-3">
                <FaBook className="text-slate-400 group-hover:text-emerald-600" />
                <span className="font-medium">Pembagian Quran</span>
              </div>

              <FaChevronDown
                className={`text-[10px] transition-transform duration-200 ${
                  openDropdown === "quran"
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openDropdown === "quran"
                  ? "max-h-60 opacity-100 mt-1 space-y-1"
                  : "max-h-0 opacity-0"
              }`}
            >
              {/* Manajemen */}
              <Link
                to="/dashboardtusd/manajemen-kelompok-quran"
                className={subLinkClass(
                  "/dashboardtusd/manajemen-kelompok-quran"
                )}
              >
                <FaChalkboardTeacher size={13} />
                <span>Manajemen Kelompok</span>
              </Link>

              {/* Penempatan */}
              <Link
                to="/dashboardtusd/kelompok-quran/penempatan"
                className={subLinkClass(
                  "/dashboardtusd/kelompok-quran/penempatan"
                )}
              >
                <FaUsers size={13} />
                <span>Penempatan Anggota</span>
              </Link>

              {/* Finalisasi */}
              <Link
                to="/dashboardtusd/kelompok-quran/finalisasi"
                className={subLinkClass(
                  "/dashboardtusd/kelompok-quran/finalisasi"
                )}
              >
                <FaCheckCircle size={13} />
                <span>Finalisasi Kelompok</span>
              </Link>
            </div>
          </div>

          {/* Kurikulum & Kegiatan (Mapel + Ekskul + PJBL) */}
          <div>
            <button
              onClick={() => toggleDropdown("kurikulum")}
              className={navLinkClass("/dashboardtusd/kurikulum-parent")}
            >
              <div className="flex items-center gap-3">
                <FaLayerGroup className="text-slate-400 group-hover:text-emerald-600" />
                <span className="font-medium">Kurikulum</span>
              </div>
              <FaChevronDown className={`text-[10px] transition-transform duration-200 ${openDropdown === "kurikulum" ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openDropdown === "kurikulum" ? "max-h-40 opacity-100 mt-1 space-y-1" : "max-h-0 opacity-0"}`}>
              <Link to="/dashboardtusd/Matapelajaran" className={subLinkClass("/dashboardtusd/Matapelajaran")}>
                <FaBook size={13} />
                <span>Mata Pelajaran</span>
              </Link>
              <Link to="/dashboardtusd/EkskulTU" className={subLinkClass("/dashboardtusd/EkskulTU")}>
                <FaRunning size={13} />
                <span>Ekskul TU</span>
              </Link>
              <Link to="/dashboardtusd/Pjbljudulpage" className={subLinkClass("/dashboardtusd/Pjbljudulpage")}>
                <FaRunning size={13} />
                <span>PJBL</span>
              </Link>
            </div>
          </div> 

          {/* Pindah Kelas */}
          <Link to="/dashboardtusd/mutasi" className={navLinkClass("/dashboardtusd/mutasi")}>
            <div className="flex items-center gap-3">
              <FaExchangeAlt className={isActive("/dashboardtusd/mutasi") ? "text-white" : "text-slate-400 group-hover:text-emerald-600"} />
              <span className="font-medium">Pindah Kelas</span>
            </div>
          </Link>

          {/* Section: Reports & System */}
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-3 pt-6">Reports & System</p>

          {/* Rekap Rapor Siswa */}
          <Link to="/dashboardtusd/rekap-rapor" className={navLinkClass("/dashboardtusd/rekap-rapor")}>
            <div className="flex items-center gap-3">
              <FaChartPie className={isActive("/dashboardtusd/rekap-rapor") ? "text-white" : "text-slate-400 group-hover:text-emerald-600"} />
              <span className="font-medium">Rekap Rapor Siswa</span>
            </div>
          </Link>

          {/* Pengaturan */}
          <Link to="/dashboardtusd/pengaturan" className={navLinkClass("/dashboardtusd/pengaturan")}>
            <div className="flex items-center gap-3">
              <FaCog className={isActive("/dashboardtusd/pengaturan") ? "text-white" : "text-slate-400 group-hover:text-emerald-600"} />
              <span className="font-medium">Pengaturan</span>
            </div>
          </Link>

          {/* Profil Admin */}
          <Link to="/dashboardtusd/profil" className={navLinkClass("/dashboardtusd/profil")}>
            <div className="flex items-center gap-3">
              <FaUserShield className={isActive("/dashboardtusd/profil") ? "text-white" : "text-slate-400 group-hover:text-emerald-600"} />
              <span className="font-medium">Profil Admin</span>
            </div>
          </Link>
        </nav>

      <div className="p-4 border-t border-slate-100 flex-shrink-0 bg-slate-50/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-200 group w-full"
        >
          <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-semibold">Keluar Sistem</span>
        </button>
      </div>
      </aside>
    </>
  );
}