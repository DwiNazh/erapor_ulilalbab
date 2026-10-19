import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../../api";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";

import { FaPrint, FaArrowLeft, FaSyncAlt, FaFileAlt } from "react-icons/fa";

import logoKiri from "../../assets/logo-kiri.jpg";
import logoKanan from "../../assets/logo-kanan.jpg";

// ============================================================
// HELPERS
// ============================================================
function ketercapaianLabel(nilai) {
  if (nilai === null || nilai === undefined) return "-";
  return nilai >= 75
    ? "Penguasaan Kompetensi sudah Tercapai"
    : "Penguasaan Kompetensi Belum tercapai dan perlu bimbingan";
}

const GRADE_LABEL = {
  A: "A — Sangat Baik",
  B: "B — Baik",
  C: "C — Cukup",
  D: "D — Perlu Bimbingan",
  E: "E — Kurang",
};

const JENIS_RAPOR_HEADER = {
  PTS: "LAPORAN PENILAIAN TENGAH SEMESTER (PTS) KOMPETENSI PESERTA DIDIK",
  PAS: "LAPORAN PENILAIAN AKHIR SEMESTER (PAS) KOMPETENSI PESERTA DIDIK",
};

// ============================================================
// SUB-KOMPONEN KECIL
// ============================================================
function Row({ label, value, w = "w-40" }) {
  return (
    <div className="flex text-sm">
      <span className={`${w} shrink-0`}>{label}</span>
      <span>: {value}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[12px] font-bold uppercase mb-1 mt-2 tracking-wide text-slate-800">
      {children}
    </p>
  );
}

