import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import GuruLayout from "../../../layouts/GuruLayout";
import SidebarGuru from "../../../components/SidebarGuru";
import { 
  FaChevronLeft, 
  FaSave, 
  FaSyncAlt, 
  FaInfoCircle, 
  FaUserGraduate, 
  FaCheckCircle,
  FaFileSignature,
  FaHashtag
} from "react-icons/fa";

export default function NilaiDetailPerMapel() {
  const { id: mapelParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const penugasan = location.state?.penugasan;

  const [dataNilai, setDataNilai] = useState([]);
  const [mapelName, setMapelName] = useState("Memuat...");
  const [kelasName, setKelasName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingNilai, setLoadingNilai] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [semester, setSemester] = useState("1");
  const [tahunAjaran, setTahunAjaran] = useState("");

  // 1. Fetch tahun ajaran aktif
  useEffect(() => {
    const fetchTahun = async () => {
      try {
        const res = await api.get("/api/guru/tahunajaran/aktif");
        setTahunAjaran(res.data?.data?.nama || "");
      } catch (err) {
        toast.error("Gagal memuat tahun ajaran aktif");
      }
    };
    fetchTahun();
  }, []);

  // 2. Set metadata
  useEffect(() => {
    if (penugasan) {
      setMapelName(penugasan.mapel?.nama || penugasan.nama_mapel || `Mapel ${mapelParam}`);
      setKelasName(
        penugasan.rombel
          ? `Kelas ${penugasan.rombel.tingkat_kelas} ${penugasan.rombel.sub_nama}`
          : ""
      );
    }
  }, [penugasan]);

  // 3. Fetch nilai
  useEffect(() => {
    if (tahunAjaran) fetchNilai();
  }, [semester, tahunAjaran]);

  const fetchNilai = async () => {
    setLoadingNilai(true);
    try {
      const actualMapelId = penugasan?.mapel_id || penugasan?.mapel?.id || mapelParam;
      const actualRombelId = penugasan?.rombel_id || penugasan?.rombel?.id;

      if (!actualMapelId || !actualRombelId) {
        toast.error("Data penugasan tidak lengkap");
        setLoadingNilai(false);
        return;
      }

      const resSiswa = await api.get(`/api/guru/rombel/${actualRombelId}/siswa`);
      const baseSiswa = (resSiswa.data.data || []).map((s) => ({
        siswa_id: s.id,
        nama: s.nama,
        nis: s.nis || "—",
        nilai: ["", "", "", "", "", "", ""],
      }));

      const resNilai = await api.get(`/api/guru/nilai/per-mapel/${actualMapelId}`, {
        params: { semester, tahun_ajaran: tahunAjaran, rombel_id: actualRombelId },
      });
      const nilaiBackend = resNilai.data.data || [];

      setDataNilai(baseSiswa.map((siswa) => {
        const found = nilaiBackend.find((n) => n.siswa_id === siswa.siswa_id);
        return found ? { ...siswa, nilai: found.nilai } : siswa;
      }));
    } catch (err) {
      toast.error("Gagal sinkronisasi data nilai");
    } finally {
      setLoadingNilai(false);
      setLoading(false);
    }
  };

  const handleChange = (siswaId, colIdx, value) => {
    const num = value === "" ? "" : Math.max(0, Math.min(100, Number(value)));
    setDataNilai((prev) =>
      prev.map((s) =>
        s.siswa_id === siswaId
          ? { ...s, nilai: s.nilai.map((n, i) => (i === colIdx ? num : n)) }
          : s
      )
    );
  };

  const hitungRataUH = (nilai) => {
    const uh = nilai.slice(0, 5).filter((v) => v !== "" && !isNaN(v)).map(Number);
    return uh.length ? Math.round(uh.reduce((a, b) => a + b, 0) / uh.length) : "";
  };

  const hitungNilaiRaport = (nilai) => {
    const rataUH = Number(hitungRataUH(nilai));
    const pts = Number(nilai[5]);
    const pas = Number(nilai[6]);
    if (!rataUH && !pts && !pas) return "";
    return Math.round(rataUH * 0.4 + pts * 0.3 + pas * 0.3);
  };

  const getPredikat = (nilai) => {
    if (!nilai) return "—";
    const n = Number(nilai);
    if (n >= 90) return "Sangat Baik";
    if (n >= 80) return "Baik";
    if (n >= 70) return "Cukup";
    return "Kurang";
  };

  const getBgColor = (val) => {
    if (val === "" || isNaN(val)) return "bg-slate-50";
    const n = Number(val);
    if (n < 70) return "bg-rose-50 text-rose-700";
    if (n < 80) return "bg-amber-50 text-amber-700";
    return "bg-emerald-50 text-emerald-700";
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      const actualMapelId = penugasan?.mapel_id || penugasan?.mapel?.id || mapelParam;
      await api.post("/api/guru/nilai", {
        mapel_id: actualMapelId,
        rombel_id: penugasan?.rombel_id || penugasan?.rombel?.id,
        semester,
        tahun_ajaran: tahunAjaran,
        nilai: dataNilai.map((s) => ({
          siswa_id: s.siswa_id,
          uh1: s.nilai[0] !== "" ? s.nilai[0] : null,
          uh2: s.nilai[1] !== "" ? s.nilai[1] : null,
          uh3: s.nilai[2] !== "" ? s.nilai[2] : null,
          uh4: s.nilai[3] !== "" ? s.nilai[3] : null,
          uh5: s.nilai[4] !== "" ? s.nilai[4] : null,
          pts: s.nilai[5] !== "" ? s.nilai[5] : null,
          pas: s.nilai[6] !== "" ? s.nilai[6] : null,
        })),
      });
      toast.success("✅ Nilai Berhasil Disimpan!");
      fetchNilai();
    } catch (err) {
      toast.error("Gagal menyimpan nilai");
    } finally {
      setLoadingSave(false);
    }
  };

  // Modern Skeleton Loading (Identik)
  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarGuru />
      <div className="flex-1 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
        <div className="h-24 bg-slate-200 rounded-[2.5rem] mb-8"></div>
        <div className="h-[450px] bg-slate-200 rounded-[2.5rem]"></div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <SidebarGuru />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors mb-4 group">
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali
              </button>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
                <FaFileSignature className="text-indigo-600" /> {mapelName}
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                {kelasName} • Semester <span className="text-indigo-600 font-bold">{semester}</span> • TA {tahunAjaran}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchNilai}
                className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
              >
                <FaSyncAlt className={loadingNilai ? "animate-spin" : ""} />
              </button>
              <button
                onClick={handleSave}
                disabled={loadingSave || dataNilai.length === 0}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
              >
                {loadingSave ? <FaSyncAlt className="animate-spin" /> : <FaSave />} Simpan Semua Nilai
              </button>
            </div>
          </div>

          {/* CONFIG CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pilih Semester</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                   {["1", "2"].map((s) => (
                     <button
                        key={s}
                        onClick={() => setSemester(s)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${semester === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                     >
                        {s}
                     </button>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-3 bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 flex items-center gap-5">
                <div className="p-4 bg-white/20 rounded-2xl hidden sm:block">
                   <FaInfoCircle size={24} />
                </div>
                <div>
                   <h4 className="font-bold">Panduan Penilaian Akademik</h4>
                   <p className="text-indigo-100 text-xs opacity-90 leading-relaxed">
                      Nilai Rapor dihitung otomatis: <b>(Rata UH × 40%) + (PTS × 30%) + (PAS × 30%)</b>. <br/>
                      Gunakan angka 0-100. Kolom akan berubah warna otomatis sesuai kategori nilai.
                   </p>
                </div>
             </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                         <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-12">No</th>
                         <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identitas Siswa</th>
                         {[1, 2, 3, 4, 5].map(n => <th key={n} className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">UH{n}</th>)}
                         <th className="px-2 py-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest text-center w-20">Rata UH</th>
                         <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">PTS</th>
                         <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">PAS</th>
                         <th className="px-6 py-5 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center w-24">Nilai Rapor</th>
                         <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Predikat</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {dataNilai.length > 0 ? dataNilai.map((s, idx) => {
                         const rata = hitungRataUH(s.nilai);
                         const rapor = hitungNilaiRaport(s.nilai);
                         return (
                           <tr key={s.siswa_id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-6 py-4 text-center text-slate-400 font-bold text-xs">{idx + 1}</td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                    <span className="font-bold text-slate-700 text-sm truncate max-w-[150px]">{s.nama}</span>
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">{s.nis}</span>
                                 </div>
                              </td>
                              
                              {/* UH Inputs */}
                              {s.nilai.slice(0, 5).map((v, i) => (
                                 <td key={i} className="px-1 py-4 text-center">
                                    <input
                                      type="number"
                                      value={v}
                                      onChange={(e) => handleChange(s.siswa_id, i, e.target.value)}
                                      className={`w-12 h-10 text-center font-bold text-sm rounded-xl border-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500 border-transparent hover:border-slate-200 ${getBgColor(v)}`}
                                    />
                                 </td>
                              ))}

                              <td className="px-1 py-4 text-center">
                                 <div className="w-14 h-10 flex items-center justify-center mx-auto rounded-xl font-black text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    {rata || "—"}
                                 </div>
                              </td>

                              {/* PTS & PAS */}
                              {[5, 6].map(i => (
                                 <td key={i} className="px-1 py-4 text-center">
                                    <input
                                      type="number"
                                      value={s.nilai[i]}
                                      onChange={(e) => handleChange(s.siswa_id, i, e.target.value)}
                                      className={`w-12 h-10 text-center font-bold text-sm rounded-xl border-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500 border-transparent hover:border-slate-200 ${getBgColor(s.nilai[i])}`}
                                    />
                                 </td>
                              ))}

                              <td className="px-6 py-4 text-center">
                                 <div className={`w-16 h-12 flex items-center justify-center mx-auto rounded-2xl font-black text-lg shadow-sm border ${rapor >= 70 ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-100' : 'bg-rose-500 text-white border-rose-600 shadow-rose-100'}`}>
                                    {rapor || "—"}
                                 </div>
                              </td>

                              <td className="px-6 py-4 text-center">
                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm border ${
                                    getPredikat(rapor) === "Sangat Baik" ? "bg-emerald-500 text-white border-emerald-600" :
                                    getPredikat(rapor) === "Baik" ? "bg-indigo-100 text-indigo-700 border-indigo-200" :
                                    getPredikat(rapor) === "Cukup" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                    rapor ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-slate-100 text-slate-400 border-slate-200"
                                 }`}>
                                    {getPredikat(rapor)}
                                 </span>
                              </td>
                           </tr>
                         );
                      }) : (
                        <tr>
                          <td colSpan="12" className="py-24 text-center">
                             <div className="flex flex-col items-center opacity-20">
                                <FaFileSignature size={64} className="mb-4" />
                                <p className="font-black text-xl uppercase tracking-tighter">Data Siswa Kosong</p>
                             </div>
                          </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
             
             {/* FOOTER TABLE */}
             <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex gap-6">
                   <span className="flex items-center gap-2"><FaUserGraduate className="text-indigo-500" /> Total: <span className="text-slate-900">{dataNilai.length} Siswa</span></span>
                   <span className="flex items-center gap-2"><FaHashtag className="text-indigo-500" /> Mapel ID: <span className="text-slate-900">{mapelParam}</span></span>
                </div>
                <div className="flex items-center gap-2 text-indigo-600">
                   <FaCheckCircle />
                   Sinkronisasi Aktif
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}