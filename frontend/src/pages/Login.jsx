import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGraduationCap, FaEye, FaEyeSlash, FaMosque } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [nipy, setNipy] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(nipy, password);
      const userRole = response.user?.role || response.role;

      if (!userRole) {
        setError("Role tidak terdeteksi. Hubungi administrator.");
        return;
      }

      // replace: true → hapus /login dari history, tidak bisa back ke sini
      if (userRole === "superadmin")
        navigate("/dashboardsuperadmin", { replace: true });
      else if (userRole === "admintu")
        navigate("/dashboardtusd", { replace: true });
      else if (userRole === "guru")
        navigate("/dashboardgurusd", { replace: true });
      else if (userRole === "kepala_sekolah")
        navigate("/dashboardkepsek", { replace: true });
      else navigate("/dashboardgurusd", { replace: true });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 422) {
        setError("NIPY atau password salah.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200">
              <FaMosque size={28} className="text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
              <FaGraduationCap size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Portal Pegawai</h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Akademik Yayasan Ulil Albab</p>
        </div>

        {/* Card Login */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-50 p-8">
          {error && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                NIPY
              </label>
              <input
                type="text"
                placeholder="Masukkan NIPY Anda"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={nipy}
                onChange={(e) => setNipy(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 mt-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Masuk ke Sistem"
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Lupa password? Silakan hubungi bagian IT Yayasan.
        </p>

        <p className="text-center text-xs text-slate-400 mt-3">
          Anda seorang siswa?{" "}
          <a href="/login-siswa" className="text-emerald-600 font-semibold hover:underline">
            Masuk ke Portal Siswa
          </a>
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          © 2026 Yayasan Ulil Albab
        </div>
      </div>
    </div>
  );
}