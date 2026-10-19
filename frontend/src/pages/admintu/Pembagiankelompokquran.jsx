import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import {
  FaQuran,
  FaSyncAlt,
  FaPlus,
  FaTrash,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUsers,
  FaCheckCircle,
  FaTimes,
  FaSearch,
  FaExchangeAlt,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../api";

const API = "/api/tu";

// ─── Warna per label kelompok ────────────────────────────────────────────────
const KELOMPOK_STYLE = {
  A: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
  },
  B: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  C: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700",
  },
};

// ─── Step Bar ─────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Semester aktif" },
  { id: 2, label: "Kelompok & guru" },
  { id: 3, label: "Anggota kelompok" },
  { id: 4, label: "Konfirmasi" },
];

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-6">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <FaCheckCircle size={12} /> : step.id}
              </div>
              <span
                className={`text-xs font-semibold truncate transition-colors ${
                  active
                    ? "text-slate-800"
                    : done
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 h-px mx-1 flex-shrink-0 transition-colors ${
                  done ? "bg-emerald-400" : "bg-slate-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PembagianKelompokQuran() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Data dari API
  const [tahunAktif, setTahunAktif] = useState(null);
  const [tahunList, setTahunList] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);

  // State form semester
  const [selectedTahunId, setSelectedTahunId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // State step 2 – kelompok
  const [modalKelompok, setModalKelompok] = useState(false);
  const [formKelompok, setFormKelompok] = useState({ guru_id: "" });

  // State step 3 – anggota
  const [activeKelompokId, setActiveKelompokId] = useState(null);
  const [modalSiswa, setModalSiswa] = useState(false);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [selectedSiswaIds, setSelectedSiswaIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // State modal pindah kelompok
  const [modalPindah, setModalPindah] = useState(false);
  const [pindahSiswa, setPindahSiswa] = useState(null);
  const [pindahKelompokTujuan, setPindahKelompokTujuan] = useState("");

  // ─── Fetch awal ────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resAktif, resTahun, resGuru] = await Promise.all([
        api.get(`${API}/tahunajaran/aktif`),
        api.get(`${API}/tahunajaran`),
        api.get(`${API}/guru`),
      ]);

      const aktif = resAktif.data?.data;
      setTahunAktif(aktif);
      setTahunList(resTahun.data?.data || []);
      setGuruList(resGuru.data?.data || []);

      if (aktif?.id) {
        setSelectedTahunId(aktif.id);
        
        // Mengambil semester_aktif dari sistem berjalan
        const semesterSistem = aktif.semester_aktif || "Ganjil"; 
        setSelectedSemester(semesterSistem);

        // Memuat data kelompok berdasarkan TA & Semester aktif
        await fetchKelompok(aktif.id, semesterSistem);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data awal");
    } finally {
      setLoading(false);
    }
  };

  const fetchKelompok = async (tahunId, semester) => {
    try {
      const res = await api.get(`${API}/quran/kelompok`, {
        params: { tahun_ajaran_id: tahunId, semester },
      });
      setKelompokList(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setKelompokList([]);
    }
  };

  const fetchSiswa = async () => {
    try {
      const res = await api.get(`${API}/siswa`, {
        params: { tahun_ajaran_id: selectedTahunId },
      });
      setSiswaList(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─── Saat masuk step 3, load siswa ─────────────────────────────────────────
  useEffect(() => {
    if (step === 3 && siswaList.length === 0) fetchSiswa();
    if (kelompokList.length > 0 && !activeKelompokId) {
      setActiveKelompokId(kelompokList[0]?.id);
    }
  }, [step]);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const getKelompokByGuru = (guruId) =>
    kelompokList.filter((k) => k.guru_id === guruId);

  const siswaYangBelumTerdaftar = () => {
    const terdaftarIds = kelompokList.flatMap((k) =>
      (k.anggota || []).map((s) => s.id)
    );
    return siswaList.filter((s) => !terdaftarIds.includes(s.id));
  };

const siswaAvailableUntukKelompok = (kelompokId) => {
  // Semua siswa yang SUDAH ada di kelompok lain
  const siswaTerdaftar = kelompokList
    .filter((k) => Number(k.id) !== Number(kelompokId))
    .flatMap((k) =>
      Array.isArray(k.anggota)
        ? k.anggota.map((s) => Number(s.id))
        : []
    );

  // Kembalikan siswa yang BELUM masuk kelompok lain
  return siswaList.filter(
    (s) => !siswaTerdaftar.includes(Number(s.id))
  );
};

  const kelasList = [...new Set(siswaList.map((s) => s.kelas))].sort();

  const activeKelompok = kelompokList.find((k) => k.id === activeKelompokId);

  // ─── STEP 2: Tambah kelompok ────────────────────────────────────────────────
  const handleTambahKelompok = async (e) => {
    e.preventDefault();
    const guruKelompok = getKelompokByGuru(Number(formKelompok.guru_id));
    if (guruKelompok.length >= 3) {
      toast.error("Guru ini sudah mengajar 3 kelompok (maksimum).");
      return;
    }
    setProcessing(true);
    try {
      await api.post(`${API}/quran/kelompok`, {
        guru_id: Number(formKelompok.guru_id),
        tahun_ajaran_id: selectedTahunId,
        semester: selectedSemester,
      });
      toast.success("Kelompok berhasil dibuat!");
      setModalKelompok(false);
      setFormKelompok({ guru_id: "" });
      await fetchKelompok(selectedTahunId, selectedSemester);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal membuat kelompok");
    } finally {
      setProcessing(false);
    }
  };

  const handleHapusKelompok = async (kelompokId) => {
    if (!window.confirm("Hapus kelompok ini? Semua anggota akan dilepas."))
      return;
    try {
      await api.delete(`${API}/quran/kelompok/${kelompokId}`);
      toast.success("Kelompok dihapus");
      const updated = kelompokList.filter((k) => k.id !== kelompokId);
      setKelompokList(updated);
      if (activeKelompokId === kelompokId)
        setActiveKelompokId(updated[0]?.id || null);
    } catch {
      toast.error("Gagal menghapus kelompok");
    }
  };

  // ─── STEP 3: Tambah anggota ─────────────────────────────────────────────────
  const handleTambahAnggota = async () => {
    if (!selectedSiswaIds.length) return;
    setProcessing(true);
    try {
      await api.post(`${API}/quran/kelompok/${activeKelompokId}/anggota`, {
        siswa_ids: selectedSiswaIds,
      });
      toast.success(`${selectedSiswaIds.length} siswa berhasil ditambahkan`);
      setModalSiswa(false);
      setSelectedSiswaIds([]);
      setSearchSiswa("");
      setFilterKelas("");
      await fetchKelompok(selectedTahunId, selectedSemester);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menambahkan siswa");
    } finally {
      setProcessing(false);
    }
  };

  const handleHapusAnggota = async (siswaId) => {
    setDeletingId(siswaId);
    try {
      await api.delete(
        `${API}/quran/kelompok/${activeKelompokId}/anggota/${siswaId}`
      );
      toast.success("Siswa dikeluarkan dari kelompok");
      await fetchKelompok(selectedTahunId, selectedSemester);
    } catch {
      toast.error("Gagal menghapus anggota");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Modal pindah kelompok ──────────────────────────────────────────────────
  const handlePindahKelompok = async () => {
    if (!pindahKelompokTujuan || !pindahSiswa) return;
    setProcessing(true);
    try {
      await api.post(`${API}/quran/pindah-kelompok`, {
        siswa_id: pindahSiswa.id,
        dari_kelompok_id: activeKelompokId,
        ke_kelompok_id: Number(pindahKelompokTujuan),
        tahun_ajaran_id: selectedTahunId,
        semester: selectedSemester,
      });
      toast.success(
        `${pindahSiswa.nama} berhasil dipindahkan. Nilai sebelumnya tetap tersimpan.`
      );
      setModalPindah(false);
      setPindahSiswa(null);
      setPindahKelompokTujuan("");
      await fetchKelompok(selectedTahunId, selectedSemester);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memindahkan siswa");
    } finally {
      setProcessing(false);
    }
  };

  // ─── STEP 4: Simpan/aktifkan ────────────────────────────────────────────────
  const handleAktifkan = async () => {
    setProcessing(true);
    try {
      await api.post(`${API}/quran/kelompok/aktifkan`, {
        tahun_ajaran_id: selectedTahunId,
        semester: selectedSemester,
      });
      toast.success("Pembagian kelompok Al-Quran berhasil diaktifkan!");
      setStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengaktifkan");
    } finally {
      setProcessing(false);
    }
  };

  // ─── Loading screen ─────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <SidebarAdminTu />
        <div className="flex-1 flex flex-col items-center justify-center">
          <FaSyncAlt className="animate-spin text-4xl text-indigo-500 mb-4" />
          <p className="text-slate-400 font-medium animate-pulse">
            Memuat data...
          </p>
        </div>
      </div>
    );

  // ─── Total stats ────────────────────────────────────────────────────────────
  const totalSiswa = kelompokList.reduce(
    (a, k) => a + (k.anggota?.length || 0),
    0
  );
  const guruAktif = new Set(kelompokList.map((k) => k.guru_id)).size;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
      <SidebarAdminTu />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FaQuran size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Kelompok Al-Quran
                </h1>
                <p className="text-slate-400 text-sm mt-0.5">
                  Tahun Ajaran Aktif Sitem:{" "}
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 font-bold text-indigo-600 text-xs">
{
  tahunList.find((t) => String(t.id) === String(selectedTahunId))?.nama || "---"
}
({selectedSemester || "---"})
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm self-end sm:self-auto"
            >
              <FaSyncAlt />
            </button>
          </div>

          {/* ── STEP BAR ── */}
          <StepBar current={step} />

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* STEP 1 – SEMESTER AKTIF                                           */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-4 bg-indigo-600 rounded-full" />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Pilih Semester Aktif
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Tahun Ajaran
                  </label>
                  <select
                    value={selectedTahunId}
                    onChange={(e) => setSelectedTahunId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                  >
                    {tahunList.map((t) => {
                      const isSystemActive = tahunAktif && String(t.id) === String(tahunAktif.id);
                      return (
                        <option key={t.id} value={t.id}>
                          {t.nama} {isSystemActive ? "— (Aktif)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>

              <div className={`p-4 rounded-xl text-sm font-medium transition-colors ${
                tahunAktif && String(selectedTahunId) === String(tahunAktif.id) 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}>
                Semester terpilih:{" "}
                <span className="font-black">
                  {tahunList.find((t) => String(t.id) === String(selectedTahunId))?.nama || "—"} — {selectedSemester}
                </span>
                {tahunAktif && String(selectedTahunId) !== String(tahunAktif.id) && (
                  <span className="block text-xs mt-1 font-normal text-amber-600 animate-pulse">
                    ⚠️ Perhatian: Anda memilih tahun ajaran yang berbeda dari status aktif berjalan di sistem sekolah.
                  </span>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={async () => {
                    await fetchKelompok(selectedTahunId, selectedSemester);
                    setStep(2);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-100 transition-all"
                >
                  Lanjut <FaChevronRight size={11} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* STEP 2 – KELOMPOK & GURU                                           */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total kelompok", val: kelompokList.length },
                  { label: "Guru aktif", val: guruAktif },
                  { label: "Siswa terdaftar", val: totalSiswa },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
                  >
                    <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                    <p className="text-2xl font-black text-slate-800">
                      {s.val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tabel guru */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 bg-indigo-600 rounded-full" />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      Daftar Guru &amp; Kelompok
                    </h2>
                  </div>
                  <button
                    onClick={() => setModalKelompok(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100 active:scale-95"
                  >
                    <FaPlus size={10} /> Tambah Kelompok
                  </button>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                      <th className="px-5 py-3.5">Guru Al-Quran</th>
                      <th className="px-5 py-3.5">Kelompok diajar</th>
                      <th className="px-5 py-3.5 text-center w-24">Jumlah</th>
                      <th className="px-5 py-3.5 text-center w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {guruList.map((g) => {
                      const kList = getKelompokByGuru(g.id);
                      return (
                        <tr
                          key={g.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 text-xs font-black flex-shrink-0">
                                {g.name
                                  .split(" ")
                                  .map((w) => w[0])
                                  .slice(0, 2)
                                  .join("")}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-700">
                                  {g.name}
                                </p>
                                {g.kelas_wali && (
                                  <p className="text-xs text-slate-400">
                                    Wali kelas {g.kelas_wali}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              {kList.length === 0 ? (
                                <span className="text-xs text-slate-400 italic">
                                  Belum ada kelompok
                                </span>
                              ) : (
                                kList.map((k) => {
                                  const st =
                                    KELOMPOK_STYLE[k.label] ||
                                    KELOMPOK_STYLE.A;
                                  return (
                                    <div
                                      key={k.id}
                                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.text} ${st.border}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                                      />
                                      Kelompok {k.label}
                                      <span className="text-[10px] opacity-70">
                                        ({k.anggota?.length || 0})
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleHapusKelompok(k.id)
                                        }
                                        className="ml-0.5 opacity-50 hover:opacity-100 transition"
                                      >
                                        <FaTimes size={9} />
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`text-sm font-black ${
                                kList.length >= 3
                                  ? "text-rose-500"
                                  : kList.length > 0
                                  ? "text-emerald-600"
                                  : "text-slate-300"
                              }`}
                            >
                              {kList.length}/3
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            {kList.length < 3 ? (
                              <button
                                onClick={() => {
                                  setFormKelompok({
                                    guru_id: String(g.id),
                                  });
                                  setModalKelompok(true);
                                }}
                                className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              >
                                <FaPlus size={13} />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-300">
                                Maks.
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition"
                >
                  ← Kembali
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={kelompokList.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  Atur anggota <FaChevronRight size={11} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3 & STEP 4 Tetap Sama Mengikuti Alur Multi-Step Sebelumnya ─── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
            <div className="space-y-4">
            {guruList
                .filter((g) => getKelompokByGuru(g.id).length > 0)
                .map((guru) => {
                const kelompokGuru = getKelompokByGuru(guru.id);

                return (
                    <div
                    key={guru.id}
                    className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
                    >
                    {/* HEADER GURU */}
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                            {guru.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-slate-800">
                            {guru.name}
                            </h3>

                            <p className="text-xs text-slate-400">
                            {kelompokGuru.length} kelompok diajar
                            </p>
                        </div>
                        </div>
                    </div>

                    {/* LIST KELOMPOK */}
                    <div className="p-4 flex flex-wrap gap-3">
                        {kelompokGuru.map((k) => {
                        const isActive = activeKelompokId === k.id;
                        const st =
                            KELOMPOK_STYLE[k.label] || KELOMPOK_STYLE.A;

                        return (
                            <button
                            key={k.id}
                            onClick={() => setActiveKelompokId(k.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-left min-w-[180px]
                                ${
                                isActive
                                    ? `${st.bg} ${st.text} ${st.border} shadow-md`
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                                }
                            `}
                            >
                            <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black border
                                ${
                                isActive
                                    ? `${st.bg} ${st.text} ${st.border}`
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                }`}
                            >
                                {k.label}
                            </div>

                            <div className="flex-1 text-left">
                                <p className="text-sm font-bold">
                                Kelompok {k.label}
                                </p>

                                <p className="text-[11px] opacity-70">
                                {k.anggota?.length || 0} siswa
                                </p>
                            </div>

                            <FaChevronRight
                                size={12}
                                className={isActive ? st.text : "text-slate-300"}
                            />
                            </button>
                        );
                        })}
                    </div>
                    </div>
                );
                })}
            </div>

              {activeKelompok && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const guru = guruList.find((g) => g.id === activeKelompok.guru_id);
                        const st = KELOMPOK_STYLE[activeKelompok.label] || KELOMPOK_STYLE.A;
                        return (
                          <>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${st.bg} ${st.text} border ${st.border}`}>
                              {activeKelompok.label}
                            </div>
                            <div>
                              <p className="font-black text-slate-800">Kelompok {activeKelompok.label}</p>
                              <p className="text-xs text-slate-400">{guru?.name || "—"} · {activeKelompok.anggota?.length || 0} siswa</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSiswaIds([]);
                        setSearchSiswa("");
                        setFilterKelas("");
                        setModalSiswa(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100 active:scale-95"
                    >
                      <FaPlus size={10} /> Tambah Siswa
                    </button>
                  </div>

                  {!activeKelompok.anggota?.length ? (
                    <div className="py-16 text-center text-slate-400">
                      <FaUsers size={40} className="mx-auto mb-3 text-slate-200" />
                      <p className="text-sm font-semibold">Belum ada anggota</p>
                      <p className="text-xs mt-1">Klik "Tambah Siswa" untuk memasukkan siswa ke kelompok ini</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/30">
                          <th className="px-5 py-3.5 w-10">No</th>
                          <th className="px-5 py-3.5">Nama Siswa</th>
                          <th className="px-5 py-3.5">NIS</th>
                          <th className="px-5 py-3.5">Kelas Asal</th>
                          <th className="px-5 py-3.5 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {activeKelompok.anggota.map((siswa, idx) => (
                          <tr key={siswa.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-5 py-3.5 text-slate-400 text-sm">{idx + 1}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">
                                  <FaUserGraduate size={11} />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{siswa.nama || siswa.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{siswa.nis || "—"}</td>
                            <td className="px-5 py-3.5">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">{siswa.kelas}</span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                <button
                                  onClick={() => {
                                    setPindahSiswa(siswa);
                                    setPindahKelompokTujuan("");
                                    setModalPindah(true);
                                  }}
                                  className="p-2 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                  title="Pindah kelompok"
                                >
                                  <FaExchangeAlt size={12} />
                                </button>
                                <button
                                  onClick={() => handleHapusAnggota(siswa.id)}
                                  disabled={deletingId === siswa.id}
                                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                >
                                  {deletingId === siswa.id ? (
                                    <FaSyncAlt className="animate-spin text-rose-500" size={12} />
                                  ) : (
                                    <FaTrash size={12} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
                  ← Kembali
                </button>
                <button onClick={() => setStep(4)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-100 transition-all">
                  Lihat ringkasan <FaChevronRight size={11} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 font-medium flex items-start gap-2">
                <FaCheckCircle className="mt-0.5 flex-shrink-0" />
                <span>Periksa kembali sebelum menyimpan. Setelah disimpan, guru dapat mulai input nilai per kelompok.</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Kelompok dibuat", val: kelompokList.length, sub: selectedSemester },
                  { label: "Guru terlibat", val: guruAktif },
                  { label: "Total siswa", val: totalSiswa },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                    <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                    <p className="text-2xl font-black text-slate-800">{s.val}</p>
                    {s.sub && <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {kelompokList.map((k) => {
                  const guru = guruList.find((g) => g.id === k.guru_id);
                  const kelasList2 = [...new Set((k.anggota || []).map((s) => s.kelas).filter(Boolean))];
                  const st = KELOMPOK_STYLE[k.label] || KELOMPOK_STYLE.A;
                  return (
                    <div key={k.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 border ${st.bg} ${st.text} ${st.border}`}>
                        {k.label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-black text-slate-800 text-sm">Kelompok {k.label}</span>
                          {guru && <span className="text-xs text-slate-500">· {guru.name}</span>}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {kelasList2.map((kl) => (
                            <span key={kl} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">{kl}</span>
                          ))}
                          {!kelasList2.length && <span className="text-xs text-slate-400 italic">Belum ada siswa</span>}
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {(k.anggota || []).slice(0, 4).map((s) => s.nama || s.name).join(", ")}
                          {(k.anggota?.length || 0) > 4 && <span className="text-slate-300"> +{k.anggota.length - 4} lainnya</span>}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-2xl font-black ${(k.anggota?.length || 0) > 0 ? "text-emerald-600" : "text-slate-300"}`}>{k.anggota?.length || 0}</p>
                        <p className="text-[11px] text-slate-400">siswa</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
                  ← Kembali
                </button>
                <button
                  onClick={handleAktifkan}
                  disabled={processing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-100 transition-all disabled:opacity-50"
                >
                  {processing ? <FaSyncAlt className="animate-spin" size={12} /> : <FaCheckCircle size={12} />}
                  Simpan &amp; Aktifkan
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* ─── MODALS ─── */}
      <AnimatePresence>
        {modalKelompok && (
          <Modal onClose={() => setModalKelompok(false)} title="Tambah Kelompok Baru">
            <form onSubmit={handleTambahKelompok} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Guru Pengampu</label>
                <select
                  value={formKelompok.guru_id}
                  onChange={(e) => setFormKelompok({ ...formKelompok, guru_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                  required
                >
                  <option value="">— Pilih Guru —</option>
                  {guruList.map((g) => {
                    const sudah = getKelompokByGuru(g.id).length;
                    return (
                      <option key={g.id} value={g.id} disabled={sudah >= 3}>
                        {g.name} {sudah > 0 ? ` (${sudah}/3 kelompok)` : ""} {sudah >= 3 ? " — PENUH" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              {formKelompok.guru_id && (() => {
                const sudah = getKelompokByGuru(Number(formKelompok.guru_id)).length;
                return sudah >= 3 
                  ? <p className="text-xs text-rose-600 font-semibold">⚠ Guru ini sudah mengajar 3 kelompok (maksimum).</p>
                  : <p className="text-xs text-emerald-600 font-semibold">✓ Guru dapat menambah {3 - sudah} kelompok lagi.</p>;
              })()}
              <ModalActions onCancel={() => setModalKelompok(false)} processing={processing} label="Buat Kelompok" />
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalSiswa && (
          <Modal onClose={() => setModalSiswa(false)} title={`Tambah Siswa — Kelompok ${activeKelompok?.label}`} wide>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Cari nama siswa..."
                    value={searchSiswa}
                    onChange={(e) => setSearchSiswa(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:bg-white outline-none transition"
                  />
                </div>
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white outline-none transition w-32"
                >
                  <option value="">Semua kelas</option>
                  {kelasList.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                {siswaAvailableUntukKelompok(activeKelompokId)
                  .filter((s) => 
                    (!filterKelas || s.kelas === filterKelas) &&
                    (!searchSiswa || (s.nama || s.name).toLowerCase().includes(searchSiswa.toLowerCase()))
                  )
                  .map((s) => {
                    const checked = selectedSiswaIds.includes(s.id);
                    return (
                      <label key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setSelectedSiswaIds((prev) => checked ? prev.filter((id) => id !== s.id) : [...prev, s.id])}
                          className="accent-indigo-600 w-4 h-4 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{s.nama || s.name}</p>
                          <p className="text-xs text-slate-400">{s.nis || "—"} · {s.kelas}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">{s.kelas}</span>
                      </label>
                    );
                  })}
                    {siswaAvailableUntukKelompok(activeKelompokId).length <= 0 && (
                      <div className="py-10 text-center text-slate-400 text-sm">Semua siswa sudah terdaftar di kelompok lain.</div>
                )}
              </div>

              {selectedSiswaIds.length > 0 && <p className="text-xs text-indigo-600 font-semibold">{selectedSiswaIds.length} siswa dipilih</p>}

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setModalSiswa(false)} className="flex-1 py-2.5 text-sm text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition">Batal</button>
                <button
                  type="button"
                  onClick={handleTambahAnggota}
                  disabled={processing || !selectedSiswaIds.length}
                  className="flex-[2] py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 active:scale-95 transition"
                >
                  {processing ? <FaSyncAlt className="animate-spin" size={12} /> : <FaPlus size={11} />}
                  Tambahkan {selectedSiswaIds.length > 0 ? `(${selectedSiswaIds.length})` : ""}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalPindah && pindahSiswa && (
          <Modal onClose={() => setModalPindah(false)} title="Pindah Kelompok">
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <p className="font-bold mb-1">{pindahSiswa.nama || pindahSiswa.name}</p>
                <p className="text-xs text-amber-700">Nilai yang sudah diinput di kelompok saat ini akan tetap tersimpan. Guru kelompok baru tinggal melanjutkan input nilai.</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pindahkan ke Kelompok</label>
                <select
                  value={pindahKelompokTujuan}
                  onChange={(e) => setPindahKelompokTujuan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                >
                  <option value="">— Pilih kelompok tujuan —</option>
                  {kelompokList
                    .filter((k) => k.id !== activeKelompokId)
                    .map((k) => {
                      const guru = guruList.find((g) => g.id === k.guru_id);
                      return <option key={k.id} value={k.id}>Kelompok {k.label} — {guru?.name || "—"}</option>;
                    })}
                </select>
              </div>
              <ModalActions onCancel={() => setModalPindah(false)} processing={processing} label="Pindahkan Siswa" onSubmit={handlePindahKelompok} submitColor="amber" />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-komponen Modal Helper ────────────────────────────────────────────────
function Modal({ children, onClose, title, wide = false }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className={`bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden ${wide ? "w-full max-w-lg" : "w-full max-w-md"}`}>
        <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaChalkboardTeacher size={14} />
            <h3 className="font-bold tracking-tight text-sm">{title}</h3>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition p-1 rounded-lg hover:bg-indigo-700"><FaTimes size={16} /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function ModalActions({ onCancel, processing, label, onSubmit, submitColor = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100",
    amber: "bg-amber-500 hover:bg-amber-600 shadow-amber-100",
    emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100",
  };
  return (
    <div className="flex gap-2.5 pt-4 border-t border-slate-100">
      <button type="button" onClick={onCancel} className="flex-1 py-2.5 text-sm text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition">Batal</button>
      <button type={onSubmit ? "button" : "submit"} onClick={onSubmit} disabled={processing} className={`flex-[2] py-2.5 text-white rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition ${colors[submitColor]}`}>
        {processing ? <FaSyncAlt className="animate-spin" size={12} /> : <FaPlus size={11} />}
        {label}
      </button>
    </div>
  );
}