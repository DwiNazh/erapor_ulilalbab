import React, { useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const roleRedirect = {
  superadmin: "/dashboardsuperadmin",
  guru: "/dashboardgurusd",
  admintu: "/dashboardtusd",
  tu: "/dashboardtusd",
  admin: "/dashboardtusd",
  tatausaha: "/dashboardtusd",
  kepala_sekolah: "/dashboardkepsek",
  siswa: "/dashboard-siswa",
};

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  // Guard toast to fire only once per access‑denied event (not on every re‑render)
  const toastFired = useRef(false);

  // 1. Tunggu AuthContext selesai validasi token ke backend
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="ml-3 text-gray-500 text-sm">Memeriksa akses...</p>
      </div>
    );
  }

  // 2. Tidak ada user (token tidak ada / invalid / expired)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. User ada tapi role tidak diizinkan (Superadmin memiliki hak akses ke modul staf/guru/TU)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && user.role !== "superadmin") {
    // Hanya tampilkan toast sekali per mount, bukan setiap re-render
    if (!toastFired.current) {
      toastFired.current = true;
      toast.error(
        `Akses ditolak! Halaman ini hanya untuk: ${allowedRoles.join(" atau ")}.`,
        { id: "role-error", duration: 4000 }
      );
    }

    return <Navigate to={roleRedirect[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}