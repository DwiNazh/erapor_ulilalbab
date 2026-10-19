import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import toast from "react-hot-toast";
import SidebarGuru from "../../../components/SidebarGuru";
import {
  FaSave,
  FaChevronLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const STATUS_OPTIONS = [
  { value: "H", label: "Hadir", color: "emerald" },
  { value: "S", label: "Sakit", color: "amber" },
  { value: "I", label: "Izin", color: "sky" },
  { value: "A", label: "Alfa", color: "rose" },
];

// Map warna -> className tetap (Tailwind tidak bisa baca class yang dirakit dinamis bg-${color}-500)
const STATUS_COLOR_CLASS = {
  emerald: "bg-emerald-500 text-white shadow-md",
  amber: "bg-amber-500 text-white shadow-md",
  sky: "bg-sky-500 text-white shadow-md",
  rose: "bg-rose-500 text-white shadow-md",
};

export default function InputAbsensiHarian() {
  const { rombelId } = useParams();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [tanggal, setTanggal] = useState(todayStr);
  const [siswaList, setSiswaList] = useState([]);
  const [absensi, setAbsensi] = useState({}); // { siswa_tahun_id: { status, keterangan } }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sudahDiinput, setSudahDiinput] = useState(false); // TAMBAHAN: status apakah tanggal ini sudah diinput

  const fetchSiswa = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/guru/absensi-harian/siswa/${rombelId}`);
      const list = res.data.data || [];
      setSiswaList(list);

      // Cek apakah tanggal ini sudah ada absensinya
      const resAbsen = await api.get("/api/guru/absensi-harian/by-tanggal", {
        params: { rombel_id: rombelId, tanggal },
      });
      const existing = resAbsen.data.data || [];

      // TAMBAHAN: tandai apakah tanggal ini sudah pernah diinput
      setSudahDiinput(existing.length > 0);

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
      toast.error("Gagal memuat data siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiswa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tanggal]);

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
        absensi: siswaList.map((s) => ({
          siswa_tahun_id: s.siswa_tahun_id,
          status: absensi[s.siswa_tahun_id]?.status || "H",
          keterangan: absensi[s.siswa_tahun_id]?.keterangan || null,
        })),
      };
      await api.post("/api/guru/absensi-harian", payload);
      toast.success(`Absensi tanggal ${tanggal} berhasil disimpan`);
      setSudahDiinput(true); // TAMBAHAN: setelah simpan, tandai sebagai sudah diinput
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-800">
                  Input Absensi Harian
                </h1>
                <p className="text-slate-400 text-sm">
                  Tandai kehadiran siswa untuk tanggal yang dipilih
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                  <FaCalendarAlt className="text-slate-400" />
                  <input
                    type="date"
                    value={tanggal}
                    max={todayStr}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="bg-transparent outline-none font-bold text-slate-700"
                  />
                </div>

                {/* TAMBAHAN: badge status sudah/belum diinput */}
                {!loading &&
                  (sudahDiinput ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full whitespace-nowrap">
                      <FaCheckCircle /> Sudah diinput
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full whitespace-nowrap">
                      <FaExclamationCircle /> Belum diinput
                    </span>
                  ))}
              </div>
            </div>

            <button
              onClick={tandaiSemuaHadir}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 mb-4"
            >
              Tandai semua Hadir
            </button>

            {loading ? (
              <div className="py-16 text-center text-slate-400">Memuat data siswa...</div>
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
                                ? STATUS_COLOR_CLASS[opt.color]
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
                    Tidak ada siswa di rombel ini.
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
                {saving ? <FaSyncIcon /> : <FaSave />} Simpan Absensi
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Kecil: spinner ikon dipisah biar import tidak bentrok nama
function FaSyncIcon() {
  return <span className="animate-spin">⏳</span>;
}