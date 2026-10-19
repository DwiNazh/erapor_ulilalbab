import React, { useEffect, useState } from "react";
import api from "../../api";
import SidebarSiswa from "../../components/SidebarSiswa";
import logoKiri from "../../assets/logo-kiri.jpg";
import logoKanan from "../../assets/logo-kanan.jpg";
import toast from "react-hot-toast";
import { FaSyncAlt, FaFileAlt, FaPrint, FaLock } from "react-icons/fa";

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
// KOMPONEN RAPOR SISWA
// ============================================================
function RaporSiswaCard({ dataRapor, semester, tahunAjaran, jenisRapor }) {
  const kehadiran = dataRapor.rekap_kehadiran || { sakit: 0, izin: 0, alpha: 0 };
  const mapelBiasa = dataRapor.mapel || [];
  const kokurikulerAspek = dataRapor.kokurikuler?.aspek || [];
  const ekstrakurikulerList = dataRapor.ekstrakurikuler || [];
  const nilaiQuran = dataRapor.nilai_quran || { nilai: null, deskripsi: null };

  const getFormattedDate = () => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return `Batam, ${new Date().toLocaleDateString("id-ID", options)}`;
  };

  return (
    <div
      className="bg-white mx-auto print:shadow-none"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        width: "210mm",
        minHeight: "297mm",
        padding: "5mm",
      }}
    >
      {/* HEADER SEKOLAH */}
      <div className="mb-4">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="w-[120px] align-middle">
                <div className="flex justify-center">
                  <img
                    src={logoKiri}
                    alt="Logo Kiri"
                    style={{ width: "85px", height: "85px", objectFit: "contain" }}
                  />
                </div>
              </td>

              <td className="text-center align-middle px-1">
                <p className="text-[10px] font-black uppercase leading-tight">
                  {JENIS_RAPOR_HEADER[jenisRapor] ||
                    `LAPORAN PENILAIAN (${jenisRapor}) KOMPETENSI PESERTA DIDIK`}
                </p>
                <p className="text-[14px] font-black uppercase leading-tight mt-1">
                  SEKOLAH DASAR ISLAM TERPADU (SDIT) ULIL ALBAB
                </p>
                <p className="text-[8.5px] leading-tight mt-1.5 font-normal">
                  Jl. Tiban Utara No. 1 Patam Lestari Sekupang Batam 29427 Telp.
                  (0778) 3553594 email : sdulilalbab@gmail.com
                </p>
              </td>

              <td className="w-[120px] align-middle">
                <div className="flex justify-center">
                  <img
                    src={logoKanan}
                    alt="Logo Kanan"
                    style={{ width: "95px", height: "95px", objectFit: "contain" }}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-2.5">
          <div className="border-t-[1.5px] border-slate-900"></div>
          <div className="border-t border-slate-900 mt-[1.5px]"></div>
        </div>
      </div>

      {/* IDENTITAS SISWA */}
      <div className="grid grid-cols-2 gap-x-8 mb-5 text-[12px]">
        <div className="space-y-0.5">
          <Row label="Nama Peserta Didik" value={<strong>{dataRapor.nama}</strong>} w="w-44" />
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

      {/* A. NILAI INTRAKURIKULER */}
      <SectionTitle>A. Penilaian Intrakurikuler</SectionTitle>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-[11.5px] border-slate-900">
          <thead className="print:table-header-group">
            <tr className="text-center font-bold uppercase">
              <th className="border border-slate-900 p-1 w-8">No</th>
              <th className="border border-slate-900 p-1" colSpan="2">Mata Pelajaran</th>
              <th className="border border-slate-900 p-1 w-20">Nilai Akhir</th>
              <th className="border border-slate-900 p-1">Ketercapaian Kompetensi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="border-t-2 border-slate-900 p-0"></td>
            </tr>
            {mapelBiasa.map((m, i) => (
              <tr key={m.mapel_id ?? i}>
                <td className="border border-slate-900 p-1.5 text-center">{i + 1}.</td>
                <td className="border border-slate-900 p-1.5 font-medium" colSpan="2">{m.nama}</td>
                <td className="border border-slate-900 p-1.5 text-center font-bold">{m.nilai ?? "-"}</td>
                <td className="border border-slate-900 p-1.5 text-[10.5px] italic leading-snug">
                  {m.nilai !== null && m.nilai !== undefined ? ketercapaianLabel(m.nilai) : "-"}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="border border-slate-900 p-1.5 text-center" colSpan="3">Rata-rata Nilai</td>
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

      {/* A1. NILAI AL-QUR'AN */}
      {/* <SectionTitle>A1. Penilaian Al-Qur'an</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-[11.5px] border-slate-900">
          <thead className="print:table-header-group">
            <tr className="text-center font-bold uppercase">
              <th className="border border-slate-900 p-1 w-8">No</th>
              <th className="border border-slate-900 p-1" colSpan="2">Mata Pelajaran</th>
              <th className="border border-slate-900 p-1 w-20">Nilai Akhir</th>
              <th className="border border-slate-900 p-1">Deskripsi / Catatan</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan="5" className="border-t-2 border-slate-900 p-0"></td></tr>
            <tr>
              <td className="border border-slate-900 p-1.5 text-center">1.</td>
              <td className="border border-slate-900 p-1.5 font-medium" colSpan="2">Al-Qur'an</td>
              <td className="border border-slate-900 p-1.5 text-center font-bold">
                {nilaiQuran.nilai ?? "-"}
              </td>
              <td className="border border-slate-900 p-1.5 text-[10.5px] italic leading-snug">
                {nilaiQuran.deskripsi || (
                  nilaiQuran.nilai !== null ? ketercapaianLabel(nilaiQuran.nilai) : "-"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}

      {/* B. NILAI KOKURIKULER */}
      <SectionTitle>B. Penilaian Kokurikuler</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-[11.5px] border-slate-900">
          <thead className="print:table-header-group">
            <tr className="text-center font-bold uppercase">
              <th className="border border-slate-900 p-1 w-8">No</th>
              <th className="border border-slate-900 p-1">Aspek Kokurikuler</th>
              <th className="border border-slate-900 p-1 w-12">Nilai</th>
              <th className="border border-slate-900 p-1">Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="border-t-2 border-slate-900 p-0"></td>
            </tr>
            {kokurikulerAspek.length > 0 ? (
              kokurikulerAspek.map((k, i) => (
                <tr key={i}>
                  <td className="border border-slate-900 p-1.5 text-center">{i + 1}.</td>
                  <td className="border border-slate-900 p-1.5 font-medium">{k.nama}</td>
                  <td className="border border-slate-900 p-1.5 text-center font-black text-sm">{k.nilai ?? "-"}</td>
                  <td className="border border-slate-900 p-1.5 text-[10.5px] italic leading-snug">{k.deskripsi || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-slate-900 p-2 text-center text-slate-400 italic text-[10.5px]">
                  Belum ada data kokurikuler
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* C. NILAI EKSTRAKURIKULER */}
      <SectionTitle>C. Penilaian Ekstrakurikuler</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse text-[11.5px] border-slate-900">
          <thead className="print:table-header-group">
            <tr className="text-center font-bold uppercase">
              <th className="border border-slate-900 p-1 w-8">No</th>
              <th className="border border-slate-900 p-1">Kegiatan Ekstrakurikuler</th>
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
                  <td className="border border-slate-900 p-1.5 text-center">{i + 1}.</td>
                  <td className="border border-slate-900 p-1.5 font-medium">
                    {e.nama}
                    {e.wajib && (
                      <span className="ml-1.5 text-[8.5px] bg-slate-100 border border-slate-200 px-1 py-0.5 rounded uppercase font-bold text-slate-500">
                        Wajib
                      </span>
                    )}
                  </td>
                  <td className="border border-slate-900 p-1.5 text-center font-black text-sm">{e.nilai ?? "-"}</td>
                  <td className="border border-slate-900 p-1.5 text-[10.5px] italic leading-snug">
                    {e.deskripsi || (e.nilai ? GRADE_LABEL[e.nilai] ?? "-" : "-")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-slate-900 p-2 text-center text-slate-400 italic text-[10.5px]">
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
          <div className="border-t border-slate-900">
            <div className="px-3 py-1 text-[10.5px] font-bold uppercase border-b border-slate-900">
              Komentar Orang Tua
            </div>
            <div className="p-3 min-h-[40px]">
              <p className="text-[11.5px] italic text-slate-400">
                {dataRapor.komentar_orang_tua || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-y-3.5">
          <table className="w-full border-collapse border border-slate-900 text-[10.5px] font-bold uppercase">
            <tbody>
              <tr>
                <th colSpan="2" className="bg-slate-900 text-white p-1.5 border border-slate-900 text-center">
                  Ketidak Hadiran
                </th>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1.5">Sakit</td>
                <td className="border border-slate-900 p-1.5 text-center font-normal">: {kehadiran.sakit ?? 0} hari</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1.5">Izin</td>
                <td className="border border-slate-900 p-1.5 text-center font-normal">: {kehadiran.izin ?? 0} hari</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1.5">Tanpa Keterangan</td>
                <td className="border border-slate-900 p-1.5 text-center font-normal">: {kehadiran.alpha ?? 0} hari</td>
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
                <p className="text-[10.5px] font-bold">NIP. {dataRapor.nip_guru}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NOMOR HALAMAN */}
      <div className="text-right text-[9px] text-slate-400 mt-4 border-t border-slate-100 pt-1">
        {dataRapor.nama} | 1
      </div>
    </div>
  );
}

// ============================================================
// HALAMAN UTAMA RAPOR SISWA
// ============================================================
export default function RaporSiswa() {
  const [tahunList, setTahunList] = useState([]);
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [semester, setSemester] = useState("1");
  const [jenisRapor, setJenisRapor] = useState("PTS");

  const [dataRapor, setDataRapor] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil daftar tahun ajaran dari endpoint yang sama dengan nilai
  const fetchTahunList = async () => {
    try {
      const res = await api.get("/api/siswa/nilai", {
        params: { semester: "1" },
      });
      const list = res.data?.tahun_list || [];
      setTahunList(list);
      if (list.length > 0 && !tahunAjaran) {
        setTahunAjaran(list[0]);
      }
    } catch {
      toast.error("Gagal memuat daftar tahun ajaran");
    }
  };

  const fetchRapor = async () => {
    if (!tahunAjaran) return;

    setLoading(true);
    try {
      const res = await api.get("/api/siswa/rapor", {
        params: {
          semester,
          jenis_rapor: jenisRapor,
          tahun_ajaran: tahunAjaran,
        },
      });
      setDataRapor(res.data?.data || null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat rapor");
      setDataRapor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTahunList();
  }, []);

  useEffect(() => {
    if (tahunAjaran) fetchRapor();
  }, [tahunAjaran, semester, jenisRapor]);

  const handlePrint = () => {
    if (!dataRapor) {
      toast.error("Data rapor belum tersedia");
      return;
    }
    if (dataRapor.finalisasi === false) {
      toast.error("Rapor belum difinalisasi");
      return;
    }
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="print:hidden">
        <SidebarSiswa />
      </div>

      <main className="flex-1 p-4 lg:p-6 print:p-0">
        <div className="max-w-5xl mx-auto space-y-4 print:space-y-0 print:max-w-full">

          {/* HEADER CONTROL */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 print:hidden">
            <div>
              <h1 className="text-xl font-black text-slate-800 italic uppercase">
                RAPOR <span className="text-indigo-600">{jenisRapor}</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Semester {semester} • {tahunAjaran || "-"}
              </p>

              {!loading && dataRapor && (
                <div className="mt-1.5">
                  {dataRapor.finalisasi ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                      Dikunci
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-bold">
                      <FaLock className="text-amber-600" />
                      Belum Finalisasi
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <select
                value={jenisRapor}
                onChange={(e) => setJenisRapor(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold focus:ring-indigo-500"
              >
                <option value="PTS">PTS</option>
                <option value="PAS">PAS</option>
              </select>

              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold focus:ring-indigo-500"
              >
                <option value="1">Ganjil (1)</option>
                <option value="2">Genap (2)</option>
              </select>

              {/* Dropdown Tahun Ajaran (seperti NilaiSiswa) */}
              <select
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold focus:ring-indigo-500"
              >
                <option value="">-- Tahun Ajaran --</option>
                {tahunList.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <button
                onClick={fetchRapor}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <FaSyncAlt />
                Refresh
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
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
                Memuat Rapor...
              </p>
            </div>
          ) : !tahunAjaran ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 print:hidden">
              <FaFileAlt className="text-3xl mb-3" />
              <p className="font-medium text-xs">Pilih tahun ajaran untuk melihat rapor</p>
            </div>
          ) : !dataRapor ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 print:hidden">
              <FaFileAlt className="text-3xl mb-3" />
              <p className="font-medium text-xs">Rapor belum tersedia</p>
            </div>
          ) : dataRapor.finalisasi === false ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-xs text-amber-700 font-semibold print:hidden">
              Rapor belum difinalisasi oleh guru, sehingga belum dapat dilihat.
            </div>
          ) : (
            <RaporSiswaCard
              dataRapor={dataRapor}
              semester={semester}
              tahunAjaran={tahunAjaran}
              jenisRapor={jenisRapor}
            />
          )}
        </div>
      </main>
    </div>
  );
}