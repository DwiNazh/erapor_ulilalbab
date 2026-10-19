import React, { useEffect, useMemo, useState } from "react";
import SidebarSiswa from "../../components/SidebarSiswa";
import api from "../../api";
import toast from "react-hot-toast";
import {
  FaSyncAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

export default function AbsensiSiswa() {
  const [loading, setLoading] = useState(false);
  const [absensi, setAbsensi] = useState([]);
  const [filterSemester, setFilterSemester] = useState("all");

  const siswa = JSON.parse(localStorage.getItem("siswa_data") || "{}");

  const fetchAbsensi = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/siswa/absensi");
      if (res.data.success) {
        setAbsensi(res.data.data);
      } else {
        toast.error(res.data.message || "Gagal memuat absensi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengambil data absensi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, []);

  // ===============================
  // FILTER DATA PER SEMESTER
  // ===============================
  const filteredAbsensi = useMemo(() => {
    if (filterSemester === "all") return absensi;
    return absensi.filter((item) => item.semester === filterSemester);
  }, [absensi, filterSemester]);

  // ===============================
  // SUMMARY BERDASARKAN FILTER
  // ===============================
  const summary = useMemo(() => {
    let hadir = 0, sakit = 0, izin = 0, alfa = 0;

    filteredAbsensi.forEach((item) => {
      const status = item.status?.toLowerCase();
      if (status === "hadir") hadir++;
      if (status === "sakit") sakit++;
      if (status === "izin") izin++;
      if (status === "alfa") alfa++;
    });

    return { hadir, sakit, izin, alfa };
  }, [filteredAbsensi]);

  const badgeStatus = (status) => {
    const st = status?.toLowerCase();
    if (st === "hadir") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1 w-fit">
          <FaCheckCircle /> Hadir
        </span>
      );
    }
    if (st === "izin") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1 w-fit">
          <FaClock /> Izin
        </span>
      );
    }
    if (st === "sakit") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
          <FaClock /> Sakit
        </span>
      );
    }
    if (st === "alfa") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1 w-fit">
          <FaTimesCircle /> Alfa
        </span>
      );
    }
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">-</span>;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarSiswa />

      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FaCalendarAlt className="text-orange-500" /> Absensi Saya
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Data kehadiran siswa:{" "}
              <span className="font-semibold text-slate-700">
                {siswa?.nama || "Siswa"}
              </span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold shadow-sm focus:ring-2 focus:ring-orange-400 outline-none"
            >
              <option value="all">Semua Semester</option>
              <option value="semester1">Semester 1</option>
              <option value="semester2">Semester 2</option>
            </select>

            <button
              onClick={fetchAbsensi}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition disabled:opacity-60"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              {loading ? "Memuat..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase">Hadir</p>
            <h2 className="text-2xl font-bold text-green-600 mt-1">{summary.hadir}</h2>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase">Izin</p>
            <h2 className="text-2xl font-bold text-blue-600 mt-1">{summary.izin}</h2>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase">Sakit</p>
            <h2 className="text-2xl font-bold text-yellow-600 mt-1">{summary.sakit}</h2>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase">Alfa</p>
            <h2 className="text-2xl font-bold text-red-600 mt-1">{summary.alfa}</h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-700">Riwayat Absensi</h2>
            <p className="text-sm text-slate-400">
              Berikut adalah daftar absensi kamu{" "}
              {filterSemester === "all"
                ? "(Semua Semester)"
                : filterSemester === "semester1"
                ? "(Semester 1)"
                : "(Semester 2)"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Tanggal</th>
                  <th className="px-6 py-4 text-left">Tahun Ajaran</th>
                  <th className="px-6 py-4 text-left">Semester</th>
                  <th className="px-6 py-4 text-left">Wali Kelas / Guru</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
{filteredAbsensi.length === 0 ? (
  <tr>
    <td colSpan="6" className="text-center py-10 text-slate-400 font-medium">
      Tidak ada data absensi untuk filter ini.
    </td>
  </tr>
) : (
                  filteredAbsensi.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-orange-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-700">{item.tanggal || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{item.tahun_ajaran || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.semester === "semester1" ? "Semester 1" : "Semester 2"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.guru || "-"}</td>
                      <td className="px-6 py-4">{badgeStatus(item.status)}</td>
                      <td className="px-6 py-4 text-slate-600">{item.keterangan || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}