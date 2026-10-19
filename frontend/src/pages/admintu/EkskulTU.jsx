import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import Footer from "../../components/footer";
import api from "../../api";
import toast from "react-hot-toast";

import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaSchool,
  FaCheckCircle,
} from "react-icons/fa";

export default function EkskulTU() {
  const [ekskul, setEkskul] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    wajib: 0,
  });

  const [editId, setEditId] = useState(null);

  const API_BASE_URL = "/api/tu/ekskul";

  useEffect(() => {
    fetchEkskul();
  }, []);

  // ================= FETCH =================
  const fetchEkskul = async () => {
    try {
      setLoading(true);

      const res = await api.get(API_BASE_URL);

      setEkskul(res.data.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Gagal mengambil data ekskul");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setFormData({
      nama: "",
      wajib: 0,
    });

    setEditId(null);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      toast.error("Nama ekskul wajib diisi");
      return;
    }

    try {
      const payload = {
        nama: formData.nama,
        wajib: Number(formData.wajib),
      };

      if (editId) {
        await api.put(
          `${API_BASE_URL}/${editId}`,
          payload
        );

        toast.success("Ekskul berhasil diperbarui");
      } else {
        await api.post(API_BASE_URL, payload);

        toast.success("Ekskul berhasil ditambahkan");
      }

      fetchEkskul();

      setShowModal(false);

      resetForm();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan");
      }
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {
    setFormData({
      nama: item.nama || "",
      wajib: Number(item.wajib),
    });

    setEditId(item.id);

    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus ekskul ini?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`${API_BASE_URL}/${id}`);

      toast.success("Ekskul berhasil dihapus");

      fetchEkskul();
    } catch (error) {
      console.error(error);

      toast.error("Gagal menghapus ekskul");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <SidebarAdminTu />

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">
              <div>
                <h1 className="text-3xl font-black text-slate-800">
                  Manajemen Ekskul
                </h1>

                <p className="text-slate-500 mt-2">
                  Kelola daftar ekstrakurikuler sekolah.
                </p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center gap-3"
              >
                <FaPlus />
                Tambah Ekskul
              </button>
            </div>

            {/* CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl mb-10"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FaSchool size={28} />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Total Ekskul
                  </h2>

                  <p className="text-emerald-100 mt-1">
                    Saat ini terdapat{" "}
                    <span className="font-bold">
                      {ekskul.length}
                    </span>{" "}
                    ekstrakurikuler tersedia.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-slate-50">
                <h2 className="font-bold text-slate-700 text-lg">
                  Daftar Ekstrakurikuler
                </h2>
              </div>

              {loading ? (
                <div className="p-10 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <th className="p-4 text-center w-16">
                          No
                        </th>

                        <th className="p-4 text-left">
                          Nama Ekskul
                        </th>

                        <th className="p-4 text-center">
                          Status
                        </th>

                        <th className="p-4 text-center">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {ekskul.length > 0 ? (
                        ekskul.map((item, index) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50 transition-all"
                          >
                            <td className="p-4 text-center text-slate-400">
                              {index + 1}
                            </td>

                            <td className="p-4 font-bold text-slate-700">
                              {item.nama}
                            </td>

                            <td className="p-4 text-center">
                              {Number(item.wajib) === 1 ? (
                                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold">
                                  <FaCheckCircle />
                                  Wajib
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold">
                                  Pilihan
                                </span>
                              )}
                            </td>

                            <td className="p-4">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 hover:scale-105 transition-all flex items-center justify-center"
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 hover:scale-105 transition-all flex items-center justify-center"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-10 text-center text-slate-400"
                          >
                            Belum ada data ekskul.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-black text-slate-800">
                    {editId
                      ? "Edit Ekskul"
                      : "Tambah Ekskul"}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Kelola data ekstrakurikuler sekolah
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <FaTimes />
                </button>
              </div>

              {/* BODY */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >
                {/* NAMA */}
                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-700">
                    Nama Ekskul
                  </label>

                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nama: e.target.value,
                      })
                    }
                    placeholder="Contoh: Pramuka"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="block mb-2 text-sm font-bold text-slate-700">
                    Jenis Ekskul
                  </label>

                  <select
                    value={formData.wajib}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        wajib: Number(e.target.value),
                      })
                    }
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={0}>
                      Pilihan
                    </option>

                    <option value={1}>
                      Wajib
                    </option>
                  </select>
                </div>

                {/* BUTTON */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg transition-all"
                  >
                    {editId
                      ? "Update Ekskul"
                      : "Simpan Ekskul"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}