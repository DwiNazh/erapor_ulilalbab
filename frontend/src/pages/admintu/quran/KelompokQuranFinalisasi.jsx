import React, { useState, useEffect } from "react";
import SidebarAdminTu from "../../../components/SidebarAdminTu";
import {
  FaSyncAlt, FaUserPlus, FaUserMinus,
  FaUsers, FaFilter, FaSearch, FaExchangeAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../../api";

const API = "/api/tu";

const KELOMPOK_STYLE = {
  A: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  B: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  C: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
};


export default function KelompokQuranFinalisasi() {
  const [loading, setLoading]       = useState(true);
  const [processing, setProcessing] = useState(false);

  const [kelompokList, setKelompokList]       = useState([]);
  const [siswaBelumPlot, setSiswaBelumPlot]   = useState([]);
  const [filterKelas, setFilterKelas]         = useState("");
  const [searchQuery, setSearchQuery]         = useState("");
  const [selectedTahunId, setSelectedTahunId] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedKelompokId, setSelectedKelompokId] = useState("");
  const [selectedSiswaIds, setSelectedSiswaIds]     = useState([]);

  // State modal pindah kelompok
  const [modalPindah, setModalPindah] = useState(null);
  // { siswaId, siswaName, dariKelompokId, keKelompokId }

  /* ------------------------------------------------------------------ */
  const initPlottingPanel = async () => {
    try {
      setLoading(true);
      const savedTahunId  = localStorage.getItem("quran_tahun_id") || "";
      const savedSemester = localStorage.getItem("quran_semester") || "Ganjil";
      setSelectedTahunId(savedTahunId);
      setSelectedSemester(savedSemester);

      if (savedTahunId && savedSemester) {
        await Promise.all([
          fetchKelompok(savedTahunId, savedSemester),
          fetchSiswaBelumPlot(savedTahunId, savedSemester),
        ]);
      } else {
        toast.error("Silakan tentukan Tahun Ajaran & Semester di menu Penempatan terlebih dahulu.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyinkronkan data plotting.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { initPlottingPanel(); }, []);

  /* ------------------------------------------------------------------ */
  const fetchKelompok = async (tahunId, semester) => {
    const res  = await api.get(`${API}/quran/kelompok`, {
      params: { tahun_ajaran_id: tahunId, semester },
    });
    const data = res.data?.data || [];
    setKelompokList(data);
    if (data.length > 0 && !selectedKelompokId) {
      setSelectedKelompokId(String(data[0].id));
    }
  };

  const fetchSiswaBelumPlot = async (tahunId, semester) => {
    try {
      const res     = await api.get(`${API}/quran/siswa-belum-plot`, {
        params: { tahun_ajaran_id: tahunId, semester },
      });
      const rawData = res.data?.data || [];
      const valid   = rawData.map(s => ({
        ...s,
        id:               Number(s.id || s.siswa_id),
        kelas_digit:      Number(s.kelas_digit || s.tingkat_kelas || s.kelas),
        rombongan_belajar: s.kelas_nama || `Kelas ${s.kelas_digit}`,
      })).filter(s => s.kelas_digit >= 1 && s.kelas_digit <= 6);
      setSiswaBelumPlot(valid);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat antrean siswa aktif.");
    }
  };

  /* ------------------------------------------------------------------ */
  const handlePlotSiswa = async (e, singleSiswaId = null) => {
    if (e) e.preventDefault();
    const targetIds = singleSiswaId ? [singleSiswaId] : selectedSiswaIds;
    if (!selectedKelompokId) return toast.error("Pilih kelompok tujuan.");
    if (!targetIds.length)   return toast.error("Pilih minimal satu siswa.");

    setProcessing(true);
    try {
      await api.post(`${API}/quran/kelompok/${selectedKelompokId}/tambah-anggota`, {
        siswa_ids: targetIds,
      });
      toast.success("Siswa berhasil ditempatkan ke kelompok");
      setSelectedSiswaIds([]);
      await Promise.all([
        fetchKelompok(selectedTahunId, selectedSemester),
        fetchSiswaBelumPlot(selectedTahunId, selectedSemester),
      ]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memplot siswa.");
    } finally {
      setProcessing(false);
    }
  };

  const handleKeluarkanSiswa = async (kelompokId, siswaId) => {
    if (!window.confirm("Keluarkan siswa ini dari kelompok?")) return;
    try {
      await api.delete(`${API}/quran/kelompok/${kelompokId}/hapus-anggota/${siswaId}`);
      toast.success("Siswa dilepas dari kelompok");
      await Promise.all([
        fetchKelompok(selectedTahunId, selectedSemester),
        fetchSiswaBelumPlot(selectedTahunId, selectedSemester),
      ]);
    } catch {
      toast.error("Gagal mengeluarkan siswa.");
    }
  };

  /* -------- PINDAH KELOMPOK -------- */
  const handlePindahKelompok = async () => {
    if (!modalPindah?.keKelompokId) return toast.error("Pilih kelompok tujuan.");

    setProcessing(true);
    try {
      await api.post(`${API}/quran/kelompok/pindah`, {
        siswa_id:         modalPindah.siswaId,
        dari_kelompok_id: modalPindah.dariKelompokId,
        ke_kelompok_id:   Number(modalPindah.keKelompokId),
      });
      toast.success(`${modalPindah.siswaName} berhasil dipindahkan`);
      setModalPindah(null);
      await Promise.all([
        fetchKelompok(selectedTahunId, selectedSemester),
        fetchSiswaBelumPlot(selectedTahunId, selectedSemester),
      ]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memindahkan siswa.");
    } finally {
      setProcessing(false);
    }
  };

  const [selectedGuruId, setSelectedGuruId] = useState("");
  const guruList = kelompokList.reduce((acc, k) => {
    if (k.guru && !acc.find(g => g.id === k.guru.id)) acc.push(k.guru);
    return acc;
  }, []);

  const kelompokByGuru = kelompokList.filter(k => 
    selectedGuruId ? String(k.guru?.id) === selectedGuruId : false
  );

  /* ------------------------------------------------------------------ */
  const handleToggleSelectSiswa = (id) =>
    setSelectedSiswaIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  const handleSelectAllSiswa = (list) =>
    setSelectedSiswaIds(
      selectedSiswaIds.length === list.length ? [] : list.map(s => s.id)
    );

  const filteredSiswaList = siswaBelumPlot.filter(s => {
    const matchKelas  = filterKelas === "" || String(s.kelas_digit) === filterKelas;
    const q           = searchQuery.toLowerCase();
    const matchSearch = (s.nama || "").toLowerCase().includes(q) ||
                        (s.nis  || "").toLowerCase().includes(q);
    return matchKelas && matchSearch;
  });

  /* ------------------------------------------------------------------ */
  if (loading) return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarAdminTu />
      <div className="flex-1 flex flex-col items-center justify-center">
        <FaSyncAlt className="animate-spin text-4xl text-indigo-500 mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Menyiapkan panel plotting...</p>
      </div>
    </div>
  );

  /* ================================================================== */
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
      <SidebarAdminTu />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FaUsers size={22} />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Plotting Anggota Kelompok</h1>
                <p className="text-slate-400 text-xs mt-0.5">Penempatan fleksibel siswa aktif (Kelas 1–5) ke kelompok mengaji.</p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-xs border border-indigo-100">
              Periode: {selectedSemester}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* PANEL KIRI — ANTREAN SISWA */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-2.5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded-full" /> Antrean Siswa
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-100 text-amber-800 rounded-full">
                    {filteredSiswaList.length === siswaBelumPlot.length
                      ? `${siswaBelumPlot.length} Anak`
                      : `${filteredSiswaList.length} dari ${siswaBelumPlot.length}`}
                  </span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5 flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                    <FaFilter className="text-slate-400 shrink-0" size={10} />
                    <select value={filterKelas} onChange={e => { setFilterKelas(e.target.value); setSelectedSiswaIds([]); }}
                      className="w-full text-xs bg-transparent outline-none font-semibold text-slate-600">
                      <option value="">Semua Kelas</option>
                      {[1,2,3,4,5,6].map(v => <option key={v} value={v}>Kelas {v}</option>)}
                    </select>
                  </div>
                  <div className="col-span-7 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 focus-within:border-indigo-500 transition-colors">
                    <FaSearch className="text-slate-400 shrink-0" size={10} />
                    <input type="text" placeholder="Cari Nama / NIS..."
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setSelectedSiswaIds([]); }}
                      className="w-full text-xs bg-transparent outline-none font-semibold text-slate-700 placeholder-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
                {filteredSiswaList.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                    Antrean kosong atau siswa tidak ditemukan.
                  </div>
                ) : filteredSiswaList.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <input type="checkbox" checked={selectedSiswaIds.includes(s.id)}
                        onChange={() => handleToggleSelectSiswa(s.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 border-slate-300" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">{s.nama}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">
                          Kelas {s.rombongan_belajar} • NIS: {s.nis || "—"}
                        </p>
                      </div>
                    </div>
                    <button onClick={e => handlePlotSiswa(e, s.id)}
                      disabled={processing || !selectedKelompokId}
                      className="p-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg transition disabled:opacity-40">
                      <FaUserPlus size={11} />
                    </button>
                  </div>
                ))}
              </div>

              {filteredSiswaList.length > 0 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <button onClick={() => handleSelectAllSiswa(filteredSiswaList)}
                      className="text-indigo-600 font-bold hover:underline">
                      Pilih Semua Terfilter
                    </button>
                    <span className="text-slate-400 font-bold">{selectedSiswaIds.length} Terpilih</span>
                  </div>
                  <div className="flex gap-2">
                    <select value={selectedKelompokId} onChange={e => setSelectedKelompokId(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold outline-none focus:border-indigo-500">
                      {kelompokList.map(k => (
                        <option key={k.id} value={k.id}>
                          Kelompok {k.label} ({k.guru?.name || "Tanpa Guru"})
                        </option>
                      ))}
                    </select>
                    <button onClick={e => handlePlotSiswa(e)}
                      disabled={processing || !selectedSiswaIds.length || !selectedKelompokId}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50">
                      Plot
                    </button>
                  </div>
                </div>
              )}
            </div>

{/* PANEL KANAN */}
<div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">

  {/* Selector Guru */}
  <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
      <span className="w-1.5 h-3 bg-emerald-500 rounded-full" /> Distribusi Kelompok
    </h3>
    <div className="flex gap-2 flex-wrap">
      {guruList.map(g => (
        <button
          key={g.id}
          onClick={() => {
            setSelectedGuruId(String(g.id));
            // auto-select kelompok pertama milik guru ini
            const firstKelompok = kelompokList.find(k => String(k.guru?.id) === String(g.id));
            if (firstKelompok) setSelectedKelompokId(String(firstKelompok.id));
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition
            ${selectedGuruId === String(g.id)
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
        >
          {/* Avatar inisial */}
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black
            ${selectedGuruId === String(g.id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {g.name?.charAt(0).toUpperCase()}
          </span>
          {g.name}
          {/* badge total siswa guru ini */}
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-slate-100 text-slate-500">
            {kelompokList
              .filter(k => String(k.guru?.id) === String(g.id))
              .reduce((sum, k) => sum + (k.anggota?.length || 0), 0)} siswa
          </span>
        </button>
      ))}
    </div>

    {/* Sub-tab kelompok milik guru terpilih */}
    {selectedGuruId && (
      <div className="flex gap-1.5">
        {kelompokByGuru.map(k => {
          const st = KELOMPOK_STYLE[k.label] || KELOMPOK_STYLE.A;
          const isActive = selectedKelompokId === String(k.id);
          return (
            <button
              key={k.id}
              onClick={() => setSelectedKelompokId(String(k.id))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition
                ${isActive
                  ? `${st.bg} ${st.text} ${st.border}`
                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
              Kelompok {k.label}
              <span className={`px-1.5 rounded-full text-[9px] font-black
                ${(k.anggota?.length || 0) >= 15
                  ? 'bg-rose-100 text-rose-700'
                  : (k.anggota?.length || 0) >= 12
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-500'}`}>
                {k.anggota?.length || 0}/15
              </span>
            </button>
          );
        })}
      </div>
    )}
  </div>

  {/* Daftar Anggota Kelompok Terpilih */}
  {!selectedGuruId ? (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-2">
      <FaUsers size={28} />
      <p className="text-xs italic">Pilih guru untuk melihat kelompok</p>
    </div>
  ) : (() => {
    const k = kelompokList.find(k => String(k.id) === selectedKelompokId);
    if (!k) return null;
    const st = KELOMPOK_STYLE[k.label] || KELOMPOK_STYLE.A;
    return (
      <>
        <div className={`px-4 py-2.5 border-b ${st.bg} ${st.border} flex items-center justify-between`}>
          <p className="text-xs font-bold text-slate-600">
            Kelompok <span className={`font-black ${st.text}`}>{k.label}</span>
            {" "}— {k.guru?.name}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold">
            {k.anggota?.length || 0} anggota
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-50 text-xs">
          {!k.anggota?.length ? (
            <div className="h-full flex items-center justify-center text-[11px] text-slate-300 italic">
              Kelompok kosong
            </div>
          ) : k.anggota.map(ang => (
            <div key={ang.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="font-bold text-slate-700 truncate">{ang.nama}</p>
                <p className="text-[9px] text-slate-400 font-medium">
                  Kelas {ang.kelas || "—"} • NIS: {ang.nis}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setModalPindah({
                    siswaId: ang.id,
                    siswaName: ang.nama,
                    dariKelompokId: k.id,
                    keKelompokId: "",
                  })}
                  className="p-1 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                  title="Pindah kelompok">
                  <FaExchangeAlt size={10} />
                </button>
                <button
                  onClick={() => handleKeluarkanSiswa(k.id, ang.id)}
                  className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                  title="Keluarkan dari kelompok">
                  <FaUserMinus size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  })()}
</div>

          </div>
        </div>
      </main>

      {/* MODAL PINDAH KELOMPOK */}
      {modalPindah && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Pindah Kelompok</h3>
              <p className="text-xs text-slate-500 mt-1">
                Pindahkan <span className="font-bold text-slate-700">{modalPindah.siswaName}</span> ke kelompok lain.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Kelompok Tujuan
              </label>
              <select
                value={modalPindah.keKelompokId}
                onChange={e => setModalPindah(prev => ({ ...prev, keKelompokId: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500">
                <option value="">-- Pilih Kelompok --</option>
                {kelompokList
                  .filter(k => k.id !== modalPindah.dariKelompokId)
                  .map(k => (
                    <option key={k.id} value={k.id}>
                      Kelompok {k.label} — {k.guru?.name || "Tanpa Guru"}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalPindah(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={handlePindahKelompok}
                disabled={processing || !modalPindah.keKelompokId}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-50 transition">
                {processing ? "Memproses..." : "Pindahkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}