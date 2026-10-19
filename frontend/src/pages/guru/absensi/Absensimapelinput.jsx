import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import SidebarGuru from "../../../components/SidebarGuru";
import {
  FaChevronLeft,
  FaSave,
  FaSyncAlt,
  FaInfoCircle,
  FaUserGraduate,
  FaCheckCircle,
  FaClipboardCheck,
} from "react-icons/fa";

const STATUS_OPTIONS = [
  { value: "H", label: "Hadir", color: "bg-emerald-100 text-emerald-700 border-emerald-200 active:bg-emerald-600 active:text-white" },
  { value: "S", label: "Sakit", color: "bg-blue-100 text-blue-700 border-blue-200 active:bg-blue-600 active:text-white" },
  { value: "I", label: "Izin", color: "bg-amber-100 text-amber-700 border-amber-200 active:bg-amber-600 active:text-white" },
  { value: "A", label: "Alfa", color: "bg-red-100 text-red-700 border-red-200 active:bg-red-600 active:text-white" },
];

export default function AbsensiMapelInput() {
  const { rombelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const penugasan = location.state?.penugasan;

  const [siswaList, setSiswaList] = useState([]);
  const [absensi, setAbsensi] = useState({});
  const [semester, setSemester] = useState("semester1");
  const [pertemuanKe, setPertemuanKe] = useState(1);
  const [pertemuanTerakhir, setPertemuanTerakhir] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [searchNama, setSearchNama] = useState("");

  const mapelId = penugasan?.mapel_id || penugasan?.mapel?.id;
  const mapelNama = penugasan?.mapel?.nama || penugasan?.nama_mapel || "Mata Pelajaran";
  const kelasNama = penugasan?.rombel ? `Kelas ${penugasan.rombel.tingkat_kelas} ${penugasan.rombel.sub_nama}` : `Rombel ${rombelId}`;

  useEffect(() => {
    if (!mapelId) {
      toast.error("Data mapel tidak ditemukan.");
      return;
    }
    fetchSiswa();
  }, [rombelId, mapelId]);

  useEffect(() => {
    if (mapelId) fetchPertemuanTerakhir();
  }, [semester, mapelId]);

  const fetchSiswa = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/guru/rombel/${rombelId}/siswa`);
      
      // FIX SORTING: Urutkan daftar siswa gabungan berdasarkan abjad nama A-Z
      const siswaSorted = (res.data.data || []).sort((a, b) => 
        a.nama.localeCompare(b.nama)
      );
      setSiswaList(siswaSorted);

      const defaultAbsensi = {};
      siswaSorted.forEach((s) => {
        defaultAbsensi[s.id] = { status: "H", keterangan: "" };
      });
      setAbsensi(defaultAbsensi);
    } catch (err) {
      toast.error("Gagal memuat data siswa");
    } finally {
      setLoading(false);
    }
  };

  const fetchPertemuanTerakhir = async () => {
    try {
      const res = await api.get("/api/guru/absensi/pertemuan-terakhir", {
        params: { rombel_id: rombelId, mapel: mapelId, semester },
      });
      const terakhir = res.data.data?.pertemuan_terakhir || 0;
      setPertemuanTerakhir(terakhir);
      setPertemuanKe(terakhir + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (siswaId, status) => {
    setAbsensi((prev) => ({
      ...prev,
      [siswaId]: { ...prev[siswaId], status },
    }));
  };

  const handleKeteranganChange = (siswaId, keterangan) => {
    setAbsensi((prev) => ({
      ...prev,
      [siswaId]: { ...prev[siswaId], keterangan },
    }));
  };

  const handleSimpan = async () => {
    setLoadingSave(true);
    try {
      const payload = {
        rombel_id: Number(rombelId),
        mapel_id: mapelId,
        semester,
        pertemuan_ke: pertemuanKe,
        tanggal: tanggal,
        absensi: siswaList.map((s) => ({
          siswa_id: s.id,
          status: absensi[s.id]?.status || "H",
          keterangan: absensi[s.id]?.keterangan || "",
        })),
      };

      await api.post("/api/guru/absensi", payload);
      toast.success(`Absensi Berhasil Disimpan!`);
      await fetchPertemuanTerakhir();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan absensi");
    } finally {
      setLoadingSave(false);
    }
  };

  const filteredSiswaList = siswaList.filter((s) =>
    s.nama.toLowerCase().includes(searchNama.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex min-h-screen bg-slate-50">
        <SidebarGuru />
        <div className="flex-1 p-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
          <div className="h-24 bg-slate-200 rounded-[2.5rem] mb-8"></div>
          <div className="h-[500px] bg-slate-200 rounded-[2.5rem]"></div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <SidebarGuru />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors mb-4 group">
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
              </button>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
                <FaClipboardCheck className="text-indigo-600" /> Absensi {mapelNama}
              </h1>
              <p className="text-slate-500 mt-1 font-medium italic">{kelasNama} • {semester === "semester1" ? "Ganjil" : "Genap"}</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-[280px]">
                <input type="text" placeholder="Cari nama siswa..." value={searchNama} onChange={(e) => setSearchNama(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <button onClick={fetchSiswa} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"><FaSyncAlt /></button>
              <button onClick={handleSimpan} disabled={loadingSave || siswaList.length === 0} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all disabled:opacity-50">
                {loadingSave ? <FaSyncAlt className="animate-spin" /> : <FaSave />} Simpan Absensi
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tanggal</label>
                <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Semester</label>
                <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                  <option value="semester1">Ganjil (1)</option>
                  <option value="semester2">Genap (2)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pertemuan</label>
                <input type="number" min="1" value={pertemuanKe} onChange={(e) => setPertemuanKe(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
              <FaInfoCircle className="text-indigo-500 mt-1" />
              <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">Input absensi akan tercatat pada tanggal <b>{new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</b> untuk pertemuan ke-<b>{pertemuanKe}</b>.</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 text-center">No</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas Siswa</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Kehadiran</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Keterangan Tambahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSiswaList.length > 0 ? (
                    filteredSiswaList.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-8 py-5 text-center text-slate-400 font-bold text-xs">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-sm">{s.nama}</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{s.nis || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2 justify-center">
                            {STATUS_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleStatusChange(s.id, opt.value)}
                                className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-tight transition-all ${
                                  absensi[s.id]?.status === opt.value
                                    ? opt.color + " border-indigo-600 scale-105 shadow-md"
                                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <input type="text" placeholder="Contoh: Alasan sakit..." value={absensi[s.id]?.keterangan || ""} onChange={(e) => handleKeteranganChange(s.id, e.target.value)} className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="py-20 text-center text-slate-300 italic font-medium">Data siswa tidak ditemukan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><FaUserGraduate className="text-indigo-500" />Total ditampilkan: <span className="text-slate-900">{filteredSiswaList.length} Siswa</span></div>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><FaCheckCircle />Status: Siap Submit ke Database</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}