import React, { useEffect, useState } from "react";
import api from "../../api";
import SidebarGuru from "../../components/SidebarGuru";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  FaSyncAlt,
  FaLock,
  FaUnlock,
  FaFileAlt,
  FaSave,
  FaCheckCircle,
  FaPaperPlane,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

// ============================================================
// STATUS RAPOR
// draft            → belum diajukan, bisa diedit
// pending_approval → sudah diajukan ke kepsek, menunggu
// approved         → disetujui kepsek → terkunci
// rejected         → ditolak kepsek → kembali bisa diedit
// ============================================================

function ketercapaianLabel(nilai) {
  if (nilai === null || nilai === undefined || nilai === "") return "-";
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

function getHeaderRapor(jenisRapor, semester, tahunAjaran) {
  const jenis = (jenisRapor || "").toUpperCase();
  const judulJenis =
    jenis === "PTS"
      ? "LAPORAN PENILAIAN TENGAH SEMESTER (PTS)"
      : "LAPORAN PENILAIAN AKHIR SEMESTER (PAS)";

  const semesterLabel = semester === "1" ? "SEMESTER GANJIL" : "SEMESTER GENAP";
  return `${judulJenis} ${semesterLabel} TAHUN PELAJARAN ${tahunAjaran || "-"}`;
}

// ============================================================
// STATUS BADGE HELPER
// ============================================================
function StatusBadge({ status }) {
  const map = {
    approved: {
      icon: <FaLock className="text-[9px]" />,
      label: "Disetujui & Terkunci",
      cls: "bg-emerald-100 text-emerald-700",
    },
    pending_approval: {
      icon: <FaClock className="text-[9px]" />,
      label: "Menunggu Persetujuan",
      cls: "bg-amber-100 text-amber-700",
    },
    rejected: {
      icon: <FaTimesCircle className="text-[9px]" />,
      label: "Ditolak — Perlu Revisi",
      cls: "bg-rose-100 text-rose-700",
    },
    draft: {
      icon: <FaUnlock className="text-[9px]" />,
      label: "Draft",
      cls: "bg-slate-100 text-slate-600",
    },
  };

  const cfg = map[status] ?? map.draft;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${cfg.cls}`}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ============================================================
// SUB-KOMPONEN
// ============================================================
function Row({ label, value, w = "w-40" }) {
  return (
    <div className="flex">
      <span className={`${w} shrink-0`}>{label}</span>
      <span>: {value}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[12px] font-bold uppercase mb-1 mt-2 tracking-wide border-l-4 border-indigo-600 pl-2">
      {children}
    </p>
  );
}

// ============================================================
// KARTU RAPOR (1 siswa)
// ============================================================
function RaporCard({
  siswa,
  rombel,
  tahunAktif,
  semester,
  guruAktif,
  tempNotes,
  setTempNotes,
  savingNote,
  handleSaveNote,
  jenisRapor,
}) {
  const status = siswa.approval_status || "draft";
  const isEditable = status === "draft" || status === "rejected";

  const kehadiran = siswa.rekap_kehadiran || { sakit: 0, izin: 0, alpha: 0 };
  const mapelBiasa = siswa.mapel || [];
  const kokurikulerAspek = siswa.kokurikuler?.aspek || [];
  const ekstrakurikulerList = siswa.ekstrakurikuler || [];

  // Membaca format pecahan baru (tahfidz & tilawah) dari backend response
  const nilaiQuranObj = siswa.nilai_quran || {
    tahfidz: { nilai: null, deskripsi: null },
    tilawah: { nilai: null, deskripsi: null },
  };

  const getFormattedDate = () => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return `Batam, ${new Date().toLocaleDateString("id-ID", options)}`;
  };

  const borderColor =
    status === "approved"
      ? "border-emerald-300"
      : status === "pending_approval"
        ? "border-amber-300"
        : status === "rejected"
          ? "border-rose-300"
          : "border-slate-200";

  return (
    <div
      className={`bg-white shadow-2xl border-2 relative overflow-hidden rounded-2xl ${borderColor}`}
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        padding: "40px 48px",
      }}
    >
      {/* Badge status */}
      <div className="absolute top-3 right-3 print:hidden">
        <StatusBadge status={status} />
      </div>

      {/* Banner ditolak */}
      {status === "rejected" && siswa.rejection_reason && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex gap-3 items-start print:hidden">
          <FaTimesCircle className="text-rose-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-rose-700 uppercase">
              Ditolak oleh Kepala Sekolah
            </p>
            <p className="text-xs text-rose-600 mt-0.5 italic">
              {siswa.rejection_reason}
            </p>
          </div>
        </div>
      )}

      {/* HEADER SEKOLAH */}
      <div className="flex items-center gap-4 border-b-4 border-slate-900 pb-3 mb-5">
        <div className="w-14 h-14 bg-slate-100 font-bold border border-slate-300 flex items-center justify-center shrink-0 text-[10px] text-slate-400 text-center leading-tight rounded-xl">
          LOGO
        </div>
        <div className="flex-1 text-center">
          <p className="text-[12px] font-bold uppercase leading-tight tracking-wide text-slate-800">
            {getHeaderRapor(jenisRapor, semester, tahunAktif?.nama)}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wide mt-0.5 text-slate-500">
            Kompetensi Peserta Didik
          </p>
          <p className="text-[14px] font-black uppercase tracking-wide mt-1 text-indigo-900">
            SEKOLAH DASAR ISLAM TERPADU (SDIT) ULIL ALBAB
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">
            Jl. Tiban Utara No. 1 Patam Lestari Sekupang Batam 29427 &nbsp;
            Telp. (0778) 3553594
          </p>
        </div>
        <div className="w-14 h-14 bg-slate-100 font-bold border border-slate-300 flex items-center justify-center shrink-0 text-[10px] text-slate-400 text-center leading-tight rounded-xl">
          UA LOGO
        </div>
      </div>

      {/* IDENTITAS SISWA */}
      <div className="grid grid-cols-2 gap-x-8 mb-5 text-[12px] text-slate-700">
        <div className="space-y-0.5">
          <Row
            label="Nama Peserta Didik"
            value={<strong>{siswa.nama}</strong>}
            w="w-44"
          />
          <Row label="NIS/NISN" value={siswa.nis} w="w-44" />
          <Row label="Nama Sekolah" value="SDIT Ulil Albab Batam" w="w-44" />
          <Row
            label="Alamat"
            value="Jl. Tiban Utara No. 1 Patam Lestari Sekupang Batam"
            w="w-44"
          />
        </div>
        <div className="space-y-0.5">
          <Row
            label="Kelas"
            value={`${rombel?.tingkat_kelas ?? ""} ${rombel?.sub_nama ?? ""}`}
            w="w-36"
          />
          <Row
            label="Semester"
            value={semester === "1" ? "1 ( Ganjil )" : "2 ( Genap )"}
            w="w-36"
          />
          <Row label="Tahun Pelajaran" value={tahunAktif?.nama} w="w-36" />
        </div>
      </div>

      {/* A. INTRAKURIKULER */}
      <SectionTitle>A. Penilaian Intrakurikuler</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border-2 border-slate-900 text-[12px]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold uppercase text-slate-700">
              <th className="border-2 border-slate-900 p-1.5 w-8">No</th>
              <th
                className="border-2 border-slate-900 p-1.5 text-left"
                colSpan="2"
              >
                Mata Pelajaran
              </th>
              <th className="border-2 border-slate-900 p-1.5 w-20">
                Nilai Akhir
              </th>
              <th className="border-2 border-slate-900 p-1.5 text-left">
                Ketercapaian Kompetensi
              </th>
            </tr>
          </thead>
          <tbody>
            {mapelBiasa.map((m, i) => (
              <tr key={m.mapel_id ?? i} className="hover:bg-slate-50/50">
                <td className="border-2 border-slate-900 p-1.5 text-center">
                  {i + 1}.
                </td>
                <td
                  className="border-2 border-slate-900 p-1.5 font-medium"
                  colSpan="2"
                >
                  {m.nama}
                </td>
                <td className="border-2 border-slate-900 p-1.5 text-center font-bold text-slate-800">
                  {m.nilai ?? "-"}
                </td>
                <td className="border-2 border-slate-900 p-1.5 text-[11px] italic leading-snug text-slate-600">
                  {m.nilai !== null && m.nilai !== undefined
                    ? ketercapaianLabel(m.nilai)
                    : "-"}
                </td>
              </tr>
            ))}
            <tr className="bg-indigo-50/30 font-bold text-indigo-950">
              <td
                className="border-2 border-slate-900 p-1.5 text-center"
                colSpan="3"
              >
                Rata-rata Nilai
              </td>
              <td className="border-2 border-slate-900 p-1.5 text-center text-sm font-black">
                {siswa.rata_rata ?? "-"}
              </td>
              <td className="border-2 border-slate-900 p-1.5 text-[11px] italic">
                {siswa.rata_rata !== null && siswa.rata_rata !== undefined
                  ? ketercapaianLabel(siswa.rata_rata)
                  : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── BENTUK PECAHAN PENILAIAN AL-QUR'AN (UPDATED) ─────────── */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border-2 border-slate-900 text-[12px]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold uppercase text-slate-700">
              <th className="border-2 border-slate-900 p-1.5 w-8">No</th>
              <th className="border-2 border-slate-900 p-1.5 text-left">
                Mata Pelajaran / Kategori Al-Qur'an
              </th>
              <th className="border-2 border-slate-900 p-1.5 w-20">
                Nilai Akhir
              </th>
              <th className="border-2 border-slate-900 p-1.5 text-left">
                Deskripsi / Catatan Capaian
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-slate-50/50">
              <td className="border-2 border-slate-900 p-1.5 text-center">
                1.
              </td>
              <td className="border-2 border-slate-900 p-1.5 font-bold">
                Al-Qur'an — Tahfidz{" "}
              </td>
              <td className="border-2 border-slate-900 p-1.5 text-center font-bold text-slate-800">
                {nilaiQuranObj.tahfidz?.nilai ?? "-"}
              </td>
              <td className="border-2 border-slate-900 p-1.5 text-[11px] italic leading-snug text-slate-600">
                {nilaiQuranObj.tahfidz?.deskripsi ||
                  (nilaiQuranObj.tahfidz?.nilai !== null
                    ? ketercapaianLabel(nilaiQuranObj.tahfidz.nilai)
                    : "-")}
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="border-2 border-slate-900 p-1.5 text-center">
                2.
              </td>
              <td className="border-2 border-slate-900 p-1.5 font-bold">
                Al-Qur'an — Tilawah{" "}
              </td>
              <td className="border-2 border-slate-900 p-1.5 text-center font-bold text-slate-800">
                {nilaiQuranObj.tilawah?.nilai ?? "-"}
              </td>
              <td className="border-2 border-slate-900 p-1.5 text-[11px] italic leading-snug text-slate-600">
                {nilaiQuranObj.tilawah?.deskripsi ||
                  (nilaiQuranObj.tilawah?.nilai !== null
                    ? ketercapaianLabel(nilaiQuranObj.tilawah.nilai)
                    : "-")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* ──────────────────────────────────────────────────────────── */}

      {/* B. KOKURIKULER */}
      <SectionTitle>B. Penilaian Kokurikuler</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border-2 border-slate-900 text-[12px]">
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
                    {k.deskripsi ||
                      (k.nilai ? (GRADE_LABEL[k.nilai] ?? "-") : "-")}
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
        </table>
      </div>

      {/* C. EKSTRAKURIKULER */}
      <SectionTitle>C. Penilaian Ekstrakurikuler</SectionTitle>
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border-2 border-slate-900 text-[12px]">
          <thead>
            <tr className="bg-slate-100 text-center font-bold uppercase text-slate-700">
              <th className="border-2 border-slate-900 p-1.5 w-8">No</th>
              <th className="border-2 border-slate-900 p-1.5 text-left">
                Kegiatan Ekstrakurikuler
              </th>
              <th className="border-2 border-slate-900 p-1.5 w-12">Nilai</th>
              <th className="border-2 border-slate-900 p-1.5 text-left">
                Keterangan / Deskripsi
              </th>
            </tr>
          </thead>
          <tbody>
            {ekstrakurikulerList.length > 0 ? (
              ekstrakurikulerList.map((e, i) => (
                <tr key={e.id ?? i} className="hover:bg-slate-50/50">
                  <td className="border-2 border-slate-900 p-1.5 text-center">
                    {i + 1}.
                  </td>
                  <td className="border-2 border-slate-900 p-1.5 font-medium">
                    {e.nama}
                    {e.wajib && (
                      <span className="ml-1.5 text-[9px] bg-slate-200 px-1 py-0.5 rounded uppercase font-bold text-slate-500">
                        Wajib
                      </span>
                    )}
                  </td>
                  <td className="border-2 border-slate-900 p-1.5 text-center font-black text-sm">
                    {e.nilai ?? "-"}
                  </td>
                  <td className="border-2 border-slate-900 p-1.5 text-[11px] italic leading-snug text-slate-600">
                    {e.deskripsi ||
                      (e.nilai ? (GRADE_LABEL[e.nilai] ?? "-") : "-")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border-2 border-slate-900 p-3 text-center text-slate-400 italic text-[11px]"
                >
                  Belum ada data ekstrakurikuler terdaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BAGIAN BAWAH */}
      <div className="grid grid-cols-5 gap-4 mt-2">
        {/* Catatan Wali Kelas */}
        <div className="col-span-3 border-2 border-slate-900 rounded-xl overflow-hidden">
          <div className="bg-slate-900 text-white px-3 py-1 text-[11px] font-bold uppercase flex justify-between">
            <span>Catatan Wali Kelas</span>
            {!isEditable && (
              <span className="flex items-center gap-1 text-emerald-400">
                <FaLock size={10} /> Terkunci
              </span>
            )}
          </div>

          <div className="p-3 min-h-[70px]">
            {!isEditable ? (
              <p className="text-[12px] italic text-slate-700 whitespace-pre-wrap">
                {tempNotes[siswa.siswa_id] || (
                  <span className="text-slate-400">Tidak ada catatan</span>
                )}
              </p>
            ) : (
              <>
                <textarea
                  value={tempNotes[siswa.siswa_id] || ""}
                  onChange={(e) =>
                    setTempNotes((prev) => ({
                      ...prev,
                      [siswa.siswa_id]: e.target.value,
                    }))
                  }
                  className="w-full min-h-[60px] border-none focus:ring-0 text-[12px] italic bg-transparent resize-none p-0 text-slate-700 outline-none"
                  placeholder="Tulis catatan perkembangan siswa di sini..."
                />

                <button
                  onClick={() => handleSaveNote(siswa.siswa_id)}
                  disabled={savingNote === siswa.siswa_id}
                  className="mt-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 text-[10px] font-bold flex items-center gap-1.5 rounded-lg shadow transition-all uppercase print:hidden"
                >
                  {savingNote === siswa.siswa_id ? (
                    <FaSyncAlt className="animate-spin" />
                  ) : (
                    <FaSave />
                  )}
                  Simpan Catatan
                </button>
              </>
            )}
          </div>

          <div className="border-t-2 border-slate-900">
            <div className="bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase border-b border-slate-200 text-slate-600">
              Komentar Orang Tua
            </div>
            <div className="p-3 min-h-[40px]">
              <p className="text-[12px] italic text-slate-400">
                {siswa.komentar_orang_tua || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Kehadiran + TTD */}
        <div className="col-span-2 flex flex-col gap-3">
          <table className="w-full border-collapse border-2 border-slate-900 text-[11px] font-bold uppercase">
            <tbody>
              <tr>
                <th
                  colSpan="2"
                  className="bg-slate-900 text-white p-1.5 text-center"
                >
                  Ketidak Hadiran
                </th>
              </tr>
              <tr>
                <td className="border-2 border-slate-900 p-1.5 pl-3">Sakit</td>
                <td className="border-2 border-slate-900 p-1.5 text-center">
                  : {kehadiran.sakit ?? 0} hari
                </td>
              </tr>
              <tr>
                <td className="border-2 border-slate-900 p-1.5 pl-3">Izin</td>
                <td className="border-2 border-slate-900 p-1.5 text-center">
                  : {kehadiran.izin ?? 0} hari
                </td>
              </tr>
              <tr>
                <td className="border-2 border-slate-900 p-1.5 pl-3">
                  Tanpa Keterangan
                </td>
                <td className="border-2 border-slate-900 p-1.5 text-center">
                  : {kehadiran.alpha ?? 0} hari
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-right text-[12px] text-slate-700 pr-2 mt-1">
            <p>{getFormattedDate()}</p>
            <p className="font-bold mt-0.5">Guru Kelas,</p>
            <div className="mt-14">
              <p className="font-bold underline decoration-2 uppercase text-[12px] text-slate-900">
                {guruAktif?.name || "Nama Guru Belum Diatur"}
              </p>
              {guruAktif?.nip && (
                <p className="text-[10px] font-bold text-slate-400">
                  NIP. {guruAktif.nip}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-right text-[10px] text-slate-400 mt-4 border-t border-slate-200 pt-1.5">
        {siswa.nama} | Lembar Pratinjau Kendali Rapor SDIT UA
      </div>
    </div>
  );
}

// ============================================================
// MODAL KONFIRMASI AJUKAN
// ============================================================
function ModalAjukan({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <FaPaperPlane className="text-indigo-600" />
          </div>
          <h2 className="text-lg font-black text-slate-800">
            Ajukan ke Kepala Sekolah
          </h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Rapor akan dikirim ke Kepala Sekolah untuk disetujui. Setelah
          diajukan,{" "}
          <strong>guru tidak dapat mengedit nilai atau catatan</strong> hingga
          keputusan diberikan.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <FaSyncAlt className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
            Ya, Ajukan
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HALAMAN UTAMA
// ============================================================
export default function RaporKelas() {
  const { user: guruAktif } = useAuth();

  const [rombel, setRombel] = useState(null);
  const [tahunAktif, setTahunAktif] = useState(null);
  const [semester, setSemester] = useState("2");
  const [jenisRapor, setJenisRapor] = useState("PTS");
  const [dataRapor, setDataRapor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAjukan, setLoadingAjukan] = useState(false);
  const [showModalAjukan, setShowModalAjukan] = useState(false);
  const [savingNote, setSavingNote] = useState(null);
  const [tempNotes, setTempNotes] = useState({});

  const allApproved =
    dataRapor.length > 0 &&
    dataRapor.every((s) => s.approval_status === "approved");

  const allPending =
    dataRapor.length > 0 &&
    dataRapor.every((s) => s.approval_status === "pending_approval");

  const anyPending = dataRapor.some(
    (s) => s.approval_status === "pending_approval",
  );

  const anyDraftOrRejected = dataRapor.some(
    (s) =>
      !s.approval_status ||
      s.approval_status === "draft" ||
      s.approval_status === "rejected",
  );

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRombel, resTahun] = await Promise.all([
        api.get("/api/guru/rombel"),
        api.get("/api/guru/tahunajaran/aktif"),
      ]);

      const rom = resRombel.data.data?.[0] || null;
      const thn = resTahun.data.data || null;

      setRombel(rom);
      setTahunAktif(thn);

      if (rom?.id && thn?.nama) {
        const resPreview = await api.get("/api/guru/rapor/preview", {
          params: {
            rombel_id: rom.id,
            semester,
            jenis_rapor: jenisRapor,
            tahun_ajaran: thn.nama,
          },
        });

        const raporData = resPreview.data.data || [];
        const rekapData = resPreview.data.rekap_kehadiran || {};

        // SINKRONISASI & URUTKAN BERDASARKAN ABJAD NAMA SISWA
        const raporWithRekapSorted = raporData
          .map((s) => ({
            ...s,
            rekap_kehadiran: rekapData[s.siswa_id] ?? {
              sakit: 0,
              izin: 0,
              alpha: 0,
            },
          }))
          .sort((a, b) => a.nama.localeCompare(b.nama));

        setDataRapor(raporWithRekapSorted);

        const initialNotes = {};
        raporWithRekapSorted.forEach((s) => {
          initialNotes[s.siswa_id] = s.catatan_wali_kelas || "";
        });
        setTempNotes(initialNotes);
      }
    } catch {
      toast.error("Gagal memuat data rapor");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // SIMPAN CATATAN
  // ===============================
  const handleSaveCatatanSiswa = async (siswaId) => {
    setSavingNote(siswaId);
    try {
      await api.post("/api/guru/rapor/update-catatan-individu", {
        siswa_id: siswaId,
        catatan: tempNotes[siswaId],
        semester,
        jenis_rapor: jenisRapor,
        tahun_ajaran: tahunAktif?.nama,
      });
      toast.success("Catatan berhasil diperbarui");
      fetchData();
    } catch {
      toast.error("Gagal menyimpan catatan");
    } finally {
      setSavingNote(null);
    }
  };

  // ===============================
  // AJUKAN KE KEPSEK
  // ===============================
  const handleAjukanKepsek = async () => {
    setLoadingAjukan(true);
    try {
      await api.post("/api/guru/rapor/ajukan-kepsek", {
        rombel_id: rombel.id,
        semester,
        jenis_rapor: jenisRapor,
        tahun_ajaran: tahunAktif.nama,
      });

      toast.success("Rapor berhasil diajukan ke Kepala Sekolah!");
      setShowModalAjukan(false);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal mengajukan rapor");
    } finally {
      setLoadingAjukan(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [semester, jenisRapor]);

  // ===============================
  // STATUS LABEL UNTUK HEADER
  // ===============================
  const renderStatusBanner = () => {
    if (allApproved)
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4 flex items-start gap-3 print:hidden">
          <FaCheckCircle className="text-emerald-500 text-xl mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-emerald-800 text-sm">
              Rapor {jenisRapor} Semester {semester} telah disetujui & dikunci
            </p>
            <p className="text-emerald-600 text-xs mt-0.5">
              Kepala Sekolah telah menyetujui. Siswa sudah dapat melihat rapor
              di portal masing-masing.
            </p>
          </div>
        </div>
      );

    if (allPending)
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-start gap-3 print:hidden">
          <FaClock className="text-amber-500 text-xl mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-amber-800 text-sm">
              Menunggu persetujuan Kepala Sekolah
            </p>
            <p className="text-amber-600 text-xs mt-0.5">
              Rapor sudah dikirim. Nilai dan catatan tidak dapat diubah selama
              menunggu persetujuan.
            </p>
          </div>
        </div>
      );

    return null;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarGuru />

      {showModalAjukan && (
        <ModalAjukan
          onConfirm={handleAjukanKepsek}
          onCancel={() => setShowModalAjukan(false)}
          loading={loadingAjukan}
        />
      )}

      <main className="flex-1 p-4 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 print:hidden">
            <div>
              <h1 className="text-2xl font-black text-slate-800 italic">
                PRATINJAU{" "}
                <span className="text-indigo-600">RAPOR {jenisRapor}</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                {rombel
                  ? `Kelas ${rombel.tingkat_kelas}${rombel.sub_nama}`
                  : "-"}{" "}
                • {tahunAktif?.nama}
              </p>
              {!loading && dataRapor.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {(() => {
                    const counts = dataRapor.reduce((acc, s) => {
                      const st = s.approval_status || "draft";
                      acc[st] = (acc[st] || 0) + 1;
                      return acc;
                    }, {});
                    return Object.entries(counts).map(([st, n]) => (
                      <div key={st} className="flex items-center gap-2">
                        <StatusBadge status={st} />
                        <span className="text-xs font-bold text-slate-500">
                          {n} siswa
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={jenisRapor}
                onChange={(e) => setJenisRapor(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-indigo-500"
              >
                <option value="PTS">PTS</option>
                <option value="PAS">PAS</option>
              </select>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-indigo-500"
              >
                <option value="1">Ganjil (1)</option>
                <option value="2">Genap (2)</option>
              </select>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
              >
                <FaSyncAlt />
                Refresh
              </button>
              {!loading && anyDraftOrRejected && !anyPending && (
                <button
                  onClick={() => setShowModalAjukan(true)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
                >
                  <FaPaperPlane />
                  Ajukan ke Kepsek
                </button>
              )}
            </div>
          </div>

          {!loading && renderStatusBanner()}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FaSyncAlt className="animate-spin text-4xl mb-4" />
              <p className="font-medium tracking-widest uppercase text-xs">
                Menyiapkan Data Rapor...
              </p>
            </div>
          ) : dataRapor.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FaFileAlt className="text-4xl mb-4" />
              <p className="font-medium text-sm">Belum ada data rapor</p>
            </div>
          ) : (
            <div className="space-y-12">
              {dataRapor.map((siswa) => (
                <RaporCard
                  key={siswa.siswa_id}
                  siswa={siswa}
                  rombel={rombel}
                  tahunAktif={tahunAktif}
                  semester={semester}
                  guruAktif={guruAktif}
                  tempNotes={tempNotes}
                  setTempNotes={setTempNotes}
                  savingNote={savingNote}
                  handleSaveNote={handleSaveCatatanSiswa}
                  jenisRapor={jenisRapor}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
