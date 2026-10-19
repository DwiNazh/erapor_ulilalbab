import React, { useState, useEffect } from "react";
import SidebarSiswa from "../../components/SidebarSiswa";
import { FileText, Loader2, Calendar } from "lucide-react";

// Tambah helper ini di atas komponen NilaiKokurikuler
function parseDeskripsi(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function NilaiKokurikuler() {
  const siswa = JSON.parse(localStorage.getItem("siswa_data") || "{}");
  const token = localStorage.getItem("siswa_token");

  const [nilai, setNilai] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [semester, setSemester] = useState("1");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [loading, setLoading] = useState(false);
  const [pjblJudul, setPjblJudul] = useState(null); // State penyimpan judul PJBL siswa

  useEffect(() => {
    if (siswa?.id) {
      fetchNilai();
    }
  }, [semester, tahunAjaran]);

  const fetchNilai = async () => {
    setLoading(true);
    setNilai([]);

    try {
      const params = new URLSearchParams({ 
        semester: semester,
        tahun_ajaran: tahunAjaran 
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/siswa/nilai/kokurikuler?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      const dataFiltered = (data?.data || []).filter(
        (item) => String(item.semester) === String(semester)
      );

      setNilai(dataFiltered);
      
      // Tangkap payload judul PJBL kelas dari database backend
      setPjblJudul(data?.pjbl_judul || null);

      if (data?.tahun_list?.length > 0) {
        setTahunList(data.tahun_list);
        if (!tahunAjaran) setTahunAjaran(data.tahun_list[0]);
      }
    } catch (error) {
      console.error("Error fetching kokurikuler:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderGrade = (grade) => {
    if (!grade) return <span className="text-slate-300">-</span>;
    const colors = {
      A: "text-emerald-600 bg-emerald-50 border-emerald-100",
      B: "text-blue-600 bg-blue-50 border-blue-100",
      C: "text-amber-600 bg-amber-50 border-amber-100",
      D: "text-rose-600 bg-rose-50 border-rose-100",
    };
    return (
      <span className={`px-3 py-1 rounded-full border text-xs font-black ${colors[grade] || "bg-slate-50 text-slate-500"}`}>
        Grade {grade}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#fff8f3]">
      <SidebarSiswa />
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Nilai <span className="text-orange-500">Ko-Kurikuler</span>
            </h1>
            <p className="text-slate-500 mt-1 italic">Hasil observasi karakter dan proyek siswa.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-3xl border border-orange-100 shadow-sm">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Semester</label>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button 
                  onClick={() => setSemester("1")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${semester === "1" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500"}`}
                >
                  Semester 1 (Ganjil)
                </button>
                <button 
                  onClick={() => setSemester("2")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${semester === "2" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500"}`}
                >
                  Semester 2 (Genap)
                </button>
              </div>
            </div>

            <div className="w-full md:w-48">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Tahun Ajaran</label>
              <select 
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-orange-400 outline-none"
              >
                {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                  <Calendar size={20} />
                </div>
                <h2 className="font-black text-slate-700 tracking-tight">Laporan Semester {semester}</h2>
              </div>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full uppercase tracking-tighter">
                TA {tahunAjaran}
              </span>
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4">
                <Loader2 size={40} className="animate-spin text-orange-400" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Data Semester {semester}...</p>
              </div>
            ) : nilai.length === 0 ? (
              <div className="py-24 text-center">
                <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium italic">Tidak ada data untuk semester ini.</p>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {nilai.map((row, i) => {
                  const deskripsi = parseDeskripsi(row.deskripsi_aspek); // ← parse sekali di sini

                  return (
                    <React.Fragment key={i}>
                      {/* Mutabaah */}
                      <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-slate-700 text-sm">Mutabaah Yaumiyah</h3>
                          {renderGrade(row.mutabaah_yaumiyah)}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">
                          "{deskripsi[0] || 'Belum ada deskripsi'}"
                        </p>
                      </div>

                      {/* BPI */}
                      <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-slate-700 text-sm">Bina Pribadi Islam</h3>
                          {renderGrade(row.bina_pribadi_islam)}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">
                          "{deskripsi[1] || 'Belum ada deskripsi'}"
                        </p>
                      </div>

                      {/* Literasi */}
                      <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-slate-700 text-sm">Literasi</h3>
                          {renderGrade(row.literasi)}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">
                          "{deskripsi[2] || 'Belum ada deskripsi'}"
                        </p>
                      </div>

                      {/* PJBL */}
                      <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-slate-700 text-sm">
                            PJBL{" "}
                            {pjblJudul && (
                              <span className="text-indigo-600 block sm:inline sm:ml-1 text-xs font-medium">
                                ({pjblJudul})
                              </span>
                            )}
                          </h3>
                          {renderGrade(row.pjbl)}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">
                          "{deskripsi[3] || 'Belum ada deskripsi'}"
                        </p>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}