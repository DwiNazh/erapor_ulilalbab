import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedRouteSiswa from "./components/ProtectedRouteSiswa";
import { Toaster } from "react-hot-toast";

// ====================== UMUM ======================
import Login from "./pages/Login";
import HomeERapor from "./pages/Home";

// ====================== SUPERADMIN ======================
import DashboardSuperadmin from "./pages/superadmin/dashboardsuperadmin";
import ManajemenAkun from "./pages/superadmin/manajemenakun";
import Statistik from "./pages/superadmin/statistik";
import PengaturanSuperadmin from "./pages/superadmin/PengaturanSuperadmin";

// ====================== GURU ======================
import DashboardGuruSD from "./pages/guru/DashboardGuruSD";
import MataPelajaranSaya from "./pages/guru/MataPelajaranSaya";
import WaliKelasSaya from "./pages/guru/DaftarSiswaRombel";
import TemplateDeskripsi from "./pages/guru/TemplateDeskripsi";
import RaporKelas from "./pages/guru/RaporKelas.jsx";
import KelompokQuranGuru from "./pages/guru/KelompokQuranGuru";
import AbsensiMataPelajaran from "./pages/guru/absensi/AbsensiSaya.jsx";
import AbsensiHarian from "./pages/guru/absensi/Absensiharian.jsx";
import RekapAbsensi from "./pages/guru/rekapabsensi/RekapAbsensi";
import RekapAbsensiHarian from "./pages/guru/rekapabsensi/RekapAbsensiHarian.jsx";
import NilaiAkademik from "./pages/guru/nilai/NilaiAkademik.jsx";
import NilaiDetailPerMapel from "./pages/guru/nilai/NilaiDetailPermapel";
import PenilaianKoKurikuler from "./pages/guru/kokurikuler/PenilaianKoKurikuler.jsx";
import EkstrakurikulerGuru from "./pages/guru/ekstrakurikuler/EkstrakurikulerGuruSD.jsx";
import PenilaianQuranGuru from "./pages/guru/nilai/PenilaianQuranGuru";
import KalenderKelas from "./pages/guru/kalenderkelas";
import JadwalSaya from "./pages/guru/JadwalSaya";
import ProfilGuru from "./pages/guru/ProfilGuru";

// ====================== ADMIN TU ======================
import DashboardAdminSD from "./pages/admintu/dashboardtusd";
import TahunAjaran from "./pages/admintu/TahunAjaran";
import SiswaBaru from "./pages/admintu/siswabaru";
import ManajemenRombel from "./pages/admintu/ManajemenRombel";
import DataSiswa from "./pages/admintu/datasiswa";
import DetailKelas from "./pages/admintu/DetailKelas";
import DetailSiswa from "./pages/admintu/DetailSiswa";
import JadwalSekolah from "./pages/admintu/jadwalsekolah";
import KeuanganTuSD from "./pages/admintu/keuangantusd";
import KartuDigitalSubKelas from "./pages/admintu/KartuDigitalSubKelas";
import PenugasanGuru from "./pages/admintu/PenugasanGuru";
import PromosiSiswa from "./pages/admintu/PromosiSiswa";
import PenetapanWaliKelas from "./pages/admintu/PenetapanWaliKelas";
import PenetapanSiswa from "./pages/admintu/PenetapanSiswa";
import PembagianRombel from "./pages/admintu/PembagianRombel";
import FinalisasiTotal from "./pages/admintu/FinalisasiTotal";
import DataGuru from "./pages/admintu/DataGuru";
import PindahKelas from "./pages/admintu/PindahKelas";
import RekapRaporSiswa from "./pages/admintu/RekapRaporSiswa.jsx";
import ProfilAdmin from "./pages/admintu/ProfilAdmin";
import Pengaturan from "./pages/admintu/Pengaturan.jsx";
import DetailRaporSiswaTU from "./pages/admintu/DetailRaporSiswaTU";
import EkskulTU from "./pages/admintu/EkskulTU.jsx";
import Pjbljudulpage from "./pages/admintu/Pjbljudulpage.jsx";
import Matapelajaran from "./pages/admintu/Matapelajaran";

// ====================== QURAN ======================
import ManajemenKelompokQuran from "./pages/admintu/quran/ManajemenKelompokQuran";
import KelompokQuranPenempatan from "./pages/admintu/quran/KelompokQuranPenempatan";
import KelompokQuranFinalisasi from "./pages/admintu/quran/KelompokQuranFinalisasi";

