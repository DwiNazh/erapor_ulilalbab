import React, { useEffect, useState, useMemo } from "react";
import SidebarKepsek from "../../components/SidebarKepalasekolah";
import api from "../../api";
import toast from "react-hot-toast";
import {
  FaUserGraduate, FaChalkboardTeacher, FaBookOpen, FaCheckCircle,
  FaSyncAlt, FaChartBar, FaClipboardList, FaTrophy, FaGraduationCap,
  FaArrowUp, FaArrowDown, FaMinus, FaCalendarAlt, FaLightbulb,
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line,
} from "recharts";

// ─── HELPER COMPONENTS ──────────────────────────────────────────

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-purple-50 rounded-2xl ${className}`} />
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-purple-100 shadow-xl rounded-2xl p-4 text-sm">
      <p className="font-black text-slate-800 mb-2 border-b pb-2 border-purple-50 tracking-tight">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-3 mt-1.5">
          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: p.color || p.payload?.fill }} />
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">{p.name}:</span>
          <span className="font-black text-purple-700">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => {
  const isUp   = trend === "up";
  const isDown = trend === "down";
  return (
    <div className="group bg-white rounded-[2rem] p-7 border border-purple-50 shadow-sm hover:shadow-2xl hover:shadow-purple-100 hover:-translate-y-1 transition-all duration-500">
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-6 duration-500"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon size={26} />
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase
          ${isUp ? "bg-emerald-50 text-emerald-600" : isDown ? "bg-rose-50 text-rose-600" : "bg-purple-50 text-purple-400"}`}>
          {isUp ? <FaArrowUp size={8} /> : isDown ? <FaArrowDown size={8} /> : <FaMinus size={8} />} {sub}
        </div>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value ?? 0}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 group-hover:text-purple-600 transition-colors">{label}</p>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────

