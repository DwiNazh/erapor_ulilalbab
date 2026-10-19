import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import SidebarGuru from "../../components/SidebarGuru";
import toast from "react-hot-toast";

export default function DaftarSiswaRombel() {
  const navigate = useNavigate();
  const [rombels, setRombels] = useState([]);
  const [selectedRombel, setSelectedRombel] = useState(null);
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proteksi ditangani ProtectedRoute — langsung fetch data
    const fetchData = async () => {
      try {
        const resRombel = await api.get('/api/guru/rombel');
        const rombelsData = resRombel.data.data || [];
        setRombels(rombelsData);

        if (rombelsData.length > 0) {
          const firstId = rombelsData[0].id;
          const resSiswa = await api.get(`/api/guru/rombel/${firstId}/siswa`);
          setSiswa(resSiswa.data.data || []);
          setSelectedRombel(firstId);
        }
      } catch (err) {
        console.error('Error fetch data guru:', err.response?.status, err.response?.data);
        if (err.response?.status === 401) {
          toast.error("Sesi login habis. Silakan login ulang.");
          navigate("/login");
        } else {
          toast.error("Gagal memuat data rombel/siswa");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleRombelChange = async (rombelId) => {
    setSelectedRombel(rombelId);
    setLoading(true);
    try {
      const res = await api.get(`/api/guru/rombel/${rombelId}/siswa`);
      setSiswa(res.data.data || []);
    } catch (err) {
      toast.error("Gagal memuat siswa");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarGuru />

      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Daftar Siswa Rombel</h1>

        {rombels.length > 0 ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Rombel</label>
            <select
              value={selectedRombel || ""}
              onChange={(e) => handleRombelChange(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {rombels.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama} ({r.jumlah_siswa || 0} siswa)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-amber-700 mb-6">Anda belum menjadi wali kelas di rombel manapun.</p>
        )}

        {siswa.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center text-amber-700">
            Tidak ada siswa di rombel ini
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {siswa.map((s, index) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.nis || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.nisn || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}