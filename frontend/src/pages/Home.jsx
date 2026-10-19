import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function HomeERapor() {
  // State untuk mengatur tab bantuan aktif (opsi: 'admin', 'guru', 'wali')
  const [activeTab, setActiveTab] = useState("admin");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">
      
      {/* HEADER & NAVIGASI */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-xl">UA</div>
            <div>
              <h1 className="font-bold text-emerald-800 text-lg leading-tight">Yayasan Ulil Albab</h1>
              <p className="text-xs text-gray-500">Portal e-Rapor Digital</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6 font-medium text-gray-600">
            <a href="#home" className="hover:text-emerald-700 transition">Beranda</a>
            <a href="#fitur" className="hover:text-emerald-700 transition">Fitur</a>
            <a href="#panduan" className="hover:text-emerald-700 transition">Panduan & Video</a>
          </nav>
          <Link to="/login" className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-lg font-semibold transition shadow-sm">
            Login e-Rapor
          </Link>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section id="home" className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="bg-emerald-600/50 text-emerald-200 text-sm font-medium px-4 py-1.5 rounded-full border border-emerald-500/30">
            Menuju Generasi Qur'ani, Berakhlak Mulia, dan Unggul
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-6 mb-4 leading-tight">
            Sistem Informasi Penilaian Digital <br/>
            <span className="text-amber-400">e-Rapor Ulil Albab</span>
          </h2>
          <p className="text-emerald-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Selamat datang di portal resmi peninjauan hasil belajar. Solusi transparan, akuntabel, dan terintegrasi untuk memantau perkembangan akademik serta akhlak ananda tercinta.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#panduan" className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-8 py-3 rounded-lg shadow-md transition text-center">
              Lihat Panduan & Video
            </a>
            <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg border border-white/20 transition text-center">
              Masuk Sistem
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PINTU MASUK PORTAL (LOGIN AKSES) */}
      <section className="container mx-auto px-6 -mt-10 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Akses Guru & Admin */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-emerald-600 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">👨‍🏫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Akses Akademik & Staff</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Pintu masuk untuk Superadmin, Tata Usaha (TU), dan Guru. Gunakan untuk mengelola rombel, tahun ajaran, input nilai, capaian Al-Qur'an (Tahfidz), adab, serta rekapitulasi absensi.
              </p>
            </div>
            <Link to="/login" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg transition text-center block">
              Login Guru & Staff
            </Link>
          </div>

          {/* Akses Siswa/Wali */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-amber-500 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">👩‍🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Akses Siswa & Wali Murid</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Khusus untuk siswa dan orang tua murid guna memantau perkembangan belajar harian, rekapitulasi ketidakhadiran, grafik target hafalan, serta mengunduh berkas e-Rapor resmi PDF.
              </p>
            </div>
            <Link to="/login-siswa" className="w-full bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold py-2.5 rounded-lg transition text-center block">
              Login Siswa / Wali
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FITUR UNGGULAN */}
      <section id="fitur" className="container mx-auto px-6 py-20 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900">Mengapa e-Rapor Kami Berbeda?</h2>
          <p className="text-gray-500 mt-2">Kami mengintegrasikan nilai akademik sekolah dengan nilai-nilai Diniyah Islamiyah</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
            <span className="text-2xl p-3 bg-emerald-50 text-emerald-700 rounded-lg">📖</span>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Integrasi Nilai Al-Qur'an & Diniyah</h4>
              <p className="text-gray-600 text-sm">Memantau perkembangan hafalan (Tahfidz), kelancaran membaca (Tahsin), serta adab harian siswa secara berkala.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
            <span className="text-2xl p-3 bg-emerald-50 text-emerald-700 rounded-lg">📊</span>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Grafik Perkembangan Belajar</h4>
              <p className="text-gray-600 text-sm">Orang tua dapat melihat grafik naik-turun prestasi akademik dan hafalan ananda dari semester ke semester.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
            <span className="text-2xl p-3 bg-emerald-50 text-emerald-700 rounded-lg">📱</span>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Akses Mudah & Responsif</h4>
              <p className="text-gray-600 text-sm">Dapat diakses dengan nyaman kapan saja dan di mana saja, baik via laptop maupun smartphone orang tua.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
            <span className="text-2xl p-3 bg-emerald-50 text-emerald-700 rounded-lg">🔒</span>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Keamanan Data Terjamin</h4>
              <p className="text-gray-600 text-sm">Data nilai tersimpan aman di server yayasan dan dienkripsi guna menjaga privasi rekam jejak nilai ananda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEKSI PANDUAN MANUAL (3 TABS: ADMIN, GURU, WALI) */}
      <section id="panduan" className="bg-emerald-50 py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-900">Pusat Bantuan & Panduan Penggunaan</h2>
            <p className="text-gray-500 mt-2">Pilih panduan sesuai dengan hak akses peran Anda di sistem</p>
          </div>

          {/* Tab Navigation (3 Opsi) */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-1.5 rounded-xl shadow-sm max-w-xl mx-auto border border-gray-100">
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition whitespace-nowrap ${
                activeTab === "admin" ? "bg-emerald-700 text-white shadow-sm" : "text-gray-600 hover:text-emerald-700"
              }`}
            >
              ⚙️ Panduan Admin / TU
            </button>
            <button
              onClick={() => setActiveTab("guru")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition whitespace-nowrap ${
                activeTab === "guru" ? "bg-emerald-700 text-white shadow-sm" : "text-gray-600 hover:text-emerald-700"
              }`}
            >
              👨‍🏫 Panduan Guru
            </button>
            <button
              onClick={() => setActiveTab("wali")}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition whitespace-nowrap ${
                activeTab === "wali" ? "bg-emerald-700 text-white shadow-sm" : "text-gray-600 hover:text-emerald-700"
              }`}
            >
              👩‍🎓 Panduan Wali Siswa
            </button>
          </div>

          {/* Grid Konten Panduan */}
          <div className="grid md:grid-cols-5 gap-8 items-center">
            
            {/* Sisi Kiri: Download Manual Book (2/5 Column) */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 self-stretch flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Dokumen Digital</span>
                <h4 className="text-xl font-bold text-gray-900 mt-1 mb-4">
                  Manual Book - {activeTab === "admin" ? "Admin TU" : activeTab === "guru" ? "Guru" : "Wali Murid"}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {activeTab === "admin" && "Panduan konfigurasi awal sistem: pembuatan tahun ajaran baru, manajemen data guru, penempatan rombongan belajar (Rombel), pengelolaan mutasi, penugasan guru, dan finalisasi total nilai sekolah."}
                  {activeTab === "guru" && "Petunjuk teknis penginputan absensi siswa (Harian & Mapel), penilaian kompetensi akademik, pengisian rekap capaian Tahfidz/Tahsin Al-Qur'an, pengelolaan deskripsi otomatis, hingga cetak draf rapor."}
                  {activeTab === "wali" && "Panduan praktis bagi orang tua/wali murid untuk melacak riwayat nilai harian, memantau grafik kenaikan hafalan juz Al-Qur'an anak, memvalidasi administrasi, serta cara mencetak e-Rapor PDF resmi."}
                </p>
              </div>
              
              <div>
                <a
                  href={`/downloads/manual_book_${activeTab}.pdf`}
                  download
                  className="flex items-center justify-center space-x-2 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl shadow-md transition"
                >
                  <span>📥</span>
                  <span>Unduh Buku Panduan (.pdf)</span>
                </a>
                <p className="text-center text-xs text-gray-400 mt-2">Pembaruan Versi: TA 2025/2026</p>
              </div>
            </div>

            {/* Sisi Kanan: Video YouTube Player (3/5 Column) */}
            <div className="md:col-span-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-inner">
                  {activeTab === "admin" && (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-0"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ" // 👈 Masukkan URL embed video Admin
                      title="Tutorial Tata Usaha & Admin e-Rapor Ulil Albab"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
                  {activeTab === "guru" && (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-0"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ" // 👈 Masukkan URL embed video Guru
                      title="Tutorial Input Nilai Guru e-Rapor Ulil Albab"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
                  {activeTab === "wali" && (
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-0"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ" // 👈 Masukkan URL embed video Wali Murid
                      title="Tutorial Akses Orang Tua/Wali e-Rapor Ulil Albab"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <div className="mt-4 px-2">
                  <h5 className="font-bold text-gray-900 flex items-center space-x-2">
                    <span className="text-red-600 text-xl">▶</span>
                    <span>
                      Video Tutorial: {activeTab === "admin" && "Langkah Konfigurasi Awal & Alur Kelola Rombel"}
                      {activeTab === "guru" && "Teknis Pengisian Nilai Mapel, Tahfidz & Rekap Absensi"}
                      {activeTab === "wali" && "Cara Mudah Melihat Pengumuman & Download Rapor di Smartphone"}
                    </span>
                  </h5>
                  <p className="text-xs text-gray-500 mt-1">Disediakan Resmi oleh Divisi IT Lajnah Pendidikan Yayasan Ulil Albab</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-emerald-950 text-emerald-100 pt-12 pb-6 px-6 border-t border-emerald-900">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-3">Yayasan Ulil Albab</h4>
            <p className="text-sm text-emerald-200/80 leading-relaxed">
              Membentuk Generasi Berkarakter Rabbani, Berakhlak Qur'ani, dan Berwawasan Global.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Kontak Sekolah</h4>
            <p className="text-sm text-emerald-200/80 space-y-1">
              <span>📍 Jl. Taman Pendidikan No. 45, Kota Cendekia</span><br/>
              <span>📞 (021) 1234-5678</span><br/>
              <span>💬 WA: 0812-3456-7890</span>
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Tautan Resmi</h4>
            <ul className="text-sm text-emerald-200/80 space-y-1.5">
              <li><a href="#" className="hover:underline">Situs Utama Yayasan</a></li>
              <li><a href="#" className="hover:underline">Pendaftaran Siswa Baru (PPDB)</a></li>
              <li><a href="#" className="hover:underline">Sistem Informasi Masjid</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-5xl border-t border-emerald-900/60 pt-6 text-center text-xs text-emerald-300/60">
          © 2026 IT Team Yayasan Ulil Albab. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}