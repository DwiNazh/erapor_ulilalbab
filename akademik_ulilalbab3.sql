-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2026 at 08:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `akademik_ulilalbab3`
--

-- --------------------------------------------------------

--
-- Table structure for table `absensi_harian`
--

CREATE TABLE `absensi_harian` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_tahun_id` bigint(20) UNSIGNED NOT NULL,
  `rombel_id` bigint(20) UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED DEFAULT NULL,
  `semester` enum('semester1','semester2') DEFAULT NULL,
  `tanggal` date NOT NULL,
  `status` enum('H','S','I','A') NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `guru_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `absensi_harian`
--

INSERT INTO `absensi_harian` (`id`, `siswa_tahun_id`, `rombel_id`, `tahun_ajaran_id`, `semester`, `tanggal`, `status`, `keterangan`, `guru_id`, `created_at`, `updated_at`, `aktif`) VALUES
(1, 187, 1, 2, 'semester1', '2026-07-13', 'S', 'sakit', 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(2, 188, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(3, 189, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(4, 190, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(5, 191, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(6, 192, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(7, 193, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(8, 194, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(9, 195, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(10, 196, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(11, 197, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(12, 198, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(13, 199, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(14, 200, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(15, 201, 1, 2, 'semester1', '2026-07-13', 'H', NULL, 5, '2026-07-13 17:55:18', '2026-07-13 17:55:18', 0),
(16, 516, 18, 3, 'semester1', '2026-07-14', 'S', 'demam', 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(17, 517, 18, 3, 'semester1', '2026-07-14', 'I', 'olimpiade', 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(18, 518, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(19, 519, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(20, 520, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(21, 521, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(22, 522, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(23, 523, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(24, 524, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(25, 525, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0);

-- --------------------------------------------------------

--
-- Table structure for table `absensi_mapel`
--

CREATE TABLE `absensi_mapel` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_tahun_id` bigint(20) UNSIGNED NOT NULL,
  `rombel_id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED DEFAULT NULL,
  `mata_pelajaran_id` bigint(20) UNSIGNED NOT NULL,
  `semester` varchar(255) NOT NULL,
  `tanggal` date DEFAULT NULL,
  `pertemuan_ke` int(11) DEFAULT NULL,
  `status` enum('H','S','I','A') NOT NULL DEFAULT 'H',
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `anggota_kelompok_quran`
--

CREATE TABLE `anggota_kelompok_quran` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `kelompok_quran_id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `anggota_kelompok_quran`
--

INSERT INTO `anggota_kelompok_quran` (`id`, `kelompok_quran_id`, `siswa_id`, `created_at`, `updated_at`) VALUES
(1, 1, 240, '2026-07-16 01:53:15', '2026-07-16 01:53:15'),
(2, 2, 280, '2026-07-16 03:16:39', '2026-07-16 03:16:39');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `catatan_wali_kelas`
--

CREATE TABLE `catatan_wali_kelas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `semester` varchar(2) NOT NULL,
  `tahun_ajaran` varchar(255) NOT NULL,
  `catatan` text DEFAULT NULL,
  `guru_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ekstrakurikuler`
--

CREATE TABLE `ekstrakurikuler` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(100) NOT NULL,
  `wajib` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ekstrakurikuler`
--

INSERT INTO `ekstrakurikuler` (`id`, `nama`, `wajib`, `created_at`, `updated_at`) VALUES
(1, 'pramuka', 1, '2026-07-13 19:06:05', '2026-07-13 19:06:05'),
(2, 'menari', 0, '2026-07-16 01:50:34', '2026-07-16 01:50:34'),
(3, 'sepak bola', 0, '2026-08-31 04:15:36', '2026-08-31 04:15:36');

-- --------------------------------------------------------

--
-- Table structure for table `ekstrakurikuler_siswa`
--

CREATE TABLE `ekstrakurikuler_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `ekstrakurikuler_id` bigint(20) UNSIGNED NOT NULL,
  `nilai` varchar(255) DEFAULT NULL,
  `tahun_ajaran` varchar(50) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ekstrakurikuler_siswa`
--

INSERT INTO `ekstrakurikuler_siswa` (`id`, `siswa_id`, `ekstrakurikuler_id`, `nilai`, `tahun_ajaran`, `semester`, `deskripsi`, `created_at`, `updated_at`) VALUES
(1, 76, 1, 'A', '2027/2028', 1, NULL, '2026-07-13 19:07:39', '2026-07-13 19:07:39'),
(2, 77, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(3, 78, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(4, 79, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(5, 80, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(6, 81, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(7, 82, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(8, 83, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(9, 84, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(10, 85, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(11, 86, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(12, 87, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(13, 88, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(14, 89, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40'),
(15, 90, 1, NULL, '2027/2028', 1, NULL, '2026-07-13 19:07:40', '2026-07-13 19:07:40');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finalisasi_rapor`
--

CREATE TABLE `finalisasi_rapor` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED DEFAULT NULL,
  `semester` varchar(1) NOT NULL,
  `jenis_rapor` varchar(10) NOT NULL,
  `tahun_ajaran` varchar(20) NOT NULL,
  `finalisasi` tinyint(1) NOT NULL DEFAULT 0,
  `approval_status` varchar(30) NOT NULL DEFAULT 'draft',
  `rejection_reason` text DEFAULT NULL,
  `diajukan_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `diajukan_at` timestamp NULL DEFAULT NULL,
  `disetujui_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `disetujui_at` timestamp NULL DEFAULT NULL,
  `tgl_finalisasi` timestamp NULL DEFAULT NULL,
  `catatan_wali_kelas` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `finalisasi_rapor`
--

INSERT INTO `finalisasi_rapor` (`id`, `siswa_id`, `guru_id`, `semester`, `jenis_rapor`, `tahun_ajaran`, `finalisasi`, `approval_status`, `rejection_reason`, `diajukan_oleh`, `diajukan_at`, `disetujui_oleh`, `disetujui_at`, `tgl_finalisasi`, `catatan_wali_kelas`, `created_at`, `updated_at`) VALUES
(1, 76, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(2, 77, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(3, 78, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(4, 79, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(5, 80, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(6, 81, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(7, 82, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(8, 83, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(9, 84, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(10, 85, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(11, 86, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(12, 87, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(13, 88, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(14, 89, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17'),
(15, 90, NULL, '1', 'PTS', '2027/2028', 1, 'approved', NULL, 6, '2026-07-13 19:11:01', 18, '2026-07-13 19:17:17', NULL, NULL, '2026-07-13 19:17:17', '2026-07-13 19:17:17');

-- --------------------------------------------------------

--
-- Table structure for table `jadwal`
--

CREATE TABLE `jadwal` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rombel_id` bigint(20) UNSIGNED NOT NULL,
  `mapel_id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED DEFAULT NULL,
  `penugasan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jadwal`
--

INSERT INTO `jadwal` (`id`, `rombel_id`, `mapel_id`, `guru_id`, `penugasan_id`, `hari`, `jam_mulai`, `jam_selesai`, `tahun_ajaran_id`, `created_at`, `updated_at`) VALUES
(4, 1, 12, 5, 7, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-13 18:30:24', '2026-07-13 18:30:24'),
(5, 1, 13, 5, 8, 'Senin', '09:00:00', '10:00:00', 2, '2026-07-13 18:30:43', '2026-07-13 18:30:43'),
(6, 2, 14, 6, 9, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-13 18:31:00', '2026-07-13 18:31:00'),
(7, 2, 27, 6, 10, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-13 18:31:18', '2026-07-13 18:31:18'),
(8, 3, 12, 7, 11, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-14 01:57:59', '2026-07-14 01:57:59'),
(9, 4, 12, 8, 12, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-14 01:58:43', '2026-07-14 01:58:43'),
(10, 5, 12, 9, 13, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-14 01:59:27', '2026-07-14 01:59:27'),
(11, 6, 12, 10, 14, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-14 01:59:47', '2026-07-14 01:59:47'),
(12, 7, 12, 11, 15, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-14 02:00:13', '2026-07-14 02:00:13'),
(13, 8, 12, 12, 16, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-14 02:00:45', '2026-07-14 02:00:45'),
(14, 9, 12, 13, 17, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-14 02:01:18', '2026-07-14 02:01:18'),
(15, 10, 12, 14, 18, 'Senin', '08:00:00', '09:00:00', 2, '2026-07-14 02:01:42', '2026-07-14 02:01:42'),
(16, 18, 12, 19, 19, 'Senin', '08:00:00', '09:00:00', 3, '2026-07-14 02:41:50', '2026-07-14 02:41:50'),
(17, 23, 12, 9, 20, 'Senin', '08:00:00', '09:00:00', 4, '2026-08-04 02:40:26', '2026-08-04 02:40:26'),
(18, 23, 19, 19, 21, 'Senin', '09:00:00', '10:00:00', 4, '2026-08-04 02:42:59', '2026-08-04 02:42:59');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tingkat` tinyint(3) UNSIGNED NOT NULL,
  `sub` varchar(4) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kelompok_quran`
--

CREATE TABLE `kelompok_quran` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED NOT NULL,
  `semester` enum('Ganjil','Genap') NOT NULL,
  `label` varchar(1) NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kelompok_quran`
--

INSERT INTO `kelompok_quran` (`id`, `guru_id`, `tahun_ajaran_id`, `semester`, `label`, `aktif`, `created_at`, `updated_at`) VALUES
(1, 6, 3, 'Ganjil', 'A', 0, '2026-07-16 01:52:49', '2026-07-16 01:52:49'),
(2, 19, 4, 'Ganjil', 'A', 0, '2026-07-16 03:16:19', '2026-07-16 03:16:19');

-- --------------------------------------------------------

--
-- Table structure for table `mapel`
--

CREATE TABLE `mapel` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `jenis` enum('wajib','pilihan') NOT NULL DEFAULT 'wajib',
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mapel`
--

INSERT INTO `mapel` (`id`, `nama`, `kode`, `jenis`, `deskripsi`, `created_at`, `updated_at`) VALUES
(12, 'Pendidikan Agama Islam', 'PAI', 'wajib', 'Mata pelajaran Pendidikan Agama Islam', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(13, 'Pendidikan Pancasila', 'PP', 'wajib', 'Mata pelajaran Pendidikan Pancasila', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(14, 'Bahasa Indonesia', 'BIN', 'wajib', 'Mata pelajaran Bahasa Indonesia', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(16, 'Ilmu Pengetahuan Alam', 'IPA', 'wajib', 'Mata pelajaran Ilmu Pengetahuan Alam', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(17, 'Ilmu Pengetahuan Sosial', 'IPS', 'wajib', 'Mata pelajaran Ilmu Pengetahuan Sosial', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(18, 'Bahasa Inggris', 'BIG', 'wajib', 'Mata pelajaran Bahasa Inggris', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(19, 'Pendidikan Jasmani, Olahraga dan Kesehatan', 'PJOK', 'pilihan', 'Mata pelajaran PJOK', '2026-07-13 17:52:57', '2026-08-04 02:42:10'),
(20, 'Seni Budaya', 'SBK', 'wajib', 'Mata pelajaran Seni Budaya', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(21, 'Informatika', 'INF', 'wajib', 'Mata pelajaran Informatika', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(22, 'Bahasa Arab', 'BAR', 'wajib', 'Mata pelajaran Bahasa Arab', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(23, 'Tahfidz Al-Qur\'an', 'THF', 'wajib', 'Program Tahfidz Al-Qur\'an', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(24, 'BTQ', 'BTQ', 'wajib', 'Baca Tulis Al-Qur\'an', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(25, 'Pramuka', 'PRM', 'pilihan', 'Ekstrakurikuler Pramuka', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(26, 'Pendidikan Lingkungan Hidup', 'PLH', 'pilihan', 'Muatan lokal Pendidikan Lingkungan Hidup', '2026-07-13 17:52:57', '2026-07-13 17:52:57'),
(27, 'matematika', 'MTK', 'wajib', NULL, '2026-07-13 18:03:20', '2026-07-13 18:03:20');

-- --------------------------------------------------------

--
-- Table structure for table `mata_pelajaran`
--

CREATE TABLE `mata_pelajaran` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_01_01_000000_create_tahun_ajaran_table', 1),
(5, '2025_01_01_000000_create_wali_kelas_table', 1),
(6, '2025_01_01_000002_create_siswa_table', 1),
(7, '2025_11_04_090342_create_personal_access_tokens_table', 1),
(8, '2025_11_10_023229_remove_email_from_users_table', 1),
(9, '2025_11_10_115047_create_siswas_table', 1),
(10, '2025_11_10_115200_create_promosi_siswas_table', 1),
(11, '2025_11_13_031027_add_ppdb_fields_to_siswas_table', 1),
(12, '2025_11_13_032026_rename_id_and_nama_in_siswas_table', 1),
(13, '2025_11_13_143225_add_sub_kelas_and_nis_to_siswas_table', 1),
(14, '2025_11_19_041415_add_is_processed_to_siswas_table', 1),
(15, '2025_12_10_000001_create_kelas_table', 1),
(16, '2025_12_18_025253_create_rombels_table', 1),
(17, '2026_01_21_031804_add_status_and_semester_aktif_to_tahun_ajaran_table', 1),
(18, '2026_01_26_074611_change_ppdb_id_type_in_siswas_table', 1),
(19, '2026_01_27_043502_add_tahun_ajaran_id_to_rombel_table', 1),
(20, '2026_02_08_085857_create_siswa_tahun_table', 1),
(21, '2026_02_09_070438_fix_unique_rombel_tahun_ajaran', 1),
(22, '2026_02_25_061434_remove_wali_kelas_id_from_siswa_tahun_table', 1),
(23, '2026_03_03_055853_add_guru_id_to_rombels_table', 1),
(24, '2026_03_05_045813_create_mata_pelajaran_table', 1),
(25, '2026_03_06_141648_create_mapel_table', 1),
(26, '2026_03_08_080000_create_absensi_mapel_table', 1),
(27, '2026_03_10_082204_create_nilai_siswa_table', 1),
(28, '2026_03_11_043335_create_nilai_kokurikuler_table', 1),
(29, '2026_03_11_054648_remove_rombel_id_from_nilai_kokurikuler_table', 1),
(30, '2026_03_13_050440_create_nilai__ekstra_kurikuler_table', 1),
(31, '2026_03_13_070740_create_ekstrakurikuler_siswa_table', 1),
(32, '2026_04_09_014056_create_penugasan_guru_table', 1),
(33, '2026_04_23_040953_add_foto_to_users_table', 1),
(34, '2026_04_23_045928_create_pengaturan_table', 1),
(35, '2026_04_25_063235_make_rombel_id_nullable_in_siswa_tahun', 1),
(36, '2026_04_27_141228_create_mutasi_table', 1),
(37, '2026_04_30_082044_add_deskripsi_to_nilai_kokurikuler_table', 1),
(38, '2026_04_30_084337_add_deskripsi_aspek_to_nilai_kokurikuler_table', 1),
(39, '2026_04_30_085937_add_deskripsi_aspek_to_nilai_kokurikuler_table', 1),
(40, '2026_04_30_090351_add_guru_id_to_nilai_kokurikuler_table', 1),
(41, '2026_05_04_112442_create_template_deskripsi_table', 1),
(42, '2026_05_04_115947_add_deskripsi_to_ekstrakurikuler_siswa_table', 1),
(43, '2026_05_04_130010_create_template_deskripsi_intrakurikuler_table', 1),
(44, '2026_05_04_141427_create_rapor_siswa_table', 1),
(45, '2026_05_05_015120_create_finalisasi_rapor_table', 1),
(46, '2026_05_05_042108_create_catatan_wali_kelas_table', 1),
(47, '2026_05_06_045611_create_jadwal_table', 1),
(48, '2026_05_06_160611_make_guru_id_nullable_in_jadwal_table', 1),
(49, '2026_05_11_114309_add_approval_columns_to_finalisasi_rapor', 1),
(50, '2026_05_13_024146_add_penugasan_id_to_jadwal_table', 1),
(51, '2026_05_15_175445_add_guru_id_to_nilai_siswas_table', 1),
(52, '2026_05_15_180913_fix_unique_index_nilai_siswa_v2', 1),
(53, '2026_05_18_020055_create_pengaturans_tables', 1),
(54, '2026_05_22_124905_create_pjbl_judul_table', 1),
(55, '2026_05_25_042251_create_system_backups_table', 1),
(56, '2026_05_25_062040_add_is_processed_to_siswa_tahun_table', 1),
(57, '2026_05_26_205114_create_kelompok_quran_table', 1),
(58, '2026_05_26_205129_create_anggota_kelompok_quran_table', 1),
(59, '2026_05_27_023521_fix_fk_anggota_kelompok_quran_to_siswa', 1),
(60, '2026_05_27_030524_create_pertemuan_quran_table', 1),
(61, '2026_05_27_031029_create_nilai_quran_table', 1),
(62, '2026_05_29_130911_add_deskripsi_to_nilai_quran_table', 1),
(63, '2026_05_29_145618_change_mutabaah_column_in_nilai_kokurikuler_table', 1),
(64, '2026_05_29_add_nilai_mingguan_mutabaah_to_nilai_kokurikuler', 1),
(65, '2026_06_23_000000_create_absensi_harian_table', 1),
(66, '2026_06_23_081244_add_jenis_to_mapel_table', 1),
(67, '2026_06_25_092722_add_jenis_to_nilai_quran_table', 1),
(68, '2026_07_13_213643_create_nilai_siswa_detail_table', 1),
(69, '2026_07_13_224319_add_status_siswa_tahun_table', 1),
(70, '2026_07_25_123904_add_tahun_ajaran_and_semester_to_absensi_harian_table', 1),
(71, '2026_07_30_084725_add_password_to_siswa_table', 2),
(72, '2026_07_30_084900_add_password_to_siswa_and_siswas_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `mutasi`
--

CREATE TABLE `mutasi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `jenis` enum('siswa','guru') NOT NULL,
  `target_id` bigint(20) UNSIGNED NOT NULL,
  `tipe_mutasi` enum('pindah_rombel','pindah_sekolah') NOT NULL,
  `rombel_asal_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rombel_tujuan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sekolah_tujuan` varchar(255) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `tanggal_mutasi` date NOT NULL,
  `dilakukan_oleh` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mutasi`
--

INSERT INTO `mutasi` (`id`, `jenis`, `target_id`, `tipe_mutasi`, `rombel_asal_id`, `rombel_tujuan_id`, `sekolah_tujuan`, `keterangan`, `tanggal_mutasi`, `dilakukan_oleh`, `created_at`, `updated_at`) VALUES
(1, 'siswa', 93, 'pindah_rombel', 22, 23, NULL, NULL, '2026-08-03', 4, '2026-08-03 01:47:34', '2026-08-03 01:47:34'),
(2, 'siswa', 93, 'pindah_rombel', 23, 22, NULL, NULL, '2026-08-03', 4, '2026-08-03 01:49:02', '2026-08-03 01:49:02');

-- --------------------------------------------------------

--
-- Table structure for table `nilai_kokurikuler`
--

CREATE TABLE `nilai_kokurikuler` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED DEFAULT NULL,
  `semester` varchar(1) NOT NULL DEFAULT '1',
  `tahun_ajaran` varchar(9) NOT NULL,
  `mutabaah_yaumiyah` decimal(3,1) DEFAULT NULL,
  `bina_pribadi_islam` varchar(1) DEFAULT NULL,
  `pjbl` varchar(1) DEFAULT NULL,
  `literasi` varchar(1) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `deskripsi_aspek` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`deskripsi_aspek`)),
  `nilai_mingguan_mutabaah` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array nilai mingguan Mutabah Yaumiyah skala 1-4, disimpan sebagai JSON' CHECK (json_valid(`nilai_mingguan_mutabaah`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nilai_kokurikuler`
--

INSERT INTO `nilai_kokurikuler` (`id`, `siswa_id`, `guru_id`, `semester`, `tahun_ajaran`, `mutabaah_yaumiyah`, `bina_pribadi_islam`, `pjbl`, `literasi`, `deskripsi`, `deskripsi_aspek`, `nilai_mingguan_mutabaah`, `created_at`, `updated_at`) VALUES
(1, 76, NULL, '1', '2027/2028', 1.0, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[\"1\",\"1\"]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(2, 77, NULL, '1', '2027/2028', 1.0, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[\"1\",\"1\"]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(3, 78, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(4, 79, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(5, 80, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(6, 81, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(7, 82, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(8, 83, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(9, 84, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(10, 85, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(11, 86, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(12, 87, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(13, 88, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(14, 89, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53'),
(15, 90, NULL, '1', '2027/2028', NULL, NULL, NULL, NULL, NULL, '[null,null,null,null]', '[null,null]', '2026-07-13 18:38:53', '2026-07-13 18:38:53');

-- --------------------------------------------------------

--
-- Table structure for table `nilai_quran`
--

CREATE TABLE `nilai_quran` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `kelompok_quran_id` bigint(20) UNSIGNED NOT NULL,
  `tahun_ajaran` varchar(9) NOT NULL,
  `semester` enum('1','2') NOT NULL,
  `jenis` enum('tahfidz','tilawah') NOT NULL,
  `uh1` int(11) DEFAULT NULL,
  `uh2` int(11) DEFAULT NULL,
  `uh3` int(11) DEFAULT NULL,
  `uh4` int(11) DEFAULT NULL,
  `uh5` int(11) DEFAULT NULL,
  `pts` int(11) DEFAULT NULL,
  `pas` int(11) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nilai_quran`
--

INSERT INTO `nilai_quran` (`id`, `siswa_id`, `kelompok_quran_id`, `tahun_ajaran`, `semester`, `jenis`, `uh1`, `uh2`, `uh3`, `uh4`, `uh5`, `pts`, `pas`, `deskripsi`, `created_at`, `updated_at`) VALUES
(11, 280, 2, '2029/2030', '1', 'tahfidz', 100, NULL, NULL, NULL, NULL, 100, 90, 'pertahankan', '2026-07-16 03:19:24', '2026-07-16 03:19:24');

-- --------------------------------------------------------

--
-- Table structure for table `nilai_siswa`
--

CREATE TABLE `nilai_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `mapel_id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED DEFAULT NULL,
  `semester` enum('1','2') NOT NULL,
  `tahun_ajaran` varchar(9) NOT NULL,
  `uh1` int(11) DEFAULT NULL COMMENT 'Ulangan Harian 1',
  `uh2` int(11) DEFAULT NULL COMMENT 'Ulangan Harian 2',
  `uh3` int(11) DEFAULT NULL COMMENT 'Ulangan Harian 3',
  `uh4` int(11) DEFAULT NULL COMMENT 'Ulangan Harian 4',
  `uh5` int(11) DEFAULT NULL COMMENT 'Ulangan Harian 5',
  `pts` int(11) DEFAULT NULL COMMENT 'Penilaian Tengah Semester',
  `pas` int(11) DEFAULT NULL COMMENT 'Penilaian Akhir Semester',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `nilai_siswa`
--

INSERT INTO `nilai_siswa` (`id`, `siswa_id`, `mapel_id`, `guru_id`, `semester`, `tahun_ajaran`, `uh1`, `uh2`, `uh3`, `uh4`, `uh5`, `pts`, `pas`, `created_at`, `updated_at`) VALUES
(1, 76, 14, 6, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-13 18:36:24', '2026-07-13 18:36:24'),
(2, 77, 14, 6, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-13 18:36:24', '2026-07-13 18:36:24'),
(33, 78, 14, 6, '1', '2027/2028', 76, 78, 80, 79, 81, 78, 80, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(34, 79, 14, 6, '1', '2027/2028', 91, 90, 92, 93, 94, 92, 94, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(35, 80, 14, 6, '1', '2027/2028', 84, 83, 85, 86, 84, 85, 87, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(36, 81, 14, 6, '1', '2027/2028', 79, 80, 81, 82, 83, 81, 82, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(37, 82, 14, 6, '1', '2027/2028', 95, 94, 96, 95, 97, 96, 98, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(38, 83, 14, 6, '1', '2027/2028', 86, 87, 85, 88, 89, 87, 90, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(39, 84, 14, 6, '1', '2027/2028', 81, 82, 80, 83, 84, 82, 84, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(40, 85, 14, 6, '1', '2027/2028', 90, 91, 89, 92, 93, 91, 93, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(41, 86, 14, 6, '1', '2027/2028', 77, 79, 78, 80, 81, 79, 81, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(42, 87, 14, 6, '1', '2027/2028', 85, 86, 84, 87, 88, 86, 89, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(43, 88, 14, 6, '1', '2027/2028', 92, 93, 91, 94, 95, 93, 95, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(44, 89, 14, 6, '1', '2027/2028', 83, 84, 82, 85, 86, 84, 86, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(45, 90, 14, 6, '1', '2027/2028', 89, 88, 90, 91, 92, 90, 92, '2026-07-14 01:44:45', '2026-07-14 01:44:45'),
(46, 61, 12, 5, '1', '2027/2028', 90, 100, 90, 100, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(47, 62, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(48, 63, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(49, 64, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(50, 65, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(51, 66, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(52, 67, 12, 5, '1', '2027/2028', 90, 90, 90, 100, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(53, 68, 12, 5, '1', '2027/2028', 100, 100, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(54, 69, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(55, 70, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(56, 71, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(57, 72, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(58, 73, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(59, 74, 12, 5, '1', '2027/2028', 90, 100, 90, 90, 90, 90, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(60, 75, 12, 5, '1', '2027/2028', 90, 90, 90, 90, 90, 100, 90, '2026-07-14 01:45:36', '2026-07-14 01:45:36'),
(61, 61, 13, 5, '1', '2027/2028', 90, 80, 90, 90, 80, 80, 88, '2026-07-14 01:46:08', '2026-07-14 01:46:20'),
(77, 62, 13, 5, '1', '2027/2028', 88, 87, 89, 90, 88, 89, 91, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(78, 63, 13, 5, '1', '2027/2028', 76, 78, 80, 79, 81, 78, 80, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(79, 64, 13, 5, '1', '2027/2028', 91, 90, 92, 93, 94, 92, 94, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(80, 65, 13, 5, '1', '2027/2028', 84, 83, 85, 86, 84, 85, 87, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(81, 66, 13, 5, '1', '2027/2028', 79, 80, 81, 82, 83, 81, 82, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(82, 67, 13, 5, '1', '2027/2028', 95, 94, 96, 95, 97, 96, 98, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(83, 68, 13, 5, '1', '2027/2028', 86, 87, 85, 88, 89, 87, 90, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(84, 69, 13, 5, '1', '2027/2028', 81, 82, 80, 83, 84, 82, 84, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(85, 70, 13, 5, '1', '2027/2028', 90, 91, 89, 92, 93, 91, 93, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(86, 71, 13, 5, '1', '2027/2028', 77, 79, 78, 80, 81, 79, 81, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(87, 72, 13, 5, '1', '2027/2028', 85, 86, 84, 87, 88, 86, 89, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(88, 73, 13, 5, '1', '2027/2028', 92, 93, 91, 94, 95, 93, 95, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(89, 74, 13, 5, '1', '2027/2028', 83, 84, 82, 85, 86, 84, 86, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(90, 75, 13, 5, '1', '2027/2028', 89, 88, 90, 91, 92, 90, 92, '2026-07-14 01:48:47', '2026-07-14 01:48:47'),
(91, 91, 12, 7, '1', '2027/2028', 90, 80, 90, 90, 80, 88, 98, '2026-07-14 02:03:34', '2026-07-14 02:03:34'),
(107, 92, 12, 7, '1', '2027/2028', 88, 87, 89, 90, 88, 89, 91, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(108, 93, 12, 7, '1', '2027/2028', 76, 78, 80, 79, 81, 78, 80, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(109, 94, 12, 7, '1', '2027/2028', 91, 90, 92, 93, 94, 92, 94, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(110, 95, 12, 7, '1', '2027/2028', 84, 83, 85, 86, 84, 85, 87, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(111, 96, 12, 7, '1', '2027/2028', 79, 80, 81, 82, 83, 81, 82, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(112, 97, 12, 7, '1', '2027/2028', 95, 94, 96, 95, 97, 96, 98, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(113, 98, 12, 7, '1', '2027/2028', 86, 87, 85, 88, 89, 87, 90, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(114, 99, 12, 7, '1', '2027/2028', 81, 82, 80, 83, 84, 82, 84, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(115, 100, 12, 7, '1', '2027/2028', 90, 91, 89, 92, 93, 91, 93, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(116, 101, 12, 7, '1', '2027/2028', 77, 79, 78, 80, 81, 79, 81, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(117, 102, 12, 7, '1', '2027/2028', 85, 86, 84, 87, 88, 86, 89, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(118, 103, 12, 7, '1', '2027/2028', 92, 93, 91, 94, 95, 93, 95, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(119, 104, 12, 7, '1', '2027/2028', 83, 84, 82, 85, 86, 84, 86, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(120, 105, 12, 7, '1', '2027/2028', 89, 88, 90, 91, 92, 90, 92, '2026-07-14 02:07:22', '2026-07-14 02:07:22'),
(121, 121, 12, 9, '1', '2027/2028', 90, 80, 88, 78, 90, 90, 90, '2026-07-14 02:09:30', '2026-07-14 02:09:30'),
(122, 122, 12, 9, '1', '2027/2028', 88, 87, 89, 90, 88, 89, 91, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(123, 123, 12, 9, '1', '2027/2028', 76, 78, 80, 79, 81, 78, 80, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(124, 124, 12, 9, '1', '2027/2028', 91, 90, 92, 93, 94, 92, 94, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(125, 125, 12, 9, '1', '2027/2028', 84, 83, 85, 86, 84, 85, 87, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(126, 126, 12, 9, '1', '2027/2028', 79, 80, 81, 82, 83, 81, 82, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(127, 127, 12, 9, '1', '2027/2028', 95, 94, 96, 95, 97, 96, 98, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(128, 128, 12, 9, '1', '2027/2028', 86, 87, 85, 88, 89, 87, 90, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(129, 129, 12, 9, '1', '2027/2028', 81, 82, 80, 83, 84, 82, 84, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(130, 130, 12, 9, '1', '2027/2028', 90, 91, 89, 92, 93, 91, 93, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(131, 131, 12, 9, '1', '2027/2028', 77, 79, 78, 80, 81, 79, 81, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(132, 132, 12, 9, '1', '2027/2028', 85, 86, 84, 87, 88, 86, 89, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(133, 133, 12, 9, '1', '2027/2028', 92, 93, 91, 94, 95, 93, 95, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(134, 134, 12, 9, '1', '2027/2028', 83, 84, 82, 85, 86, 84, 86, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(135, 135, 12, 9, '1', '2027/2028', 89, 88, 90, 91, 92, 90, 92, '2026-07-14 02:12:33', '2026-07-14 02:12:33'),
(136, 151, 12, 11, '1', '2027/2028', 90, 100, 80, 90, 90, 90, 90, '2026-07-14 02:15:09', '2026-07-14 02:15:09'),
(137, 270, 12, 19, '1', '2028/2029', 90, 90, 90, 90, 90, 90, 90, '2026-07-14 02:44:32', '2026-07-14 02:44:32');

-- --------------------------------------------------------

--
-- Table structure for table `nilai_siswa_detail`
--

CREATE TABLE `nilai_siswa_detail` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nilai_siswa_id` bigint(20) UNSIGNED NOT NULL,
  `jenis` varchar(255) NOT NULL,
  `urutan` int(11) NOT NULL DEFAULT 1,
  `nilai` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan`
--

CREATE TABLE `pengaturan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_sekolah` varchar(255) DEFAULT NULL,
  `npsn` varchar(255) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `telepon` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `email_sekolah` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaturans`
--

CREATE TABLE `pengaturans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_sekolah` varchar(255) DEFAULT NULL,
  `npsn` varchar(20) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `kota` varchar(100) DEFAULT NULL,
  `provinsi` varchar(100) DEFAULT NULL,
  `kode_pos` varchar(10) DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `kepala_sekolah` varchar(255) DEFAULT NULL,
  `nip_kepala` varchar(30) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `email_notifikasi` varchar(100) DEFAULT NULL,
  `notif_akun_baru` tinyint(1) NOT NULL DEFAULT 0,
  `notif_rapor` tinyint(1) NOT NULL DEFAULT 0,
  `notif_login` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `penugasan_guru`
--

CREATE TABLE `penugasan_guru` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rombel_id` int(11) NOT NULL,
  `guru_id` bigint(20) UNSIGNED NOT NULL,
  `mapel_id` bigint(20) UNSIGNED NOT NULL,
  `kelas` varchar(20) DEFAULT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `penugasan_guru`
--

INSERT INTO `penugasan_guru` (`id`, `rombel_id`, `guru_id`, `mapel_id`, `kelas`, `tahun_ajaran_id`, `created_at`, `updated_at`) VALUES
(7, 1, 5, 12, NULL, 2, '2026-07-13 18:30:24', '2026-07-13 18:30:24'),
(8, 1, 5, 13, NULL, 2, '2026-07-13 18:30:43', '2026-07-13 18:30:43'),
(9, 2, 6, 14, NULL, 2, '2026-07-13 18:31:00', '2026-07-13 18:31:00'),
(10, 2, 6, 27, NULL, 2, '2026-07-13 18:31:18', '2026-07-13 18:31:18'),
(11, 3, 7, 12, NULL, 2, '2026-07-14 01:57:59', '2026-07-14 01:57:59'),
(12, 4, 8, 12, NULL, 2, '2026-07-14 01:58:43', '2026-07-14 01:58:43'),
(13, 5, 9, 12, NULL, 2, '2026-07-14 01:59:27', '2026-07-14 01:59:27'),
(14, 6, 10, 12, NULL, 2, '2026-07-14 01:59:47', '2026-07-14 01:59:47'),
(15, 7, 11, 12, NULL, 2, '2026-07-14 02:00:13', '2026-07-14 02:00:13'),
(16, 8, 12, 12, NULL, 2, '2026-07-14 02:00:45', '2026-07-14 02:00:45'),
(17, 9, 13, 12, NULL, 2, '2026-07-14 02:01:18', '2026-07-14 02:01:18'),
(18, 10, 14, 12, NULL, 2, '2026-07-14 02:01:42', '2026-07-14 02:01:42'),
(19, 18, 19, 12, NULL, 3, '2026-07-14 02:41:50', '2026-07-14 02:41:50'),
(20, 23, 9, 12, NULL, 4, '2026-08-04 02:40:26', '2026-08-04 02:40:26'),
(21, 23, 19, 19, NULL, 4, '2026-08-04 02:42:59', '2026-08-04 02:42:59');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(9, 'App\\Models\\User', 17, 'auth-token', '02442d96d67757476fd623cb2d1179de076cc1f0042bc84040f2c55ece61c858', '[\"*\"]', NULL, NULL, '2026-07-13 19:12:39', '2026-07-13 19:12:39'),
(37, 'App\\Models\\User', 1, 'auth-token', '381ffa368734206ef5d90deb19ae6f8e52c17a94000d32916de05dfd0da7b83c', '[\"*\"]', '2026-07-16 02:05:03', NULL, '2026-07-16 02:04:56', '2026-07-16 02:05:03'),
(41, 'App\\Models\\User', 19, 'auth-token', '2a1789930f63c954bb09611d9195bd93bff108e2cafa5f90b037a6d6e68c05f4', '[\"*\"]', '2026-07-25 07:12:30', NULL, '2026-07-16 03:17:21', '2026-07-25 07:12:30'),
(44, 'App\\Models\\User', 18, 'auth-token', '6bbbaae3b87143768e220ae09385493318d9a8587dac3e543b602f985c19d7a2', '[\"*\"]', '2026-07-30 02:49:28', NULL, '2026-07-25 07:13:49', '2026-07-30 02:49:28'),
(48, 'App\\Models\\Siswa', 61, 'siswa-token', 'b95801c233da299123df5035e757df411a0dae1cac7f232e26c28b90be19ee86', '[\"*\"]', NULL, NULL, '2026-07-30 01:53:56', '2026-07-30 01:53:56'),
(50, 'App\\Models\\Siswa', 231, 'siswa-token', '16484df636cc330fd5d03d10b548a2c0e48e728b0b73f98a116ad4f3571abf82', '[\"*\"]', '2026-08-04 02:40:53', NULL, '2026-07-30 02:48:56', '2026-08-04 02:40:53'),
(58, 'App\\Models\\Siswa', 78, 'siswa-token', '2cf096d1111d70f995dc095e36b1876a9e16edc404fe65a307cf81db97210a6b', '[\"*\"]', '2026-07-30 08:19:30', NULL, '2026-07-30 08:12:36', '2026-07-30 08:19:30'),
(63, 'App\\Models\\User', 9, 'auth-token', '17df5f607e1f7e9dc0829168bfdbf0ea4968a0b5328eb8099447ec16df391e9a', '[\"*\"]', '2026-08-31 01:03:23', NULL, '2026-08-04 02:41:16', '2026-08-31 01:03:23'),
(66, 'App\\Models\\User', 5, 'auth-token', '3954a3676f15c1c465e21cfe46dd085c873a1060059b3ef81d80392573e85b9c', '[\"*\"]', '2026-09-01 07:58:37', NULL, '2026-08-31 04:15:56', '2026-09-01 07:58:37');

-- --------------------------------------------------------

--
-- Table structure for table `pertemuan_quran`
--

CREATE TABLE `pertemuan_quran` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `kelompok_quran_id` bigint(20) UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `pertemuan_ke` int(11) NOT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pjbl_judul`
--

CREATE TABLE `pjbl_judul` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rombel_id` bigint(20) UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED NOT NULL,
  `semester` enum('ganjil','genap') NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promosi_siswa`
--

CREATE TABLE `promosi_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `kelas_baru_id` int(11) DEFAULT NULL,
  `kelas_asal` tinyint(3) UNSIGNED DEFAULT NULL,
  `sub_kelas_asal` varchar(4) DEFAULT NULL,
  `tahun_ajaran_asal` varchar(20) DEFAULT NULL,
  `kelas_tujuan` tinyint(3) UNSIGNED DEFAULT NULL,
  `sub_kelas_tujuan` varchar(4) DEFAULT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('promoted','failed') NOT NULL DEFAULT 'promoted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rapor_siswa`
--

CREATE TABLE `rapor_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `rombel_id` bigint(20) UNSIGNED NOT NULL,
  `tahun_ajaran` varchar(20) NOT NULL,
  `jenis_rapor` varchar(255) NOT NULL,
  `nilai_akhir` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `is_final` tinyint(1) NOT NULL DEFAULT 0,
  `finalized_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rombel`
--

CREATE TABLE `rombel` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED NOT NULL,
  `tingkat_kelas` int(11) NOT NULL DEFAULT 1,
  `sub_nama` varchar(10) NOT NULL,
  `guru_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rombel`
--

INSERT INTO `rombel` (`id`, `tahun_ajaran_id`, `tingkat_kelas`, `sub_nama`, `guru_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, 2, 'A', 5, 1, '2026-07-13 16:44:32', '2026-07-13 16:56:46'),
(2, 2, 2, 'B', 6, 1, '2026-07-13 16:44:33', '2026-07-13 16:56:46'),
(3, 2, 3, 'A', 7, 1, '2026-07-13 16:46:16', '2026-07-13 16:56:46'),
(4, 2, 3, 'B', 8, 1, '2026-07-13 16:46:17', '2026-07-13 16:56:46'),
(5, 2, 4, 'A', 9, 1, '2026-07-13 16:46:27', '2026-07-13 16:56:46'),
(6, 2, 4, 'B', 10, 1, '2026-07-13 16:46:28', '2026-07-13 16:56:46'),
(7, 2, 5, 'A', 11, 1, '2026-07-13 16:46:40', '2026-07-13 16:56:46'),
(8, 2, 5, 'B', 12, 1, '2026-07-13 16:46:40', '2026-07-13 16:56:46'),
(9, 2, 6, 'A', 13, 1, '2026-07-13 16:46:53', '2026-07-13 16:56:46'),
(10, 2, 6, 'B', 14, 1, '2026-07-13 16:46:54', '2026-07-13 16:56:46'),
(11, 2, 1, 'A', 15, 1, '2026-07-13 16:57:21', '2026-07-13 16:57:43'),
(12, 2, 1, 'B', 16, 1, '2026-07-13 16:57:22', '2026-07-13 16:57:43'),
(13, 3, 2, 'A', 6, 1, '2026-07-14 02:34:23', '2026-07-14 02:37:13'),
(14, 3, 3, 'A', 16, 1, '2026-07-14 02:34:28', '2026-07-14 02:37:13'),
(15, 3, 4, 'A', 10, 1, '2026-07-14 02:34:34', '2026-07-14 02:37:13'),
(16, 3, 5, 'A', 14, 1, '2026-07-14 02:34:41', '2026-07-14 02:37:13'),
(17, 3, 6, 'A', 9, 1, '2026-07-14 02:34:48', '2026-07-14 02:37:13'),
(18, 3, 1, 'A', 19, 1, '2026-07-14 02:37:48', '2026-07-14 02:38:40'),
(19, 4, 2, 'A', 5, 1, '2026-07-16 02:52:44', '2026-07-16 02:58:26'),
(20, 4, 3, 'A', 6, 1, '2026-07-16 02:52:53', '2026-07-16 02:58:26'),
(21, 4, 4, 'A', 7, 1, '2026-07-16 02:53:12', '2026-07-16 02:58:26'),
(22, 4, 5, 'A', 8, 1, '2026-07-16 02:53:42', '2026-07-16 02:58:26'),
(23, 4, 6, 'A', 9, 1, '2026-07-16 02:54:02', '2026-07-16 02:58:26'),
(24, 4, 1, 'A', 19, 1, '2026-07-16 02:58:57', '2026-07-16 03:00:16');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `siswa`
--

CREATE TABLE `siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nis` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nisn` varchar(255) DEFAULT NULL,
  `kelas` int(11) DEFAULT NULL,
  `sub` varchar(255) DEFAULT NULL,
  `wali_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_processed` tinyint(1) NOT NULL DEFAULT 0,
  `is_graduated` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `siswa`
--

INSERT INTO `siswa` (`id`, `nama`, `nis`, `password`, `nisn`, `kelas`, `sub`, `wali_id`, `tahun_ajaran_id`, `is_processed`, `is_graduated`, `created_at`, `updated_at`) VALUES
(61, 'ADZRA IZZATUNNISA SYIFFA', '24.2093', '$2y$12$dlcIqDlXeUXW2XMKr.hJiOCtniz13VodinKQUDY/LLWsc2YpQQaFi', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:09'),
(62, 'Aisha Syifa Zulka', '24.2094', '$2y$12$KiVP3XOwWBi2eQCrsSy6Q.GCbSPx8Kcy64KKJxI.0HdBVM7jkDZH6', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:09'),
(63, 'Alvino ardiansyah', '24.2095', '$2y$12$ya0w8X2/W6.b6tp8uUbXPezLCzzKyNyuwxowunwrqV1XHVwtcKtzy', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:10'),
(64, 'Arman Rafindra Kusuma', '24.2096', '$2y$12$/vD0xhTAOq/3znrG.R1mNO6NXhLd3wmWk0TDxpurEpUSAPGL0Tuga', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:10'),
(65, 'Arsyila Inara Azizah', '24.2097', '$2y$12$BAjMmQXm3Uji6Mebo11V/uffkfk2j5Z/8jHosGdgSWEqwWAhQJoNG', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:10'),
(66, 'Ayska Falillah Zarin', '24.2098', '$2y$12$8vDWF6i79dHfgEBFJa7pPud4lj7kXKB37DG.gVL2yUfdK7oCeSVCS', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:10'),
(67, 'Falih Aqmar Mulyadi', '24.2099', '$2y$12$6W5/Z8uKSA60fxoMw9Z0zuWmIgfXiQMKZU.JPyzVcCX3jT8XTLTq.', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:11'),
(68, 'Gavindra Athaya Nugraha', '24.2100', '$2y$12$MqiMM4Ra.GGNROVbp7D4eOvTYDzHRrTfkm4vgp6cb/xWIgVu1beXa', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:11'),
(69, 'Hana Andhira', '24.2101', '$2y$12$d/Y7eR4mi6aFi5AS2jI89OmjC5m8Fsd88FHbrJpuVwPL6BD6GVvte', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:11'),
(70, 'Hanan Ozil junior', '24.2102', '$2y$12$OPQ.VxZFzkqtJ/jdNo1p5eRFeWM7yNi9o329Z.nTQrT5bcTQkaWJG', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:11'),
(71, 'HASYA SHIRIN KHAIRUNNISA', '24.2103', '$2y$12$3iqh7MKqrS530ZDy12eThevgZo/PipkBqxprJsKsASE6AeY41XDxK', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:11'),
(72, 'M.Akhtar Makhsum Dalimunthe', '24.2104', '$2y$12$SuhC3TuQShv7ZgmSCfqDDeMYyZhyCGFfT.Z7TYvIuQGfAch/kFZIa', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:12'),
(73, 'MARYAM NAILA SAKHI', '24.2105', '$2y$12$YrtmoTJEXznIw5jXmrvzbuSfFzy6UGcNVV7n9G1VUWeXYsM2xuFNG', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:12'),
(74, 'Muhammad Aldric AlKafhi', '24.2106', '$2y$12$SkMoEuQAn7jiHvaMIyNPH.zg7Uq1MSHQlQz2rl6UOWhPHxt7Z1TQe', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:12'),
(75, 'Muhammad Khaizan Al Daffa', '24.2107', '$2y$12$M3mJWKqaxUJUfMcjozKzZenvkqbIE2WCt0ju0XH1mahF7S1IPYPYy', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:12'),
(76, 'MUHAMMAD RAYYAN HABIBI ANJEVI', '24.2108', '$2y$12$SyTXt5cqx9/2t5VHGr8OM..fS31Za0rVroh01Eb7auNCiubI0d3q.', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:12'),
(77, 'Muhammad Rifky Anshar', '24.2109', '$2y$12$oai8jfp7tRbuS04XDuADzuoAE3c4nLrRwZzja2ShLhdtF2B9w/7.e', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:13'),
(78, 'Naura Shakira Mecca', '24.2110', '$2y$12$fmx2W6lOTtRGScA5PCOIq.GNauckt9WtMotBvI6U1fjX6cyUdautW', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:13'),
(79, 'NUHA ZAFIRAH SYUKRIANTI', '24.2111', '$2y$12$V2E6Wr72B82mDIgLUswaCu8K/yJQIYwfLlGI2PCq26WT8nQf17fqu', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:13'),
(80, 'Putri Haniyya Qanita', '24.2112', '$2y$12$sdgGuv/hEmSq3yqQD.wubep0AREPLFcoo8ySHW.4t.1lTuwMsW2P.', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:13'),
(81, 'Rafania Sheza Rasyidah', '24.2113', '$2y$12$oTJ2tuNI4p4RUuVAgQq3lei0fvf59O1RoHB390RHjJ/zLt4DoHgYy', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:14'),
(82, 'Raffasya Alif Nugroho', '24.2114', '$2y$12$RfaR3rsHjGaW622PhPPRbuxsmySyEkHyFbio7.kfwh2K/NJQao6me', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:14'),
(83, 'Rayya Adreena Mecca', '24.2115', '$2y$12$dSw4vS0iNgdpGyD6h5yv..EvQ2XLDhkJx1M91Ifwq6J3QlEuaC8nC', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:14'),
(84, 'Reyhan Abdullah Alfarizqi', '24.2116', '$2y$12$3RObdJzCyPvqUeZQ/DhkbuMpgFk4IpZGmucvfgyin883S1xqFPwPm', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:14'),
(85, 'Roudhotul Jinan', '24.2117', '$2y$12$xkxIMMoZs/.tH9f9JjgwteI92MxqhvGXB4S2iRPdOV2xUkbN5nNT2', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:14'),
(86, 'Shakira Wakid', '24.2118', '$2y$12$YIxbAd4hbDGr2KRcbROwA.p4/XvbsjRVX24Q8eAxOFW37e4clTWA2', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:15'),
(87, 'Tanaya Qirani', '24.2119', '$2y$12$GWvqp/ed2AEnlc80W.3zCuO8UyrAiRf5K.cUUIFF7dyTWDYPtNtDC', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:15'),
(88, 'Tengku Danish Praditya', '24.2120', '$2y$12$NhWzaov5KLT00CIJslBemOID9YFPRDyZQA1jlU9dx50cVDqhV7Cba', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:15'),
(89, 'Tengku Muhammad Fayyadh Azhari', '24.2121', '$2y$12$7wQURuHurxO6AT5oXHJXxuAVUFsxUa0QDHmHfW2afsmrtscbO3Nbi', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:15'),
(90, 'ZAYYAN KHALID RAMADANI', '24.2122', '$2y$12$epeo6YZ1A7ErO3IYeFYe8.GGAh3euAYELKiLACs3kNN6J662bjfdS', NULL, 1, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:15'),
(91, 'Aathirah Haisha Hanum Hanania', '24.1968', '$2y$12$4I1qCfaOG3K89Z7Zh0bVaOLLrQTWlLn/oLp1PyHyVw.QHrTyHie6q', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:16'),
(92, 'Abi Al Fatih', '24.1969', '$2y$12$gRYULKeirsMFjLrwvPIlQu6CtGWqCATB41F9tgi8AaET07wF0A8IS', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:16'),
(93, 'Aditya Rifqi Pranaja', '24.1970', '$2y$12$RNEr.tr8pp5ln/1/Kw4hFOCqJlybXqTHldkRHj8Qh1t4qV3yMC0E6', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:16'),
(94, 'Afsheena Aseqa Harfie', '24.1971', '$2y$12$ktWITBGsAzgY5pF8e0dNmO8eo.tejd2v4R2/HGrAH9ZVUHUt/r5dm', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:16'),
(95, 'Afzal Alfarizqi Mangoting', '24.1972', '$2y$12$5KbGbhXueB1HPK.KvBkNseJ89Ra4KRuBWCHQg/vWnuD/d6eOwtWeO', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:17'),
(96, 'Ahmad Ishaq Putrac', '24.1973', '$2y$12$BRv5BOmK7Y.EEX.eGwYnWeUj0kKjlbmkC2USI5Ce5ehDDsXhMOkoa', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:17'),
(97, 'Alesha Shahia Djohan', '24.1974', '$2y$12$27PWxtChZIsYt.LqafOQNeTld0AJByb7UOO4ce.SA/CetDu8xnPHW', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:17'),
(98, 'Al-fatih Syahri Ramadhan', '24.1975', '$2y$12$8bL1NVUsd7DzQ/iHd1pEvu9dAzOACEytzVifEGebPR9DYz/MkDpzS', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:17'),
(99, 'Alifah Rumaisyah Adreenan Dlt', '24.1976', '$2y$12$ZCmviXmtg3C./6S2qOplPuJe74arN2pJj9ApLbqn9P9C3lILVaqA2', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:17'),
(100, 'Andi Neelam Adzkiya Putri', '24.1977', '$2y$12$kt5p3d9zc89NH8lzlApciuUDYZev/brjQW4Ebexir3jaGTlSQScSG', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:18'),
(101, 'Arjuna ahmad', '24.1978', '$2y$12$OEf8uKkf4zbDFGnjHxeVTufLjXbxqxHDwrLDIc4QeiiU14LNjokCu', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:18'),
(102, 'Aruna Sachi Kayana', '24.1979', '$2y$12$gw1uuo6ej12TG7kZ92qnoeuh8tBJ.V8c.vW1/qxcfl.Mcc5Lnpr.O', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:18'),
(103, 'Asheeqa Alayyra Ari', '24.1980', '$2y$12$apPvfawuEkvafXVRW3Gd2uh5rGCis9cGVTw7hy7jesZshmFH8yVom', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:18'),
(104, 'Ashmita Kyra Firnando', '24.1981', '$2y$12$6c2xMdfi.SRi/TQM3NN9ou/WlIvP7n0e/GpgQ8GO0wALG7nIuS2qS', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:18'),
(105, 'Altafarrel Rahesya Hervint', '24.1982', '$2y$12$ZrsXr0IfLnkuLswXcaD9QewLOgaoJxmE6OB/WxeWdUGbhbGpBVO6q', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:19'),
(106, 'Ceisya Almahyra Putri', '24.1983', '$2y$12$syPXtM0xyYB4Vf3PPJ1haOx/ngM7k2AX8JEMkxEFs59s71j7Vp8OC', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:19'),
(107, 'Dina Ayudia Sundoyo', '24.1984', '$2y$12$Ro/AVi8rMF3F7Ib6MxZGpOWmGvYEdtlv4u0MZOOKF/OHUUylKowl2', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:19'),
(108, 'Farzana Khalishah Sabhira', '24.1985', '$2y$12$.L9tYd2/Sm9iYlR5ghGswOoKnQlU0tYzofVrGeT51h31DI3Eu6CN2', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:19'),
(109, 'Feisya Farzana Al Anwari', '24.1986', '$2y$12$sGMlcOEAcFxzN5DATzScUOoMYdPex31cfML5DOEEP/qUunEVJJY7e', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:19'),
(110, 'Firaz Sulkhan', '24.1987', '$2y$12$aLcntSnVYjydnsbqCSXmf..Ogn5J9E83dqoJ.HuxMnTtdNE1FRfj2', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:20'),
(111, 'Hasby putraevry', '24.1988', '$2y$12$N3MCbwZ7D0dgBs4h2flIV.vu7vShPx3hr/JuUj.bpLzrQcWQUVAty', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:20'),
(112, 'Khalif Farisqy Arnes', '24.1989', '$2y$12$YxTiIjjOix.sO9bnzZt7I.2bbGWaP7wdkwYSaPkkRK67N2GR5KIUO', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:20'),
(113, 'Mecca Mutiara Chaidir', '24.1990', '$2y$12$j5SHtOpSBgWls3/98AuIw.oQy6huxombMWYKMLkVBwZDgsnZlyf6C', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:20'),
(114, 'Muhammad Alvarendra Athaillah', '24.1991', '$2y$12$Iouys2QHYkyXK.ZQzthEXu.2fe3MZ/FFDjP/XN5kLjmWZUrw3fevC', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:21'),
(115, 'Muhammad Arsya Malik Nugroho', '24.1992', '$2y$12$3M5QP/qQs1UCs9PFLvrMj.BtU576v3L3iHa.LMdjF3IQsJns3lREW', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:21'),
(116, 'Muhammad Ferdi Abqory', '24.1993', '$2y$12$n5VRbtwHhUmCm8XbwW9XyO/IUZQE6J6zCkvi4.gp7wsBVDslRNlp2', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:21'),
(117, 'Muhammad Galang Syahputra', '24.1994', '$2y$12$yitmGik421a1eP7QqmD63O3yAD28fy9UBYKdBVZcbROUyPP6FD9oO', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:21'),
(118, 'Naureen Afsheen Ihsan', '24.1995', '$2y$12$mOAx2.YutiePXdZW8rxxLeHg4ITbwfhsshSrWHYKi1Z..1XS43cq.', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:21'),
(119, 'Nesyabila Putri', '24.1996', '$2y$12$7y5L8dsrUSczytmcqOGK0.PDmwKGdH7ZRjzZYy1TJUT8Ia9bJzzIe', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:22'),
(120, 'Puan Aurora Lailatul Qadr', '24.1997', '$2y$12$LVs6ukCP4qoU2uBTyNUBN.kMVMgImWq8ICaJBEcueUCbsaO.z5m0e', NULL, 2, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:22'),
(121, 'Abdillah Arkaan Alfarizqi', '23.1841', '$2y$12$HrGHSWRV0ciwV5Ub24Dsmew.kOhV73QthjgUPaLO/4CawEUiA12DO', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:22'),
(122, 'Abdul Aziz Ali Hasan', '23.1842', '$2y$12$IFUbqzlFeo/riymMLNCTdetQ3eNNAX5.ryCdaR.ZMMxKsp8yNc.c.', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:22'),
(123, 'Abdul Aziz Ruslilkirom', '23.1843', '$2y$12$lAZJbbXdAJW3kIogHmMeGu0EveWPaxm7tqdmzFL.35TBzRYzLRhHq', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:22'),
(124, 'Abelian Naurasyafa Prasetyo', '23.1844', '$2y$12$qLzYWlEqsVK.7LlNYcoJ4.HfK3eVZtm0/8TFUwYkke7U.XWCTelOu', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:23'),
(125, 'Adam Rasyid Azzaky', '23.1845', '$2y$12$XuRmyjkxETZwZy9cCopH0eOUCqenMGMQ/XOeLDt/onDcg20EY/ULy', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:23'),
(126, 'Adiba Shakila', '23.1846', '$2y$12$9Swm87dLUSn1J/RPGU7X.e3TEMvNeikVbnM9ErQaxsaV287jiNnma', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:23'),
(127, 'Aisha Zalea Septilia', '23.1848', '$2y$12$Rb.0h5Dl6UkACrhZyUyCSO5yI4gHs0SNYHSeTnKgMBfMkmG5d7r/e', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:23'),
(128, 'Aisyah Silmi Afiqa', '23.1849', '$2y$12$VWqJEJrw/JVQzgFyKCQlE.pP1dFQaut5roPU/Au2susKpg8/sHXue', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:24'),
(129, 'Akhdan Albirrohman', '23.1850', '$2y$12$qbibXrsoUsLPXyBbYCgPYemUSwS8FiQglsO79d/J.EnOYF5UxX9WG', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:24'),
(130, 'Alifa Hibatillah Zulka', '23.1851', '$2y$12$TkepIowG8olhs6TXj4tA7.vyIbnBu3Z9Q3PvN/t5kpdxzdGxZCo.G', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:24'),
(131, 'Aliyah Razan Fazilah', '23.1852', '$2y$12$EofbqSIrC81ltmsH1Znjr.nPOZ5J.okLWLtXjpQuVg25oRJHM/jW6', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:24'),
(132, 'Alvin aprilio', '23.1853', '$2y$12$EV0onzi0ElRMT9DXs9OECOL3pF3KkQc6wxtIluT2tjm1AcgsWO.C6', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:24'),
(133, 'Andi Muaz Averroes', '23.1854', '$2y$12$P2v9FuLnBdVUEu9z.nESI.s.FGHoyznKaDjTHdTJK1T6MZ3ghBWSu', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:25'),
(134, 'Arsyila Madiha', '23.1855', '$2y$12$urcgmV6pqwanwm/atR/mU.Z/Ixi5bC1ufC7UrX0Cg.Wvx5V8Rvyha', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:25'),
(135, 'Azzahra Rizhani Siregar', '23.1856', '$2y$12$2ieWeHghEBV5aqQUwkLMXeEWOSR9sg2yI3o6LzkMIW8jBw2RJRNt6', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:25'),
(136, 'Dhefin El Fatih Vydi', '23.1857', '$2y$12$2zz/kKSCxF1Ee/Gzuw/.UulRr3e5agQSbwaxM5utsA1tnPO7oQN62', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:25'),
(137, 'Fathiyah Yasmin Abbassy', '23.1858', '$2y$12$m6k3ZMi93rI30jQnKcyGCeaDSh51qdKLBwHlGbeYk5Vl//DXKkHfm', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:25'),
(138, 'Humaira Shaza Aqisya', '23.1859', '$2y$12$k61hJ.TBIvsOh0kgHbGL.uxADU8rNvl1WfHl3/2A3enCe4uB12c/y', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:26'),
(139, 'Irsyad Keitaro Digunov', '23.1860', '$2y$12$AbY7/nJgVnhwY1NNZK5mE.9bx.jJ4ixkga16itLQ8js3lWUHc8F2.', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:26'),
(140, 'Khairunnisa Tasmina Yasmin', '23.1861', '$2y$12$aofR7TMzNdbSO1iya3Hxn.aaOjKimY/IYz4Yaca6MStJEMXtx5vcu', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:26'),
(141, 'Muhammad Afif Gani Putra', '23.1862', '$2y$12$DLRNCMJARao0vrAPoZDx2OQas7LNLWkHBNOYEVf4RV/0Kx.H3yiiy', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:26'),
(142, 'MUHAMMAD ALI TSAQIB', '24.2092', '$2y$12$1gZm/4yfTHojmTCKpugiMuj7aOPDO9Nvbc3gEw3UU4qH/z9UNvWV6', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:27'),
(143, 'Muhammad Haziq Zahran', '23.1863', '$2y$12$cAA0trCJNcn2nhV4PhC6iOAGaT5/ZFMVs7d29fIkQCr8oQB/Sl1TW', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:27'),
(144, 'Muhammad Reynand Ritonga', '23.1864', '$2y$12$TIBgVK9z4tY0Ef5hMamzUeT4xZ98mpipnqjkl7RApVwzCn9p9AFrm', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:27'),
(145, 'Muhammad Zaky Al Jahidi', '23.1865', '$2y$12$D.hBokZPK8GtWqbj7LghU.Y78d4aWpHHGGsvqgthFPNWFOKZ1fRjK', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:27'),
(146, 'Nyimas Fakhira Nur Izzati', '23.1866', '$2y$12$YdeT0Xhr98cVcOVXeOqhEO/L0g.cT79JGLb1staEMU/vYNrBm47dC', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:27'),
(147, 'Raisha Ramadhani', '23.1867', '$2y$12$RSFdOS0hJuO.OurH1wL4mOn8pXFpsn2SVePM5nYazf9NGw2bQQuye', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:28'),
(148, 'Raisya Kamila Cahyanti', '23.1868', '$2y$12$YXNHsHLXPdjmx8u/xrJDEus2U8vriKB64pSAwg1SOUNNP1mEx7QA6', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:28'),
(149, 'Yahya Abdilhayyi', '23.1869', '$2y$12$uPo9Oxo8TEmiqHtFAVyDqeRXBDXnejFEWOFAOQOnWuRe8wb6ZpUQm', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:28'),
(150, 'Zafira Athiyah Zulkarnain', '23.1870', '$2y$12$Vm5Re1mYTbYLlBBD2hGLQeTL6L6YS7uSgN.MrPjv391UMs1m2JDLK', NULL, 3, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:28'),
(151, 'Adella Putri Hermawab', '22.1718', '$2y$12$kvMnxi1aEjX8y8lFcjalcueaZg1KlR14TcbW3hrCefS1CG8I31NWe', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:28'),
(152, 'Aisha Hanna Maheswari', '22.1780', '$2y$12$ysuEAvrcMsrbkFeVZottZeO3WthJ3JZ2RYrwATbbvm4tJUP9t.7tW', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:29'),
(153, 'Aisyah Ayzzahrah Satrya', '22.1725', '$2y$12$9NfLwV4RwEXctUAgQOSa4.GHH2vInGP1scK5LJ3vknKS/P0LaiBAu', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:29'),
(154, 'Aisyah Nuha Zahira Ibrahim', '22.1726', '$2y$12$9gyQDqsCYAQrxZiODKC9jeHxKE3HLYOj6gkwJuigsTocR7tX7lci2', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:29'),
(155, 'Alesha Difatri Orlin', '22.1728', '$2y$12$VUwO3TpqBch5M.iFE3OnKeSmYtL2GTwcOjY8FWdhel4kn1Zc0TOki', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:29'),
(156, 'Alina Ziya Abidah', '22.1784', '$2y$12$Sg33h30l.f7rLOUDA.sujugdynX79rwCCBMueQaAU0aC/ap.nSRLa', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(157, 'Anisa Istiqamah', '22.1809', '$2y$12$jPVS3hLE6TYRX6JQYEbrUeEChYK3xIkDGK9Dqt0KToeVSUV9dFTOC', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(158, 'Annisa zhahira Agatia', '22.1730', '$2y$12$G9kU7rhJD7.nvYHVhw77COjzSqSi/OBVZat6VU8aEHWyPZYbYIzyy', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(159, 'Arsyila Adini Ramadhani', '22.1788', '$2y$12$zq0dD4QqG1waHFNmxjXMG.6OQpUABhMqD/67oVImQ8ZtHJa7fD1um', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(160, 'Askanah Havika Addia Putri', '22.1789', '$2y$12$UGq.jdgKeFFy6s8Sz37mduUT44CJZQVO1r0EX8tZXnrTnbbWJDy12', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(161, 'Aulia Arsy Azzahra', '22.1811', '$2y$12$daKKUPTi0oknkWiW0AEkqOZNnuX23J5nDPnZcrV0f8HHirARc6FvK', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(162, 'Chayra Almuna Qotrunnada', '22.1791', '$2y$12$UU7FPrQinn0jOxsWstt6D.0NIcIly5d9Hf7NRVJnN9D3tAPMPRuza', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(163, 'Dzhiwi Naufalyn Maryam', '22.1750', '$2y$12$g8OSWakJghPzgpi7CK5Ha.//u0x/jSNxNZtR9DwPLwz.rxfpex2ym', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(164, 'Elena Adelia Syahla', '22.1751', '$2y$12$g3CDLnQUO6mJ0imm2Sg8AOGMi.Y/8aUUqTl5JHPB3zmHMUxd6XKf6', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(165, 'Fathin Amirah Lathifah', '22.1736', '$2y$12$A94Y.ZgpL9mRp8oHrTohs.Im1kHSpMvOHkb7PMNRzsT7FgOI5614K', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(166, 'Hilya Humairah Bages', '22.1816', '$2y$12$/RbUuAMOlGlLvRksFSlWkuVdCQD3ENfcw4D5K6Nanv3zM3bM/GBa2', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:32'),
(167, 'Kamila Dania Mumtaza', '22.1755', '$2y$12$A5/N0LCHddvA0KtNZzRLyeUIc0IapMtRFoViggzz/z.wqbwfGmz/q', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:32'),
(168, 'Khaira Yumna Fariha', '22.1818', '$2y$12$XkSvSjqtyNbIVEXyfBNa2uuYOL/LkmowPr3Ef6Q20aaXw05FfQFFK', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:32'),
(169, 'Kiara Silmi Fatihah', '22.1819', '$2y$12$Dklsllk824EBi0KZlSXIZ.x6S3jvBO2U3tJVW80MipmKsOw.PMUdu', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:32'),
(170, 'Marsya Ayu Andini', '22.1822', '$2y$12$f58DV7Eoi7/r1YOj4vh59eL/qDeoZvMMI0Aou7S1D2ZZoj04aea0O', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(171, 'Nadine Queisha', '22.1764', '$2y$12$9Tp0oBC8e3ZEAjlqlSpzP.5LHGavsk9gWiB3M5eBUstj2j65UH2Ke', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(172, 'Nur Ayudia Azahra', '22.1766', '$2y$12$8Dg8lahQQwLzA9pf01MQ.uAbChR9vPH5WUr79rgQfW/M7b.O79Kpq', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(173, 'Shaheera Zevania Wijaya', '22.1803', '$2y$12$D.QpfLU6AehJ.w0XE6HBPuakb5SjQEovcWH267SSjGbUs30dB20o.', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(174, 'Shakila Azka Tanisha', '23.1964', '$2y$12$n6OvCNZO/oB4GAot/SUByu9hyntZggb3negSkCu/nNYcyVvSorR6G', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(175, 'Shakila Lathifah Putri', '22.1775', '$2y$12$rnZ0XnhsHxqfp4BC4Ts.IuHO6ykONvvMCt8OQNLSpyFaF3D7ES31W', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(176, 'Syahira Naladhipa Arsyila', '22.1836', '$2y$12$AByXtsn1y.ff7VI4A2FcSOSdpR5x73z/sAF63kMofMFnnZAkJ0QpO', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(177, 'Vadelia Adeeva Inanda Purba', '22.1806', '$2y$12$Kw2lqzuNBIvOWqL4r6T53erK.wWD7af3ygyUVUsfRPrVEDvDbZ4c6', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(178, 'Varisha Putri Sulistia', '22.1837', '$2y$12$.GDzmNqrEFc3Shstki1SxOZhi.QfvW9zm.uxyqUs42JHzZNhxNx2a', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(179, 'Zaviera Ayudia Inara', '22.1807', '$2y$12$Ddsot7tGaHsbQi0q7U5Mvu/BNYi0M6DH4x94u1tWQs3bInKU3s3Fy', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(180, 'Adalyn Myesha Zara', '21.1577', '$2y$12$yFivLGEy/LhpNIxxOPFol.PaSXMokyVFr.iXzemZlwEoRd0ysdwni', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:35'),
(181, 'Adeeva Khoirunnisa Rois Kaimudin', '22.1713', '$2y$12$iKcfa3SyQCRccjUsESQ/qeHkdncKbnWRGXdnITcwFdnEsJmgchjfa', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:35'),
(182, 'Anbiya Khaliluna Neldi', '21.1671', '$2y$12$m/VOj2/18N2phQ5rQCxquOSD9TwdHzc8WeuDaC065mnxy0pugMoxa', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:35'),
(183, 'Andi Haura Amatillah', '21.1639', '$2y$12$odbaxVf4ZjzdFWmukPWr9.6s9.WLwD/mQNC/DIhyNILffbvTZ0V32', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:35'),
(184, 'Aquina Naima Febriawan', '21.1640', '$2y$12$auPWfXuiX1K9Eeqi5Og8MO12gHiq8fSGYxUyFBD74n8QjFzJwiPqK', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(185, 'Ardeeva Myesha Zaviera', '21.1611', '$2y$12$8jDtafzM7Gc14XBR6mCNZu3tCsJQmoHdGVSJhQBAdZ0yV7bYg.Tu2', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(186, 'Atiqa Qonita Hafizdhoh', '21.1641', '$2y$12$HPpYzUMbUZIhdtVSnvdsNezN9tw914SJg3jSq2y6bjv58BH2aPGtm', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(187, 'Bilqis Kinanti Golfany', '21.1614', '$2y$12$9yAeYFBi6.hkM2GuPx8ur.1e9JqTDfjY4NaNT1rA7zwPou0VcbNba', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(188, 'Caitlyn Myra Arsa', '21.1674', '$2y$12$G/xgs8lDAA925WyxS01RleYKF.Z9EaIySXmEGrQ3GZ3fiJjLqzXqe', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(189, 'Chelsea Maisyara Salsabila', '21.1586', '$2y$12$eWKYgVJDfP6OxEFKsYxM3ekX7z3s.RNE/tTPnm/Dg0gp/EBPaVjBK', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(190, 'Dalisha Ceza Nuria', '22.1714', '$2y$12$S8K0KU.HgWsjXdF412z5OeuL0OXXfP3VcxtFZnY3hS8/cfTy1b1vq', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(191, 'Diomyra Faqihah Karimli', '21.1588', '$2y$12$K0M7yj05ZqgvcqD9JgyU1updLDv1FdL3Rgfgp/pTYWUvVYDetXBQC', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(192, 'Farraas Alaa Hifzhiya Robiyan', '21.1679', '$2y$12$PpvY3SuFFS6LjoT/iuwXXeOOZFhrGR2k.136tVNpGUkTgz9iz6YcO', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(193, 'Fatimah Azzahra', '21.1681', '$2y$12$H1BMuCnzWY4VxwnEj4FjyOJpOcOkKHVODx6ci2uFnsGMVDFJGvKTm', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(194, 'Fildzah Athaya Rizal', '21.1590', '$2y$12$HAVAb1qC8JKOQQyiRkbzduMgvvrJqLxBKpqkueRxNdlIA1aALGVdq', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(195, 'Fionna Amira Salsabila', '21.1620', '$2y$12$kexEm1/J1Dtndy7SVZzn4uclDpBVS8cEHq6jlO08i/xF0YvZ0Fb6K', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(196, 'Hanisah Alifah', '21.1682', '$2y$12$uFt4.fE2kng/tRKDvnvsleV.Ld5Is1ooFFzzRTX/cyYRxxSQqZ70m', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(197, 'Hilya Nur Asy-Syifa', '21.1622', '$2y$12$9bxIOnEtccu8g2N1xmvZq.eHEhc4SymO96crFJK8RG/53H2IwuUFq', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(198, 'Husna Hayuning', '21.1651', '$2y$12$y.yc/w8Be87DcAeWye3OLOXAZhtbMvsa641HlBApOeQ84UqiGdDDe', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(199, 'Khairunnisa Safwan Al Ghifari', '21.1685', '$2y$12$lgt/v0qferglevtqfM4.meevGuoKGVe1YmUWWOd2nFcyJasQVotiu', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:39'),
(200, 'Malala Mysha Marauleng Pawara', '21.1625', '$2y$12$E20LbmrFtyIXa3uEuew.8.4uOWMM2A8HwS7TN5yZOpoe18bYGjuuC', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:39'),
(201, 'Nabila Nuri Syahira', '21.1631', '$2y$12$JgmuvQ3iX.VUJb35BiA7BekTnrjz5EOLGS0ZI/lwwGlUIMSBI0o5q', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:39'),
(202, 'Nadhifah Alief Dytia', '22.1962', '$2y$12$S51DSjWWFBAAqlLvoyKy9ulWOyLVrQ3dLl.r7KLofZkX78nPDG2Q.', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:39'),
(203, 'Nafisah Putri Qairina', '21.1662', '$2y$12$.1qOvK6RF53Z9UzSvOey/uaxueJ2YOWeKfqPbmNIG1xyExUb2KoFu', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(204, 'Putri Erina Zafira', '21.1601', '$2y$12$28R38z.fKFiMEbo/.P9F8.8nvBGgPgYP8./4vkyw/7NHpf6hbFSC.', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(205, 'Rainvalov Adirah Queenov', '21.1695', '$2y$12$qqWmctnIsybxZn/J38plquTI61Qe1uOChUQHJo0jvAdbNwMf6iRCy', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(206, 'Raisha earlyta shaki', '21.1602', '$2y$12$XlfQqeTT20BP6lqYSb.H3OhVCBR1zzRDErQDWA8RFPKl6P6z8bO5a', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(207, 'Shanum Ranamia', '24.2091', '$2y$12$2cKsHM9GPEggwJCcC5mbW.1mhXdEcpgFsvLU/3MP9ahX0Q.LNAEQ2', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(208, 'Siti Hafizhah Sahra', '21.1603', '$2y$12$28IGMoMI8OnL5lOM0J0Qp.yIsYyGlGsT94Q/dW0DwIO1jsXrJc4gy', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(209, 'Sri Ufaira BilQis', '21.1699', '$2y$12$zQCixeNY9mqYDE46QUN4qeYJx0rU3xrOWpYcgUx99e6.dHtidemx2', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(210, 'Syakila khansa Rafani Akbar', '21.1605', '$2y$12$HqlBBZ9VxzllgCF17MfkVurjjmcf2ew9uYI2jRG694tzZdpJHIaUi', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(211, 'ABIDAH FAIQAH', '20.1477', '$2y$12$wip5ubVCb/xaVI8ZiC3C9e0fVbxrkihZzcC0obwhK/bbQPRU3DxJW', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(212, 'ADZRA KIRANA', '20.1507', '$2y$12$nRBhLcWzySPpsUBuJAjtM.8iiu/6aTiBtdY0W0tjI5hahrGjlWXle', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(213, 'AFIFAH BALQIS AZIMARSONO', '20.1446', '$2y$12$LI2OtRwMNQFF7MQYmDlqNeM9rLd/pD5xVfJC5XN1v8Kb1vmegeJ9C', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:42'),
(214, 'ALIFAH RAISA BADRI', '20.1447', '$2y$12$B7RcM9pvAlbNvoyTqv59fuXfvO5xwTA25zXiX9k2saP55e/30ZL0O', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:42'),
(215, 'ALYA MAHIRA HASNA', '20.1481', '$2y$12$vnG6nh4wKVtPaXZNkWb5S.j5WcxIUWoRXzRioWWndMxwMLmiiNfjO', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:42'),
(216, 'ALYSSA NAILA PUTRI ARIF', '20.1541', '$2y$12$SNmMf8LyCU2U78N7XBYaOe0rU9d1GTcmWNNffZtRJOWzEhPVg6qbi', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:42'),
(217, 'AQILA TUNNISA QARIAH', '20.1448', '$2y$12$0RyWRCJeRovIx3SC247RyuxnMWKZLv.69Y8cOxZa3uGCIbM3.CdqK', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(218, 'Assyifa Sauqina Pranajaya', '22.1960', '$2y$12$1WpasabV7R0kMlI.zpfQfea22r.n4VTD9d2PyErkVhggUrOjH6UWS', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(219, 'CEISYA DINARA ARIFAH', '20.1483', '$2y$12$nzEHQPd4rd8cHCu6OyDXhO.mDkyNA/gw8gZJ1xV6UOeI7FCpxphDq', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(220, 'DIANDREA ASFA ZARANADA', '20.1516', '$2y$12$xQQNsza69nKgO3TeDOCXxuqdbpvbCLoGRsRrkrl1qaHJaWRxBfzfi', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(221, 'DZAKIRA YOSIKA', '20.1545', '$2y$12$OEDXEGfIoxbwJE/zVPyP0uRBl2H8nFMLlhLwdZwkLICDhYGxR3/FS', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(222, 'GHOZIYAH JILAN SUCIAWAN', '20.1486', '$2y$12$10C9GwUb/jsru62kTPl33eGpfqzu6UITfzb.B4PC3bc4EBXNO2kmm', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(223, 'KAISA THAFANA HARAHAP', '20.1458', '$2y$12$kdXcCmMoYdBV8UJce3Ig.eoKQ3EDn.l4OFxo1jepYMiSkt326kqbO', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(224, 'KHANSA SANIYAH', '20.1550', '$2y$12$sCbbYntzX8V5ZFBYIDhADu5lRIkKuxOVCh/umXxTgf0i1kCHal2Se', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(225, 'KIANINARA QAIREENSUPRIADI', '20.1524', '$2y$12$Z8EJkbw9FBjaLkl1TiqlKOmwAKuoEwmDLbJduJ4cuzeeir5mUV0cC', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(226, 'LUTHFIA ZAHRA THALITA', '20.1525', '$2y$12$S0FtIhvdn2EJshSKSPTbWOXXa6roxGsokgNYPlCATJdo7ZH/MzctO', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(227, 'MALAIKA NAFEEZA AL-KHOIR', '20.1462', '$2y$12$USWGGCL.YHNMyAFILZMnxutKE7iZpJWgTBQKf5EKrsCX2wpg8pBjy', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:45'),
(228, 'NADHIFAH SYAKIRA QUEENSYAH', '20.1558', '$2y$12$2Z5YHnFuZ/EuOyv0SlWonucOfTcPtesu2LWtk6RC7DMP.IkrQL5be', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:45'),
(229, 'NUR SYAH MURNI', '20.1561', '$2y$12$016.w.cQ3FF2f5MJlJOFlOmTcwiZiYR7ONWENglJ5B93CHX8V.a32', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:45'),
(230, 'NURMAYDA AINI DWI PRATIWI', '20.1529', '$2y$12$eBjK7ukRykn1NBMsSEljmOopSmltHKid3FujTvGXnNi6Kd8ImwuxC', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:45'),
(231, 'PUTRI ZAHRA FARIHA', '20.1530', '$2y$12$foAimSvXk87XVg6iZpVa5uu0WBgXfnrL7vvA8N6tI/PJTAo3Xv.py', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(232, 'R.FIONA TRISHA MAULANA', '20.1562', '$2y$12$ccUFASlEWyLUXvbpIZw6U.7phP8rAnZCrIwdpNIUbKmX0S64iY/RS', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(233, 'RAISA ANANDA USKARA', '20.1564', '$2y$12$09c0BTeAEJbemnPiL2CoUuvXOcyt9bGGI2fSu.b.2HPO3a5d85.eq', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(234, 'REVALINA PUTRI SULISTIA', '20.1472', '$2y$12$3qK9FNALLPyb3qU0DeS03edpVsHfZOyGulbOg1jSsfCJhCv2uY646', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(235, 'SALSABILA AZZAHRA SASMITA', '20.1502', '$2y$12$uDnFxLS6RGqYxIWtcQcUYudIU2APW3WzdMmiW5VyitdQFy.pyxJuq', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(236, 'ZAHIRA RAHMANIA', '20.1475', '$2y$12$MjV33dwLiFBryjCtdlq0JuBkJti6B4.G3nfjZSJOOGbLb5Ra1k9DS', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:47'),
(237, 'ZAKIRA TANIA RAHMADINY', '20.1535', '$2y$12$osotOw9j5CvazOjRm8uaGebFqjr3lRFXsd.J5OJQkDPWLqoVXfXVy', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:47'),
(240, 'Aditya Pratama', '43434', '$2y$12$6HeGQTnB5DNb0YsFsoeCrOyxRZWGb6bcBvyNLUtBp.aSDxI540z8m', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:21:44', '2026-07-30 01:52:47'),
(241, 'Bayu Nugroho', '2026003', '$2y$12$h2UGTtN9e//qVhWlpX9zn.98DqTqAm24kz2hQgXtInWTI.EtF1uD.', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:24:45', '2026-07-30 01:52:47'),
(242, 'Budi Santoso', '2026004', '$2y$12$7f1iotL7HqjmNPLWwuzn6.4xiiuoRGXhdZMx.Xfz4h73JAmwSMJqy', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:24:46', '2026-07-30 01:52:47'),
(243, 'Catur Wibowo', '2026005', '$2y$12$LIHWWxKedkUT0ig9SqoaSeXOxTBF/7zyWpXoMmMrcdu1UQgS6BesS', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:24:48', '2026-07-30 01:52:48'),
(244, 'Dimas Anggara', '2026006', '$2y$12$lQbN.DGm2L4duUKuJbNybuk.kA2ZK1v44pwonLM4fjk83ejpTQjFu', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:24:49', '2026-07-30 01:52:48'),
(245, 'Dwi Ningsih', '2026007', '$2y$12$oBWyhMiMLBB0hnfTzRGVNeZqXNYcpi5ZrEK0Wk5SULv5XRIZYjbQ2', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:24:50', '2026-07-30 01:52:48'),
(246, 'Eko Prasetyo', '2026008', '$2y$12$DNfOSd4L/k2vd8Q.7dFI/eDj.Xzn6b00k6kSZvdQEHIuMgyOj03Z.', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:24:54', '2026-07-30 01:52:48'),
(247, 'Fitriani', '2026009', '$2y$12$8bMk2p/togq/ivfiOUomdO1OKe3i5KB64hsES8WPiIl5.rVWNy29e', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:24:57', '2026-07-30 01:52:49'),
(248, 'Hendra Gunawan', '2026010', '$2y$12$LWZQLMd05quDyw9DH8JiD.xb6t.8pNZidp8j4U0FLRb11AyU/3DHq', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:24:59', '2026-07-30 01:52:49'),
(249, 'Ayu Wandira', '2026002', '$2y$12$HI3Vl1sIowKXDuySpmazc.Dp4GkIjUWiCOpvvD6zVZZtoXN4WiK6W', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:25:01', '2026-07-30 01:52:49'),
(250, 'Indah Permatasari', '2026011', '$2y$12$8rflxyOc5gICOMcnGOHTIe0OPVmryD0zZyklZFzFtJi4hUq0v6JBe', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:25:36', '2026-07-30 01:52:49'),
(251, 'Joko Anwar', '2026012', '$2y$12$vjhc8q4wvKqT8I/BNV9C3uUCnp9sjNiNdBjopsrdRKCm/3gwoSgxS', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:25:38', '2026-07-30 01:52:49'),
(252, 'Kartika Putri', '2026013', '$2y$12$3.v.4L6cEdXlsVigfGzsNOWIV70IAtFR7F7TRBMvOAuZGLP6w.8fy', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:25:40', '2026-07-30 01:52:50'),
(253, 'Maya Sari', '2026015', '$2y$12$iN5RJA4P6xSoHOzJBco.seJ2SiXqD0EkUwUZEXwYqAbAy6xJvErz2', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:25:40', '2026-07-30 01:52:50'),
(254, 'Lestari', '2026014', '$2y$12$FkvEIDZPin2bmi9GqI6FV.uaGb/K2pu6tvT8SZGC6oekOix8hGMcy', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:25:44', '2026-07-30 01:52:50'),
(255, 'Muhammad Ali', '2026016', '$2y$12$Hl6Hn9OVLq12xV3m8M6at.aA9Y.NmmsspCgJwWtGpsag0A/9dLt1K', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:26:48', '2026-07-30 01:52:50'),
(256, 'Nita Kumala', '2026017', '$2y$12$erOt8s/lQHNml2vUbmT47ezfmngGeoWAdper5gsyF2X0QGI5gY2.S', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:26:50', '2026-07-30 01:52:50'),
(257, 'Nurul Hidayah', '2026018', '$2y$12$8svtqfgmxR30kpzdfZ/f9ux14xNKrjq93WM4nfVixKyFK7PGzQ4bG', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:26:52', '2026-07-30 01:52:51'),
(258, 'Panca Putra', '2026019', '$2y$12$xxDRY2qrdbkRZCgSXXoTHOuCV8gM.NxKw5XPqDfxVVb4rkaevkhXu', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:26:53', '2026-07-30 01:52:51'),
(259, 'Ratna Sari', '2026020', '$2y$12$5swVAoMoEw4EQn7dU9YOnuxkhFXX3cxHLN79naG0u3hypGRarUVe6', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:26:56', '2026-07-30 01:52:51'),
(260, 'Reza Rahadian', '2026021', '$2y$12$f7a3yZIgc/4/tSNWrf2tPeFAPTzot4IoeLusrt032p2.KNmaEB9/K', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:26:57', '2026-07-30 01:52:51'),
(261, 'Rina Wati', '2026022', '$2y$12$UecAGRHjL3GK8xClNxhuOOOXGxzpWZ46PhX3nbfL3o3yGsXvZVYZ6', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:26:59', '2026-07-30 01:52:51'),
(262, 'Rini Yulianti', '2026023', '$2y$12$BrYeT.FheX/Qj21VEOWc2.UoCgcNKOjSAjyT2BdDUd/hI45K/1SNG', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:27:01', '2026-07-30 01:52:52'),
(263, 'Rizky Maulana', '2026024', '$2y$12$MFNLJf96/S0b4W7HpMsPyuwBFSVxFYbDq5h5jHzmRcDYx.PGtQSRi', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:27:03', '2026-07-30 01:52:52'),
(264, 'Siti Aminah', '2026025', '$2y$12$elg8nEnIB/RBQnxuxH1E8.Veo6168fINq3uQQcQGp0lpwlHJ1fpjW', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:27:05', '2026-07-30 01:52:52'),
(265, 'Surya Dharma', '2026026', '$2y$12$8t0SmWkyyx1MMJDKyIeLJOmVqN6Te5oJgvsrD56QUXHEuLjIsrI..', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:27:31', '2026-07-30 01:52:52'),
(266, 'Taufik Hidayat', '2026027', '$2y$12$VHqzJ6tmejzIND1ScRkJFuwmqHyZ4FAO9Twnw3xh45oLJZnh5ngwO', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:27:32', '2026-07-30 01:52:53'),
(267, 'Tri Handayani', '2026028', '$2y$12$0gLYNPiMLUjMSMnyrTc4xuOcJe6afKvcchmmO2lQXJH47f67vVLKm', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:27:34', '2026-07-30 01:52:53'),
(268, 'Wahyu Hidayat', '2026029', '$2y$12$Kx57EH0DjMzcZmhaVV3rMelFADXYs0UtOIhGsc2EXKhUxovnF1pK.', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:27:36', '2026-07-30 01:52:53'),
(269, 'Yuni Shara', '2026030', '$2y$12$/h26Uwpeo6zSgpePbYKNgeF4pRCLxP4xyw1KDhDUkHxddukwfZNQi', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-13 17:27:39', '2026-07-30 01:52:53'),
(270, 'Joko Susilo', '2027001', '$2y$12$SYJTLFWRks6WL1x7arT1VO8rJGndby21hP5l55148AsngA09HQ0DK', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:00', '2026-07-30 01:52:53'),
(271, 'Kartika Sari', '2027002', '$2y$12$yhquZ4hFKucDN/Zh.bQxXOx/lJG.IZEWe8LJP6gpA..QX9pIvicTm', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:04', '2026-07-30 01:52:54'),
(272, 'Lukman Hakim', '2027003', '$2y$12$TfLDSLLpONInWgUdDcrLLui5rAcmr21gtb7yXVgbSGurg3XqO7mZW', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:10', '2026-07-30 01:52:54'),
(273, 'Melati Putri', '2027004', '$2y$12$1vDG3UY.aj93j.9nKckFbugu3kS7u04FdnC4cygw/CwhLYPWEi2OC', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:11', '2026-07-30 01:52:54'),
(274, 'Nanda Pratiwi', '2027005', '$2y$12$vlgPjh3f.6KeWsOeDwnmhOYSRvGDC.CejfS80/QhKJ4EJLQGn4.mG', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:14', '2026-07-30 01:52:54'),
(275, 'Oki Setiawan', '2027006', '$2y$12$mqHq/Hwbd5d4YXButmoXJObOfW4guns9cAwblV174/UbKzuAqtskW', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:16', '2026-07-30 01:52:54'),
(276, 'Putri Ayuningsih', '2027007', '$2y$12$CFCWC/DKayR/4E9JdhY2uem.PhEI55UNR0YtChufDptTBT9ti1Nme', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:18', '2026-07-30 01:52:55'),
(277, 'Rendra Kurniawan', '2027008', '$2y$12$/zcm48CnfeUB77zJCOKDA.RYFtAYxBjIToPXhCcYoyvcPQ2u6yBnC', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:20', '2026-07-30 01:52:55'),
(278, 'Siti Rahmawati', '2027009', '$2y$12$34MYS0RdGwwi3M4n6gwWK.S1AtH07wtqZt0creH9aj0YmH5K2nhiO', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:22', '2026-07-30 01:52:55'),
(279, 'Taufik Hidayat', '2027010', '$2y$12$HrNdo4/QPslTdno4snEBHelyk2sLopXtc7MFQmp5zJMAnZVHn0Oca', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-14 02:40:24', '2026-07-30 01:52:55'),
(280, 'Ahmad Fadli', '2028001', '$2y$12$MCZeYTtGA92oy1JFrvm7x.BYsT5iL.sRgyM3LHRx9Lwb2AA7P40YC', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-16 03:05:48', '2026-07-30 01:52:56'),
(281, 'Muhammad Alif', '2028002', '$2y$12$9s0.KFHyHNsv7T1zEJqfTOPWevYa1OaGnkxlHxi1kVg/ouHVxjF4m', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-16 03:05:51', '2026-07-30 01:52:56'),
(282, 'Nabila Azzahra', '2028003', '$2y$12$9WwM6A1Cb9KdKoS8PdTzG.uPRysODBBI5jZedSROqQyVPkWyPzk56', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-16 03:05:58', '2026-07-30 01:52:56'),
(283, 'Rizky Maulana', '2028004', '$2y$12$OFsd9.NuM0Ipy4Mn0JXYGOuU8qpvYX08g2vdByfhVid2PYLe4p4Ta', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-16 03:06:01', '2026-07-30 01:52:56'),
(284, 'Siti Zahra', '2028005', '$2y$12$W/EpQ3W2iNzvPzh4AxYP5Op9iHKtWp0AQcMClMmOniZEU74vy9DOm', NULL, 1, NULL, NULL, NULL, 0, 0, '2026-07-16 03:06:04', '2026-07-30 01:52:56');

-- --------------------------------------------------------

--
-- Table structure for table `siswas`
--

CREATE TABLE `siswas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_user` varchar(255) NOT NULL,
  `kelas` varchar(255) NOT NULL,
  `sub_kelas` varchar(10) DEFAULT NULL,
  `nis` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ppdb_id` varchar(255) NOT NULL,
  `nisn` varchar(20) DEFAULT NULL,
  `is_processed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `siswas`
--

INSERT INTO `siswas` (`id`, `nama_user`, `kelas`, `sub_kelas`, `nis`, `password`, `created_at`, `updated_at`, `ppdb_id`, `nisn`, `is_processed`) VALUES
(1, 'Aditya Pratama', '1', 'A', '43434', '$2y$12$mjLTDOU7I76tEFT9sUAvce2GLwSyuHfEdBe8mvNa8Q4I42HYhE4MW', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-001', NULL, 1),
(2, 'Ayu Wandira', '1', 'A', '2026002', '$2y$12$dV6qwi4Zx2phD.M72rja.eTkN0Qi0mdewsvlGYLNVfxWqyc7ID.4u', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-002', NULL, 1),
(3, 'Budi Santoso', '1', 'A', '2026004', '$2y$12$7nKcQuQVxcv5I.gEXEL0Z.Ns0iT86oiAvJu/GGsiPzVB1bPEUQGgC', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-003', NULL, 1),
(4, 'Bayu Nugroho', '1', 'A', '2026003', '$2y$12$h3RjgPRKwYkzXsPGSzDNsOUnF0Eg3V2sT0tDz4dlwq.nNZ3uN3/4K', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-004', NULL, 1),
(5, 'Catur Wibowo', '1', 'A', '2026005', '$2y$12$EIu2Q25Myk/Ap7z75U44xeAHwv9Vo5yY3MrwlYrwfakgDVpwPFrDO', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-005', NULL, 1),
(6, 'Dimas Anggara', '1', 'A', '2026006', '$2y$12$OlQ8aphu5epZThbzKcmMaeBZqMtbti/CIaa.dtysZQlzVwh6zpBJG', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-006', NULL, 1),
(7, 'Dwi Ningsih', '1', 'A', '2026007', '$2y$12$9LZLagv0xS1ImY.sUGe.Q.koK3TW5WgCgqDR7Oasgb8.moJL9p6vW', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-007', NULL, 1),
(8, 'Eko Prasetyo', '1', 'A', '2026008', '$2y$12$dOXT5zn.wJesO3sZmtFMveaPGccGP.jJTiGp2oJeidMKU0CJc6um2', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-008', NULL, 1),
(9, 'Fitriani', '1', 'A', '2026009', '$2y$12$LFekqiEHKcQmGhDx56piTunUxqmdUHeFt5XEsqWjfa/FIoKfflHEi', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-009', NULL, 1),
(10, 'Hendra Gunawan', '1', 'A', '2026010', '$2y$12$H9/qMI0IR4Qz7qdOG.0yaeHKEepFiYo752uv.G26uGvezyIw7xs3O', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-0010', NULL, 1),
(11, 'Indah Permatasari', '1', 'A', '2026011', '$2y$12$bbeb09jpigyxb4w7tGZi0.V5szfv9ho2eGB6Bv1VEXsWcbVOQb676', '2026-07-13 17:03:57', '2026-07-30 01:52:59', 'PPDB-2026-0011', NULL, 1),
(12, 'Joko Anwar', '1', 'A', '2026012', '$2y$12$.xsFfUxh.0Am0t.iXQFXHO4tMJ21nNNSXUWcuB5B7aHdT0riJ/BHW', '2026-07-13 17:03:57', '2026-07-30 01:52:59', 'PPDB-2026-0012', NULL, 1),
(13, 'Kartika Putri', '1', 'A', '2026013', '$2y$12$KGGnrMBKc8sUyEXaP88/u.1J.QqlfUq21jlA6SWG1XroYdBynnp2q', '2026-07-13 17:03:57', '2026-07-30 01:52:59', 'PPDB-2026-0013', NULL, 1),
(14, 'Lestari', '1', 'A', '2026014', '$2y$12$qXBI46Fmxzt.KdykMCDDQulJauLqhE9TAiC0fEnHQfygK/Nxm/tfq', '2026-07-13 17:03:57', '2026-07-30 01:52:59', 'PPDB-2026-0014', NULL, 1),
(15, 'Muhammad Ali', '1', 'B', '2026016', '$2y$12$Y/i5LWQIpxBBu5Zo0qKve.AuXLGgaeWPmAnTucho9CjB3vS1IJ92.', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0015', NULL, 1),
(16, 'Maya Sari', '1', 'A', '2026015', '$2y$12$ZIbeJz4eold6vpBOlU01Zu9cnGVgMx/oOK6S6ib9SYvynSubWFgF.', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0016', NULL, 1),
(17, 'Nurul Hidayah', '1', 'B', '2026018', '$2y$12$js/bpF4guxFcoagXL0/mMOdYY7oYm6mH5zSzDGRHj0t.Z62F6mW5O', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0017', NULL, 1),
(18, 'Nita Kumala', '1', 'B', '2026017', '$2y$12$MvUXA2gcVXZCSfvKTx0I0O4APu9Mpj9H27nKF6b.y.EYxKzp6j01y', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0018', NULL, 1),
(19, 'Panca Putra', '1', 'B', '2026019', '$2y$12$Cyvy2DdZxiwt4pHOBwdeU.X/cTnpSmAzEuafqoxciyWTMeifAbKdK', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0019', NULL, 1),
(20, 'Ratna Sari', '1', 'B', '2026020', '$2y$12$uEiEnFe1GLbfmFRCUWbfKOqL4p3gyTYDhOhV.yeYwBOlZfmwS4vsO', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0020', NULL, 1),
(21, 'Rina Wati', '1', 'B', '2026022', '$2y$12$RFHkD7yMfYx/NBhtVk.Qne/7B8nQO1wTFf926/bx.t30ZVr02kDvu', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0021', NULL, 1),
(22, 'Reza Rahadian', '1', 'B', '2026021', '$2y$12$J/9v2lnhBjBrp27Pi4jxo.11xvDc6UW3NbH.22J5kS2V.jS2ZVDxG', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0022', NULL, 1),
(23, 'Rizky Maulana', '1', 'B', '2026024', '$2y$12$3HLTzIh1jqeuJm3EAIArN.6oesBOHSL1ei49uxr.yzIa1h.ETBtR6', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0023', NULL, 1),
(24, 'Rini Yulianti', '1', 'B', '2026023', '$2y$12$FwOkg04O5ejW.cUUmL9UReFFL8t1cVXsfHCb8uwypZjfI0dDZmyLG', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0024', NULL, 1),
(25, 'Siti Aminah', '1', 'B', '2026025', '$2y$12$fYx/ABC.oADphO8PXmjnbeNqueuonqOAqTOYtbHAf/kEOzSNkWdNG', '2026-07-13 17:03:57', '2026-07-30 01:53:02', 'PPDB-2026-0025', NULL, 1),
(26, 'Surya Dharma', '1', 'B', '2026026', '$2y$12$beh77dTsfwvg5c.5QX7gf.p6yzbH8pBnsH8zWqpcJehwxdq/9sMLy', '2026-07-13 17:03:57', '2026-07-30 01:53:02', 'PPDB-2026-0026', NULL, 1),
(27, 'Tri Handayani', '1', 'B', '2026028', '$2y$12$EM5iWF3Vd3qhrXDNq6f.uu4IaxW.qJCHXRCfZHsZ2BytnQz2pjReG', '2026-07-13 17:03:57', '2026-07-30 01:53:02', 'PPDB-2026-0027', NULL, 1),
(28, 'Taufik Hidayat', '1', 'B', '2026027', '$2y$12$ciGaUHH8uVNxKAWLgIqxAu9bjDdov38MN8IcLLfeWs1rxSSTQ1dZi', '2026-07-13 17:03:57', '2026-07-30 01:53:02', 'PPDB-2026-0028', NULL, 1),
(29, 'Wahyu Hidayat', '1', 'B', '2026029', '$2y$12$O9WZiClbOK70K/uyU0zXtOqya2IlCtLbaXT77fsyUWSW6FkBAQIHK', '2026-07-13 17:03:57', '2026-07-30 01:53:03', 'PPDB-2026-0029', NULL, 1),
(30, 'Yuni Shara', '1', 'B', '2026030', '$2y$12$6s3MeeFlom1IlKSdPOQb/Of/jMQuGsS6VB30nCfdV3FGVII/H/Fz.', '2026-07-13 17:03:57', '2026-07-30 01:53:03', 'PPDB-2026-0030', NULL, 1),
(31, 'Joko Susilo', '1', 'A', '2027001', '$2y$12$d4MGRR.mgGq/o20J.ObYVOli1BURYVZ1ZBclJ4twg5xjnhIGK.lwC', '2026-07-14 01:53:06', '2026-07-30 01:53:03', 'PPDB-2026-0031', NULL, 1),
(32, 'Kartika Sari', '1', 'A', '2027002', '$2y$12$z3XaJ01XMCgRgnyqxogKrOrrkB5YA3JfhSA0e9X6JdF77ieA.5.fy', '2026-07-14 01:53:06', '2026-07-30 01:53:03', 'PPDB-2026-0032', NULL, 1),
(33, 'Lukman Hakim', '1', 'A', '2027003', '$2y$12$lCBfpQONhWe8RVtZMyVfM.kNJmC/DbpvKNCn9YRgdo/mdF86JGbsS', '2026-07-14 01:53:06', '2026-07-30 01:53:03', 'PPDB-2026-0033', NULL, 1),
(34, 'Melati Putri', '1', 'A', '2027004', '$2y$12$UmXMrgthguLW.V6YzmH3leUoNGO0bStqK1uq7ig5jTqoFx18ENhx.', '2026-07-14 01:53:06', '2026-07-30 01:53:04', 'PPDB-2026-0034', NULL, 1),
(35, 'Nanda Pratiwi', '1', 'A', '2027005', '$2y$12$rmy5xd/LtOq9Pf3czzkWfOTmfE.1rjQZmsIcEBlIhyJblSEdlb1bW', '2026-07-14 01:53:06', '2026-07-30 01:53:04', 'PPDB-2026-0035', NULL, 1),
(36, 'Oki Setiawan', '1', 'A', '2027006', '$2y$12$LULUehT.dV50bR34MUEBOuE6syB6obrNXg4U.59KGsQR0Lvkc0r8a', '2026-07-14 01:53:06', '2026-07-30 01:53:04', 'PPDB-2026-0036', NULL, 1),
(37, 'Putri Ayuningsih', '1', 'A', '2027007', '$2y$12$4GQW3h72J.1hgO.7jUZTj.2jn3Me5V.9UGzC9H9bIEZ4t1nvo7hIG', '2026-07-14 01:53:06', '2026-07-30 01:53:04', 'PPDB-2026-0037', NULL, 1),
(38, 'Rendra Kurniawan', '1', 'A', '2027008', '$2y$12$yorBZCm5iW2iNhXpZbJiGu5nzBn9NsZB4opVop6FJ06/1CQVLRQfS', '2026-07-14 01:53:06', '2026-07-30 01:53:05', 'PPDB-2026-0038', NULL, 1),
(39, 'Siti Rahmawati', '1', 'A', '2027009', '$2y$12$k9FClVOecwGXOIA9A9yTl.YIh6iRcnDJZQt4RRZtsAByCGd3t3au6', '2026-07-14 01:53:06', '2026-07-30 01:53:05', 'PPDB-2026-0039', NULL, 1),
(40, 'Taufik Hidayat', '1', 'A', '2027010', '$2y$12$2YkIVe2ZSOA2zH8XvEbLleCSS8VPZEr0.GUpRXvmh9/w6vwsGuVm.', '2026-07-14 01:53:06', '2026-07-30 01:53:05', 'PPDB-2026-0040', NULL, 1),
(46, 'Muhammad Alif', '1', 'A', '2028002', '$2y$12$0BiF1UOZ/x39wp7Ey3klled4mgk.4I3s6AgAdsYWjcGbKb5PfWLZK', '2026-07-16 03:03:18', '2026-07-30 01:53:05', 'PPDB-2026-041', NULL, 1),
(47, 'Siti Zahra', '1', 'A', '2028005', '$2y$12$Q7/GjRwkLB/Iqaoq2P0qwOShN8hpmeKMvGP1SywEIFp0/2MwY1vFu', '2026-07-16 03:03:18', '2026-07-30 01:53:05', 'PPDB-2026-042', NULL, 1),
(48, 'Ahmad Fadli', '1', 'A', '2028001', '$2y$12$K7PQcJNRAf0ONhGCbKRvseCJfawWhi4sowa4Yz5hs73hr7jb3zYra', '2026-07-16 03:03:18', '2026-07-30 01:53:06', 'PPDB-2026-043', NULL, 1),
(49, 'Nabila Azzahra', '1', 'A', '2028003', '$2y$12$BDPjejhXNDIMrGSk50.MyuZWUJT7qn8FutnKD1.rPC3XMDoYpFTQC', '2026-07-16 03:03:18', '2026-07-30 01:53:06', 'PPDB-2026-044', NULL, 1),
(50, 'Rizky Maulana', '1', 'A', '2028004', '$2y$12$v1Z572uXpnI31MQYHDPi0u/O94/VEdNP.pCA6cN.dgxQoHBF8AVl.', '2026-07-16 03:03:18', '2026-07-30 01:53:06', 'PPDB-2026-045', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `siswa_tahun`
--

CREATE TABLE `siswa_tahun` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `siswa_id` bigint(20) UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `rombel_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_processed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `siswa_tahun`
--

INSERT INTO `siswa_tahun` (`id`, `siswa_id`, `tahun_ajaran_id`, `status`, `rombel_id`, `is_processed`, `created_at`, `updated_at`) VALUES
(1, 61, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(2, 62, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(3, 63, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(4, 64, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(5, 65, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(6, 66, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(7, 67, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(8, 68, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(9, 69, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(10, 70, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(11, 71, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(12, 72, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(13, 73, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(14, 74, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(15, 75, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(16, 76, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(17, 77, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(18, 78, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(19, 79, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(20, 80, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(21, 81, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(22, 82, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(23, 83, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(24, 84, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(25, 85, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(26, 86, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(27, 87, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(28, 88, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(29, 89, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(30, 90, 1, 'aktif', NULL, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(32, 91, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(33, 92, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(34, 93, 1, 'aktif', 22, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(35, 94, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(36, 95, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(37, 96, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(38, 97, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(39, 98, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(40, 99, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(41, 100, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(42, 101, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(43, 102, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(44, 103, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(45, 104, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(46, 105, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(47, 106, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(48, 107, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(49, 108, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(50, 109, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(51, 110, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(52, 111, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(53, 112, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(54, 113, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(55, 114, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(56, 115, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(57, 116, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(58, 117, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(59, 118, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(60, 119, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(61, 120, 1, 'aktif', NULL, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(63, 121, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(64, 122, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(65, 123, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(66, 124, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(67, 125, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(68, 126, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(69, 127, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(70, 128, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(71, 129, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(72, 130, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(73, 131, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(74, 132, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(75, 133, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(76, 134, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(77, 135, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(78, 136, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(79, 137, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(80, 138, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(81, 139, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(82, 140, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(83, 141, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(84, 142, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(85, 143, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(86, 144, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(87, 145, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(88, 146, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(89, 147, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(90, 148, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(91, 149, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(92, 150, 1, 'aktif', NULL, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(94, 151, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(95, 152, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(96, 153, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(97, 154, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(98, 155, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(99, 156, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(100, 157, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(101, 158, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(102, 159, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(103, 160, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(104, 161, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(105, 162, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(106, 163, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(107, 164, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(108, 165, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(109, 166, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(110, 167, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(111, 168, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(112, 169, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(113, 170, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(114, 171, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(115, 172, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(116, 173, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(117, 174, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(118, 175, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(119, 176, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(120, 177, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(121, 178, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(122, 179, 1, 'aktif', NULL, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(125, 180, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(126, 181, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(127, 182, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(128, 183, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(129, 184, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(130, 185, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(131, 186, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(132, 187, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(133, 188, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(134, 189, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(135, 190, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(136, 191, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(137, 192, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(138, 193, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(139, 194, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(140, 195, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(141, 196, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(142, 197, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(143, 198, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(144, 199, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(145, 200, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(146, 201, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(147, 202, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(148, 203, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(149, 204, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(150, 205, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(151, 206, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(152, 207, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(153, 208, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(154, 209, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(155, 210, 1, 'aktif', NULL, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(156, 211, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(157, 212, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(158, 213, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(159, 214, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(160, 215, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(161, 216, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(162, 217, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(163, 218, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(164, 219, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(165, 220, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(166, 221, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(167, 222, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(168, 223, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(169, 224, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(170, 225, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(171, 226, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(172, 227, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(173, 228, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(174, 229, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(175, 230, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(176, 231, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(177, 232, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(178, 233, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(179, 234, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(180, 235, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(181, 236, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(182, 237, 1, 'LULUS', NULL, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(187, 61, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(188, 62, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(189, 63, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(190, 64, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(191, 65, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(192, 66, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(193, 67, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(194, 68, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(195, 69, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(196, 70, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(197, 71, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(198, 72, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(199, 73, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(200, 74, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(201, 75, 2, 'AKTIF', 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(202, 76, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(203, 77, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(204, 78, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(205, 79, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(206, 80, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(207, 81, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(208, 82, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(209, 83, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(210, 84, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(211, 85, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(212, 86, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(213, 87, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(214, 88, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(215, 89, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(216, 90, 2, 'AKTIF', 2, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(217, 91, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(218, 92, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(219, 93, 2, 'AKTIF', 22, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(220, 94, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(221, 95, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(222, 96, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(223, 97, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(224, 98, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(225, 99, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(226, 100, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(227, 101, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(228, 102, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(229, 103, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(230, 104, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(231, 105, 2, 'AKTIF', 3, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(232, 106, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(233, 107, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(234, 108, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(235, 109, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(236, 110, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(237, 111, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(238, 112, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(239, 113, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(240, 114, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(241, 115, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(242, 116, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(243, 117, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(244, 118, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(245, 119, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(246, 120, 2, 'AKTIF', 4, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(247, 121, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(248, 122, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(249, 123, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(250, 124, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(251, 125, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(252, 126, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(253, 127, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(254, 128, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(255, 129, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(256, 130, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(257, 131, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(258, 132, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(259, 133, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(260, 134, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(261, 135, 2, 'AKTIF', 5, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(262, 136, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(263, 137, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(264, 138, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(265, 139, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(266, 140, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(267, 141, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(268, 142, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(269, 143, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(270, 144, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(271, 145, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(272, 146, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(273, 147, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(274, 148, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(275, 149, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(276, 150, 2, 'AKTIF', 6, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(277, 151, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(278, 152, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(279, 153, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(280, 154, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(281, 155, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(282, 156, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(283, 157, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(284, 158, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(285, 159, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(286, 160, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(287, 161, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(288, 162, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(289, 163, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(290, 164, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(291, 165, 2, 'AKTIF', 7, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(292, 166, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(293, 167, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(294, 168, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(295, 169, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(296, 170, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(297, 171, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(298, 172, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(299, 173, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(300, 174, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(301, 175, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(302, 176, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(303, 177, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(304, 178, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(305, 179, 2, 'AKTIF', 8, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(306, 180, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(307, 181, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(308, 182, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(309, 183, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(310, 184, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(311, 185, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(312, 186, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(313, 187, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(314, 188, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(315, 189, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(316, 190, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(317, 191, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(318, 192, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(319, 193, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(320, 194, 2, 'LULUS', 9, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(321, 195, 2, 'LULUS', 10, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(322, 196, 2, 'LULUS', 10, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(323, 197, 2, 'LULUS', 10, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(324, 198, 2, 'LULUS', 10, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(325, 199, 2, 'LULUS', 10, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(326, 200, 2, 'LULUS', 10, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(327, 201, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(328, 202, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(329, 203, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(330, 204, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(331, 205, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(332, 206, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(333, 207, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(334, 208, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(335, 209, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(336, 210, 2, 'LULUS', 10, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(337, 240, 2, 'AKTIF', 11, 1, '2026-07-13 17:21:46', '2026-07-14 02:34:02'),
(338, 241, 2, 'AKTIF', 11, 1, '2026-07-13 17:24:45', '2026-07-14 02:34:02'),
(339, 242, 2, 'AKTIF', 11, 1, '2026-07-13 17:24:46', '2026-07-14 02:34:02'),
(340, 243, 2, 'AKTIF', 11, 1, '2026-07-13 17:24:48', '2026-07-14 02:34:02'),
(341, 244, 2, 'AKTIF', 11, 1, '2026-07-13 17:24:49', '2026-07-14 02:34:02'),
(342, 245, 2, 'AKTIF', 11, 1, '2026-07-13 17:24:50', '2026-07-14 02:34:02'),
(343, 246, 2, 'AKTIF', 11, 1, '2026-07-13 17:24:54', '2026-07-14 02:34:02'),
(344, 247, 2, 'AKTIF', 11, 1, '2026-07-13 17:24:57', '2026-07-14 02:34:02'),
(345, 248, 2, 'AKTIF', 11, 1, '2026-07-13 17:24:59', '2026-07-14 02:34:02'),
(346, 249, 2, 'AKTIF', 11, 1, '2026-07-13 17:25:01', '2026-07-14 02:34:02'),
(347, 250, 2, 'AKTIF', 11, 1, '2026-07-13 17:25:36', '2026-07-14 02:34:02'),
(348, 251, 2, 'AKTIF', 11, 1, '2026-07-13 17:25:38', '2026-07-14 02:34:02'),
(349, 252, 2, 'AKTIF', 11, 1, '2026-07-13 17:25:40', '2026-07-14 02:34:02'),
(350, 253, 2, 'AKTIF', 11, 1, '2026-07-13 17:25:40', '2026-07-14 02:34:02'),
(351, 254, 2, 'AKTIF', 11, 1, '2026-07-13 17:25:44', '2026-07-14 02:34:02'),
(352, 255, 2, 'AKTIF', 12, 1, '2026-07-13 17:26:48', '2026-07-14 02:34:02'),
(353, 256, 2, 'AKTIF', 12, 1, '2026-07-13 17:26:50', '2026-07-14 02:34:02'),
(354, 257, 2, 'AKTIF', 12, 1, '2026-07-13 17:26:52', '2026-07-14 02:34:02'),
(355, 258, 2, 'AKTIF', 12, 1, '2026-07-13 17:26:53', '2026-07-14 02:34:02'),
(356, 259, 2, 'AKTIF', 12, 1, '2026-07-13 17:26:56', '2026-07-14 02:34:02'),
(357, 260, 2, 'AKTIF', 12, 1, '2026-07-13 17:26:57', '2026-07-14 02:34:02'),
(358, 261, 2, 'AKTIF', 12, 1, '2026-07-13 17:26:59', '2026-07-14 02:34:02'),
(359, 262, 2, 'AKTIF', 12, 1, '2026-07-13 17:27:01', '2026-07-14 02:34:02'),
(360, 263, 2, 'AKTIF', 12, 1, '2026-07-13 17:27:03', '2026-07-14 02:34:02'),
(361, 264, 2, 'AKTIF', 12, 1, '2026-07-13 17:27:05', '2026-07-14 02:34:02'),
(362, 265, 2, 'AKTIF', 12, 1, '2026-07-13 17:27:31', '2026-07-14 02:34:02'),
(363, 266, 2, 'AKTIF', 12, 1, '2026-07-13 17:27:32', '2026-07-14 02:34:02'),
(364, 267, 2, 'AKTIF', 12, 1, '2026-07-13 17:27:34', '2026-07-14 02:34:02'),
(365, 268, 2, 'AKTIF', 12, 1, '2026-07-13 17:27:36', '2026-07-14 02:34:02'),
(366, 269, 2, 'AKTIF', 12, 1, '2026-07-13 17:27:39', '2026-07-14 02:34:02'),
(367, 61, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(368, 62, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(369, 63, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(370, 64, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(371, 65, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(372, 66, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(373, 67, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(374, 68, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(375, 69, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(376, 70, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(377, 71, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(378, 72, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(379, 73, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(380, 74, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(381, 75, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(382, 76, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(383, 77, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(384, 78, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(385, 79, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(386, 80, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(387, 81, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(388, 82, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(389, 83, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(390, 84, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(391, 85, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(392, 86, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(393, 87, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(394, 88, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(395, 89, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(396, 90, 3, 'AKTIF', 14, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(397, 91, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(398, 92, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(399, 93, 3, 'AKTIF', 22, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(400, 94, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(401, 95, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(402, 96, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(403, 97, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(404, 98, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(405, 99, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(406, 100, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(407, 101, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(408, 102, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(409, 103, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(410, 104, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(411, 105, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(412, 106, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(413, 107, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(414, 108, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(415, 109, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(416, 110, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(417, 111, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(418, 112, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(419, 113, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(420, 114, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(421, 115, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(422, 116, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(423, 117, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(424, 118, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(425, 119, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(426, 120, 3, 'AKTIF', 15, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(427, 121, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(428, 122, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(429, 123, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(430, 124, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(431, 125, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(432, 126, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(433, 127, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(434, 128, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(435, 129, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(436, 130, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(437, 131, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(438, 132, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(439, 133, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(440, 134, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(441, 135, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(442, 136, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(443, 137, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(444, 138, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(445, 139, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(446, 140, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(447, 141, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(448, 142, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(449, 143, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(450, 144, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(451, 145, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(452, 146, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(453, 147, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(454, 148, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(455, 149, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(456, 150, 3, 'AKTIF', 16, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(457, 151, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(458, 152, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(459, 153, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(460, 154, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(461, 155, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(462, 156, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(463, 157, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(464, 158, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(465, 159, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(466, 160, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(467, 161, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(468, 162, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(469, 163, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(470, 164, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(471, 165, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(472, 166, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(473, 167, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(474, 168, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(475, 169, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(476, 170, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(477, 171, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(478, 172, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(479, 173, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(480, 174, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(481, 175, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(482, 176, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(483, 177, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(484, 178, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(485, 179, 3, 'LULUS', 17, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(486, 240, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(487, 241, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(488, 242, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(489, 243, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(490, 244, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(491, 245, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(492, 246, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(493, 247, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(494, 248, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(495, 249, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(496, 250, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(497, 251, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(498, 252, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(499, 253, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(500, 254, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(501, 255, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(502, 256, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(503, 257, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(504, 258, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(505, 259, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(506, 260, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(507, 261, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(508, 262, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(509, 263, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(510, 264, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(511, 265, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(512, 266, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(513, 267, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(514, 268, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(515, 269, 3, 'AKTIF', 13, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(516, 270, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:00', '2026-07-16 02:52:18'),
(517, 271, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:04', '2026-07-16 02:52:18'),
(518, 272, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:10', '2026-07-16 02:52:18'),
(519, 273, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:12', '2026-07-16 02:52:18'),
(520, 274, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:14', '2026-07-16 02:52:18'),
(521, 275, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:16', '2026-07-16 02:52:18'),
(522, 276, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:18', '2026-07-16 02:52:18'),
(523, 277, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:20', '2026-07-16 02:52:18'),
(524, 278, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:22', '2026-07-16 02:52:18'),
(525, 279, 3, 'AKTIF', 18, 1, '2026-07-14 02:40:24', '2026-07-16 02:52:18'),
(526, 61, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(527, 62, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(528, 63, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(529, 64, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(530, 65, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(531, 66, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(532, 67, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(533, 68, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(534, 69, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(535, 70, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(536, 71, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(537, 72, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(538, 73, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(539, 74, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(540, 75, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(541, 76, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(542, 77, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(543, 78, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(544, 79, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(545, 80, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(546, 81, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(547, 82, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(548, 83, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(549, 84, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(550, 85, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(551, 86, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(552, 87, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(553, 88, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(554, 89, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(555, 90, 4, 'AKTIF', 21, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:10'),
(556, 91, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:37'),
(557, 92, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:37'),
(558, 93, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:37'),
(559, 94, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:37'),
(560, 95, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:37'),
(561, 96, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:37'),
(562, 97, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:17', '2026-07-16 02:55:37'),
(563, 98, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(564, 99, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(565, 100, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(566, 101, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(567, 102, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(568, 103, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(569, 104, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(570, 105, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(571, 106, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(572, 107, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(573, 108, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(574, 109, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(575, 110, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(576, 111, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(577, 112, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(578, 113, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(579, 114, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(580, 115, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(581, 116, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(582, 117, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(583, 118, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(584, 119, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(585, 120, 4, 'AKTIF', 22, 0, '2026-07-16 02:52:18', '2026-07-16 02:55:37'),
(586, 121, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(587, 122, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(588, 123, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(589, 124, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(590, 125, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(591, 126, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(592, 127, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(593, 128, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(594, 129, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(595, 130, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(596, 131, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(597, 132, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(598, 133, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(599, 134, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(600, 135, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(601, 136, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(602, 137, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(603, 138, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(604, 139, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(605, 140, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(606, 141, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(607, 142, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(608, 143, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(609, 144, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(610, 145, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(611, 146, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(612, 147, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(613, 148, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(614, 149, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(615, 150, 4, 'AKTIF', 23, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:23'),
(616, 240, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(617, 241, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(618, 242, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(619, 243, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(620, 244, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(621, 245, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(622, 246, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(623, 247, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(624, 248, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(625, 249, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(626, 250, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(627, 251, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(628, 252, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(629, 253, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(630, 254, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(631, 255, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(632, 256, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(633, 257, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(634, 258, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(635, 259, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(636, 260, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(637, 261, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(638, 262, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(639, 263, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(640, 264, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(641, 265, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(642, 266, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(643, 267, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(644, 268, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(645, 269, 4, 'AKTIF', 20, 0, '2026-07-16 02:52:18', '2026-07-16 02:56:56'),
(646, 270, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(647, 271, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(648, 272, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(649, 273, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(650, 274, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(651, 275, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(652, 276, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(653, 277, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(654, 278, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(655, 279, 4, 'AKTIF', 19, 0, '2026-07-16 02:52:18', '2026-07-16 02:57:43'),
(656, 280, 4, 'AKTIF', 24, 0, '2026-07-16 03:05:48', '2026-07-16 03:05:48'),
(657, 281, 4, 'AKTIF', 24, 0, '2026-07-16 03:05:51', '2026-07-16 03:05:51'),
(658, 282, 4, 'AKTIF', 24, 0, '2026-07-16 03:05:58', '2026-07-16 03:05:58'),
(659, 283, 4, 'AKTIF', 24, 0, '2026-07-16 03:06:01', '2026-07-16 03:06:01'),
(660, 284, 4, 'AKTIF', 24, 0, '2026-07-16 03:06:04', '2026-07-16 03:06:04');

-- --------------------------------------------------------

--
-- Table structure for table `system_backups`
--

CREATE TABLE `system_backups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `filename` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tahun_ajaran`
--

CREATE TABLE `tahun_ajaran` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `status` enum('draft','aktif','dikunci') NOT NULL DEFAULT 'draft',
  `semester_aktif` enum('ganjil','genap') DEFAULT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `finalized_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tahun_ajaran`
--

INSERT INTO `tahun_ajaran` (`id`, `nama`, `status`, `semester_aktif`, `aktif`, `created_at`, `updated_at`, `finalized_at`) VALUES
(1, '2026/2027', 'dikunci', 'ganjil', 0, '2026-07-13 16:36:35', '2026-07-13 17:33:03', '2026-07-13 17:30:49'),
(2, '2027/2028', 'dikunci', 'ganjil', 0, '2026-07-13 16:37:14', '2026-07-14 02:41:08', '2026-07-14 02:40:47'),
(3, '2028/2029', 'dikunci', 'ganjil', 0, '2026-07-14 02:33:20', '2026-07-16 03:08:24', '2026-07-16 03:07:47'),
(4, '2029/2030', 'aktif', 'ganjil', 1, '2026-07-14 02:58:25', '2026-07-16 03:08:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `template_deskripsi`
--

CREATE TABLE `template_deskripsi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED NOT NULL,
  `jenis` enum('kokurikuler','ekstrakurikuler') NOT NULL,
  `aspek` varchar(255) NOT NULL,
  `grade` enum('A','B','C','D','E') NOT NULL,
  `deskripsi` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `template_deskripsi_intrakurikuler`
--

CREATE TABLE `template_deskripsi_intrakurikuler` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `guru_id` bigint(20) UNSIGNED NOT NULL,
  `min_nilai` int(11) NOT NULL,
  `max_nilai` int(11) NOT NULL,
  `deskripsi` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `nipy` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `nipy`, `email_verified_at`, `password`, `foto`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', '1001', NULL, '$2y$12$VB71K3T95wVlXmfFUN9Ys.hCwXjr3ZU0PQy3G9vVGH3LIP9kexDSy', NULL, 'superadmin', NULL, '2026-07-13 16:29:04', '2026-07-13 16:29:04'),
(2, 'Admin TU SD', '200001', NULL, '$2y$12$nMfXwflHsPVNpTS6oj4wQeDg0SLJcehUdZir3.AmC3Vt9UK3E24bq', NULL, 'admintu', NULL, '2026-07-13 16:29:04', '2026-07-13 16:29:04'),
(3, 'Guru SD', '300001', NULL, '$2y$12$tFp5D7Esk6Od8xSJg5LVnu4BBjwDSFYSI7dVD1/oiGwMpMiMG9W4W', NULL, 'guru', NULL, '2026-07-13 16:29:04', '2026-07-13 16:29:04'),
(4, 'damarjati', '2001', NULL, '$2y$12$ijg02Bl2YSsfMdSB/aSdq.ixqUbi3EtVk5SxV86vQFrkJ4y378VyC', NULL, 'admintu', NULL, '2026-07-13 16:29:35', '2026-07-13 16:29:35'),
(5, 'Hendra Wicaksono, S.Pd', '4001', NULL, '$2y$12$RikYwePJNDIw/j6XnD3DVeLhfyUO/J.LZl5ZToVPHzzA8BffZWN4K', NULL, 'guru', NULL, '2026-07-13 16:52:24', '2026-07-13 16:52:24'),
(6, 'Daliana Sari, S.Pd.SD', '4002', NULL, '$2y$12$56e5F1Y4hIxKdy2IEM0uEOU23WLn5Nl7ITRVMvxlxCUca169NpbVq', NULL, 'guru', NULL, '2026-07-13 16:52:42', '2026-07-13 16:52:42'),
(7, 'Yan Palupi R, S.Pd', '4003', NULL, '$2y$12$6073fcNbXkCyRGNnSUO7c.0RASA1qLaD6Ai/7xwWocwkylSA2B2hG', NULL, 'guru', NULL, '2026-07-13 16:53:00', '2026-07-13 16:53:00'),
(8, 'Farianti, S.Pd', '4004', NULL, '$2y$12$VUwv/1LPrOD9bXbtl3nOAuhrDZnzOwiPYDIeEMwOXLBtyUyNPfiOy', NULL, 'guru', NULL, '2026-07-13 16:53:16', '2026-07-13 16:53:16'),
(9, 'Sindi Kurniawati, S.Pd', '4005', NULL, '$2y$12$sWPoTbFNM.i/aeN0327txOE5O3S32wIMTLS/sfgsd38b8fsZ3cSxq', NULL, 'guru', NULL, '2026-07-13 16:53:31', '2026-07-13 16:53:31'),
(10, 'Eriyani Sembiring, S.Pd', '4006', NULL, '$2y$12$kmNVQ0k4vZu2LsOsqeYja.E8MJxkGWb76cCx/2HanZ5VPfAAEH0H2', NULL, 'guru', NULL, '2026-07-13 16:53:43', '2026-07-13 16:53:43'),
(11, 'Silvani Al Fajri, S.Si', '4007', NULL, '$2y$12$48bO/uBtV2YYYEvOlHyPve3l8w57DiOxZ086h1eYUhGm5gT1GE/Tq', NULL, 'guru', NULL, '2026-07-13 16:54:00', '2026-07-13 16:54:00'),
(12, 'Reni Rosida, S.Pd.', '4008', NULL, '$2y$12$EJkAHeu4Carg5NIcWZG7/edZJa8Dz3BpyZ2fFZtvUIdgAe4ZEN3zm', NULL, 'guru', NULL, '2026-07-13 16:54:15', '2026-07-13 16:54:15'),
(13, 'Umu Salma, S.Pd.', '4009', NULL, '$2y$12$6D8zjFzpyofyZjwd9RZehu4Pf3rAGGfbloFY2TbrR7ZlkqCOwzwJO', NULL, 'guru', NULL, '2026-07-13 16:54:37', '2026-07-13 16:54:37'),
(14, 'Mutia Nurul Audah, S.Pd', '4010', NULL, '$2y$12$51G4PUosOXBjzGpi.QoRRO4rSZjhG5nIoQqJleGQR/rDczFe.xMzS', NULL, 'guru', NULL, '2026-07-13 16:55:08', '2026-07-13 16:55:08'),
(15, 'Yuliani Rahayu,S.Pd', '4011', NULL, '$2y$12$Bpy8FuRh2E6jVJ6.3k/f1ezajtc2xqXMggjsoaltY6nD3fX9Edini', NULL, 'guru', NULL, '2026-07-13 16:55:35', '2026-07-13 16:55:35'),
(16, 'Daman, S.Pd', '4012', NULL, '$2y$12$EjE1WNEX7BLf7hOsyFzP8eFaKUv5BxutVPQFOdIXUsyqr6hhL12HK', NULL, 'guru', NULL, '2026-07-13 16:55:48', '2026-07-13 16:55:48'),
(18, 'valukh', '5001', NULL, '$2y$12$F7uCKtUfskUvaCH1SvRRU.3qJDo95zxJEXjnaJrnTWYrv2ucLoVBK', NULL, 'kepala_sekolah', NULL, '2026-07-13 19:13:28', '2026-07-13 19:13:28'),
(19, 'bagas', '9000', NULL, '$2y$12$d2.3dhlqBMGakK3cjmJjtefS/J0dmgdu06akDYk1k3mJ11FCipRx.', NULL, 'guru', NULL, '2026-07-14 02:31:50', '2026-07-14 02:32:15');

-- --------------------------------------------------------

--
-- Table structure for table `wali_kelas`
--

CREATE TABLE `wali_kelas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nipy_guru` varchar(255) NOT NULL,
  `tahun_ajaran_id` bigint(20) UNSIGNED NOT NULL,
  `kelas` int(11) NOT NULL,
  `sub` varchar(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absensi_harian`
--
ALTER TABLE `absensi_harian`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `absensi_harian_siswa_tahun_id_tanggal_unique` (`siswa_tahun_id`,`tanggal`),
  ADD KEY `absensi_harian_rombel_id_index` (`rombel_id`),
  ADD KEY `absensi_harian_tanggal_index` (`tanggal`),
  ADD KEY `absensi_harian_tahun_ajaran_id_foreign` (`tahun_ajaran_id`);

--
-- Indexes for table `absensi_mapel`
--
ALTER TABLE `absensi_mapel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `abs_unique_siswa_mapel_tgl_pertemuan` (`siswa_tahun_id`,`mata_pelajaran_id`,`tanggal`,`pertemuan_ke`),
  ADD KEY `absensi_mapel_rombel_id_foreign` (`rombel_id`),
  ADD KEY `absensi_mapel_guru_id_foreign` (`guru_id`),
  ADD KEY `absensi_mapel_mata_pelajaran_id_foreign` (`mata_pelajaran_id`);

--
-- Indexes for table `anggota_kelompok_quran`
--
ALTER TABLE `anggota_kelompok_quran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `anggota_kelompok_quran_kelompok_quran_id_siswa_id_unique` (`kelompok_quran_id`,`siswa_id`),
  ADD KEY `anggota_kelompok_quran_siswa_id_foreign` (`siswa_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `catatan_wali_kelas`
--
ALTER TABLE `catatan_wali_kelas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `catatan_wali_kelas_siswa_id_semester_tahun_ajaran_index` (`siswa_id`,`semester`,`tahun_ajaran`);

--
-- Indexes for table `ekstrakurikuler`
--
ALTER TABLE `ekstrakurikuler`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ekstrakurikuler_nama_unique` (`nama`);

--
-- Indexes for table `ekstrakurikuler_siswa`
--
ALTER TABLE `ekstrakurikuler_siswa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ekstrakurikuler_siswa_siswa_id_foreign` (`siswa_id`),
  ADD KEY `ekstrakurikuler_siswa_ekstrakurikuler_id_foreign` (`ekstrakurikuler_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `finalisasi_rapor`
--
ALTER TABLE `finalisasi_rapor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_finalisasi_rapor` (`siswa_id`,`semester`,`jenis_rapor`,`tahun_ajaran`),
  ADD KEY `finalisasi_rapor_guru_id_foreign` (`guru_id`),
  ADD KEY `finalisasi_rapor_diajukan_oleh_foreign` (`diajukan_oleh`),
  ADD KEY `finalisasi_rapor_disetujui_oleh_foreign` (`disetujui_oleh`);

--
-- Indexes for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jadwal_mapel_id_foreign` (`mapel_id`),
  ADD KEY `jadwal_guru_id_foreign` (`guru_id`),
  ADD KEY `jadwal_penugasan_id_foreign` (`penugasan_id`),
  ADD KEY `jadwal_tahun_ajaran_id_foreign` (`tahun_ajaran_id`),
  ADD KEY `jadwal_rombel_id_hari_tahun_ajaran_id_index` (`rombel_id`,`hari`,`tahun_ajaran_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kelas_tingkat_sub_unique` (`tingkat`,`sub`);

--
-- Indexes for table `kelompok_quran`
--
ALTER TABLE `kelompok_quran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kelompok_quran_guru_id_foreign` (`guru_id`),
  ADD KEY `kelompok_quran_tahun_ajaran_id_foreign` (`tahun_ajaran_id`);

--
-- Indexes for table `mapel`
--
ALTER TABLE `mapel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mapel_nama_unique` (`nama`);

--
-- Indexes for table `mata_pelajaran`
--
ALTER TABLE `mata_pelajaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mata_pelajaran_nama_unique` (`nama`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mutasi`
--
ALTER TABLE `mutasi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nilai_kokurikuler`
--
ALTER TABLE `nilai_kokurikuler`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nilai_kokurikuler_siswa_id_semester_tahun_ajaran_unique` (`siswa_id`,`semester`,`tahun_ajaran`),
  ADD KEY `nilai_kokurikuler_semester_tahun_ajaran_index` (`semester`,`tahun_ajaran`);

--
-- Indexes for table `nilai_quran`
--
ALTER TABLE `nilai_quran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nilai_quran_composite_jenis_unique` (`siswa_id`,`kelompok_quran_id`,`tahun_ajaran`,`semester`,`jenis`),
  ADD UNIQUE KEY `uq_nilai_quran_unik` (`siswa_id`,`kelompok_quran_id`,`semester`,`tahun_ajaran`,`jenis`),
  ADD KEY `nilai_quran_kelompok_quran_id_foreign` (`kelompok_quran_id`);

--
-- Indexes for table `nilai_siswa`
--
ALTER TABLE `nilai_siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_nilai_per_siswa_mapel` (`siswa_id`,`mapel_id`,`semester`,`tahun_ajaran`),
  ADD KEY `nilai_siswa_mapel_id_foreign` (`mapel_id`),
  ADD KEY `nilai_siswa_semester_index` (`semester`),
  ADD KEY `nilai_siswa_tahun_ajaran_index` (`tahun_ajaran`),
  ADD KEY `nilai_siswa_guru_id_foreign` (`guru_id`);

--
-- Indexes for table `nilai_siswa_detail`
--
ALTER TABLE `nilai_siswa_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nilai_siswa_detail_nilai_siswa_id_foreign` (`nilai_siswa_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pengaturan`
--
ALTER TABLE `pengaturan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengaturans`
--
ALTER TABLE `pengaturans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `penugasan_guru`
--
ALTER TABLE `penugasan_guru`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `penugasan_guru_unique` (`guru_id`,`mapel_id`,`kelas`,`tahun_ajaran_id`),
  ADD KEY `penugasan_guru_tahun_ajaran_id_foreign` (`tahun_ajaran_id`),
  ADD KEY `penugasan_guru_mapel_id_foreign` (`mapel_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `pertemuan_quran`
--
ALTER TABLE `pertemuan_quran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pertemuan_quran_kelompok_quran_id_foreign` (`kelompok_quran_id`);

--
-- Indexes for table `pjbl_judul`
--
ALTER TABLE `pjbl_judul`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_pjbl_per_rombel` (`rombel_id`,`tahun_ajaran_id`,`semester`),
  ADD KEY `pjbl_judul_tahun_ajaran_id_foreign` (`tahun_ajaran_id`);

--
-- Indexes for table `promosi_siswa`
--
ALTER TABLE `promosi_siswa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `promosi_siswa_siswa_id_foreign` (`siswa_id`),
  ADD KEY `promosi_siswa_tahun_ajaran_id_foreign` (`tahun_ajaran_id`);

--
-- Indexes for table `rapor_siswa`
--
ALTER TABLE `rapor_siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rapor_siswa` (`siswa_id`,`tahun_ajaran`,`semester`),
  ADD UNIQUE KEY `rapor_siswa_siswa_id_tahun_ajaran_semester_jenis_rapor_unique` (`siswa_id`,`tahun_ajaran`,`semester`,`jenis_rapor`),
  ADD KEY `rapor_siswa_rombel_id_tahun_ajaran_semester_index` (`rombel_id`,`tahun_ajaran`,`semester`),
  ADD KEY `rapor_siswa_siswa_id_tahun_ajaran_semester_index` (`siswa_id`,`tahun_ajaran`,`semester`);

--
-- Indexes for table `rombel`
--
ALTER TABLE `rombel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rombel_tahun_ajaran_id_tingkat_kelas_sub_nama_unique` (`tahun_ajaran_id`,`tingkat_kelas`,`sub_nama`),
  ADD KEY `rombel_tahun_ajaran_id_index` (`tahun_ajaran_id`),
  ADD KEY `rombel_guru_id_foreign` (`guru_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `siswa`
--
ALTER TABLE `siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `siswa_nis_unique` (`nis`),
  ADD UNIQUE KEY `siswa_nisn_unique` (`nisn`),
  ADD KEY `siswa_wali_id_foreign` (`wali_id`),
  ADD KEY `siswa_tahun_ajaran_id_foreign` (`tahun_ajaran_id`);

--
-- Indexes for table `siswas`
--
ALTER TABLE `siswas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `siswas_ppdb_id_unique` (`ppdb_id`);

--
-- Indexes for table `siswa_tahun`
--
ALTER TABLE `siswa_tahun`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_siswa_tahun` (`siswa_id`,`tahun_ajaran_id`),
  ADD KEY `siswa_tahun_tahun_ajaran_id_foreign` (`tahun_ajaran_id`),
  ADD KEY `siswa_tahun_rombel_id_foreign` (`rombel_id`);

--
-- Indexes for table `system_backups`
--
ALTER TABLE `system_backups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tahun_ajaran`
--
ALTER TABLE `tahun_ajaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tahun_ajaran_nama_unique` (`nama`);

--
-- Indexes for table `template_deskripsi`
--
ALTER TABLE `template_deskripsi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_deskripsi_guru_id_jenis_aspek_grade_unique` (`guru_id`,`jenis`,`aspek`,`grade`);

--
-- Indexes for table `template_deskripsi_intrakurikuler`
--
ALTER TABLE `template_deskripsi_intrakurikuler`
  ADD PRIMARY KEY (`id`),
  ADD KEY `template_deskripsi_intrakurikuler_guru_id_foreign` (`guru_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_nipy_unique` (`nipy`);

--
-- Indexes for table `wali_kelas`
--
ALTER TABLE `wali_kelas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wali_kelas_nipy_guru_kelas_sub_tahun_ajaran_id_unique` (`nipy_guru`,`kelas`,`sub`,`tahun_ajaran_id`),
  ADD KEY `wali_kelas_tahun_ajaran_id_foreign` (`tahun_ajaran_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absensi_harian`
--
ALTER TABLE `absensi_harian`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `absensi_mapel`
--
ALTER TABLE `absensi_mapel`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `anggota_kelompok_quran`
--
ALTER TABLE `anggota_kelompok_quran`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `catatan_wali_kelas`
--
ALTER TABLE `catatan_wali_kelas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ekstrakurikuler`
--
ALTER TABLE `ekstrakurikuler`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ekstrakurikuler_siswa`
--
ALTER TABLE `ekstrakurikuler_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finalisasi_rapor`
--
ALTER TABLE `finalisasi_rapor`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `jadwal`
--
ALTER TABLE `jadwal`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kelompok_quran`
--
ALTER TABLE `kelompok_quran`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mapel`
--
ALTER TABLE `mapel`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `mata_pelajaran`
--
ALTER TABLE `mata_pelajaran`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `mutasi`
--
ALTER TABLE `mutasi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `nilai_kokurikuler`
--
ALTER TABLE `nilai_kokurikuler`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `nilai_quran`
--
ALTER TABLE `nilai_quran`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `nilai_siswa`
--
ALTER TABLE `nilai_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `nilai_siswa_detail`
--
ALTER TABLE `nilai_siswa_detail`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaturan`
--
ALTER TABLE `pengaturan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaturans`
--
ALTER TABLE `pengaturans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `penugasan_guru`
--
ALTER TABLE `penugasan_guru`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `pertemuan_quran`
--
ALTER TABLE `pertemuan_quran`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pjbl_judul`
--
ALTER TABLE `pjbl_judul`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promosi_siswa`
--
ALTER TABLE `promosi_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rapor_siswa`
--
ALTER TABLE `rapor_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rombel`
--
ALTER TABLE `rombel`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `siswa`
--
ALTER TABLE `siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=285;

--
-- AUTO_INCREMENT for table `siswas`
--
ALTER TABLE `siswas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `siswa_tahun`
--
ALTER TABLE `siswa_tahun`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=661;

--
-- AUTO_INCREMENT for table `system_backups`
--
ALTER TABLE `system_backups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tahun_ajaran`
--
ALTER TABLE `tahun_ajaran`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `template_deskripsi`
--
ALTER TABLE `template_deskripsi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `template_deskripsi_intrakurikuler`
--
ALTER TABLE `template_deskripsi_intrakurikuler`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `wali_kelas`
--
ALTER TABLE `wali_kelas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absensi_harian`
--
ALTER TABLE `absensi_harian`
  ADD CONSTRAINT `absensi_harian_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `absensi_mapel`
--
ALTER TABLE `absensi_mapel`
  ADD CONSTRAINT `absensi_mapel_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `absensi_mapel_mata_pelajaran_id_foreign` FOREIGN KEY (`mata_pelajaran_id`) REFERENCES `mata_pelajaran` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absensi_mapel_rombel_id_foreign` FOREIGN KEY (`rombel_id`) REFERENCES `rombel` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absensi_mapel_siswa_tahun_id_foreign` FOREIGN KEY (`siswa_tahun_id`) REFERENCES `siswa_tahun` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `anggota_kelompok_quran`
--
ALTER TABLE `anggota_kelompok_quran`
  ADD CONSTRAINT `anggota_kelompok_quran_kelompok_quran_id_foreign` FOREIGN KEY (`kelompok_quran_id`) REFERENCES `kelompok_quran` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `anggota_kelompok_quran_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ekstrakurikuler_siswa`
--
ALTER TABLE `ekstrakurikuler_siswa`
  ADD CONSTRAINT `ekstrakurikuler_siswa_ekstrakurikuler_id_foreign` FOREIGN KEY (`ekstrakurikuler_id`) REFERENCES `ekstrakurikuler` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ekstrakurikuler_siswa_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `finalisasi_rapor`
--
ALTER TABLE `finalisasi_rapor`
  ADD CONSTRAINT `finalisasi_rapor_diajukan_oleh_foreign` FOREIGN KEY (`diajukan_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `finalisasi_rapor_disetujui_oleh_foreign` FOREIGN KEY (`disetujui_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `finalisasi_rapor_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `finalisasi_rapor_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jadwal`
--
ALTER TABLE `jadwal`
  ADD CONSTRAINT `jadwal_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jadwal_mapel_id_foreign` FOREIGN KEY (`mapel_id`) REFERENCES `mapel` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jadwal_penugasan_id_foreign` FOREIGN KEY (`penugasan_id`) REFERENCES `penugasan_guru` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `jadwal_rombel_id_foreign` FOREIGN KEY (`rombel_id`) REFERENCES `rombel` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jadwal_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kelompok_quran`
--
ALTER TABLE `kelompok_quran`
  ADD CONSTRAINT `kelompok_quran_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kelompok_quran_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nilai_kokurikuler`
--
ALTER TABLE `nilai_kokurikuler`
  ADD CONSTRAINT `nilai_kokurikuler_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nilai_quran`
--
ALTER TABLE `nilai_quran`
  ADD CONSTRAINT `nilai_quran_kelompok_quran_id_foreign` FOREIGN KEY (`kelompok_quran_id`) REFERENCES `kelompok_quran` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nilai_quran_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nilai_siswa`
--
ALTER TABLE `nilai_siswa`
  ADD CONSTRAINT `nilai_siswa_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nilai_siswa_mapel_id_foreign` FOREIGN KEY (`mapel_id`) REFERENCES `mapel` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nilai_siswa_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nilai_siswa_detail`
--
ALTER TABLE `nilai_siswa_detail`
  ADD CONSTRAINT `nilai_siswa_detail_nilai_siswa_id_foreign` FOREIGN KEY (`nilai_siswa_id`) REFERENCES `nilai_siswa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `penugasan_guru`
--
ALTER TABLE `penugasan_guru`
  ADD CONSTRAINT `penugasan_guru_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `penugasan_guru_mapel_id_foreign` FOREIGN KEY (`mapel_id`) REFERENCES `mapel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `penugasan_guru_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pertemuan_quran`
--
ALTER TABLE `pertemuan_quran`
  ADD CONSTRAINT `pertemuan_quran_kelompok_quran_id_foreign` FOREIGN KEY (`kelompok_quran_id`) REFERENCES `kelompok_quran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pjbl_judul`
--
ALTER TABLE `pjbl_judul`
  ADD CONSTRAINT `pjbl_judul_rombel_id_foreign` FOREIGN KEY (`rombel_id`) REFERENCES `rombel` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pjbl_judul_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `promosi_siswa`
--
ALTER TABLE `promosi_siswa`
  ADD CONSTRAINT `promosi_siswa_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promosi_siswa_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rapor_siswa`
--
ALTER TABLE `rapor_siswa`
  ADD CONSTRAINT `rapor_siswa_rombel_id_foreign` FOREIGN KEY (`rombel_id`) REFERENCES `rombel` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rapor_siswa_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswas` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rombel`
--
ALTER TABLE `rombel`
  ADD CONSTRAINT `rombel_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rombel_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `siswa`
--
ALTER TABLE `siswa`
  ADD CONSTRAINT `siswa_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `siswa_wali_id_foreign` FOREIGN KEY (`wali_id`) REFERENCES `wali_kelas` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `siswa_tahun`
--
ALTER TABLE `siswa_tahun`
  ADD CONSTRAINT `siswa_tahun_rombel_id_foreign` FOREIGN KEY (`rombel_id`) REFERENCES `rombel` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `siswa_tahun_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `siswa_tahun_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `template_deskripsi`
--
ALTER TABLE `template_deskripsi`
  ADD CONSTRAINT `template_deskripsi_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `template_deskripsi_intrakurikuler`
--
ALTER TABLE `template_deskripsi_intrakurikuler`
  ADD CONSTRAINT `template_deskripsi_intrakurikuler_guru_id_foreign` FOREIGN KEY (`guru_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wali_kelas`
--
ALTER TABLE `wali_kelas`
  ADD CONSTRAINT `wali_kelas_nipy_guru_foreign` FOREIGN KEY (`nipy_guru`) REFERENCES `users` (`nipy`) ON DELETE CASCADE,
  ADD CONSTRAINT `wali_kelas_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
