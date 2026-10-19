// src/components/KartuDigitalSiswaATM.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function KartuDigitalSiswaATM({ data }) {
  const navigate = useNavigate();
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [flipped, setFlipped] = useState(false);

  const siswa = data || {
    nama: "Ananda Putri Lestari",
    nis: "001234",
    kelas: "6A",
    foto: "https://randomuser.me/api/portraits/women/65.jpg",
    idKartu: "KD-2025-0001",
  };

  const tandaTanganBase64 =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='80'>
         <text x='0' y='50' font-family='Brush Script MT, cursive' font-size='36' fill='#0b8140'>Kepala Sekolah</text>
       </svg>`
    );

  const handleDownloadPDFTwoSided = async () => {
    try {
      if (!frontRef.current || !backRef.current) return;

      const frontCanvas = await html2canvas(frontRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const frontData = frontCanvas.toDataURL("image/png");

      const backCanvas = await html2canvas(backRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const backData = backCanvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85, 54],
      });

      pdf.addImage(frontData, "PNG", 0, 0, 85, 54);
      pdf.addPage([85, 54], "landscape");
      pdf.addImage(backData, "PNG", 0, 0, 85, 54);

      pdf.save(`Kartu_${siswa.nama.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Gagal membuat PDF. Cek console untuk detail.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 🔙 Tombol kembali */}
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50"
        >
          <span className="text-lg">←</span> Kembali
        </button>
      </div>

      {/* Toggle flip */}
      <div className="flex gap-2">
        <button
          onClick={() => setFlipped(false)}
          className={`px-4 py-2 rounded-lg ${!flipped ? "bg-green-600 text-white" : "bg-white border"}`}
        >
          Preview Depan
        </button>
        <button
          onClick={() => setFlipped(true)}
          className={`px-4 py-2 rounded-lg ${flipped ? "bg-green-600 text-white" : "bg-white border"}`}
        >
          Preview Belakang
        </button>
      </div>

      {/* Preview kartu */}
      <div className="relative" style={{ width: 420, height: 270 }}>
        {/* FRONT */}
        <div
          ref={frontRef}
          style={{ display: flipped ? "none" : "block" }}
          className="relative rounded-xl overflow-hidden shadow-2xl"
        >
          <div
            className="w-full h-full flex p-6"
            style={{
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #dff7e9 0%, #bfeed0 40%, #9be6b9 100%)",
              width: 420,
              height: 270,
              boxShadow: "0 12px 30px rgba(10, 70, 30, 0.12)",
            }}
          >
            <div className="flex-1 flex flex-col justify-between text-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    Kartu Siswa
                  </div>
                  <img
                    src="/logo192.png"
                    alt="logo"
                    className="w-10 h-10 rounded-full mt-2"
                  />
                </div>
                <div
                  className="w-20 h-8 rounded-md"
                  style={{ background: "rgba(255,255,255,0.25)" }}
                />
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={siswa.foto}
                  alt={siswa.nama}
                  className="w-28 h-28 rounded-full object-cover border-2 border-white shadow"
                />
                <div>
                  <div className="text-lg font-bold">{siswa.nama}</div>
                  <div className="text-sm">
                    NIS: <span className="font-medium">{siswa.nis}</span>
                  </div>
                  <div className="text-sm">
                    Kelas: <span className="font-medium">{siswa.kelas}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-800">
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      background: "#0b8140",
                      borderRadius: 2,
                    }}
                  />
                  <span className="opacity-90">SD Ulil Albab</span>
                </div>
                <div className="text-xs text-gray-700">
                  ID: {siswa.idKartu}
                </div>
              </div>
            </div>

            <div className="w-36 flex flex-col items-center justify-center">
              <div
                style={{
                  width: 56,
                  height: 40,
                  borderRadius: 6,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.45))",
                  boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.06)",
                }}
                className="mb-4"
              />
              <div className="text-sm text-white/90 bg-white/10 px-2 py-1 rounded-md">
                •••• •••• •••• •001
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          ref={backRef}
          style={{ display: flipped ? "block" : "none" }}
          className="relative rounded-xl overflow-hidden shadow-2xl"
        >
          <div
            className="w-full h-full flex flex-col p-6"
            style={{
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #e9f7ef 0%, #cfefe0 40%, #b0e7cc 100%)",
              width: 420,
              height: 270,
              boxShadow: "0 12px 30px rgba(10, 70, 30, 0.12)",
            }}
          >
            <div
              style={{ height: 40, background: "#0b8140" }}
              className="mb-4 rounded-sm"
            />

            <div className="flex flex-1 gap-6">
              <div className="flex-1">
                <div className="text-sm text-gray-800 font-semibold mb-2">
                  Petunjuk:
                </div>
                <div className="text-xs text-gray-700 leading-relaxed">
                  Tunjukkan kartu ini ke petugas kantin / perpustakaan. Pindai
                  QR untuk transaksi.
                </div>

                <div className="mt-6 p-3 bg-white/60 rounded-md inline-block">
                  <div className="text-xs text-gray-900 font-medium">
                    Nomor Kartu
                  </div>
                  <div className="text-sm font-semibold">{siswa.idKartu}</div>
                </div>
              </div>

              <div className="w-36 flex flex-col items-center">
                <div className="bg-white p-2 rounded-md mb-3">
                  <QRCode
                    value={`https://sekolah.example/siswa/${siswa.nis}`}
                    size={90}
                  />
                </div>

                <img
                  src={tandaTanganBase64}
                  alt="tandatangan"
                  style={{ width: 110 }}
                />
                <div className="text-xs text-gray-800 mt-1">
                  Kepala Sekolah
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-700">
              Kartu ini milik SD Ulil Albab — harap jaga dan jangan
              dipinjamkan.
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setFlipped((s) => !s)}
          className="px-4 py-2 rounded-lg bg-white border hover:bg-green-50"
        >
          Flip
        </button>

        <button
          onClick={handleDownloadPDFTwoSided}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Unduh PDF (2 sisi)
        </button>
      </div>
    </div>
  );
}
