import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  FaUsers, 
  FaCheck, 
  FaUserPlus, 
  FaSyncAlt, 
  FaDoorOpen, 
  FaIdCard, 
  FaCheckDouble, 
  FaChevronLeft, 
  FaChevronRight,
  FaSave,
  FaInfoCircle
} from "react-icons/fa";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import Footer from "../../components/footer";
import api from "../../api";
import toast from "react-hot-toast";

export default function SiswaBaruPage() {
  const [siswaBaru, setSiswaBaru] = useState([]);
  const [rombels, setRombels] = useState([]);
  const [selectedRombelId, setSelectedRombelId] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processingBagikan, setProcessingBagikan] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const masterCheckboxRef = useRef(null);
  const API = "/api/tu";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [siswaRes, rombelRes] = await Promise.all([
        api.get(`${API}/siswa-baru`),
        api.get(`${API}/rombel?kelas=1&has_wali=true&tahun=next`), // ← sesuai dengan backend
      ]);

      setSiswaBaru(siswaRes.data.map((s) => ({
        ...s,
        sudahMasukKelas: !!s.sub_kelas,
      })));

      const rombelData = rombelRes.data?.data || [];
      setRombels(rombelData);

      if (rombelData.length === 0 && rombelRes.data?.message) {
        toast.error(rombelRes.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data siswa baru");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectableStudents = useMemo(() => 
    siswaBaru.filter((s) => !s.sudahMasukKelas), 
  [siswaBaru]);

  const selectableCount = selectableStudents.length;
  const allSelectableChecked = selectableCount > 0 && selectedSiswa.length === selectableCount;

  const toggleSelectSiswa = (id) => {
    const siswa = siswaBaru.find((s) => s.id === id);
    if (!siswa || siswa.sudahMasukKelas) return;

    setSelectedSiswa((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleMasterCheckboxChange = (e) => {
    setSelectedSiswa(e.target.checked ? selectableStudents.map((s) => s.id) : []);
  };

  const handlePilih10 = () => {
    const ids = selectableStudents.slice(0, 10).map((s) => s.id);
    setSelectedSiswa(ids);
    if (ids.length > 0) toast.success(`${ids.length} siswa dipilih`);
  };

  const handleBagikanMassal = async () => {
    if (!selectedRombelId) return toast.error("Pilih rombel terlebih dahulu!");
    if (selectedSiswa.length === 0) return toast.error("Pilih minimal satu siswa!");

    setProcessingBagikan(true);
    try {
      const payload = { rombel_id: selectedRombelId, siswa_ids: selectedSiswa };
      const res = await api.post(`${API}/siswa-baru/bagikan-sub-kelas`, payload);

      setSiswaBaru((prev) =>
        prev.map((s) =>
          selectedSiswa.includes(s.id) ? { ...s, sudahMasukKelas: true, sub_kelas: rombels.find(r => r.id == selectedRombelId)?.sub_nama } : s
        )
      );

      setSelectedSiswa([]);
      setSelectedRombelId("");
      toast.success(res.data?.message || "Siswa berhasil dibagikan ke rombel");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal membagikan siswa");
    } finally {
      setProcessingBagikan(false);
    }
  };

  const handleNisChange = (id, value) => {
    setSiswaBaru((prev) => prev.map((s) => (s.id === id ? { ...s, nis: value } : s)));
  };

  const handleSimpan = async (id) => {
    const siswa = siswaBaru.find((s) => s.id === id);
    if (!siswa?.sub_kelas || !siswa?.nis?.trim()) return;

    setSavingId(id);
    try {
      await api.post(`${API}/siswa-baru/simpan-nis`, {
        id: siswa.id,
        nis: siswa.nis.trim(),
        nisn: siswa.nisn || null,
      });

      toast.success("NIS berhasil disimpan");
      setSiswaBaru((prev) => prev.filter((s) => s.id !== id));
      setSelectedSiswa((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan NIS");
    } finally {
      setSavingId(null);
    }
  };

  const totalPages = Math.ceil(siswaBaru.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSiswa = siswaBaru.slice(indexOfFirstItem, indexOfLastItem);

  // Skeleton Loading - Samakan dengan kode sebelumnya
  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />
      <div className="flex-1 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
        <div className="h-24 bg-slate-200 rounded-2xl mb-8"></div>
        <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <div className="flex flex-1 overflow-hidden">
        <SidebarAdminTu />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <FaUserPlus className="text-indigo-600" /> Penerimaan Siswa Baru
                </h1>
                <p className="text-slate-500 mt-1">Kelola pembagian rombel dan registrasi NIS siswa kelas 1.</p>
              </div>
              <button 
                onClick={fetchData}
                className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
              >
                <FaSyncAlt />
              </button>
            </div>

            {/* ACTION CARD - Control Bar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <select
                  value={selectedRombelId}
                  onChange={(e) => setSelectedRombelId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all"
                >
                  <option value="">-- Pilih Rombel Tujuan --</option>
                  {rombels.map((r) => (
                    <option key={r.id} value={r.id}>
                      Kelas 1{r.sub_nama} — {r.wali_kelas_nama}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <FaDoorOpen />
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={handlePilih10}
                  disabled={selectableCount === 0}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-indigo-200 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50"
                >
                  <FaCheckDouble size={14} /> +10 Siswa
                </button>

                <button
                  onClick={handleBagikanMassal}
                  disabled={!selectedRombelId || selectedSiswa.length === 0 || processingBagikan}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  {processingBagikan ? <FaSyncAlt className="animate-spin" /> : <FaCheck />}
                  Bagikan ({selectedSiswa.length})
                </button>
              </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-5 w-16 text-center">
                        <input
                          type="checkbox"
                          ref={masterCheckboxRef}
                          checked={allSelectableChecked}
                          disabled={selectableCount === 0}
                          onChange={handleMasterCheckboxChange}
                          className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </th>
                      <th className="px-4 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-12">No</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Rombel</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Registrasi NIS</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentSiswa.map((s, i) => (
                      <tr key={s.id} className={`hover:bg-slate-50/80 transition-colors group ${selectedSiswa.includes(s.id) ? 'bg-indigo-50/30' : ''}`}>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedSiswa.includes(s.id)}
                            disabled={s.sudahMasukKelas}
                            onChange={() => toggleSelectSiswa(s.id)}
                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-30"
                          />
                        </td>
                        <td className="px-4 py-4 text-slate-400 font-medium text-sm">{indexOfFirstItem + i + 1}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-700 block">{s.nama_user}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Pendaftar Baru</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {s.sub_kelas ? (
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">1{s.sub_kelas}</span>
                          ) : (
                            <span className="text-slate-300 text-xs italic">Belum Set</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative group/input">
                            <input
                              type="text"
                              value={s.nis || ""}
                              disabled={!s.sub_kelas}
                              onChange={(e) => handleNisChange(s.id, e.target.value)}
                              placeholder={s.sub_kelas ? "Input NIS..." : "Set rombel dulu"}
                              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                                !s.sub_kelas ? "opacity-50 cursor-not-allowed" : "group-hover/input:border-indigo-300"
                              }`}
                            />
                            {s.nis && <FaIdCard className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={14}/>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleSimpan(s.id)}
                            disabled={!s.sub_kelas || !s.nis?.trim() || savingId === s.id}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                              !s.sub_kelas || !s.nis?.trim() || savingId === s.id
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                            }`}
                          >
                            {savingId === s.id ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
                            Simpan
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* EMPTY STATE */}
              {currentSiswa.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                  <FaUsers size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Tidak ada antrean siswa baru</p>
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Halaman <span className="text-indigo-600">{currentPage}</span> dari {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <FaChevronLeft size={12} />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* INFO PANEL */}
            <div className="mt-8 flex items-start gap-4 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
               <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm">
                  <FaInfoCircle size={20} />
               </div>
               <div>
                  <h4 className="font-bold text-indigo-900">Alur Registrasi Siswa Baru</h4>
                  <p className="text-sm text-indigo-700/80 leading-relaxed mt-1">
                    1. Pilih siswa, lalu pilih rombel tujuan dan klik <b>Bagikan</b>.<br/>
                    2. Masukkan <b>NIS</b> siswa yang sudah mendapatkan kelas.<br/>
                    3. Klik <b>Simpan</b> untuk memindahkan data ke Master Data Siswa.
                  </p>
               </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}