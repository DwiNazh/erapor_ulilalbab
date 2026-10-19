import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import SidebarGuru from "../../../components/SidebarGuru";
import { FaChevronLeft } from "react-icons/fa";

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function RekapAbsensiHarian() {
  const { rombelId } = useParams();
  const navigate = useNavigate();

  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRekap = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/guru/absensi/harian/rekap", {
        params: { rombel_id: rombelId, bulan, tahun },
      });
      setData(res.data.data || []);
    } catch (err) {
      toast.error("Gagal memuat rekap absensi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulan, tahun]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarGuru />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors mb-6"
          >
            <FaChevronLeft /> Kembali
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-black text-slate-800">
                Rekap Absensi Harian
              </h1>

              <div className="flex gap-2">
                <select
                  value={bulan}
                  onChange={(e) => setBulan(Number(e.target.value))}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
                >
                  {NAMA_BULAN.map((b, i) => (
                    <option key={i} value={i + 1}>{b}</option>
                  ))}
                </select>
                <select
                  value={tahun}
                  onChange={(e) => setTahun(Number(e.target.value))}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
                >
                  {[tahun - 1, tahun, tahun + 1].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400">Memuat rekap...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 font-black text-slate-400 text-xs uppercase">#</th>
                      <th className="px-4 py-3 font-black text-slate-400 text-xs uppercase">Nama</th>
                      <th className="px-4 py-3 font-black text-emerald-500 text-xs uppercase text-center">Hadir</th>
                      <th className="px-4 py-3 font-black text-amber-500 text-xs uppercase text-center">Sakit</th>
                      <th className="px-4 py-3 font-black text-sky-500 text-xs uppercase text-center">Izin</th>
                      <th className="px-4 py-3 font-black text-rose-500 text-xs uppercase text-center">Alfa</th>
                      <th className="px-4 py-3 font-black text-indigo-500 text-xs uppercase text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.map((s, idx) => (
                      <tr key={s.siswa_tahun_id}>
                        <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-700">
                          {s.nama}
                          <span className="block text-[11px] font-mono text-slate-400">{s.nis}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-black text-emerald-600">{s.hadir}</td>
                        <td className="px-4 py-3 text-center font-black text-amber-600">{s.sakit}</td>
                        <td className="px-4 py-3 text-center font-black text-sky-600">{s.izin}</td>
                        <td className="px-4 py-3 text-center font-black text-rose-600">{s.alfa}</td>
                        <td className="px-4 py-3 text-center font-black text-indigo-600">{s.total_pertemuan}</td>
                      </tr>
                    ))}
                    {data.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-10 text-slate-400">
                          Belum ada data absensi bulan ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}