export default function DashboardKepsek() {
  const [user, setUser]             = useState(null);
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [tahunList, setTahunList]   = useState([]);
  const [tahunAjaran, setTahunAjaran] = useState("");

  const fetchAll = async (tahun = tahunAjaran) => {
    setLoading(true);
    try {
      const params = tahun ? { tahun_ajaran: tahun } : {};

      const [userRes, dashRes] = await Promise.all([
        api.get("/api/user"),
        api.get("/api/kepsek/dashboard", { params }),
      ]);

      setUser(userRes.data);

      const dashData = dashRes.data.data;
      setData(dashData);

      // Isi daftar tahun dari response pertama kali
      const list = dashRes.data.tahun_list || [];
      if (list.length > 0) {
        setTahunList(list);
        // Jika belum ada pilihan, set ke tahun yang sedang aktif/dipilih backend
        if (!tahun && dashData?.tahun_ajaran_dipilih) {
          setTahunAjaran(dashData.tahun_ajaran_dipilih);
        }
      }
    } catch (err) {
      toast.error("Gagal sinkronisasi data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Ketika user mengubah dropdown, langsung fetch ulang
  const handleTahunChange = (val) => {
    setTahunAjaran(val);
    fetchAll(val);
  };

  // ── ANALYTICS INSIGHT ──────────────────────────────────────
  const analytics = useMemo(() => {
    const kelasData = data?.nilai_per_kelas || [];
    if (!kelasData.length) return null;

    const total      = kelasData.reduce((a, b) => a + b.rata_rata, 0);
    const avg        = total / kelasData.length;
    const max        = Math.max(...kelasData.map(k => k.rata_rata));
    const min        = Math.min(...kelasData.map(k => k.rata_rata));
    const bestClass  = kelasData.find(k => k.rata_rata === max);
    const worstClass = kelasData.find(k => k.rata_rata === min);
    const gap        = max - min;

    return { avg, max, min, gap, bestClass, worstClass };
  }, [data]);

  // ── RADAR INSIGHT ──────────────────────────────────────────
  const radarInsight = useMemo(() => {
    const radar = data?.radar_nilai || [];
    if (!radar.length) return null;
    const sorted    = [...radar].sort((a, b) => a.nilai - b.nilai);
    const weakest   = sorted[0];
    const strongest = sorted[sorted.length - 1];
    return { weakest, strongest };
  }, [data]);

  // ── TREN INSIGHT ─────────────────────────────────────────────
  // Tren nilai sengaja dikirim backend TANPA filter tahun ajaran
  // (lihat komentar di DashboardKepsekController::index, poin 8),
  // agar grafik menunjukkan progres jangka panjang lintas tahun.
  // Insight ini menghitung selisih dari periode pertama ke terakhir
  // supaya kepala sekolah langsung dapat kesimpulan naik/turun
  // tanpa perlu membaca titik grafik satu per satu.
  const trenInsight = useMemo(() => {
    const tren = data?.tren_nilai || [];
    if (tren.length < 2) return null;

    const first = tren[0].rata_rata;
    const last  = tren[tren.length - 1].rata_rata;
    const delta = +(last - first).toFixed(1);

    return {
      delta,
      isUp: delta > 0,
      isDown: delta < 0,
      periodeAwal: tren[0].periode,
      periodeAkhir: tren[tren.length - 1].periode,
    };
  }, [data]);

  // ── DEDUPLICATED TOP SISWA ──────────────────────────────────
  const topSiswaDeduplicated = useMemo(() => {
    const list = data?.top_siswa || [];
    const seen = new Map();
    for (const siswa of list) {
      const uniqueKey = siswa.id != null
        ? String(siswa.id)
        : `${siswa.nama}-${siswa.kelas}`;
      if (!seen.has(uniqueKey)) seen.set(uniqueKey, siswa);
    }
    return Array.from(seen.values());
  }, [data]);

  const s = data?.stats;

  // Ambang KKM untuk reference line di grafik tren.
  // TODO: sebaiknya diambil dari backend (mis. data.kkm) jika nilai
  // KKM bisa berbeda per sekolah/mapel. Sementara di-hardcode di sini.
  const KKM_THRESHOLD = 75;

  return (
    <div className="flex min-h-screen bg-[#FDFEFE]">
      <SidebarKepsek />

      <main className="flex-1 p-6 lg:p-12 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* HEADER */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-1.5 w-10 bg-purple-600 rounded-full" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                Halo,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  {user?.name?.split(" ")[0] || "Kepala Sekolah"}
                </span>{" "}
                👋
              </h1>
            </div>

            {/* CONTROL: Dropdown Tahun + Refresh */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={tahunAjaran}
                onChange={(e) => handleTahunChange(e.target.value)}
                disabled={loading || tahunList.length === 0}
                className="px-4 py-2.5 rounded-2xl border border-purple-100 text-xs font-black text-slate-700 bg-white focus:ring-2 focus:ring-purple-400 outline-none shadow-sm disabled:opacity-50"
              >
                <option value="">-- Tahun Ajaran --</option>
                {tahunList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <button
                onClick={() => fetchAll(tahunAjaran)}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-purple-700 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
              >
                <FaSyncAlt
                  className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
                  size={14}
                />
                <span className="text-xs font-black uppercase tracking-widest">Refresh</span>
              </button>
            </div>
          </header>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading
              ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-44" />)
              : (
                <>
                  <StatCard icon={FaUserGraduate}     label="Siswa Aktif"        value={s?.total_siswa}   sub="Global"   trend="stable" color="#7c3aed" />
                  <StatCard icon={FaChalkboardTeacher} label="Tenaga Pengajar"    value={s?.total_guru}    sub="Verified" trend="stable" color="#6366f1" />
                  <StatCard icon={FaBookOpen}          label="Rombongan Belajar"  value={s?.total_rombel}  sub="Classes"  trend="stable" color="#9333ea" />
                  <StatCard
                    icon={FaCheckCircle}
                    label="Presensi Hari Ini"
                    value={`${s?.kehadiran_hari_ini}%`}
                    sub="Daily"
                    trend={s?.kehadiran_hari_ini >= 90 ? "up" : "down"}
                    color="#10b981"
                  />
                </>
              )}
          </div>

          {/* ANALYTICS INSIGHT */}
          {analytics && !loading && (
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-purple-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                <FaLightbulb size={120} />
              </div>
              <h3 className="font-black uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-2">
                <FaChartBar /> Kesimpulan Analitik Akademik
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                  <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest mb-1">Rata-rata Umum</p>
                  <p className="text-3xl font-black">{analytics.avg.toFixed(2)}</p>
                </div>
                <div className="bg-emerald-500/20 backdrop-blur-md p-6 rounded-3xl border border-emerald-400/30">
                  <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">Performa Tertinggi</p>
                  <p className="text-xl font-black">{analytics.bestClass?.kelas}</p>
                  <p className="text-xs font-medium opacity-80">Skor: {analytics.max}</p>
                </div>
                <div className="bg-rose-500/20 backdrop-blur-md p-6 rounded-3xl border border-rose-400/30">
                  <p className="text-rose-100 text-[10px] font-bold uppercase tracking-widest mb-1">Disparitas Nilai</p>
                  <p className="text-xl font-black">{analytics.gap.toFixed(2)} Poin</p>
                  <p className="text-xs font-medium opacity-80">Gap Max-Min</p>
                </div>
              </div>
              <p className="mt-8 text-sm text-purple-50 leading-relaxed max-w-4xl font-medium">
                Berdasarkan analisis data, terdapat selisih performa sebesar{" "}
                <b>{analytics.gap.toFixed(2)}</b> antara kelas tertinggi dan terendah. Saran sistem:
                Fokuskan supervisi pada kelas <b>{analytics.worstClass?.kelas}</b> untuk menyeimbangkan
                capaian pembelajaran di semester ini.
                {radarInsight && (
                  <> Komponen nilai paling lemah saat ini adalah{" "}
                    <b>{radarInsight.weakest?.komponen}</b> (rata-rata:{" "}
                    <b>{radarInsight.weakest?.nilai}</b>), sementara komponen terkuat adalah{" "}
                    <b>{radarInsight.strongest?.komponen}</b> (rata-rata:{" "}
                    <b>{radarInsight.strongest?.nilai}</b>).
                  </>
                )}
              </p>
            </div>
          )}

          {/* CHARTS ROW — Bar + Line */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Bar Chart — Rerata Per Kelas */}
            <div className="bg-white rounded-[3rem] p-10 border border-purple-50 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 mb-10">
                <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm"><FaChartBar /></span>
                Rerata Per Kelas
              </h3>
              <div className="h-80">
                {loading ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.nilai_per_kelas || []}>
                      <defs>
                        <linearGradient id="purpleBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#c084fc" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                      <XAxis dataKey="kelas" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f3ff', radius: 15 }} />
                      <Bar name="Rata-rata" dataKey="rata_rata" fill="url(#purpleBar)" radius={[10, 10, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Line Chart — Tren Rata-rata Nilai (lintas tahun ajaran) */}
            <div className="bg-white rounded-[3rem] p-10 border border-purple-50 shadow-sm">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-[10px] flex items-center gap-4">
                    <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><FaCalendarAlt /></span>
                    Tren Rata-rata Nilai
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 ml-14">
                    Lintas semua tahun ajaran 
                  </p>
                </div>

                {trenInsight && !loading && (
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap
                      ${trenInsight.isUp ? "bg-emerald-50 text-emerald-600"
                        : trenInsight.isDown ? "bg-rose-50 text-rose-600"
                        : "bg-purple-50 text-purple-400"}`}
                  >
                    {trenInsight.isUp ? <FaArrowUp size={8} /> : trenInsight.isDown ? <FaArrowDown size={8} /> : <FaMinus size={8} />}
                    {trenInsight.delta > 0 ? "+" : ""}{trenInsight.delta} poin
                  </span>
                )}
              </div>

              <div className="h-72">
                {loading ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.tren_nilai || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                      <XAxis
                        dataKey="periode"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={48}
                      />
                      <YAxis
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        y={KKM_THRESHOLD}
                        stroke="#f43f5e"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        label={{
                          value: "KKM",
                          position: "insideTopRight",
                          fill: "#f43f5e",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />
                      <Line
                        name="Rata-rata"
                        type="monotone"
                        dataKey="rata_rata"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ fill: '#6366f1', r: 5, strokeWidth: 0 }}
                        activeDot={{ r: 7, fill: '#4f46e5' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW — Radar + Hall of Excellence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Radar Chart */}
            <div className="bg-white rounded-[3rem] p-10 border border-purple-50 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 mb-8">
                <span className="p-3 bg-purple-50 text-purple-600 rounded-2xl shadow-sm"><FaClipboardList /></span>
                Profil Komponen Nilai
              </h3>
              {radarInsight && !loading && (
                <div className="flex gap-3 mb-6">
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    ↑ Terkuat: {radarInsight.strongest?.komponen} ({radarInsight.strongest?.nilai})
                  </span>
                  <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    ↓ Terlemah: {radarInsight.weakest?.komponen} ({radarInsight.weakest?.nilai})
                  </span>
                </div>
              )}
              <div className="h-72">
                {loading ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data?.radar_nilai || []} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="#e9d5ff" />
                      <PolarAngleAxis
                        dataKey="komponen"
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                      />
                      <PolarRadiusAxis
                        domain={[0, 100]}
                        tickCount={5}
                        tick={{ fill: '#94a3b8', fontSize: 9 }}
                        axisLine={false}
                      />
                      <Radar
                        name="Rata-rata Nilai"
                        dataKey="nilai"
                        stroke="#7c3aed"
                        fill="#7c3aed"
                        fillOpacity={0.25}
                        strokeWidth={2}
                        dot={{ fill: '#7c3aed', r: 4 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        formatter={(value) => (
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                            {value}
                          </span>
                        )}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Hall of Excellence */}
            <div className="bg-white rounded-[3rem] p-10 border border-purple-50 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 mb-10">
                <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-sm"><FaTrophy /></span>
                Hall of Excellence
              </h3>
              <div className="space-y-5">
                {loading
                  ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                  : topSiswaDeduplicated.map((siswa, i) => {
                      const uniqueKey = siswa.id != null
                        ? String(siswa.id)
                        : `${siswa.nama}-${siswa.kelas}`;
                      return (
                        <div
                          key={uniqueKey}
                          className="flex items-center justify-between p-5 rounded-[1.5rem] bg-purple-50/30 hover:bg-white hover:shadow-xl hover:shadow-purple-100 transition-all group border border-transparent hover:border-purple-100 cursor-default"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md transition-transform group-hover:scale-110
                              ${i === 0 ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white"
                                : i === 1 ? "bg-slate-300 text-slate-700"
                                : "bg-white text-purple-400 border border-purple-50"}`}>
                              {i + 1}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-sm tracking-tight group-hover:text-purple-700 transition-colors">{siswa.nama}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Kelas {siswa.kelas}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-purple-600 leading-none">{siswa.nilai}</span>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Avg Score</p>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}