import React, { useState, useEffect, useMemo } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import api from "../../api";
import {
  ArrowRightLeft, UserCheck, GraduationCap, ChevronDown,
  Loader2, CheckCircle, XCircle, ClipboardList, Search
} from "lucide-react";

const TAB = { SISWA: "siswa", GURU: "guru", RIWAYAT: "riwayat" };

export default function PindahKelas() {
  const [tab, setTab] = useState(TAB.SISWA);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Data dropdown
  const [daftarSiswa, setDaftarSiswa] = useState([]);
  const [daftarGuru, setDaftarGuru] = useState([]);
  const [daftarRombel, setDaftarRombel] = useState([]);
  const [daftarMapel, setDaftarMapel] = useState([]);
  const [riwayat, setRiwayat] = useState([]);

  // State untuk pencarian
  const [searchSiswa, setSearchSiswa] = useState("");
  const [searchRiwayat, setSearchRiwayat] = useState("");

  // Form siswa
  const [formSiswa, setFormSiswa] = useState({
    siswa_id: "", tipe_mutasi: "pindah_rombel",
    rombel_tujuan_id: "", sekolah_tujuan: "",
    tanggal_mutasi: "", keterangan: ""
  });

  // Form guru (dikomentari di UI, tapi state dibiarkan)
  const [formGuru, setFormGuru] = useState({
    guru_id: "", tipe_mutasi: "pindah_rombel",
    rombel_asal_id: "", rombel_tujuan_id: "",
    mapel_id: "", sekolah_tujuan: "",
    tanggal_mutasi: "", keterangan: ""
  });

  useEffect(() => {
    fetchDropdowns();
    fetchRiwayat();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [siswaRes, guruRes, rombelRes, mapelRes] = await Promise.all([
        api.get("/api/tu/siswa-list"),
        api.get("/api/tu/guru-list"),
        api.get("/api/tu/rombel-aktif"),
        api.get("/api/tu/mata-pelajaran"),
      ]);

      console.log("Siswa response:", siswaRes.data);

      // Tangani jika response pakai pagination (data.data) atau langsung array (data)
      const siswaData = siswaRes.data?.data?.data  // pagination
                     ?? siswaRes.data?.data        // array biasa
                     ?? [];

      setDaftarSiswa(siswaData);
      setDaftarGuru(guruRes.data?.data || []);
      setDaftarRombel(rombelRes.data?.data || []);
      setDaftarMapel(mapelRes.data?.data || []);
    } catch (e) {
      console.error("Gagal load dropdown", e);
    }
  };

  const fetchRiwayat = async (jenis = "") => {
    try {
      const res = await api.get(`/api/tu/mutasi${jenis ? `?jenis=${jenis}` : ""}`);
      setRiwayat(res.data?.data || []);
    } catch (e) {}
  };

  const showFeedback = (type, msg) => {
    if (type === "success") { setSuccessMsg(msg); setErrorMsg(""); }
    else { setErrorMsg(msg); setSuccessMsg(""); }
    setTimeout(() => { setSuccessMsg(""); setErrorMsg(""); }, 4000);
  };

  const handleSubmitSiswa = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formSiswa,
        siswa_id: parseInt(formSiswa.siswa_id),
        rombel_tujuan_id: formSiswa.rombel_tujuan_id ? parseInt(formSiswa.rombel_tujuan_id) : null,
      };

      console.log("Payload dikirim:", payload);

      await api.post("/api/tu/mutasi/siswa", payload);
      showFeedback("success", "Mutasi siswa berhasil dicatat!");
      setFormSiswa({ siswa_id: "", tipe_mutasi: "pindah_rombel", rombel_tujuan_id: "", sekolah_tujuan: "", tanggal_mutasi: "", keterangan: "" });
      setSearchSiswa(""); // Reset pencarian siswa
      fetchRiwayat();
    } catch (e) {
      showFeedback("error", e.response?.data?.message || "Gagal memproses mutasi.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIKA FILTER PENCARIAN ---
  const filteredSiswa = useMemo(() => {
    if (!searchSiswa.trim()) return daftarSiswa;
    const kw = searchSiswa.toLowerCase();
    return daftarSiswa.filter(s => 
      s.nama?.toLowerCase().includes(kw) || 
      s.nis?.toLowerCase().includes(kw)
    );
  }, [daftarSiswa, searchSiswa]);

  const filteredRiwayat = useMemo(() => {
    if (!searchRiwayat.trim()) return riwayat;
    const kw = searchRiwayat.toLowerCase();
    return riwayat.filter(r => 
      r.nama_target?.toLowerCase().includes(kw) ||
      r.nama_rombel_asal?.toLowerCase().includes(kw) ||
      r.nama_rombel_tujuan?.toLowerCase().includes(kw) ||
      r.sekolah_tujuan?.toLowerCase().includes(kw) ||
      r.keterangan?.toLowerCase().includes(kw)
    );
  }, [riwayat, searchRiwayat]);

  const selectClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white";
  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const labelClass = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SidebarAdminTu />
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Mutasi <span className="text-indigo-600">Pindah Kelas</span>
            </h1>
            <p className="text-slate-500 mt-1">Kelola perpindahan siswa dan guru antar kelas atau sekolah.</p>
          </div>

          {/* Feedback */}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium">
              <XCircle size={16} /> {errorMsg}
            </div>
          )}

          {/* Tab */}
          <div className="flex gap-2 mb-6">
            {[
              { key: TAB.SISWA, label: "Mutasi Siswa", icon: <GraduationCap size={15} /> },
              { key: TAB.RIWAYAT, label: "Riwayat", icon: <ClipboardList size={15} /> },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.key ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200 hover:border-indigo-300"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Form Siswa */}
          {tab === TAB.SISWA && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-indigo-500" /> Form Mutasi Siswa
              </h2>
              <form onSubmit={handleSubmitSiswa} className="space-y-5">
                
                {/* Bagian Pilih Siswa dengan Pencarian */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className={labelClass}>Cari & Pilih Siswa</label>
                  
                  {/* Kotak Pencarian Siswa */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Ketik Nama atau NIS siswa..." 
                      className={`${inputClass} pl-10`}
                      value={searchSiswa}
                      onChange={(e) => setSearchSiswa(e.target.value)}
                    />
                  </div>

                  {/* Dropdown Siswa (Tampil berdasarkan hasil pencarian) */}
                  <select className={selectClass} value={formSiswa.siswa_id}
                    onChange={e => setFormSiswa({ ...formSiswa, siswa_id: e.target.value })} required>
                    <option value="">-- {filteredSiswa.length === 0 ? "Siswa tidak ditemukan" : "Pilih Siswa"} --</option>
                    {filteredSiswa.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nama} — {s.nis} ({s.rombel_sekarang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Tipe Mutasi</label>
                  <div className="flex gap-3">
                    {["pindah_rombel", "pindah_sekolah"].map(t => (
                      <label key={t} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all ${
                        formSiswa.tipe_mutasi === t ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500"
                      }`}>
                        <input type="radio" name="tipe_siswa" value={t} className="hidden"
                          checked={formSiswa.tipe_mutasi === t}
                          onChange={() => setFormSiswa({ ...formSiswa, tipe_mutasi: t })} />
                        {t === "pindah_rombel" ? "Pindah Rombel" : "Pindah Sekolah"}
                      </label>
                    ))}
                  </div>
                </div>

                {formSiswa.tipe_mutasi === "pindah_rombel" ? (
                  <div>
                    <label className={labelClass}>Rombel Tujuan</label>
                    <select className={selectClass} value={formSiswa.rombel_tujuan_id}
                      onChange={e => setFormSiswa({ ...formSiswa, rombel_tujuan_id: e.target.value })} required>
                      <option value="">-- Pilih Rombel --</option>
                      {daftarRombel.map(r => (
                        <option key={r.id} value={r.id}>Kelas {r.tingkat_kelas} {r.sub_nama}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className={labelClass}>Nama Sekolah Tujuan</label>
                    <input className={inputClass} placeholder="Contoh: SDN 02 Jakarta"
                      value={formSiswa.sekolah_tujuan}
                      onChange={e => setFormSiswa({ ...formSiswa, sekolah_tujuan: e.target.value })} required />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Tanggal Mutasi</label>
                    <input type="date" className={inputClass} value={formSiswa.tanggal_mutasi}
                      onChange={e => setFormSiswa({ ...formSiswa, tanggal_mutasi: e.target.value })} required />
                  </div>
                  <div>
                    <label className={labelClass}>Keterangan</label>
                    <input className={inputClass} placeholder="Opsional..."
                      value={formSiswa.keterangan}
                      onChange={e => setFormSiswa({ ...formSiswa, keterangan: e.target.value })} />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRightLeft size={18} />}
                  Proses Mutasi Siswa
                </button>
              </form>
            </div>
          )}

          {/* Riwayat */}
          {tab === TAB.RIWAYAT && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              
              {/* Header Riwayat + Kotak Pencarian */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="font-bold text-slate-700 flex items-center gap-2">
                  <ClipboardList size={18} className="text-indigo-500" /> Riwayat Mutasi
                </h2>
                
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Cari riwayat..." 
                    className={`${inputClass} pl-10 py-2 text-sm`}
                    value={searchRiwayat}
                    onChange={(e) => setSearchRiwayat(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                      <th className="px-4 py-3 text-left">Nama</th>
                      <th className="px-4 py-3 text-left">Jenis</th>
                      <th className="px-4 py-3 text-left">Tipe</th>
                      <th className="px-4 py-3 text-left">Dari</th>
                      <th className="px-4 py-3 text-left">Ke</th>
                      <th className="px-4 py-3 text-left">Tanggal</th>
                      <th className="px-4 py-3 text-left">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRiwayat.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                          {searchRiwayat ? "Data pencarian tidak ditemukan" : "Belum ada riwayat mutasi"}
                        </td>
                      </tr>
                    ) : filteredRiwayat.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-700">{r.nama_target}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            r.jenis === "siswa" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"
                          }`}>{r.jenis}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {r.tipe_mutasi === "pindah_rombel" ? "Pindah Rombel" : "Pindah Sekolah"}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{r.nama_rombel_asal || r.sekolah_tujuan || "-"}</td>
                        <td className="px-4 py-3 text-slate-500">{r.nama_rombel_tujuan || r.sekolah_tujuan || "-"}</td>
                        <td className="px-4 py-3 text-slate-500">{r.tanggal_mutasi}</td>
                        <td className="px-4 py-3 text-slate-400 italic">{r.keterangan || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}