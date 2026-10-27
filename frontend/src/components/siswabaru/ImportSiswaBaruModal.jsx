import React, { useState } from "react";
import {
  FaTimes,
  FaFileExcel,
  FaDownload,
  FaUpload,
  FaUserPlus,
  FaTrash,
  FaInfoCircle,
  FaCheck,
  FaSyncAlt,
  FaListUl,
  FaExclamationTriangle,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import api from "../../api";
import toast from "react-hot-toast";

export default function ImportSiswaBaruModal({
  isOpen,
  onClose,
  onSuccess,
  targetKelas = 1,
  jenjang,
}) {
  const [activeTab, setActiveTab] = useState("excel"); // 'excel' | 'manual'
  const [itemsToImport, setItemsToImport] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk form manual cepat
  const [manualNama, setManualNama] = useState("");
  const [manualKategori, setManualKategori] = useState("");
  const [manualNisn, setManualNisn] = useState("");

  // State untuk batch paste
  const [pasteText, setPasteText] = useState("");
  const [pasteKategori, setPasteKategori] = useState("");

  if (!isOpen) return null;

  // 1. Download Template Excel
  const handleDownloadTemplate = () => {
    try {
      const templateData = [
        {
          "No": 1,
          "Nama Lengkap": "Muhammad Fatih",
          "Kategori": "Ikhwan",
          "NISN": "0123456781",
          "No Registrasi PPDB": "PPDB-2026-001",
        },
        {
          "No": 2,
          "Nama Lengkap": "Aisyah Humaira",
          "Kategori": "Akhwat",
          "NISN": "0123456782",
          "No Registrasi PPDB": "PPDB-2026-002",
        },
        {
          "No": 3,
          "Nama Lengkap": "Ahmad Rayhan",
          "Kategori": "Ikhwan",
          "NISN": "0123456783",
          "No Registrasi PPDB": "PPDB-2026-003",
        },
        {
          "No": 4,
          "Nama Lengkap": "Fatimah Zahra",
          "Kategori": "Akhwat",
          "NISN": "0123456784",
          "No Registrasi PPDB": "PPDB-2026-004",
        },
      ];

      const petunjukData = [
        { "Kolom": "Nama Lengkap", "Keterangan": "Wajib diisi (nama calon siswa baru)" },
        { "Kolom": "Kategori", "Keterangan": "Ikhwan / Akhwat (boleh dikosongkan jika campuran/belum ditentukan)" },
        { "Kolom": "NISN", "Keterangan": "Opsional (10 digit angka jika ada)" },
        { "Kolom": "No Registrasi PPDB", "Keterangan": "Opsional (jika kosong akan dibuatkan kode otomatis)" },
        { "Catatan": "Catatan Pengujian", "Keterangan": "Data ini untuk pengujian awal pembagian rombel & registrasi NIS. Nantinya sistem akan tersinkron otomatis dengan API PPDB." }
      ];

      const ws = XLSX.utils.json_to_sheet(templateData);
      const wsPetunjuk = XLSX.utils.json_to_sheet(petunjukData);

      // Atur lebar kolom
      ws["!cols"] = [
        { wch: 6 },
        { wch: 30 },
        { wch: 15 },
        { wch: 18 },
        { wch: 22 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data Siswa Baru");
      XLSX.utils.book_append_sheet(wb, wsPetunjuk, "Petunjuk Pengisian");

      XLSX.writeFile(wb, "template_import_siswa_baru_pengujian.xlsx");
      toast.success("Template Excel berhasil diunduh");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat template Excel");
    }
  };

  // 2. Parse Excel File
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!rawJson.length) {
          toast.error("File Excel kosong atau tidak terbaca!");
          return;
        }

        const parsed = [];
        for (let row of rawJson) {
          // Cari nama lengkap di berbagai variasi header
          const nama =
            row["Nama Lengkap"] ||
            row["Nama Siswa"] ||
            row["nama_user"] ||
            row["nama"] ||
            row["Nama"] ||
            "";

          if (!String(nama).trim()) continue;

          // Cari kategori
          const rawKat =
            row["Kategori"] ||
            row["Jenis Kelamin"] ||
            row["Gender"] ||
            row["kategori"] ||
            "";
          const katLower = String(rawKat).toLowerCase().trim();
          let kategori = null;
          if (katLower.includes("ikhwan") || katLower === "l" || katLower === "laki-laki") {
            kategori = "ikhwan";
          } else if (katLower.includes("akhwat") || katLower === "p" || katLower === "perempuan") {
            kategori = "akhwat";
          }

          // Cari NISN
          const nisn = String(row["NISN"] || row["nisn"] || "").trim() || null;

          // Cari No Reg PPDB
          const ppdbId =
            String(
              row["No Registrasi PPDB"] ||
                row["No Registrasi"] ||
                row["ppdb_id"] ||
                row["no_reg"] ||
                ""
            ).trim() || null;

          parsed.push({
            id: Date.now() + Math.random(),
            nama_user: String(nama).trim(),
            kategori,
            nisn,
            ppdb_id: ppdbId,
          });
        }

        if (parsed.length === 0) {
          toast.error("Tidak ditemukan data siswa valid pada file Excel!");
          return;
        }

        setItemsToImport((prev) => [...prev, ...parsed]);
        toast.success(`Berhasil membaca ${parsed.length} data siswa dari Excel`);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memproses file Excel: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset file input agar bisa upload file yang sama jika diedit
    e.target.value = "";
  };

  // 3. Tambah Manual 1 Siswa
  const handleAddManual = (e) => {
    e.preventDefault();
    if (!manualNama.trim()) {
      return toast.error("Nama siswa wajib diisi!");
    }

    const newItem = {
      id: Date.now() + Math.random(),
      nama_user: manualNama.trim(),
      kategori: manualKategori || null,
      nisn: manualNisn.trim() || null,
      ppdb_id: null,
    };

    setItemsToImport((prev) => [newItem, ...prev]);
    setManualNama("");
    setManualNisn("");
    toast.success(`"${newItem.nama_user}" ditambahkan ke daftar`);
  };

  // 4. Batch Paste Text (1 nama per baris)
  const handleProcessPaste = () => {
    if (!pasteText.trim()) {
      return toast.error("Masukkan daftar nama siswa terlebih dahulu!");
    }

    const lines = pasteText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      return toast.error("Tidak ada baris teks yang valid.");
    }

    const parsed = lines.map((line) => {
      // Bersihkan nomor urut di awal misal "1. Muhammad" atau "1) Muhammad"
      const cleanName = line.replace(/^\d+[\.\)\-\s]+/, "").trim();
      return {
        id: Date.now() + Math.random(),
        nama_user: cleanName || line,
        kategori: pasteKategori || null,
        nisn: null,
        ppdb_id: null,
      };
    });

    setItemsToImport((prev) => [...prev, ...parsed]);
    setPasteText("");
    toast.success(`Berhasil menambahkan ${parsed.length} nama siswa`);
  };

  // 5. Hapus item dari preview list
  const handleRemoveItem = (id) => {
    setItemsToImport((prev) => prev.filter((item) => item.id !== id));
  };

  // 6. Kosongkan semua list preview
  const handleClearAll = () => {
    setItemsToImport([]);
    setFileName("");
  };

  // 7. Simpan / Kirim ke Backend
  const handleSubmit = async () => {
    if (itemsToImport.length === 0) {
      return toast.error("Daftar siswa masih kosong!");
    }

    setLoading(true);
    try {
      const payload = {
        siswa: itemsToImport.map((item) => ({
          nama_user: item.nama_user,
          kategori: item.kategori,
          nisn: item.nisn,
          ppdb_id: item.ppdb_id,
        })),
        kelas: targetKelas,
      };

      const res = await api.post("/api/tu/siswa-baru/import-sementara", payload);

      toast.success(res.data?.message || "Data siswa baru sementara berhasil disimpan!");
      handleClearAll();
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Gagal mengimpor data siswa baru sementara."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
              <FaUserPlus size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-800">
                  Import Data Siswa Baru
                </h3>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                  Pengujian Awal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tambahkan data siswa sementara untuk uji coba pembagian rombel & NIS kelas {targetKelas}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* NOTICE ALERT */}
        <div className="px-6 pt-4">
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-3">
            <FaInfoCircle className="text-amber-600 mt-0.5 shrink-0" size={16} />
            <div className="text-xs text-amber-900 leading-relaxed">
              <b>Catatan Sementara:</b> Fitur ini digunakan untuk mengisi data pendaftar baru sementara dalam rangka uji coba sistem. Ke depannya, data siswa baru akan ditarik secara otomatis dari sistem PPDB.
            </div>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TABS SELECTOR */}
          <div className="flex border-b border-slate-100 gap-2">
            <button
              onClick={() => setActiveTab("excel")}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "excel"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <FaFileExcel size={15} />
              <span>Import File Excel / CSV</span>
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "manual"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <FaListUl size={15} />
              <span>Input Manual / Salin Teks</span>
            </button>
          </div>

          {/* TAB 1: EXCEL UPLOAD */}
          {activeTab === "excel" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">
                    Gunakan Template Excel
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unduh format Excel resmi untuk pengisian data nama, kategori (Ikhwan/Akhwat), dan NISN.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <FaDownload className="text-emerald-600" size={13} />
                  <span>Unduh Template .xlsx</span>
                </button>
              </div>

              {/* DROPZONE / FILE INPUT */}
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="p-4 bg-white border border-slate-200 group-hover:border-emerald-200 text-slate-400 group-hover:text-emerald-600 rounded-2xl shadow-sm mb-3 transition">
                  <FaUpload size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {fileName ? (
                    <span className="text-emerald-700 font-semibold">{fileName}</span>
                  ) : (
                    "Klik untuk pilih file Excel / CSV atau seret ke sini"
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Mendukung format .xlsx, .xls, atau .csv
                </p>
              </label>
            </div>
          )}

          {/* TAB 2: MANUAL INPUT & BATCH PASTE */}
          {activeTab === "manual" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Input 1 Siswa */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <FaUserPlus className="text-emerald-600" /> Tambah Siswa Satu per Satu
                </h4>
                <form onSubmit={handleAddManual} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Nama Lengkap Siswa *
                    </label>
                    <input
                      type="text"
                      value={manualNama}
                      onChange={(e) => setManualNama(e.target.value)}
                      placeholder="Contoh: Ahmad Raihan"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Kategori
                      </label>
                      <select
                        value={manualKategori}
                        onChange={(e) => setManualKategori(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="">-- Bebas / Belum --</option>
                        <option value="ikhwan">Ikhwan (L)</option>
                        <option value="akhwat">Akhwat (P)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        NISN (Opsional)
                      </label>
                      <input
                        type="text"
                        value={manualNisn}
                        onChange={(e) => setManualNisn(e.target.value)}
                        placeholder="10 digit angka"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <FaCheck size={12} /> Tambah ke Daftar
                  </button>
                </form>
              </div>

              {/* Batch Paste */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <FaListUl className="text-emerald-600" /> Salin / Tempel Daftar Nama
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Kategori untuk Semua Nama Ini
                    </label>
                    <select
                      value={pasteKategori}
                      onChange={(e) => setPasteKategori(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">-- Tanpa Kategori Spesifik --</option>
                      <option value="ikhwan">Semua Ikhwan</option>
                      <option value="akhwat">Semua Akhwat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Daftar Nama (1 baris = 1 siswa)
                    </label>
                    <textarea
                      rows={4}
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      placeholder="Contoh:&#10;Muhammad Hafiz&#10;Zaid bin Tsabit&#10;Umar Al Faruq"
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleProcessPaste}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <FaCheck size={12} /> Masukkan Semua Nama
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PREVIEW TABLE OF ITEMS TO IMPORT */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Daftar Siswa yang Akan Diimpor
                </span>
                <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-0.5 rounded-full">
                  {itemsToImport.length} siswa
                </span>
              </div>
              {itemsToImport.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold transition"
                >
                  Kosongkan Daftar
                </button>
              )}
            </div>

            {itemsToImport.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Belum ada data siswa dalam daftar. Silakan unggah file Excel atau tambahkan nama secara manual di atas.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase font-black text-[10px] tracking-wider sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5 w-12 text-center">No</th>
                      <th className="px-4 py-2.5">Nama Siswa</th>
                      <th className="px-4 py-2.5">Kategori</th>
                      <th className="px-4 py-2.5">NISN</th>
                      <th className="px-4 py-2.5 text-right w-16">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {itemsToImport.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-2.5 text-center text-slate-400 font-medium">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-bold text-slate-700">
                          {item.nama_user}
                        </td>
                        <td className="px-4 py-2.5">
                          {item.kategori ? (
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                                item.kategori === "ikhwan"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {item.kategori}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">
                              Belum set
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 font-mono">
                          {item.nisn || "-"}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="Hapus dari daftar"
                          >
                            <FaTrash size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Total siswa siap diimpor:{" "}
            <b className="text-slate-800">{itemsToImport.length} orang</b>
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={itemsToImport.length === 0 || loading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSyncAlt className="animate-spin" size={13} />
                  <span>Mengimpor...</span>
                </>
              ) : (
                <>
                  <FaCheck size={13} />
                  <span>Simpan & Import ({itemsToImport.length})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
