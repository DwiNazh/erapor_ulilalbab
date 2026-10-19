import React from "react";
import { Link } from "react-router-dom";
import SidebarAdminTu from "../../../components/SidebarAdminTu";
import {
  FaQuran,
  FaUsers,
  FaCheckCircle,
  FaChevronRight,
} from "react-icons/fa";

export default function ManajemenKelompokQuran() {
  const menu = [
    {
      title: "Penempatan Kelompok Quran",
      desc: "Atur kelompok, guru pembimbing, dan anggota siswa.",
      icon: <FaUsers />,
      color: "from-indigo-500 to-blue-500",
      link: "/dashboardtusd/kelompok-quran/penempatan",
      button: "Kelola Penempatan",
    },
    {
      title: "Finalisasi Kelompok Quran",
      desc: "Finalisasi dan aktifkan kelompok quran semester berjalan.",
      icon: <FaCheckCircle />,
      color: "from-emerald-500 to-teal-500",
      link: "/dashboardtusd/kelompok-quran/finalisasi",
      button: "Buka Finalisasi",
    },
  ];

  return (
    <div className="flex bg-slate-100 min-h-screen size-full">
      {/* Sidebar tetap di sisi kiri */}
      <SidebarAdminTu />
        
      {/* PENTING: Pembungkus Konten Utama agar layout tidak rusak */}
      <div className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0">
              <FaQuran />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black">
                Manajemen Kelompok Quran
              </h1>
              <p className="text-indigo-100 mt-2 text-sm md:text-base">
                Kelola penempatan kelompok quran, anggota siswa,
                dan finalisasi kelompok aktif.
              </p>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {menu.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`h-2 bg-gradient-to-r ${item.color}`} />

                <div className="p-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {item.icon}
                  </div>

                  <h2 className="mt-5 text-xl font-black text-slate-800">
                    {item.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Tombol diletakkan di bawah p-6 agar selalu presisi */}
              <div className="px-6 pb-6 pt-0">
                <Link
                  to={item.link}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${item.color} hover:opacity-90 transition-opacity w-full sm:w-auto justify-center sm:justify-start`}
                >
                  {item.button}
                  <FaChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}