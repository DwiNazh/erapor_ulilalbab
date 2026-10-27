import React from "react";
import QRCode from "react-qr-code";
import logo from "../../src/assets/logo-sekolah.png";
import { getSubkelasLabel } from "../utils/rombel";

const KartuDigitalSiswaATM = ({ data }) => {
  if (!data) return null;

  const subLabel = data.sub_kelas || data.subKelas || getSubkelasLabel(data);

  return (
    <div
      className="relative box-border w-[400px] h-[230px]
                 overflow-hidden rounded-2xl p-5
                 bg-gradient-to-br from-green-500 via-green-600
                 to-green-800 text-white shadow-lg"
      style={{
        fontFamily: "Arial, sans-serif",
        printColorAdjust: "exact",
        WebkitPrintColorAdjust: "exact",
      }}
    >
      {/* Dekorasi latar */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-12 -top-16 h-56 w-56
                        rounded-full bg-white/10"
        />
        <div
          className="absolute -bottom-24 -left-12 h-48 w-48
                        rounded-full bg-black/10"
        />
      </div>

      {/* Konten utama */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header sekolah */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Sekolah"
            className="h-12 w-12 shrink-0 object-contain"
          />

          <div className="min-w-0">
            <p
              className="text-xs font-extrabold uppercase
                          tracking-wider leading-5"
            >
              Kartu Digital Siswa
            </p>
            <p className="text-[11px] leading-4 text-white/85">
              Yayasan Ulil Albab
            </p>
          </div>
        </div>

        {/* Identitas siswa dan QR Code */}
        <div className="mt-auto flex min-h-0 items-end gap-3">
          <div className="min-w-0 flex-1 pb-1">
            <h3
              className="break-words text-lg font-extrabold
                           leading-tight"
            >
              {data.nama || "-"}
            </h3>

            <p className="mt-2 text-sm font-medium">NIS: {data.nis || "-"}</p>

            <p className="mt-1 text-sm font-medium">
              Kelas {data.kelas || "-"}
              {subLabel ? ` - ${subLabel}` : ""}
            </p>
          </div>

          {/* QR Code */}
          <div
            className="flex h-[88px] w-[88px] shrink-0
                          items-center justify-center rounded-lg
                          bg-white p-2"
          >
            <QRCode
              value={`${data.nis || ""}-${data.nama || ""}`}
              size={72}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="M"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KartuDigitalSiswaATM;
