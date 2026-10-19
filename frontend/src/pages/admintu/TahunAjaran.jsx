// src/Dashboard/TuSD/TahunAjaran.jsx
import React, { useEffect, useState } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";
import api from "../../api"; // gunakan axios instance
// Impor ikon untuk mempercantik UI (Instal via: npm install lucide-react)
import { 
  Calendar, 
  Plus, 
  CheckCircle, 
  Lock, 
  AlertCircle, 
  Loader2, 
  Archive, 
  Layers 
} from "lucide-react";

export default function TahunAjaran() {
  const [data, setData] = useState([]);
  const [tahunBaru, setTahunBaru] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const API = "/api/tu/tahunajaran";

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(API);
      setData(res.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching tahun ajaran:", err);

      if (err.response?.status === 401) {
        setError("Anda belum login atau session expired.");
        toast.error("Silakan login terlebih dahulu.");
      } else {
        setError(err.response?.data?.message || "Gagal memuat data tahun ajaran");
        toast.error("Gagal memuat data tahun ajaran");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tambahTahun = async (e) => {
    e.preventDefault();
    if (!tahunBaru.trim()) return toast.error("Nama tahun ajaran wajib diisi");

    try {
      await api.post(API, { nama: tahunBaru.trim() });
      toast.success("Tahun ajaran berhasil ditambahkan");
      setTahunBaru("");
      fetchData();
    } catch (err) {
      console.error("❌ Error tambah tahun ajaran:", err);
      const msg = err.response?.data?.message || "Gagal menambah tahun ajaran";
      toast.error(msg);
    }
  };

  const aktifkan = async (id) => {
    if (!window.confirm("Aktifkan tahun ini? Tahun lain akan otomatis non-aktif.")) return;

    setProcessingId(id);
    try {
      await api.put(`${API}/${id}/aktifkan`);
      toast.success("Tahun ajaran berhasil diaktifkan");
      fetchData();
    } catch (err) {
      console.error("❌ Error aktifkan:", err);
      const msg = err.response?.data?.message || "Gagal mengaktifkan tahun ajaran";
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const tutupTahun = async (id) => {
    if (!window.confirm("Tutup & arsipkan tahun ajaran ini? Proses ini tidak dapat dibatalkan.")) return;

    setProcessingId(id);
    try {
      await api.put(`${API}/${id}/tutup`);
      toast.success("Tahun ajaran berhasil ditutup dan dikunci");
      fetchData();
    } catch (err) {
      console.error("❌ Error tutup tahun:", err);
      const msg = err.response?.data?.message || "Gagal menutup tahun ajaran";
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const gantiSemester = async (id, semester) => {
    setProcessingId(id);
    try {
      await api.put(`${API}/${id}/semester`, { semester });
      toast.success(`Semester berhasil diubah menjadi ${semester}`);
      fetchData();
    } catch (err) {
      console.error("❌ Error ganti semester:", err);
      const msg = err.response?.data?.message || "Gagal mengganti semester";
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // Badge Status dengan warna pastel hijau yang lebih modern & aesthetic
  const getBadgeClass = (tahun) => {
    if (tahun.aktif === 1 || tahun.aktif === true) {
      return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200";
    }

    if (tahun.status === "dikunci") {
      return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200";
    }

    if (tahun.status === "draft") {
      return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200";
    }

    return "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600";
  };

  // Full screen loading yang lebih bersih
  if (loading && data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <Loader2 className="animate-spin h-10 w-10 text-emerald-600 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-600">Memuat data tahun ajaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased theme-green">
      <SidebarAdminTu />

      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Manajemen Tahun Ajaran
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola periode aktif, pergantian semester, dan pengarsipan data akademik sekolah.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl mb-6 flex items-start gap-3 shadow-sm animate-fade-in">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-red-800">Terjadi Kesalahan</h4>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Grid Layout untuk Form dan Ringkasan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
          {/* Form Tambah Tahun */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Tambah Periode</h2>
            </div>
            
            <form onSubmit={tambahTahun} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Nama Tahun Ajaran
                </label>
                <input
                  type="text"
                  value={tahunBaru}
                  onChange={(e) => setTahunBaru(e.target.value)}
                  placeholder="e.g., 2027/2028"
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition shadow-inner"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Format disarankan menggunakan garis miring (/)
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition text-sm font-semibold shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Tahun Ajaran
              </button>
            </form>
          </div>

          {/* Informasi Tambahan / Card Petunjuk Singkat */}
          <div className="bg-gradient-to-br from-emerald-700 to-green-800 p-6 rounded-2xl text-white shadow-md lg:col-span-2 flex flex-col justify-between min-h-[190px]">
            <div>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-200" /> Aturan Aktivasi Sistem
              </h3>
              <ul className="text-xs text-emerald-100 space-y-2 list-disc list-inside opacity-90">
                <li>Hanya diperbolehkan ada <strong>satu</strong> tahun ajaran yang aktif dalam satu waktu.</li>
                <li>Mengaktifkan tahun ajaran baru otomatis menonaktifkan tahun ajaran berjalan sebelumnya.</li>
                <li>Tahun ajaran yang telah <strong>Dikitutup/Dikunci</strong> akan diarsipkan dan tidak bisa diubah kembali.</li>
              </ul>
            </div>
            <div className="text-[11px] text-emerald-200/70 border-t border-white/10 pt-3 mt-4">
              Akses khusus Staff Tata Usaha (TU) Sekolah Dasar.
            </div>
          </div>
        </div>

        {/* Tabel Daftar Tahun Ajaran */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-bold text-slate-900">Daftar Histori Tahun Ajaran</h2>
            </div>
            <span className="text-xs font-medium bg-slate-200/70 px-2.5 py-1 rounded-md text-slate-600">
              Total: {data.length} Data
            </span>
          </div>

          {data.length === 0 ? (
            <div className="p-16 text-center max-w-sm mx-auto">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center rounded-full mx-auto mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Belum Ada Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Belum ada data tahun ajaran yang terekam. Silakan tambahkan melalui form di atas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-xs tracking-wider uppercase">
                    <th className="p-4 pl-6">Tahun Ajaran</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((t) => {
                    const isProcessing = processingId === t.id;
                    const isAktif = t.aktif === 1 || t.aktif === true;

                    return (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* Kolom Tahun Ajaran */}
                        <td className="p-4 pl-6 font-medium text-slate-900">
                          <div className="flex items-center gap-3">
                            <span>{t.nama}</span>
                            {isAktif && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Current Active
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Kolom Status Badge */}
                        <td className="p-4">
                          <span className={getBadgeClass(t)}>
                            {t.status === "dikunci" && <Lock className="h-3 w-3" />}
                            {isAktif && <CheckCircle className="h-3 w-3" />}
                            {t.status === "dikunci" ? "Terkunci & Arsip" : t.status}
                          </span>
                        </td>

                        {/* Kolom Tombol Aksi */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Tombol Aktifkan */}
                            {!isAktif && t.status !== "dikunci" && (
                              <button
                                onClick={() => aktifkan(t.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent transition-all shadow-sm"
                              >
                                {isProcessing ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                                {isProcessing ? "Memproses" : "Aktifkan"}
                              </button>
                            )}

                            {/* Tombol Tutup Tahun */}
                            {isAktif && (
                              <button
                                onClick={() => tutupTahun(t.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent transition-all shadow-sm"
                              >
                                {isProcessing ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Lock className="h-3 w-3" />
                                )}
                                {isProcessing ? "Memproses" : "Tutup Tahun"}
                              </button>
                            )}

                            {/* Label Arsip */}
                            {!isAktif && t.status === "dikunci" && (
                              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium italic bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                <Archive className="h-3 w-3" /> Terarsip
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}