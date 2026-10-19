import React, { useEffect, useState } from "react";
import SidebarSiswa from "../../components/SidebarSiswa";
import { Calendar, Loader2, Printer } from "lucide-react";

export default function JadwalPelajaranSiswa() {
  // Ambil token di dalam komponen untuk memastikan data terbaru
  const token = localStorage.getItem("siswa_token");

  const [jadwal, setJadwal] = useState([]);
  const [jadwalSemua, setJadwalSemua] = useState([]); // ✅ FIX: state ini sebelumnya tidak dideklarasikan
  const [hari, setHari] = useState("Senin");
  const [loading, setLoading] = useState(false);

  const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // Jika token tidak ada, arahkan ke login atau tampilkan pesan
  useEffect(() => {
    if (!token) {
      console.error("Token tidak ditemukan!");
      return;
    }
    fetchJadwal();
  }, [hari]);

  const fetchJadwal = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      // Pastikan endpoint ini sesuai dengan yang ada di routes/api.php
      const response = await fetch(`${baseUrl}/api/siswa/jadwal?hari=${hari}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Sesi telah habis, silakan login kembali.");
      }

      const data = await response.json();
      setJadwal(data?.data || []);
    } catch (error) {
      console.error("Error fetch jadwal:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Tambahkan fetch untuk mengambil semua hari sekaligus untuk kebutuhan print
  const fetchJadwalSemua = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      // Loop atau buat endpoint baru di backend yang mengembalikan semua hari
      // Di sini kita berasumsi backend index tanpa filter 'hari' mengembalikan semua data
      const response = await fetch(`${baseUrl}/api/siswa/jadwal`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      setJadwalSemua(data?.data || []);
    } catch (e) {
      console.error("Gagal load data cetak", e);
    }
  };

  useEffect(() => {
    fetchJadwalSemua();
  }, []);

  // ===============================
  // CETAK SEMUA JADWAL
  // ===============================
  const handlePrint = () => {
    const groupedJadwal = hariList.reduce((acc, h) => {
      acc[h] = jadwalSemua.filter((j) => j.hari === h);
      return acc;
    }, {});

    const printWindow = window.open("", "", "width=900,height=650");

    const htmlContent = `
      <html>
        <head>
          <title>Cetak Jadwal Pelajaran</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            h1 {
              text-align: center;
              margin-bottom: 5px;
            }
            p {
              text-align: center;
              margin-top: 0;
              color: #666;
            }
            h2 {
              margin-top: 30px;
              padding: 10px;
              background: #f97316;
              color: white;
              border-radius: 8px;
              font-size: 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              font-size: 14px;
            }
            th {
              background: #fff7ed;
              color: #444;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 1px;
            }
            tr:nth-child(even) {
              background: #f9f9f9;
            }
            .empty {
              text-align: center;
              padding: 15px;
              color: #999;
              font-style: italic;
            }
            .footer {
              margin-top: 40px;
              font-size: 12px;
              text-align: right;
              color: #666;
            }
          </style>
        </head>
        <body>
          <h1>Jadwal Pelajaran</h1>
          <p>Semua Hari (Senin - Sabtu)</p>

          ${hariList
            .map((h) => {
              const dataHari = groupedJadwal[h] || [];

              return `
                <h2>${h}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Jam</th>
                      <th>Mata Pelajaran</th>
                      <th>Guru</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      dataHari.length === 0
                        ? `<tr><td colspan="3" class="empty">Jadwal belum tersedia</td></tr>`
                        : dataHari
                            .map(
                              (row) => `
                                <tr>
                                  <td>${row.jam_mulai} - ${row.jam_selesai}</td>
                                  <td>${row.nama_mapel}</td>
                                  <td>${row.nama_guru || "-"}</td>
                                </tr>
                              `
                            )
                            .join("")
                    }
                  </tbody>
                </table>
              `;
            })
            .join("")}

          <div class="footer">
            Dicetak pada: ${new Date().toLocaleString("id-ID")}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="flex min-h-screen bg-[#fff8f3]">
      <SidebarSiswa />

      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Jadwal <span className="text-orange-500">Pelajaran</span>
            </h1>
            <p className="text-slate-500 mt-1">
              Lihat jadwal pelajaran kamu berdasarkan hari.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
            <select
              value={hari}
              onChange={(e) => setHari(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {hariList.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            {/* BUTTON CETAK */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition"
            >
              <Printer size={18} />
              Cetak Semua Jadwal
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Calendar size={18} className="text-orange-500" />
              <h2 className="font-bold text-slate-700">Hari {hari}</h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-orange-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-orange-50 text-slate-500 text-xs uppercase">
                      <th className="px-4 py-3 text-left">Jam</th>
                      <th className="px-4 py-3 text-left">Mata Pelajaran</th>
                      <th className="px-4 py-3 text-left">Guru</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {jadwal.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-12 text-slate-400 italic"
                        >
                          Jadwal belum tersedia untuk hari ini.
                        </td>
                      </tr>
                    ) : (
                      jadwal.map((row, i) => (
                        <tr
                          key={i}
                          className="hover:bg-orange-50/30 transition-colors"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-700">
                            {row.jam_mulai} - {row.jam_selesai}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800">
                            {row.nama_mapel}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {row.nama_guru || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-4 text-xs text-slate-500">
            Jadwal ditampilkan sesuai hari yang dipilih.
          </div>
        </div>
      </main>
    </div>
  );
}