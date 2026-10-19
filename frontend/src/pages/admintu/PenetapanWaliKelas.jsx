import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";
import api from "../../api";
import { 
  FaChalkboardTeacher, 
  FaSyncAlt, 
  FaChevronRight, 
  FaInfoCircle, 
  FaSave, 
  FaLock, 
  FaUserShield 
} from "react-icons/fa";

export default function PenetapanWaliKelas() {
  const navigate = useNavigate();

  const [tahunAktif, setTahunAktif] = useState(null);
  const [tahunTujuan, setTahunTujuan] = useState(null);
  const [rombels, setRombels] = useState([]);
  const [gurus, setGurus] = useState([]);
  const [waliAssignments, setWaliAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  const API = "/api/tu";

  const fetchData = async () => {
    setLoading(true);
    try {
      const resAktif = await api.get(`${API}/tahunajaran/aktif`);
      const tahunAktifData = resAktif.data?.data;
      setTahunAktif(tahunAktifData);
      setIsFinalized(!!tahunAktifData?.kenaikan_kelas_finalized_at || !!tahunAktifData?.finalized_at);

      let targetNama = "";
      const match = tahunAktifData?.nama?.match(/^(\d{4})\/(\d{4})$/);
      if (match) {
        const [, thAwal, thAkhir] = match;
        targetNama = `${parseInt(thAwal) + 1}/${parseInt(thAkhir) + 1}`;
      }

      const resAll = await api.get(`${API}/tahunajaran`);
      const allTahun = resAll.data?.data || [];
      let targetTahun = allTahun.find((t) => t.nama === targetNama);

      if (!targetTahun && allTahun.length > 0) {
        targetTahun = allTahun.sort((a, b) => b.nama.localeCompare(a.nama))[0];
      }

      if (!targetTahun) {
        toast.error("Tahun ajaran target tidak ditemukan");
        return;
      }

      setTahunTujuan(targetTahun);

      const [resRombel, resGuru, resWali] = await Promise.all([
        api.get(`${API}/rombel`, { params: { tahun_ajaran_id: targetTahun.id } }),
        api.get(`${API}/guru`),
        api.get(`${API}/wali-kelas`, { params: { tahun_ajaran_id: targetTahun.id } }),
      ]);

      const rombelData = resRombel.data?.data || [];
      // Filter untuk menampilkan rombel kelas 2-6 saja jika diinginkan, 
      // atau biarkan semua jika rombel kelas 1 sudah dibuat di modul sebelumnya.
      setRombels(rombelData);
      setGurus(resGuru.data?.data || []);

      const assignments = {};
      (resWali.data?.data || []).forEach((item) => {
        assignments[item.rombel_id || item.id] = item.guru_id || null;
      });
      setWaliAssignments(assignments);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignmentChange = (rombelId, guruId) => {
    setWaliAssignments((prev) => ({
      ...prev,
      [rombelId]: guruId || null,
    }));
  };

  const handleSimpan = async () => {
    if (!tahunTujuan?.id) return toast.error("Tahun ajaran target belum dimuat");

    setProcessing(true);
    try {
      const payload = {
        tahun_ajaran_id: tahunTujuan.id,
        wali_kelas: waliAssignments,
      };
      await api.post(`${API}/wali-kelas`, payload);
      toast.success("Penetapan wali kelas berhasil disimpan");
      navigate("/dashboardtusd/finalisasi-total");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setProcessing(false);
    }
  };

  // Loading State - Modern Skeleton
  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />
      <div className="flex-1 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
        <div className="h-20 bg-slate-200 rounded-2xl mb-8"></div>
        <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <SidebarAdminTu />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaUserShield className="text-indigo-600" /> Penetapan Wali Kelas
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">{tahunAktif?.nama}</span>
                <FaChevronRight className="text-slate-400" />
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">Target: {tahunTujuan?.nama}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={fetchData}
                className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
              >
                <FaSyncAlt />
              </button>
            </div>
          </div>

          {isFinalized ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock size={24} />
              </div>
              <h2 className="text-xl font-bold text-emerald-800">Siklus Telah Dikunci</h2>
              <p className="text-emerald-600 mt-2">Data penetapan wali kelas sudah difinalisasi dan tidak dapat diubah lagi.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* INFO BOX */}
              <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4 text-center md:text-left">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaChalkboardTeacher size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Tentukan Wali Kelas</h3>
                    <p className="text-indigo-100 text-sm opacity-90">Pasangkan tenaga pendidik dengan rombel yang telah dibentuk pada TA {tahunTujuan?.nama}.</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest">
                  {rombels.length} Rombel Tersedia
                </div>
              </div>

              {rombels.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center">
                  <FaInfoCircle className="text-slate-300 text-5xl mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-700">Rombel Belum Dibuat</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">Silakan buat rombel terlebih dahulu di menu Penempatan Siswa atau Manajemen Rombel.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                          <th className="px-8 py-4">Rombel / Kelas</th>
                          <th className="px-8 py-4">Pilih Wali Kelas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {rombels.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 text-lg">
                                  Kelas {r.tingkat_kelas || r.kelas}{r.sub_nama || r.sub_kelas}
                                </span>
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">Unit SD</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="relative max-w-sm">
                                <select
                                  value={waliAssignments[r.id] || ""}
                                  onChange={(e) => handleAssignmentChange(r.id, e.target.value)}
                                  disabled={processing}
                                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-slate-700 appearance-none"
                                >
                                  <option value="">-- Pilih Guru --</option>
                                  {gurus.map((g) => (
                                    <option key={g.id} value={g.id}>
                                      {g.name} {g.nipy ? `(${g.nipy})` : ""}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                   <FaChevronRight className="rotate-90 text-[10px]" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                       <FaInfoCircle className="text-indigo-500" />
                       <span>Pastikan semua rombel sudah memiliki wali kelas sebelum finalisasi.</span>
                    </div>
                    <button
                      onClick={handleSimpan}
                      disabled={processing}
                      className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
                    >
                      {processing ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
                      {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}