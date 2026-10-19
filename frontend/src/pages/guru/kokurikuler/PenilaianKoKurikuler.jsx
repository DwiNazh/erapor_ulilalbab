import React, { useState, useEffect, useCallback } from "react";
import api from "../../../api";
import SidebarGuru from "../../../components/SidebarGuru";
import toast from "react-hot-toast";
import {
  Save,
  RefreshCw,
  GraduationCap,
  CheckCircle2,
  ChevronLeft,
  HeartPulse,
  Users,
  BookMarked,
  FileCode,
  Plus,
} from "lucide-react";

export default function PenilaianKoKurikuler() {
  const [selectedAspek, setSelectedAspek] = useState("");
  const [dataSiswa, setDataSiswa] = useState([]);
  const [rombel, setRombel] = useState(null);
  const [tahunAjaran, setTahunAjaran] = useState(null);
  const [semester, setSemester] = useState("1");
  const [loading, setLoading] = useState(true);
  const [loadingNilai, setLoadingNilai] = useState(false);
  const [templateDeskripsi, setTemplateDeskripsi] = useState(null);
  const [pjblJudul, setPjblJudul] = useState(null);

  const [jumlahPertemuan, setJumlahPertemuan] = useState(1);

  const gradesUmum = ["A", "B", "C", "D", "E"];
  const skalaMutabaah = ["1", "2", "3", "4"];

  const konversiSkalaKeGrade = (nilaiSkala) => {
    if (!nilaiSkala || isNaN(nilaiSkala)) return "—";
    const n = Number(nilaiSkala);
    if (n >= 3.5) return "A";
    if (n >= 2.8) return "B";
    if (n >= 2.0) return "C";
    if (n >= 1.0) return "D";
    return "E";
  };

  const generateDeskripsi = useCallback((nilaiArr) => {
    if (!templateDeskripsi) return ["", "", "", ""];
    const src = templateDeskripsi;
    const gradeMutabaah = konversiSkalaKeGrade(nilaiArr[0]);
    return [
      gradeMutabaah !== "—" ? src.mutabaah_yaumiyah?.[gradeMutabaah] ?? "" : "",
      nilaiArr[1] ? src.bina_pribadi_islam?.[nilaiArr[1]] ?? "" : "",
      nilaiArr[2] ? src.literasi?.[nilaiArr[2]] ?? "" : "",
      nilaiArr[3] ? src.pjbl?.[nilaiArr[3]] ?? "" : "",
    ];
  }, [templateDeskripsi]);

  const fetchTemplate = async () => {
    try {
      const res = await api.get("/api/guru/template-deskripsi/kokurikuler");
      if (res.data.success && Object.keys(res.data.data).length > 0) {
        setTemplateDeskripsi(res.data.data);
      }
    } catch (err) {
      setTemplateDeskripsi(null);
    }
  };

  const fetchNilai = useCallback(async () => {
    setLoadingNilai(true);
    try {
      const res = await api.get(`/api/guru/nilai-kokurikuler/${semester}`);
      if (res.data.success) {
        const nilaiBackend = res.data.data || [];
        setPjblJudul(res.data.pjbl_judul || null);

        let maxPertemuan = 1;
        nilaiBackend.forEach((match) => {
          if (match.nilai_mingguan_mutabaah && match.nilai_mingguan_mutabaah.length > maxPertemuan) {
            maxPertemuan = match.nilai_mingguan_mutabaah.length;
          }
        });

        setJumlahPertemuan(maxPertemuan);

        setDataSiswa((prev) =>
          prev.map((siswa) => {
            const match = nilaiBackend.find((n) => n.siswa_id === siswa.id);

            if (!match) {
              return {
                ...siswa,
                nilai: ["", "", "", ""],
                nilai_mingguan_mutabaah: Array(maxPertemuan).fill(""),
                deskripsi_aspek: ["", "", "", ""],
              };
            }

            const nArr = [
              match.mutabaah_yaumiyah || "",
              match.bina_pribadi_islam || "",
              match.literasi || "",
              match.pjbl || "",
            ];

            const mingguanData = match.nilai_mingguan_mutabaah || [];
            const paddedMingguan = Array(maxPertemuan)
              .fill("")
              .map((_, idx) => mingguanData[idx] ?? "");

            return {
              ...siswa,
              nilai: nArr,
              nilai_mingguan_mutabaah: paddedMingguan,
              deskripsi_aspek:
                Array.isArray(match.deskripsi_aspek) && match.deskripsi_aspek.some((d) => d !== "")
                  ? match.deskripsi_aspek
                  : generateDeskripsi(nArr),
            };
          })
        );
      }
    } catch (err) {
      toast.error("Gagal mengambil data nilai.");
    } finally {
      setLoadingNilai(false);
    }
  }, [semester, generateDeskripsi]);

  const loadDataAkademik = async () => {
    setLoading(true);
    try {
      await fetchTemplate();
      const resTA = await api.get("/api/guru/tahunajaran/aktif");
      if (resTA.data?.data?.nama) setTahunAjaran(resTA.data.data.nama.trim());

      const resRombel = await api.get("/api/guru/rombel");
      const rombelData = resRombel.data.data?.[0] || null;

      if (!rombelData) {
        toast.error("Anda bukan Wali Kelas.");
        setLoading(false);
        return;
      }
      setRombel(rombelData);

      const resSiswa = await api.get(`/api/guru/rombel/${rombelData.id}/siswa`);
      const listSiswaFormattedSorted = (resSiswa.data.data || [])
        .map((s) => ({
          id: s.id,
          nama: s.nama,
          nis: s.nis || "—",
          nilai: ["", "", "", ""],
          nilai_mingguan_mutabaah: [""],
          deskripsi_aspek: ["", "", "", ""],
        }))
        .sort((a, b) => a.nama.localeCompare(b.nama));

      setDataSiswa(listSiswaFormattedSorted);
    } catch (err) {
      toast.error("Gagal memuat data akademik.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDataAkademik(); }, []);

  useEffect(() => {
    if (tahunAjaran && rombel) {
      fetchNilai();
    }
  }, [semester, tahunAjaran, rombel, fetchNilai]);

  const handleAspekUmumChange = (id, aspekIdx, value) => {
    setDataSiswa((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const updatedNilai = s.nilai.map((v, i) => (i === aspekIdx ? value : v));
        return {
          ...s,
          nilai: updatedNilai,
          deskripsi_aspek: generateDeskripsi(updatedNilai),
        };
      })
    );
  };

  const handleMutabaahChange = (siswaId, tglIdx, value) => {
    setDataSiswa((prev) =>
      prev.map((s) => {
        if (s.id !== siswaId) return s;
        const updatedMingguan = s.nilai_mingguan_mutabaah.map((v, i) => (i === tglIdx ? value : v));

        const validValues = updatedMingguan.filter((v) => v !== "");
        const rataRata =
          validValues.length
            ? (validValues.reduce((a, b) => Number(a) + Number(b), 0) / validValues.length).toFixed(1)
            : "";

        const updatedNilai = [...s.nilai];
        updatedNilai[0] = String(rataRata);

        return {
          ...s,
          nilai_mingguan_mutabaah: updatedMingguan,
          nilai: updatedNilai,
          deskripsi_aspek: generateDeskripsi(updatedNilai),
        };
      })
    );
  };

  const handleTambahKolomPertemuan = () => {
    const mingguBaru = jumlahPertemuan + 1;
    setJumlahPertemuan(mingguBaru);
    setDataSiswa((prev) =>
      prev.map((s) => ({
        ...s,
        nilai_mingguan_mutabaah: [...s.nilai_mingguan_mutabaah, ""],
      }))
    );
    toast.success(`Kolom Minggu ke-${mingguBaru} berhasil ditambahkan.`);
  };

  // ======================================================
  // FIX: sanitasi nilai sebelum dikirim ke backend
  // - mutabaah_yaumiyah: kirim null jika kosong / bukan angka valid
  // - aspek lain: kirim null jika kosong
  // ======================================================
  const sanitasiMutabaah = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    if (isNaN(n) || n === 0) return null;
    return String(val);
  };

  const handleSave = async () => {
    setLoadingNilai(true);
    const payload = {
      semester,
      tahun_ajaran: tahunAjaran,
      nilai: dataSiswa.map((s) => ({
        siswa_id: s.id,
        mutabaah_yaumiyah:  sanitasiMutabaah(s.nilai[0]),
        bina_pribadi_islam: s.nilai[1] || null,
        literasi:           s.nilai[2] || null,
        pjbl:               s.nilai[3] || null,
        nilai_mingguan_mutabaah: s.nilai_mingguan_mutabaah,
        deskripsi_aspek: s.deskripsi_aspek,
      })),
    };

    try {
      await api.post("/api/guru/nilai-kokurikuler/bulk", payload);
      toast.success(`Berhasil menyimpan rekap nilai ${selectedAspek}!`);
      fetchNilai();
    } catch (err) {
      toast.error("Gagal menyimpan nilai.");
    } finally {
      setLoadingNilai(false);
    }
  };

  const getBgColor = (val, isMutabaah = false) => {
    if (!val || val === "—") return "bg-gray-50 text-gray-400 border-gray-200";

    if (isMutabaah) {
      const n = Number(val);
      if (n >= 3.5) return "bg-emerald-50 text-emerald-700 border-emerald-200";
      if (n >= 2.8) return "bg-blue-50 text-blue-700 border-blue-200";
      if (n >= 2.0) return "bg-amber-50 text-amber-700 border-amber-200";
      return "bg-rose-50 text-rose-700 border-rose-200";
    } else {
      switch (val) {
        case "A": return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "B": return "bg-blue-50 text-blue-700 border-blue-200";
        case "C": return "bg-amber-50 text-amber-700 border-amber-200";
        default:  return "bg-rose-50 text-rose-700 border-rose-200";
      }
    }
  };

  const getAspekIndex = () => {
    if (selectedAspek === "Bina Pribadi Islam") return 1;
    if (selectedAspek === "Literasi") return 2;
    return 3;
  };

  if (loading) return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarGuru />
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <RefreshCw className="animate-spin text-indigo-600 text-3xl" />
        <p className="text-slate-500 font-medium">Sinkronisasi data...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarGuru />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER UTAMA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
                <GraduationCap size={18} />
                <span className="uppercase tracking-wider text-[10px]">Wali Kelas Panel</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {selectedAspek ? `Penilaian: ${selectedAspek}` : "Pusat Penilaian Ko-Kurikuler"}
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                {rombel?.nama || rombel?.nama_kelas} • Tahun Ajaran {tahunAjaran}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                {["1", "2"].map((s) => (
                  <button key={s} onClick={() => setSemester(s)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      semester === s ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}>
                    Semester {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* DASHBOARD UTAMA */}
          {!selectedAspek ? (
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Silakan Pilih Komponen Penilaian:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <button onClick={() => setSelectedAspek("Mutabaah Yaumiyah")}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 text-left shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HeartPulse size={24} />
                  </div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Mutaba'ah Yaumiyah</h3>
                  <p className="text-slate-400 text-[11px] mt-1 font-medium leading-normal">Pencatatan rekap amalan harian berskala dinamis mingguan (Skala 1 - 4).</p>
                </button>

                <button onClick={() => setSelectedAspek("Bina Pribadi Islam")}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 text-left shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Bina Pribadi Islam</h3>
                  <p className="text-slate-400 text-[11px] mt-1 font-medium leading-normal">Evaluasi karakter islami dan keikutsertaan halaqah (Grade A - E).</p>
                </button>

                <button onClick={() => setSelectedAspek("Literasi")}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 text-left shadow-sm hover:shadow-xl hover:border-amber-500 transition-all duration-300">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookMarked size={24} />
                  </div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Budaya Literasi</h3>
                  <p className="text-slate-400 text-[11px] mt-1 font-medium leading-normal">Rekap membaca buku, kemampuan merangkum, dan pemahaman (Grade A - E).</p>
                </button>

                <button onClick={() => setSelectedAspek("PJBL")}
                  className="group bg-white border border-slate-200 rounded-3xl p-6 text-left shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileCode size={24} />
                  </div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Proyek PJBL</h3>
                  <p className="text-slate-400 text-[11px] mt-1 font-medium leading-normal">Penilaian tugas kelompok berbasis pemecahan masalah kreatif (Grade A - E).</p>
                </button>

              </div>
            </div>
          ) : (
            <div className="space-y-4">

              <button onClick={() => setSelectedAspek("")}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <ChevronLeft size={14} /> Kembali ke Menu Pilihan Aspek
              </button>

              <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden relative">

                {/* VIEW MUTABA'AH YAUMIYAH */}
                {selectedAspek === "Mutabaah Yaumiyah" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-indigo-950 text-white font-black uppercase tracking-wide text-[11px]">
                          <th className="px-4 py-4 sticky left-0 bg-indigo-950 border-b border-indigo-900 w-12 text-center" rowSpan={2}>NO</th>
                          <th className="px-6 py-4 sticky left-12 bg-indigo-950 border-b border-indigo-900 border-r border-indigo-900 min-w-[200px]" rowSpan={2}>NAMA</th>
                          <th className="px-4 py-3 bg-indigo-900 border-b border-indigo-800 text-center" colSpan={jumlahPertemuan}>
                            <div className="flex items-center justify-center gap-3">
                              <span>INPUT NILAI MINGGUAN ( SKALA 1-4 )</span>
                              <button
                                type="button"
                                onClick={handleTambahKolomPertemuan}
                                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg px-2.5 py-1 text-[10px] uppercase tracking-wider transition shadow-sm"
                              >
                                <Plus size={10} /> Tambah Minggu Pemeriksaan
                              </button>
                            </div>
                          </th>
                          <th className="px-4 py-4 text-center bg-indigo-900 border-b border-indigo-900 w-20" rowSpan={2}>SKALA</th>
                          <th className="px-4 py-4 text-center bg-indigo-950 border-b border-indigo-900 w-20" rowSpan={2}>GRADE</th>
                          <th className="px-6 py-4 text-center bg-indigo-950 border-b border-indigo-900" rowSpan={2}>DESKRIPSI</th>
                        </tr>
                        <tr className="bg-indigo-900 text-indigo-100 font-bold text-[9px] uppercase border-b border-indigo-800">
                          {Array(jumlahPertemuan).fill(null).map((_, idx) => (
                            <th key={idx} className="px-2 py-2.5 text-center font-bold border-b border-indigo-800 min-w-[70px]">Minggu {idx + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        {dataSiswa.map((s, i) => {
                          const gradeOtomatis = konversiSkalaKeGrade(s.nilai[0]);
                          return (
                            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3.5 text-center font-bold text-slate-400 sticky left-0 bg-white border-b border-slate-100">{i + 1}</td>
                              <td className="px-6 py-3.5 sticky left-12 bg-white font-bold text-slate-800 border-r border-slate-200 border-b border-slate-100 max-w-[200px] truncate">{s.nama}</td>

                              {Array(jumlahPertemuan).fill(null).map((_, tIdx) => {
                                const nilaiMingguan = s.nilai_mingguan_mutabaah?.[tIdx] ?? "";
                                return (
                                  <td key={tIdx} className="px-2 py-3.5 text-center border-b border-slate-100 min-w-[70px]">
                                    <select
                                      value={nilaiMingguan}
                                      onChange={(e) => handleMutabaahChange(s.id, tIdx, e.target.value)}
                                      className={`w-14 py-1.5 rounded-lg text-center font-black text-xs border border-slate-200 outline-none cursor-pointer transition-all focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white ${getBgColor(nilaiMingguan, true)}`}
                                    >
                                      <option value="" className="bg-white text-slate-400">—</option>
                                      {skalaMutabaah.map((num) => (
                                        <option key={num} value={num} className="bg-white text-slate-800">{num}</option>
                                      ))}
                                    </select>
                                  </td>
                                );
                              })}

                              <td className="px-4 py-3.5 text-center bg-indigo-50/30 font-black text-slate-700 border-b border-slate-100">
                                {s.nilai[0] || "—"}
                              </td>

                              <td className="px-4 py-3.5 text-center border-b border-slate-100">
                                <span className={`inline-flex items-center justify-center w-9 h-8 rounded-lg font-black text-xs border ${getBgColor(gradeOtomatis, false)}`}>
                                  {gradeOtomatis}
                                </span>
                              </td>

                              <td className="px-6 py-3.5 border-b border-slate-100">
                                <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 italic max-w-xl leading-relaxed">
                                  {s.deskripsi_aspek[0] || <span className="text-slate-300">Belum ada template deskripsi</span>}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* VIEW BPI, LITERASI, PJBL */
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wide text-[10px] border-b border-slate-100">
                          <th className="px-6 py-4 text-center w-12">No</th>
                          <th className="px-6 py-4">Identitas Siswa</th>
                          <th className="px-4 py-4 text-center w-36">Nilai Capaian (Grade)</th>
                          <th className="px-6 py-4">Kriteria Deskripsi Otomatis Rapor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dataSiswa.map((s, i) => {
                          const aspekIdx = getAspekIndex();
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 text-center text-sm font-medium text-slate-400">{i + 1}</td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-800 leading-none">{s.nama}</p>
                                <p className="text-[10px] font-mono text-slate-400 mt-1">NIS: {s.nis}</p>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <select value={s.nilai[aspekIdx]} onChange={(e) => handleAspekUmumChange(s.id, aspekIdx, e.target.value)}
                                  className={`w-24 py-2 rounded-xl text-center text-xs font-bold border-2 outline-none cursor-pointer focus:ring-4 focus:ring-indigo-100 ${getBgColor(s.nilai[aspekIdx], false)}`}>
                                  <option value="">—</option>
                                  {gradesUmum.map((g) => <option key={g} value={g} className="bg-white text-slate-800">{g}</option>)}
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-medium italic max-w-2xl leading-relaxed">
                                  {s.deskripsi_aspek[aspekIdx] || <span className="text-slate-300">Belum ada template deskripsi untuk parameter ini</span>}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

              {/* FOOTER ACTION */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                  <span>Sistem otomatis menyinkronkan data parameter <strong>{selectedAspek}</strong> ke repositori rapor.</span>
                </div>

                <button onClick={handleSave} disabled={loadingNilai || loading || dataSiswa.length === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 text-xs">
                  {loadingNilai ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  Simpan Nilai {selectedAspek}
                </button>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}