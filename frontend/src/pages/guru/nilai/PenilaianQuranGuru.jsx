import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import GuruLayout from "../../../layouts/GuruLayout";
import {
  FaQuran,
  FaSearch,
  FaSyncAlt,
  FaInfoCircle,
  FaFileSignature,
} from "react-icons/fa";

const API_GURU_NILAI = "/api/guru/nilai/quran";

const getNilaiBadge = (val) => {
  if (val === "" || val === null || val === undefined)
    return "bg-slate-100 text-slate-400 border-slate-200";
  const n = Number(val);
  if (n < 70) return "bg-rose-50 text-rose-700 border-rose-200";
  if (n < 80) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

export default function PenilaianQuranGuru() {
  const navigate = useNavigate();

  const [rombel, setRombel]             = useState(null);
  const [semester, setSemester]         = useState("1");
  const [jenis, setJenis]               = useState("tahfidz");
  const [tahunAktif, setTahunAktif]     = useState(null);
  const [searchQuery, setSearchQuery]   = useState("");
  const [dataNilai, setDataNilai]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [loadingNilai, setLoadingNilai] = useState(false);

  // Proteksi ditangani ProtectedRoute

  const fetchDataAwal = async () => {
    setLoading(true);
    try {
      const [resRombel, resTahun] = await Promise.all([
        api.get("/api/guru/rombel"),
        api.get("/api/guru/tahunajaran/aktif"),
      ]);

      const rombelData = resRombel.data.data?.[0] || null;
      if (!rombelData) toast.error("Anda belum ditugaskan di rombel manapun");

      setRombel(rombelData);
      const tahunData = resTahun.data?.data || null;
      setTahunAktif(tahunData);

      if (tahunData) {
        setSemester(tahunData.semester_aktif === "Genap" ? "2" : "1");
      }
    } catch {
      toast.error("Gagal memuat data akademik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDataAwal(); }, []);

  useEffect(() => {
    if (rombel?.id && tahunAktif?.nama) fetchNilaiQuranku();
  }, [rombel?.id, semester, jenis, tahunAktif?.nama]); // Ditambahkan jenis ke trigger effect

  const fetchNilaiQuranku = async () => {
    setLoadingNilai(true);
    try {
      const [resSiswa, resNilai] = await Promise.all([
        api.get(`/api/guru/rombel/${rombel.id}/siswa`),
        api.get(API_GURU_NILAI, {
          params: {
            semester,
            tahun_ajaran: tahunAktif.nama,
            rombel_id: rombel.id,
            jenis, // Mengirim data pecahan jenis
          },
        }),
      ]);

      const siswaList = resSiswa.data.data || [];
      const nilaiList = resNilai.data.data || [];
      const nilaiMap  = new Map(nilaiList.map((n) => [n.siswa_id, n]));

      const mergedData = siswaList.map((s) => {
        const n = nilaiMap.get(s.id);
        return {
          siswa_id : s.id,
          nama     : (s.nama || "").trim(),
          nis      : s.nis || "—",
          nilai    : n?.nilai    ?? ["","","","","","",""],
          deskripsi: n?.deskripsi ?? null,
        };
      });

      mergedData.sort((a, b) =>
        a.nama.localeCompare(b.nama, "id", { sensitivity: "base" })
      );
      setDataNilai(mergedData);
    } catch {
      toast.error("Gagal memuat data rekap nilai Al-Qur'an");
    } finally {
      setLoadingNilai(false);
    }
  };

  const hitungRataUH = (nilai) => {
    const uh = nilai.slice(0, 5)
      .filter((v) => v !== "" && v !== null && !isNaN(v))
      .map(Number);
    return uh.length ? Math.round(uh.reduce((a, b) => a + b, 0) / uh.length) : "";
  };

  const hitungNilaiRaport = (nilai) => {
    const rataUH = hitungRataUH(nilai);
    const pts    = nilai[5] !== "" && nilai[5] !== null ? Number(nilai[5]) : null;
    const pas    = nilai[6] !== "" && nilai[6] !== null ? Number(nilai[6]) : null;
    if (rataUH === "" && pts === null && pas === null) return "";
    return Math.round(
      (rataUH !== "" ? Number(rataUH) : 0) * 0.4 +
      (pts ?? 0) * 0.3 +
      (pas ?? 0) * 0.3
    );
  };

  const filtered = dataNilai.filter((s) =>
    s.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <GuruLayout>
        <div className="flex-1 p-8 animate-pulse bg-slate-50 min-h-screen">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4" />
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-10" />
          <div className="h-12 bg-slate-200 rounded-xl mb-6" />
          <div className="h-96 bg-slate-200 rounded-[2rem]" />
        </div>
      </GuruLayout>
    );
  }

  return (
    <GuruLayout
      title={`Rekap Nilai Qur'an (${jenis.toUpperCase()})`}
      subtitle={`${rombel ? `Kelas ${rombel.tingkat_kelas}${rombel.sub_nama}` : ""} • Semester ${semester} • TA ${tahunAktif?.nama}`}
    >
      <div className="max-w-7xl mx-auto space-y-6 pb-20">

        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <FaQuran size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Capaian Nilai Rapor Qur'an</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Rekapitulasi nilai Al-Qur'an pecahan sub-aspek <span className="font-bold text-indigo-600">Tahfidz & Tilawah</span>.
              </p>
            </div>
          </div>
          <button
            onClick={fetchNilaiQuranku}
            disabled={loadingNilai}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
          >
            <FaSyncAlt className={loadingNilai ? "animate-spin" : ""} />
          </button>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Rombel Diampu
              </label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-600 select-none">
                {rombel ? `Kelas ${rombel.tingkat_kelas}${rombel.sub_nama}` : "Belum Ada Rombel"}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Kategori Al-Qur'an
              </label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className="w-full bg-slate-50 border border-indigo-200 rounded-xl px-4 py-3 font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="tahfidz">Tahfidz</option>
                <option value="tilawah">Tilawah</option>
              </select>
            </div>

            <div>
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

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Cari Nama Siswa
              </label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  placeholder="Ketik nama siswa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-12">NO</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-52">IDENTITAS SISWA</th>
                  {[1,2,3,4,5].map((n) => (
                    <th key={n} className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">UH{n}</th>
                  ))}
                  <th className="px-2 py-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest text-center w-20">RATA UH</th>
                  <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">PTS</th>
                  <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">PAS</th>
                  <th className="px-6 py-5 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center w-24">NILAI RAPOR</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">DESKRIPSI ({jenis.toUpperCase()})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length > 0 ? (
                  filtered.map((s, idx) => {
                    const rata  = hitungRataUH(s.nilai);
                    const rapor = hitungNilaiRaport(s.nilai);

                    return (
                      <tr key={s.siswa_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-center text-slate-400 font-bold text-xs">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 block text-sm leading-snug">{s.nama}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{s.nis}</span>
                        </td>
                        {s.nilai.slice(0, 5).map((v, i) => (
                          <td key={i} className="px-1 py-4 text-center">
                            <div className={`w-12 h-10 flex items-center justify-center mx-auto rounded-xl font-bold text-sm border ${getNilaiBadge(v)}`}>
                              {v !== "" && v !== null ? v : "—"}
                            </div>
                          </td>
                        ))}
                        <td className="px-1 py-4 text-center">
                          <div className="w-14 h-10 flex items-center justify-center mx-auto rounded-xl font-black text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {rata !== "" ? rata : "—"}
                          </div>
                        </td>
                        {[5, 6].map((i) => (
                          <td key={i} className="px-1 py-4 text-center">
                            <div className={`w-12 h-10 flex items-center justify-center mx-auto rounded-xl font-bold text-sm border ${getNilaiBadge(s.nilai[i])}`}>
                              {s.nilai[i] !== "" && s.nilai[i] !== null ? s.nilai[i] : "—"}
                            </div>
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center">
                          <div className={`w-16 h-12 flex items-center justify-center mx-auto rounded-2xl font-black text-lg shadow-sm border ${
                            rapor === "" ? "bg-slate-100 text-slate-400 border-slate-200"
                            : rapor >= 70 ? "bg-indigo-600 text-white border-indigo-700"
                            : "bg-rose-500 text-white border-rose-600"
                          }`}>
                            {rapor !== "" ? rapor : "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-semibold text-slate-600 leading-relaxed max-w-xs">
                            {s.deskripsi || <span className="text-slate-300 italic">Belum diisi oleh guru pengampu</span>}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12" className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <FaFileSignature size={64} className="mb-4" />
                        <p className="font-black text-xl uppercase tracking-tighter">Data Siswa Tidak Ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GuruLayout>
  );
}