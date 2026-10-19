import React, { useState, useEffect } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import api from "../../api";
import {
  FaBook, FaPlus, FaTrash, FaEdit, FaSearch,
  FaTimes, FaCheck, FaExclamationTriangle, FaBookOpen, FaSpinner,
} from "react-icons/fa";

const API_URL = "/api/tu/mapel";

// ─── Modal Tambah / Edit ─────────────────────────────────────────────────────
function ModalForm({ mode, data, onClose, onSaved }) {
  const [form, setForm]     = useState(data || { nama: "", kode: "", deskripsi: "", jenis: "wajib" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});
    try {
      if (mode === "edit") {
        await api.put(`${API_URL}/${data.id}`, form);
      } else {
        await api.post(API_URL, form);
      }
      onSaved(mode === "edit" ? "Mata pelajaran berhasil diperbarui." : "Mata pelajaran berhasil ditambahkan.");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              {mode === "edit" ? <FaEdit size={14} /> : <FaPlus size={14} />}
            </div>
            <div>
              <h2 className="font-bold">{mode === "edit" ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}</h2>
              <p className="text-emerald-100 text-xs">Isi data dengan benar</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center">
            <FaTimes size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Nama Mata Pelajaran <span className="text-rose-500">*</span>
            </label>
            <input
              value={form.nama}
              onChange={e => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Matematika"
              className={`w-full border ${errors.nama ? "border-rose-400 bg-rose-50" : "border-slate-200"} rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all`}
            />
            {errors.nama && <p className="text-rose-500 text-xs mt-1">{errors.nama[0]}</p>}
          </div>

          {/* Kode */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Kode <span className="text-rose-500">*</span>
            </label>
            <input
              value={form.kode}
              onChange={e => setForm({ ...form, kode: e.target.value.toUpperCase() })}
              maxLength={20}
              placeholder="Contoh: MTK"
              className={`w-full border ${errors.kode ? "border-rose-400 bg-rose-50" : "border-slate-200"} rounded-xl px-4 py-2.5 text-slate-700 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all`}
            />
            {errors.kode && <p className="text-rose-500 text-xs mt-1">{errors.kode[0]}</p>}
          </div>

          {/* Jenis */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Jenis Mata Pelajaran <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, jenis: "wajib" })}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  form.jenis === "wajib"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Wajib
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, jenis: "pilihan" })}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  form.jenis === "pilihan"
                    ? "bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-200"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Pilihan
              </button>
            </div>
            {errors.jenis && <p className="text-rose-500 text-xs mt-1">{errors.jenis[0]}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Deskripsi <span className="text-slate-300">(opsional)</span>
            </label>
            <textarea
              value={form.deskripsi || ""}
              onChange={e => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Deskripsi singkat mata pelajaran..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <FaSpinner className="animate-spin" size={13} /> : <FaCheck size={13} />}
            {mode === "edit" ? "Simpan Perubahan" : "Tambah Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Konfirmasi Hapus ──────────────────────────────────────────────────
function ModalHapus({ mapel, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="text-rose-500" size={24} />
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-1">Hapus Mata Pelajaran?</h3>
        <p className="text-slate-500 text-sm mb-2">Anda akan menghapus:</p>
        <div className="bg-rose-50 rounded-xl px-4 py-3 mb-4">
          <p className="font-bold text-rose-700">{mapel.nama}</p>
          <p className="text-rose-400 text-xs font-mono">{mapel.kode}</p>
        </div>
        <p className="text-slate-400 text-xs mb-5">Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <FaSpinner className="animate-spin" size={12} /> : <FaTrash size={12} />}
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Komponen Utama ──────────────────────────────────────────────────────────
export default function Matapelajaran() {
  const [mapelList, setMapelList] = useState([]);
  const [search, setSearch]       = useState("");
  const [filterJenis, setFilterJenis] = useState("semua");
  const [modal, setModal]         = useState(null);
  const [toast, setToast]         = useState(null);
  const [loadingPage, setLoadingPage]     = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Ambil semua mapel dari API
  const fetchMapel = async () => {
    try {
      const res = await api.get(API_URL);
      setMapelList(res.data.data);
    } catch {
      showToast("Gagal memuat data mata pelajaran.", "error");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => { fetchMapel(); }, []);

  const filtered = mapelList.filter(m => {
    const matchSearch =
      m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.kode.toLowerCase().includes(search.toLowerCase());
    const matchJenis = filterJenis === "semua" || m.jenis === filterJenis;
    return matchSearch && matchJenis;
  });

  const countWajib   = mapelList.filter(m => m.jenis === "wajib").length;
  const countPilihan = mapelList.filter(m => m.jenis === "pilihan").length;

  const handleSaved = (msg) => {
    showToast(msg);
    setModal(null);
    fetchMapel();
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await api.delete(`${API_URL}/${modal.data.id}`);
      showToast("Mata pelajaran berhasil dihapus.", "delete");
      setModal(null);
      fetchMapel();
    } catch {
      showToast("Gagal menghapus mata pelajaran.", "error");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <SidebarAdminTu />

      <div className="flex-1 overflow-y-auto">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[999] px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold flex items-center gap-3 animate-slideDown
            ${toast.type === "delete" ? "bg-rose-500" : toast.type === "error" ? "bg-slate-700" : "bg-emerald-600"}`}>
            {toast.type === "delete" ? <FaTrash size={12} /> : toast.type === "error" ? <FaTimes size={12} /> : <FaCheck size={12} />}
            {toast.msg}
          </div>
        )}

        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <FaBook className="text-white" size={16} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 leading-tight">Mata Pelajaran</h1>
              <p className="text-slate-400 text-sm">Kelola daftar mata pelajaran aktif di sekolah</p>
            </div>
          </div>

          {/* Filter Tab Jenis */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setFilterJenis("semua")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterJenis === "semua"
                  ? "bg-slate-800 text-white shadow-md"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Semua <span className="opacity-70">({mapelList.length})</span>
            </button>
            <button
              onClick={() => setFilterJenis("wajib")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterJenis === "wajib"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Wajib <span className="opacity-70">({countWajib})</span>
            </button>
            <button
              onClick={() => setFilterJenis("pilihan")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filterJenis === "pilihan"
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Pilihan <span className="opacity-70">({countPilihan})</span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={13} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama atau kode..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <FaTimes size={13} />
                </button>
              )}
            </div>
            <button
              onClick={() => setModal({ type: "add" })}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all shadow-lg shadow-emerald-200 flex-shrink-0"
            >
              <FaPlus size={12} /> Tambah Mata Pelajaran
            </button>
          </div>

          {/* Tabel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Header Tabel */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Kode</div>
              <div className="col-span-4">Nama Mata Pelajaran</div>
              <div className="col-span-2">Jenis</div>
              <div className="col-span-2">Deskripsi</div>
              <div className="col-span-1 text-center">Aksi</div>
            </div>

            {/* Loading State */}
            {loadingPage ? (
              <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
                <FaSpinner className="animate-spin text-emerald-500" size={28} />
                <p className="text-sm">Memuat data...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaBookOpen className="text-slate-300" size={24} />
                </div>
                <p className="text-slate-400 font-medium">Tidak ada mata pelajaran ditemukan</p>
                <p className="text-slate-300 text-sm mt-1">Coba ubah kata kunci pencarian</p>
              </div>
            ) : (
              filtered.map((m, i) => (
                <div
                  key={m.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-emerald-50/40 transition-colors ${i !== filtered.length - 1 ? "border-b border-slate-50" : ""}`}
                >
                  <div className="col-span-1 text-slate-400 text-sm">{i + 1}</div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-700 font-mono">
                      {m.kode}
                    </span>
                  </div>
                  <div className="col-span-4 text-slate-700 font-semibold text-sm">{m.nama}</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      m.jenis === "wajib"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {m.jenis === "wajib" ? "Wajib" : "Pilihan"}
                    </span>
                  </div>
                  <div className="col-span-2 text-slate-400 text-sm truncate">{m.deskripsi || <span className="italic text-slate-300">—</span>}</div>
                  <div className="col-span-1 flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setModal({ type: "edit", data: { ...m } })}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 flex items-center justify-center transition-all"
                      title="Edit"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => setModal({ type: "delete", data: m })}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all"
                      title="Hapus"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Footer */}
            {!loadingPage && filtered.length > 0 && (
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Menampilkan <span className="font-bold text-slate-600">{filtered.length}</span> dari <span className="font-bold text-slate-600">{mapelList.length}</span> mata pelajaran
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <ModalForm
          mode={modal.type}
          data={modal.data}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {modal?.type === "delete" && (
        <ModalHapus
          mapel={modal.data}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
          loading={loadingDelete}
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
}