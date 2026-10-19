import React, { useState, useEffect, useRef } from "react";
import SidebarSuperadmin from "../../components/SidebarSuperadmin";
import api from "../../api";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaSchool,
  FaCalendarAlt,
  FaEnvelope,
  FaDatabase,
  FaSave,
  FaSyncAlt,
  FaUpload,
  FaDownload,
  FaTrash,
  FaCog,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaImage,
  FaGlobe,
  FaLock,
} from "react-icons/fa";

const TAB_LIST = [
  { key: "sekolah", label: "Profil Sekolah", icon: <FaSchool /> },
  { key: "tahunajaran", label: "Tahun Ajaran", icon: <FaCalendarAlt /> },
  { key: "sistem", label: "Sistem", icon: <FaDatabase /> },
];

export default function PengaturanSuperadmin() {
  const [activeTab, setActiveTab] = useState("sekolah");
  const [processing, setProcessing] = useState(false);

  // =========================================================
  // STATE MANAGEMENT
  // =========================================================

  // ── Profil Sekolah ──
  const [sekolah, setSekolah] = useState({
    nama_sekolah: "",
    npsn: "",
    alamat: "",
    kota: "",
    provinsi: "",
    kode_pos: "",
    telepon: "",
    email: "",
    website: "",
    kepala_sekolah: "",
    nip_kepala: "",
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const logoRef = useRef();

  // ── Tahun Ajaran ──
  const [tahunAjaran, setTahunAjaran] = useState([]);
  const [newTahun, setNewTahun] = useState({ tahun: "", semester: "1" });


  // ── Sistem ──
  const [sistemInfo, setSistemInfo] = useState({
    versi_app: "-",
    total_user: 0,
    total_siswa: 0,
    last_backup: "-",
  });

  // =========================================================
  // LIFECYCLE / FETCH DATA
  // =========================================================
  useEffect(() => {
    fetchSekolah();
    fetchTahunAjaran();
    fetchSistemInfo();
  }, []);

  const fetchSekolah = async () => {
    try {
      const res = await api.get("/api/superadmin/pengaturan/sekolah");
      if (res.data?.data) {
        setSekolah({
          nama_sekolah: res.data.data.nama_sekolah || "",
          npsn: res.data.data.npsn || "",
          alamat: res.data.data.alamat || "",
          kota: res.data.data.kota || "",
          provinsi: res.data.data.provinsi || "",
          kode_pos: res.data.data.kode_pos || "",
          telepon: res.data.data.telepon || "",
          email: res.data.data.email || "",
          website: res.data.data.website || "",
          kepala_sekolah: res.data.data.kepala_sekolah || "",
          nip_kepala: res.data.data.nip_kepala || "",
        });

        if (res.data.data.logo_url) {
          setLogoPreview(res.data.data.logo_url);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengambil data sekolah.");
    }
  };

  const fetchTahunAjaran = async () => {
    try {
      const res = await api.get("/api/superadmin/pengaturan/tahun-ajaran");
      setTahunAjaran(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };


  const fetchSistemInfo = async () => {
    try {
      const res = await api.get("/api/superadmin/pengaturan/sistem");
      if (res.data?.data) setSistemInfo(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================================================
  // ACTIONS & HANDLERS
  // =========================================================

  // ── Logo Handler ──
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // ── Save Profil Sekolah ──
  const saveSekolah = async (e) => {
    e.preventDefault();

    if (!sekolah.nama_sekolah?.trim()) {
      toast.error("Nama sekolah wajib diisi!");
      return;
    }

    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append("nama_sekolah", sekolah.nama_sekolah || "");
      formData.append("npsn", sekolah.npsn || "");
      formData.append("alamat", sekolah.alamat || "");
      formData.append("kota", sekolah.kota || "");
      formData.append("provinsi", sekolah.provinsi || "");
      formData.append("kode_pos", sekolah.kode_pos || "");
      formData.append("telepon", sekolah.telepon || "");
      formData.append("email", sekolah.email || "");
      formData.append("website", sekolah.website || "");
      formData.append("kepala_sekolah", sekolah.kepala_sekolah || "");
      formData.append("nip_kepala", sekolah.nip_kepala || "");

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // DEBUG
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await api.post("/api/superadmin/pengaturan/sekolah", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Profil sekolah berhasil disimpan!");
      fetchSekolah();
    } catch (err) {
      console.log(err.response);
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((msg) => {
          toast.error(msg[0]);
        });
      } else {
        toast.error(err.response?.data?.message || "Gagal menyimpan profil sekolah.");
      }
    } finally {
      setProcessing(false);
    }
  };

  // ── Action Tahun Ajaran ──
  const addTahunAjaran = async () => {
    if (!newTahun.tahun?.trim()) return toast.error("Isi tahun ajaran terlebih dahulu!");

    setProcessing(true);
    try {
      await api.post("/api/superadmin/pengaturan/tahun-ajaran", newTahun);
      toast.success("Tahun ajaran ditambahkan!");
      setNewTahun({ tahun: "", semester: "1" });
      fetchTahunAjaran();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menambah tahun ajaran.");
    } finally {
      setProcessing(false);
    }
  };

  const aktivasiTahun = async (id) => {
    try {
      await api.put(`/api/superadmin/pengaturan/tahun-ajaran/${id}/aktifkan`);
      toast.success("Tahun ajaran diaktifkan!");
      fetchTahunAjaran();
    } catch (err) {
      toast.error("Gagal mengaktifkan tahun ajaran.");
    }
  };

  const deleteTahunAjaran = async (id) => {
    if (!window.confirm("Yakin hapus tahun ajaran ini?")) return;
    try {
      await api.delete(`/api/superadmin/pengaturan/tahun-ajaran/${id}`);
      toast.success("Tahun ajaran dihapus!");
      fetchTahunAjaran();
    } catch (err) {
      toast.error("Gagal menghapus tahun ajaran.");
    }
  };

  // ── Action Backup Database ──
  const handleBackup = async () => {
    setProcessing(true);
    try {
      const res = await api.post("/api/superadmin/pengaturan/backup", {}, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_${new Date().toISOString().slice(0, 10)}.sql`;
      a.click();
      toast.success("Backup berhasil diunduh!");
      fetchSistemInfo();
    } catch (err) {
      toast.error("Gagal melakukan backup.");
    } finally {
      setProcessing(false);
    }
  };

  // =========================================================
  // ANIMATION CONFIG
  // =========================================================
  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Toaster position="top-center" />

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 hidden md:block">
        <SidebarSuperadmin />
      </aside>

      {/* CONTENT */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <FaCog className="text-indigo-600" />
              Pengaturan Sistem
            </h1>
            <p className="text-slate-500 mt-1">
              Kelola konfigurasi sekolah, tahun ajaran, dan sistem.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">

            {/* TAB LIST */}
            <div className="md:w-56 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {TAB_LIST.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold transition-all border-b border-slate-100 last:border-0
                    ${activeTab === tab.key
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      {tab.icon}
                      {tab.label}
                    </span>
                    {activeTab === tab.key && <FaChevronRight size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB PANELS CONTAINER */}
            <div className="flex-1">
              <AnimatePresence mode="wait">

                {/* ── PANEL 1: PROFIL SEKOLAH ── */}
                {activeTab === "sekolah" && (
                  <motion.div key="sekolah" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                    <form onSubmit={saveSekolah} className="space-y-6">

                      {/* Logo Section */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <FaImage className="text-indigo-500" />
                          Logo Sekolah
                        </h2>
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              <FaSchool className="text-3xl text-slate-400" />
                            )}
                          </div>
                          <div>
                            <input type="file" accept="image/*" ref={logoRef} className="hidden" onChange={handleLogoChange} />
                            <button
                              type="button"
                              onClick={() => logoRef.current.click()}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
                            >
                              <FaUpload size={14} />
                              Upload Logo
                            </button>
                            <p className="text-xs text-slate-400 mt-2">JPG, PNG, maks. 2MB</p>
                          </div>
                        </div>
                      </div>

                      {/* Main Info Section */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <FaSchool className="text-indigo-500" />
                          Informasi Sekolah
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: "Nama Sekolah", key: "nama_sekolah", full: true },
                            { label: "NPSN", key: "npsn" },
                            { label: "Telepon", key: "telepon" },
                            { label: "Email Sekolah", key: "email" },
                            { label: "Website", key: "website" },
                            { label: "Alamat", key: "alamat", full: true },
                            { label: "Kota", key: "kota" },
                            { label: "Provinsi", key: "provinsi" },
                            { label: "Kode Pos", key: "kode_pos" },
                          ].map(({ label, key, full }) => (
                            <div key={key} className={full ? "md:col-span-2" : ""}>
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {label}
                              </label>
                              <input
                                type="text"
                                value={sekolah[key] || ""}
                                onChange={(e) => setSekolah({ ...sekolah, [key]: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Headmaster Info Section */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <FaLock className="text-indigo-500" />
                          Kepala Sekolah
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Kepala Sekolah</label>
                            <input
                              type="text"
                              value={sekolah.kepala_sekolah || ""}
                              onChange={(e) => setSekolah({ ...sekolah, kepala_sekolah: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">NIP Kepala Sekolah</label>
                            <input
                              type="text"
                              value={sekolah.nip_kepala || ""}
                              onChange={(e) => setSekolah({ ...sekolah, nip_kepala: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={processing}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition disabled:bg-slate-300"
                        >
                          {processing ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
                          Simpan Profil Sekolah
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ── PANEL 2: TAHUN AJARAN ── */}
                {activeTab === "tahunajaran" && (
                  <motion.div key="tahunajaran" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                    {/* Add Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-500" />
                        Tambah Tahun Ajaran
                      </h2>
                      <div className="flex flex-col md:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="Contoh: 2027/2028"
                          value={newTahun.tahun}
                          onChange={(e) => setNewTahun({ ...newTahun, tahun: e.target.value })}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
                        />
                        <select
                          value={newTahun.semester}
                          onChange={(e) => setNewTahun({ ...newTahun, semester: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition"
                        >
                          <option value="1">Semester 1 (Ganjil)</option>
                          <option value="2">Semester 2 (Genap)</option>
                        </select>
                        <button
                          onClick={addTahunAjaran}
                          disabled={processing}
                          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition disabled:bg-slate-300"
                        >
                          {processing ? <FaSyncAlt className="animate-spin" /> : "+ Tambah"}
                        </button>
                      </div>
                    </div>

                    {/* List Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-5 border-b border-slate-100">
                        <h2 className="font-bold text-slate-700">Daftar Tahun Ajaran</h2>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {tahunAjaran.length === 0 && (
                          <div className="py-10 text-center">
                            <p className="text-slate-400 italic">Belum ada data tahun ajaran.</p>
                          </div>
                        )}
                        {tahunAjaran.map((ta) => (
                          <div key={ta.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 hover:bg-slate-50 transition">
                            <div>
                              <p className="font-bold text-slate-800 text-base">{ta.nama}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                                  Semester {ta.semester_aktif}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${ta.status === "dikunci" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                                  {ta.status}
                                </span>
                              </div>
                              {ta.created_at && (
                                <p className="text-xs text-slate-400 mt-2">
                                  Dibuat: {new Date(ta.created_at).toLocaleDateString("id-ID")}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              {ta.aktif ? (
                                <span className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                  <FaCheckCircle size={10} /> Aktif
                                </span>
                              ) : (
                                <button
                                  onClick={() => aktivasiTahun(ta.id)}
                                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition"
                                >
                                  Aktifkan
                                </button>
                              )}
                              {!ta.aktif && (
                                <button
                                  onClick={() => deleteTahunAjaran(ta.id)}
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                  <FaTrash size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── PANEL 4: SISTEM ── */}
                {activeTab === "sistem" && (
                  <motion.div key="sistem" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                    {/* Metadata System */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <FaGlobe className="text-indigo-500" /> Informasi Sistem
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Versi Aplikasi", value: sistemInfo.versi_app },
                          { label: "Total User", value: sistemInfo.total_user },
                          { label: "Total Siswa", value: sistemInfo.total_siswa },
                          { label: "Backup Terakhir", value: sistemInfo.last_backup },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
                            <p className="font-bold text-slate-800 text-sm">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Backup Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <h2 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <FaDatabase className="text-indigo-500" /> Backup Database
                      </h2>
                      <p className="text-sm text-slate-500 mb-4">Unduh backup database dalam format SQL. Simpan di tempat yang aman.</p>
                      <button
                        onClick={handleBackup}
                        disabled={processing}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition disabled:bg-slate-300 shadow-lg shadow-emerald-100"
                      >
                        {processing ? <FaSyncAlt className="animate-spin" /> : <FaDownload />}
                        Download Backup
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
                      <h2 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                        <FaExclamationTriangle /> Zona Berbahaya
                      </h2>
                      <p className="text-sm text-slate-500 mb-4">
                        Tindakan berikut bersifat permanen dan tidak dapat dibatalkan. Lakukan dengan hati-hati.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => toast.error("Fitur ini dinonaktifkan untuk keamanan sistem.")}
                          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-semibold text-sm transition"
                        >
                          <FaTrash /> Reset Data Nilai
                        </button>
                        <button
                          type="button"
                          onClick={() => toast.error("Fitur ini dinonaktifkan untuk keamanan sistem.")}
                          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-semibold text-sm transition"
                        >
                          <FaTrash /> Hapus Cache Sistem
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}