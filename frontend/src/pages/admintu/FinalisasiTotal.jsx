import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";
import api from "../../api";
import { 
  FaLock, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaArrowRight, 
  FaShieldAlt, 
  FaSyncAlt,
  FaInfoCircle,
  FaCheckDouble
} from "react-icons/fa";

export default function FinalisasiTotal() {
  const navigate = useNavigate();

  const [activeTahun, setActiveTahun] = useState(null);
  const [targetTahun, setTargetTahun] = useState(null);
  const [statusSummary, setStatusSummary] = useState({
    promosiSelesai: false,
    penempatanSelesai: false,
    waliLengkap: false,
    siswaBaruSelesai: false,
    semuaSelesai: false,
    sudahFinalized: false,
    detail: {},
    loading: true,
    error: null,
  });

  const [processing, setProcessing] = useState(false);
  const [finalizedSuccess, setFinalizedSuccess] = useState(false);

  const API = "/api/tu";

  const loadData = async () => {
    setStatusSummary((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const resAktif = await api.get(`${API}/tahunajaran/aktif`);
      const tahunAktif = resAktif.data?.data;

      if (!tahunAktif) throw new Error("Tidak ada tahun ajaran aktif");
      setActiveTahun(tahunAktif);

      const match = tahunAktif.nama.match(/^(\d{4})\/(\d{4})$/);
      if (!match) throw new Error("Format tahun ajaran aktif tidak valid");
      
      const [_, thAwal, thAkhir] = match;
      const targetNama = `${parseInt(thAwal) + 1}/${parseInt(thAkhir) + 1}`;

      const resAll = await api.get(`${API}/tahunajaran`);
      const target = resAll.data?.data?.find((t) => t.nama === targetNama);

      if (!target) throw new Error(`Tahun target ${targetNama} belum dibuat`);
      setTargetTahun(target);

      const resStatus = await api.get(`${API}/kenaikan-kelas/status-keseluruhan`);
      if (!resStatus.data.success) throw new Error("Gagal memuat status proses");

      const data = resStatus.data.data;
      setStatusSummary({
        promosiSelesai: data.promosi_selesai,
        penempatanSelesai: data.penempatan_selesai,
        waliLengkap: data.wali_lengkap,
        siswaBaruSelesai: data.siswa_baru_selesai,
        semuaSelesai: data.semua_selesai,
        sudahFinalized: data.sudah_finalized,
        detail: data.detail || {},
        loading: false,
        error: null,
      });

      if (data.sudah_finalized) setFinalizedSuccess(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Gagal memuat status";
      toast.error(errorMsg);
      setStatusSummary((prev) => ({ ...prev, loading: false, error: errorMsg }));
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleFinalisasiTotal = async () => {
    if (!window.confirm("PERHATIAN!\n\nApakah Anda yakin ingin mengunci seluruh proses? Setelah dikunci, data kenaikan kelas tidak dapat diubah kembali.")) return;
    if (!statusSummary.semuaSelesai) return toast.error("Belum semua tahap diselesaikan");

    setProcessing(true);
    try {
      await api.post(`${API}/kenaikan-kelas/finalisasi-total`, {});
      toast.success("Seluruh proses telah berhasil dikunci!", { icon: "🔒", duration: 4000 });
      setFinalizedSuccess(true);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal melakukan finalisasi");
    } finally {
      setProcessing(false);
    }
  };

  // Modern Skeleton Loading
  if (statusSummary.loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />
      <div className="flex-1 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
        <div className="h-48 bg-slate-200 rounded-3xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-32 bg-slate-200 rounded-2xl"></div>
           <div className="h-32 bg-slate-200 rounded-2xl"></div>
           <div className="h-32 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );

  const isLocked = statusSummary.sudahFinalized || finalizedSuccess || activeTahun?.kenaikan_kelas_finalized_at;

  // Daftar tahapan yang harus selesai sebelum finalisasi total bisa dilakukan
  const checklistItems = [
    {
      label: "Promosi Siswa",
      key: "promosiSelesai",
      desc: "Penentuan Naik, Tinggal, atau Lulus",
    },
    {
      label: "Penempatan Rombel",
      key: "penempatanSelesai",
      desc: "Pembagian siswa ke sub-kelas (A, B, C, dst)",
    },
    {
      label: "Penetapan Wali Kelas",
      key: "waliLengkap",
      desc: "Pemberian tanggung jawab kelas kepada guru",
    },
    {
      label: "Registrasi Siswa Baru",
      key: "siswaBaruSelesai",
      desc:
        statusSummary.detail?.siswa_baru_belum_diproses > 0
          ? `${statusSummary.detail.siswa_baru_belum_diproses} siswa baru belum dapat rombel/NIS`
          : "Semua siswa baru sudah dibagikan rombel & NIS",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <SidebarAdminTu />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FaShieldAlt className="text-indigo-600" /> Finalisasi Total
            </h1>
            <p className="text-slate-500 mt-1">
              Tahap akhir penguncian data kenaikan kelas TA <span className="font-bold text-indigo-600">{activeTahun?.nama}</span>
            </p>
          </div>

          {isLocked ? (
            /* VIEW: SUDAH TERKUNCI */
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden p-10 text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FaLock size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-4">Siklus Akademik Dikunci</h2>
              <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
                Seluruh tahapan kenaikan kelas dari <strong>{activeTahun?.nama}</strong> menuju <strong>{targetTahun?.nama}</strong> telah berhasil difinalisasi secara permanen.
              </p>
              
              <div className="mt-8 p-4 bg-emerald-50 rounded-2xl inline-flex items-center gap-3 text-emerald-700 font-bold text-sm border border-emerald-100">
                 <FaCheckCircle /> Status: Read-Only (Terarsipkan)
              </div>

              <div className="mt-10 border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate("/dashboardtusd")}
                  className="px-8 py-3.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  Ke Dashboard Utama
                </button>
                <button
                  onClick={() => navigate("/dashboardtusd/datasiswa")}
                  className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  Lihat Master Data
                </button>
              </div>
            </div>
          ) : (
            /* VIEW: BELUM TERKUNCI */
            <div className="space-y-8">
              
              {/* WARNING BOX */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-xl font-black flex items-center gap-3 mb-2">
                    <FaExclamationTriangle className="text-white animate-pulse" /> Konfirmasi Akhir
                  </h3>
                  <p className="text-orange-50 opacity-90 max-w-2xl leading-relaxed">
                    Penguncian ini akan memindahkan status siswa secara permanen. Pastikan rombel, wali kelas, data promosi, dan registrasi siswa baru sudah 100% akurat. <strong>Tindakan ini tidak dapat dibatalkan.</strong>
                  </p>
                </div>
                <FaLock className="absolute -bottom-6 -right-6 text-white/10 text-[150px] rotate-12 group-hover:scale-110 transition-transform duration-700" />
              </div>

              {/* PROGRESS STATUS CARD */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Ceklis Kesiapan Tahapan</h3>
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${statusSummary.semuaSelesai ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-pulse'}`}>
                      {statusSummary.semuaSelesai ? 'Siap Finalisasi' : 'Tahapan Belum Lengkap'}
                   </div>
                </div>

                <div className="divide-y divide-slate-50">
                  {checklistItems.map((item) => (
                    <div key={item.key} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${statusSummary[item.key] ? 'bg-emerald-100 text-emerald-600 shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
                           {statusSummary[item.key] ? <FaCheckDouble size={20}/> : <FaSyncAlt size={18}/>}
                        </div>
                        <div>
                          <p className={`font-bold ${statusSummary[item.key] ? 'text-slate-800' : 'text-slate-400 italic'}`}>{item.label}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl text-xs font-bold ${statusSummary[item.key] ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>
                        {statusSummary[item.key] ? 'Selesai' : 'Belum Selesai'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <FaInfoCircle size={20} />
                   </div>
                   <div className="max-w-md text-sm">
                      <p className="font-bold text-slate-700">Verifikasi Terakhir</p>
                      <p className="text-slate-500 text-xs mt-1">Pastikan Anda telah memeriksa ulang data rombel, wali kelas, dan siswa baru sebelum mengunci sistem.</p>
                   </div>
                </div>

                <button
                  onClick={handleFinalisasiTotal}
                  disabled={processing || !statusSummary.semuaSelesai}
                  className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                  {processing ? <FaSyncAlt className="animate-spin" /> : <FaLock />}
                  {processing ? "Memproses..." : "Kunci & Selesaikan Siklus"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}