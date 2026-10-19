import React, { useEffect, useState } from "react";
import SidebarSiswa from "../../components/SidebarSiswa";
import api from "../../api";
import { FileText, ClipboardCheck, Calendar, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardSiswa() {
  // ✅ FIX: sekarang fetch data terbaru dari /api/siswa/dashboard,
  // localStorage dipakai hanya sebagai fallback tampilan awal (biar tidak blank)
  // sebelum data API datang, bukan sebagai sumber data utama lagi.
  const siswaLocal = JSON.parse(localStorage.getItem("siswa_data") || "{}");

  const [siswa, setSiswa] = useState(siswaLocal);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/siswa/dashboard");
      if (res.data?.success) {
        setSiswa(res.data.data);
        // sinkronkan localStorage juga supaya bagian lain (mis. sidebar) ikut update
        localStorage.setItem("siswa_data", JSON.stringify(res.data.data));
      } else {
        setError(res.data?.message || "Gagal memuat data dashboard.");
      }
    } catch (e) {
      console.error("Gagal mengambil data dashboard:", e);
      setError("Gagal terhubung ke server. Menampilkan data terakhir yang tersimpan.");
      // biarkan siswaLocal tetap tampil sebagai fallback
    } finally {
      setLoading(false);
    }
  };

  const menus = [
    {
      label: "Nilai Akademik",
      desc: "Lihat nilai UH, PTS, dan PAS kamu",
      icon: <FileText size={24} />,
      to: "/dashboard-siswa/nilai",
      color: "from-orange-500 to-amber-400",
      shadow: "shadow-orange-200",
    },
    {
      label: "Absensi Saya",
      desc: "Rekap kehadiran kamu",
      icon: <ClipboardCheck size={24} />,
      to: "/dashboard-siswa/absensi",
      color: "from-blue-500 to-indigo-400",
      shadow: "shadow-blue-200",
    },
    {
      label: "Jadwal Pelajaran",
      desc: "Jadwal kelas minggu ini",
      icon: <Calendar size={24} />,
      to: "/dashboard-siswa/jadwal",
      color: "from-emerald-500 to-teal-400",
      shadow: "shadow-emerald-200",
    },
    {
      label: "Profil Saya",
      desc: "Data diri dan akun kamu",
      icon: <BookOpen size={24} />,
      to: "/dashboard-siswa/profil",
      color: "from-violet-500 to-purple-400",
      shadow: "shadow-violet-200",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#fff8f3]">
      <SidebarSiswa />
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl p-6 text-white shadow-xl shadow-orange-200">
              {loading ? (
                <div className="flex items-center gap-2 text-orange-100">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-medium">Memuat data terbaru...</span>
                </div>
              ) : (
                <>
                  <p className="text-orange-100 text-sm font-medium mb-1">Selamat datang,</p>
                  <h1 className="text-2xl font-black">{siswa?.nama || "Siswa"} 👋</h1>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-orange-100">
                    <span>NIS: {siswa?.nis || "-"}</span>
                    {siswa?.kelas && (
                      <span>
                        Kelas: {siswa.kelas}
                        {siswa?.sub_kelas ? ` ${siswa.sub_kelas}` : ""}
                      </span>
                    )}
                    {siswa?.tahun_ajaran && <span>TA: {siswa.tahun_ajaran}</span>}
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menus.map((m, i) => (
              <Link key={i} to={m.to}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all group">
                <div className={`w-12 h-12 bg-gradient-to-tr ${m.color} rounded-2xl flex items-center justify-center text-white shadow-lg ${m.shadow} mb-4 group-hover:scale-110 transition-transform`}>
                  {m.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{m.label}</h3>
                <p className="text-sm text-slate-500">{m.desc}</p>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}