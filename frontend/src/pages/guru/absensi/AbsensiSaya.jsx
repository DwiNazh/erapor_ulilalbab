import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import SidebarGuru from "../../../components/SidebarGuru";

import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaChartBar,
  FaSyncAlt,
  FaLayerGroup,
  FaInfoCircle,
} from "react-icons/fa";

export default function AbsensiSaya() {
  const navigate = useNavigate();

  const [rombelWali, setRombelWali] = useState(null);
  const [isWaliKelas, setIsWaliKelas] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/guru/absensi/harian/rombel-wali");
      if (res.data.success && res.data.data) {
        setRombelWali(res.data.data);
        setIsWaliKelas(true);
      } else {
        setIsWaliKelas(false);
        setRombelWali(null);
      }
    } catch (err) {
      setIsWaliKelas(false);
      setRombelWali(null);
      
      // Tampilkan pesan error spesifik dari backend (misal: "Tahun ajaran aktif tidak ditemukan")
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputAbsensi = () => {
    if (!rombelWali) return;
    navigate(`/dashboardgurusd/absensi/harian/${rombelWali.id}`);
  };

  const handleRekapAbsensi = () => {
    if (!rombelWali) return;
    navigate(`/dashboardgurusd/rekap-absensi/harian/${rombelWali.id}`);
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-slate-50">
        <SidebarGuru />
        <div className="flex-1 p-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
          <div className="h-48 bg-slate-200 rounded-[2.5rem]"></div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <SidebarGuru />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaClipboardList className="text-indigo-600" /> Absensi Harian
              </h1>
              <p className="text-slate-500 mt-1">
                Absensi diinput sekali per hari oleh wali kelas, mencakup
                semua mata pelajaran untuk tahun ajaran aktif saat ini.
              </p>
            </div>
            <button
              onClick={fetchData}
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm active:scale-95"
              title="Refresh Data"
            >
              <FaSyncAlt />
            </button>
          </div>

          {/* WALI KELAS: Tampilan Dashboard Menginput */}
          {isWaliKelas && rombelWali ? (
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <FaChalkboardTeacher size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tight">
                      WALI KELAS {rombelWali.tingkat_kelas} {rombelWali.sub_nama}
                    </h2>
                    <p className="text-indigo-100 text-sm font-medium mt-0.5">
                      Input absensi harian untuk seluruh siswa di kelas Anda.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                  <button
                    onClick={handleInputAbsensi}
                    className="bg-white text-indigo-700 hover:bg-indigo-50 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FaClipboardList size={14} /> Input Hari Ini
                  </button>
                  <button
                    onClick={handleRekapAbsensi}
                    className="bg-indigo-900/30 hover:bg-indigo-900/50 border border-white/20 text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FaChartBar size={14} /> Rekap Bulanan
                  </button>
                </div>
              </div>
              <FaLayerGroup className="absolute -bottom-10 -right-10 text-white/5 text-[200px] rotate-12 pointer-events-none" />
            </div>
          ) : (
            /* BUKAN WALI KELAS: Tampilan Informasi Info Panel */
            <div className="bg-white rounded-[3rem] p-12 md:p-20 text-center border border-slate-200 shadow-sm mt-6">
              <FaInfoCircle size={48} className="mx-auto mb-4 text-slate-300 animate-pulse" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                Anda Bukan Wali Kelas
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Absensi harian hanya diinput oleh wali kelas masing-masing
                rombel. Sebagai guru mata pelajaran, Anda tidak perlu
                menginput absensi — kehadiran siswa di kelas Anda sudah
                tercakup dalam absensi harian yang diinput wali kelasnya.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}