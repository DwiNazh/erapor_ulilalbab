import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import Footer from "../../components/footer";

export default function KelasTerbagi() {
  const { kelasId } = useParams();
  const { state } = useLocation();
  const siswaTerbagi = state?.siswaTerbagi || [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100">
      <div className="flex flex-1">
        {/* Sidebar */}
        <SidebarAdminTu />

        {/* Konten Utama */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Hasil Pembagian Sub-Kelas {kelasId?.replace("-", " ").toUpperCase()}
          </h1>

          <Link
            to={`/kelas-detail/${kelasId}`}
            className="inline-block mb-4 text-blue-600 hover:underline"
          >
            ← Kembali ke Pembagian
          </Link>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-green-500 text-white px-4 py-3 font-semibold">
              Siswa Sudah Dibagi
            </div>
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Sub Kelas</th>
                  <th className="p-3 text-left">NIS</th>
                </tr>
              </thead>
              <tbody>
                {siswaTerbagi.length > 0 ? (
                  siswaTerbagi.map((s, i) => (
                    <tr
                      key={s.nama}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{s.nama}</td>
                      <td className="p-3 text-green-600 font-medium">
                        {s.subKelas}
                      </td>
                      <td className="p-3">{s.nis || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500 italic"
                    >
                      Belum ada siswa yang dibagi ke subkelas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