// ====================== SISWA ======================
import LoginSiswa from "./pages/siswa/LoginSiswa";
import DashboardSiswa from "./pages/siswa/DashboardSiswa";
import NilaiSiswa from "./pages/siswa/NilaiSiswa";
import NilaiKokurikuler from "./pages/siswa/NilaiKokurikuler";
import NilaiEkstrakurikuler from "./pages/siswa/NilaiEkstrakurikuler";
import JadwalPelajaranSiswa from "./pages/siswa/JadwalPelajaranSiswa";
import ProfilSiswa from "./pages/siswa/Profilsiswa.jsx";
import RaporSiswa from "./pages/siswa/RaporSiswa.jsx";
import AbsensiSiswa from "./pages/siswa/AbsensiSiswa";

// ====================== KEPALA SEKOLAH ======================
import DashboardKepsek from "./pages/kepalasekolah/DashboardKepsek";
import ProfilKepsek from "./pages/kepalasekolah/ProfilKepsek.jsx";
import MonitoringGuru from "./pages/kepalasekolah/MonitoringGuru.jsx";
import ApprovalRaporKepsek from "./pages/kepalasekolah/ApprovalRaporKepsek.jsx";

// ====================== PLACEHOLDER ======================
const Placeholder = ({ title }) => (
  <div className="flex h-screen items-center justify-center bg-slate-50">
    <div className="text-center">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <p className="text-slate-500">Halaman ini sedang dalam tahap pengembangan.</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />

      <Routes>
        {/* ====================== DEFAULT ====================== */}
        <Route path="/" element={<HomeERapor />} />

        {/* ====================== LOGIN (PUBLIC) ====================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-siswa" element={<LoginSiswa />} />

        {/* ====================== SUPERADMIN ====================== */}
        <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
          <Route path="/dashboardsuperadmin" element={<DashboardSuperadmin />} />
          <Route path="/superadmin/manajemenakun" element={<ManajemenAkun />} />
          <Route path="/superadmin/statistik" element={<Statistik />} />
          <Route path="/superadmin/pengaturan" element={<PengaturanSuperadmin />} />
        </Route>

        {/* ====================== SISWA ====================== */}
        <Route element={<ProtectedRouteSiswa />}>
          <Route path="/dashboard-siswa" element={<DashboardSiswa />} />
          <Route path="/dashboard-siswa/nilai" element={<NilaiSiswa />} />
          <Route path="/dashboard-siswa/nilai/kokurikuler" element={<NilaiKokurikuler />} />
          <Route path="/dashboard-siswa/nilai/ekstrakurikuler" element={<NilaiEkstrakurikuler />} />
          <Route path="/dashboard-siswa/jadwal" element={<JadwalPelajaranSiswa />} />
          <Route path="/dashboard-siswa/profil" element={<ProfilSiswa />} />
          <Route path="/dashboard-siswa/rapor" element={<RaporSiswa />} />
          <Route path="/dashboard-siswa/absensi" element={<AbsensiSiswa />} />
        </Route>

        {/* ====================== GURU ====================== */}
        <Route element={<ProtectedRoute allowedRoles={["guru"]} />}>
          <Route path="/dashboardgurusd" element={<DashboardGuruSD />} />
          <Route path="/dashboardgurusd/penugasan-saya" element={<MataPelajaranSaya />} />
          <Route path="/dashboardgurusd/wali-kelas" element={<WaliKelasSaya />} />

          {/* Absensi (Harian — pengganti absensi per mata pelajaran) */}
          <Route path="/dashboardgurusd/absensi" element={<AbsensiMataPelajaran />} />
          <Route path="/dashboardgurusd/absensi/harian/:rombelId" element={<AbsensiHarian />} />

          {/* Rekap Absensi */}
          <Route path="/dashboardgurusd/rekap-absensi" element={<RekapAbsensi />} />
          <Route path="/dashboardgurusd/rekap-absensi/harian/:rombelId" element={<RekapAbsensiHarian />} />

          {/* Nilai */}
          <Route path="/dashboardgurusd/nilai" element={<NilaiAkademik />} />
          <Route path="/dashboardgurusd/nilai/mapel/:id" element={<NilaiDetailPerMapel />} />
          <Route path="/dashboardgurusd/penilaian-kokurikuler" element={<PenilaianKoKurikuler />} />
          <Route path="/dashboardgurusd/ekstrakurikuler" element={<EkstrakurikulerGuru />} />
          <Route path="/dashboardgurusd/penilaian-quran" element={<PenilaianQuranGuru />} />
          <Route path="/dashboardgurusd/KelompokQuranGuru" element={<KelompokQuranGuru />} />

          {/* Rapor & Lainnya */}
          <Route path="/dashboardgurusd/rapor" element={<RaporKelas />} />
          <Route path="/dashboardgurusd/template-deskripsi" element={<TemplateDeskripsi />} />
          <Route path="/dashboardgurusd/profil" element={<ProfilGuru />} />
          <Route path="/dashboardgurusd/kalenderkelas" element={<KalenderKelas />} />
          <Route path="/dashboardgurusd/jadwal-saya" element={<JadwalSaya />} />
        </Route>

        {/* ====================== KEPALA SEKOLAH ====================== */}
        <Route element={<ProtectedRoute allowedRoles={["kepala_sekolah"]} />}>
          <Route path="/dashboardkepsek" element={<DashboardKepsek />} />
          <Route path="/dashboardkepsek/profil" element={<ProfilKepsek />} />
          <Route path="/dashboardkepsek/guru" element={<MonitoringGuru />} />
          <Route path="/dashboardkepsek/approval-rapor" element={<ApprovalRaporKepsek />} />
        </Route>

        {/* ====================== ADMIN TU ====================== */}
        <Route element={<ProtectedRoute allowedRoles={["admintu"]} />}>
          <Route path="/dashboardtu" element={<DashboardAdminSD />} />
          <Route path="/dashboardtusd" element={<DashboardAdminSD />} />

          {/* Academic */}
          <Route path="/dashboardtusd/tahunajaran" element={<TahunAjaran />} />
          <Route path="/dashboardtusd/datasiswa" element={<DataSiswa />} />
          <Route path="/dashboardtusd/datasiswa/:kelasId" element={<DetailKelas />} />
          <Route path="/dashboardtusd/detail-siswa/:nis" element={<DetailSiswa />} />

          {/* Guru */}
          <Route path="/dashboardtusd/guru" element={<DataGuru />} />

          {/* PPDB */}
          <Route path="/dashboardtusd/manajemen-rombel" element={<ManajemenRombel />} />
          <Route path="/dashboardtusd/siswabaru" element={<SiswaBaru />} />

          {/* Jadwal */}
          <Route path="/dashboardtusd/jadwalsekolah" element={<JadwalSekolah />} />

          {/* Kurikulum */}
          <Route path="/dashboardtusd/Matapelajaran" element={<Matapelajaran />} />
          <Route path="/dashboardtusd/EkskulTU" element={<EkskulTU />} />
          <Route path="/dashboardtusd/Pjbljudulpage" element={<Pjbljudulpage />} />

          {/* Quran */}
          <Route path="/dashboardtusd/manajemen-kelompok-quran" element={<ManajemenKelompokQuran />} />
          <Route path="/dashboardtusd/kelompok-quran/penempatan" element={<KelompokQuranPenempatan />} />
          <Route path="/dashboardtusd/kelompok-quran/finalisasi" element={<KelompokQuranFinalisasi />} />

          {/* Kenaikan */}
          <Route path="/dashboardtusd/promosi" element={<PromosiSiswa />} />
          <Route path="/dashboardtusd/wali-kelas" element={<PenetapanWaliKelas />} />
          <Route path="/dashboardtusd/penempatan-siswa" element={<PenetapanSiswa />} />
          <Route path="/dashboardtusd/pembagian-rombel" element={<PembagianRombel />} />
          <Route path="/dashboardtusd/finalisasi-total" element={<FinalisasiTotal />} />

          {/* Rekap */}
          <Route path="/dashboardtusd/rekap-rapor" element={<RekapRaporSiswa />} />
          <Route path="/dashboardtusd/rekap-rapor/:siswa_id" element={<DetailRaporSiswaTU />} />
          <Route path="/dashboardtusd/rekap-guru" element={<Placeholder title="Rekap Data Guru" />} />
          <Route path="/dashboardtusd/rekap-siswa" element={<Placeholder title="Rekap Data Siswa" />} />

          {/* Sistem */}
          <Route path="/dashboardtusd/mutasi" element={<PindahKelas />} />
          <Route path="/dashboardtusd/pengaturan" element={<Pengaturan />} />
          <Route path="/dashboardtusd/profil" element={<ProfilAdmin />} />

          {/* Tambahan */}
          <Route path="/dashboardtusd/keuangan" element={<KeuanganTuSD />} />
          <Route path="/dashboardtusd/kartu-digital-subkelas" element={<KartuDigitalSubKelas />} />
          <Route path="/dashboardtusd/penugasan-guru" element={<PenugasanGuru />} />
        </Route>

        {/* ====================== 404 → redirect login ====================== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;