import React, { useEffect, useState } from "react";
import SidebarSiswa from "../../components/SidebarSiswa";
import {
  User, BookOpen, Hash, GraduationCap, CalendarDays,
  Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── KOMPONEN DI LUAR (Agar fokus input tidak hilang saat mengetik) ──
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0">
    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
      <Icon size={18} className="text-orange-500" />
    </div>
    <div className="flex-1 flex items-center justify-between">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value || "—"}</p>
    </div>
  </div>
);

const PasswordField = ({ label, field, value, onChange, showKey, showPass, toggleShow }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPass[showKey] ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={`Masukkan ${label.toLowerCase()}`}
        className="w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all pr-12"
        required
      />
      <button
        type="button"
        onClick={() => toggleShow(showKey)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
      >
        {showPass[showKey] ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

// ── KOMPONEN UTAMA ──
export default function ProfilSiswa() {
  const token = localStorage.getItem("siswa_token");

  const [profil, setProfil]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("profil");

  const [form, setForm]         = useState({ password_lama: "", password_baru: "", konfirmasi: "" });
  const [showPass, setShowPass] = useState({ lama: false, baru: false, konfirmasi: false });
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);

  useEffect(() => { fetchProfil(); }, []);

  const fetchProfil = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/siswa/profil`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setProfil(data.data);
        localStorage.setItem("siswa_data", JSON.stringify(data.data));
      } else {
        console.log("Gagal load profil:", data);
      }
    } catch (e) {
      console.error("Gagal mengambil profil", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const toggleShowPass = (key) => {
    setShowPass(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGantiPassword = async (e) => {
    e.preventDefault();

    if (form.password_baru.length < 6) {
      setToast({ type: "error", message: "Password baru minimal 6 karakter." });
      return;
    }

    if (form.password_baru !== form.konfirmasi) {
      setToast({ type: "error", message: "Konfirmasi password tidak cocok." });
      return;
    }

    setSaving(true);
    setToast(null);

    try {
      const res = await fetch(`${API}/api/siswa/profil/ganti-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, // 🔥 PENTING
        },
        body: JSON.stringify({
          password_lama: form.password_lama,
          password_baru: form.password_baru,
          konfirmasi: form.konfirmasi,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToast({ type: "success", message: "Password berhasil diubah!" });

        setForm({
          password_lama: "",
          password_baru: "",
          konfirmasi: "",
        });
      } else {
        setToast({
          type: "error",
          message: data.message || "Gagal mengubah password.",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fffcf9]">
      <SidebarSiswa />
      <main className="flex-1 p-6 md:p-10 lg:p-12">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              Profil <span className="text-orange-500">Siswa</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manajemen data diri dan keamanan akun.</p>
          </div>

          {toast && (
            <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in fade-in zoom-in slide-in-from-top-10 duration-300 ${
              toast.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
            }`}>
              {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-bold text-sm">{toast.message}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
              <Loader2 size={40} className="animate-spin text-orange-400 mb-4" />
              <p className="font-bold animate-pulse">Menghubungkan ke server Akademik...</p>
            </div>
          ) : (
            <>
              {/* Info Card Siswa */}
              <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-orange-200 uppercase">
                  {profil?.nama?.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-black text-slate-800 leading-tight">{profil?.nama}</h2>
                  <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-xs">NIS: {profil?.nis}</p>
                  <div className="flex justify-center md:justify-start gap-3 mt-4">
                    <span className="px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-black rounded-full ring-2 ring-white uppercase">
                      {profil?.kelas || "Belum ada kelas"}
                    </span>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-black rounded-full ring-2 ring-white">
                      {profil?.tahun_ajaran || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* TABS Navigation */}
              <div className="flex p-1.5 bg-white rounded-2xl border border-orange-50 mb-8 shadow-sm">
                {[{ key: "profil", label: "Data Personal" }, { key: "password", label: "Keamanan Akun" }].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${
                      tab === t.key ? "bg-orange-500 text-white shadow-md shadow-orange-100" : "text-slate-400 hover:text-orange-500"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-8">
                {tab === "profil" ? (
                  <div className="divide-y divide-slate-50">
                    <InfoRow icon={User} label="Nama Lengkap" value={profil?.nama} />
                    <InfoRow icon={Hash} label="NIS Siswa" value={profil?.nis} />
                    <InfoRow icon={Hash} label="Nomor NISN" value={profil?.nisn} />
                    <InfoRow icon={GraduationCap} label="Kelas / Rombel" value={profil?.kelas} />
                    <InfoRow icon={CalendarDays} label="Tahun Ajaran" value={profil?.tahun_ajaran} />
                  </div>
                ) : (
                  <form onSubmit={handleGantiPassword}>
                    <PasswordField 
                      label="Password Lama" 
                      field="password_lama" 
                      value={form.password_lama}
                      onChange={handleInputChange}
                      showKey="lama" 
                      showPass={showPass}
                      toggleShow={toggleShowPass}
                    />
                    <div className="h-px bg-slate-100 my-6" />
                    <PasswordField 
                      label="Password Baru" 
                      field="password_baru" 
                      value={form.password_baru}
                      onChange={handleInputChange}
                      showKey="baru" 
                      showPass={showPass}
                      toggleShow={toggleShowPass}
                    />
                    <PasswordField 
                      label="Konfirmasi Baru" 
                      field="konfirmasi" 
                      value={form.konfirmasi}
                      onChange={handleInputChange}
                      showKey="konfirmasi" 
                      showPass={showPass}
                      toggleShow={toggleShowPass}
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                      SIMPAN PERUBAHAN
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}