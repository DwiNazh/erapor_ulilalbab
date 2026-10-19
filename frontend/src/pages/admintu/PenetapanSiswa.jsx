import React, { useEffect, useState } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";
import api from "../../api";
import {
  FaUserFriends,
  FaSearch,
  FaPlus,
  FaCheckDouble,
  FaUserCheck,
  FaDoorOpen,
  FaTimes,
  FaSyncAlt,
  FaInfoCircle,
} from "react-icons/fa";
import {
  perluKategori,
  labelRombel,
  KATEGORI_LABEL,
  kategoriRombel,
  daftarKelas,
} from "../../utils/rombel";

const JENJANG_HALAMAN = "SD";

export default function PenempatanSiswa() {
  const [rombelOptions, setRombelOptions] = useState([]);
  const [selectedRombel, setSelectedRombel] = useState("");
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [tahunAktif, setTahunAktif] = useState(null);
  const [tahunTujuan, setTahunTujuan] = useState(null);
  const [showAddRombelModal, setShowAddRombelModal] = useState(false);
  const [rombelForm, setRombelForm] = useState({
    tingkat_kelas: "",
    sub_nama: "",
    kategori: "",
  });
  const [rombelError, setRombelError] = useState("");
  const [addingRombel, setAddingRombel] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  const API = "/api/tu";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const resAktif = await api.get(`${API}/tahunajaran/aktif`);
      const aktif = resAktif.data?.data;
      if (!aktif) {
        toast.error("Tidak ada tahun ajaran aktif");
        return;
      }
      setTahunAktif(aktif);
      setIsFinalized(
        !!aktif?.finalized_at || !!aktif?.kenaikan_kelas_finalized_at,
      );

      const match = aktif.nama.match(/^(\d{4})\/(\d{4})$/);
      const targetNama = match
        ? `${parseInt(match[1]) + 1}/${parseInt(match[2]) + 1}`
        : "";

      const resAll = await api.get(`${API}/tahunajaran`);
      const allTahun = resAll.data?.data || [];
      const target = allTahun.find((t) => t.nama === targetNama);

      if (!target) {
        toast.error(`Tahun target ${targetNama} belum dibuat.`);
        return;
      }

      setTahunTujuan(target);
      await Promise.all([loadRombel(target.id), loadSiswa(target.id)]);
    } catch (err) {
      toast.error("Gagal sinkronisasi data");
    } finally {
      setLoading(false);
    }
  };

  const loadRombel = async (tahunId) => {
    try {
      const res = await api.get(`${API}/rombel`, {
        params: { tahun_ajaran_id: tahunId },
      });
      const rombels = res.data?.data || [];
      const rombelsWithCount = await Promise.all(
        rombels.map(async (r) => {
          const countRes = await api.get(`${API}/rombel/${r.id}/count`);
          return { ...r, current_count: countRes.data?.current_count || 0 };
        }),
      );
      setRombelOptions(rombelsWithCount);
    } catch (err) {
      toast.error("Gagal load rombel");
    }
  };

  const loadSiswa = async (tahunId) => {
    try {
      const res = await api.get(
        `${API}/penempatan-siswa/siswa-belum-terdaftar`,
        {
          params: {
            tahun_ajaran_id: tahunId,
            search: search.trim() || undefined,
          },
        },
      );
      setSiswaList(res.data?.data || []);
    } catch (err) {
      toast.error("Gagal load siswa");
    }
  };

  useEffect(() => {
    if (tahunTujuan?.id) loadSiswa(tahunTujuan.id);
  }, [search, tahunTujuan?.id]);

  const toggleSelect = (id) => {
    setSelectedSiswa((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectTopTen = () => {
    const available = siswaTampil.filter((s) => !selectedSiswa.includes(s.id));
    if (available.length === 0) return toast.error("Semua sudah terpilih");
    const nextTen = available.slice(0, 10).map((s) => s.id);
    setSelectedSiswa([...selectedSiswa, ...nextTen]);
  };

  const handleTempatkan = async () => {
    if (selectedSiswa.length === 0 || !selectedRombel) return;
    setProcessing(true);
    try {
      const res = await api.post(`${API}/penempatan-siswa/tempatkan`, {
        tahun_ajaran_id: tahunTujuan.id,
        rombel_id: selectedRombel,
        siswa_ids: selectedSiswa,
      });
      toast.success(
        res.data?.message ||
          `${selectedSiswa.length} siswa berhasil ditempatkan`,
      );
      setSelectedSiswa([]);
      // Await refresh agar UI langsung ter-update
      await Promise.all([
        loadRombel(tahunTujuan.id),
        loadSiswa(tahunTujuan.id),
      ]);
    } catch (err) {
      const d = err.response?.data;
      const nama = d?.siswa_ditolak?.map((s) => s.nama).join(", ");
      toast.error(
        (d?.message || "Gagal menempatkan siswa") +
          (nama ? ` Siswa: ${nama}` : ""),
        { duration: 6000 },
      );
    } finally {
      setProcessing(false);
    }
  };

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
      setRombelError(
        "Setiap sub nama hanya boleh 1 huruf. Pisahkan dengan koma, contoh: A, B, C",
      );
      return;
    }

    const butuhGender = perluKategori(rombelForm.tingkat_kelas);
    if (butuhGender && !rombelForm.kategori) {
      setAddingRombel(false);
      setRombelError(
        "Pilih Ikhwan, Akhwat, atau keduanya untuk kelas 4 ke atas.",
      );
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
          tingkat_kelas: Number(rombelForm.tingkat_kelas),
          sub_nama: sub.toUpperCase(),
        };
        if (g) payload.kategori = g;
        tugas.push(api.post(`${API}/rombel`, payload));
      });
    });

    const hasil = await Promise.allSettled(tugas);
    const gagal = hasil.filter((h) => h.status === "rejected");
    const berhasil = hasil.length - gagal.length;

    if (berhasil > 0) {
      toast.success(`Berhasil menambahkan ${berhasil} rombel`);
      loadRombel(tahunTujuan.id);
    }

    if (gagal.length > 0) {
      setRombelError(
        gagal[0].reason?.response?.data?.message || "Gagal tambah rombel",
      );
    } else {
      setShowAddRombelModal(false);
      setRombelForm({ tingkat_kelas: "", sub_nama: "", kategori: "" });
    }
    setAddingRombel(false);
  };

  useEffect(() => {
    setSelectedSiswa([]);
  }, [selectedRombel]);

  const rombelDipilih = rombelOptions.find(
    (r) => String(r.id) === String(selectedRombel),
  );
  const kategoriWajib = kategoriRombel(rombelDipilih);

  const siswaTampil = kategoriWajib
    ? siswaList.filter((s) => s.kategori === kategoriWajib)
    : siswaList;

  const jumlahTanpaKategori = siswaList.filter((s) => !s.kategori).length;

  // Loading State - Modern Skeleton
  if (loading)
    return (
      <div className="flex min-h-screen bg-slate-50">
        <SidebarAdminTu />
        <div className="flex-1 p-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <SidebarAdminTu />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaUserFriends className="text-indigo-600" /> Penempatan Siswa
              </h1>
              <p className="text-slate-500 mt-1">
                Persiapan Tahun Ajaran:{" "}
                <span className="font-bold text-emerald-600">
                  {tahunTujuan?.nama}
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchInitialData}
                className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
                title="Refresh Data"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
              </button>
              <button
                onClick={() => setShowAddRombelModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
              >
                <FaPlus /> Tambah Rombel
              </button>
            </div>
          </div>

          {isFinalized ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center shadow-sm">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserCheck size={40} />
              </div>
              <h2 className="text-2xl font-bold text-emerald-800">
                Proses Selesai
              </h2>
              <p className="text-emerald-600 mt-2">
                Data penempatan tahun ini telah difinalisasi dan dikunci.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT: CONTROLS & SELECTION */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <FaDoorOpen className="text-indigo-500" /> Konfigurasi
                    Tujuan
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Pilih Rombel
                      </label>
                      <select
                        value={selectedRombel}
                        onChange={(e) => setSelectedRombel(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-slate-700"
                      >
                        <option value="">-- Pilih Rombel Tujuan --</option>
                        {rombelOptions
                          .filter(
                            (r) => Number(r.tingkat_kelas || r.kelas) >= 1,
                          )
                          .map((r) => (
                            <option key={r.id} value={r.id}>
                              Kelas {labelRombel(r)} (Isi: {r.current_count})
                            </option>
                          ))}
                      </select>
                      {kategoriWajib && (
                        <p className="text-xs text-indigo-600 mt-2">
                          Rombel {KATEGORI_LABEL[kategoriWajib]}: hanya siswa{" "}
                          {KATEGORI_LABEL[kategoriWajib]} yang ditampilkan.
                        </p>
                      )}
                      {kategoriWajib && jumlahTanpaKategori > 0 && (
                        <div className="mt-3 p-3 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-100">
                          {jumlahTanpaKategori} siswa belum diisi kategori
                          Ikhwan/Akhwat dan tidak muncul di daftar. Isi dulu di
                          menu Data Siswa.
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <div className="flex gap-2 text-indigo-700 font-bold text-sm mb-1">
                        <FaInfoCircle className="mt-0.5" /> Info Kapasitas
                      </div>
                      <p className="text-xs text-indigo-600 leading-relaxed">
                        Siswa yang dipilih di sebelah kanan akan dimasukkan ke
                        rombel yang Anda pilih di atas.
                      </p>
                    </div>

                    <button
                      onClick={handleTempatkan}
                      disabled={
                        processing ||
                        !selectedRombel ||
                        selectedSiswa.length === 0
                      }
                      className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <FaSyncAlt className="animate-spin" />
                      ) : (
                        <FaUserCheck />
                      )}
                      Tempatkan{" "}
                      {selectedSiswa.length > 0 && `(${selectedSiswa.length})`}
                    </button>
                  </div>
                </div>

                {selectedSiswa.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-400 border border-slate-200">
                    <p className="text-sm font-medium text-slate-600">
                      Terpilih:{" "}
                      <span className="font-bold text-slate-900">
                        {selectedSiswa.length} Siswa
                      </span>
                    </p>
                    <button
                      onClick={() => setSelectedSiswa([])}
                      className="text-xs text-rose-500 font-bold mt-2 hover:underline"
                    >
                      Batalkan semua pilihan
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT: STUDENT LIST */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                  <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                    <div className="relative w-full md:w-72">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari Nama / NIS..."
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm shadow-sm"
                      />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button
                        onClick={selectTopTen}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all"
                      >
                        <FaCheckDouble size={12} /> +10 Siswa
                      </button>
                      <button
                        onClick={() => {
                          const allIds = siswaTampil.map((s) => s.id);
                          setSelectedSiswa(
                            selectedSiswa.length === allIds.length
                              ? []
                              : allIds,
                          );
                        }}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                      >
                        {selectedSiswa.length === siswaTampil.length
                          ? "Batal Semua"
                          : "Pilih Semua"}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {siswaTampil.length === 0 ? (
                      <div className="p-20 text-center text-slate-400">
                        <FaUserFriends
                          size={48}
                          className="mx-auto mb-4 opacity-20"
                        />
                        <p className="font-medium">
                          {kategoriWajib
                            ? `Tidak ada siswa ${KATEGORI_LABEL[kategoriWajib]} yang belum ditempatkan`
                            : "Tidak ada data siswa ditemukan"}
                        </p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                            <th className="px-6 py-4 w-16 text-center sticky top-0 bg-white shadow-sm">
                              Pilih
                            </th>
                            <th className="px-6 py-4 sticky top-0 bg-white shadow-sm">Nama Lengkap</th>
                            <th className="px-6 py-4 sticky top-0 bg-white shadow-sm">NIS</th>
                            <th className="px-6 py-4 text-center sticky top-0 bg-white shadow-sm">Kategori</th>
                            <th className="px-6 py-4 text-center sticky top-0 bg-white shadow-sm">
                              Kelas Sebelumnya
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {siswaTampil.map((s) => (
                            <tr
                              key={s.id}
                              onClick={() => toggleSelect(s.id)}
                              className={`group cursor-pointer transition-colors ${
                                selectedSiswa.includes(s.id)
                                  ? "bg-indigo-50/50"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <td className="px-6 py-4 text-center">
                                <div
                                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                    selectedSiswa.includes(s.id)
                                      ? "bg-indigo-600 border-indigo-600 text-white"
                                      : "border-slate-200 bg-white group-hover:border-indigo-400"
                                  }`}
                                >
                                  {selectedSiswa.includes(s.id) && (
                                    <FaUserCheck size={12} />
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`font-bold transition-colors ${
                                    selectedSiswa.includes(s.id)
                                      ? "text-indigo-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {s.nama}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-slate-600">
                                {s.nis || "---"}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {s.kategori === "ikhwan" ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                                    Ikhwan
                                  </span>
                                ) : s.kategori === "akhwat" ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold">
                                    Akhwat
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-300 italic">—</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                {s.kelas_sebelumnya ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                                    Kelas {s.kelas_sebelumnya}
                                  </span>
                                ) : (
                                  <span className="text-xs text-slate-300 italic">
                                    Siswa Baru
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
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
                    onChange={(e) =>
                      setRombelForm({
                        ...rombelForm,
                        tingkat_kelas: e.target.value,
                        kategori: "",
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  >
                    <option value="">Pilih tingkat</option>
                    {daftarKelas(JENJANG_HALAMAN).map((i) => (
                      <option key={i} value={i}>Kelas {i}</option>
                    ))}
                  </select>
                </div>

                {perluKategori(rombelForm.tingkat_kelas) && (
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    >
                      <option value="">Pilih</option>
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
      </main>
    </div>
  );
}