// ============================================================
// KOMPONEN RAPOR FULL
// ============================================================
function RaporSiswaCard({ dataRapor, semester, tahunAjaran, jenisRapor }) {
  const kehadiran = dataRapor.rekap_kehadiran || { sakit: 0, izin: 0, alpha: 0 };
  const mapelBiasa = dataRapor.mapel || [];
  const kokurikulerAspek = dataRapor.kokurikuler?.aspek || [];
  const ekstrakurikulerList = dataRapor.ekstrakurikuler || [];

  // Membaca format pecahan Al-Qur'an (tahfidz & tilawah) dari backend response
  const nilaiQuranObj = dataRapor.nilai_quran || {
    tahfidz: { nilai: null, deskripsi: null },
    tilawah: { nilai: null, deskripsi: null },
  };

  const getFormattedDate = () => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return `Batam, ${new Date().toLocaleDateString("id-ID", options)}`;
  };

  return (
    <div
      className="bg-white shadow-2xl rounded-3xl p-8 mx-auto print:shadow-none"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        width: "210mm",
        minHeight: "297mm",
        padding: "5mm",
      }}
    >
      {/* HEADER */}
      <div className="mb-4">
          <table className="w-full border-collapse">
          <div className="flex items-center gap-4 border-b-4 border-slate-900 pb-3 mb-5">
            <div className="w-14 h-14 shrink-0">
              <img
                src={logoKiri}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 text-center">
              <p className="text-[12px] font-bold uppercase leading-tight tracking-wide text-slate-800">
                {JENIS_RAPOR_HEADER[jenisRapor]}
              </p>

              <p className="text-[11px] font-bold uppercase tracking-wide mt-0.5 text-slate-500">
                Kompetensi Peserta Didik
              </p>

              <p className="text-[14px] font-black uppercase tracking-wide mt-1 text-indigo-900">
                SEKOLAH DASAR ISLAM TERPADU (SDIT) ULIL ALBAB
              </p>

              <p className="text-[9px] text-slate-400 mt-0.5">
                Jl. Tiban Utara No. 1 Patam Lestari Sekupang Batam 29427
                Telp. (0778) 3553594
              </p>
            </div>

            <div className="w-14 h-14 shrink-0">
              <img
                src={logoKanan}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </table>

        <div className="mt-2.5">
          <div className="border-t-[1.5px] border-slate-900"></div>
          <div className="border-t border-slate-900 mt-[1.5px]"></div>
        </div>
      </div>

      {/* IDENTITAS */}
      <div className="grid grid-cols-2 gap-x-8 mb-5 text-[12px]">
        <div className="space-y-0.5">
          <Row
            label="Nama Peserta Didik"
            value={<strong>{dataRapor.nama}</strong>}
            w="w-44"
          />
          <Row label="NIS/NISN" value={dataRapor.nis} w="w-44" />
          <Row label="Nama Sekolah" value="SDIT Ulil Albab Batam" w="w-44" />
          <Row
            label="Alamat"
            value="Jl. Tiban Utara No. 1 Patam Lestari Sekupang Batam"
            w="w-44"
          />
        </div>

        <div className="space-y-0.5">
          <Row label="Kelas" value={dataRapor.kelas} w="w-36" />
          <Row
            label="Semester"
            value={semester === "1" ? "1 ( Ganjil )" : "2 ( Genap )"}
            w="w-36"
          />
          <Row label="Tahun Pelajaran" value={tahunAjaran} w="w-36" />
        </div>
      </div>

      {/* A. INTRAKURIKULER */}
      <SectionTitle>A. Penilaian Intrakurikuler</SectionTitle>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-[11.5px] border-slate-900">
          <thead className="print:table-header-group">
            <tr className="text-center font-bold uppercase">
              <th className="border border-slate-900 p-1 w-8">No</th>
              <th className="border border-slate-900 p-1" colSpan="2">
                Mata Pelajaran
              </th>
              <th className="border border-slate-900 p-1 w-20">
                Nilai Akhir
              </th>
              <th className="border border-slate-900 p-1">
                Ketercapaian Kompetensi
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="5" className="border-t-2 border-slate-900 p-0"></td>
            </tr>

            {mapelBiasa.map((m, i) => (
              <tr key={m.mapel_id ?? i}>
                <td className="border border-slate-900 p-1.5 text-center">
                  {i + 1}.
                </td>
                <td
                  className="border border-slate-900 p-1.5 font-medium"
                  colSpan="2"
                >
                  {m.nama}
                </td>
                <td className="border border-slate-900 p-1.5 text-center font-bold">
                  {m.nilai ?? "-"}
                </td>
                <td className="border border-slate-900 p-1.5 text-[10.5px] italic leading-snug">
                  {m.nilai !== null && m.nilai !== undefined
                    ? ketercapaianLabel(m.nilai)
                    : "-"}
                </td>
              </tr>
            ))}

            <tr className="font-bold">
              <td
                className="border border-slate-900 p-1.5 text-center"
                colSpan="3"
              >
                Rata-rata Nilai
              </td>
              <td className="border border-slate-900 p-1.5 text-center text-sm font-black">
                {dataRapor.rata_rata ?? "-"}
              </td>
              <td className="border border-slate-900 p-1.5 text-[10.5px] italic font-normal">
                {dataRapor.rata_rata !== null && dataRapor.rata_rata !== undefined
                  ? ketercapaianLabel(dataRapor.rata_rata)
                  : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── NILAI AL-QUR'AN (TAHFIDZ & TILAWAH) ─────────────────── */}
      {/* <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-[11.5px] border-slate-900">
          <thead className="print:table-header-group">
            <tr className="text-center font-bold uppercase">
              <th className="border border-slate-900 p-1 w-8">No</th>
              <th className="border border-slate-900 p-1 text-left">
                Mata Pelajaran / Kategori Al-Qur'an
              </th>
              <th className="border border-slate-900 p-1 w-20">Nilai Akhir</th>
              <th className="border border-slate-900 p-1 text-left">
                Deskripsi / Catatan Capaian
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="border-t-2 border-slate-900 p-0"></td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-1.5 text-center">1.</td>
              <td className="border border-slate-900 p-1.5 font-bold">
                Al-Qur'an — Tahfidz
              </td>
              <td className="border border-slate-900 p-1.5 text-center font-bold">
                {nilaiQuranObj.tahfidz?.nilai ?? "-"}
              </td>
              <td className="border border-slate-900 p-1.5 text-[10.5px] italic leading-snug">
                {nilaiQuranObj.tahfidz?.deskripsi ||
                  (nilaiQuranObj.tahfidz?.nilai !== null
                    ? ketercapaianLabel(nilaiQuranObj.tahfidz.nilai)
                    : "-")}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-1.5 text-center">2.</td>
              <td className="border border-slate-900 p-1.5 font-bold">
                Al-Qur'an — Tilawah
              </td>
              <td className="border border-slate-900 p-1.5 text-center font-bold">
                {nilaiQuranObj.tilawah?.nilai ?? "-"}
              </td>
              <td className="border border-slate-900 p-1.5 text-[10.5px] italic leading-snug">
                {nilaiQuranObj.tilawah?.deskripsi ||
                  (nilaiQuranObj.tilawah?.nilai !== null
                    ? ketercapaianLabel(nilaiQuranObj.tilawah.nilai)
                    : "-")}
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
      {/* ──────────────────────────────────────────────────────────── */}

      {/* B. KOKURIKULER */}
      <SectionTitle>B. Penilaian Kokurikuler</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border-2 border-slate-900 text-[12px]">
          {jenisRapor === "PAS" ? (
            <>
              {/* Layout khusus PAS: deskripsi dipindah ke baris terpisah agar tidak terpotong saat panjang */}
              <thead>
                <tr className="bg-slate-100 text-center font-bold uppercase text-slate-700">
                  <th className="border-2 border-slate-900 p-1.5 w-8">No</th>
                  <th className="border-2 border-slate-900 p-1.5 text-left">
                    Aspek Kokurikuler
                  </th>
                  <th className="border-2 border-slate-900 p-1.5 w-12">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {kokurikulerAspek.length > 0 ? (
                  kokurikulerAspek.map((k, i) => (
                    <React.Fragment key={i}>
                      <tr className="hover:bg-slate-50/50">
                        <td className="border-2 border-slate-900 p-1.5 text-center">
                          {i + 1}.
                        </td>
                        <td className="border-2 border-slate-900 p-1.5 font-bold text-slate-800">
                          {k.nama}
                        </td>
                        <td className="border-2 border-slate-900 p-1.5 text-center font-black text-sm text-indigo-700">
                          {k.nilai ?? "-"}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td
                          colSpan="3"
                          className="border-2 border-slate-900 p-1.5 text-[11px] italic leading-snug text-slate-600"
                        >
                          <span className="font-bold not-italic text-slate-700 uppercase text-[10px] mr-1">
                            Deskripsi:
                          </span>
                          {k.deskripsi || (k.nilai ? GRADE_LABEL[k.nilai] ?? "-" : "-")}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="border-2 border-slate-900 p-3 text-center text-slate-400 italic text-[11px]"
                    >
                      Belum ada data kokurikuler terisi pada semester ini
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr className="bg-slate-100 text-center font-bold uppercase text-slate-700">
                  <th className="border-2 border-slate-900 p-1.5 w-8">No</th>
                  <th className="border-2 border-slate-900 p-1.5 text-left">
                    Aspek Kokurikuler
                  </th>
                  <th className="border-2 border-slate-900 p-1.5 w-12">Nilai</th>
                  <th className="border-2 border-slate-900 p-1.5 text-left">
                    Deskripsi
                  </th>
                </tr>
              </thead>
              <tbody>
                {kokurikulerAspek.length > 0 ? (
                  kokurikulerAspek.map((k, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="border-2 border-slate-900 p-1.5 text-center">
                        {i + 1}.
                      </td>
                      <td className="border-2 border-slate-900 p-1.5 font-bold text-slate-800">
                        {k.nama}
                      </td>
                      <td className="border-2 border-slate-900 p-1.5 text-center font-black text-sm text-indigo-700">
                        {k.nilai ?? "-"}
                      </td>
                      <td className="border-2 border-slate-900 p-1.5 text-[11px] italic leading-snug text-slate-600">
                        {k.deskripsi || (k.nilai ? GRADE_LABEL[k.nilai] ?? "-" : "-")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="border-2 border-slate-900 p-3 text-center text-slate-400 italic text-[11px]"
                    >
                      Belum ada data kokurikuler terisi pada semester ini
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}
        </table>
      </div>

      {/* C. EKSTRAKURIKULER */}
      <SectionTitle>C. Penilaian Ekstrakurikuler</SectionTitle>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-[11.5px] border-slate-900">
          <thead className="print:table-header-group">
            <tr className="text-center font-bold uppercase">
              <th className="border border-slate-900 p-1 w-8">No</th>
              <th className="border border-slate-900 p-1">
                Kegiatan Ekstrakurikuler
              </th>
              <th className="border border-slate-900 p-1 w-12">Nilai</th>
              <th className="border border-slate-900 p-1">Deskripsi</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="4" className="border-t-2 border-slate-900 p-0"></td>
            </tr>

            {ekstrakurikulerList.length > 0 ? (
              ekstrakurikulerList.map((e, i) => (
                <tr key={e.id ?? i}>
                  <td className="border border-slate-900 p-1.5 text-center">
                    {i + 1}.
                  </td>
                  <td className="border border-slate-900 p-1.5 font-medium">
                    {e.nama}
                    {e.wajib && (
                      <span className="ml-1.5 text-[8.5px] bg-slate-100 border border-slate-200 px-1 py-0.5 rounded uppercase font-bold text-slate-500">
                        Wajib
                      </span>
                    )}
                  </td>
                  <td className="border border-slate-900 p-1.5 text-center font-black text-sm">
                    {e.nilai ?? "-"}
                  </td>
                  <td className="border border-slate-900 p-1.5 text-[10.5px] italic leading-snug">
                    {e.deskripsi || (e.nilai ? GRADE_LABEL[e.nilai] ?? "-" : "-")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border border-slate-900 p-2 text-center text-slate-400 italic text-[10.5px]"
                >
                  Belum ada data ekstrakurikuler
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CATATAN + KEHADIRAN + TTD */}
      <div className="grid grid-cols-5 gap-x-5 mt-4 print:break-inside-avoid print:page-break-inside-avoid">
        <div className="col-span-3 border border-slate-900">
          <div className="bg-slate-900 text-white px-3 py-1 text-[10.5px] font-bold uppercase">
            Catatan Wali Kelas
          </div>
          <div className="p-3 min-h-[60px]">
            <p className="text-[11.5px] italic text-slate-700 whitespace-pre-wrap">
              {dataRapor.catatan_wali_kelas || (
                <span className="text-slate-400">Tidak ada catatan</span>
              )}
            </p>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-y-3.5">
          <table className="w-full border-collapse border border-slate-900 text-[10.5px] font-bold uppercase">
            <tbody>
              <tr>
                <th
                  colSpan="2"
                  className="bg-slate-900 text-white p-1.5 border border-slate-900 text-center"
                >
                  Ketidak Hadiran
                </th>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1.5">Sakit</td>
                <td className="border border-slate-900 p-1.5 text-center font-normal">
                  : {kehadiran.sakit ?? 0} hari
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1.5">Izin</td>
                <td className="border border-slate-900 p-1.5 text-center font-normal">
                  : {kehadiran.izin ?? 0} hari
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1.5">
                  Tanpa Keterangan
                </td>
                <td className="border border-slate-900 p-1.5 text-center font-normal">
                  : {kehadiran.alpha ?? 0} hari
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-right text-[11.5px] font-normal">
            <p>{getFormattedDate()}</p>
            <p className="font-bold mt-0.5">Guru Kelas,</p>

            <div className="mt-14">
              <p className="font-bold underline decoration-[1.5px] uppercase text-[12px]">
                {dataRapor.nama_guru || "Nama Guru"}
              </p>

              {dataRapor.nip_guru && (
                <p className="text-[10.5px] font-bold">
                  NIP. {dataRapor.nip_guru}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-right text-[9px] text-slate-400 mt-4 border-t border-slate-100 pt-1">
        {dataRapor.nama} | 1
      </div>
    </div>
  );
}

// ============================================================
// HALAMAN DETAIL RAPOR TU
// ============================================================
export default function DetailRaporSiswaTU() {
  const { siswa_id } = useParams();
  const [searchParams] = useSearchParams();

  const tahun = searchParams.get("tahun");
  const semester = searchParams.get("semester");
  const jenisRapor = searchParams.get("jenis_rapor");
  const rombel_id = searchParams.get("rombel_id");

  const [dataRapor, setDataRapor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    if (!tahun || !semester || !jenisRapor || !rombel_id || !siswa_id) {
      toast.error("Parameter tidak lengkap.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/api/tu/rekap-rapor/detail", {
        params: {
          siswa_id,
          tahun,
          semester,
          jenis_rapor: jenisRapor,
          rombel_id,
        },
      });

      setDataRapor(res.data?.data || null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat detail rapor siswa.");
      setDataRapor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [siswa_id, tahun, semester, jenisRapor, rombel_id]);

  const handlePrint = () => {
    if (!dataRapor) {
      toast.error("Data rapor belum tersedia");
      return;
    }
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="print:hidden">
        <SidebarAdminTu />
      </div>

      <main className="flex-1 p-4 lg:p-6 print:p-0">
        <div className="max-w-5xl mx-auto space-y-4 print:space-y-0 print:max-w-full">
          {/* TOOLBAR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 print:hidden">
            <div>
              <h1 className="text-xl font-black text-slate-800 italic uppercase">
                DETAIL RAPOR <span className="text-indigo-600">{jenisRapor}</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Semester {semester} • {tahun}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-2"
              >
                <FaArrowLeft />
                Kembali
              </button>

              <button
                onClick={fetchDetail}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-2"
              >
                <FaSyncAlt />
                Refresh
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2"
              >
                <FaPrint />
                Cetak
              </button>
            </div>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 print:hidden">
              <FaSyncAlt className="animate-spin text-3xl mb-3" />
              <p className="font-medium tracking-widest uppercase text-[10px]">
                Memuat Detail Rapor...
              </p>
            </div>
          ) : !dataRapor ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 print:hidden">
              <FaFileAlt className="text-3xl mb-3" />
              <p className="font-medium text-xs">Rapor belum tersedia</p>
            </div>
          ) : (
            <RaporSiswaCard
              dataRapor={dataRapor}
              semester={semester}
              tahunAjaran={tahun}
              jenisRapor={jenisRapor}
            />
          )}
        </div>
      </main>
    </div>
  );
}