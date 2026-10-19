import React, { useEffect, useState } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import api from "../../api";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaUserTie, FaSearch } from "react-icons/fa";

export default function DataGuru() {
  const [gurus, setGurus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    nipy: "",
  });

  const [showModal, setShowModal] = useState(false);

  const fetchGuru = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tu/data-guru");
      // Backend returns plain array (no wrapper), guard against null
      setGurus(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Gagal mengambil data guru");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/api/tu/data-guru/${form.id}`, form);
        toast.success("Data guru diperbarui");
      } else {
        await api.post("/api/tu/data-guru", form);
        toast.success("Guru baru ditambahkan");
      }
      setShowModal(false);
      setForm({ id: null, name: "", nipy: "" });
      fetchGuru();
    } catch (err) {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleEdit = (guru) => {
    setForm(guru);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      await api.delete(`/api/tu/data-guru/${id}`);
      toast.success("Guru berhasil dihapus");
      fetchGuru();
    } catch {
      toast.error("Gagal menghapus data");
    }
  };

  // Filter sederhana untuk search bar (null-safe)
  const filteredGurus = gurus.filter(g => 
    (g.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (g.nipy ?? "").includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />

      <main className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FaUserTie className="text-indigo-600" />
              Manajemen Data Guru
            </h1>
            <p className="text-slate-500 text-sm">Kelola informasi tenaga pendidik unit SD</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Cari guru..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider w-16">No</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">NIPY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="4" className="px-6 py-4 bg-slate-50/50"></td>
                    </tr>
                  ))
                ) : filteredGurus.length > 0 ? (
                  filteredGurus.map((g, i) => (
                    <tr key={g.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{i + 1}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-700 block">{g.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {g.nipy}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                          <FaUserTie className="text-slate-400 text-3xl" />
                        </div>
                        <p className="text-slate-500 font-medium">Data guru tidak ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Improved Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setShowModal(false)}
            />
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden transform transition-all">
              <div className="bg-indigo-600 p-6 text-white">
                <h2 className="text-xl font-bold">
                  {form.id ? "Perbarui Data Guru" : "Tambah Guru Baru"}
                </h2>
                <p className="text-indigo-100 text-sm mt-1">Lengkapi informasi guru di bawah ini</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso, S.Pd"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">NIPY</label>
                  <input
                    type="text"
                    placeholder="Masukkan NIPY"
                    value={form.nipy}
                    onChange={(e) => setForm({ ...form, nipy: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                  >
                    {form.id ? "Simpan Perubahan" : "Simpan Data"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}