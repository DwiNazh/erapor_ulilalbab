import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUserShield,
  FaChartLine,
  FaUserCog,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function SidebarSuperadmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownSekolahOpen, setDropdownSekolahOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-100 text-blue-700 font-semibold border-l-4 border-blue-600"
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700";

  return (
    <>
      {/* Tombol toggle untuk mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        <FaBars size={20} />
      </button>

      {/* Overlay (untuk menutup sidebar di mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar utama */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg p-6 
          transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static rounded-r-2xl md:rounded-none`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <FaUserShield className="text-blue-500" /> Superadmin
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 hover:text-blue-700 md:hidden"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Jenjang Switcher untuk Superadmin */}
        <div className="mb-4 p-3 bg-blue-50/80 border border-blue-100 rounded-xl">
          <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1.5">
            Filter Jenjang
          </label>
          <select
            value={localStorage.getItem("selected_jenjang_id") || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                localStorage.setItem("selected_jenjang_id", val);
              } else {
                localStorage.removeItem("selected_jenjang_id");
              }
              window.dispatchEvent(new Event("jenjang-changed"));
              window.location.reload();
            }}
            className="w-full text-xs font-medium bg-white border border-blue-200 text-blue-900 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Semua Jenjang (Global)</option>
            <option value="1">SD (Kelas 1 - 6)</option>
            <option value="2">SMP (Kelas 7 - 9)</option>
            <option value="3">SMA (Kelas 10 - 12)</option>
          </select>
        </div>

        {/* Navigasi */}
        <nav className="flex flex-col gap-2 text-gray-700">
          {/* Dashboard */}
          <Link
            to="/dashboardsuperadmin"
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${isActive(
              "/dashboardsuperadmin"
            )}`}
          >
            <FaTachometerAlt className="text-lg" />
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Statistik */}
          <Link
            to="/superadmin/statistik"
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${isActive(
              "/superadmin/statistik"
            )}`}
          >
            <FaChartLine className="text-lg" />
            <span className="font-medium">Statistik</span>
          </Link>

          {/* Manajemen Akun */}
          <Link
            to="/superadmin/manajemenakun"
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${isActive(
              "/superadmin/manajemenakun"
            )}`}
          >
            <FaUserCog className="text-lg" />
            <span className="font-medium">Manajemen Akun</span>
          </Link>



          {/* Pengaturan */}
          <Link
            to="/superadmin/pengaturan"
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${isActive(
              "/superadmin/pengaturan"
            )}`}
          >
            <FaCog className="text-lg" />
            <span className="font-medium">Pengaturan</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-2 rounded-xl hover:opacity-90 transition-all shadow-md font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaSignOutAlt />
            Keluar
          </button>
        </nav>
      </aside>
    </>
  );
}
