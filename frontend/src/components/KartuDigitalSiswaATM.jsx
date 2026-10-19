// src/components/KartuDigitalSiswaATM.jsx
import React from "react";
import QRCode from "react-qr-code";
import frontBg from "../../src/assets/4bc8010c-8046-41c5-808f-ced37b47073e.png";
import logo from "../../src/assets/logo-sekolah.png";

const KartuDigitalSiswaATM = ({ data }) => {
  if (!data) return null;

  return (
    <div
      className="w-80 h-48 p-4 rounded-xl shadow-lg relative text-white"
      style={{
        backgroundImage: `url(${frontBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo */}
      <img
        src={logo}
        alt="Logo Sekolah"
        className="w-12 h-12 absolute top-4 left-4"
      />

      {/* Nama Siswa */}
      <h3 className="text-xl font-bold mt-4 ml-4">{data.nama}</h3>

      {/* NIS */}
      <p className="ml-4">{data.nis}</p>

      {/* Kelas & Subkelas */}
      <p className="ml-4">
        Kelas {data.kelas} - {data.sub_kelas || data.subKelas || data.sub || "Reguler"}
      </p>

      {/* QR Code */}
      <div className="absolute bottom-4 right-4">
        <QRCode
          value={`${data.nis}-${data.nama}`}
          size={64}
          bgColor="transparent"
          fgColor="#000"
        />
      </div>
    </div>
  );
};

export default KartuDigitalSiswaATM;
