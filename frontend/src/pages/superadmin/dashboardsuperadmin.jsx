import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import { toast, Toaster } from "react-hot-toast";
import SidebarSuperadmin from "../../components/SidebarSuperadmin";
import {
  Users, UserPlus, School, Calendar,
  Settings, Loader2, Bell, Search, Printer,
  TrendingUp, ChevronUp, RefreshCw,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────

const roleLabel = (role) => ({
  guru:      "Guru",
  admintu:   "TU",
  siswa:     "Siswa",
  superadmin:"Superadmin",
}[role] ?? role);

const roleColor = (role) => ({
  guru:    "bg-indigo-50 text-indigo-700",
  admintu: "bg-purple-50 text-purple-700",
  siswa:   "bg-sky-50 text-sky-700",
}[role] ?? "bg-gray-100 text-gray-600");

const timeAgo = (dateStr) => {
  if (!dateStr) return "-";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "Baru saja";
  if (mins  < 60)  return `${mins} menit lalu`;
  if (hours < 24)  return `${hours} jam lalu`;
  if (days  < 30)  return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID");
};

// ── sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, bgClass, colorClass, changeLabel, change, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${onClick ? "cursor-pointer" : ""}`}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</span>
      <div className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center`}>
        <Icon size={18} className={colorClass} />
      </div>
    </div>
    <p className="text-3xl font-extrabold text-gray-900">
      {(value ?? 0).toLocaleString("id-ID")}
    </p>
    {changeLabel && (
      <p className={`text-xs mt-1.5 flex items-center gap-1 ${(change ?? 0) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
        <ChevronUp size={12} />
        {changeLabel}
      </p>
    )}
  </div>
);

const ActionCard = ({ icon: Icon, bgClass, colorClass, title, desc, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200
      ${disabled
        ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
        : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm"}`}
  >
    <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
      <Icon size={20} className={colorClass} />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
  </button>
);

const Badge = ({ label, colorClass }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
    {label}
  </span>
);

const ProgressBar = ({ label, value, color }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs text-gray-600 mb-1.5">
      <span>{label}</span>
      <span className="font-semibold">{value}%</span>
    </div>
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);

// ── main component ────────────────────────────────────────────────────────────

export default function DashboardSuperadmin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── state (SEMUA hook harus di atas conditional return) ───────────────────
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/api/superadmin/dashboard");

      if (!res.data.success) {
        throw new Error("Gagal memuat dashboard");
      }

      setData(res.data.data);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Sesi login habis");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      toast.error("Gagal memuat data dashboard");

    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // refresh tiap 5 menit
    return () => clearInterval(interval);
  }, [fetchData]);

  // Proteksi akses sudah ditangani ProtectedRoute — tidak perlu guard inline

  // ── loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="animate-spin text-indigo-600" size={44} />
        <p className="ml-4 text-indigo-700 font-medium">Memuat data dashboard...</p>
      </div>
    );
  }

  // ── derived data ──────────────────────────────────────────────────────────

  const stats          = data?.stats          ?? {};
  const recentAccounts = data?.recent_accounts ?? [];
  const activities     = data?.activities      ?? [];
  const completeness   = data?.completeness    ?? [];

  const statCards = [
    {
      title: "Total Akun",   value: stats.total_users,  icon: Users,
      bgClass: "bg-indigo-50", colorClass: "text-indigo-600",
      change: 1, changeLabel: `+${stats.new_users_this_month ?? 0} bulan ini`,
      onClick: () => navigate("/superadmin/manajemenakun"),
    },
    {
      title: "Guru",         value: stats.total_guru,   icon: School,
      bgClass: "bg-emerald-50", colorClass: "text-emerald-600",
    },
    {
      title: "Siswa Aktif",  value: stats.total_siswa,  icon: Users,
      bgClass: "bg-sky-50", colorClass: "text-sky-600",
      change: 1, changeLabel: `+${stats.new_siswa_this_month ?? 0} bulan ini`,
    },
    {
      title: "Rombel",       value: stats.total_rombel, icon: Calendar,
      bgClass: "bg-purple-50", colorClass: "text-purple-600",
      changeLabel: stats.tahun_ajaran_aktif !== "-" ? stats.tahun_ajaran_aktif : undefined,
    },
  ];

  const actions = [
    {
      icon: UserPlus, title: "Tambah Akun", desc: "Guru, TU, Siswa",
      bgClass: "bg-indigo-50", colorClass: "text-indigo-600",
      onClick: () => navigate("/superadmin/manajemenakun"),
    },
    {
      icon: Calendar, title: "Tahun Ajaran", desc: stats.semester_aktif !== "-" ? stats.semester_aktif : "Set semester aktif",
      bgClass: "bg-emerald-50", colorClass: "text-emerald-600",
      disabled: true,
    },
    {
      icon: Printer, title: "Ekspor Data", desc: "Laporan PDF/Excel",
      bgClass: "bg-amber-50", colorClass: "text-amber-600",
      disabled: true,
    },
    {
      icon: Settings, title: "Konfigurasi", desc: "Pengaturan sistem",
      bgClass: "bg-purple-50", colorClass: "text-purple-600",
      onClick: () => navigate("/superadmin/pengaturan"),
    },
  ];

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-sm hidden md:block">
        <SidebarSuperadmin />
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              {stats.tahun_ajaran_aktif && stats.tahun_ajaran_aktif !== "-" && (
                <span className="ml-2 text-indigo-500 font-medium">
                  · TA {stats.tahun_ajaran_aktif} ({stats.semester_aktif})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              title="Refresh data"
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={15} />
            </button>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.slice(0, 2).toUpperCase() ?? "SA"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-800 leading-none">{user?.name ?? "Superadmin"}</p>
                <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((card, i) => <StatCard key={i} {...card} />)}
          </div>

          {/* Mid Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

            {/* Quick Actions */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-500" /> Aksi Cepat
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {actions.map((a, i) => <ActionCard key={i} {...a} />)}
              </div>
            </div>

            {/* Aktivitas Terbaru */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Aktivitas Terbaru</h2>
              {activities.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Belum ada aktivitas</p>
              ) : (
                <div className="space-y-3.5">
                  {activities.map((a, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color ?? "#9CA3AF" }} />
                      <div>
                        <p className="text-xs text-gray-700 leading-snug">{a.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Tabel Akun Terbaru */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-800">Akun Terbaru</h2>
                <button
                  onClick={() => navigate("/superadmin/manajemenakun")}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Lihat semua →
                </button>
              </div>
              {recentAccounts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Belum ada data akun</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama</th>
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Peran</th>
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Kelas/Unit</th>
                      <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Dibuat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAccounts.map((row, i) => (
                      <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            {row.foto ? (
                              <img src={row.foto} alt="" className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                                {row.name?.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium text-gray-800">{row.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge label={roleLabel(row.role)} colorClass={roleColor(row.role)} />
                        </td>
                        <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{row.unit}</td>
                        <td className="px-5 py-3 text-xs text-gray-400">{timeAgo(row.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Progress Kelengkapan Data */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-5">Kelengkapan Data</h2>
              {completeness.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Tidak ada data</p>
              ) : (
                completeness.map((item, i) => <ProgressBar key={i} {...item} />)
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}