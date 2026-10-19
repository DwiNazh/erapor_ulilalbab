import React, { useState, useEffect, useCallback } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";
import api from "../../api"; 
import { 
  FaBookOpen, 
  FaSave, 
  FaTrashAlt, 
  FaSyncAlt, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaLayerGroup,
  FaListOl,
  FaSchool
} from "react-icons/fa";

export default function PjblJudulPage() {
  const [data, setData]         = useState([]);       
  const [tahunAjaran, setTA]    = useState(null);
  const [semester, setSemester] = useState("ganjil");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);

  // edit state per rombel: { [rombel_id]: { judul, deskripsi } }
  const [edits, setEdits] = useState({});

  const API = "/api/tu";

  // ── fetch data ──────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (sem) => {
    setLoading(true);
    try {
      const res = await api.get(`${API}/pjbl-judul?semester=${sem}`);
      setData(res.data.data || []);
      setTA(res.data.tahun_ajaran);
      setSemester(res.data.semester);
      
      // init edits dari data yang sudah ada
      const initEdits = {};
      (res.data.data || []).forEach((r) => {
        initEdits[r.rombel_id] = {
          judul: r.judul ?? "",
          deskripsi: r.deskripsi ?? "",
        };
      });
      setEdits(initEdits);
    } catch (e) {
      toast.error("Gagal memuat data judul PJBL");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(semester);
  }, []);

  // ── handle edit inline ──────────────────────────────────────────────────────
  const handleChange = (rombelId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [rombelId]: { ...prev[rombelId], [field]: value },
    }));
  };

  // ── simpan satu kelas ───────────────────────────────────────────────────────
  const handleSaveSingle = async (rombelId) => {
    const edit = edits[rombelId];
    if (!edit?.judul?.trim()) {
      toast.error("Judul tidak boleh kosong");
      return;
    }
    setSaving(true);
    try {
      await api.post(`${API}/pjbl-judul`, {
        rombel_id: rombelId,
        semester,
        judul: edit.judul,
        deskripsi: edit.deskripsi,
      });
      toast.success("Judul PJBL kelas berhasil disimpan ✓");
      fetchData(semester);
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // ── simpan semua sekaligus (bulk) ───────────────────────────────────────────
  const handleSaveAll = async () => {
    const items = Object.entries(edits)
      .filter(([, v]) => v.judul?.trim())
      .map(([rombel_id, v]) => ({
        rombel_id: parseInt(rombel_id),
        judul: v.judul,
        deskripsi: v.deskripsi,
      }));

    if (items.length === 0) {
      toast.error("Tidak ada judul yang diisi");
      return;
    }

    setSaving(true);
    try {
      const res = await api.post(`${API}/pjbl-judul/bulk`, { semester, items });
      toast.success(res.data.message || "Semua perubahan berhasil disimpan ✓");
      fetchData(semester);
    } catch (e) {
      toast.error(e.response?.data?.message ?? "Gagal menyimpan perubahan massal");
    } finally {
      setSaving(false);
    }
  };

  // ── hapus judul ─────────────────────────────────────────────────────────────
  const handleDelete = async (pjblJudulId, rombelId) => {
    if (!window.confirm("Hapus judul PJBL untuk kelas ini?")) return;
    try {
      await api.delete(`${API}/pjbl-judul/${pjblJudulId}`);
      toast.success("Judul PJBL berhasil dihapus");
      fetchData(semester);
    } catch (e) {
      toast.error("Gagal menghapus judul");
    }
  };

  // ── group by tingkat ────────────────────────────────────────────────────────
  const grouped = data.reduce((acc, r) => {
    const key = `Kelas ${r.tingkat_kelas}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const filledCount  = data.filter((r) => r.judul).length;
  const emptyCount   = data.length - filledCount;

  if (loading && data.length === 0) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-2">
        <FaSyncAlt className="animate-spin text-indigo-600 text-3xl" />
        <p className="text-slate-500 font-medium">Memuat data PJBL...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <FaBookOpen className="text-indigo-600" /> Pengaturan Judul PJBL
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">
                  {tahunAjaran ? `TA ${tahunAjaran.nama}` : "Memuat..."}
                </span>
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden ml-2 p-0.5 shadow-sm">
                  {["ganjil", "genap"].map((s) => (
                    <button
                      key={s}
                      onClick={() => fetchData(s)}
                      className={`px-4 py-1 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                        semester === s 
                          ? "bg-indigo-600 text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 max-w-md">
              <FaExclamationCircle className="text-amber-500 mt-1 flex-shrink-0" />
              <p className="text-[12px] text-amber-800 leading-relaxed">
                Silakan isi <b>Judul PJBL</b> dan <b>Deskripsi singkat</b> untuk masing-masing rombongan belajar. Anda dapat menyimpan per kelas atau langsung menyimpan seluruh kelas sekaligus.
              </p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FaLayerGroup className="text-lg" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Kelas</span>
                  <span className="text-2xl font-black text-slate-700">{data.length}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FaCheckCircle className="text-lg" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Sudah Diisi</span>
                  <span className="text-2xl font-black text-emerald-600">{filledCount}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                  <FaExclamationCircle className="text-lg" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Belum Diisi</span>
                  <span className="text-2xl font-black text-amber-500">{emptyCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BULK ACTION BUTTON */}
          {data.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleSaveAll}
                disabled={saving || loading}
                className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
              >
                {saving ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
                {saving ? "Menyimpan Perubahan..." : "Simpan Semua Perubahan"}
              </button>
            </div>
          )}

          {/* TABLES PER TINGKAT KELAS */}
          <div className="space-y-10">
            {Object.entries(grouped).map(([tingkat, rows]) => (
              <div key={tingkat} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Section Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs">
                      {tingkat.replace("Kelas ", "")}
                    </span>
                    {tingkat}
                  </h2>
                  <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                    {rows.length} Rombel
                  </span>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
                        <th className="px-4 py-3.5 text-center w-14"><FaListOl className="mx-auto" /></th>
                        <th className="px-4 py-3.5 text-center w-28"><FaSchool className="mx-auto" /> Kelas</th>
                        <th className="px-6 py-3.5">Judul PJBL</th>
                        <th className="px-6 py-3.5">Deskripsi Singkat</th>
                        <th className="px-4 py-3.5 text-center w-36">Status</th>
                        <th className="px-4 py-3.5 text-center w-32">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map((r, idx) => {
                        const edit = edits[r.rombel_id] ?? { judul: "", deskripsi: "" };
                        const hasJudul = !!r.judul;

                        return (
                          <tr key={r.rombel_id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-4 py-4 text-center font-bold text-slate-400 text-xs">{idx + 1}</td>
                            <td className="px-4 py-4 text-center">
                              <span className="bg-indigo-50 text-indigo-600 font-bold text-xs px-2.5 py-1 rounded-lg border border-indigo-100">
                                {r.nama_kelas}
                              </span>
                            </td>
                            
                            {/* Input Judul */}
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                placeholder="Masukkan judul PJBL..."
                                value={edit.judul}
                                onChange={(e) => handleChange(r.rombel_id, "judul", e.target.value)}
                              />
                            </td>

                            {/* Input Deskripsi */}
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                placeholder="Deskripsi singkat (opsional)"
                                value={edit.deskripsi}
                                onChange={(e) => handleChange(r.rombel_id, "deskripsi", e.target.value)}
                              />
                            </td>

                            {/* Status Badge */}
                            <td className="px-4 py-4 text-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                                  hasJudul 
                                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
                                    : 'bg-amber-50 border border-amber-100 text-amber-700'
                                }`}
                              >
                                {hasJudul ? "✓ Sudah Diisi" : "○ Belum Diisi"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleSaveSingle(r.rombel_id)}
                                  disabled={saving}
                                  className="p-2 bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white rounded-xl transition-all shadow-sm"
                                  title="Simpan baris ini"
                                >
                                  <FaSave className="text-xs" />
                                </button>
                                {hasJudul && r.pjbl_judul_id && (
                                  <button
                                    onClick={() => handleDelete(r.pjbl_judul_id, r.rombel_id)}
                                    className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                                    title="Hapus Judul"
                                  >
                                    <FaTrashAlt className="text-xs" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {data.length === 0 && !loading && (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                <FaExclamationCircle className="text-slate-400 text-5xl mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-bold text-slate-700">Data Rombel Tidak Ditemukan</h3>
                <p className="text-slate-500">Belum ada data rombongan belajar terdaftar pada semester ini.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}