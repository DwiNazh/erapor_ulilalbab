import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import GuruLayout from "../../../layouts/GuruLayout";

import { FaChartBar } from "react-icons/fa";

export default function RekapAbsensi() {
  const navigate = useNavigate();

  const [penugasanList, setPenugasanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        const res = await api.get("/api/guru/absensi/penugasan-saya");

        if (res.data.success) {
          setPenugasanList(res.data.data || []);
        } else {
          toast.error(res.data.message || "Gagal memuat data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat mata pelajaran yang Anda ajar");
      } finally {
        setLoading(false);
      }
    };

    fetchPenugasan();
  }, []);

  const handleLihatRekap = (item) => {
    const rombelId = item.rombel_id || item.rombel?.id;
    const mapelId = item.mapel_id || item.mapel?.id;

    if (!rombelId || !mapelId) {
      toast.error("Data rombel/mapel tidak lengkap");
      return;
    }

    navigate(`/dashboardgurusd/rekap-absensi/mapel/${rombelId}/${mapelId}`, {
      state: { penugasan: item },
    });
  };

  if (loading) {
    return (
      <GuruLayout title="Rekap Absensi">
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Memuat mata pelajaran Anda ya...
            </p>
          </div>
        </div>
      </GuruLayout>
    );
  }

  return (
    <GuruLayout
      title={
        <>
          <FaChartBar className="text-indigo-600 inline mr-3" />
          Rekap Absensi
        </>
      }
      subtitle="Pilih mata pelajaran untuk melihat rekap kehadiran siswa"
    >
      {penugasanList.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow">
          <div className="text-7xl mb-6">📊</div>
          <h3 className="text-2xl font-semibold mb-4">
            Belum Ada Penugasan Mengajar
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Anda belum memiliki penugasan mengajar mata pelajaran apapun. Silakan
            hubungi Tata Usaha untuk penugasan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {penugasanList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {item.mapel?.nama || item.nama_mapel}
                    </h3>
                    <p className="text-indigo-600 text-xl font-medium mt-1">
                      {item.rombel
                        ? `Kelas ${item.rombel.tingkat_kelas} ${item.rombel.sub_nama}`
                        : `Kelas ${item.tingkat_kelas} ${item.sub_nama}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Siswa</div>
                    <div className="text-3xl font-bold text-gray-800">
                      {item.jumlah_siswa || 0}
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    onClick={() => handleLihatRekap(item)}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-6 rounded-2xl transition-all group text-lg font-medium"
                  >
                    <FaChartBar className="text-3xl group-hover:scale-110 transition" />
                    Lihat Rekap
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 px-8 py-4 border-t text-xs text-gray-500 flex justify-between">
                <span>Terakhir diupdate</span>
                <span>
                  {item.updated_at
                    ? new Date(item.updated_at).toLocaleDateString("id-ID")
                    : "-"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </GuruLayout>
  );
}