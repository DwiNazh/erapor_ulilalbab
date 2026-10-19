import React, { useState, useEffect } from "react";
import api from "../../../api";
import toast from "react-hot-toast";
import SidebarGuru from "../../../components/SidebarGuru";
import {
  FaRunning,
  FaSave,
  FaSyncAlt,
} from "react-icons/fa";

const GRADE_COLOR = {
  A: "bg-emerald-100 text-emerald-700 border-emerald-300",
  B: "bg-blue-100 text-blue-700 border-blue-300",
  C: "bg-amber-100 text-amber-700 border-amber-300",
  D: "bg-orange-100 text-orange-700 border-orange-300",
  E: "bg-rose-100 text-rose-700 border-rose-300",
  "": "bg-gray-100 text-gray-400 border-gray-200",
};

export default function EkstrakurikulerGuruSD() {
  const [rombel, setRombel] = useState(null);
  const [ekskulList, setEkskulList] = useState([]);
  const [siswa, setSiswa] = useState([]);

  const [semester, setSemester] = useState("1");

  // ===== Tahun ajaran: tidak dikunci ke aktif saja =====
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [tahunAktif, setTahunAktif] = useState(null);
  const [selectedTahunId, setSelectedTahunId] = useState(null);
  const [tahunAjaranNama, setTahunAjaranNama] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  const [templateDeskripsi, setTemplateDeskripsi] = useState({});

  const generateDeskripsiEkskul = (namaEkskul, grade) => {
    if (!grade) return "";
    return templateDeskripsi?.[namaEkskul]?.[grade] || "";
  };

  // ============================
  // STEP 1: ambil tahun aktif & daftar semua tahun ajaran (sekali di awal)
  // ============================
  const loadTahunAjaran = async () => {
    try {
      const [resTahun, resTahunList] = await Promise.all([
        api.get("/api/guru/tahunajaran/aktif"),
        api.get("/api/guru/tahunajaran"),
      ]);

      const tahunAktifData = resTahun.data?.data || null;
      const tahunListData = resTahunList.data?.data || [];

      setTahunAktif(tahunAktifData);
      setTahunAjaranList(tahunListData);

      const defaultTahun = tahunAktifData || tahunListData[0] || null;
      setSelectedTahunId(defaultTahun?.id || null);
      setTahunAjaranNama(defaultTahun?.nama || "");
    } catch (err) {
      toast.error("Gagal memuat data tahun ajaran");
    }
  };

  useEffect(() => {
    loadTahunAjaran();
  }, []);

  // ============================
  // STEP 2: fetch rombel, template, & data ekskul — sesuai tahun ajaran + semester
  // ============================
  const fetchData = async () => {
    if (!selectedTahunId) return;
    setLoading(true);

    try {
      const [
        resRombel,
        resTemplate,
      ] = await Promise.all([
        api.get("/api/guru/rombel", {
          params: { tahun_ajaran_id: selectedTahunId },
        }),
        api.get("/api/guru/template-deskripsi/ekstrakurikuler"),
      ]);

      const rombelData = resRombel.data.data?.[0] || null;
      setRombel(rombelData);
      setTemplateDeskripsi(resTemplate.data?.data || {});

      if (!rombelData) {
        toast.error("Anda bukan Wali Kelas pada tahun ajaran ini.");
        setEkskulList([]);
        setSiswa([]);
        return;
      }

      const resEkskul = await api.get("/api/guru/ekstrakurikuler", {
        params: {
          semester,
          tahun_ajaran_id: selectedTahunId,
        },
      });

      if (resEkskul.data.success) {
        setEkskulList(resEkskul.data.data.ekskul_list || []);

        // Update nama tahun ajaran sesuai response backend (kalau ada perbedaan format)
        if (resEkskul.data.data.tahun_ajaran) {
          setTahunAjaranNama(resEkskul.data.data.tahun_ajaran);
        }

        const formatted = resEkskul.data.data.siswa
          .map((s) => {
            let ekskulSiswa = Array.isArray(s.ekskul) ? [...s.ekskul] : [];

            const adaPramuka = ekskulSiswa.some(
              (e) => e.nama.toLowerCase() === "pramuka"
            );

            if (!adaPramuka) {
              ekskulSiswa.unshift({
                nama: "Pramuka",
                nilai: "",
                deskripsi: "",
              });
            }

            return {
              ...s,
              ekskul: ekskulSiswa,
            };
          })
          .sort((a, b) =>
            a.nama.localeCompare(b.nama, "id", { sensitivity: "base" })
          );

        setSiswa(formatted);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [semester, selectedTahunId]); // eslint-disable-line

  const handleSave = async () => {
    if (!tahunAjaranNama) {
      return toast.error("Tahun ajaran belum dipilih!");
    }

    setLoadingSave(true);

    try {
      const payload = {
        semester,
        tahun_ajaran: tahunAjaranNama,

        siswa: siswa.map((s) => ({
          id: s.id,
          ekskul: s.ekskul.map((e) => ({
            nama: e.nama,
            nilai: e.nilai,
            deskripsi: e.deskripsi,
          })),
        })),
      };

      const res = await api.post(
        "/api/guru/ekstrakurikuler/save-bulk",
        payload
      );

      if (res.data.success) {
        toast.success(
          `Berhasil menyimpan Semester ${semester} TA ${tahunAjaranNama}`
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleTahunChange = (e) => {
    const tahunId = Number(e.target.value);
    const tahunObj = tahunAjaranList.find((t) => t.id === tahunId);

    setSelectedTahunId(tahunId);
    setTahunAjaranNama(tahunObj?.nama || "");

    setRombel(null);
    setEkskulList([]);
    setSiswa([]);
  };

  const handleNilaiChange = (idSiswa, namaEkskul, nilaiBaru) => {
    setSiswa((prev) =>
      prev.map((s) => {
        if (s.id !== idSiswa) return s;

        return {
          ...s,
          ekskul: s.ekskul.map((e) =>
            e.nama === namaEkskul
              ? {
                  ...e,
                  nilai: nilaiBaru,
                  deskripsi: generateDeskripsiEkskul(namaEkskul, nilaiBaru),
                }
              : e
          ),
        };
      })
    );
  };

  const toggleEkskul = (idSiswa, namaEkskul) => {
    setSiswa((prev) =>
      prev.map((s) => {
        if (s.id !== idSiswa) return s;

        const sudahIkut = s.ekskul.some((e) => e.nama === namaEkskul);

        if (sudahIkut) {
          return {
            ...s,
            ekskul: s.ekskul.filter((e) => e.nama !== namaEkskul),
          };
        }

        if (s.ekskul.length >= 3) {
          toast.error("Maksimal 3 ekskul!");
          return s;
        }

        return {
          ...s,
          ekskul: [
            ...s.ekskul,
            {
              nama: namaEkskul,
              nilai: "",
              deskripsi: "",
            },
          ],
        };
      })
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <SidebarGuru />
        <div className="flex-1 p-10 font-bold text-slate-400 text-center">
          Memuat Data Semester {semester}...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarGuru />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">

            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <FaRunning className="text-indigo-600" />
                Penilaian Ekskul
              </h1>

              <p className="text-slate-500 font-bold">
                TA: {tahunAjaranNama || "-"} | Rombel: {rombel ? `${rombel.tingkat_kelas}${rombel.sub_nama}` : "Belum ada"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* ===== Dropdown Tahun Ajaran (baru) ===== */}
              <select
                value={selectedTahunId || ""}
                onChange={handleTahunChange}
                className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {tahunAjaranList.length === 0 && tahunAktif && (
                  <option value={tahunAktif.id}>{tahunAktif.nama}</option>
                )}
                {tahunAjaranList.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama}{t.aktif ? " (Aktif)" : ""}
                  </option>
                ))}
              </select>

              {/* SEMESTER */}
              <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                <button
                  onClick={() => setSemester("1")}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    semester === "1"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Semester 1
                </button>

                <button
                  onClick={() => setSemester("2")}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    semester === "2"
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Semester 2
                </button>
              </div>

              {/* SAVE */}
              <button
                onClick={handleSave}
                disabled={loadingSave || !rombel}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loadingSave ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaSave />
                )}
                Simpan Smt {semester}
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">No</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">Siswa</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Partisipasi</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-400">Nilai & Deskripsi</th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {siswa.length > 0 ? (
                    siswa.map((s, idx) => (
                      <tr
                        key={s.id}
                        className="align-top hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-5 text-xs text-slate-400 font-bold">{idx + 1}</td>

                        <td className="px-6 py-5">
                          <div className="font-bold text-sm text-slate-700">{s.nama}</div>
                          <div className="text-[10px] text-slate-400">NIS: {s.nis}</div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2 justify-center max-w-[220px] mx-auto">
                            {ekskulList.map((ek) => (
                              <button
                                key={ek.nama}
                                onClick={() => toggleEkskul(s.id, ek.nama)}
                                className={`px-3 py-1 rounded-xl text-[9px] font-black border-2 transition-all 
                                ${
                                  s.ekskul.some((e) => e.nama === ek.nama)
                                    ? "bg-indigo-600 border-indigo-700 text-white shadow-md"
                                    : "bg-white text-slate-400 border-slate-100"
                                }`}
                              >
                                {ek.nama}
                              </button>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-5 space-y-3">
                          {s.ekskul.map((e) => (
                            <div
                              key={e.nama}
                              className="bg-slate-50 border border-slate-200 rounded-2xl p-3"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black uppercase text-slate-500">
                                  {e.nama}
                                </span>

                                <select
                                  value={e.nilai}
                                  onChange={(ev) =>
                                    handleNilaiChange(s.id, e.nama, ev.target.value)
                                  }
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border-2 ${
                                    GRADE_COLOR[e.nilai] || ""
                                  }`}
                                >
                                  <option value="">Grade</option>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="E">E</option>
                                </select>
                              </div>

                              <div className="text-[11px] bg-white p-2 rounded-lg border border-slate-200 italic text-slate-600">
                                {e.deskripsi || "-"}
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-slate-400 font-bold text-sm">
                        Tidak ada data siswa pada tahun ajaran ini.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}