import React, { useState } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import KartuDigitalSiswaATM from "../../components/KartuDigitalSiswaATM";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function KartuDigitalSubKelas() {
  const [kelas, setKelas] = useState("");
  const [subKelas, setSubKelas] = useState("");

  // Data dummy sementara
  const dataSiswa = [
    { id: 1, nama: "Ananda Putri", nis: "2024001", kelas: "1A" },
    { id: 2, nama: "Rizky Hidayat", nis: "2024002", kelas: "1A" },
    { id: 3, nama: "Siti Rahma", nis: "2024003", kelas: "1A" },
  ];

  const siswaFilter = dataSiswa.filter(
    (s) => s.kelas === `${kelas}${subKelas}`
  );

  const handleDownloadSubkelasPDF = async () => {
    const element = document.getElementById("grid-kartu-subkelas");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = pageWidth / canvas.width;
    const imgHeight = canvas.height * ratio;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`Kartu_SubKelas_${kelas}${subKelas}.pdf`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdminTu />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Kartu Digital Siswa per Sub Kelas
        </h1>

        {/* Pilih kelas & subkelas */}
        <div className="flex gap-4 mb-6">
          <select
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Pilih Kelas</option>
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
          </select>

          <select
            value={subKelas}
            onChange={(e) => setSubKelas(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">Sub Kelas</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

          <button
            onClick={handleDownloadSubkelasPDF}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            🖨️ Cetak Semua Kartu
          </button>
        </div>

        {/* Grid kartu */}
        <div
          id="grid-kartu-subkelas"
          className="grid grid-cols-2 gap-6 place-items-center"
        >
          {siswaFilter.length > 0 ? (
            siswaFilter.map((siswa) => (
            <KartuDigitalSiswaATM key={siswa.id} data={siswa} />
            ))
          ) : (
            <p className="text-gray-500 italic">Pilih kelas & subkelas terlebih dahulu</p>
          )}
        </div>
      </div>
    </div>
  );
}
