// src/pages/superadmin/ManajemenAkun.jsx   (sesuaikan path jika berbeda)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";   // ← PASTIKAN PATH INI BENAR
import SidebarSuperadmin from "../../components/SidebarSuperadmin.jsx";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import { toast, Toaster } from "react-hot-toast";
import { UserPlus, Edit, Trash2, Search, Users, X, Loader2 } from "lucide-react";

export default function ManajemenAkun() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [akunList, setAkunList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [jenjangList, setJenjangList] = useState([]);

  const [newAkun, setNewAkun] = useState({
    name: "",
    nipy: "",
    role: "",
    password: "",
    jenjang_id: "",
  });
  const [editAkun, setEditAkun] = useState(null);

  // ====================== PROTEKSI AKSES ======================
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        navigate("/login");
        return;
      }
      if (user.role !== "superadmin") {
        toast.error("Akses hanya untuk Superadmin!");
        navigate("/"); // atau halaman dashboard superadmin
        return;
      }
    }
  }, [authLoading, user, navigate]);

  // ====================== FETCH DATA AKUN & JENJANG ======================
  const fetchAkun = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/superadmin/users");
      console.log("✅ Data akun berhasil diambil:", response.data);
      setAkunList(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) {
        toast.error("Sesi expired. Silakan login kembali.");
        logout?.();
      } else if (err.response?.status === 403) {
        setError("Akses ditolak. Anda bukan Superadmin.");
        toast.error("Akses terlarang!");
      } else {
        setError("Gagal mengambil data akun dari server.");
        toast.error("Gagal memuat data akun");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJenjang = async () => {
    try {
      const response = await api.get("/api/superadmin/jenjang");
      if (Array.isArray(response.data)) {
        setJenjangList(response.data);
      }
    } catch (err) {
      console.warn("Gagal load jenjang, gunakan default:", err);
      setJenjangList([
        { id: 1, kode: "SD", nama: "Sekolah Dasar" },
        { id: 2, kode: "SMP", nama: "Sekolah Menengah Pertama" },
        { id: 3, kode: "SMA", nama: "Sekolah Menengah Atas" },
      ]);
    }
  };

  // Fetch data setelah user terverifikasi sebagai superadmin
  useEffect(() => {
    if (user?.role === "superadmin" && !authLoading) {
      fetchAkun();
      fetchJenjang();
    }
  }, [user, authLoading]);

  // ====================== FILTER ======================
  const filteredAkun = akunList.filter(
    (akun) =>
      akun.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      akun.nipy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ====================== TAMBAH AKUN ======================
  const handleAddAkun = async (e) => {
    e.preventDefault();
    if (!newAkun.name || !newAkun.nipy || !newAkun.role || !newAkun.password) {
      toast.error("Nama, NIPY, Password, dan Role wajib diisi!");
      return;
    }

    if (newAkun.role !== "superadmin" && !newAkun.jenjang_id) {
      toast.error("Jenjang sekolah wajib dipilih untuk role selain Superadmin!");
      return;
    }

    try {
      const payload = {
        name: newAkun.name,
        nipy: newAkun.nipy,
        password: newAkun.password,
        role: newAkun.role,
        jenjang_id: newAkun.role === "superadmin" ? null : parseInt(newAkun.jenjang_id),
      };

      const res = await api.post("/api/superadmin/users", payload);
      setAkunList([res.data.data || res.data, ...akunList]);
      setNewAkun({ name: "", nipy: "", role: "", password: "", jenjang_id: "" });
      toast.success("Akun berhasil ditambahkan!");
    } catch (err) {
      console.error("Add error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.errors || "Gagal menambah akun.";
      toast.error(typeof errorMsg === "object" ? JSON.stringify(errorMsg) : errorMsg);
    }
  };

  // ====================== HAPUS AKUN ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus akun ini?")) return;

    try {
      await api.delete(`/api/superadmin/users/${id}`);
      setAkunList(akunList.filter((a) => a.id !== id));
      toast.success("Akun berhasil dihapus!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Gagal menghapus akun.");
    }
  };

  // ====================== EDIT AKUN ======================
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editAkun) return;

    if (editAkun.role !== "superadmin" && !editAkun.jenjang_id) {
      toast.error("Jenjang sekolah wajib dipilih untuk role selain Superadmin!");
      return;
    }

    try {
      const payload = {
        name: editAkun.name,
        nipy: editAkun.nipy,
        role: editAkun.role,
        jenjang_id: editAkun.role === "superadmin" ? null : (editAkun.jenjang_id ? parseInt(editAkun.jenjang_id) : null),
      };

      const res = await api.put(`/api/superadmin/users/${editAkun.id}`, payload);

      setAkunList(
        akunList.map((akun) =>
          akun.id === editAkun.id ? (res.data.data || res.data) : akun
        )
      );

      setEditAkun(null);
      toast.success("Perubahan akun berhasil disimpan!");
    } catch (err) {
      console.error("Update error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.errors || "Gagal menyimpan perubahan.";
      toast.error(typeof errorMsg === "object" ? JSON.stringify(errorMsg) : errorMsg);
    }
  };

  // ====================== LOADING & ERROR STATE ======================
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-red-600 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <X className="text-red-600" size={40} />
          </div>
          <p className="text-xl font-semibold mb-4 text-gray-800">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow hover:shadow-lg transition font-semibold"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  // ====================== MAIN UI ======================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster position="top-center" />

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg hidden md:block">
        <SidebarSuperadmin />
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6 md:p-10 md:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-left md:text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center md:justify-center gap-3">
              <Users className="text-indigo-600" size={36} /> Manajemen Akun
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Kelola akun administrator, guru, dan TU dengan mudah.
            </p>
          </div>

          {/* Form Tambah Akun */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-10"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800 gap-2">
              <UserPlus className="text-indigo-600" size={24} /> Tambah Akun Baru
            </h2>

            <form onSubmit={handleAddAkun}>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={newAkun.name}
                  onChange={(e) => setNewAkun({ ...newAkun, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="NIPY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={newAkun.nipy}
                  onChange={(e) => setNewAkun({ ...newAkun, nipy: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={newAkun.password}
                  onChange={(e) => setNewAkun({ ...newAkun, password: e.target.value })}
                />
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                  value={newAkun.role}
                  onChange={(e) => {
                    const role = e.target.value;
                    setNewAkun({
                      ...newAkun,
                      role,
                      jenjang_id: role === "superadmin" ? "" : newAkun.jenjang_id,
                    });
                  }}
                >
                  <option value="">Pilih Role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="admintu">Admin / TU</option>
                  <option value="guru">Guru</option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                  <option value="siswa">Siswa</option>
                </select>
                <select
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white ${
                    newAkun.role === "superadmin" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                  }`}
                  value={newAkun.role === "superadmin" ? "" : newAkun.jenjang_id}
                  onChange={(e) => setNewAkun({ ...newAkun, jenjang_id: e.target.value })}
                  disabled={newAkun.role === "superadmin"}
                >
                  <option value="">
                    {newAkun.role === "superadmin" ? "Semua Jenjang" : "Pilih Jenjang"}
                  </option>
                  {jenjangList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.kode} - {j.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md flex items-center gap-2 transition-all hover:-translate-y-1"
                >
                  <UserPlus size={18} /> Tambah Akun
                </button>
              </div>
            </form>
          </motion.div>

          {/* Pencarian */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-indigo-600" size={24} /> Daftar Akun
            </h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama atau NIPY akun..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Tabel Daftar Akun */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-center text-gray-700">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">#</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-left">Nama</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-left">NIPY</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">Role</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">Jenjang</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAkun.length > 0 ? (
                      filteredAkun.map((akun, i) => (
                        <tr key={akun.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{i + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left text-gray-900">
                            {akun.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-left">{akun.nipy}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                                akun.role === "superadmin"
                                  ? "bg-red-100 text-red-700"
                                  : akun.role === "admintu"
                                  ? "bg-blue-100 text-blue-700"
                                  : akun.role === "guru"
                                  ? "bg-green-100 text-green-700"
                                  : akun.role === "kepala_sekolah" || akun.role === "kepala sekolah"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {akun.role === "kepala_sekolah" ? "Kepala Sekolah" : akun.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            {akun.role === "superadmin" ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                Semua
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {akun.jenjang?.kode ||
                                  jenjangList.find((j) => j.id === akun.jenjang_id)?.kode ||
                                  (akun.jenjang_id === 1 ? "SD" : akun.jenjang_id === 2 ? "SMP" : akun.jenjang_id === 3 ? "SMA" : "-")}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center gap-3">
                            <button
                              onClick={() => setEditAkun(akun)}
                              className="text-amber-500 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition"
                              title="Edit Akun"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(akun.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                              title="Hapus Akun"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-gray-500 italic text-center">
                          {searchTerm ? "Tidak ada data yang sesuai dengan pencarian." : "Tidak ada data akun ditemukan."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Modal Edit */}
          <AnimatePresence>
            {editAkun && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative"
                >
                  <button
                    onClick={() => setEditAkun(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-2 transition"
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <Edit className="text-indigo-600" /> Edit Data Akun
                  </h2>

                  <form onSubmit={handleEditSave}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                          value={editAkun.name}
                          onChange={(e) => setEditAkun({ ...editAkun, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIPY</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                          value={editAkun.nipy}
                          onChange={(e) => setEditAkun({ ...editAkun, nipy: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                          value={editAkun.role}
                          onChange={(e) => {
                            const role = e.target.value;
                            setEditAkun({
                              ...editAkun,
                              role,
                              jenjang_id: role === "superadmin" ? null : editAkun.jenjang_id,
                            });
                          }}
                        >
                          <option value="superadmin">Super Admin</option>
                          <option value="admintu">Admin / TU</option>
                          <option value="guru">Guru</option>
                          <option value="kepala_sekolah">Kepala Sekolah</option>
                          <option value="siswa">Siswa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenjang Sekolah</label>
                        <select
                          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white ${
                            editAkun.role === "superadmin" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                          }`}
                          value={editAkun.role === "superadmin" ? "" : (editAkun.jenjang_id || "")}
                          onChange={(e) => setEditAkun({ ...editAkun, jenjang_id: e.target.value })}
                          disabled={editAkun.role === "superadmin"}
                        >
                          <option value="">
                            {editAkun.role === "superadmin" ? "Semua Jenjang (Superadmin)" : "Pilih Jenjang"}
                          </option>
                          {jenjangList.map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.kode} - {j.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-8 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditAkun(null)}
                        className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md flex items-center gap-2 transition"
                      >
                        <Edit size={18} /> Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}