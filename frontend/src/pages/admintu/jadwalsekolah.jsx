import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import * as XLSX from "xlsx";
import {
  FaChalkboardTeacher,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
  FaSyncAlt,
  FaBook,
  FaDoorOpen,
  FaDownload,
  FaUpload,
  FaTimes,
  FaClock
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { daftarKelas, kelasAwal } from "../../utils/rombel";

export default function JadwalSekolahTerintegrasi() {
  const { user } = useAuth();
  const jenjang = user?.jenjang;

  const [rombels, setRombels] = useState([]);
  const [selectedRombelId, setSelectedRombelId] = useState(null);
  const [selectedRombelName, setSelectedRombelName] = useState("");
  const [selectedKelas, setSelectedKelas] = useState(null);

  const [guruList, setGuruList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [tahunAktif, setTahunAktif] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    guru_id: "",
    mapel_id: "",
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
    tahun_ajaran_id: "",
  });

  const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // Opsi kelas dinamis mengikuti jenjang admin login (SD: 1-6, SMP: 7-9, SMA: 10-12)
  const kelasOptions = useMemo(() => {
    if (jenjang) {
      return daftarKelas(jenjang);
    }
    // Jika superadmin / jenjang tidak terikat, ambil kelas unik dari rombel aktif jika ada
    if (rombels.length > 0) {
      const uniqueKelas = Array.from(
        new Set(rombels.map((r) => Number(r.tingkat_kelas || r.kelas)).filter(Boolean))
      ).sort((a, b) => a - b);
      if (uniqueKelas.length > 0) {
        return uniqueKelas;
      }
    }
    return daftarKelas(jenjang);
  }, [jenjang, rombels]);

  // Reset kelas terpilih jika di luar opsi jenjang aktif
  useEffect(() => {
    if (selectedKelas && !kelasOptions.includes(selectedKelas)) {
      setSelectedKelas(null);
      setSelectedRombelId(null);
      setJadwalList([]);
    }
  }, [kelasOptions, selectedKelas]);

  const API = "/api/tu";

  // ================================
  // CONVERT JAM EXCEL -> HH:MM
  // ================================
  const convertExcelTimeToHHMM = (value) => {
    if (value === null || value === undefined || value === "") return "";

    if (typeof value === "string") {
      const v = value.trim();
      if (v.includes(":")) {
        return v.substring(0, 5);
      }
      return "";
    }

    if (typeof value === "number") {
      const totalMinutes = Math.round(value * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }

    return "";
  };

  // ================================
  // FETCH DATA AWAL
  // ================================
  const fetchData = async () => {
    setLoading(true);
    try {
      const resAktif = await api.get(`${API}/tahunajaran/aktif`);
      const tahunAktifData = resAktif.data?.data;
      setTahunAktif(tahunAktifData);

      if (tahunAktifData?.id) {
        setFormData((prev) => ({
          ...prev,
          tahun_ajaran_id: tahunAktifData.id,
        }));

        const [resRombel, resMapel, resGuru] = await Promise.all([
          api.get(`${API}/rombel`, {
            params: { tahun_ajaran_id: tahunAktifData.id },
          }),
          api.get(`${API}/jadwal/mapel`),
          api.get(`${API}/guru-list`),
        ]);

        setRombels(resRombel.data?.data || []);
        setMapelList(resMapel.data?.data || []);
        // guru-list returns [{id, nama}] — normalise to always have 'name' alias
        const rawGuru = resGuru.data?.data || [];
        setGuruList(rawGuru.map(g => ({ ...g, name: g.nama ?? g.name })));
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data utama");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================================
  // DOWNLOAD TEMPLATE JADWAL EXCEL
  // ================================
  const handleDownloadTemplateJadwal = () => {
    const contohKelas = kelasAwal(jenjang) || 1;
    const templateData = [
      {
        nipy: "4012",
        nama_guru: "Putri Maharani, S.Pd.",
        nama_mapel: "IPAS",
        kelas: contohKelas,
        rombel: "B",
        hari: "selasa",
        jam_mulai: "08:00",
        jam_selesai: "09:00",
      },
      {
        nipy: "4012",
        nama_guru: "Putri Maharani, S.Pd.",
        nama_mapel: "PKn",
        kelas: contohKelas,
        rombel: "B",
        hari: "selasa",
        jam_mulai: "09:00",
        jam_selesai: "10:00",
      },
    ];

    const wsTemplate = XLSX.utils.json_to_sheet(templateData);

    wsTemplate["!cols"] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 8 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
    ];

    const keteranganData = [
      { Keterangan: "PETUNJUK PENGISIAN TEMPLATE IMPORT JADWAL SEKOLAH" },
      { Keterangan: "" },
      { Keterangan: "Template ini digunakan untuk melakukan import jadwal pelajaran secara massal melalui file Excel." },
      { Keterangan: "" },
      { Keterangan: "Pastikan seluruh data yang diinput sesuai dengan data master (Guru, Mapel, Rombel) yang telah terdaftar pada sistem." },
      { Keterangan: "" },
      { Keterangan: "Kolom yang wajib diisi: nipy, nama_mapel, kelas, rombel, hari, jam_mulai, jam_selesai." },
      { Keterangan: "" },
      { Keterangan: "Format jam wajib menggunakan format HH:MM (contoh: 08:00, 13:30)." },
      { Keterangan: "Nama mapel dapat diisi menggunakan KODE MAPEL (disarankan) atau NAMA MAPEL sesuai daftar mapel pada sheet 'Daftar Mapel'." },
      { Keterangan: "" },
      { Keterangan: "Kolom nama_guru hanya bersifat informasi/opsional, sistem akan mencari guru berdasarkan NIPY." },
      { Keterangan: "" },
      { Keterangan: "Penulisan hari disarankan menggunakan huruf kecil (contoh: senin, selasa, rabu)." },
      { Keterangan: "" },
      { Keterangan: "Setelah file selesai diisi, simpan dalam format .xlsx lalu upload melalui menu Import Jadwal." },
    ];

    const wsKeterangan = XLSX.utils.json_to_sheet(keteranganData);
    wsKeterangan["!cols"] = [{ wch: 100 }];

    const daftarMapelData = mapelList.map((m) => ({
      id: m.id,
      kode_mapel: m.kode,
      nama_mapel: m.nama,
    }));

    const wsMapel = XLSX.utils.json_to_sheet(daftarMapelData);
    wsMapel["!cols"] = [
      { wch: 6 },
      { wch: 15 },
      { wch: 40 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, wsTemplate, "Template Jadwal");
    XLSX.utils.book_append_sheet(workbook, wsKeterangan, "Keterangan");
    XLSX.utils.book_append_sheet(workbook, wsMapel, "Daftar Mapel");

    XLSX.writeFile(workbook, "template_import_jadwal_sekolah.xlsx");
  };

  // ================================
  // LOAD JADWAL PER ROMBEL
  // ================================
  const handleSelectRombel = async (rombel) => {
    const rombelId = rombel.id;
    const rombelData = rombels.find((r) => r.id === rombelId);
    const rombelName = rombelData
      ? `Kelas ${rombelData.tingkat_kelas} ${rombelData.sub_nama}`
      : `Rombel ${rombelId}`;

    setSelectedRombelId(rombelId);
    setSelectedRombelName(rombelName);

    try {
      const res = await api.get(`${API}/jadwal/rombel/${rombelId}`);
      const jadwalData = res.data?.data || [];

      const formatted = jadwalData.map((item) => ({
        id: item.id,
        hari: item.hari,
        mapel: item.mapel?.nama || "-",
        jam: `${item.jam_mulai} - ${item.jam_selesai}`,
        guru: item.guru?.name || "-",
      }));

      setJadwalList(formatted);
    } catch (err) {
      toast.error("Gagal memuat jadwal");
      setJadwalList([]);
    }
  };

  // ================================
  // IMPORT EXCEL JADWAL
  // ================================
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!guruList.length || !mapelList.length || !rombels.length) {
      toast.error("Data guru/mapel/rombel belum siap. Klik refresh dulu.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData.length) {
        toast.error("File Excel kosong!");
        return;
      }

      let sukses = 0;
      let gagal = 0;

      try {
        setProcessing(true);

        for (let row of jsonData) {
          const nipy = row.nipy ? String(row.nipy).replace(".0", "").trim() : "";
          const mapelInput = row.nama_mapel ? String(row.nama_mapel).trim().toLowerCase() : "";
          const kelas = row.kelas ? String(row.kelas).trim() : "";
          const rombelSub = row.rombel ? String(row.rombel).trim() : "";
          const hariRaw = row.hari ? String(row.hari).trim().toLowerCase() : "";
          const hari = hariRaw.length > 0 ? hariRaw.charAt(0).toUpperCase() + hariRaw.slice(1) : "";

          const jamMulai = convertExcelTimeToHHMM(row.jam_mulai);
          const jamSelesai = convertExcelTimeToHHMM(row.jam_selesai);

          // guru-list returns nipy directly as a field
          const guru = guruList.find((g) => {
            // Support both direct nipy field and NIPY embedded in name like "Ahmad (1234)"
            if (g.nipy && String(g.nipy).trim() === nipy) return true;
            const match = String(g.name ?? g.nama ?? "").match(/\((.*?)\)/);
            const nipyGuru = match ? match[1].trim() : "";
            return nipyGuru === nipy;
          });

          const mapel = mapelList.find((m) => {
            const kodeDB = String(m.kode || "").trim().toLowerCase();
            const namaDB = String(m.nama || "").trim().toLowerCase();
            return kodeDB === mapelInput || namaDB === mapelInput;
          });

          const rombel = rombels.find((r) => {
            const kelasDB = String(r.tingkat_kelas || r.kelas).trim();
            const subDB = String(r.sub_nama || r.sub_kelas).trim().toUpperCase();
            return kelasDB === kelas && subDB === rombelSub.toUpperCase();
          });

          if (!guru) {
            toast.error(`Guru tidak ditemukan (NIPY: ${nipy})`);
            gagal++;
            continue;
          }
          if (!mapel) {
            toast.error(`Mapel tidak ditemukan (Input: ${mapelInput})`);
            gagal++;
            continue;
          }
          if (!rombel) {
            toast.error(`Rombel tidak ditemukan (Kelas ${kelas} ${rombelSub})`);
            gagal++;
            continue;
          }
          if (!hari || !jamMulai || !jamSelesai) {
            toast.error("Hari / Jam Mulai / Jam Selesai wajib diisi!");
            gagal++;
            continue;
          }

          try {
            await api.post(`${API}/jadwal`, {
              guru_id: guru.id,
              mapel_id: mapel.id,
              rombel_id: rombel.id,
              hari: hari,
              jam_mulai: jamMulai,
              jam_selesai: jamSelesai,
              tahun_ajaran_id: tahunAktif?.id,
            });
            sukses++;
          } catch (err) {
            console.error(err);
            gagal++;
          }
        }

        toast.success(`Import selesai. Berhasil: ${sukses}, Gagal: ${gagal}`);
        if (selectedRombelId) {
          await handleSelectRombel({ id: selectedRombelId });
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal import jadwal dari Excel");
      } finally {
        setProcessing(false);
        e.target.value = ""; // reset file input
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // ================================
  // SUBMIT TAMBAH JADWAL MANUAL
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const jadwalPayload = {
        ...formData,
        rombel_id: selectedRombelId,
        mapel_id: Number(formData.mapel_id),
        guru_id: Number(formData.guru_id),
      };

      await api.post(`${API}/jadwal`, jadwalPayload);
      toast.success("Jadwal berhasil ditambahkan!");
      setIsModalOpen(false);

      setFormData({
        ...formData,
        guru_id: "",
        mapel_id: "",
        hari: "",
        jam_mulai: "",
        jam_selesai: "",
      });

      handleSelectRombel({ id: selectedRombelId });
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan jadwal");
    } finally {
      setProcessing(false);
    }
  };

  // ================================
  // DELETE JADWAL
  // ================================
  const handleDelete = async (jadwalId) => {
    if (!window.confirm("Hapus jadwal ini permanen?")) return;
    setDeletingId(jadwalId);

    try {
      const response = await api.delete(`${API}/jadwal/${jadwalId}`);
      if (response.data?.success) {
        setJadwalList((prev) => prev.filter((item) => item.id !== jadwalId));
        toast.success("Jadwal dihapus");
      }
    } catch (err) {
      toast.error("Gagal menghapus");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <SidebarAdminTu />
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <FaSyncAlt className="animate-spin text-4xl text-indigo-600 mb-4" />
          <p className="text-slate-500 font-medium tracking-wide animate-pulse">Memuat data jadwal...</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <SidebarAdminTu />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                <FaCalendarAlt size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Jadwal Pelajaran
                </h1>
                <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1.5 flex-wrap">
                  Tahun Ajaran Aktif:{" "}
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 font-bold text-indigo-600 text-xs">
                    {tahunAktif?.nama || "---"}
                  </span>
                  {jenjang && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 font-bold text-emerald-600 text-xs uppercase tracking-wider">
                      Unit {jenjang}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={fetchData}
              disabled={processing}
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 active:scale-95 transition shadow-sm self-end sm:self-auto"
            >
              <FaSyncAlt className={processing ? "animate-spin text-indigo-600" : ""} />
            </button>
          </div>

          {/* PILIH TINGKAT KELAS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-indigo-600 rounded-full"></span>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Pilih Tingkat Kelas {jenjang ? `(${jenjang})` : ""}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {kelasOptions.map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    setSelectedKelas(k);
                    setSelectedRombelId(null);
                    setJadwalList([]);
                  }}
                  className={`min-w-[100px] flex-1 py-3.5 px-4 rounded-xl font-bold transition-all border text-center ${
                    selectedKelas === k
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 scale-[1.02]"
                      : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100/70 hover:border-slate-200"
                  }`}
                >
                  Kelas {k}
                </button>
              ))}
            </div>
          </div>

          {/* PILIH ROMBEL */}
          {selectedKelas && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-4 bg-indigo-400 rounded-full"></span>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Rombel Tersedia (Kelas {selectedKelas})
                </h2>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {rombels
                  .filter((r) => Number(r.tingkat_kelas || r.kelas) === selectedKelas)
                  .map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectRombel(r)}
                      className={`px-6 py-2.5 rounded-xl font-bold transition-all border text-sm ${
                        selectedRombelId === r.id
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {r.tingkat_kelas} {r.sub_nama || r.sub_kelas}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}

          {/* MAIN JADWAL CONTAINER */}
          {selectedRombelId ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              
              {/* TOP ACTION BAR */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase px-2 py-0.5 bg-indigo-50 rounded">Rombel Terpilih</span>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight mt-1">
                    {selectedRombelName}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadTemplateJadwal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold hover:bg-emerald-100 transition"
                  >
                    <FaDownload size={13} /> Template Excel
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 cursor-pointer shadow-sm transition">
                    <FaUpload size={13} className="text-indigo-500" />
                    <span>Upload Excel</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-100 transition-all ml-auto lg:ml-0"
                  >
                    <FaPlus size={12} /> Tambah Manual
                  </button>
                </div>
              </div>

              {/* TABLE AREA */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4 w-32">Hari</th>
                      <th className="px-6 py-4">Mata Pelajaran</th>
                      <th className="px-6 py-4">Guru</th>
                      <th className="px-6 py-4 w-44">Jam Ke / Waktu</th>
                      <th className="px-6 py-4 text-center w-20">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {jadwalList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
                            {item.hari}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                            <FaBook size={12} className="text-indigo-400" /> {item.mapel}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5 text-slate-600 text-sm font-medium">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <FaChalkboardTeacher size={13} />
                            </div>
                            {item.guru}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md w-max">
                            <FaClock size={11} className="text-slate-400" />
                            {item.jam}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                          >
                            {deletingId === item.id ? (
                              <FaSyncAlt className="animate-spin text-rose-500" size={14} />
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* EMPTY STATE DATA */}
              {jadwalList.length === 0 && (
                <div className="py-16 text-center text-slate-400 bg-white">
                  <FaCalendarAlt size={40} className="mx-auto mb-3 text-slate-200" />
                  <p className="font-semibold text-sm">Jadwal belum dikonfigurasi</p>
                  <p className="text-xs text-slate-400 mt-1">Silakan tambah manual atau import via Excel</p>
                </div>
              )}
            </div>
          ) : (
            /* EMPTY STATE AWAL */
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-20 text-center shadow-sm">
              <FaDoorOpen size={48} className="mx-auto mb-3 text-slate-300" />
              <h2 className="text-base font-bold text-slate-400">
                Silakan Pilih Tingkat Kelas dan Rombel
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Pilih rombel terlebih dahulu untuk mulai mengelola jadwal pelajaran sekolah.
              </p>
            </div>
          )}
        </div>

        {/* MODAL INPUT MANUAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100">
              
              {/* MODAL HEADER */}
              <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaPlus size={14} />
                  <h3 className="font-bold tracking-tight">Tambah Jadwal Baru</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-indigo-700"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* MODAL FORM */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Guru Pengajar
                    </label>
                    <select
                      value={formData.guru_id}
                      onChange={(e) => setFormData({ ...formData, guru_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                      required
                    >
                      <option value="">Pilih Guru</option>
                      {guruList.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Mata Pelajaran
                    </label>
                    <select
                      value={formData.mapel_id}
                      onChange={(e) => setFormData({ ...formData, mapel_id: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                      required
                    >
                      <option value="">Pilih Mapel</option>
                      {mapelList.map((m) => (
                        <option key={m.id} value={m.id}>{m.nama} ({m.kode})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Hari Pelajaran
                  </label>
                  <select
                    value={formData.hari}
                    onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                    required
                  >
                    <option value="">Pilih Hari</option>
                    {hariList.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      value={formData.jam_mulai}
                      onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      value={formData.jam_selesai}
                      onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:bg-white outline-none font-medium transition"
                      required
                    />
                  </div>
                </div>

                {/* MODAL ACTIONS */}
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 text-sm text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-[2] py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 active:scale-95 transition"
                  >
                    {processing ? (
                      <FaSyncAlt className="animate-spin" size={12} />
                    ) : (
                      <FaPlus size={11} />
                    )}
                    <span>Simpan Jadwal</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}