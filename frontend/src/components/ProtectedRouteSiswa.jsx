import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRouteSiswa() {
  const token = localStorage.getItem("siswa_token");
  const siswa = localStorage.getItem("siswa_data");

  if (!token || !siswa) {
    return <Navigate to="/login-siswa" replace />;
  }

  return <Outlet />;
}