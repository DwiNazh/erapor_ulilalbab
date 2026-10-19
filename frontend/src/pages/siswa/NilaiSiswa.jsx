import React, { useState, useEffect } from "react";
import SidebarSiswa from "../../components/SidebarSiswa";
import { FileText, Loader2, Calculator } from "lucide-react";

// 🔧 Toggle ini untuk sembunyikan/tampilkan data Al-Qur'an sementara.
// Set ke false lagi kalau ingin menampilkan data Al-Qur'an seperti semula.
const HIDE_QURAN = true;

export default function NilaiSiswa() {
  const siswa = JSON.parse(localStorage.getItem("siswa_data") || "{}");
  const token = localStorage.getItem("siswa_token");

  const [nilai, setNilai] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [semester, setSemester] = useState("1");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNilai();
  }, [semester, tahunAjaran]);

  const fetchNilai = async () => {
    if (!siswa?.id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ semester });
      if (tahunAjaran) params.append("tahun_ajaran", tahunAjaran);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/siswa/nilai?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setNilai(data?.data || []);

      if (data?.tahun_list?.length > 0) {
        setTahunList(data.tahun_list);
        if (!tahunAjaran) setTahunAjaran(data.tahun_list[0]);
      }
    } catch (e) {
      console.error("Gagal load nilai", e);
    } finally {
      setLoading(false);
    }
  };

  const getRataUH = (row) => {
    const uh = [row.uh1, row.uh2, row.uh3, row.uh4, row.uh5]
      .filter((v) => v !== null && v !== undefined && v !== "" && v !== 0);
    
    return uh.length 
      ? Math.round(uh.reduce((a, b) => a + b, 0) / uh.length) 
      : 0;
  };

  const hitungNilaiRaport = (row) => {
    const rataUH = getRataUH(row);
    const pts = row.pts || 0;
    const pas = row.pas || 0;

    if (!rataUH && !row.pts && !row.pas) return "-";

    return Math.round(rataUH * 0.4 + pts * 0.3 + pas * 0.3);
  };

  const nilaiColor = (val) => {
    if (val === "-" || val === null || val === undefined || val === "") return "text-slate-300";
    const n = Number(val);
    if (n >= 80) return "text-emerald-600 font-bold";
    if (n >= 70) return "text-blue-600 font-semibold";
    if (n >= 60) return "text-amber-600";
    return "text-rose-600 font-semibold";
  };

  // 🔧 Data yang ditampilkan di tabel — filter data Al-Qur'an jika HIDE_QURAN aktif
  const nilaiTampil = HIDE_QURAN ? nilai.filter((row) => !row.is_quran) : nilai;

  return (
    <div className="flex min-h-screen bg-[#fff8f3]">
      <SidebarSiswa />
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Nilai <span className="text-orange-500">Akademik</span>
            </h1>
            <p className="text-slate-500 mt-1">Pantau perkembangan nilai ulangan dan rapor kamu.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <select value={semester} onChange={e => setSemester(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-orange-400 bg-white outline-none">
              <option value="1">Semester 1 (Ganjil)</option>
              <option value="2">Semester 2 (Genap)</option>
            </select>

            <select value={tahunAjaran} onChange={e => setTahunAjaran(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-orange-400 bg-white outline-none">
              <option value="">-- Tahun Ajaran --</option>
              {tahunList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Info Rumus */}
          <div className="mb-4 flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-indigo-800 text-xs font-medium">
            <Calculator size={16} className="text-indigo-500" />
            <span><b>Sistem Penilaian:</b> (Rata-rata UH × 40%) + (PTS × 30%) + (PAS × 30%)</span>
          </div>

          {/* Tabel Nilai */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2 bg-white">
              <FileText size={18} className="text-orange-500" />
              <h2 className="font-bold text-slate-700">
                Laporan Capaian Siswa {tahunAjaran && `— ${tahunAjaran}`}
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-orange-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                      <th className="px-6 py-4">Mata Pelajaran</th>
                      <th className="px-2 py-4 text-center">UH1</th>
                      <th className="px-2 py-4 text-center">UH2</th>
                      <th className="px-2 py-4 text-center">UH3</th>
                      <th className="px-2 py-4 text-center">UH4</th>
                      <th className="px-2 py-4 text-center">UH5</th>
                      <th className="px-4 py-4 text-center text-indigo-500">Rata UH</th>
                      <th className="px-2 py-4 text-center">PTS</th>
                      <th className="px-2 py-4 text-center">PAS</th>
                      <th className="px-6 py-4 text-center bg-orange-50 text-orange-600">Nilai Rapor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {nilaiTampil.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-16 text-slate-400 italic font-medium">
                          Data nilai belum tersedia untuk semester ini.
                        </td>
                      </tr>
                    ) : nilaiTampil.map((row, i) => {
                        const rataUH = getRataUH(row);
                        const nRapor = hitungNilaiRaport(row);
                        
                        return (
                          <tr key={i} className={`transition-colors group ${row.is_quran ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-orange-50/20'}`}>
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-800 block">{row.nama_mapel}</span>
                                <span className={`text-[9px] uppercase font-black tracking-wider ${row.is_quran ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {row.is_quran ? "Al-Qur'an Pecahan" : "Intrakurikuler"}
                                </span>
                            </td>
                            
                            {[row.uh1, row.uh2, row.uh3, row.uh4, row.uh5].map((val, idx) => (
                                <td key={idx} className={`px-2 py-4 text-center font-semibold ${nilaiColor(val)}`}>
                                    {val || "-"}
                                </td>
                            ))}

                            <td className="px-4 py-4 text-center">
                                <div className={`${row.is_quran ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-50 text-indigo-700'} py-1 rounded-lg font-black text-xs`}>
                                    {rataUH || "-"}
                                </div>
                            </td>

                            <td className={`px-2 py-4 text-center font-semibold ${nilaiColor(row.pts)}`}>
                                {row.pts ?? "-"}
                            </td>
                            <td className={`px-2 py-4 text-center font-semibold ${nilaiColor(row.pas)}`}>
                                {row.pas ?? "-"}
                            </td>

                            <td className={`px-6 py-4 text-center ${row.is_quran ? 'bg-emerald-50/30' : 'bg-orange-50/30'}`}>
                              <div className={`text-xl font-black ${nilaiColor(nRapor)}`}>
                                {nRapor}
                              </div>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> ≥ 80 Sangat Baik</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> ≥ 70 Baik</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> ≥ 60 Cukup</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> &lt; 60 Kurang</div>
            </div>
            <div className="text-[10px] text-slate-400 italic">
                *Nilai di atas dihitung secara otomatis oleh sistem akademik.
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}