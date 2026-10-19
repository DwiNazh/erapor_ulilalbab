import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginSiswa() {
  const [form, setForm] = useState({ nis: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/siswa/login", form);
      localStorage.setItem("siswa_token", res.data.token);
      localStorage.setItem("siswa_data", JSON.stringify(res.data.siswa));
      navigate("/dashboard-siswa");
    } catch (e) {
      setError(e.response?.data?.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-200">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">Portal Siswa</h1>
          <p className="text-slate-500 text-sm mt-1">Masuk dengan NIS dan password kamu</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-orange-100 border border-orange-100 p-8">
          {error && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                NIS
              </label>
              <input
                type="text"
                placeholder="Masukkan NIS kamu"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                value={form.nis}
                onChange={e => setForm({ ...form, nis: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12 transition-all"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200 mt-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Masuk ke Portal"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Password default adalah NIS kamu. Lupa password? Hubungi wali kelas atau admin TU.
        </p>

        {/* Link ke login guru/TU */}
        <p className="text-center text-xs text-slate-400 mt-2">
          Bukan siswa?{" "}
          <a href="/login" className="text-orange-500 font-semibold hover:underline">
            Login sebagai Guru / Staff
          </a>
        </p>
      </div>
    </div>
  );
}