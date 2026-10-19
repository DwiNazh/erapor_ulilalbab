import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import SidebarGuru from "../../../components/SidebarGuru";
import { FaSave, FaChevronLeft, FaCalendarAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react"; 

const STATUS_OPTIONS = [
  { value: "H", label: "Hadir", activeClass: "bg-emerald-500 text-white shadow-md shadow-emerald-100" },
  { value: "S", label: "Sakit", activeClass: "bg-amber-500 text-white shadow-md shadow-amber-100" },
  { value: "I", label: "Izin", activeClass: "bg-sky-500 text-white shadow-md shadow-sky-100" },
  { value: "A", label: "Alfa", activeClass: "bg-rose-500 text-white shadow-md shadow-rose-100" },
];

export default function InputAbsensiHarian() {
  const { rombelId } = useParams();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [tanggal, setTanggal] = useState(todayStr);
  // 1. Set default awal ke string kosong atau null agar tidak mengunci ke semester 1
  const [semester, setSemester] = useState(""); 
  const [siswaList, setSiswaList] = useState([]);
  const [absensi, setAbsensi] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 2. Fungsi baru untuk mengambil Semester yang sedang Aktif di sistem
  const fetchPeriodeAktif = async () => {
    try {
      const res = await api.get("/api/guru/tahunajaran/aktif");
      if (res.data.success && res.data.data?.semester) {
        // Otomatis set state sesuai kolom semester di table tahun_ajaran (misal: 'semester1' atau 'semester2')
        setSemester(res.data.data.semester);
      } else {
        setSemester("semester1"); // Fallback jika data kosong
      }
    } catch (err) {
      console.error("Gagal mengambil tahun ajaran aktif", err);
      setSemester("semester1"); // Fallback jika request error
    }
  };

  const fetchSiswa = async () => {
    if (!semester) return; // Tunggu sampai state semester terisi periode aktif dari API
    
    setLoading(true);
    try {
      const res = await api.get(`/api/guru/absensi/harian/siswa/${rombelId}`);
      const list = res.data.data || [];
      setSiswaList(list);

      const resAbsen = await api.get("/api/guru/absensi/harian/by-tanggal", {
        params: { rombel_id: rombelId, tanggal, semester },
      });
      const existing = resAbsen.data.data || [];
      const map = {};
      list.forEach((s) => {
        const found = existing.find((e) => e.siswa_tahun_id === s.siswa_tahun_id);
        map[s.siswa_tahun_id] = {
          status: found?.status || "H",
          keterangan: found?.keterangan || "",
        };
      });
      setAbsensi(map);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal memuat data siswa";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle 1: Ambil periode aktif saat komponen mount pertama kali
  useEffect(() => {
    fetchPeriodeAktif();
  }, []);

  // Lifecycle 2: Lakukan fetch siswa & data absensi jika kriteria filter berubah
  useEffect(() => {
    fetchSiswa();
  }, [tanggal, semester]);

  const setStatus = (siswaTahunId, status) => {
    setAbsensi((prev) => ({
      ...prev,
      [siswaTahunId]: { ...prev[siswaTahunId], status },
    }));
  };

  const setKeterangan = (siswaTahunId, keterangan) => {
    setAbsensi((prev) => ({
      ...prev,
      [siswaTahunId]: { ...prev[siswaTahunId], keterangan },
    }));
  };

  const tandaiSemuaHadir = () => {
    const map = {};
    siswaList.forEach((s) => {
      map[s.siswa_tahun_id] = { status: "H", keterangan: "" };
    });
    setAbsensi(map);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        rombel_id: rombelId,
        tanggal,
        semester,
        absensi: siswaList.map((s) => ({
          siswa_tahun_id: s.siswa_tahun_id,
          status: absensi[s.siswa_tahun_id]?.status || "H",
          keterangan: absensi[s.siswa_tahun_id]?.keterangan || null,
        })),
      };
      await api.post("/api/guru/absensi/harian", payload);
      toast.success(`Absensi semester ${semester === 'semester1' ? '1' : '2'} tanggal ${tanggal} berhasil disimpan`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan absensi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarGuru />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors mb-6"
          >
            <FaChevronLeft /> Kembali
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-800">
                  Input Absensi Harian
                </h1>
                <p className="text-slate-400 text-sm">
                  Tandai kehadiran siswa untuk tanggal dan semester yang dipilih
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* PILIHAN DROPDOWN SEMESTER BERUBAH SECARA DINAMIS */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="bg-transparent outline-none font-bold text-xs text-slate-700 cursor-pointer"
                  >
                    <option value="semester1">Semester 1 (Ganjil)</option>
                    <option value="semester2">Semester 2 (Genap)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                  <FaCalendarAlt className="text-slate-400" />
                  <input
                    type="date"
                    value={tanggal}
                    max={todayStr}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="bg-transparent outline-none font-bold text-slate-700 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={tandaiSemuaHadir}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mb-4"
            >
              Tandai semua Hadir
            </button>

            {loading ? (
              <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
                <span>Memuat data siswa...</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {siswaList.map((s, idx) => (
                  <div
                    key={s.siswa_tahun_id}
                    className="py-4 flex flex-col md:flex-row md:items-center gap-3"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-sm">
                        {idx + 1}. {s.nama}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">{s.nis}</p>
                    </div>

                    <div className="flex gap-2">
                      {STATUS_OPTIONS.map((opt) => {
                        const active = absensi[s.siswa_tahun_id]?.status === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setStatus(s.siswa_tahun_id, opt.value)}
                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                              active
                                ? opt.activeClass
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}
                            title={opt.label}
                          >
                            {opt.value}
                          </button>
                        );
                      })}
                    </div>

                    {absensi[s.siswa_tahun_id]?.status !== "H" && (
                      <input
                        type="text"
                        placeholder="Keterangan (opsional)"
                        value={absensi[s.siswa_tahun_id]?.keterangan || ""}
                        onChange={(e) => setKeterangan(s.siswa_tahun_id, e.target.value)}
                        className="w-full md:w-48 px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    )}
                  </div>
                ))}

                {siswaList.length === 0 && (
                  <p className="text-center text-slate-400 py-10">
                    Tidak ada siswa di rombel ini pada tahun ajaran aktif.
                  </p>
                )}
              </div>
            )}

            {!loading && siswaList.length > 0 && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all disabled:bg-slate-300"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <FaSave />} Simpan Absensi
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}