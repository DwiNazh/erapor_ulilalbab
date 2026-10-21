import React, { useEffect, useState } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { kelasAwal, perluKategori, KATEGORI_LABEL } from "../../utils/rombel";
import {
  FaPlus,
  FaTrashAlt,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaSave,
  FaInfoCircle,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";

export default function RombelDanWaliKelasKelas1() {
  const { user } = useAuth();
  const jenjang = user?.jenjang;
  const targetKelas = kelasAwal(jenjang);

  const [tahunTujuan, setTahunTujuan] = useState(null);
  const [rombels, setRombels] = useState([]);
  const [gurus, setGurus] = useState([]);
  const [waliAssignments, setWaliAssignments] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal Tambah Rombel
  const [showAddRombelModal, setShowAddRombelModal] = useState(false);
  const [rombelForm, setRombelForm] = useState({
    tingkat_kelas: String(targetKelas || 1),
    sub_nama: "",
    kategori: "",
  });
  const [rombelError, setRombelError] = useState("");
  const [addingRombel, setAddingRombel] = useState(false);

  const API = "/api/tu";

  useEffect(() => {
    fetchData();
    setRombelForm((prev) => ({
      ...prev,
      tingkat_kelas: String(targetKelas || 1),
      kategori: "",
    }));
  }, [targetKelas]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resAktif = await api.get(`${API}/tahunajaran/aktif`);
      const aktif = resAktif.data?.data;

      const match = aktif?.nama?.match(/^(\d{4})\/(\d{4})$/);
      const targetNama = match
        ? `${parseInt(match[1]) + 1}/${parseInt(match[2]) + 1}`
        : "";

      const resAll = await api.get(`${API}/tahunajaran`);
      const all = resAll.data?.data || [];
      const target = all.find((t) => t.nama === targetNama) || all[0];

      setTahunTujuan(target);

      const [rombelRes, guruRes] = await Promise.all([
        api.get(`${API}/rombel`, {
          params: { tahun_ajaran_id: target.id, kelas: targetKelas },
        }),
        api.get(`${API}/guru`),
      ]);

      const rombelData = rombelRes.data?.data || [];
      setRombels(rombelData);
      setGurus(guruRes.data?.data || []);

      const map = {};
      rombelData.forEach((r) => {
        if (r.guru_id) {
          map[r.id] = r.guru_id;
        }
      });
      setWaliAssignments(map);
    } catch (err) {
      console.error(err);
      toast.error("Gagal load data");
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async (id) => {
    if (!window.confirm("Yakin hapus rombel ini? Semua data penempatan di dalamnya akan hilang.")) return;
    try {
      await api.delete(`${API}/rombel/${id}`);
      toast.success("Rombel berhasil dihapus");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal hapus rombel");
    }
  };

  const handleChange = (id, guruId) => {
    setWaliAssignments((prev) => ({
      ...prev,
      [id]: guruId,
    }));
  };

  const handleSimpan = async () => {
    try {
      await api.post(`${API}/wali-kelas/siswa-baru`, {
        tahun_ajaran_id: tahunTujuan.id,
        kelas: targetKelas,
        wali_kelas: waliAssignments,
      });
      toast.success("Berhasil simpan wali kelas");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal simpan");
    }
  };

  // Tambah rombel
  const handleTambahRombel = async (e) => {
    e.preventDefault();
    setAddingRombel(true);
    setRombelError("");

    const subNamaList = rombelForm.sub_nama
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    if (subNamaList.length === 0) {
      setAddingRombel(false);
      setRombelError("Sub nama tidak boleh kosong.");
      return;
    }

    if (subNamaList.some((s) => s.length > 1)) {
      setAddingRombel(false);
      setRombelError("Setiap sub nama hanya boleh 1 huruf. Pisahkan dengan koma, contoh: A, B, C");
      return;
    }

    const butuhGender = perluKategori(targetKelas);
    if (butuhGender && !rombelForm.kategori) {
      setAddingRombel(false);
      setRombelError("Pilih Ikhwan, Akhwat, atau keduanya untuk kelas 4 ke atas.");
      return;
    }

    const daftarGender = !butuhGender
      ? [null]
      : rombelForm.kategori === "keduanya"
        ? ["ikhwan", "akhwat"]
        : [rombelForm.kategori];

    const tugas = [];
    subNamaList.forEach((sub) => {
      daftarGender.forEach((g) => {
        const payload = {
          tahun_ajaran_id: tahunTujuan.id,
          tingkat_kelas: Number(targetKelas),
          sub_nama: sub.toUpperCase(),
        };
        if (g) payload.kategori = g;
        tugas.push(api.post(`${API}/rombel`, payload));
      });
    });

    try {
      const hasil = await Promise.allSettled(tugas);
      const gagal = hasil.filter((h) => h.status === "rejected");
      const berhasil = hasil.length - gagal.length;

      if (berhasil > 0) {
        toast.success(`Berhasil menambahkan ${berhasil} rombel`);
        fetchData();
      }

      if (gagal.length > 0) {
        setRombelError(
          gagal[0].reason?.response?.data?.message || "Gagal tambah rombel"
        );
      } else {
        setShowAddRombelModal(false);
        setRombelForm({ tingkat_kelas: String(targetKelas || 1), sub_nama: "", kategori: "" });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal tambah rombel");
    } finally {
      setAddingRombel(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat Data...</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Manajemen Rombel & Wali Kelas
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-bold uppercase tracking-wider">
                  Kelas {targetKelas}
                </span>
                <span className="text-slate-400 text-sm">Target TA:</span>
                <span className="text-emerald-600 font-bold text-sm underline decoration-emerald-200 underline-offset-4">
                  {tahunTujuan?.nama}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-100">
              <FaInfoCircle />
              <span>Gunakan halaman ini untuk menyiapkan kelas bagi siswa baru.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: ROMBEL */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="font-bold text-slate-700 flex items-center gap-2">
                    <FaDoorOpen className="text-indigo-500" /> Daftar Rombel
                  </h2>

                  <button
                    onClick={() => setShowAddRombelModal(true)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md shadow-indigo-100"
                    title="Tambah Rombel"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>

                <div className="p-5">
                  {rombels.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-sm italic">
                        Belum ada rombel yang dibuat
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {rombels.map((r) => (
                        <div
                          key={r.id}
                          className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 group hover:border-indigo-200 transition-all"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-400 block uppercase">
                              Sub Kelas
                            </span>
                            <span className="font-bold text-slate-700 text-lg flex items-center gap-2">
                              {r.nama_rombel || `${r.tingkat_kelas || targetKelas}${r.sub_nama}`}
                              {r.kelompok_gender && r.kelompok_gender !== "campuran" && (
                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                  r.kelompok_gender === "ikhwan" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                                }`}>
                                  {r.kelompok_gender}
                                </span>
                              )}
                            </span>
                          </div>

                          <button
                            onClick={() => handleHapus(r.id)}
                            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: WALI KELAS */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="font-bold text-slate-700 flex items-center gap-2">
                    <FaChalkboardTeacher className="text-indigo-500" /> Penetapan Wali Kelas
                  </h2>
                </div>

                <div className="p-6 flex-1">
                  {rombels.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-center">
                      <FaDoorOpen size={32} className="mb-2 opacity-20" />
                      <p className="text-sm">
                        Buat rombel terlebih dahulu untuk <br /> menetapkan wali kelas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {rombels.map((r) => (
                        <div
                          key={r.id}
                          className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-dashed border-slate-200 rounded-xl"
                        >
                          <div className="min-w-[120px]">
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                              {r.nama_rombel || `Kelas ${r.tingkat_kelas || targetKelas}${r.sub_nama}`}
                            </span>
                          </div>

                          <div className="flex-1">
                            <select
                              value={waliAssignments[r.id] || ""}
                              onChange={(e) => handleChange(r.id, e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition-all"
                            >
                              <option value="">-- Pilih Wali Kelas --</option>
                              {gurus.map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {rombels.length > 0 && (
                  <div className="p-5 bg-slate-50 border-t border-slate-100 text-right">
                    <button
                      onClick={handleSimpan}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                    >
                      <FaSave /> Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MODAL TAMBAH ROMBEL */}
          {showAddRombelModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FaDoorOpen /> Tambah Rombel
                  </h3>
                  <button
                    onClick={() => setShowAddRombelModal(false)}
                    className="text-indigo-200 hover:text-white transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <form onSubmit={handleTambahRombel} className="p-8 space-y-5">
                  {rombelError && (
                    <div className="p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100">
                      {rombelError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Tingkat Kelas
                    </label>
                    <select
                      value={rombelForm.tingkat_kelas}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 font-bold cursor-not-allowed"
                    >
                      <option value={targetKelas}>Kelas {targetKelas}</option>
                    </select>
                  </div>

                  {perluKategori(targetKelas) && (
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Kelompok
                      </label>
                      <select
                        value={rombelForm.kategori}
                        onChange={(e) =>
                          setRombelForm({
                            ...rombelForm,
                            kategori: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-700"
                        required
                      >
                        <option value="">-- Pilih Kelompok --</option>
                        <option value="ikhwan">Ikhwan</option>
                        <option value="akhwat">Akhwat</option>
                        <option value="keduanya">
                          Ikhwan & Akhwat (buat dua rombel)
                        </option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Sub Nama
                    </label>
                    <input
                      value={rombelForm.sub_nama}
                      onChange={(e) =>
                        setRombelForm({
                          ...rombelForm,
                          sub_nama: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="Contoh: A, B, C"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-2">
                      Gunakan koma untuk menambah banyak rombel sekaligus.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddRombelModal(false)}
                      className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={addingRombel}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:bg-slate-300 flex items-center justify-center gap-2"
                    >
                      {addingRombel ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaPlus />
                      )}{" "}
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}