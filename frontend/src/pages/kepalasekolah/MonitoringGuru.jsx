import React, { useState, useEffect } from "react";
import SidebarKepsek from "../../components/SidebarKepalasekolah";
import api from "../../api";
import { toast } from "react-hot-toast";
import {
  FaSyncAlt, FaSpinner, FaArrowLeft,
  FaArrowUp, FaArrowDown, FaLayerGroup, FaSchool,
} from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const KKM = 75;

const PERFORMANCE_MAP = {
  "Sangat Baik":    { color: "#7c3aed", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  "Baik":           { color: "#8b5cf6", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  "Cukup":          { color: "#a855f7", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
  "Perlu Pembinaan":{ color: "#ec4899", bg: "bg-pink-500/10",   border: "border-pink-500/20" },
};

// ─── TOOLTIP CUSTOM ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-purple-100 shadow-xl rounded-2xl p-4 text-xs">
      <p className="font-black text-slate-700 mb-2 border-b pb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500 font-bold">{p.name}:</span>
          <span className="font-black text-purple-700">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function MonitoringGuru() {
  const [gurus, setGurus]               = useState([]);
  const [selectedGuru, setSelectedGuru] = useState(null);   // { guru, subjects, tahun_list, tahun_dipilih }
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [loading, setLoading]           = useState(true);

  useEffect(() => { fetchGurus(); }, []);

  const fetchGurus = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/kepsek/monitoring-guru");
      setGurus(res.data.data || []);
    } catch { toast.error("Gagal koneksi ke server"); }
    finally { setLoading(false); }
  };

  const fetchGuruSubjects = async (id, tahun = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/api/kepsek/monitoring-guru/${id}/subjects`, {
        params: tahun ? { tahun_ajaran: tahun } : {},
      });
      setSelectedGuru({ guruId: id, ...res.data.data });
      setActiveAnalysis(null);
    } catch { toast.error("Data mapel gagal diambil"); }
    finally { setLoading(false); }
  };

  const fetchSubjectAnalysis = async (guruId, mapelId, rombelId, tahun = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/api/kepsek/monitoring-guru/${guruId}/analysis`, {
        params: { mapel_id: mapelId, rombel_id: rombelId, ...(tahun ? { tahun_ajaran: tahun } : {}) },
      });
      setActiveAnalysis({ guruId, mapelId, rombelId, ...res.data.data });
    } catch { toast.error("Analisis gagal dimuat"); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-slate-900 font-medium">
      <SidebarKepsek />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">

          {loading && (
            <div className="fixed top-10 right-10 z-50 p-2 bg-white rounded-full shadow-lg border border-purple-100">
              <FaSpinner className="animate-spin text-purple-600" />
            </div>
          )}

          {!selectedGuru ? (
            <Level1
              gurus={gurus}
              onSelect={fetchGuruSubjects}
              onRefresh={fetchGurus}
            />
          ) : !activeAnalysis ? (
            <Level2
              data={selectedGuru}
              onBack={() => setSelectedGuru(null)}
              onSelect={fetchSubjectAnalysis}
              onTahunChange={(tahun) => fetchGuruSubjects(selectedGuru.guruId, tahun)}
            />
          ) : (
            <Level3
              data={activeAnalysis}
              onBack={() => setActiveAnalysis(null)}
              onTahunChange={(tahun) =>
                fetchSubjectAnalysis(
                  activeAnalysis.guruId,
                  activeAnalysis.mapelId,
                  activeAnalysis.rombelId,
                  tahun
                )
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ─── LEVEL 1: Daftar Guru ────────────────────────────────────────────────────
const Level1 = ({ gurus, onSelect, onRefresh }) => (
  <div>
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Monitoring Guru</h1>
        <p className="text-sm text-slate-400">Dashboard Evaluasi Kinerja Pengajar</p>
      </div>
      <button
        onClick={onRefresh}
        className="p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-300 transition-all shadow-sm group"
      >
        <FaSyncAlt className="text-slate-400 group-hover:text-purple-600" />
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {gurus.map(g => (
        <div
          key={g.id}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-purple-400 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
            {(g.name || "G").charAt(0)}
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">{g.name}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{g.nip || "-"}</p>
          <button
            onClick={() => onSelect(g.id)}
            className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all"
          >
            Pilih Guru
          </button>
        </div>
      ))}
    </div>
  </div>
);

// ─── LEVEL 2: Mapel yang Diajar (per Tahun Ajaran) ──────────────────────────
const Level2 = ({ data, onBack, onSelect, onTahunChange }) => {
  const { guru, subjects, tahun_list = [], tahun_dipilih } = data;

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-purple-600 transition-all"
      >
        <FaArrowLeft /> Kembali ke Daftar Guru
      </button>

      {/* Header guru + dropdown tahun */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-600 to-violet-700 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-purple-200">
            {(guru?.name || "G").charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{guru?.name}</h2>
            <p className="text-sm text-slate-400">Pilih mapel untuk melihat tren kinerja</p>
          </div>
        </div>

        {/* Dropdown tahun ajaran */}
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Tahun Ajaran
          </label>
          <select
            value={tahun_dipilih || ""}
            onChange={(e) => onTahunChange(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-purple-400 outline-none shadow-sm"
          >
            {tahun_list.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {subjects?.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center text-slate-400 text-sm font-bold">
          Tidak ada penugasan pada tahun ajaran ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(subjects || []).map(s => {
            const perf = PERFORMANCE_MAP[s.kinerja] || PERFORMANCE_MAP["Cukup"];
            return (
              <div
                key={`${s.mapel_id}-${s.rombel_id}`}
                onClick={() => onSelect(guru.id, s.mapel_id, s.rombel_id, tahun_dipilih)}
                className="bg-white p-6 rounded-3xl border border-slate-100 cursor-pointer hover:border-purple-400 transition-all flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <FaLayerGroup size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{s.nama_mapel}</h4>
                    <p className="text-[10px] font-bold text-purple-600 uppercase mt-1 flex items-center gap-1">
                      <FaSchool size={10} /> {s.nama_rombel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border mb-1 ${perf.bg} ${perf.border}`}
                    style={{ color: perf.color }}
                  >
                    {s.kinerja}
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase">Avg: {s.avg_nilai}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── LEVEL 3: Analisis Tren per Mapel ───────────────────────────────────────
const Level3 = ({ data, onBack, onTahunChange }) => {
  const perf = PERFORMANCE_MAP[data.kinerja] || PERFORMANCE_MAP["Cukup"];

  // Hitung growth dari tren: bandingkan titik pertama dan terakhir
  const tren = data.tren || [];
  const growth = tren.length >= 2
    ? (tren[tren.length - 1].rata_rata - tren[0].rata_rata).toFixed(1)
    : null;
  const isUp = growth !== null && parseFloat(growth) >= 0;

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-purple-600 transition-all"
      >
        <FaArrowLeft /> Kembali ke Mapel
      </button>

      {/* Judul + dropdown tahun untuk stat cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">{data.mapel}</h2>
          <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
            <FaSchool size={11} className="text-purple-400" /> {data.kelas}
          </p>
        </div>

        {/* Dropdown — ubah tahun untuk stat cards (chart selalu tampil semua tahun) */}
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            Stat Tahun
          </label>
          <select
            value={data.tahun_dipilih || ""}
            onChange={(e) => onTahunChange(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-purple-400 outline-none shadow-sm"
          >
            {/* Bangun list dari data tren yang tersedia */}
            {[...new Set(tren.map(t => t.periode.split(' (')[0]))].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Kolom kiri — stat cards */}
        <div className="lg:col-span-4 space-y-5">

          {/* Kinerja */}
          <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Rata-rata Nilai Siswa</p>
            <div
              className={`inline-flex px-5 py-2 rounded-2xl text-[10px] font-black uppercase border ${perf.bg} ${perf.border}`}
              style={{ color: perf.color }}
            >
              {data.kinerja}
            </div>
            <p className="text-3xl font-black text-slate-800 mt-4">{data.avgNow}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              Rata-rata {data.tahun_dipilih}
            </p>
          </div>

          {/* KKM Mastery */}
          <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">KKM Mastery</p>
            <p className="text-3xl font-black text-purple-600">{data.pct_atas_kkm}%</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              {data.total_dinilai} siswa dinilai
            </p>
          </div>

          {/* Overall Growth (titik pertama → terakhir dalam tren) */}
          <div className="bg-slate-900 p-7 rounded-[2.5rem] text-white">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">
              Overall Growth
            </p>
            {growth !== null ? (
              <div className="flex items-center gap-3">
                <p className="text-3xl font-black">{isUp ? `+${growth}` : growth}</p>
                <div className={`p-2 rounded-xl ${isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {isUp ? <FaArrowUp /> : <FaArrowDown />}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm font-bold">Data belum cukup</p>
            )}
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-2">
              {tren.length > 0 ? `${tren[0].periode} → ${tren[tren.length - 1].periode}` : "-"}
            </p>
          </div>
        </div>

        {/* Kolom kanan — chart tren semua tahun */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              Tren Rata-rata Nilai — Semua Tahun Ajaran
            </p>

            {tren.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-slate-300 text-sm font-bold">
                Belum ada data tren
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tren} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                      dataKey="periode"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94A3B8' }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={52}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94A3B8' }}
                    />
                    {/* Garis KKM */}
                    <ReferenceLine
                      y={KKM}
                      stroke="#f43f5e"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{ value: `KKM ${KKM}`, position: 'insideTopRight', fontSize: 9, fill: '#f43f5e', fontWeight: 'bold' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      name="Rata-rata"
                      type="monotone"
                      dataKey="rata_rata"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      dot={{ fill: '#7c3aed', r: 5, strokeWidth: 0 }}
                      activeDot={{ r: 7, fill: '#4f46e5' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Tabel ringkasan tren */}
            {tren.length > 0 && (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="text-left pb-2 pr-4">Periode</th>
                      <th className="text-center pb-2 px-3">Rata-rata</th>
                      <th className="text-center pb-2 px-3">Siswa</th>
                      <th className="text-center pb-2 pl-3">Atas KKM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {tren.map((row, i) => (
                      <tr
                        key={i}
                        className={`${row.periode.startsWith(data.tahun_dipilih) ? 'bg-purple-50/50' : ''}`}
                      >
                        <td className="py-2 pr-4 font-bold text-slate-700">{row.periode}</td>
                        <td className="py-2 px-3 text-center font-black text-purple-700">{row.rata_rata}</td>
                        <td className="py-2 px-3 text-center text-slate-500">{row.total_siswa}</td>
                        <td className="py-2 pl-3 text-center text-emerald-600 font-bold">{row.atas_kkm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};