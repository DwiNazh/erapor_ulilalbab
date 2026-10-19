import React, { useEffect, useState } from "react";
import SidebarAdminTu from "../../components/SidebarAdminTu";
import Footer from "../../components/footer";
import api from "../../api";
import toast from "react-hot-toast";
import { 
  FaCog, 
  FaSyncAlt, 
  FaSave, 
  FaSchool, 
  FaInfoCircle, 
  FaGlobe, 
  FaMapMarkerAlt,
  FaPhoneAlt
} from "react-icons/fa";

export default function PengaturanPage() {
  const [settings, setSettings] = useState({
    nama_sekolah: "",
    npsn: "",
    alamat: "",
    telepon: "",
    website: "",
    email_sekolah: "",
  });

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ganti endpoint sesuai dengan API backend Anda
      const res = await api.get("/api/tu/pengaturan");
      if (res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan:", err);
      // Jika endpoint belum ada, kita tetap biarkan form kosong atau default
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await api.post("/api/tu/pengaturan/update", settings);
      toast.success("Konfigurasi sistem berhasil diperbarui");
    } catch (err) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setProcessing(false);
    }
  };

  // Modern Skeleton Loading (Identik dengan modul sebelumnya)
  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarAdminTu />
      <div className="flex-1 p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-10"></div>
        <div className="max-w-4xl space-y-6">
           <div className="h-64 bg-slate-200 rounded-3xl"></div>
           <div className="h-40 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <div className="flex flex-1 overflow-hidden">
        <SidebarAdminTu />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <FaCog className="text-indigo-600" /> Pengaturan Sistem
                </h1>
                <p className="text-slate-500 mt-1">Konfigurasi identitas dan parameter global unit sekolah.</p>
              </div>
              <button 
                onClick={fetchData}
                className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition shadow-sm"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* CARD 1: IDENTITAS SEKOLAH */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                   <FaSchool className="text-indigo-500" />
                   <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Identitas Sekolah</h3>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nama Instansi / Sekolah</label>
                    <input
                      type="text"
                      name="nama_sekolah"
                      value={settings.nama_sekolah}
                      onChange={handleChange}
                      placeholder="Masukkan nama resmi sekolah"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">NPSN</label>
                    <input
                      type="text"
                      name="npsn"
                      value={settings.npsn}
                      onChange={handleChange}
                      placeholder="Nomor Pokok Sekolah Nasional"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Telepon / Fax</label>
                    <div className="relative">
                       <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                       <input
                        type="text"
                        name="telepon"
                        value={settings.telepon}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Lengkap</label>
                    <div className="relative">
                       <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-300" size={14} />
                       <textarea
                        name="alamat"
                        value={settings.alamat}
                        onChange={handleChange}
                        rows="3"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: DIGITAL & KONTAK */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                   <FaGlobe className="text-emerald-500" />
                   <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Media Digital</h3>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Website Resmi</label>
                    <input
                      type="url"
                      name="website"
                      value={settings.website}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Admin/TU</label>
                    <input
                      type="email"
                      name="email_sekolah"
                      value={settings.email_sekolah}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-inner">
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm">
                      <FaInfoCircle size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-indigo-900">Perubahan Global</h4>
                      <p className="text-sm text-indigo-700/70 leading-relaxed">
                        Data ini akan muncul pada kop surat, laporan rapor, dan kartu digital siswa.
                      </p>
                   </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
                >
                  {processing ? <FaSyncAlt className="animate-spin" /> : <FaSave />}
                  Simpan Perubahan
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}