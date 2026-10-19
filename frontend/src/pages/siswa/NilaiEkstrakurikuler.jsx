import React, { useEffect, useState } from "react";
import SidebarSiswa from "../../components/SidebarSiswa";
import { FileText, Loader2, Calendar, Info } from "lucide-react";

export default function NilaiEkstrakurikuler() {
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
    setLoading(true);
    setNilai([]); 

    try {
      const params = new URLSearchParams({ semester });
      if (tahunAjaran) params.append("tahun_ajaran", tahunAjaran);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/siswa/nilai/ekstrakurikuler?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      setNilai(data?.data || []);

      // Sinkronisasi daftar tahun ajaran dari backend
      if (data?.tahun_list?.length > 0) {
        setTahunList(data.tahun_list);
        // Set default tahun ajaran ke yang terbaru jika state masih kosong
        if (!tahunAjaran) setTahunAjaran(data.tahun_list[0]);
      }
    } catch (error) {
      console.error("Gagal mengambil nilai ekstrakurikuler", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fff8f3]">
      <SidebarSiswa />
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Nilai <span className="text-orange-500">Ekstrakurikuler</span>
            </h1>
            <p className="text-slate-500 mt-1">Laporan pengembangan diri siswa.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-3xl border border-orange-100 shadow-sm">
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-orange-400 bg-slate-50 outline-none"
              >
                <option value="1">Semester 1 (Ganjil)</option>
                <option value="2">Semester 2 (Genap)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Tahun Ajaran</label>
              <select
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                className="border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-orange-400 bg-slate-50 outline-none"
              >
                {tahunList.length === 0 && <option value="">-- Belum Ada Data --</option>}
                {tahunList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-orange-50/30">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-orange-500" />
                <h2 className="font-bold text-slate-700">Laporan Ekskul Semester {semester}</h2>
              </div>
              {tahunAjaran && (
                <span className="text-xs font-black bg-orange-500 text-white px-4 py-1.5 rounded-full uppercase">
                  TA {tahunAjaran}
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3">
                <Loader2 size={32} className="animate-spin text-orange-400" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
              </div>
            ) : nilai.length === 0 ? (
              <div className="py-24 text-center">
                <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium italic">Tidak ada data ekstrakurikuler untuk periode ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                      <th className="px-8 py-4">Kegiatan Ekstrakurikuler</th>
                      <th className="px-8 py-4 text-center">Nilai / Predikat</th>
                      <th className="px-8 py-4">Deskripsi Kemajuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {nilai.map((row, i) => (
                      <tr key={i} className="hover:bg-orange-50/20 transition-colors">
                        <td className="px-8 py-5">
                          <span className="font-bold text-slate-700 block">{row.nama_ekstrakurikuler}</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="px-4 py-1.5 rounded-xl bg-orange-100 text-orange-700 font-black text-xs border border-orange-200">
                            {row.nilai || "-"}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-xs text-slate-500 leading-relaxed italic">
                            {row.deskripsi ? `"${row.deskripsi}"` : "Belum ada deskripsi."}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2 text-indigo-500 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <Info size={18} />
            <p className="text-[11px] font-medium">
              Data nilai ekstrakurikuler diambil langsung dari sistem penilaian wali kelas/pembina ekskul.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}