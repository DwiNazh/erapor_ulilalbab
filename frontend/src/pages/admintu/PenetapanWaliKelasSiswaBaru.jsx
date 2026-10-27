import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { kelasAwal } from "../../utils/rombel";

export default function PenetapanWaliKelasSiswaBaru() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const jenjang = user?.jenjang;
  const targetKelas = kelasAwal(jenjang) || 1;

  const [tahunTujuan, setTahunTujuan] = useState(null);
  const [rombels, setRombels] = useState([]);
  const [gurus, setGurus] = useState([]);
  const [waliAssignments, setWaliAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const API = "/api/tu";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 🔥 Ambil tahun aktif
        const resAktif = await api.get(`${API}/tahunajaran/aktif`);
        const aktif = resAktif.data?.data;

        let targetNama = "";
        const match = aktif?.nama?.match(/^(\d{4})\/(\d{4})$/);

        if (match) {
          const [, thAwal, thAkhir] = match;
          targetNama = `${parseInt(thAwal) + 1}/${parseInt(thAkhir) + 1}`;
        }

        // 🔥 Ambil semua tahun
        const resAll = await api.get(`${API}/tahunajaran`);
        const allTahun = resAll.data?.data || [];

        let target = allTahun.find((t) => t.nama === targetNama);

        if (!target && allTahun.length > 0) {
          target = allTahun.sort((a, b) =>
            b.nama.localeCompare(a.nama)
          )[0];
        }

        if (!target) {
          toast.error("Tahun ajaran target tidak ditemukan");
          return;
        }

        setTahunTujuan(target);

        // 🔥 Ambil rombel kelas awal jenjang
        const resRombel = await api.get(`${API}/rombel`, {
          params: {
            tahun_ajaran_id: target.id,
            kelas: targetKelas,
          },
        });

        setRombels(resRombel.data?.data || []);

        // 🔥 Ambil guru
        const resGuru = await api.get(`${API}/guru`);
        setGurus(resGuru.data?.data || []);

        // 🔥 Ambil wali kelas existing
        const resWali = await api.get(`${API}/wali-kelas`, {
          params: {
            tahun_ajaran_id: target.id,
            kelas: targetKelas,
          },
        });

        const assignments = {};
        (resWali.data?.data || []).forEach((item) => {
          assignments[item.rombel_id || item.id] = item.guru_id || null;
        });

        setWaliAssignments(assignments);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [targetKelas]);

  const handleAssignmentChange = (rombelId, guruId) => {
    setWaliAssignments((prev) => ({
      ...prev,
      [rombelId]: guruId || null,
    }));
  };

  const handleSimpan = async () => {
    if (!tahunTujuan?.id) return;

    setProcessing(true);
    try {
      await api.post(`${API}/wali-kelas/siswa-baru`, {
        tahun_ajaran_id: tahunTujuan.id,
        kelas: targetKelas,
        wali_kelas: waliAssignments,
      });

      toast.success("Penetapan wali kelas berhasil disimpan");
      navigate("/dashboardtusd/siswabaru");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdminTu />

      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-gray-900">
              Penetapan Wali Kelas (Kelas {targetKelas})
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Tahun ajaran target:{" "}
              <span className="font-medium text-blue-600">
                {tahunTujuan?.nama}
              </span>
            </p>
          </div>

          {rombels.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center text-amber-700">
              Belum ada rombel kelas {targetKelas}.<br />
              Silakan buat rombel terlebih dahulu.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="px-6 py-3 text-left font-medium text-emerald-700">
                        Rombel
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-emerald-700">
                        Tingkat
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-emerald-700">
                        Wali Kelas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rombels.map((r) => (
                      <tr key={r.id} className="hover:bg-emerald-50/30">
                        <td className="px-6 py-4 font-medium">
                          Kelas {r.tingkat_kelas || 1}
                          {r.sub_nama || r.sub_kelas || ""}
                        </td>
                        <td className="px-6 py-4">
                          {r.tingkat_kelas || 1}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={waliAssignments[r.id] || ""}
                            onChange={(e) =>
                              handleAssignmentChange(r.id, e.target.value)
                            }
                            className="w-full max-w-xs px-3 py-2 border rounded-md"
                          >
                            <option value="">Pilih Guru</option>
                            {gurus.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name} ({g.nipy || "-"})
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t flex justify-end">
                <button
                  onClick={handleSimpan}
                  disabled={processing}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium ${
                    processing
                      ? "bg-gray-100 text-gray-400"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {processing ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}