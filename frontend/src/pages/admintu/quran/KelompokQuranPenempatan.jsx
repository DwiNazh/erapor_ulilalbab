import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarAdminTu from "../../../components/SidebarAdminTu";
import {
  FaQuran,
  FaSyncAlt,
  FaPlus,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../../api"; 

const API = "/api/tu";

const KELOMPOK_STYLE = {
  A: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  B: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  C: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
};

export default function KelompokQuranPenempatan() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Data Master dari API
  const [tahunAktif, setTahunAktif] = useState(null);
  const [tahunList, setTahunList] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);

  // Filter State Semester
  const [selectedTahunId, setSelectedTahunId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Modal State Pembuatan Kelompok
  const [modalKelompok, setModalKelompok] = useState(false);
  const [formKelompok, setFormKelompok] = useState({ guru_id: "" });

  const initSistem = async () => {
    try {
      setLoading(true);

      const resTahunAktif = await api.get(`${API}/quran/aktif`);
      const resTahunList = await api.get(`${API}/tahunajaran`);
      const resGuruList = await api.get(`${API}/guru-list`);

      setTahunList(resTahunList.data?.data || []);
      setGuruList(resGuruList.data?.data || []);

      if (resTahunAktif.data.success) {
        const dataAktif = resTahunAktif.data.data;
        setTahunAktif(dataAktif);
        setSelectedTahunId(String(dataAktif.id));
        setSelectedSemester(dataAktif.semester_aktif);

        // Amankan state ke localStorage agar halaman finalisasi/plotting langsung sinkron
        localStorage.setItem("quran_tahun_id", String(dataAktif.id));
        localStorage.setItem("quran_semester", dataAktif.semester_aktif);

        await fetchKelompok(dataAktif.id, dataAktif.semester_aktif);
      }
    } catch (err) {
      console.error("Gagal memuat konfigurasi awal sistem:", err);
      toast.error("Gagal mengambil data penunjang dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initSistem();
  }, []);

  const fetchKelompok = async (tahunId, semester) => {
    try {
      const targetTahunId = tahunId || selectedTahunId;
      const targetSemester = semester || selectedSemester;

      if (!targetTahunId || !targetSemester) return;

      const res = await api.get(`${API}/quran/kelompok`, {
        params: { 
          tahun_ajaran_id: targetTahunId, 
          semester: targetSemester 
        },
      });
      setKelompokList(res.data?.data || []);
    } catch (err) {
      console.error("Gagal memuat kelompok:", err);
      setKelompokList([]);
    }
  };

  const handlePeriodChange = async (tahunId, semester) => {
    setSelectedTahunId(tahunId);
    setSelectedSemester(semester);
    localStorage.setItem("quran_tahun_id", tahunId);
    localStorage.setItem("quran_semester", semester);
    setLoading(true);
    await fetchKelompok(tahunId, semester);
    setLoading(false);
  };

  const handleManualRefresh = async () => {
    setLoading(true);
    await fetchKelompok(selectedTahunId, selectedSemester);
    setLoading(false);
    toast.success("Daftar struktur kelompok diperbarui");
  };

  const getKelompokByGuru = (guruId) => kelompokList.filter((k) => Number(k.guru_id) === Number(guruId));

  const handleTambahKelompok = async (e) => {
    e.preventDefault();
    if (!formKelompok.guru_id) return;

    const guruKelompok = getKelompokByGuru(Number(formKelompok.guru_id));
    if (guruKelompok.length >= 3) {
      toast.error("Guru ini sudah mengajar 3 kelompok (maksimum).");
      return;
    }

    setProcessing(true);
    try {
      await api.post(`${API}/quran/kelompok`, {
        guru_id: Number(formKelompok.guru_id),
        tahun_ajaran_id: Number(selectedTahunId),
        semester: selectedSemester,
      });
      toast.success("Kelompok baru berhasil dibuat!");
      setModalKelompok(false);
      setFormKelompok({ guru_id: "" });
      await fetchKelompok(selectedTahunId, selectedSemester);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal membuat kelompok");
    } finally {
      setProcessing(false);
    }
  };

  const handleHapusKelompok = async (kelompokId) => {
    if (!window.confirm("Hapus kelompok ini? Seluruh anggota siswa di dalamnya akan dilepas.")) return;
    try {
      await api.delete(`${API}/quran/kelompok/${kelompokId}`);
      toast.success("Kelompok berhasil dihapus");
      setKelompokList(kelompokList.filter((k) => k.id !== kelompokId));
    } catch {
      toast.error("Gagal menghapus kelompok");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <SidebarAdminTu />
        <div className="flex-1 flex flex-col items-center justify-center">
          <FaSyncAlt className="animate-spin text-4xl text-indigo-500 mb-4" />
          <p className="text-slate-400 font-medium animate-pulse">Menghubungkan struktur kelompok...</p>
        </div>
      </div>
    );
  }

  const guruAktifCount = new Set(kelompokList.map((k) => k.guru_id)).size;
  const totalSiswaAlokasi = kelompokList.reduce((a, k) => a + (k.anggota?.length || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased size-full">
      <SidebarAdminTu />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* HEADER & FILTER PERIODE */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FaQuran size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Kelola Struktur Kelompok Qur'an</h1>
                  <p className="text-slate-400 text-xs mt-0.5">Konfigurasi guru pengampu dan pembuatan kelompok kerja.</p>
                </div>
              </div>
              <button onClick={handleManualRefresh} className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm">
                <FaSyncAlt size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tahun Ajaran</label>
                <select
                  value={selectedTahunId}
                  onChange={(e) => handlePeriodChange(e.target.value, selectedSemester)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  {tahunList.map((t) => (
                    <option key={t.id} value={t.id}>{t.nama} {tahunAktif && String(t.id) === String(tahunAktif.id) ? "— (Aktif)" : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => handlePeriodChange(selectedTahunId, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 focus:bg-white transition"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Kelompok Dibentuk", val: kelompokList.length },
              { label: "Guru Pembimbing", val: guruAktifCount },
              { label: "Siswa Terplot", val: totalSiswaAlokasi },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-xl font-black text-slate-800">{s.val}</p>
              </div>
            ))}
          </div>

          {/* TABLE ENTITY STRUCTURE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pemetaan Kelompok Kerja Guru</h2>
              <button onClick={() => setModalKelompok(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-sm">
                <FaPlus size={9} /> Tambah Kelompok
              </button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3">Nama Guru Pembimbing</th>
                  <th className="px-5 py-3">Daftar Kelompok Diampu</th>
                  <th className="px-5 py-3 text-center w-28">Beban Kerja</th>
                  <th className="px-5 py-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {guruList.map((g) => {
                  const kList = getKelompokByGuru(g.id);
                  return (
                    <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-700">{g.nama || g.name}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {kList.length === 0 ? (
                            <span className="text-slate-300 italic text-[11px]">Belum memiliki kelompok bimbingan</span>
                          ) : (
                            kList.map((k) => {
                              const st = KELOMPOK_STYLE[k.label] || KELOMPOK_STYLE.A;
                              return (
                                <div key={k.id} className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border ${st.bg} ${st.text} ${st.border}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                  Kelompok {k.label} ({k.anggota?.length || 0} Siswa)
                                  <button onClick={() => handleHapusKelompok(k.id)} className="ml-1 opacity-40 hover:opacity-100 text-slate-400 hover:text-rose-600 transition">
                                    <FaTimes size={8} />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-black">
                        <span className={kList.length >= 3 ? "text-rose-500" : kList.length > 0 ? "text-emerald-600" : "text-slate-300"}>
                          {kList.length}/3
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {kList.length < 3 ? (
                          <button onClick={() => { setFormKelompok({ guru_id: String(g.id) }); setModalKelompok(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Tambah Kelompok">
                            <FaPlus size={11} />
                          </button>
                        ) : (
                          <span className="text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-bold">Penuh</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL TAMBAH KELOMPOK */}
      <AnimatePresence>
        {modalKelompok && (
          <Modal onClose={() => setModalKelompok(false)} title="Tambah Kelompok Mengaji">
            <form onSubmit={handleTambahKelompok} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Guru Pembimbing</label>
                <select
                  value={formKelompok.guru_id}
                  onChange={(e) => setFormKelompok({ ...formKelompok, guru_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium outline-none transition focus:border-indigo-500 focus:bg-white"
                  required
                >
                  <option value="">— Pilih Guru —</option>
                  {guruList.map((g) => {
                    const sudah = getKelompokByGuru(g.id).length;
                    return (
                      <option key={g.id} value={g.id} disabled={sudah >= 3}>
                        {g.nama || g.name} {sudah > 0 ? ` (${sudah}/3 Kelompok)` : ""} {sudah >= 3 ? " — (PENUH)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              <ModalActions onCancel={() => setModalKelompok(false)} processing={processing} label="Buat Struktur Kelompok" />
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-full max-w-sm">
        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
          <h3 className="font-bold text-xs tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition"><FaTimes size={14} /></button>
        </div>
        <div className="p-4">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function ModalActions({ onCancel, processing, label }) {
  return (
    <div className="flex gap-2 pt-3 border-t border-slate-100">
      <button type="button" onClick={onCancel} className="flex-1 py-2 text-xs text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition">Batal</button>
      <button type="submit" disabled={processing} className="flex-[2] py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 transition">
        {processing ? <FaSyncAlt className="animate-spin" size={10} /> : <FaPlus size={10} />}
        {label}
      </button>
    </div>
  );
}