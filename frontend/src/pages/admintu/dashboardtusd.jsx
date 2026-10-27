import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaUserShield,
  FaChevronDown,
  FaUserGraduate,
  FaLock,
  FaSchool,
  FaChalkboardTeacher,
  FaCog,
  FaSignOutAlt,
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import { useAuth } from "../../context/AuthContext";
import { rentangKelas } from "../../utils/rombel";

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────────

function StatCard({ icon, value, label, delta, deltaUp, color }) {
  const colors = {
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-100",
    blue: "from-blue-500 to-indigo-600 shadow-blue-100",
    amber: "from-amber-400 to-orange-600 shadow-amber-100",
    rose: "from-rose-500 to-pink-600 shadow-rose-100",
  };

  return (
    <div className="bg-white rounded-[24px] p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${colors[color] || colors.emerald} mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800 tracking-tight">
          {value}
        </p>
        <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider text-[11px]">
          {label}
        </p>
      </div>
      {delta && (
        <div
          className={`mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${deltaUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
        >
          {deltaUp ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
          {delta}
        </div>
      )}
    </div>
  );
}

function BarRow({ label, value, max = 100 }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="group">
      <div className="flex justify-between mb-2">
        <span className="text-xs font-bold text-slate-600">{label}</span>
        <span className="text-xs font-black text-slate-800">{value} Siswa</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Donut({ pct, color, label, count }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 mb-3">
        <svg viewBox="0 0 68 68" className="w-full h-full -rotate-90">
          <circle
            cx="34"
            cy="34"
            r={r}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="7"
          />
          <circle
            cx="34"
            cy="34"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-slate-800">{pct}%</span>
        </div>
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-black text-slate-700">
        {count ? count.split(" ")[0] : "0"}
      </p>
    </div>
  );
}

function Pill({ status }) {
  const map = {
    Ditempatkan: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Menunggu: "bg-amber-100 text-amber-700 border-amber-200",
    "Belum Lengkap": "bg-rose-100 text-rose-700 border-rose-200",
    Diproses: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`text-[10px] font-bold px-3 py-1 rounded-full border ${map[status] || "bg-slate-100 text-slate-600"}`}
    >
      {(status || "PROSES").toUpperCase()}
    </span>
  );
}

// ─── MAIN DASHBOARD COMPONENT ────────────────────────────────────────────────

export default function DashboardTuSD() {
  const { user } = useAuth();
  const jenjang = user?.jenjang;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedTahunId, setSelectedTahunId] = useState("");

  const fetchDashboard = async (tahunId = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = tahunId
        ? `/api/tu/dashboard?tahun_ajaran_id=${tahunId}`
        : "/api/tu/dashboard";
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.message || "Gagal memuat dashboard");
      setDashboardData(result.data);
      if (result.data?.tahun_ajaran?.id) {
        setSelectedTahunId(result.data.tahun_ajaran.id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !dashboardData)
    return (
      <div className="flex h-screen items-center justify-center bg-white font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
            Sinkronisasi Data...
          </p>
        </div>
      </div>
    );

  if (error || !dashboardData)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 font-sans p-6">
        <div className="bg-white p-8 rounded-[32px] shadow-xl text-center max-w-sm border border-rose-100">
          <p className="text-rose-500 font-bold mb-4 italic">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );

  // Menyediakan default values (fallback) jika object tertentu tidak dikirim dari API
  const {
    statistik = {},
    distribusi_kelas = [],
    status_kenaikan = {},
    siswa_baru = [],
    finalisasi = {},
    tahun_ajaran = null,
    daftar_tahun_ajaran = [],
  } = dashboardData;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <SidebarAdminTu />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 bg-slate-100 rounded-lg text-slate-600"
            >
              <FaBars />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                Ringkasan Sistem
              </h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {new Intl.DateTimeFormat("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date())}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${tahun_ajaran?.status === "aktif" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}
              >
                {tahun_ajaran?.status
                  ? tahun_ajaran.status.toUpperCase()
                  : "NON-AKTIF"}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs text-slate-400 font-bold">T.A:</span>
                <select
                  value={tahun_ajaran?.id || selectedTahunId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedTahunId(id);
                    fetchDashboard(id);
                  }}
                  className="text-sm font-black text-slate-800 bg-transparent border-b-2 border-indigo-400 focus:border-indigo-600 outline-none cursor-pointer py-0.5"
                >
                  {(daftar_tahun_ajaran || []).map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                      className="text-slate-800 font-bold"
                    >
                      {t.nama} {t.aktif ? "(Aktif Saat Ini)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
              {jenjang || "TU"}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 shadow-2xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/20 to-transparent" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  Dashboard Utama
                </span>
                <h2 className="text-3xl font-black text-white mb-2">
                  Selamat datang kembali! 👋
                </h2>
                <p className="text-slate-400 text-sm max-w-md">
                  {tahun_ajaran
                    ? `Data akademik Tahun Ajaran ${tahun_ajaran.nama} ${tahun_ajaran.semester_aktif ? `Semester ${tahun_ajaran.semester_aktif}` : ""} telah diperbarui.`
                    : "Sistem belum mendeteksi adanya Tahun Ajaran aktif saat ini."}
                </p>
              </div>
              <div
                className={`p-4 rounded-2xl border backdrop-blur-md ${finalisasi?.kenaikan_finalized ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"}`}
              >
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 text-right">
                  Status Finalisasi
                </p>
                <div
                  className={`flex items-center gap-3 font-black text-lg ${finalisasi?.kenaikan_finalized ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {finalisasi?.kenaikan_finalized ? (
                    <FaUserShield />
                  ) : (
                    <FaLock />
                  )}
                  <span>
                    {finalisasi?.kenaikan_finalized
                      ? "SUDAH FINAL"
                      : "BELUM FINAL"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alur Proses Akademik */}
          <section className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                  Panduan Alur Kerja
                </p>
                <h3 className="text-xl font-black text-slate-800 mt-2">
                  Alur Proses Akademik
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Pantau tahapan pengelolaan siswa dan penyelesaian siklus
                  akademik.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl">
                Tahun Ajaran: {tahun_ajaran?.nama || "Belum dipilih"}
              </span>
            </div>

            {/* Tahap 1: Persiapan */}
            <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                  1
                </div>

                <div className="flex-1">
                  <h4 className="font-extrabold text-slate-800">
                    Persiapan Tahun Ajaran
                  </h4>
                  <p className="text-sm text-slate-500 mt-1 leading-6">
                    Pastikan tahun ajaran asal, tahun tujuan, dan data akademik
                    sudah sesuai sebelum memulai proses siswa.
                  </p>
                  <p className="text-xs font-bold text-blue-700 mt-3">
                    Tahun aktif: {tahun_ajaran?.nama || "Belum tersedia"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tahap 2A dan 2B */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              {/* Siswa lama */}
              <div className="rounded-2xl border border-emerald-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    2A
                  </div>

                  <div className="flex-1">
                    <h4 className="font-extrabold text-slate-800">
                      Pengelolaan Siswa Lama
                    </h4>
                    <p className="text-sm text-slate-500 mt-2 leading-6">
                      Siapkan rombel dan wali kelas, tetapkan status naik kelas,
                      lulus, atau tinggal kelas, lalu tempatkan siswa ke rombel
                      tujuan.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to="/dashboardtusd/promosi"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        Kenaikan Kelas →
                      </Link>

                      <Link
                        to="/dashboardtusd/datasiswa"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                      >
                        Data Siswa →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Siswa baru */}
              <div className="rounded-2xl border border-violet-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-black">
                    2B
                  </div>

                  <div className="flex-1">
                    <h4 className="font-extrabold text-slate-800">
                      Pengelolaan Siswa Baru
                    </h4>
                    <p className="text-sm text-slate-500 mt-2 leading-6">
                      Siapkan rombel, tetapkan wali kelas, dan masukkan siswa
                      PPDB ke rombel yang sesuai.
                    </p>

                    <div className="mt-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                          (statistik?.belum_ditempatkan || 0) === 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {statistik?.belum_ditempatkan || 0} siswa belum
                        ditempatkan
                      </span>
                    </div>

                    <Link
                      to="/dashboardtusd/siswabaru"
                      className="inline-flex mt-4 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-700 transition"
                    >
                      Kelola Siswa Baru →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tahap 3: Finalisasi */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                  3
                </div>

                <div className="flex-1">
                  <h4 className="font-extrabold text-slate-800">
                    Finalisasi Siklus Akademik
                  </h4>
                  <p className="text-sm text-slate-500 mt-1 leading-6">
                    Periksa penyelesaian seluruh proses wajib sebelum siklus
                    tahun ajaran dikunci.
                  </p>
                  <p className="text-xs font-bold mt-3 text-amber-700">
                    Status kenaikan kelas:{" "}
                    {finalisasi?.kenaikan_finalized
                      ? "Sudah difinalisasi"
                      : "Belum difinalisasi"}
                  </p>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex rounded-xl px-4 py-2.5 text-xs font-bold ${
                      finalisasi?.kenaikan_finalized
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {finalisasi?.kenaikan_finalized
                      ? "Kenaikan Final"
                      : "Perlu Pemeriksaan"}
                  </span>
                </div>
              </div>

              <p className="mt-4 border-t border-amber-200 pt-3 text-xs text-amber-800 leading-5">
                Catatan: status finalisasi kenaikan kelas belum membuktikan
                bahwa seluruh proses siswa baru, rombel, dan wali kelas sudah
                selesai. Penguncian siklus harus mengikuti pemeriksaan backend.
              </p>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FaUsers size={20} />}
              value={statistik?.total_siswa_aktif || 0}
              label="Siswa Aktif"
              delta={`${(statistik?.delta_siswa || 0) >= 0 ? "+" : ""}${statistik?.delta_siswa || 0} Siswa`}
              deltaUp={(statistik?.delta_siswa || 0) >= 0}
              color="emerald"
            />
            <StatCard
              icon={<FaChalkboardTeacher size={20} />}
              value={
                (statistik?.total_guru || 0) + (statistik?.total_staf || 0)
              }
              label="Guru & Staf"
              delta={`${statistik?.total_guru || 0} Guru`}
              deltaUp={true}
              color="blue"
            />
            <StatCard
              icon={<FaSchool size={20} />}
              value={statistik?.total_rombel || 0}
              label="Total Rombel"
              delta={
                statistik?.total_rombel_berikutnya > 0
                  ? `+${statistik.total_rombel_berikutnya} Rombel Baru (${statistik.nama_tahun_berikutnya || "TA Depan"})`
                  : rentangKelas(jenjang)
              }
              deltaUp={statistik?.total_rombel_berikutnya > 0}
              color="amber"
            />
            <StatCard
              icon={<FaUserGraduate size={20} />}
              value={statistik?.total_siswa_baru || 0}
              label="PPDB Baru"
              delta={`${statistik?.belum_ditempatkan || 0} Belum Masuk Kelas`}
              deltaUp={(statistik?.belum_ditempatkan || 0) === 0}
              color="rose"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8">
                Distribusi Kelas
              </h3>
              <div className="space-y-6">
                {distribusi_kelas.length > 0 ? (
                  distribusi_kelas.map((d, i) => (
                    <BarRow
                      key={`dist-${i}`}
                      label={d.kelas}
                      value={d.total}
                      max={Math.max(
                        ...distribusi_kelas.map((item) => item.total),
                        40,
                      )}
                    />
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    Tidak ada data distribusi kelas
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  Progress Kenaikan
                </h3>
                <span className="text-[10px] font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-lg italic">
                  T.A {tahun_ajaran?.nama || "Belum Diatur"}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-around gap-8">
                <Donut
                  pct={status_kenaikan?.pct_naik || 0}
                  color="#10b981"
                  label="Lulus/Naik"
                  count={`${status_kenaikan?.naik || 0} Siswa`}
                />
                <Donut
                  pct={status_kenaikan?.pct_proses || 0}
                  color="#f59e0b"
                  label="Proses"
                  count={`${status_kenaikan?.dalam_proses || 0} Siswa`}
                />
                <Donut
                  pct={status_kenaikan?.pct_tinggal || 0}
                  color="#ef4444"
                  label="Tinggal"
                  count={`${status_kenaikan?.tinggal || 0} Siswa`}
                />
              </div>
            </div>
          </div>

          {/* Recent PPDB Table */}
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-8 flex items-center justify-between border-b border-slate-50">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                Pendaftaran Baru
              </h3>
              <Link
                to="/dashboardtusd/siswabaru"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="overflow-x-auto px-4 pb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Nama Siswa
                    </th>
                    <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Kelas
                    </th>
                    <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Rombel
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {siswa_baru.length > 0 ? (
                    siswa_baru.slice(0, 6).map((s, index) => (
                      <tr
                        key={`siswa-${s.id || index}-${index}`}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter">
                              {(s.nama || "SS").substring(0, 2)}
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                              {s.nama || "Tanpa Nama"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-500 font-medium">
                          Kelas {s.kelas || "-"}
                        </td>
                        <td className="py-4 px-4">
                          <Pill status={s.status} />
                        </td>
                        <td className="py-4 px-4 text-xs font-black text-slate-400 uppercase">
                          {s.rombel || "---"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-8 text-sm text-slate-400 italic"
                      >
                        Tidak ada pendaftaran siswa baru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
            {[
              {
                label: "Data Siswa",
                to: "/dashboardtusd/datasiswa",
                icon: <FaUsers />,
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                label: "Kenaikan Kelas",
                to: "/dashboardtusd/promosi",
                icon: <FaUserGraduate />,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "PPDB",
                to: "/dashboardtusd/siswabaru",
                icon: <FaSchool />,
                color: "bg-amber-50 text-amber-600",
              },
              {
                label: "Mutasi",
                to: "/dashboardtusd/mutasi",
                icon: <FaExchangeAlt />,
                color: "bg-rose-50 text-rose-600",
              },
            ].map((btn) => (
              <Link
                key={btn.label}
                to={btn.to}
                className={`flex flex-col items-center justify-center p-6 rounded-[24px] ${btn.color} hover:scale-[1.03] transition-all border border-transparent hover:border-current/10 shadow-sm`}
              >
                <div className="text-xl mb-2">{btn.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {btn.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
