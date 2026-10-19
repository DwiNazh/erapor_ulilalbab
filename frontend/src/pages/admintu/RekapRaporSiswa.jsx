import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import api from "../../api";

import {
  FaGraduationCap,
  FaFileExcel,
  FaPrint,
  FaSearch,
  FaBookOpen,
  FaHistory,
  FaChalkboardTeacher,
  FaSpinner,
  FaClipboardList,
  FaEye,
} from "react-icons/fa";

const API_BASE = "/api/tu/rekap-rapor";

export default function RekapRaporSiswa() {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRombelId, setSelectedRombelId] = useState("");
  const [selectedRombelLabel, setSelectedRombelLabel] = useState("");

  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedYear, setSelectedYear] = useState("");

  const [selectedJenisRapor, setSelectedJenisRapor] = useState("PTS");

  const [kelasList, setKelasList] = useState([]);
  const [dataSiswa, setDataSiswa] = useState([]);

  const [tahunList, setTahunList] = useState([]);
  const [loadingTahun, setLoadingTahun] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingKelas, setLoadingKelas] = useState(false);

  const [error, setError] = useState(null);

  // ==========================
  // HELPER: CONVERT SEMESTER
  // ==========================
  const convertSemester = (val) => {
    if (val === 1 || val === "1") return "1";
    if (val === 2 || val === "2") return "2";

    if (String(val).toLowerCase() === "ganjil") return "1";
    if (String(val).toLowerCase() === "genap") return "2";

    return "1";
  };

  // ==========================
  // FETCH TAHUN AJARAN
  // ==========================
  const fetchTahunAjaran = useCallback(async () => {
    setLoadingTahun(true);
    setError(null);

    try {
      const res = await api.get("/api/tu/tahunajaran");
      const list = res.data?.data ?? [];

      setTahunList(list);

      const aktif = list.find((t) => t.aktif == 1);

      if (aktif) {
        setSelectedYear(aktif.nama);
        setSelectedSemester(convertSemester(aktif.semester_aktif));
      } else if (list.length > 0) {
        setSelectedYear(list[0].nama);
        setSelectedSemester(convertSemester(list[0].semester_aktif));
      }
    } catch (err) {
      console.error("Fetch tahun ajaran error:", err);
      setError("Gagal memuat daftar tahun ajaran.");
      setTahunList([]);
    } finally {
      setLoadingTahun(false);
    }
  }, []);

  useEffect(() => {
    fetchTahunAjaran();
  }, [fetchTahunAjaran]);

  // ==========================
  // AUTO SET SEMESTER DARI DB
  // ==========================
  useEffect(() => {
    if (!selectedYear) return;

    const tahun = tahunList.find((t) => t.nama === selectedYear);

    if (tahun?.semester_aktif) {
      setSelectedSemester(convertSemester(tahun.semester_aktif));
    }
  }, [selectedYear, tahunList]);

  // ==========================
  // FETCH LIST ROMBEL
  // ==========================
  const fetchKelas = useCallback(async () => {
    if (!selectedYear || !selectedSemester || !selectedJenisRapor) return;

    setLoadingKelas(true);
    setError(null);

    setSelectedRombelId("");
    setSelectedRombelLabel("");
    setSearchTerm("");
    setDataSiswa([]);

    try {
      const res = await api.get(`${API_BASE}/kelas`, {
        params: {
          tahun: selectedYear,
          semester: selectedSemester,
          jenis_rapor: selectedJenisRapor,
        },
      });

      setKelasList(res.data?.data ?? []);
    } catch (err) {
      console.error("Fetch kelas error:", err);
      setError("Gagal memuat daftar kelas.");
      setKelasList([]);
    } finally {
      setLoadingKelas(false);
    }
  }, [selectedYear, selectedSemester, selectedJenisRapor]);

  useEffect(() => {
    fetchKelas();
  }, [fetchKelas]);

  // ==========================
  // FETCH DATA SISWA (LIST)
  // ==========================
  const fetchListSiswa = useCallback(async () => {
    if (!selectedRombelId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`${API_BASE}`, {
        params: {
          tahun: selectedYear,
          semester: selectedSemester,
          jenis_rapor: selectedJenisRapor,
          rombel_id: selectedRombelId,
          search: searchTerm || undefined,
        },
      });

      setDataSiswa(res.data?.data ?? []);
    } catch (err) {
      console.error("Fetch siswa error:", err);
      setError("Gagal memuat daftar siswa.");
      setDataSiswa([]);
    } finally {
      setLoading(false);
    }
  }, [
    selectedRombelId,
    selectedYear,
    selectedSemester,
    selectedJenisRapor,
    searchTerm,
  ]);

  useEffect(() => {
    if (!selectedRombelId) return;

    const delay = setTimeout(() => {
      fetchListSiswa();
    }, 400);

    return () => clearTimeout(delay);
  }, [fetchListSiswa, selectedRombelId]);

  // ==========================
  // STATISTIK
  // ==========================
  const statistik = useMemo(() => {
    if (!dataSiswa || dataSiswa.length === 0) {
      return {
        jumlahSiswa: 0,
      };
    }

    return {
      jumlahSiswa: dataSiswa.length,
    };
  }, [dataSiswa]);

  // ==========================
  // EXPORT PARAMS
  // ==========================
  const exportParams = useMemo(() => {
    return new URLSearchParams({
      tahun: selectedYear,
      semester: selectedSemester,
      jenis_rapor: selectedJenisRapor,
      rombel_id: selectedRombelId,
    }).toString();
  }, [selectedYear, selectedSemester, selectedJenisRapor, selectedRombelId]);

  const exportExcelUrl = selectedRombelId
    ? `http://localhost:8000${API_BASE}/export-excel?${exportParams}`
    : "#";

  const cetakUrl = selectedRombelId
    ? `http://localhost:8000${API_BASE}/cetak?${exportParams}`
    : "#";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FaGraduationCap className="text-emerald-600" />
              </div>
              Rekapitulasi Rapor Siswa (TU)
            </h1>

            <p className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-semibold">
              TA {selectedYear || "-"} &nbsp;|&nbsp; Semester{" "}
              {selectedSemester === "1" ? "Ganjil" : "Genap"} &nbsp;|&nbsp;{" "}
              {selectedJenisRapor}
              {selectedRombelLabel && (
                <span> &nbsp;|&nbsp; Kelas {selectedRombelLabel}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={exportExcelUrl}
              onClick={(e) => !selectedRombelId && e.preventDefault()}
              className={`flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl
                text-slate-600 hover:bg-slate-50 transition-all shadow-sm text-sm font-semibold
                ${!selectedRombelId ? "opacity-40 pointer-events-none" : ""}`}
            >
              <FaFileExcel className="text-emerald-600" /> Export Excel
            </a>

            <a
              href={cetakUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => !selectedRombelId && e.preventDefault()}
              className={`flex items-center gap-2 bg-emerald-600 px-4 py-2.5 rounded-xl text-white
                hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 text-sm font-semibold
                ${!selectedRombelId ? "opacity-40 pointer-events-none" : ""}`}
            >
              <FaPrint /> Cetak Rekap
            </a>
          </div>
        </div>

        {/* ================= FILTER TOOLBAR ================= */}
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Tahun */}
            <div className="relative min-w-[170px]">
              <select
                disabled={loadingTahun}
                className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-8 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-60"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {tahunList.length === 0 && (
                  <option value="">
                    {loadingTahun ? "Memuat tahun ajaran..." : "Tidak ada data"}
                  </option>
                )}

                {tahunList.map((t) => (
                  <option key={t.id} value={t.nama}>
                    {t.nama} {t.aktif == 1 ? "(Aktif)" : ""}
                  </option>
                ))}
              </select>

              <FaHistory className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 text-xs pointer-events-none" />
            </div>

            {/* Semester */}
            <div className="relative min-w-[170px]">
              <select
                className="w-full appearance-none bg-emerald-50 border border-emerald-100 rounded-xl pl-10 pr-8 py-2.5 text-sm font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="1">Semester Ganjil</option>
                <option value="2">Semester Genap</option>
              </select>

              <FaBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 text-xs pointer-events-none" />
            </div>

            {/* Jenis Rapor */}
            <div className="relative min-w-[170px]">
              <select
                className="w-full appearance-none bg-indigo-50 border border-indigo-100 rounded-xl pl-10 pr-8 py-2.5 text-sm font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                value={selectedJenisRapor}
                onChange={(e) => setSelectedJenisRapor(e.target.value)}
              >
                <option value="PTS">PTS</option>
                <option value="PAS">PAS</option>
              </select>

              <FaClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 text-xs pointer-events-none" />
            </div>

            {/* Pilih Rombel */}
            <div className="relative min-w-[180px]">
              <select
                disabled={loadingKelas}
                className={`w-full appearance-none rounded-xl pl-10 pr-8 py-2.5 text-sm font-bold
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all border
                  ${
                    selectedRombelId
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-white text-slate-600 border-slate-300"
                  } ${loadingKelas ? "opacity-60 cursor-wait" : ""}`}
                value={selectedRombelId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedRombelId(val);

                  const obj = kelasList.find(
                    (k) => String(k.id) === String(val)
                  );

                  setSelectedRombelLabel(obj?.label || obj?.nama || "");
                }}
              >
                <option value="">
                  {loadingKelas ? "Memuat kelas…" : "— Pilih Kelas —"}
                </option>

                {kelasList.map((k) => (
                  <option key={k.id} value={k.id}>
                    Kelas {k.label || k.nama}
                  </option>
                ))}
              </select>

              <FaChalkboardTeacher
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none
                  ${selectedRombelId ? "text-emerald-200" : "text-emerald-500"}`}
              />
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder={
                  selectedRombelId
                    ? "Cari nama atau NIS…"
                    : "Pilih kelas terlebih dahulu"
                }
                disabled={!selectedRombelId}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none
                  focus:ring-2 focus:ring-emerald-500 text-sm transition-all shadow-sm
                  disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-6 px-5 py-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-semibold">
            ⚠ {error}
          </div>
        )}

        {/* ================= STATE BELUM PILIH KELAS ================= */}
        {!selectedRombelId && !loadingKelas && (
          <div className="bg-white rounded-[24px] border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2">
              <FaChalkboardTeacher className="text-emerald-400 text-2xl" />
            </div>
            <p className="text-slate-700 font-semibold text-base">
              Pilih kelas untuk melihat rekap rapor
            </p>
            <p className="text-slate-400 text-sm max-w-sm">
              Silakan pilih <strong>Tahun Ajaran</strong>,{" "}
              <strong>Semester</strong>, <strong>Jenis Rapor</strong>, dan{" "}
              <strong>Kelas</strong>.
            </p>
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="bg-white rounded-[24px] border border-slate-100 py-16 flex flex-col items-center gap-3 mb-6">
            <FaSpinner className="text-emerald-500 text-2xl animate-spin" />
            <p className="text-slate-400 text-sm font-medium">
              Memuat daftar siswa…
            </p>
          </div>
        )}

        {/* ================= STAT ================= */}
        {selectedRombelId && !loading && dataSiswa.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm">
              <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                Jumlah Siswa
              </p>
              <p className="text-2xl font-black text-slate-700">
                {statistik.jumlahSiswa}
              </p>
            </div>
          </div>
        )}

        {/* ================= TABLE SISWA ================= */}
        {selectedRombelId && !loading && (
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-8">
                      #
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Identitas Siswa
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {dataSiswa.length > 0 ? (
                    dataSiswa.map((row, index) => (
                      <tr
                        key={`${row.siswa_id}-${index}`}
                        className="hover:bg-emerald-50/20 transition-all group"
                      >
                        <td className="px-6 py-4 text-xs text-slate-400 font-bold">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors flex-shrink-0">
                              {(row.nama ?? "-").substring(0, 2)}
                            </div>

                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">
                                {row.nama ?? "-"}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                NIS: {row.nis ?? "-"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <Link to={`/dashboardtusd/rekap-rapor/${row.siswa_id}?tahun=${selectedYear}&semester=${selectedSemester}&jenis_rapor=${selectedJenisRapor}&rombel_id=${selectedRombelId}`}                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition shadow-sm">
                            <FaEye />
                            Lihat Rapor
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <FaHistory className="text-slate-200 text-4xl mb-3" />
                          <p className="text-slate-400 text-sm font-medium italic">
                            Tidak ada data siswa untuk Kelas {selectedRombelLabel}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {dataSiswa.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Menampilkan {dataSiswa.length} siswa dari Kelas{" "}
                  {selectedRombelLabel}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ================= INFO FOOTER ================= */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Status: Data terenkripsi dan sinkron dengan server
        </div>
      </main>
    </div>
  );
}