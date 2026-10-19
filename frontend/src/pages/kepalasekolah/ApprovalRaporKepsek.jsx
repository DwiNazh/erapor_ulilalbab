import React, { useEffect, useState } from "react";
import api from "../../api";
import SidebarKepsek from "../../components/SidebarKepalasekolah"; // sesuaikan komponen sidebar kepsek
import toast from "react-hot-toast";
import {
  FaSyncAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaEye,
} from "react-icons/fa";

// ============================================================
// STATUS BADGE
// ============================================================
function StatusBadge({ status }) {
  const map = {
    approved: { label: "Disetujui", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    pending_approval: { label: "Menunggu Review", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    rejected: { label: "Ditolak", cls: "bg-rose-100 text-rose-700 border-rose-200" },
    draft: { label: "Draft", cls: "bg-slate-100 text-slate-500 border-slate-200" },
  };
  const cfg = map[status] ?? map.draft;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ============================================================
// MODAL TOLAK (dengan input alasan)
// ============================================================
function ModalTolak({ guru, onConfirm, onCancel, loading }) {
  const [alasan, setAlasan] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
            <FaTimesCircle className="text-rose-600" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Tolak Rapor</h2>
            <p className="text-xs text-slate-500">{guru?.nama_guru} — Kelas {guru?.nama_kelas}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-3">
          Tuliskan alasan penolakan agar guru dapat melakukan revisi:
        </p>

        <textarea
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          rows={4}
          placeholder="Contoh: Nilai rata-rata kelas terlalu rendah, mohon diperiksa kembali..."
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-300 focus:border-rose-400 resize-none"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(alasan)}
            disabled={loading || !alasan.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSyncAlt className="animate-spin" /> : <FaTimesCircle />}
            Tolak Rapor
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// KARTU PER GURU (collapsed/expanded)
// ============================================================
function GuruRaporCard({ item, onApprove, onReject, approving, rejecting }) {
  const [expanded, setExpanded] = useState(false);
  const isPending = item.approval_status === "pending_approval";

  return (
    <div
      className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
        isPending ? "border-amber-200" : item.approval_status === "approved"
          ? "border-emerald-200" : "border-slate-200"
      }`}
    >
      {/* Header kartu */}
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar inisial */}
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-black text-base flex items-center justify-center shrink-0 uppercase">
            {item.nama_guru?.[0] ?? "G"}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate">{item.nama_guru}</p>
            <p className="text-xs text-slate-500">
              Kelas {item.nama_kelas} &nbsp;·&nbsp;{" "}
              <span className="font-semibold">{item.jumlah_siswa} siswa</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={item.approval_status} />

          {/* Tombol aksi */}
          {isPending && (
            <>
              <button
                onClick={() => onReject(item)}
                disabled={rejecting}
                className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <FaTimesCircle className="text-[10px]" /> Tolak
              </button>
              <button
                onClick={() => onApprove(item)}
                disabled={approving}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {approving ? <FaSyncAlt className="animate-spin text-[10px]" /> : <FaCheckCircle className="text-[10px]" />}
                Setujui
              </button>
            </>
          )}

          {item.approval_status === "approved" && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <FaLock className="text-[10px]" /> Terkunci
            </span>
          )}

          <button
            onClick={() => setExpanded((p) => !p)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-all"
            title="Lihat detail"
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* Alasan penolakan (jika ada) */}
      {item.approval_status === "rejected" && item.rejection_reason && (
        <div className="mx-6 mb-4 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs text-rose-700">
          <span className="font-bold uppercase">Alasan penolakan: </span>
          {item.rejection_reason}
        </div>
      )}

      {/* Detail tabel siswa (collapsible) */}
      {expanded && (
        <div className="border-t border-slate-100 px-6 pb-5">
          <p className="text-xs font-bold uppercase text-slate-400 mt-4 mb-2 tracking-wider">
            Daftar Siswa & Nilai
          </p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <th className="text-left py-2 px-3 border border-slate-200">No</th>
                <th className="text-left py-2 px-3 border border-slate-200">Nama Siswa</th>
                <th className="text-center py-2 px-3 border border-slate-200">Rata-rata</th>
                <th className="text-left py-2 px-3 border border-slate-200">Catatan Wali Kelas</th>
              </tr>
            </thead>
            <tbody>
              {(item.siswa || []).map((s, i) => (
                <tr key={s.siswa_id ?? i} className="hover:bg-slate-50">
                  <td className="py-2 px-3 border border-slate-200 text-slate-500">{i + 1}</td>
                  <td className="py-2 px-3 border border-slate-200 font-medium text-slate-700">{s.nama}</td>
                  <td className="py-2 px-3 border border-slate-200 text-center font-bold text-indigo-600">
                    {s.rata_rata ?? "-"}
                  </td>
                  <td className="py-2 px-3 border border-slate-200 italic text-slate-500">
                    {s.catatan_wali_kelas || <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// HALAMAN UTAMA KEPSEK
// ============================================================
export default function ApprovalRaporKepsek() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState("2");
  const [jenisRapor, setJenisRapor] = useState("PTS");
  const [filterStatus, setFilterStatus] = useState("all");

  const [approvingId, setApprovingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null); // item yang akan ditolak
  const [rejectingId, setRejectingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/kepsek/rapor/list-approval", {
        params: { semester, jenis_rapor: jenisRapor },
      });
      setData(res.data.data || []);
    } catch {
      toast.error("Gagal memuat data pengajuan rapor");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // SETUJUI
  // ============================
  const handleApprove = async (item) => {
    if (
      !window.confirm(
        `Setujui dan kunci rapor ${item.nama_guru} (Kelas ${item.nama_kelas})?\n\nNilai akan dikunci dan siswa dapat melihat rapor.`
      )
    ) return;

    setApprovingId(item.rombel_id);
    try {
      await api.post("/api/kepsek/rapor/approve", {
        rombel_id: item.rombel_id,
        semester,
        jenis_rapor: jenisRapor,
      });
      toast.success(`Rapor ${item.nama_guru} berhasil disetujui & dikunci!`);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menyetujui rapor");
    } finally {
      setApprovingId(null);
    }
  };

  // ============================
  // TOLAK
  // ============================
  const handleReject = async (alasan) => {
    if (!rejectTarget) return;
    setRejectingId(rejectTarget.rombel_id);
    try {
      await api.post("/api/kepsek/rapor/reject", {
        rombel_id: rejectTarget.rombel_id,
        semester,
        jenis_rapor: jenisRapor,
        rejection_reason: alasan,
      });
      toast.success("Rapor ditolak. Guru akan diberitahu untuk melakukan revisi.");
      setRejectTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menolak rapor");
    } finally {
      setRejectingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [semester, jenisRapor]);

  // ============================
  // FILTER + STATS
  // ============================
  const stats = {
    pending: data.filter((d) => d.approval_status === "pending_approval").length,
    approved: data.filter((d) => d.approval_status === "approved").length,
    rejected: data.filter((d) => d.approval_status === "rejected").length,
    draft: data.filter((d) => !d.approval_status || d.approval_status === "draft").length,
  };

  const filtered =
    filterStatus === "all" ? data : data.filter((d) => d.approval_status === filterStatus);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarKepsek />

      {rejectTarget && (
        <ModalTolak
          guru={rejectTarget}
          onConfirm={handleReject}
          onCancel={() => setRejectTarget(null)}
          loading={!!rejectingId}
        />
      )}

      <main className="flex-1 p-4 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-800 italic">
                  PERSETUJUAN <span className="text-indigo-600">RAPOR {jenisRapor}</span>
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  Tinjau dan setujui rapor yang diajukan oleh wali kelas
                </p>
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
              </div>
            </div>

            {/* STATS */}
            {!loading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                {[
                  { key: "pending", label: "Menunggu Review", color: "amber", icon: <FaClock /> },
                  { key: "approved", label: "Disetujui", color: "emerald", icon: <FaCheckCircle /> },
                  { key: "rejected", label: "Ditolak", color: "rose", icon: <FaTimesCircle /> },
                  { key: "draft", label: "Draft", color: "slate", icon: <FaFileAlt /> },
                ].map(({ key, label, color, icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
                    className={`rounded-2xl p-4 text-left border-2 transition-all ${
                      filterStatus === key
                        ? `bg-${color}-50 border-${color}-300`
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className={`text-2xl font-black text-${color}-600`}>{stats[key]}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                      {icon} {label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FILTER TABS */}
          {!loading && (
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "all", label: "Semua" },
                { key: "pending_approval", label: "Perlu Ditinjau" },
                { key: "approved", label: "Sudah Disetujui" },
                { key: "rejected", label: "Ditolak" },
                { key: "draft", label: "Draft" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === key
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200"
                  }`}
                >
                  {label}{" "}
                  {key !== "all" && (
                    <span className="ml-1 opacity-60">
                      ({key === "pending_approval" ? stats.pending
                        : key === "approved" ? stats.approved
                        : key === "rejected" ? stats.rejected
                        : stats.draft})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* LIST */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FaSyncAlt className="animate-spin text-4xl mb-4" />
              <p className="font-medium tracking-widest uppercase text-xs">Memuat Data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <FaFileAlt className="text-4xl mb-4" />
              <p className="font-medium text-sm">Tidak ada data untuk filter ini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <GuruRaporCard
                  key={item.rombel_id}
                  item={item}
                  onApprove={handleApprove}
                  onReject={(item) => setRejectTarget(item)}
                  approving={approvingId === item.rombel_id}
                  rejecting={rejectingId === item.rombel_id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
