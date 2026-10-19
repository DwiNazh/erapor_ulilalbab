import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdminTu from "../../components/SidebarAdminTu";

export default function KenaikanKelas() {
  const [activeTahun, setActiveTahun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const token = localStorage.getItem("authToken");
  const API = "http://localhost:8000/api/tu";

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  /** =============================
   * LOAD TAHUN AJARAN AKTIF
   ============================== */
  const loadTahunAktif = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tahunajaran/aktif`, { headers });
      setActiveTahun(res.data.data);
    } catch (err) {
      alert("Gagal memuat tahun ajaran aktif");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTahunAktif();
  }, []);

  /** =============================
   * FINALIZE KENAIKAN KELAS
   ============================== */
  const finalizeKenaikan = async () => {
  if (!window.confirm("Proses ini hanya bisa dilakukan SATU KALI.\nYakin ingin melanjutkan?")) return;

  setProcessing(true);
  try {
    const res = await axios.post(`${API}/kenaikan-kelas/finalisasi`, {}, { headers });
    
    if (res.data.success) {
      toast.success(res.data.message);
      loadTahunAktif(); // refresh data tahun aktif
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Gagal melakukan finalisasi");
  }
  setProcessing(false);
};

  /** =============================
   * RENDER
   ============================== */
  if (loading) {
    return <div className="p-10 text-center">Memuat data...</div>;
  }

  if (!activeTahun) {
    return (
      <div className="p-10 text-center text-red-600">
        Tidak ada tahun ajaran aktif
      </div>
    );
  }

const isLocked = !!activeTahun?.finalized_at;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdminTu />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Kenaikan Kelas
        </h1>

        <p className="mb-6 text-gray-600">
          Tahun Ajaran Aktif:{" "}
          <strong>{activeTahun.nama}</strong>
        </p>

        {/* ================= MODE ARSIP ================= */}
        {isLocked ? (
          <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">
              🔒 Kenaikan Kelas Telah Selesai
            </h2>
            <p className="text-gray-700">
              Proses kenaikan kelas untuk tahun ajaran ini sudah
              difinalisasi pada:
            </p>
            <p className="mt-2 font-semibold">
              {new Date(activeTahun.kenaikan_kelas_at).toLocaleString()}
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Data bersifat <strong>READ ONLY</strong> dan tidak dapat diubah.
            </p>
          </div>
        ) : (
          /* ================= MODE AKTIF ================= */
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-3">
              Proses Kenaikan Kelas (Satu Kali)
            </h2>

            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Promosi siswa ke tingkat berikutnya</li>
              <li>Penetapan wali kelas</li>
              <li>Pembagian rombel</li>
              <li>Penguncian data tahun ajaran lama</li>
            </ul>

            <div className="bg-red-50 border border-red-300 p-4 rounded mb-6">
              <strong>Perhatian:</strong> Proses ini hanya bisa dilakukan
              <strong> satu kali</strong> dan tidak dapat dibatalkan.
            </div>

            <button
              onClick={finalizeKenaikan}
              disabled={processing}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {processing
                ? "Memproses..."
                : "FINALIZE KENAIKAN KELAS"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
