// ===================== Statistik.jsx =====================
import React, { useEffect, useState } from "react";
import SidebarSuperadmin from "../../components/SidebarSuperadmin";
import api from "../../api"; // ← pakai api.js bukan axios langsung
import { motion } from "framer-motion";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserShield,
  FaUserTie,
  FaSpinner,
} from "react-icons/fa";

export default function Statistik() {
  const [data, setData] = useState({
    totalGuru: 0,
    totalSiswa: 0,
    totalAdminTU: 0,
    totalKepalaSekolah: 0,
    totalSuperadmin: 0,
    totalUser: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/superadmin/statistik");
        // Backend return { success, data: {...} } → ambil res.data.data
        setData(res.data.data);
      } catch (err) {
        console.error("Gagal memuat data statistik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );

  const cards = [
    {
      label: "Total Guru",
      value: data.totalGuru,
      icon: <FaChalkboardTeacher className="text-5xl mb-4" />,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      label: "Total Siswa",
      value: data.totalSiswa,
      icon: <FaUsers className="text-5xl mb-4" />,
      gradient: "from-green-500 to-green-700",
    },
    {
      label: "Admin / TU",
      value: data.totalAdminTU,
      icon: <FaUserTie className="text-5xl mb-4" />,
      gradient: "from-orange-500 to-orange-700",
    },
    {
      label: "Kepala Sekolah",
      value: data.totalKepalaSekolah,
      icon: <FaUserShield className="text-5xl mb-4" />,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      label: "Superadmin",
      value: data.totalSuperadmin,
      icon: <FaUserShield className="text-5xl mb-4" />,
      gradient: "from-red-500 to-red-700",
    },
    {
      label: "Total Semua User",
      value: data.totalUser,
      icon: <FaUsers className="text-5xl mb-4" />,
      gradient: "from-slate-500 to-slate-700",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 80 },
    }),
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarSuperadmin />

      <main className="flex-1 p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Statistik Sistem
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Ringkasan data pengguna dalam sistem manajemen sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-br ${card.gradient} text-white rounded-2xl shadow-lg p-8 flex flex-col items-center`}
            >
              {card.icon}
              <h2 className="text-4xl font-bold">{card.value}</h2>
              <p className="text-xl mt-2 text-center">{card.label}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}