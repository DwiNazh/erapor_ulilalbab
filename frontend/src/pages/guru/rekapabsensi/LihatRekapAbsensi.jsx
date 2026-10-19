import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import SidebarGuru from "../../../components/SidebarGuru";

import { FaFileDownload, FaUserCheck } from "react-icons/fa";

export default function LihatRekapAbsensi() {
  const { rombelId, mapelId } = useParams();
  const location = useLocation();
  const penugasan = location.state?.penugasan;

  const [rekapData, setRekapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState("semester1");

  useEffect(() => {
    fetchRekap();
  }, [semester, rombelId, mapelId]);

  const fetchRekap = async () => {
    if (!rombelId || !mapelId) {
      toast.error("Rombel ID atau Mapel ID tidak ditemukan");
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/api/guru/absensi/rekap", {
        params: {
          rombel_id: rombelId,
          mapel_id: mapelId,
          semester: semester,
        },
      });

      setRekapData(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat rekap:", err.response?.data);
      toast.error(err.response?.data?.message || "Gagal memuat data rekap");
    } finally {
      setLoading(false);
    }
  };

  const calculatePersentase = (hadir, total) => {
    if (!total || total === 0) return 0;
    return ((hadir / total) * 100).toFixed(1);
  };

  const rataRata =
    rekapData.length > 0
      ? (
          rekapData.reduce(
            (acc, curr) =>
              acc + parseFloat(calculatePersentase(curr.hadir, curr.total_pertemuan)),
            0
          ) / rekapData.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarGuru />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                Rekapitulasi Presensi
              </h1>
              <p className="text-slate-500 font-medium">
                {penugasan?.mapel?.nama || `Mapel ID: ${mapelId}`} •{" "}
                {penugasan?.rombel
                  ? `${penugasan.rombel.tingkat_kelas} ${penugasan.rombel.sub_nama}`
                  : `Rombel ID: ${rombelId}`}
              </p>
            </div>

            <div className="flex gap-3">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm shadow-sm outline-none"
              >
                <option value="semester1">Semester Ganjil</option>
                <option value="semester2">Semester Genap</option>
              </select>

              <button className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
                <FaFileDownload /> Export Excel
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
                <FaUserCheck />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">
                  Rata-rata Kehadiran
                </p>
                <p className="text-2xl font-black text-slate-800">{rataRata}%</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-10 text-center font-bold text-slate-500">
                Memuat data rekap...
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      No
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Nama Siswa
                    </th>
                    <th className="px-4 py-5 text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center">
                      H
                    </th>
                    <th className="px-4 py-5 text-[10px] font-black text-blue-500 uppercase tracking-widest text-center">
                      S
                    </th>
                    <th className="px-4 py-5 text-[10px] font-black text-amber-500 uppercase tracking-widest text-center">
                      I
                    </th>
                    <th className="px-4 py-5 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">
                      A
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Persentase
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {rekapData.map((item, idx) => {
                    const persen = calculatePersentase(item.hadir, item.total_pertemuan);

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4 text-center font-bold text-slate-400 text-xs">
                          {idx + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-700 text-sm">
                            {item.nama}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.nis}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center font-bold text-emerald-600 bg-emerald-50/30">
                          {item.hadir}
                        </td>

                        <td className="px-4 py-4 text-center font-bold text-blue-600">
                          {item.sakit}
                        </td>

                        <td className="px-4 py-4 text-center font-bold text-amber-600">
                          {item.izin}
                        </td>

                        <td className="px-4 py-4 text-center font-bold text-rose-600">
                          {item.alfa}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`text-xs font-black ${
                                persen < 80 ? "text-rose-500" : "text-slate-700"
                              }`}
                            >
                              {persen}%
                            </span>

                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  persen < 80 ? "bg-rose-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${persen}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}