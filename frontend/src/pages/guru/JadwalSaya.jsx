import React, { useState, useEffect } from "react";
import SidebarGuru from "../../components/SidebarGuru";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { Clock, BookOpen, MapPin, Calendar, Loader2 } from "lucide-react";


export default function JadwalSaya() {
  const { user } = useAuth();
  const [jadwal, setJadwal] = useState({});
  const [loading, setLoading] = useState(true);

  const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  useEffect(() => {
    const fetchJadwalGuru = async () => {
      try {
        // Asumsi endpoint API untuk jadwal guru spesifik
        const res = await api.get("/api/guru/jadwal-saya");
        const data = res.data?.data || [];

        const grouped = {};
        data.forEach((item) => {
        // Ambil hari dan pastikan huruf depannya Kapital (Senin, Selasa, dst)
        const hariRaw = item.hari || "Lainnya";
        const hariClean = hariRaw.trim(); // Hapus spasi jika ada
        const hariFinal = hariClean.charAt(0).toUpperCase() + hariClean.slice(1).toLowerCase();

        if (!grouped[hariFinal]) {
            grouped[hariFinal] = [];
        }
        grouped[hariFinal].push(item);
        });

        setJadwal(grouped);
      } catch (err) {
        console.error("Gagal memuat jadwal pribadi");
      } finally {
        setLoading(false);
      }
    };
    fetchJadwalGuru();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarGuru />

      <main className="flex-1 p-4 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Jadwal <span className="text-indigo-600">Mengajar Saya</span>
            </h1>
            <p className="text-slate-500 mt-1">Berikut adalah agenda mengajar Anda di berbagai kelas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hariList.map((hari) => (
              <div key={hari} className="flex flex-col gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-500" />
                    {hari}
                  </h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {(jadwal[hari] || []).length} Sesi
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {(jadwal[hari] || []).length > 0 ? (
                    jadwal[hari].map((item, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-indigo-500">
                        <div className="flex justify-between items-start mb-3">
                          <div className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase">
                            {item.mapel?.nama}
                          </div>
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock size={12} />
                            {item.jam_mulai} - {item.jam_selesai}
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 mb-2 truncate">
                          {item.rombel?.nama || `Kelas ${item.rombel?.tingkat_kelas}`}
                        </h3>

                        <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                          <MapPin size={12} />
                          Gedung SD Utama
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-400 font-medium italic">Tidak ada jadwal</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}