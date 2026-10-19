import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
        {/* Kiri */}
        <div className="text-center md:text-left mb-3 md:mb-0">
          <h2 className="text-lg font-semibold text-blue-700">
            E-Raport & Keuangan SD Islam Terpadu
          </h2>
          <p className="text-sm text-gray-500">
            Sistem Informasi Akademik dan Keuangan Sekolah
          </p>
        </div>

        {/* Tengah */}
        <div className="flex space-x-6 text-gray-500 text-sm">
          <a href="#" className="hover:text-blue-600 transition">
            Panduan
          </a>
          <a href="#" className="hover:text-blue-600 transition">
            Kebijakan Privasi
          </a>
          <a href="#" className="hover:text-blue-600 transition">
            Kontak
          </a>
        </div>

        {/* Kanan */}
        <div className="text-sm text-gray-400 text-center md:text-right mt-3 md:mt-0">
          © {new Date().getFullYear()} Yayasan Pendidikan Islam <br />
          <span className="text-gray-500">
            Dibuat dengan 💙 oleh Tim TU Sekolah
          </span>
        </div>
      </div>
    </footer>
  );
}
