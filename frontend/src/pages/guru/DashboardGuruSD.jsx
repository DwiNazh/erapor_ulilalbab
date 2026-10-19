import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast, Toaster } from "react-hot-toast";
import { FaBars, FaBell, FaBookOpen, FaUsers, FaGraduationCap } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import SidebarGuru from "../../components/SidebarGuru";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardGuruSD() {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [daftarKelas, setDaftarKelas] = useState([]);
  const [tahunAjaranAktif, setTahunAjaranAktif] = useState(""); // State baru untuk info TA Aktif

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setPageLoading(true);
        const token = localStorage.getItem("token"); 

        const response = await axios.get("/api/guru/dashboard-guru", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data.status === "success") {
          setDaftarKelas(response.data.data.daftarKelas);
          setChartData(response.data.data.chartData);
          setTahunAjaranAktif(response.data.data.tahunAjaranAktif); // Ambil info TA aktif dari API
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
        // Tampilkan pesan error spesifik jika dilempar dari backend
        const msg = err.response?.data?.message || "Gagal mengambil data akademik dari server";
        toast.error(msg);
      } finally {
        setPageLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
          <p className="ml-4 text-lg text-gray-700 mt-4 font-medium">Memuat data akademik...</p>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { min: 0, max: 100 }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <Toaster position="top-center" richColors />

      <SidebarGuru isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition">
              <FaBars size={20} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Ringkasan Akademik</h1>
              <p className="text-sm text-gray-500 font-medium">
                Halo, {user?.name || "Ibu/Bapak Guru"} 
                {tahunAjaranAktif && <span className="text-blue-600 font-semibold"> • TA {tahunAjaranAktif}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
              <FaBell size={20} />
            </button>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
              {(user?.name?.[0] || "G").toUpperCase()}
            </div>
          </div>
        </header>

        {/* Tata Letak Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: Daftar Kelas */}
          <section className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Kelas yang Diajar</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {daftarKelas.length} Kelas
              </span>
            </div>

            <div className="space-y-4">
              {daftarKelas.length > 0 ? (
                daftarKelas.map((kelas) => (
                  <div key={kelas.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                        <FaGraduationCap size={22} />
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        {kelas.ruangan}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{kelas.namaKelas}</h3>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex flex-col gap-2">
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <FaBookOpen size={14} className="text-gray-400" />
                        <span>{kelas.mapel}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 gap-2">
                        <FaUsers size={14} className="text-gray-400" />
                        <span>{kelas.jumlahSiswa} Siswa</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm bg-white p-4 rounded-xl border border-gray-100 text-center">
                  Tidak ada kelas aktif yang diampu pada tahun ajaran ini.
                </p>
              )}
            </div>
          </section>

          {/* KOLOM KANAN: Grafik Nilai */}
          <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800">Perkembangan Nilai Kelas</h2>
              <p className="text-xs text-gray-400">Tren nilai rata-rata kelas aktif saat ini</p>
            </div>

            <div style={{ height: "340px" }}>
              {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                  Belum ada data nilai yang diinputkan pada tahun ajaran ini.
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}