import React, { useState } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import Footer from "../../components/footer";

export default function KeuanganTuSD() {
  const [transaksi, setTransaksi] = useState([
    {
      id: 1,
      nama: "Siti Rahma",
      kelas: "3A",
      jenis: "SPP Bulanan",
      tanggal: "2025-10-10",
      jumlah: 250000,
      status: "Lunas",
    },
    {
      id: 2,
      nama: "Budi Santoso",
      kelas: "4B",
      jenis: "Uang Kegiatan",
      tanggal: "2025-10-09",
      jumlah: 100000,
      status: "Belum Lunas",
    },
    {
      id: 3,
      nama: "Andi Pratama",
      kelas: "5A",
      jenis: "SPP Bulanan",
      tanggal: "2025-10-08",
      jumlah: 250000,
      status: "Lunas",
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100">
      {/* Wrapper utama flex kolom */}

      <div className="flex flex-1">
        {/* Sidebar */}
        <SidebarAdminTu />

        {/* Konten Utama */}
        <main className="flex-1 p-6 md:p-10">
          {/* Header Top */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-700">💰 Keuangan Sekolah</h1>
              <p className="text-gray-500 mt-1">
                Pantau semua transaksi keuangan dan status pembayaran siswa secara real-time
              </p>
            </div>
            <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-medium shadow">
              + Tambah Transaksi
            </button>
          </div>

          {/* Statistik Ringkas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-gray-600 font-medium">Total Pemasukan</h3>
              <p className="text-3xl font-bold text-green-700 mt-2">
                Rp{transaksi
                  .filter((t) => t.status === "Lunas")
                  .reduce((a, b) => a + b.jumlah, 0)
                  .toLocaleString("id-ID")}
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-gray-600 font-medium">Belum Lunas</h3>
              <p className="text-3xl font-bold text-red-700 mt-2">
                Rp{transaksi
                  .filter((t) => t.status === "Belum Lunas")
                  .reduce((a, b) => a + b.jumlah, 0)
                  .toLocaleString("id-ID")}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-gray-600 font-medium">Total Transaksi</h3>
              <p className="text-3xl font-bold text-blue-700 mt-2">
                {transaksi.length} Data
              </p>
            </div>
          </div>

          {/* Tabel Data */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-blue-600 text-white">
              <h2 className="text-lg font-semibold">📋 Riwayat Transaksi</h2>
              <input
                type="text"
                placeholder="Cari nama siswa..."
                className="px-3 py-2 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm md:text-base">
                <thead className="bg-gray-100 text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">Kelas</th>
                    <th className="px-4 py-3 text-left">Jenis</th>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                    <th className="px-4 py-3 text-left">Jumlah</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transaksi.map((t, index) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">{t.nama}</td>
                      <td className="px-4 py-3">{t.kelas}</td>
                      <td className="px-4 py-3">{t.jenis}</td>
                      <td className="px-4 py-3">{t.tanggal}</td>
                      <td className="px-4 py-3 font-semibold text-gray-700">
                        Rp{t.jumlah.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            t.status === "Lunas"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                        <button className="text-red-600 hover:underline">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Footer di luar konten, tapi masih dalam wrapper utama */}
      <Footer />
    </div>
  );
}
