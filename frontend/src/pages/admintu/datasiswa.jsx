import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSchool,
  FaSearch,
  FaUser,
  FaArrowLeft,
  FaTimes,
  FaArrowRight,
  FaPrint,
  FaIdCard,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import Footer from "../../components/footer";
import KartuDigitalSiswaATM from "../../components/KartuDigitalSiswaATM";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import api from "../../api";
import { KATEGORI_LABEL, perluKategori } from "../../utils/rombel";

export default function DataSiswa() {
  const [kelasDipilih, setKelasDipilih] = useState(null);
  const [subDipilih, setSubDipilih] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [siswaDetail, setSiswaDetail] = useState(null);
  const [dataSiswa, setDataSiswa] = useState([]);
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [tahunDipilih, setTahunDipilih] = useState("");
  const [tahunAktif, setTahunAktif] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "/api/tu";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [resTahun, resAktif, resSiswa] = await Promise.all([
        api.get(`${API_BASE_URL}/tahunajaran`),
        api.get(`${API_BASE_URL}/tahunajaran/aktif`),
        api.get(`${API_BASE_URL}/data-siswa`),
      ]);

      const allTahun = resTahun.data?.data || [];
      setTahunAjaranList(allTahun);
      const aktif = resAktif.data?.data;
      setTahunAktif(aktif?.nama || "");

      const siswaData = resSiswa.data?.data || [];
      setDataSiswa(Array.isArray(siswaData) ? siswaData : []);

      // Tentukan default tahun ajaran: jika tahun aktif sudah difinalisasi atau ada tahun terbaru yang memiliki data
      let defaultTahun = aktif?.nama || "";
      if (allTahun.length > 0) {
        const tahunDenganData = [...new Set(siswaData.map((s) => s.tahun_ajaran))];
        const sortedTahun = [...allTahun].sort((a, b) => b.id - a.id);
        const tahunTerbaru = sortedTahun[0]?.nama;
        if (
          tahunTerbaru &&
          tahunDenganData.includes(tahunTerbaru) &&
          (!defaultTahun || aktif?.finalized_at || aktif?.kenaikan_kelas_finalized_at)
        ) {
          defaultTahun = tahunTerbaru;
        }
      }
      setTahunDipilih(defaultTahun);
    } catch (error) {
      setError("Gagal memuat data siswa.");
    } finally {
      setLoading(false);
    }
  };

  const ubahKategori = async (siswaId, nilai) => {
    try {
      await api.put(`${API_BASE_URL}/data-siswa/${siswaId}/kategori`, {
        kategori: nilai,
      });
      setDataSiswa((prev) =>
        prev.map((x) =>
          x.siswa_id === siswaId ? { ...x, kategori: nilai } : x,
        ),
      );
      toast.success("Kategori disimpan");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan kategori", {
        duration: 6000,
      });
    }
  };

  const siswaFiltered = dataSiswa.filter(
    (s) => !tahunDipilih || s.tahun_ajaran === tahunDipilih,
  );
  const isTahunAktif = tahunDipilih === tahunAktif;
  const belumDiproses = siswaFiltered.filter(
    (s) => s.is_processed !== 1,
  ).length;
  // Hanya hitung siswa kelas >=4 yang belum diisi kategori
  const jumlahTanpaKategori = new Set(
    siswaFiltered
      .filter((s) => perluKategori(Number(s.tingkat_kelas || s.kelas || 0)) && !s.kategori)
      .map((s) => s.siswa_id),
  ).size;

  const dataTerstruktur = {};
  siswaFiltered.forEach((s) => {
    const kelas = String(s.tingkat_kelas || s.kelas || "-");
    const subDasar = s.sub_nama || s.sub_kelas || s.sub || "Reguler";
    const g = s.kategori; // "ikhwan", "akhwat", atau "" (kosong)
    // Pisah sub-kelas berdasarkan kategori HANYA untuk kelas 4 ke atas
    const kelasNum = Number(kelas);
    const sub =
      perluKategori(kelasNum) && g && g !== "campuran"
        ? `${subDasar} ${KATEGORI_LABEL[g]}`
        : subDasar;

    if (!dataTerstruktur[kelas]) dataTerstruktur[kelas] = {};
    if (!dataTerstruktur[kelas][sub]) dataTerstruktur[kelas][sub] = [];
    dataTerstruktur[kelas][sub].push({
      id: s.siswa_id || s.id,
      nama: s.nama || s.nama_user || "-",
      nis: s.nis || s.nism || "-",
      kategori: s.kategori || "",
      kelas,
      sub_kelas: sub,
      is_processed: s.is_processed || 0,
      raw: {
        ...s,
        kelas,
        sub_kelas: sub,
      },
    });
  });

  const hasilPencarian = siswaFiltered
    .filter((s) => {
      const nama = (s.nama_user ?? s.nama ?? "").toLowerCase();
      const nis = (s.nis ?? s.nism ?? "").toLowerCase();
      return (
        nama.includes(searchTerm.toLowerCase()) ||
        nis.includes(searchTerm.toLowerCase())
      );
    })
    .map((s) => {
      const kelas = String(s.tingkat_kelas || s.kelas || "-");
      const sub = s.sub_nama || s.sub_kelas || s.sub || "Reguler";
      return {
        id: s.siswa_id || s.id,
        nama: s.nama || s.nama_user || "-",
        nis: s.nis || s.nism || "-",
        kelas,
        kategori: s.kategori || "",
        sub_kelas: sub,
        raw: {
          ...s,
          kelas,
          sub_kelas: sub,
        },
      };
    });

  const dataSubkelas =
    kelasDipilih && subDipilih
      ? dataTerstruktur[String(kelasDipilih)]?.[subDipilih] || []
      : [];

  const warnaKelas = {
    1: ["from-rose-400", "to-rose-500"],
    2: ["from-indigo-400", "to-indigo-500"],
    3: ["from-emerald-400", "to-emerald-500"],
    4: ["from-amber-400", "to-amber-500"],
    5: ["from-violet-400", "to-violet-500"],
    6: ["from-sky-400", "to-sky-500"],
  };

  const handleDownloadSiswaPDF = async (s) => {
    const toastId = toast.loading(`Mencetak kartu ${s.nama}...`);
    const element = document.getElementById(`kartu-${s.id}`);
    if (!element) {
      toast.error("Gagal", { id: toastId });
      return;
    }
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      pdf.addImage(img, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Kartu_${s.nama}.pdf`);
      toast.success("Berhasil diunduh", { id: toastId });
    } catch (err) {
      toast.error("Gagal mencetak", { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* WRAPPER KONTEN UTAMA */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarAdminTu />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Data Master Siswa
                </h1>
                <p className="text-slate-500 text-sm">
                  Pusat informasi dan manajemen status siswa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={tahunDipilih}
                  onChange={(e) => setTahunDipilih(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Semua Tahun Ajaran --</option>
                  {tahunAjaranList.map((t) => (
                    <option key={t.id} value={t.nama}>
                      TA {t.nama} {t.aktif ? "(Aktif)" : ""}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Nama / NIS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-3 w-full sm:w-64 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* CTA PROMOSI */}
            {isTahunAktif && !searchTerm && !kelasDipilih && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group"
              >
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-400" /> Kenaikan
                      Kelas TA {tahunAktif}
                    </h2>
                    <p className="text-indigo-100 opacity-90">
                      Segera proses promosi untuk memindahkan siswa ke tingkat
                      kelas berikutnya.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Link
                      to="/dashboardtusd/promosi"
                      className="bg-white text-indigo-700 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-lg"
                    >
                      Naikkan Kelas <FaArrowRight />
                    </Link>
                    {belumDiproses > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-bounce">
                        {belumDiproses} SISWA BELUM DIPROSES
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* HASIL PENCARIAN */}
              {searchTerm && (
                <motion.div
                  key="hasil"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10"
                >
                  <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
                    <h2 className="font-bold text-slate-700">
                      Hasil Pencarian: "{searchTerm}"
                    </h2>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-slate-400 hover:text-rose-500 p-2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {hasilPencarian.map((s, i) => (
                        <tr
                          key={s.id ?? i}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-4 text-center w-12 text-slate-400">
                            {i + 1}
                          </td>
                          <td className="p-4 font-bold text-slate-700">
                            {s.nama}
                          </td>
                          <td className="p-4 text-slate-500 font-mono">
                            {s.nis}
                          </td>
                          <td className="p-4 text-center">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                              Kelas {s.kelas}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {jumlahTanpaKategori > 0 && !searchTerm && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm font-medium">
                  {jumlahTanpaKategori} siswa belum diisi kategori
                  Ikhwan/Akhwat. Data ini wajib diisi sebelum siswa bisa
                  ditempatkan ke rombel Ikhwan/Akhwat (kelas 4 ke atas). Buka
                  kelas dan subkelas siswa, lalu pilih Ikhwan atau Akhwat pada
                  kolom Kategori.
                </div>
              )}

              {/* GRID KELAS */}
              {!searchTerm && !kelasDipilih && (
                <motion.div
                  key="grid-kelas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {[1, 2, 3, 4, 5, 6].map((kelas) => {
                    const adaBelumPromosi =
                      dataTerstruktur[String(kelas)] &&
                      Object.values(dataTerstruktur[String(kelas)]).some(
                        (sub) => sub.some((s) => s.is_processed === 0),
                      );
                    return (
                      <motion.div
                        key={kelas}
                        whileHover={{ y: -5 }}
                        onClick={() => setKelasDipilih(kelas)}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all group relative"
                      >
                        <div
                          className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${warnaKelas[kelas][0]} ${warnaKelas[kelas][1]} text-white shadow-lg`}
                        >
                          <FaSchool size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">
                          Kelas {kelas}
                        </h3>
                        <p className="text-slate-400 text-sm mt-2">
                          Pilih untuk manajemen rombel
                        </p>
                        {adaBelumPromosi && (
                          <div
                            className="absolute top-4 right-4 text-rose-500 animate-pulse"
                            title="Belum diproses"
                          >
                            <FaExclamationTriangle size={18} />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* SUBKELAS VIEW */}
              {!searchTerm && kelasDipilih && !subDipilih && (
                <motion.div
                  key="subkelas"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <button
                    onClick={() => setKelasDipilih(null)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                  >
                    <FaArrowLeft /> Kembali ke Daftar Kelas
                  </button>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.keys(
                      dataTerstruktur[String(kelasDipilih)] || {},
                    ).map((sub) => (
                      <div
                        key={sub}
                        onClick={() => setSubDipilih(sub)}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500 cursor-pointer text-center transition-all"
                      >
                        <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FaUser />
                        </div>
                        <h4 className="font-bold text-slate-700 text-xl">
                          {sub}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {
                            (dataTerstruktur[String(kelasDipilih)][sub] || [])
                              .length
                          }{" "}
                          Siswa
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DAFTAR SISWA VIEW */}
              {!searchTerm && kelasDipilih && subDipilih && (
                <motion.div
                  key="siswa"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <button
                    onClick={() => setSubDipilih(null)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                  >
                    <FaArrowLeft /> Kembali ke Subkelas
                  </button>
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                      <h2 className="font-bold text-slate-700">
                        Daftar Siswa {kelasDipilih} {subDipilih}
                      </h2>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                          <th className="p-4 text-center w-16">No</th>
                          <th className="p-4 text-left">Nama</th>
                          <th className="p-4 text-left">NIS</th>
                          <th className="p-4 text-center">Kategori</th>
                          <th className="p-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {dataSubkelas.map((s, i) => (
                          <tr
                            key={s.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-4 text-center text-slate-400">
                              {i + 1}
                            </td>
                            <td className="p-4 font-bold text-slate-700">
                              {s.nama}
                            </td>
                            <td className="p-4 font-mono text-slate-500">
                              {s.nis}
                            </td>
                            <td className="p-4 text-center">
                              {perluKategori(Number(s.kelas || 0)) ? (
                                <select
                                  value={s.kategori || ""}
                                  onChange={(e) =>
                                    ubahKategori(s.id, e.target.value)
                                  }
                                  className={`text-xs font-bold rounded-lg px-2 py-1.5 border outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    s.kategori
                                      ? "bg-white border-slate-200 text-slate-700"
                                      : "bg-rose-50 border-rose-200 text-rose-600"
                                  }`}
                                >
                                  <option value="" disabled>
                                    Pilih
                                  </option>
                                  <option value="ikhwan">Ikhwan</option>
                                  <option value="akhwat">Akhwat</option>
                                </select>
                              ) : (
                                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                                  Campuran
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button
                                onClick={() => setSiswaDetail(s)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Detail"
                              >
                                <FaIdCard size={18} />
                              </button>
                              <button
                                onClick={() => handleDownloadSiswaPDF(s)}
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                title="Cetak"
                              >
                                <FaPrint size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MODAL DETAIL KARTU */}
            <AnimatePresence>
              {siswaDetail && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl p-8 relative max-w-lg w-full shadow-2xl border border-white"
                  >
                    <button
                      onClick={() => setSiswaDetail(null)}
                      className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 text-2xl transition-colors"
                    >
                      <FaTimes />
                    </button>
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">
                        Preview Kartu Digital
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Pratinjau kartu untuk dicetak
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex justify-center border border-slate-100 shadow-inner overflow-hidden">
                      <div id={`kartu-${siswaDetail.id}`} className="bg-white">
                        <KartuDigitalSiswaATM data={siswaDetail.raw} />
                      </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={() => setSiswaDetail(null)}
                        className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                      >
                        Tutup
                      </button>
                      <button
                        onClick={() => handleDownloadSiswaPDF(siswaDetail)}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <FaPrint /> Download PDF
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* FOOTER - SELALU DI BAWAH KARENA FLEX-COL MIN-H-SCREEN */}
      <Footer />
    </div>
  );
}
