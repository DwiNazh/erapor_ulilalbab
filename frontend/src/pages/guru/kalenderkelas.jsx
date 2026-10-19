import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import SidebarGuru from "../../components/SidebarGuru";
import toast from "react-hot-toast";
import { Calendar, Clock, MapPin, ChevronRight, Printer, AlertCircle } from "lucide-react"; // Pastikan install lucide-react

export default function KalenderKelas() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [jadwal, setJadwal] = useState({});
  const [rombels, setRombels] = useState([]);
  const [selectedRombel, setSelectedRombel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update jam setiap menit untuk fitur "Active Class"
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "guru")) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    fetchRombel();
  }, []);

  const fetchRombel = async () => {
    try {
      const res = await api.get("/api/guru/rombel");
      const data = res.data?.data || [];
      setRombels(data);
      if (data.length > 0) {
        setSelectedRombel(data[0]);
        fetchJadwal(data[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      toast.error("Gagal mengambil data rombel");
      setLoading(false);
    }
  };

  const fetchJadwal = async (rombelId) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/guru/jadwal/rombel/${rombelId}`);
      const data = res.data?.data || [];
      
      const grouped = {};
      data.forEach((item) => {
        if (!grouped[item.hari]) grouped[item.hari] = [];
        grouped[item.hari].push({
          ...item,
          color: getColorByMapel(item.mapel?.nama),
        });
      });
      setJadwal(grouped);
    } catch (err) {
      toast.error("Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  const isCurrentClass = (hari, jamMulai, jamSelesai) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const today = days[currentTime.getDay()];
    if (hari !== today) return false;

    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [h1, m1] = jamMulai.split(":").map(Number);
    const [h2, m2] = jamSelesai.split(":").map(Number);
    
    return now >= (h1 * 60 + m1) && now <= (h2 * 60 + m2);
  };

  const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarGuru />

      <main className="flex-1 p-4 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
                <Calendar size={18} />
                <span className="uppercase tracking-wider text-xs">Akademik • Jadwal Pelajaran</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-800">
                Kalender <span className="text-indigo-600">Kelas</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {rombels.length > 1 && (
                <select 
                  onChange={(e) => {
                    const r = rombels.find(x => x.id === parseInt(e.target.value));
                    setSelectedRombel(r);
                    fetchJadwal(r.id);
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {rombels.map(r => (
                    <option key={r.id} value={r.id}>{r.tingkat_kelas} {r.sub_nama}</option>
                  ))}
                </select>
              )}
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Printer size={18} /> Cetak
              </button>
            </div>
          </div>

          {/* Schedule Grid */}
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-slate-200 h-[400px] rounded-2xl"></div>
                ))}
             </div>
          ) : rombels.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
               <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
               <p className="text-slate-500 font-medium">Anda belum memiliki jadwal atau rombel diampu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {hariList.map((hari) => (
                <div key={hari} className="flex flex-col gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="font-bold text-slate-800 flex justify-between items-center">
                      {hari}
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-tighter">
                        {(jadwal[hari] || []).length} Sesi
                      </span>
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {(jadwal[hari] || []).length > 0 ? (
                      jadwal[hari].map((item, idx) => {
                        const active = isCurrentClass(hari, item.jam_mulai, item.jam_selesai);
                        return (
                          <div
                            key={idx}
                            className={`group relative overflow-hidden bg-white rounded-2xl p-4 border transition-all duration-300 hover:shadow-md hover:-translate-y-1 
                            ${active ? 'border-indigo-500 ring-2 ring-indigo-50 shadow-lg' : 'border-slate-100'}`}
                          >
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${item.color.replace('bg-', 'bg-opacity-100 bg-')}`}></div>
                            
                            {active && (
                              <div className="absolute top-3 right-3">
                                <span className="flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                              </div>
                            )}

                            <div className="flex flex-col gap-2">
                              <h3 className="font-bold text-slate-700 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                                {item.mapel?.nama}
                              </h3>
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Clock size={12} />
                                <span className="text-[11px] font-medium tracking-tighter">
                                  {item.jam_mulai} - {item.jam_selesai}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <p className="text-[11px] text-slate-300 font-medium italic">Libur / Kosong</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function getColorByMapel(mapel) {
  const name = mapel?.toLowerCase() || "";
  if (name.includes("matematika")) return "bg-emerald-500";
  if (name.includes("indonesia")) return "bg-blue-500";
  if (name.includes("inggris")) return "bg-indigo-500";
  if (name.includes("ipa") || name.includes("sains")) return "bg-purple-500";
  if (name.includes("ips")) return "bg-amber-500";
  if (name.includes("agama")) return "bg-rose-500";
  if (name.includes("pancasila") || name.includes("pkn")) return "bg-red-500";
  if (name.includes("olahraga") || name.includes("penjas")) return "bg-orange-500";
  if (name.includes("seni")) return "bg-pink-500";
  return "bg-slate-400";
}