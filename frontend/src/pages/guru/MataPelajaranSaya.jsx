import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import toast from "react-hot-toast";
import SidebarGuru from "../../components/SidebarGuru";

// Import Icon
import {
  FaChalkboardTeacher,
  FaFileSignature,
  FaUsers,
  FaBookOpen,
  FaSyncAlt,
  FaChevronRight,
  FaCalendarCheck,
} from "react-icons/fa";

export default function MataPelajaranSaya() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [penugasanList, setPenugasanList] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchPenugasan = async () => {
  setLoading(true);

  try {
    const res = await api.get("/api/guru/penugasan-saya");

    if (res.data.success) {
      const dataRaw = res.data.data || [];

      // SORT MAPEL A-Z
      const sortedList = [...dataRaw].sort((a, b) => {
        const namaA = a.mapel?.nama || a.nama_mapel || "";
        const namaB = b.mapel?.nama || b.nama_mapel || "";

        return namaA.localeCompare(namaB, "id", {
          sensitivity: "base",
        });
      });

      setPenugasanList(sortedList);
    } else {
      toast.error(res.data.message || "Gagal memuat data");
    }
  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat mata pelajaran");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPenugasan();
  }, []);

  const handleInputNilai = (item) => {
    const mapelId = item.mapel_id || item.mapel?.id || item.id;

    navigate(`/dashboardgurusd/nilai/mapel/${mapelId}`, {
      state: { penugasan: item },
    });
  };

  // Skeleton Loading
  if (loading)
    return (
      <div className="flex min-h-screen bg-slate-50">
        <SidebarGuru />

        <div className="flex-1 p-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>

          <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-slate-200 rounded-[2.5rem]"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <SidebarGuru />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaBookOpen className="text-indigo-600" />
                Mata Pelajaran Saya
              </h1>

              <p className="text-slate-500 mt-1">
                Pilih mata pelajaran untuk melakukan manajemen nilai akademik.
              </p>
            </div>

            <button
              onClick={fetchPenugasan}
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {penugasanList.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-200 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChalkboardTeacher size={48} />
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-2">
                Belum Ada Penugasan
              </h3>

              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                Anda belum memiliki daftar mata pelajaran yang diampu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {penugasanList.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-indigo-500 border border-slate-200 transition-all duration-500 overflow-hidden flex flex-col"
                >
                  {/* Card Content */}
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                        <FaChalkboardTeacher size={24} />
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Siswa
                        </span>

                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          <FaUsers className="text-indigo-500 text-xs" />

                          <span className="text-lg font-black text-slate-700">
                            {item.jumlah_siswa || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.mapel?.nama || item.nama_mapel}
                    </h3>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

                      Kelas {item.rombel?.tingkat_kelas}{" "}
                      {item.rombel?.sub_nama}
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={() => handleInputNilai(item)}
                        className="w-full group/btn bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-slate-200 hover:shadow-indigo-200"
                      >
                        <FaFileSignature />

                        Input Nilai Siswa

                        <FaChevronRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <FaCalendarCheck className="text-indigo-500" />

                      <span>Update terakhir</span>
                    </div>

                    <span className="text-slate-600">
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </span>
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