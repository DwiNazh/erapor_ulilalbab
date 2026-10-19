import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import toast from "react-hot-toast";
import api from "../../api";
import { perluKategori } from "../../utils/rombel";
import {
  FaUserGraduate,
  FaArrowAltCircleUp,
  FaUserTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronRight,
  FaSyncAlt,
} from "react-icons/fa";

export default function PromosiSiswa() {
  const navigate = useNavigate();

  const [activeTahun, setActiveTahun] = useState(null);
  const [tahunTarget, setTahunTarget] = useState(null);
  const [siswaList, setSiswaList] = useState([]);
  const [promosiSelections, setPromosiSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const API = "/api/tu";

  const loadData = async () => {
    setLoading(true);
    try {
      const resAktif = await api.get(`${API}/tahunajaran/aktif`);
      const tahunAktifData = resAktif.data?.data || null;
      setActiveTahun(tahunAktifData);

      if (!tahunAktifData) {
        toast.error("Tidak ada tahun ajaran aktif");
        return;
      }

      const match = tahunAktifData.nama.match(/^(\d{4})\/(\d{4})$/);
      let targetNama = match
        ? `${parseInt(match[1]) + 1}/${parseInt(match[2]) + 1}`
        : "";

      const resAll = await api.get(`${API}/tahunajaran`);
      const allTahun = resAll.data?.data || [];
      const targetData = allTahun.find((t) => t.nama === targetNama);

      if (!targetData) {
        toast.error(`Tahun ajaran target (${targetNama}) belum ada`);
        return;
      }
      setTahunTarget(targetData);

      const resSiswa = await api.get(`${API}/data-siswa`);
      const allSiswa = resSiswa.data?.data || [];

      const siswaAktif = allSiswa.filter(
        (s) =>
          s.tahun_ajaran === tahunAktifData.nama &&
          s.is_processed !== 1 &&
          [1, 2, 3, 4, 5, 6].includes(Number(s.tingkat_kelas || s.kelas || 0)),
      );

      setSiswaList(siswaAktif);

      const initial = {};
      siswaAktif.forEach((s) => {
        const id = s.siswa_id || s.id;
        const kelas = Number(s.tingkat_kelas || s.kelas || 0);
        if (id) initial[id] = kelas === 6 ? "lulus" : "naik";
      });
      setPromosiSelections(initial);
    } catch (err) {
      toast.error("Gagal memuat data akademik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const groupedSiswa = siswaList.reduce((acc, s) => {
    const kelas = Number(s.tingkat_kelas || s.kelas || 0);
    if (!acc[kelas]) acc[kelas] = [];
    acc[kelas].push(s);
    return acc;
  }, {});

  const sortedKelas = Object.keys(groupedSiswa)
    .map(Number)
    .sort((a, b) => a - b);

  const kelasTujuan = (s) => {
    const id = s.siswa_id || s.id;
    const kelas = Number(s.tingkat_kelas || s.kelas || 0);
    const status = promosiSelections[id];
    if (status === "naik") return kelas + 1;
    if (status === "tinggal") return kelas;
    return 0; // lulus
  };

  const kategoriKosong = siswaList.filter(
    (s) => perluKategori(kelasTujuan(s)) && !s.kategori,
  );

  const handleStatusAll = (status) => {
    const updates = {};
    siswaList.forEach((s) => {
      const id = s.siswa_id || s.id;
      const kelas = Number(s.tingkat_kelas || s.kelas || 0);
      if (status === "naik" && kelas === 6) return; // Kelas 6 tidak bisa 'naik'
      if (status === "lulus" && kelas !== 6) return; // Selain kelas 6 tidak bisa 'lulus'
      if (id) updates[id] = status;
    });
    setPromosiSelections((prev) => ({ ...prev, ...updates }));
    toast.success(`Berhasil mengubah status ke "${status}"`);
  };

  const handlePromosi = async () => {
    if (siswaList.length === 0) return toast.error("Tidak ada siswa");
    if (
      !window.confirm(
        `Proses promosi ${siswaList.length} siswa ke TA ${tahunTarget.nama}?`,
      )
    )
    
      return;

    setProcessing(true);
    try {
      const naik = [],
        tinggal = [],
        lulus = [];
      Object.entries(promosiSelections).forEach(([siswaId, status]) => {
        if (status === "lulus") lulus.push({ id: siswaId });
        else if (status === "tinggal") tinggal.push({ id: siswaId });
        else naik.push({ id: siswaId });
      });

      const payload = {
        naik,
        tinggal,
        lulus,
        tahun_ajaran_target_id: tahunTarget.id,
      };
      await api.post(`${API}/kenaikan-kelas/promosi`, payload);
      toast.success("Promosi massal berhasil diproses");
      navigate("/dashboardtusd/penempatan-siswa");
    } catch (err) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan sistem");
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <FaSyncAlt className="animate-spin text-indigo-600 text-3xl" />
          <p className="text-slate-500 font-medium">
            Menganalisis data promosi...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <FaArrowAltCircleUp className="text-indigo-600" /> Promosi
                Massal Siswa
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">
                  {activeTahun?.nama}
                </span>
                <FaChevronRight className="text-slate-400" />
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                  {tahunTarget?.nama}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 max-w-md">
              <FaExclamationCircle className="text-amber-500 mt-1 flex-shrink-0" />
              <p className="text-[12px] text-amber-800 leading-relaxed">
                Tentukan siapa yang <b>Naik</b>, <b>Tinggal</b>, atau{" "}
                <b>Lulus</b>. Setelah dipromosikan, siswa akan muncul di menu
                "Penempatan" untuk pembagian sub-kelas.
              </p>
            </div>
          </div>

          {/* QUICK ACTION CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => handleStatusAll("naik")}
              className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FaArrowAltCircleUp />
                </div>
                <span className="font-bold text-slate-700">
                  Naikkan Semua (1-5)
                </span>
              </div>
            </button>

            {kategoriKosong.length > 0 && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm font-medium">
                {kategoriKosong.length} siswa akan berada di kelas 4 ke atas
                tetapi kategori Ikhwan/Akhwat-nya belum diisi. Mereka tidak akan
                bisa ditempatkan ke rombel Ikhwan/Akhwat sampai datanya diisi di
                menu Data Siswa. Promosi tetap bisa diproses.
              </div>
            )}



            <button
              onClick={() => handleStatusAll("lulus")}
              className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FaUserGraduate />
                </div>
                <span className="font-bold text-slate-700">
                  Luluskan Semua (6)
                </span>
              </div>
            </button>

            <button
              onClick={() => handleStatusAll("tinggal")}
              className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-rose-500 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <FaUserTimes />
                </div>
                <span className="font-bold text-slate-700">
                  Set Tinggal Kelas
                </span>
              </div>
            </button>
          </div>

          {/* LIST SISWA PER KELAS */}
          <div className="space-y-10">
            {sortedKelas.map((kelas) => (
              <div
                key={kelas}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs">
                      {kelas}
                    </span>
                    Tingkat Kelas {kelas}
                  </h2>
                  <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                    {groupedSiswa[kelas].length} Siswa
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4">Nama Siswa</th>
                        <th className="px-6 py-4">NIS</th>
                        <th className="px-6 py-4">Status Akhir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {groupedSiswa[kelas].map((s) => {
                        const siswaId = s.siswa_id || s.id;
                        const currentStatus = promosiSelections[siswaId];

                        return (
                          <tr
                            key={siswaId}
                            className="hover:bg-slate-50 transition-colors group"
                          >
                            <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                              {s.nis}
                            </td>
                            
                            <td className="px-6 py-4 font-bold text-slate-700">
                              {s.nama}
                              {perluKategori(kelasTujuan(s)) && !s.kategori && (
                                <span className="ml-2 text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                                  Kategori kosong
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4 w-48">
                              <select
                                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none transition-all
                                  ${
                                    currentStatus === "naik" ||
                                    currentStatus === "lulus"
                                      ? "bg-emerald-50 border-emerald-100 text-emerald-700 focus:ring-emerald-500"
                                      : "bg-rose-50 border-rose-100 text-rose-700 focus:ring-rose-500"
                                  }`}
                                value={currentStatus}
                                onChange={(e) =>
                                  setPromosiSelections((prev) => ({
                                    ...prev,
                                    [siswaId]: e.target.value,
                                  }))
                                }
                              >
                                {kelas === 6 ? (
                                  <>
                                    <option value="lulus">LULUS</option>
                                    <option value="tinggal">
                                      TINGGAL KELAS
                                    </option>
                                  </>
                                ) : (
                                  <>
                                    <option value="naik">NAIK KELAS</option>
                                    <option value="tinggal">
                                      TINGGAL KELAS
                                    </option>
                                  </>
                                )}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {siswaList.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                <FaCheckCircle className="text-emerald-500 text-5xl mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-slate-700">
                  Semua Siswa Sudah Dipromosikan
                </h3>
                <p className="text-slate-500">
                  Tidak ada data siswa yang perlu diproses untuk periode ini.
                </p>
              </div>
            )}
          </div>

          {/* FINAL ACTION */}
          {siswaList.length > 0 && (
            <div className="mt-12 p-6 bg-white border-t border-slate-200 sticky bottom-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] flex items-center justify-between rounded-t-3xl">
              <div className="text-sm text-slate-500 font-medium">
                Total Siswa diproses:{" "}
                <span className="text-indigo-600 font-bold">
                  {siswaList.length} Siswa
                </span>
              </div>
              <button
                onClick={handlePromosi}
                disabled={processing}
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {processing ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaCheckCircle />
                )}
                {processing ? "Memproses Data..." : "Konfirmasi & Promosikan"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
