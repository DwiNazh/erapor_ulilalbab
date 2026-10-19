import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import Footer from "../../components/footer";
import { motion } from "framer-motion";
import { FaSchool } from "react-icons/fa";

export default function DetailKelas() {
  const { kelasId } = useParams();
  const [subKelasDipilih, setSubKelasDipilih] = useState(null);

  // 🎨 Warna berbeda untuk tiap kelas
  const warnaKelas = {
    1: ["from-pink-400", "to-pink-600"],
    2: ["from-indigo-400", "to-indigo-600"],
    3: ["from-green-400", "to-green-600"],
    4: ["from-yellow-400", "to-yellow-600"],
    5: ["from-purple-400", "to-purple-600"],
    6: ["from-blue-400", "to-blue-600"],
  };

  // 🏫 Data subkelas per kelas
  const subKelas = {
    1: ["1A", "1B", "1C"],
    2: ["2A", "2B"],
    3: ["3A", "3B"],
    4: ["4A", "4B"],
    5: ["5A", "5B"],
    6: ["6A", "6B"],
  };

  // 👩‍🎓 Data siswa per subkelas
  const dataSiswaPerSubkelas = {
    "1A": [
      { nama: "Siti Aminah", nis: "001" },
      { nama: "Budi Santoso", nis: "002" },
    ],
    "1B": [
      { nama: "Rina Marlina", nis: "003" },
      { nama: "Adi Pratama", nis: "004" },
    ],
    "1C": [
      { nama: "Lina Kusuma", nis: "005" },
      { nama: "Dewi Rahma", nis: "006" },
    ],
    "2A": [
      { nama: "Gita Maharani", nis: "107" },
      { nama: "Indah Permata", nis: "108" },
    ],
    "2B": [
      { nama: "Rafi Pradana", nis: "109" },
      { nama: "Salsa Rahmi", nis: "110" },
    ],
    "3A": [
      { nama: "Rafi Ahmad", nis: "201" },
      { nama: "Lina Putri", nis: "202" },
    ],
    "3B": [
      { nama: "Andi Saputra", nis: "203" },
      { nama: "Dewi Lestari", nis: "204" },
    ],
    "4A": [
      { nama: "Bagus Hendra", nis: "301" },
      { nama: "Intan Sari", nis: "302" },
    ],
    "4B": [
      { nama: "Putri Amelia", nis: "303" },
      { nama: "Rendy Kurnia", nis: "304" },
    ],
    "5A": [
      { nama: "Anisa Rahma", nis: "401" },
      { nama: "Bayu Saputra", nis: "402" },
    ],
    "5B": [
      { nama: "Citra Dewi", nis: "403" },
      { nama: "Dimas Kurnia", nis: "404" },
    ],
    "6A": [
      { nama: "Fajar Pratama", nis: "501" },
      { nama: "Lulu Safitri", nis: "502" },
    ],
    "6B": [
      { nama: "Hana Fitria", nis: "503" },
      { nama: "Bambang Setiawan", nis: "504" },
    ],
  };

  const handleSubKelasClick = (sub) => {
    setSubKelasDipilih(sub === subKelasDipilih ? null : sub);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-100">
      <div className="flex flex-1">
        <SidebarAdminTu />
        <main className="flex-1 p-10">
          {/* Judul */}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
            Detail Siswa Kelas {kelasId}
          </h1>

          {/* Daftar Subkelas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {subKelas[kelasId]?.map((sub) => (
              <motion.div
                key={sub}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleSubKelasClick(sub)}
                className={`relative p-8 rounded-2xl border border-gray-200 shadow-lg bg-white/80 backdrop-blur-lg text-center cursor-pointer transition-all duration-300 ${
                  subKelasDipilih === sub
                    ? "ring-4 ring-indigo-400 shadow-2xl"
                    : "hover:shadow-xl hover:-translate-y-2"
                }`}
              >
                <div
                  className={`p-5 rounded-full mx-auto mb-5 bg-gradient-to-br ${
                    warnaKelas[kelasId][0]
                  } ${warnaKelas[kelasId][1]} w-20 h-20 flex items-center justify-center`}
                >
                  <FaSchool className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{sub}</h3>
                <p className="text-sm text-gray-500">
                  Klik untuk melihat daftar siswa
                </p>
              </motion.div>
            ))}
          </div>

          {/* Daftar siswa per subkelas */}
          {subKelasDipilih && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-3xl border border-gray-200 shadow-lg bg-white"
            >
              <div
                className={`p-5 bg-gradient-to-r ${
                  warnaKelas[kelasId][0]
                } ${warnaKelas[kelasId][1]} text-white font-semibold text-xl`}
              >
                Daftar Siswa Sub-Kelas {subKelasDipilih}
              </div>
              <table className="w-full border-collapse">
                <thead
                  className={`bg-gradient-to-r ${
                    warnaKelas[kelasId][0]
                  } ${warnaKelas[kelasId][1]} text-white`}
                >
                  <tr>
                    <th className="p-3 text-left w-16">No</th>
                    <th className="p-3 text-left">Nama</th>
                    <th className="p-3 text-left w-40">NIS</th>
                  </tr>
                </thead>
                <tbody>
                  {(dataSiswaPerSubkelas[subKelasDipilih] || []).map(
                    (s, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white even:bg-blue-50 hover:bg-blue-100 transition"
                      >
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium text-gray-800">
                          {s.nama}
                        </td>
                        <td className="p-3">{s.nis}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
