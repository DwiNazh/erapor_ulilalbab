import React, { useState, useEffect } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import Footer from "../../components/footer";
import { FaChalkboardTeacher, FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../api";

export default function PenugasanGuru() {
  // ================================
  // STATE DATA UTAMA
  // ================================
  const [penugasan, setPenugasan] = useState([]);
  const [guruList, setGuruList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [rombelList, setRombelList] = useState([]); // UBAH: kelasList -> rombelList

  // ================================
  // STATE LOADING
  // ================================
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // ================================
  // FORM INPUT
  // ================================
  const [formData, setFormData] = useState({
    guru_id: "",
    mapel_id: "",
    rombel_id: "", // UBAH: kelas -> rombel_id
    tahun_ajaran_id: 34, 
  });

  // ================================
  // LOAD DATA PERTAMA KALI
  // ================================
  useEffect(() => {
    loadAllData();
  }, []);

  // ================================
  // FUNCTION AMBIL SEMUA DATA
  // ================================
  const loadAllData = async () => {
    setLoading(true);

    try {
      const [resPenugasan, resGuru, resMapel, resRombel] = await Promise.all([
        api.get("/api/tu/penugasan-guru"),
        api.get("/api/tu/guru"),
        api.get("/api/tu/mata-pelajaran"),
        api.get("/api/tu/rombel"), // UBAH: endpoint api kelas -> rombel
      ]);

      setPenugasan(resPenugasan.data?.data || []);
      setGuruList(resGuru.data?.data || []);
      setMapelList(resMapel.data?.data || []);
      setRombelList(resRombel.data?.data || []); // UBAH state
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data penugasan guru");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // HANDLE INPUT FORM
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // HANDLE SUBMIT TAMBAH PENUGASAN
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // UBAH: Validasi ngecek rombel_id, bukan kelas
    if (!formData.guru_id || !formData.mapel_id || !formData.rombel_id) {
      toast.error("Semua data harus dipilih!");
      return;
    }

    setLoadingSubmit(true);

    try {
      // Mengirim formData yang berisi (guru_id, mapel_id, rombel_id, tahun_ajaran_id)
      await api.post("/api/tu/penugasan-guru", formData);

      toast.success("Penugasan guru berhasil ditambahkan");

      // reset form
      setFormData({
        guru_id: "",
        mapel_id: "",
        rombel_id: "", // Reset ke kosong
        tahun_ajaran_id: 34, 
      });

      // refresh data
      loadAllData();
    } catch (error) {
      console.error(error);
      // Agar lebih mudah di-debug, tampilkan pesan error asli dari backend jika ada
      const errorMsg = error.response?.data?.message || "Gagal menambahkan penugasan";
      toast.error(errorMsg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ================================
  // HANDLE DELETE PENUGASAN
  // ================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus penugasan ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/tu/penugasan-guru/${id}`);
      toast.success("Penugasan berhasil dihapus");
      loadAllData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus penugasan");
    }
  };

  // ================================
  // TAMPILAN LOADING
  // ================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Memuat data penugasan guru...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100">
      <div className="flex flex-1">
        <SidebarAdminTu />

        <main className="flex-1 p-8">
          {/* ================================
              HEADER
          ================================ */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FaChalkboardTeacher className="text-indigo-600" />
              Penugasan Guru
            </h1>
            <p className="text-gray-600 mt-2">
              Atur guru mengajar mata pelajaran tertentu di rombongan belajar tertentu.
            </p>
          </div>

          {/* ================================
              FORM INPUT PENUGASAN
          ================================ */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-xl font-semibold mb-6">
              Form Tambah Penugasan Guru
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Pilih Guru */}
              <select
                name="guru_id"
                value={formData.guru_id}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Pilih Guru</option>
                {guruList.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              {/* Pilih Mapel */}
              <select
                name="mapel_id"
                value={formData.mapel_id}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Pilih Mata Pelajaran</option>
                {mapelList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama_mapel}
                  </option>
                ))}
              </select>

              {/* Pilih Rombel (UBAH name menjadi rombel_id) */}
              <select
                name="rombel_id"
                value={formData.rombel_id}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Pilih Rombel / Kelas</option>
                {rombelList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {/* PERBAIKAN: Menggunakan tingkat_kelas dan sub_nama dari DB */}
                    Kelas {r.tingkat_kelas} {r.sub_nama}
                  </option>
                ))}
              </select>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={loadingSubmit}
                className={`${
                  loadingSubmit
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition`}
              >
                <FaPlus />
                {loadingSubmit ? "Menyimpan..." : "Tambah"}
              </button>
            </form>
          </div>

          {/* ================================
              TABEL DATA PENUGASAN
          ================================ */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Daftar Penugasan Guru</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">No</th>
                    <th className="px-6 py-4 text-left">Nama Guru</th>
                    <th className="px-6 py-4 text-left">Mata Pelajaran</th>
                    <th className="px-6 py-4 text-left">Kelas (Rombel)</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {penugasan.length > 0 ? (
                    penugasan.map((p, index) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4 font-medium">
                          {p.guru?.name || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {p.mapel?.nama || '-'}
                        </td>
                        {/* UBAH: Ambil data dari relasi rombel */}
                        <td className="px-6 py-4">
                           {p.rombel ? `Kelas ${p.rombel.tingkat_kelas} ${p.rombel.sub_nama}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 hover:text-red-700 transition p-2"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-gray-500"
                      >
                        Belum ada penugasan guru
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}