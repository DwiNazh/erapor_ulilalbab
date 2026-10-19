import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";
import GuruLayout from "../../layouts/GuruLayout";
import {
  FaQuran,
  FaSave,
  FaSearch,
  FaSyncAlt,
  FaFileSignature,
} from "react-icons/fa";

const API_QURAN = "/api/guru/quran";

export default function KelompokQuranGuru() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingNilai, setLoadingNilai] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [tahunAktif, setTahunAktif] = useState(null);
  const [semester, setSemester] = useState("");
  const [jenis, setJenis]               = useState("tahfidz"); 
  const [kelompokList, setKelompokList] = useState([]);
  const [selectedKelompok, setSelectedKelompok] = useState(null);
  
  const [dataNilai, setDataNilai] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Proteksi ditangani ProtectedRoute

  const fetchDataAwal = async () => {
    setLoading(true);
    try {
      const resTahun = await api.get("/api/guru/tahunajaran/aktif");
      const dataTahun = resTahun.data?.data || null;
      setTahunAktif(dataTahun);

      if (dataTahun) {
        setSemester(dataTahun.semester_aktif || "Ganjil");
        await fetchDaftarKelompok(dataTahun.id, dataTahun.semester_aktif || "Ganjil");
      }
    } catch (err) {
      toast.error("Gagal memuat data konfigurasi akademik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDataAwal(); }, []);

  const fetchDaftarKelompok = async (tId, sem) => {
    try {
      const res = await api.get(`${API_QURAN}/kelompok-saya`, {
        params: { tahun_ajaran_id: tId, semester: sem },
      });
      const data = res.data?.data || [];
      setKelompokList(data);
      if (data.length > 0) setSelectedKelompok(data[0]);
    } catch (err) {
      toast.error("Gagal memuat data kelompok Al-Qur'an");
    }
  };

  useEffect(() => {
    if (selectedKelompok?.id && tahunAktif?.nama) {
      fetchNilaiSiswa();
    }
  }, [selectedKelompok, semester, jenis, tahunAktif?.nama]); 

  const fetchNilaiSiswa = async () => {
    setLoadingNilai(true);
    try {
      const [resSiswa, resNilai] = await Promise.all([
        api.get(`${API_QURAN}/kelompok/${selectedKelompok.id}/siswa`),
        api.get(`/api/guru/quran/nilai`, {
          params: {
            kelompok_id: selectedKelompok.id,
            semester: semester === "Genap" ? "2" : "1",
            tahun_ajaran: tahunAktif.nama,
            jenis, 
          },
        }),
      ]);

      const siswaList = resSiswa.data.data || [];
      const nilaiList = resNilai.data.data || [];

      const mergedData = siswaList.map((s) => {
        const existingNilai = nilaiList.find((n) => n.siswa_id === s.id);
        return {
          siswa_id: s.id,
          nama: (s.nama || "").trim(),
          nis: s.nis || "—",
          nilai: existingNilai?.nilai || ["", "", "", "", "", "", ""],
          deskripsi: existingNilai?.deskripsi || "",
        };
      });

      mergedData.sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));
      setDataNilai(mergedData);
    } catch (err) {
      toast.error("Gagal memuat data nilai Al-Qur'an");
    } finally {
      setLoadingNilai(false);
    }
  };

  const handleDeskripsiChange = (siswaId, value) => {
    setDataNilai((prev) =>
      prev.map((s) => s.siswa_id === siswaId ? { ...s, deskripsi: value } : s)
    );
  };

  const hitungRataUH = (nilai) => {
    const uh = nilai.slice(0, 5).filter((v) => v !== "" && v !== null && !isNaN(v)).map(Number);
    return uh.length ? Math.round(uh.reduce((a, b) => a + b, 0) / uh.length) : "";
  };

  const hitungNilaiRaport = (nilai) => {
    const rataUH = Number(hitungRataUH(nilai));
    const pts = Number(nilai[5]);
    const pas = Number(nilai[6]);
    if (!rataUH && !pts && !pas) return "";
    return Math.round(rataUH * 0.4 + pts * 0.3 + pas * 0.3);
  };

  const getBgColor = (val) => {
    if (val === "" || val === null || isNaN(val)) return "bg-slate-50";
    const n = Number(val);
    if (n < 70) return "bg-rose-50 text-rose-700";
    if (n < 80) return "bg-amber-50 text-amber-700";
    return "bg-emerald-50 text-emerald-700";
  };

  const handleChange = (siswaId, colIdx, value) => {
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
      kelompok_id: selectedKelompok.id,
      semester: semester === "Genap" ? "2" : "1",
      tahun_ajaran: tahunAktif.nama,
      jenis: jenis, 

      nilai: dataNilai.map((s) => ({
        siswa_id: s.siswa_id,
        uh1: s.nilai[0] !== "" ? s.nilai[0] : null,
        uh2: s.nilai[1] !== "" ? s.nilai[1] : null,
        uh3: s.nilai[2] !== "" ? s.nilai[2] : null,
        uh4: s.nilai[3] !== "" ? s.nilai[3] : null,
        uh5: s.nilai[4] !== "" ? s.nilai[4] : null,
        pts: s.nilai[5] !== "" ? s.nilai[5] : null,
        pas: s.nilai[6] !== "" ? s.nilai[6] : null,
        deskripsi: s.deskripsi || null,
      })),
    };

    setLoadingSave(true);
    try {
      await api.post(`${API_QURAN}/nilai`, payload);
      toast.success(`Seluruh capaian nilai ${jenis.toUpperCase()} berhasil disimpan!`);
      fetchNilaiSiswa();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan data nilai";
      toast.error(msg);
    } finally {
      setLoadingSave(false);
    }
  };

  const filtered = dataNilai.filter((s) =>
    s.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <GuruLayout>
        <div className="flex-1 p-8 animate-pulse bg-slate-50 min-h-screen">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
          <div className="h-64 bg-slate-200 rounded-[2.5rem]"></div>
        </div>
      </GuruLayout>
    );
  }

  return (
    <GuruLayout
      title={`Input Penilaian Al-Qur'an (${jenis.toUpperCase()})`}
      subtitle={`${selectedKelompok ? `Kelompok ${selectedKelompok.label}` : ""} • Semester ${semester} • TA ${tahunAktif?.nama}`}
    >
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* ACTION BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <FaQuran size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Lembar Kerja Penilaian Qur'an</h1>
              <p className="text-sm text-slate-500 mt-0.5">Input nilai capaian harian sub-aspek Al-Qur'an.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchNilaiSiswa}
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
            >
              <FaSyncAlt className={loadingNilai ? "animate-spin" : ""} />
            </button>

            <button
              onClick={handleSave}
              disabled={loadingSave || !selectedKelompok}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all disabled:bg-slate-300"
            >
              {loadingSave ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
              Simpan Nilai {jenis.toUpperCase()}
            </button>
          </div>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Kelompok Bimbingan
              </label>
              <select
                value={selectedKelompok?.id || ""}
                onChange={(e) =>
                  setSelectedKelompok(kelompokList.find((k) => k.id === Number(e.target.value)) || null)
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Pilih Kelompok</option>
                {kelompokList.map((k) => (
                  <option key={k.id} value={k.id}>Kelompok {k.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                Sub-Aspek Penilaian
              </label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className="w-full bg-slate-50 border border-indigo-200 rounded-xl px-4 py-3 font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="tahfidz">Tahfidz </option>
                <option value="tilawah">Tilawah </option>
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
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
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
                  placeholder="Ketik nama siswa bimbingan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DATA WORK TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-12">NO</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-52">IDENTITAS SISWA</th>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <th key={n} className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">UH{n}</th>
                  ))}
                  <th className="px-2 py-5 text-[10px] font-black text-indigo-500 uppercase tracking-widest text-center w-20">RATA UH</th>
                  <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">PTS</th>
                  <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">PAS</th>
                  <th className="px-6 py-5 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center w-24">NILAI RAPOR</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">DESKRIPSI CAPAIAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length > 0 ? (
                  filtered.map((s, idx) => {
                    const rata = hitungRataUH(s.nilai);
                    const rapor = hitungNilaiRaport(s.nilai);

                    return (
                      <tr key={s.siswa_id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 text-center text-slate-400 font-bold text-xs">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 block text-sm leading-snug">{s.nama}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">{s.nis}</span>
                        </td>
                        {s.nilai.slice(0, 5).map((v, i) => (
                          <td key={i} className="px-1 py-4 text-center">
                            <input
                              type="number"
                              value={v}
                              onChange={(e) => handleChange(s.siswa_id, i, e.target.value)}
                              className={`w-12 h-10 text-center font-bold text-sm rounded-xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${getBgColor(v)} border-slate-100 hover:border-slate-300`}
                            />
                          </td>
                        ))}
                        <td className="px-1 py-4 text-center">
                          <div className="w-14 h-10 flex items-center justify-center mx-auto rounded-xl font-black text-sm bg-indigo-50 text-indigo-700">
                            {rata || "—"}
                          </div>
                        </td>
                        {[5, 6].map((i) => (
                          <td key={i} className="px-1 py-4 text-center">
                            <input
                              type="number"
                              value={s.nilai[i]}
                              onChange={(e) => handleChange(s.siswa_id, i, e.target.value)}
                              className={`w-12 h-10 text-center font-bold text-sm rounded-xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${getBgColor(s.nilai[i])} border-slate-100 hover:border-slate-300`}
                            />
                          </td>
                        ))}
                        <td className="px-6 py-4 text-center">
                          <div className={`w-16 h-12 flex items-center justify-center mx-auto rounded-2xl font-black text-lg shadow-sm border ${rapor >= 70 ? "bg-indigo-600 text-white border-indigo-700" : rapor ? "bg-rose-500 text-white border-rose-600" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                            {rapor || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            value={s.deskripsi || ""}
                            onChange={(e) => handleDeskripsiChange(s.siswa_id, e.target.value)}
                            placeholder={`Tulis deskripsi capaian ${jenis}...`}
                            className="w-full min-w-[260px] min-h-[90px] p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          />
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