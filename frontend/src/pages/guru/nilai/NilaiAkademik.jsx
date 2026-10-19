import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import GuruLayout from "../../../layouts/GuruLayout";
import {
  FaSave,
  FaSearch,
  FaChevronLeft,
  FaSyncAlt,
  FaInfoCircle,
  FaFileSignature,
  FaUserEdit,
  FaBook,
} from "react-icons/fa";

export default function NilaiAkademik() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(""); // "" | "guruKelas" | "guruBidang"
  const [rombel, setRombel] = useState(null);
  const [mapelList, setMapelList] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState(null);
  const [semester, setSemester] = useState("1");
  const [tahunAktif, setTahunAktif] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataNilai, setDataNilai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNilai, setLoadingNilai] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [templateIntrakurikuler, setTemplateIntrakurikuler] = useState([]);

  // Proteksi akses ditangani oleh ProtectedRoute — tidak perlu guard inline di sini

  // ============================
  // FETCH TEMPLATE DESKRIPSI INTRAKURIKULER
  // ============================
  const fetchTemplateIntrakurikuler = async () => {
    try {
      const res = await api.get("/api/guru/template-deskripsi/intrakurikuler");
      if (res.data.success) {
        setTemplateIntrakurikuler(res.data.data || []);
      }
    } catch (err) {
      console.error("Gagal memuat template intrakurikuler", err);
    }
  };

  const fetchDataAwal = async () => {
    setLoading(true);
    try {
      const [resRombel, resTahun] = await Promise.all([
        api.get("/api/guru/rombel"),
        api.get("/api/guru/tahunajaran/aktif"),
      ]);

      const rombelData = resRombel.data.data?.[0] || null;
      if (!rombelData) {
        toast.error("Anda belum ditugaskan di rombel manapun");
      }

      setRombel(rombelData);
      setTahunAktif(resTahun.data?.data || null);
      fetchTemplateIntrakurikuler();
    } catch (err) {
      toast.error("Gagal memuat data akademik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAwal();
  }, []);

  useEffect(() => {
    if (!rombel || !mode) return;
    fetchMapel();
  }, [rombel, mode]);

  // FIX UTAMA: fetchMapel
  // ============================
  const fetchMapel = async () => {
    try {
      if (mode === "guruKelas") {
        const res = await api.get("/api/guru/absensi/mapel-diampu", {
          params: { rombel_id: rombel.id },
        });

        const semua = res.data.data || [];

        let filtered = semua.filter(
          (m) => (m.jenis || "").toLowerCase() === "wajib"
        );

        if (filtered.length === 0 && semua.length > 0) {
          console.warn(
            "[guruKelas] field 'jenis' tidak ditemukan pada data mapel, fallback menampilkan semua mapel diampu"
          );
          filtered = semua;
        }

        setMapelList(filtered);
        if (filtered.length > 0) setSelectedMapel(filtered[0]);
        else toast.error("Tidak ada mata pelajaran wajib yang ditemukan");

      } else if (mode === "guruBidang") {
        // =====================================================
        // FIX BARU: Ambil semua mapel yang BUKAN berjenis 'wajib'
        // agar mapel Pilihan, Mulok, Keagamaan, atau yang kosong tetap muncul
        // =====================================================
        let uniqueMapel = [];

        try {
          const res = await api.get(`/api/guru/penugasan-rombel/${rombel.id}`);
          const data = res.data.data || [];

          console.log("DATA PENUGASAN:", data);
          const seen = new Set();

          uniqueMapel = data
          .map((p) => ({
            id: p.mapel?.id || p.mapel_id,
            nama: p.mapel?.nama || p.nama_mapel,
            kode: p.mapel?.kode || "",
            jenis: p.mapel?.jenis || "",
          }))
          .filter((m) => {
            if (!m.id || seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          })
          .filter((m) => {
            const jenis = (m.jenis || "").toLowerCase();

            // Guru Bidang hanya tampil selain wajib
            return jenis !== "wajib";
          })
          .sort((a, b) => a.nama.localeCompare(b.nama));

          console.log("[guruBidang] uniqueMapel hasil filter:", uniqueMapel);
        } catch (penugasanErr) {
          console.warn(
            "Gagal ambil dari penugasan-rombel, fallback ke mapel-diampu:",
            penugasanErr
          );
        }

        // Fallback: Jika penugasan kosong, ambil dari mapel-diampu lalu singkirkan yang 'wajib'
        if (uniqueMapel.length === 0) {
          console.warn(
            "[guruBidang] penugasan kosong, fallback ke /api/guru/absensi/mapel-diampu"
          );
          try {
            const resFallback = await api.get(
              "/api/guru/absensi/mapel-diampu",
              { params: { rombel_id: rombel.id } }
            );

            const seen = new Set();
            uniqueMapel = (resFallback.data.data || [])
              .map((m) => ({
                id: m.id,
                nama: m.nama || `Mapel ${m.id}`,
                kode: m.kode || "",
                jenis: m.jenis || "",
              }))
              .filter((m) => {
                if (!m.id || seen.has(m.id)) return false;
                seen.add(m.id);
                return true;
              })
              // Tetap singkirkan yang 'wajib' pada data fallback
              .filter((m) => (m.jenis || "").toLowerCase() !== "wajib")
              .sort((a, b) => a.nama.localeCompare(b.nama));

            console.log("[guruBidang] fallback mapel hasil filter:", uniqueMapel);
          } catch (fallbackErr) {
            console.error("Fallback juga gagal:", fallbackErr);
            toast.error("Gagal memuat daftar mata pelajaran");
          }
        }

        setMapelList(uniqueMapel);
        if (uniqueMapel.length > 0) {
          setSelectedMapel(uniqueMapel[0]);
        } else {
          setSelectedMapel(null);
          toast.error("Tidak ada mata pelajaran bidang studi yang ditemukan untuk rombel ini");
        }
      }
    } catch (err) {
      console.error("fetchMapel error:", err);
      toast.error("Gagal memuat daftar mata pelajaran");
    }
  };

  useEffect(() => {
    if (selectedMapel?.id && rombel?.id && tahunAktif?.nama) fetchNilai();
  }, [selectedMapel?.id, semester, tahunAktif?.nama]);

 const fetchNilai = async () => {
  setLoadingNilai(true);

  try {
    const [resSiswa, resNilai] = await Promise.all([
      api.get(`/api/guru/rombel/${rombel.id}/siswa`),

      api.get(`/api/guru/nilai/per-mapel/${selectedMapel.id}`, {
        params: {
          semester,
          tahun_ajaran: tahunAktif.nama,
          rombel_id: rombel.id,
          mode,
        },
      }),
    ]);

    // =========================
    // DATA SISWA
    // =========================
    const siswaList = resSiswa.data.data || [];

    // =========================
    // DATA NILAI
    // =========================
    const nilaiList = resNilai.data.data || [];

    // =========================
    // BUAT MAP NILAI BERDASARKAN siswa_id
    // =========================
    const nilaiMap = new Map();

    nilaiList.forEach((n) => {
      nilaiMap.set(
        n.siswa_id,
        n.nilai || ["", "", "", "", "", "", ""]
      );
    });

    // =========================
    // GABUNGKAN SISWA + NILAI
    // =========================
    const mergedData = siswaList.map((s) => ({
      siswa_id: s.id,

      nama: (s.nama || "").trim(),

      nis: s.nis || "—",

      nilai:
        nilaiMap.get(s.id) || [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
    }));

    // =========================
    // SORT NAMA SISWA A-Z
    // =========================
    mergedData.sort((a, b) =>
      a.nama.localeCompare(b.nama, "id", {
        sensitivity: "base",
      })
    );

    // =========================
    // SET STATE
    // =========================
    setDataNilai(mergedData);

  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat data nilai");
  } finally {
    setLoadingNilai(false);
  }
};

  // ==================== PERHITUNGAN ====================
  const hitungRataUH = (nilai) => {
    const uh = nilai
      .slice(0, 5)
      .filter((v) => v !== "" && !isNaN(v))
      .map(Number);

    return uh.length
      ? Math.round(uh.reduce((a, b) => a + b, 0) / uh.length)
      : "";
  };

  const hitungNilaiRaport = (nilai) => {
    const rataUH = Number(hitungRataUH(nilai));
    const pts = Number(nilai[5]);
    const pas = Number(nilai[6]);

    if (!rataUH && !pts && !pas) return "";

    return Math.round(rataUH * 0.4 + pts * 0.3 + pas * 0.3);
  };

  const getDeskripsiNilai = (nilaiRapor) => {
    if (!nilaiRapor || isNaN(nilaiRapor)) return "—";
    const n = Number(nilaiRapor);
    const match = templateIntrakurikuler.find((t) => n >= t.min && n <= t.max);
    return match ? match.deskripsi : "—";
  };

  const getBgColor = (val) => {
    if (val === "" || isNaN(val)) return "bg-slate-50";
    const n = Number(val);
    if (n < 70) return "bg-rose-50 text-rose-700";
    if (n < 80) return "bg-amber-50 text-amber-700";
    return "bg-emerald-50 text-emerald-700";
  };

  const canEdit = () => mode === "guruKelas";

  const handleChange = (siswaId, colIdx, value) => {
    if (!canEdit()) return;
    const num = value === "" ? "" : Math.max(0, Math.min(100, Number(value)));
    setDataNilai((prev) =>
      prev.map((s) =>
        s.siswa_id === siswaId
          ? { ...s, nilai: s.nilai.map((n, i) => (i === colIdx ? num : n)) }
          : s
      )
    );
  };

  const handleSave = async () => {
    const payload = {
      mapel_id: selectedMapel.id,
      semester,
      tahun_ajaran: tahunAktif.nama,
      nilai: dataNilai.map((s) => ({
        siswa_id: s.siswa_id,
        uh1: s.nilai[0] !== "" ? s.nilai[0] : null,
        uh2: s.nilai[1] !== "" ? s.nilai[1] : null,
        uh3: s.nilai[2] !== "" ? s.nilai[2] : null,
        uh4: s.nilai[3] !== "" ? s.nilai[3] : null,
        uh5: s.nilai[4] !== "" ? s.nilai[4] : null,
        pts: s.nilai[5] !== "" ? s.nilai[5] : null,
        pas: s.nilai[6] !== "" ? s.nilai[6] : null,
      })),
    };

    setLoadingSave(true);
    try {
      await api.post("/api/guru/nilai", payload);
      toast.success(`Nilai ${selectedMapel.nama} berhasil disimpan!`);
      fetchNilai();
    } catch (err) {
      toast.error("Gagal menyimpan nilai");
    } finally {
      setLoadingSave(false);
    }
  };

  const filtered = dataNilai.filter((s) =>
    s.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Skeleton Loading
  if (loading)
    return (
      <GuruLayout>
        <div className="flex-1 p-8 animate-pulse bg-slate-50 min-h-screen">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="h-64 bg-slate-200 rounded-[2.5rem]"></div>
            <div className="h-64 bg-slate-200 rounded-[2.5rem]"></div>
          </div>
        </div>
      </GuruLayout>
    );

  // ==================== UI MODE SELECTOR ====================
  if (!mode) {
    return (
      <GuruLayout title="Input Nilai Akademik">
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Pusat Penilaian Akademik
            </h1>
            <p className="text-slate-500 mb-12">
              Pilih peran akses Anda untuk mulai mengelola nilai siswa
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={() => setMode("guruKelas")}
                className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl hover:border-indigo-500 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-[10] transition-transform duration-700 opacity-50"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                    <FaUserEdit size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">
                    GURU KELAS
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Akses penuh input nilai mata pelajaran inti
                  </p>
                </div>
              </button>

              <button
                onClick={() => setMode("guruBidang")}
                className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl hover:border-emerald-500 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-[10] transition-transform duration-700 opacity-50"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
                    <FaBook size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">
                    GURU BIDANG
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Lihat seluruh capaian nilai kelas (Read Only)
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </GuruLayout>
    );
  }

  // ==================== MAIN VIEW ====================
  return (
    <GuruLayout
      title="Manajemen Nilai Siswa"
      subtitle={`${
        rombel ? `Kelas ${rombel.tingkat_kelas}${rombel.sub_nama}` : ""
      } • Semester ${semester} • TA ${tahunAktif?.nama}`}
    >
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <button
            onClick={() => {
              setMode("");
              setMapelList([]);
              setSelectedMapel(null);
              setDataNilai([]);
            }}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors group"
          >
            <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
            Kembali ke Pilih Mode
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchNilai}
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
            >
              <FaSyncAlt className={loadingNilai ? "animate-spin" : ""} />
            </button>

            {canEdit() && (
              <button
                onClick={handleSave}
                disabled={loadingSave || !selectedMapel}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all disabled:bg-slate-300"
              >
                {loadingSave ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaSave />
                )}{" "}
                Simpan Semua Nilai
              </button>
            )}
          </div>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Mata Pelajaran
              </label>
              <select
                value={selectedMapel?.id || ""}
                onChange={(e) =>
                  setSelectedMapel(
                    mapelList.find((m) => m.id === Number(e.target.value)) ||
                      null
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Pilih Mapel</option>
                {mapelList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama}
                  </option>
                ))}
              </select>
              {/* Info jumlah mapel tersedia */}
              {mapelList.length > 0 && (
                <p className="text-[10px] text-slate-400 mt-1">
                  {mapelList.length} mata pelajaran tersedia
                </p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="1">Ganjil (1)</option>
                <option value="2">Genap (2)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Cari Nama Siswa
              </label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  placeholder="Ketik nama untuk memfilter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {!canEdit() && (
            <div className="mt-6 flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-emerald-800 text-sm font-medium">
              <FaInfoCircle className="text-emerald-500" />
              Anda dalam mode <b>Guru Bidang</b> (Hanya Lihat). Nilai diinput
              oleh guru mata pelajaran terkait.
            </div>
          )}
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-12">
                    No
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Identitas Siswa
                  </th>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <th
                      key={n}
                      className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16"
                    >
                      UH{n}
                    </th>
                  ))}
                  <th className="px-2 py-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest text-center w-20">
                    Rata UH
                  </th>
                  <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">
                    PTS
                  </th>
                  <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">
                    PAS
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center w-24">
                    Nilai Rapor
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Deskripsi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loadingNilai ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="12" className="p-8 bg-slate-50/30"></td>
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((s, idx) => {
                    const rata = hitungRataUH(s.nilai);
                    const rapor = hitungNilaiRaport(s.nilai);

                    return (
                      <tr
                        key={s.siswa_id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 text-center text-slate-400 font-bold text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 block text-sm">
                            {s.nama}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {s.nis}
                          </span>
                        </td>

                        {/* Input UH 1-5 */}
                        {s.nilai.slice(0, 5).map((v, i) => (
                          <td key={i} className="px-1 py-4 text-center">
                            <input
                              type="number"
                              value={v}
                              disabled={!canEdit()}
                              onChange={(e) =>
                                handleChange(s.siswa_id, i, e.target.value)
                              }
                              className={`w-12 h-10 text-center font-bold text-sm rounded-xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${getBgColor(
                                v
                              )} ${
                                !canEdit()
                                  ? "border-transparent"
                                  : "border-slate-100 hover:border-slate-300"
                              }`}
                            />
                          </td>
                        ))}

                        <td className="px-1 py-4 text-center">
                          <div className="w-14 h-10 flex items-center justify-center mx-auto rounded-xl font-black text-sm bg-indigo-50 text-indigo-700">
                            {rata || "—"}
                          </div>
                        </td>

                        {/* PTS & PAS */}
                        {[5, 6].map((i) => (
                          <td key={i} className="px-1 py-4 text-center">
                            <input
                              type="number"
                              value={s.nilai[i]}
                              disabled={!canEdit()}
                              onChange={(e) =>
                                handleChange(s.siswa_id, i, e.target.value)
                              }
                              className={`w-12 h-10 text-center font-bold text-sm rounded-xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${getBgColor(
                                s.nilai[i]
                              )} ${
                                !canEdit()
                                  ? "border-transparent"
                                  : "border-slate-100 hover:border-slate-300"
                              }`}
                            />
                          </td>
                        ))}

                        <td className="px-6 py-4 text-center">
                          <div
                            className={`w-16 h-12 flex items-center justify-center mx-auto rounded-2xl font-black text-lg shadow-sm border ${
                              rapor >= 70
                                ? "bg-indigo-600 text-white border-indigo-700"
                                : rapor
                                ? "bg-rose-500 text-white border-rose-600"
                                : "bg-slate-100 text-slate-400 border-slate-200"
                            }`}
                          >
                            {rapor || "—"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-xs font-semibold text-slate-700 leading-relaxed">
                            {getDeskripsiNilai(rapor)}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <FaFileSignature size={64} className="mb-4" />
                        <p className="font-black text-xl uppercase tracking-tighter">
                          Data Siswa Tidak Ditemukan
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex gap-6">
              <span>
                Total:{" "}
                <span className="text-slate-900">{dataNilai.length} Siswa</span>
              </span>
              <span>
                Tampil:{" "}
                <span className="text-indigo-600">{filtered.length} Siswa</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaInfoCircle className="text-indigo-500" />
              Rumus: (Rata UH × 0.4) + (PTS × 0.3) + (PAS × 0.3)
            </div>
          </div>
        </div>
      </div>
    </GuruLayout>
  );
}