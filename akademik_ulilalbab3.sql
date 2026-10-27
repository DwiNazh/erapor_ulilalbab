-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 27, 2026 at 02:27 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

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
  `id` bigint UNSIGNED NOT NULL,
  `siswa_tahun_id` bigint UNSIGNED NOT NULL,
  `rombel_id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED DEFAULT NULL,
  `semester` enum('semester1','semester2') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal` date NOT NULL,
  `status` enum('H','S','I','A') COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guru_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '0'
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
(25, 525, 18, 3, 'semester1', '2026-07-14', 'H', NULL, 19, '2026-07-14 02:43:50', '2026-07-14 02:43:50', 0),
(26, 586, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(27, 587, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(28, 588, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(29, 589, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(30, 590, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(31, 591, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(32, 592, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(33, 593, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(34, 594, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(35, 595, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(36, 596, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(37, 597, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(38, 598, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(39, 599, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(40, 600, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(41, 601, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(42, 602, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(43, 603, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(44, 604, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(45, 605, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(46, 606, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(47, 607, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(48, 608, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(49, 609, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(50, 610, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(51, 611, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(52, 612, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(53, 613, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(54, 614, 23, 4, 'semester1', '2026-10-08', 'H', NULL, 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(55, 615, 23, 4, 'semester1', '2026-10-08', 'I', 'izin acara keluarga', 9, '2026-10-08 06:52:05', '2026-10-08 06:52:05', 0),
(56, 616, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(57, 625, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(58, 617, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(59, 618, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(60, 619, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(61, 620, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(62, 621, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(63, 622, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(64, 623, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(65, 624, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(66, 626, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(67, 627, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(68, 628, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(69, 630, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(70, 629, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(71, 631, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(72, 632, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(73, 633, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(74, 634, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(75, 635, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(76, 636, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(77, 637, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(78, 638, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(79, 639, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(80, 640, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(81, 641, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(82, 642, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(83, 643, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(84, 644, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0),
(85, 645, 20, 4, 'semester1', '2026-10-14', 'H', NULL, 6, '2026-10-14 06:51:16', '2026-10-14 06:51:16', 0);

-- --------------------------------------------------------

--
-- Table structure for table `absensi_mapel`
--

CREATE TABLE `absensi_mapel` (
  `id` bigint UNSIGNED NOT NULL,
  `siswa_tahun_id` bigint UNSIGNED NOT NULL,
  `rombel_id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED DEFAULT NULL,
  `mata_pelajaran_id` bigint UNSIGNED NOT NULL,
  `semester` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date DEFAULT NULL,
  `pertemuan_ke` int DEFAULT NULL,
  `status` enum('H','S','I','A') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'H',
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `anggota_kelompok_quran`
--

CREATE TABLE `anggota_kelompok_quran` (
  `id` bigint UNSIGNED NOT NULL,
  `kelompok_quran_id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
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
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `catatan_wali_kelas`
--

CREATE TABLE `catatan_wali_kelas` (
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `semester` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun_ajaran` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `guru_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ekstrakurikuler`
--

CREATE TABLE `ekstrakurikuler` (
  `id` bigint UNSIGNED NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wajib` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ekstrakurikuler`
--

INSERT INTO `ekstrakurikuler` (`id`, `nama`, `wajib`, `created_at`, `updated_at`) VALUES
(1, 'pramuka', 1, '2026-07-13 19:06:05', '2026-07-13 19:06:05'),
(2, 'menari', 0, '2026-07-16 01:50:34', '2026-07-16 01:50:34'),
(3, 'sepak bola', 0, '2026-08-31 04:15:36', '2026-08-31 04:15:36'),
(4, 'Kompang', 0, '2026-10-08 06:48:30', '2026-10-08 06:48:30');

-- --------------------------------------------------------

--
-- Table structure for table `ekstrakurikuler_siswa`
--

CREATE TABLE `ekstrakurikuler_siswa` (
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `ekstrakurikuler_id` bigint UNSIGNED NOT NULL,
  `nilai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tahun_ajaran` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
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
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finalisasi_jenjang`
--

CREATE TABLE `finalisasi_jenjang` (
  `id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
  `jenjang_id` bigint UNSIGNED NOT NULL,
  `finalized_at` timestamp NULL DEFAULT NULL,
  `finalized_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finalisasi_rapor`
--

CREATE TABLE `finalisasi_rapor` (
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED DEFAULT NULL,
  `semester` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_rapor` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun_ajaran` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finalisasi` tinyint(1) NOT NULL DEFAULT '0',
  `approval_status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `diajukan_oleh` bigint UNSIGNED DEFAULT NULL,
  `diajukan_at` timestamp NULL DEFAULT NULL,
  `disetujui_oleh` bigint UNSIGNED DEFAULT NULL,
  `disetujui_at` timestamp NULL DEFAULT NULL,
  `tgl_finalisasi` timestamp NULL DEFAULT NULL,
  `catatan_wali_kelas` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `id` bigint UNSIGNED NOT NULL,
  `rombel_id` bigint UNSIGNED NOT NULL,
  `mapel_id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED DEFAULT NULL,
  `penugasan_id` bigint UNSIGNED DEFAULT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
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
(18, 23, 19, 19, 21, 'Senin', '09:00:00', '10:00:00', 4, '2026-08-04 02:42:59', '2026-08-04 02:42:59'),
(19, 22, 18, 6, 22, 'Rabu', '07:30:00', '09:00:00', 4, '2026-10-13 01:43:18', '2026-10-13 01:43:18'),
(20, 24, 12, 6, 23, 'Senin', '08:00:00', '09:00:00', 4, '2026-10-14 07:13:08', '2026-10-14 07:13:08'),
(21, 24, 13, 16, 24, 'Senin', '10:00:00', '11:00:00', 4, '2026-10-14 07:13:27', '2026-10-14 07:13:27'),
(22, 19, 14, 6, 25, 'Senin', '07:00:00', '08:30:00', 4, '2026-10-14 07:46:00', '2026-10-14 07:46:00'),
(23, 20, 16, 10, 26, 'Kamis', '10:00:00', '11:00:00', 4, '2026-10-14 08:08:59', '2026-10-14 08:08:59'),
(24, 21, 16, 6, 27, 'Rabu', '08:00:00', '09:00:00', 4, '2026-10-15 01:43:14', '2026-10-15 01:43:14'),
(26, 38, 13, 27, 29, 'Senin', '08:00:00', '16:00:00', 6, '2026-10-22 03:06:57', '2026-10-22 03:06:57');

-- --------------------------------------------------------

--
-- Table structure for table `jenjang`
--

CREATE TABLE `jenjang` (
  `id` bigint UNSIGNED NOT NULL,
  `kode` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kelas_min` tinyint UNSIGNED NOT NULL,
  `kelas_max` tinyint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jenjang`
--

INSERT INTO `jenjang` (`id`, `kode`, `nama`, `kelas_min`, `kelas_max`, `created_at`, `updated_at`) VALUES
(1, 'SD', 'Sekolah Dasar', 1, 6, '2026-10-09 03:51:24', '2026-10-09 03:51:24'),
(2, 'SMP', 'Sekolah Menengah Pertama', 7, 9, '2026-10-09 03:51:24', '2026-10-09 03:51:24'),
(3, 'SMA', 'Sekolah Menengah Atas', 10, 12, '2026-10-09 03:51:24', '2026-10-09 03:51:24');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` bigint UNSIGNED NOT NULL,
  `tingkat` tinyint UNSIGNED NOT NULL,
  `sub` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kelompok_quran`
--

CREATE TABLE `kelompok_quran` (
  `id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
  `semester` enum('Ganjil','Genap') COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kelompok_quran`
--

INSERT INTO `kelompok_quran` (`id`, `guru_id`, `tahun_ajaran_id`, `semester`, `label`, `aktif`, `created_at`, `updated_at`) VALUES
(1, 6, 3, 'Ganjil', 'A', 0, '2026-07-16 01:52:49', '2026-07-16 01:52:49'),
(2, 19, 4, 'Ganjil', 'A', 0, '2026-07-16 03:16:19', '2026-07-16 03:16:19'),
(3, 19, 6, 'Ganjil', 'A', 0, '2026-10-22 02:10:07', '2026-10-22 02:10:07'),
(4, 27, 6, 'Ganjil', 'A', 0, '2026-10-22 03:04:50', '2026-10-22 03:04:50'),
(5, 28, 6, 'Ganjil', 'A', 0, '2026-10-22 03:04:54', '2026-10-22 03:04:54');

-- --------------------------------------------------------

--
-- Table structure for table `mapel`
--

CREATE TABLE `mapel` (
  `id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis` enum('wajib','pilihan') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wajib',
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
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
  `id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
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
(72, '2026_07_30_084900_add_password_to_siswa_and_siswas_table', 3),
(77, '2026_10_09_101302_create_jenjang_table', 4),
(78, '2026_10_09_102314_add_jenjang_id_and_kelompok_gender_to_rombel_table', 4),
(79, '2026_10_09_103638_remove_old_unique_from_rombel_table', 4),
(80, '2026_10_09_104347_add_jenis_kelamin_to_siswa_table', 4),
(81, '2026_10_13_111529_add_jenis_kelamin_to_siswas_table', 5),
(82, '2026_10_14_092219_rename_jenis_kelamin_to_kategori_on_siswa_table', 6),
(83, '2026_10_14_092603_rename_jenis_kelamin_to_kategori_on_siswas_table', 7),
(84, '2026_10_19_080459_add_jenjang_id_to_users_table', 8),
(85, '2026_10_19_093718_add_jenjang_id_to_siswas_table', 9),
(86, '2026_10_19_100700_create_finalisasi_jenjang_table', 10),
(87, '2026_10_19_132337_remove_cascade_from_finalisasi_jenjang_table', 11),
(88, '2026_10_21_083840_add_jenjang_id_to_siswa_tahun_table', 11),
(89, '2026_10_27_082033_create_tahun_ajaran_jenjang_table', 12);

-- --------------------------------------------------------

--
-- Table structure for table `mutasi`
--

CREATE TABLE `mutasi` (
  `id` bigint UNSIGNED NOT NULL,
  `jenis` enum('siswa','guru') COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` bigint UNSIGNED NOT NULL,
  `tipe_mutasi` enum('pindah_rombel','pindah_sekolah') COLLATE utf8mb4_unicode_ci NOT NULL,
  `rombel_asal_id` bigint UNSIGNED DEFAULT NULL,
  `rombel_tujuan_id` bigint UNSIGNED DEFAULT NULL,
  `sekolah_tujuan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keterangan` text COLLATE utf8mb4_unicode_ci,
  `tanggal_mutasi` date NOT NULL,
  `dilakukan_oleh` bigint UNSIGNED NOT NULL,
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
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED DEFAULT NULL,
  `semester` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `tahun_ajaran` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mutabaah_yaumiyah` decimal(3,1) DEFAULT NULL,
  `bina_pribadi_islam` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pjbl` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `literasi` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `deskripsi_aspek` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `nilai_mingguan_mutabaah` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'Array nilai mingguan Mutabah Yaumiyah skala 1-4, disimpan sebagai JSON',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ;

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
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `kelompok_quran_id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `semester` enum('1','2') COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis` enum('tahfidz','tilawah') COLLATE utf8mb4_unicode_ci NOT NULL,
  `uh1` int DEFAULT NULL,
  `uh2` int DEFAULT NULL,
  `uh3` int DEFAULT NULL,
  `uh4` int DEFAULT NULL,
  `uh5` int DEFAULT NULL,
  `pts` int DEFAULT NULL,
  `pas` int DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
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
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `mapel_id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED DEFAULT NULL,
  `semester` enum('1','2') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun_ajaran` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uh1` int DEFAULT NULL COMMENT 'Ulangan Harian 1',
  `uh2` int DEFAULT NULL COMMENT 'Ulangan Harian 2',
  `uh3` int DEFAULT NULL COMMENT 'Ulangan Harian 3',
  `uh4` int DEFAULT NULL COMMENT 'Ulangan Harian 4',
  `uh5` int DEFAULT NULL COMMENT 'Ulangan Harian 5',
  `pts` int DEFAULT NULL COMMENT 'Penilaian Tengah Semester',
  `pas` int DEFAULT NULL COMMENT 'Penilaian Akhir Semester',
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
  `id` bigint UNSIGNED NOT NULL,
  `nilai_siswa_id` bigint UNSIGNED NOT NULL,
  `jenis` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `urutan` int NOT NULL DEFAULT '1',
  `nilai` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengaturan`
--

CREATE TABLE `pengaturan` (
  `id` bigint UNSIGNED NOT NULL,
  `nama_sekolah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `npsn` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `telepon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_sekolah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengaturan`
--

INSERT INTO `pengaturan` (`id`, `nama_sekolah`, `npsn`, `alamat`, `telepon`, `website`, `email_sekolah`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-10-13 06:27:37', '2026-10-13 06:27:37');

-- --------------------------------------------------------

--
-- Table structure for table `pengaturans`
--

CREATE TABLE `pengaturans` (
  `id` bigint UNSIGNED NOT NULL,
  `nama_sekolah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `npsn` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `kota` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provinsi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kode_pos` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telepon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kepala_sekolah` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nip_kepala` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_notifikasi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notif_akun_baru` tinyint(1) NOT NULL DEFAULT '0',
  `notif_rapor` tinyint(1) NOT NULL DEFAULT '0',
  `notif_login` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `penugasan_guru`
--

CREATE TABLE `penugasan_guru` (
  `id` bigint UNSIGNED NOT NULL,
  `rombel_id` int NOT NULL,
  `guru_id` bigint UNSIGNED NOT NULL,
  `mapel_id` bigint UNSIGNED NOT NULL,
  `kelas` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
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
(21, 23, 19, 19, NULL, 4, '2026-08-04 02:42:59', '2026-08-04 02:42:59'),
(22, 22, 6, 18, NULL, 4, '2026-10-13 01:43:18', '2026-10-13 01:43:18'),
(23, 24, 6, 12, NULL, 4, '2026-10-14 07:13:08', '2026-10-14 07:13:08'),
(24, 24, 16, 13, NULL, 4, '2026-10-14 07:13:27', '2026-10-14 07:13:27'),
(25, 19, 6, 14, NULL, 4, '2026-10-14 07:46:00', '2026-10-14 07:46:00'),
(26, 20, 10, 16, NULL, 4, '2026-10-14 08:08:59', '2026-10-14 08:08:59'),
(27, 21, 6, 16, NULL, 4, '2026-10-15 01:43:14', '2026-10-15 01:43:14'),
(29, 38, 27, 13, NULL, 6, '2026-10-22 03:06:57', '2026-10-22 03:06:57');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
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
(41, 'App\\Models\\User', 19, 'auth-token', '2a1789930f63c954bb09611d9195bd93bff108e2cafa5f90b037a6d6e68c05f4', '[\"*\"]', '2026-07-25 07:12:30', NULL, '2026-07-16 03:17:21', '2026-07-25 07:12:30'),
(48, 'App\\Models\\Siswa', 61, 'siswa-token', 'b95801c233da299123df5035e757df411a0dae1cac7f232e26c28b90be19ee86', '[\"*\"]', NULL, NULL, '2026-07-30 01:53:56', '2026-07-30 01:53:56'),
(50, 'App\\Models\\Siswa', 231, 'siswa-token', '16484df636cc330fd5d03d10b548a2c0e48e728b0b73f98a116ad4f3571abf82', '[\"*\"]', '2026-08-04 02:40:53', NULL, '2026-07-30 02:48:56', '2026-08-04 02:40:53'),
(58, 'App\\Models\\Siswa', 78, 'siswa-token', '2cf096d1111d70f995dc095e36b1876a9e16edc404fe65a307cf81db97210a6b', '[\"*\"]', '2026-07-30 08:19:30', NULL, '2026-07-30 08:12:36', '2026-07-30 08:19:30'),
(81, 'App\\Models\\Siswa', 61, 'siswa-token', '02d3340cbf26153cc3edccd64257a64ec29434ef73be9781411ffc7bac3c65ba', '[\"*\"]', '2026-10-09 06:00:21', NULL, '2026-10-08 08:34:00', '2026-10-09 06:00:21'),
(87, 'App\\Models\\Siswa', 61, 'siswa-token', 'f862ae3710f9144daf120476302985ce99a4e717ebc82af403cf10cad50aca89', '[\"*\"]', '2026-10-09 08:33:48', NULL, '2026-10-09 07:20:34', '2026-10-09 08:33:48'),
(90, 'App\\Models\\Siswa', 91, 'siswa-token', '1b015f304042dce52f5edfdf1865c0c2238346c499016b095499d1cce8d4874e', '[\"*\"]', '2026-10-13 04:40:15', NULL, '2026-10-13 01:45:18', '2026-10-13 04:40:15'),
(94, 'App\\Models\\User', 3, 'auth-token', '1183f2c894e6928867aa5729d7fd3a9d02664b9dd0d41cf1254554e784863081', '[\"*\"]', '2026-10-14 06:31:41', NULL, '2026-10-14 06:31:10', '2026-10-14 06:31:41'),
(95, 'App\\Models\\Siswa', 61, 'siswa-token', '4dac2f2c0fcc500e285f1719cab92b154d8fa2a1481522e4de1b626a84e02997', '[\"*\"]', '2026-10-14 06:41:10', NULL, '2026-10-14 06:32:02', '2026-10-14 06:41:10'),
(105, 'App\\Models\\User', 6, 'auth-token', 'c5585018296c87ef557b9ace9fce3674d2872525ade820f92b34874997c8e7e8', '[\"*\"]', '2026-10-14 07:32:25', NULL, '2026-10-14 07:15:37', '2026-10-14 07:32:25'),
(108, 'App\\Models\\Siswa', 280, 'siswa-token', 'd4d42b99fe73f4318a73f95a079b50effa23551df0c28f3bce1a675198e55404', '[\"*\"]', '2026-10-14 07:37:53', NULL, '2026-10-14 07:37:28', '2026-10-14 07:37:53'),
(111, 'App\\Models\\Siswa', 280, 'siswa-token', 'd82f2dd0fd9b2aff5acb627465b591758e872ea2bc5f2311d8343106ef7177d6', '[\"*\"]', '2026-10-14 07:49:03', NULL, '2026-10-14 07:46:31', '2026-10-14 07:49:03'),
(113, 'App\\Models\\Siswa', 280, 'siswa-token', '3c3690030b9dd2af1c0cedf2bc5fee94da61e6cae0a84b737c561bb365f7ad22', '[\"*\"]', '2026-10-14 07:59:58', NULL, '2026-10-14 07:59:15', '2026-10-14 07:59:58'),
(116, 'App\\Models\\Siswa', 281, 'siswa-token', '72b56d62eaf35027ab0e2e1b4a412668396a1acc47e75e77dd1c79e67ef495da', '[\"*\"]', '2026-10-14 08:01:40', NULL, '2026-10-14 08:01:27', '2026-10-14 08:01:40'),
(118, 'App\\Models\\Siswa', 61, 'siswa-token', '2067541bd26a1ee58e1d763fee2a50ba476310756eea11d7d2f6a925cb038206', '[\"*\"]', '2026-10-14 08:02:27', NULL, '2026-10-14 08:02:16', '2026-10-14 08:02:27'),
(122, 'App\\Models\\Siswa', 240, 'siswa-token', '75d9921dca20275596298d70336abcd7f7a50935ee1ce7334145a727be250e6c', '[\"*\"]', '2026-10-15 01:12:21', NULL, '2026-10-14 08:11:14', '2026-10-15 01:12:21'),
(135, 'App\\Models\\Siswa', 121, 'siswa-token', '210c9ae4bf21c28336963a78eeebf1ba5b88ec12607046d705e7307d70c0a39c', '[\"*\"]', '2026-10-15 01:51:25', NULL, '2026-10-15 01:46:14', '2026-10-15 01:51:25'),
(137, 'App\\Models\\Siswa', 280, 'siswa-token', '208af37384937c899e7d42ed99facf55adb8028bc70c04c1e9318534565f0eb6', '[\"*\"]', '2026-10-15 02:28:41', NULL, '2026-10-15 01:51:58', '2026-10-15 02:28:41'),
(151, 'App\\Models\\Siswa', 270, 'siswa-token', '82aa7c9a2ef2188ddc7f593f589dea52bc9cec3a1d32009de6cc1c73bf0d55ae', '[\"*\"]', '2026-10-15 02:27:08', NULL, '2026-10-15 02:26:50', '2026-10-15 02:27:08'),
(167, 'App\\Models\\Siswa', 277, 'siswa-token', 'd1db344fe0c2b09ef349f69b6bdebe7db850e8fc4c0a628b94b5f18142359690', '[\"*\"]', NULL, NULL, '2026-10-16 02:02:53', '2026-10-16 02:02:53'),
(170, 'App\\Models\\User', 5, 'auth-token', '253ab552f2fc536e1926eb53308fad3a796fd86020d39110ecc1154d61574a6b', '[\"*\"]', '2026-10-16 08:17:38', NULL, '2026-10-16 06:08:45', '2026-10-16 08:17:38'),
(171, 'App\\Models\\User', 16, 'auth-token', '1ebd16c96768ffb84c76fb6b8eda74e9b1cfeb30bbda6320afbd116a06ae7a0d', '[\"*\"]', '2026-10-20 01:27:48', NULL, '2026-10-16 06:10:58', '2026-10-20 01:27:48'),
(174, 'App\\Models\\User', 20, 'auth-token', '7958c5bbd19f9bdbbfe9bb94fb5b01a125538ebcbc0cf6d115bd56aad1cdb96e', '[\"*\"]', '2026-10-19 02:09:13', NULL, '2026-10-19 01:47:45', '2026-10-19 02:09:13'),
(175, 'App\\Models\\User', 21, 'auth-token', '7dee1024c83c69b5e1898b39dcff563b708a46a6afb1e2b9db89226e85625592', '[\"*\"]', NULL, NULL, '2026-10-19 01:48:28', '2026-10-19 01:48:28'),
(191, 'App\\Models\\User', 23, 'auth-token', '3cc0fd3851ceed392e83b50e3ba9938bf8575618704b46f7a24d32743a529afc', '[\"*\"]', '2026-10-19 04:08:25', NULL, '2026-10-19 04:08:19', '2026-10-19 04:08:25'),
(244, 'App\\Models\\Siswa', 126, 'siswa-token', '401b6b9c4082b7873c06f69711055c3f4899c321753a5e5d3f9ca7ed96e8be6a', '[\"*\"]', '2026-10-21 06:17:55', NULL, '2026-10-21 04:39:17', '2026-10-21 06:17:55'),
(258, 'App\\Models\\Siswa', 286, 'siswa-token', '1ce46308d00df466eefe0ee8dba6dc19ade83f70b44ccd9f313292da76b4d0f3', '[\"*\"]', '2026-10-22 03:44:53', NULL, '2026-10-22 03:42:56', '2026-10-22 03:44:53'),
(291, 'App\\Models\\Siswa', 270, 'siswa-token', '1bef47625b930359c694f38553ed544bfdd3bbdf961128c78754926cf0a0bd71', '[\"*\"]', NULL, NULL, '2026-10-23 07:23:44', '2026-10-23 07:23:44'),
(301, 'App\\Models\\Siswa', 61, 'siswa-token', 'cceb5a297cbad6f9af5c0456a60da11d371d15c45484a30417e76caf1a14cb3b', '[\"*\"]', '2026-10-26 06:35:37', NULL, '2026-10-26 04:33:06', '2026-10-26 06:35:37'),
(308, 'App\\Models\\User', 4, 'auth-token', '4ef874cc15a9fae8ba3439f3f8a40a2a8dad07975037b30674ede8decf4695f1', '[\"*\"]', '2026-10-26 07:39:40', NULL, '2026-10-26 07:35:28', '2026-10-26 07:39:40'),
(309, 'App\\Models\\User', 26, 'auth-token', '3a80fa51713da9fb7fc7a549ab6db90664e232080a8d09a46ee2ea81668ddb96', '[\"*\"]', '2026-10-26 07:48:27', NULL, '2026-10-26 07:46:39', '2026-10-26 07:48:27');

-- --------------------------------------------------------

--
-- Table structure for table `pertemuan_quran`
--

CREATE TABLE `pertemuan_quran` (
  `id` bigint UNSIGNED NOT NULL,
  `kelompok_quran_id` bigint UNSIGNED NOT NULL,
  `tanggal` date NOT NULL,
  `pertemuan_ke` int NOT NULL,
  `catatan` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pjbl_judul`
--

CREATE TABLE `pjbl_judul` (
  `id` bigint UNSIGNED NOT NULL,
  `rombel_id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
  `semester` enum('ganjil','genap') COLLATE utf8mb4_unicode_ci NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promosi_siswa`
--

CREATE TABLE `promosi_siswa` (
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `kelas_baru_id` int DEFAULT NULL,
  `kelas_asal` tinyint UNSIGNED DEFAULT NULL,
  `sub_kelas_asal` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tahun_ajaran_asal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelas_tujuan` tinyint UNSIGNED DEFAULT NULL,
  `sub_kelas_tujuan` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
  `status` enum('promoted','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'promoted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rapor_siswa`
--

CREATE TABLE `rapor_siswa` (
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `rombel_id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenis_rapor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nilai_akhir` int DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `is_final` tinyint(1) NOT NULL DEFAULT '0',
  `finalized_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rombel`
--

CREATE TABLE `rombel` (
  `id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
  `jenjang_id` bigint UNSIGNED DEFAULT NULL,
  `tingkat_kelas` int NOT NULL DEFAULT '1',
  `sub_nama` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kelompok_gender` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'campuran',
  `nama_rombel` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guru_id` bigint UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rombel`
--

INSERT INTO `rombel` (`id`, `tahun_ajaran_id`, `jenjang_id`, `tingkat_kelas`, `sub_nama`, `kelompok_gender`, `nama_rombel`, `guru_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 2, 'A', 'campuran', NULL, 5, 1, '2026-07-13 16:44:32', '2026-07-13 16:56:46'),
(2, 2, 1, 2, 'B', 'campuran', NULL, 6, 1, '2026-07-13 16:44:33', '2026-07-13 16:56:46'),
(3, 2, 1, 3, 'A', 'campuran', NULL, 7, 1, '2026-07-13 16:46:16', '2026-07-13 16:56:46'),
(4, 2, 1, 3, 'B', 'campuran', NULL, 8, 1, '2026-07-13 16:46:17', '2026-07-13 16:56:46'),
(5, 2, 1, 4, 'A', 'campuran', NULL, 9, 1, '2026-07-13 16:46:27', '2026-07-13 16:56:46'),
(6, 2, 1, 4, 'B', 'campuran', NULL, 10, 1, '2026-07-13 16:46:28', '2026-07-13 16:56:46'),
(7, 2, 1, 5, 'A', 'campuran', NULL, 11, 1, '2026-07-13 16:46:40', '2026-07-13 16:56:46'),
(8, 2, 1, 5, 'B', 'campuran', NULL, 12, 1, '2026-07-13 16:46:40', '2026-07-13 16:56:46'),
(9, 2, 1, 6, 'A', 'campuran', NULL, 13, 1, '2026-07-13 16:46:53', '2026-07-13 16:56:46'),
(10, 2, 1, 6, 'B', 'campuran', NULL, 14, 1, '2026-07-13 16:46:54', '2026-07-13 16:56:46'),
(11, 2, 1, 1, 'A', 'campuran', NULL, 15, 1, '2026-07-13 16:57:21', '2026-07-13 16:57:43'),
(12, 2, 1, 1, 'B', 'campuran', NULL, 16, 1, '2026-07-13 16:57:22', '2026-07-13 16:57:43'),
(13, 3, 1, 2, 'A', 'campuran', NULL, 6, 1, '2026-07-14 02:34:23', '2026-07-14 02:37:13'),
(14, 3, 1, 3, 'A', 'campuran', NULL, 16, 1, '2026-07-14 02:34:28', '2026-07-14 02:37:13'),
(15, 3, 1, 4, 'A', 'campuran', NULL, 10, 1, '2026-07-14 02:34:34', '2026-07-14 02:37:13'),
(16, 3, 1, 5, 'A', 'campuran', NULL, 14, 1, '2026-07-14 02:34:41', '2026-07-14 02:37:13'),
(17, 3, 1, 6, 'A', 'campuran', NULL, 9, 1, '2026-07-14 02:34:48', '2026-07-14 02:37:13'),
(18, 3, 1, 1, 'A', 'campuran', NULL, 19, 1, '2026-07-14 02:37:48', '2026-07-14 02:38:40'),
(19, 4, 1, 2, 'A', 'campuran', NULL, 5, 1, '2026-07-16 02:52:44', '2026-07-16 02:58:26'),
(20, 4, 1, 3, 'A', 'campuran', NULL, 6, 1, '2026-07-16 02:52:53', '2026-07-16 02:58:26'),
(21, 4, 1, 4, 'A', 'campuran', NULL, 7, 1, '2026-07-16 02:53:12', '2026-07-16 02:58:26'),
(22, 4, 1, 5, 'A', 'campuran', NULL, 8, 1, '2026-07-16 02:53:42', '2026-07-16 02:58:26'),
(23, 4, 1, 6, 'A', 'campuran', NULL, 9, 1, '2026-07-16 02:54:02', '2026-07-16 02:58:26'),
(24, 4, 1, 1, 'A', 'campuran', NULL, 19, 1, '2026-07-16 02:58:57', '2026-07-16 03:00:16'),
(37, 6, 2, 7, 'A', 'ikhwan', '7A Ikhwan', 28, 1, '2026-10-20 03:49:15', '2026-10-21 03:08:33'),
(38, 6, 2, 7, 'A', 'akhwat', '7A Akhwat', 27, 1, '2026-10-20 03:49:16', '2026-10-21 03:08:33'),
(39, 6, 3, 10, 'A', 'ikhwan', '10A Ikhwan', NULL, 1, '2026-10-20 03:57:26', '2026-10-20 03:57:26'),
(40, 6, 3, 10, 'A', 'akhwat', '10A Akhwat', NULL, 1, '2026-10-20 03:57:27', '2026-10-20 03:57:27'),
(41, 6, 1, 1, 'A', 'campuran', '1A', NULL, 1, '2026-10-22 06:59:22', '2026-10-22 06:59:22'),
(42, 6, 1, 2, 'A', 'campuran', '2A', NULL, 1, '2026-10-22 06:59:30', '2026-10-22 06:59:30'),
(43, 6, 1, 3, 'A', 'campuran', '3A', NULL, 1, '2026-10-22 06:59:37', '2026-10-22 06:59:37'),
(44, 6, 1, 4, 'A', 'ikhwan', '4A Ikhwan', NULL, 1, '2026-10-22 06:59:45', '2026-10-22 06:59:45'),
(45, 6, 1, 4, 'A', 'akhwat', '4A Akhwat', NULL, 1, '2026-10-22 06:59:46', '2026-10-22 06:59:46'),
(46, 6, 1, 5, 'A', 'ikhwan', '5A Ikhwan', NULL, 1, '2026-10-22 06:59:56', '2026-10-22 06:59:56'),
(47, 6, 1, 5, 'A', 'akhwat', '5A Akhwat', NULL, 1, '2026-10-22 06:59:56', '2026-10-22 06:59:56'),
(48, 6, 1, 6, 'A', 'ikhwan', '6A Ikhwan', NULL, 1, '2026-10-22 07:00:05', '2026-10-22 07:00:05'),
(49, 6, 1, 6, 'A', 'akhwat', '6A Akhwat', NULL, 1, '2026-10-22 07:00:06', '2026-10-22 07:00:06'),
(50, 6, 2, 8, 'A', 'ikhwan', '8A Ikhwan', NULL, 1, '2026-10-22 07:29:52', '2026-10-22 07:29:52'),
(51, 6, 2, 8, 'A', 'akhwat', '8A Akhwat', NULL, 1, '2026-10-22 07:29:53', '2026-10-22 07:29:53'),
(52, 6, 1, 1, 'E', 'campuran', '1E', 7, 1, '2026-10-23 07:37:28', '2026-10-23 07:37:42'),
(55, 10, 1, 1, 'B', 'campuran', '1B', 16, 1, '2026-10-26 05:52:27', '2026-10-26 05:53:14'),
(56, 8, 1, 2, 'A', 'campuran', '2A', 19, 1, '2026-10-26 06:37:03', '2026-10-26 06:42:16'),
(57, 8, 1, 3, 'A', 'campuran', '3A', 10, 1, '2026-10-26 06:37:09', '2026-10-26 06:42:16'),
(58, 8, 1, 4, 'A', 'ikhwan', '4A Ikhwan', 5, 1, '2026-10-26 06:37:31', '2026-10-26 06:42:16'),
(59, 8, 1, 4, 'A', 'akhwat', '4A Akhwat', 8, 1, '2026-10-26 06:37:31', '2026-10-26 06:42:16'),
(60, 8, 1, 5, 'A', 'ikhwan', '5A Ikhwan', 12, 1, '2026-10-26 06:37:39', '2026-10-26 06:42:16'),
(61, 8, 1, 5, 'A', 'akhwat', '5A Akhwat', 14, 1, '2026-10-26 06:37:39', '2026-10-26 06:42:16'),
(62, 8, 1, 6, 'A', 'ikhwan', '6A Ikhwan', 9, 1, '2026-10-26 06:37:48', '2026-10-26 06:42:16'),
(63, 8, 1, 6, 'A', 'akhwat', '6A Akhwat', 11, 1, '2026-10-26 06:37:49', '2026-10-26 06:42:16');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `siswa`
--

CREATE TABLE `siswa` (
  `id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nis` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nisn` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelas` int DEFAULT NULL,
  `sub` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wali_id` bigint UNSIGNED DEFAULT NULL,
  `tahun_ajaran_id` bigint UNSIGNED DEFAULT NULL,
  `is_processed` tinyint(1) NOT NULL DEFAULT '0',
  `is_graduated` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `siswa`
--

INSERT INTO `siswa` (`id`, `nama`, `kategori`, `nis`, `password`, `nisn`, `kelas`, `sub`, `wali_id`, `tahun_ajaran_id`, `is_processed`, `is_graduated`, `created_at`, `updated_at`) VALUES
(61, 'ADZRA IZZATUNNISA SYIFFA', 'akhwat', '24.2093', '$2y$12$dlcIqDlXeUXW2XMKr.hJiOCtniz13VodinKQUDY/LLWsc2YpQQaFi', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(62, 'Aisha Syifa Zulka', 'akhwat', '24.2094', '$2y$12$KiVP3XOwWBi2eQCrsSy6Q.GCbSPx8Kcy64KKJxI.0HdBVM7jkDZH6', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(63, 'Alvino ardiansyah', 'ikhwan', '24.2095', '$2y$12$ya0w8X2/W6.b6tp8uUbXPezLCzzKyNyuwxowunwrqV1XHVwtcKtzy', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(64, 'Arman Rafindra Kusuma', 'ikhwan', '24.2096', '$2y$12$/vD0xhTAOq/3znrG.R1mNO6NXhLd3wmWk0TDxpurEpUSAPGL0Tuga', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(65, 'Arsyila Inara Azizah', 'akhwat', '24.2097', '$2y$12$BAjMmQXm3Uji6Mebo11V/uffkfk2j5Z/8jHosGdgSWEqwWAhQJoNG', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(66, 'Ayska Falillah Zarin', 'ikhwan', '24.2098', '$2y$12$8vDWF6i79dHfgEBFJa7pPud4lj7kXKB37DG.gVL2yUfdK7oCeSVCS', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(67, 'Falih Aqmar Mulyadi', 'ikhwan', '24.2099', '$2y$12$6W5/Z8uKSA60fxoMw9Z0zuWmIgfXiQMKZU.JPyzVcCX3jT8XTLTq.', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(68, 'Gavindra Athaya Nugraha', 'ikhwan', '24.2100', '$2y$12$MqiMM4Ra.GGNROVbp7D4eOvTYDzHRrTfkm4vgp6cb/xWIgVu1beXa', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(69, 'Hana Andhira', 'akhwat', '24.2101', '$2y$12$d/Y7eR4mi6aFi5AS2jI89OmjC5m8Fsd88FHbrJpuVwPL6BD6GVvte', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(70, 'Hanan Ozil junior', 'ikhwan', '24.2102', '$2y$12$OPQ.VxZFzkqtJ/jdNo1p5eRFeWM7yNi9o329Z.nTQrT5bcTQkaWJG', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(71, 'HASYA SHIRIN KHAIRUNNISA', 'akhwat', '24.2103', '$2y$12$3iqh7MKqrS530ZDy12eThevgZo/PipkBqxprJsKsASE6AeY41XDxK', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(72, 'M.Akhtar Makhsum Dalimunthe', 'ikhwan', '24.2104', '$2y$12$SuhC3TuQShv7ZgmSCfqDDeMYyZhyCGFfT.Z7TYvIuQGfAch/kFZIa', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(73, 'MARYAM NAILA SAKHI', 'akhwat', '24.2105', '$2y$12$YrtmoTJEXznIw5jXmrvzbuSfFzy6UGcNVV7n9G1VUWeXYsM2xuFNG', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(74, 'Muhammad Aldric AlKafhi', 'ikhwan', '24.2106', '$2y$12$SkMoEuQAn7jiHvaMIyNPH.zg7Uq1MSHQlQz2rl6UOWhPHxt7Z1TQe', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(75, 'Muhammad Khaizan Al Daffa', 'ikhwan', '24.2107', '$2y$12$M3mJWKqaxUJUfMcjozKzZenvkqbIE2WCt0ju0XH1mahF7S1IPYPYy', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(76, 'MUHAMMAD RAYYAN HABIBI ANJEVI', 'ikhwan', '24.2108', '$2y$12$SyTXt5cqx9/2t5VHGr8OM..fS31Za0rVroh01Eb7auNCiubI0d3q.', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(77, 'Muhammad Rifky Anshar', 'ikhwan', '24.2109', '$2y$12$oai8jfp7tRbuS04XDuADzuoAE3c4nLrRwZzja2ShLhdtF2B9w/7.e', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(78, 'Naura Shakira Mecca', 'akhwat', '24.2110', '$2y$12$fmx2W6lOTtRGScA5PCOIq.GNauckt9WtMotBvI6U1fjX6cyUdautW', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(79, 'NUHA ZAFIRAH SYUKRIANTI', 'akhwat', '24.2111', '$2y$12$V2E6Wr72B82mDIgLUswaCu8K/yJQIYwfLlGI2PCq26WT8nQf17fqu', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(80, 'Putri Haniyya Qanita', 'akhwat', '24.2112', '$2y$12$sdgGuv/hEmSq3yqQD.wubep0AREPLFcoo8ySHW.4t.1lTuwMsW2P.', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(81, 'Rafania Sheza Rasyidah', 'akhwat', '24.2113', '$2y$12$oTJ2tuNI4p4RUuVAgQq3lei0fvf59O1RoHB390RHjJ/zLt4DoHgYy', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(82, 'Raffasya Alif Nugroho', 'ikhwan', '24.2114', '$2y$12$RfaR3rsHjGaW622PhPPRbuxsmySyEkHyFbio7.kfwh2K/NJQao6me', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(83, 'Rayya Adreena Mecca', 'akhwat', '24.2115', '$2y$12$dSw4vS0iNgdpGyD6h5yv..EvQ2XLDhkJx1M91Ifwq6J3QlEuaC8nC', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(84, 'Reyhan Abdullah Alfarizqi', 'ikhwan', '24.2116', '$2y$12$3RObdJzCyPvqUeZQ/DhkbuMpgFk4IpZGmucvfgyin883S1xqFPwPm', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(85, 'Roudhotul Jinan', 'akhwat', '24.2117', '$2y$12$xkxIMMoZs/.tH9f9JjgwteI92MxqhvGXB4S2iRPdOV2xUkbN5nNT2', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(86, 'Shakira Wakid', 'akhwat', '24.2118', '$2y$12$YIxbAd4hbDGr2KRcbROwA.p4/XvbsjRVX24Q8eAxOFW37e4clTWA2', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(87, 'Tanaya Qirani', 'akhwat', '24.2119', '$2y$12$GWvqp/ed2AEnlc80W.3zCuO8UyrAiRf5K.cUUIFF7dyTWDYPtNtDC', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(88, 'Tengku Danish Praditya', 'ikhwan', '24.2120', '$2y$12$NhWzaov5KLT00CIJslBemOID9YFPRDyZQA1jlU9dx50cVDqhV7Cba', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(89, 'Tengku Muhammad Fayyadh Azhari', 'ikhwan', '24.2121', '$2y$12$7wQURuHurxO6AT5oXHJXxuAVUFsxUa0QDHmHfW2afsmrtscbO3Nbi', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(90, 'ZAYYAN KHALID RAMADANI', 'ikhwan', '24.2122', '$2y$12$epeo6YZ1A7ErO3IYeFYe8.GGAh3euAYELKiLACs3kNN6J662bjfdS', NULL, 5, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(91, 'Aathirah Haisha Hanum Hanania', 'akhwat', '24.1968', '$2y$12$4I1qCfaOG3K89Z7Zh0bVaOLLrQTWlLn/oLp1PyHyVw.QHrTyHie6q', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(92, 'Abi Al Fatih', 'ikhwan', '24.1969', '$2y$12$gRYULKeirsMFjLrwvPIlQu6CtGWqCATB41F9tgi8AaET07wF0A8IS', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(93, 'Aditya Rifqi Pranaja', 'ikhwan', '24.1970', '$2y$12$RNEr.tr8pp5ln/1/Kw4hFOCqJlybXqTHldkRHj8Qh1t4qV3yMC0E6', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(94, 'Afsheena Aseqa Harfie', 'akhwat', '24.1971', '$2y$12$ktWITBGsAzgY5pF8e0dNmO8eo.tejd2v4R2/HGrAH9ZVUHUt/r5dm', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(95, 'Afzal Alfarizqi Mangoting', 'ikhwan', '24.1972', '$2y$12$5KbGbhXueB1HPK.KvBkNseJ89Ra4KRuBWCHQg/vWnuD/d6eOwtWeO', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(96, 'Ahmad Ishaq Putrac', 'ikhwan', '24.1973', '$2y$12$BRv5BOmK7Y.EEX.eGwYnWeUj0kKjlbmkC2USI5Ce5ehDDsXhMOkoa', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(97, 'Alesha Shahia Djohan', 'akhwat', '24.1974', '$2y$12$27PWxtChZIsYt.LqafOQNeTld0AJByb7UOO4ce.SA/CetDu8xnPHW', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(98, 'Al-fatih Syahri Ramadhan', 'ikhwan', '24.1975', '$2y$12$8bL1NVUsd7DzQ/iHd1pEvu9dAzOACEytzVifEGebPR9DYz/MkDpzS', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(99, 'Alifah Rumaisyah Adreenan Dlt', 'akhwat', '24.1976', '$2y$12$ZCmviXmtg3C./6S2qOplPuJe74arN2pJj9ApLbqn9P9C3lILVaqA2', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(100, 'Andi Neelam Adzkiya Putri', 'akhwat', '24.1977', '$2y$12$kt5p3d9zc89NH8lzlApciuUDYZev/brjQW4Ebexir3jaGTlSQScSG', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(101, 'Arjuna ahmad', 'ikhwan', '24.1978', '$2y$12$OEf8uKkf4zbDFGnjHxeVTufLjXbxqxHDwrLDIc4QeiiU14LNjokCu', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(102, 'Aruna Sachi Kayana', 'akhwat', '24.1979', '$2y$12$gw1uuo6ej12TG7kZ92qnoeuh8tBJ.V8c.vW1/qxcfl.Mcc5Lnpr.O', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(103, 'Asheeqa Alayyra Ari', 'akhwat', '24.1980', '$2y$12$apPvfawuEkvafXVRW3Gd2uh5rGCis9cGVTw7hy7jesZshmFH8yVom', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(104, 'Ashmita Kyra Firnando', 'akhwat', '24.1981', '$2y$12$6c2xMdfi.SRi/TQM3NN9ou/WlIvP7n0e/GpgQ8GO0wALG7nIuS2qS', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(105, 'Altafarrel Rahesya Hervint', 'ikhwan', '24.1982', '$2y$12$ZrsXr0IfLnkuLswXcaD9QewLOgaoJxmE6OB/WxeWdUGbhbGpBVO6q', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(106, 'Ceisya Almahyra Putri', 'akhwat', '24.1983', '$2y$12$syPXtM0xyYB4Vf3PPJ1haOx/ngM7k2AX8JEMkxEFs59s71j7Vp8OC', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(107, 'Dina Ayudia Sundoyo', 'akhwat', '24.1984', '$2y$12$Ro/AVi8rMF3F7Ib6MxZGpOWmGvYEdtlv4u0MZOOKF/OHUUylKowl2', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(108, 'Farzana Khalishah Sabhira', 'akhwat', '24.1985', '$2y$12$.L9tYd2/Sm9iYlR5ghGswOoKnQlU0tYzofVrGeT51h31DI3Eu6CN2', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(109, 'Feisya Farzana Al Anwari', 'akhwat', '24.1986', '$2y$12$sGMlcOEAcFxzN5DATzScUOoMYdPex31cfML5DOEEP/qUunEVJJY7e', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(110, 'Firaz Sulkhan', 'ikhwan', '24.1987', '$2y$12$aLcntSnVYjydnsbqCSXmf..Ogn5J9E83dqoJ.HuxMnTtdNE1FRfj2', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(111, 'Hasby putraevry', 'ikhwan', '24.1988', '$2y$12$N3MCbwZ7D0dgBs4h2flIV.vu7vShPx3hr/JuUj.bpLzrQcWQUVAty', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(112, 'Khalif Farisqy Arnes', 'ikhwan', '24.1989', '$2y$12$YxTiIjjOix.sO9bnzZt7I.2bbGWaP7wdkwYSaPkkRK67N2GR5KIUO', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(113, 'Mecca Mutiara Chaidir', 'akhwat', '24.1990', '$2y$12$j5SHtOpSBgWls3/98AuIw.oQy6huxombMWYKMLkVBwZDgsnZlyf6C', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(114, 'Muhammad Alvarendra Athaillah', 'ikhwan', '24.1991', '$2y$12$Iouys2QHYkyXK.ZQzthEXu.2fe3MZ/FFDjP/XN5kLjmWZUrw3fevC', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(115, 'Muhammad Arsya Malik Nugroho', 'ikhwan', '24.1992', '$2y$12$3M5QP/qQs1UCs9PFLvrMj.BtU576v3L3iHa.LMdjF3IQsJns3lREW', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(116, 'Muhammad Ferdi Abqory', 'ikhwan', '24.1993', '$2y$12$n5VRbtwHhUmCm8XbwW9XyO/IUZQE6J6zCkvi4.gp7wsBVDslRNlp2', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(117, 'Muhammad Galang Syahputra', 'ikhwan', '24.1994', '$2y$12$yitmGik421a1eP7QqmD63O3yAD28fy9UBYKdBVZcbROUyPP6FD9oO', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(118, 'Naureen Afsheen Ihsan', 'akhwat', '24.1995', '$2y$12$mOAx2.YutiePXdZW8rxxLeHg4ITbwfhsshSrWHYKi1Z..1XS43cq.', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(119, 'Nesyabila Putri', 'akhwat', '24.1996', '$2y$12$7y5L8dsrUSczytmcqOGK0.PDmwKGdH7ZRjzZYy1TJUT8Ia9bJzzIe', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(120, 'Puan Aurora Lailatul Qadr', 'akhwat', '24.1997', '$2y$12$LVs6ukCP4qoU2uBTyNUBN.kMVMgImWq8ICaJBEcueUCbsaO.z5m0e', NULL, 6, NULL, NULL, 6, 0, 0, '2026-07-13 16:36:52', '2026-10-22 06:58:31'),
(121, 'Abdillah Arkaan Alfarizqi', 'ikhwan', '23.1841', '$2y$12$HrGHSWRV0ciwV5Ub24Dsmew.kOhV73QthjgUPaLO/4CawEUiA12DO', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(122, 'Abdul Aziz Ali Hasan', 'ikhwan', '23.1842', '$2y$12$IFUbqzlFeo/riymMLNCTdetQ3eNNAX5.ryCdaR.ZMMxKsp8yNc.c.', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(123, 'Abdul Aziz Ruslilkirom', 'ikhwan', '23.1843', '$2y$12$lAZJbbXdAJW3kIogHmMeGu0EveWPaxm7tqdmzFL.35TBzRYzLRhHq', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(124, 'Abelian Naurasyafa Prasetyo', 'ikhwan', '23.1844', '$2y$12$qLzYWlEqsVK.7LlNYcoJ4.HfK3eVZtm0/8TFUwYkke7U.XWCTelOu', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(125, 'Adam Rasyid Azzaky', 'ikhwan', '23.1845', '$2y$12$XuRmyjkxETZwZy9cCopH0eOUCqenMGMQ/XOeLDt/onDcg20EY/ULy', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(126, 'Adiba Shakila', 'akhwat', '23.1846', '$2y$12$9Swm87dLUSn1J/RPGU7X.e3TEMvNeikVbnM9ErQaxsaV287jiNnma', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(127, 'Aisha Zalea Septilia', 'akhwat', '23.1848', '$2y$12$Rb.0h5Dl6UkACrhZyUyCSO5yI4gHs0SNYHSeTnKgMBfMkmG5d7r/e', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(128, 'Aisyah Silmi Afiqa', 'akhwat', '23.1849', '$2y$12$VWqJEJrw/JVQzgFyKCQlE.pP1dFQaut5roPU/Au2susKpg8/sHXue', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(129, 'Akhdan Albirrohman', 'ikhwan', '23.1850', '$2y$12$qbibXrsoUsLPXyBbYCgPYemUSwS8FiQglsO79d/J.EnOYF5UxX9WG', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(130, 'Alifa Hibatillah Zulka', 'akhwat', '23.1851', '$2y$12$TkepIowG8olhs6TXj4tA7.vyIbnBu3Z9Q3PvN/t5kpdxzdGxZCo.G', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(131, 'Aliyah Razan Fazilah', 'akhwat', '23.1852', '$2y$12$EofbqSIrC81ltmsH1Znjr.nPOZ5J.okLWLtXjpQuVg25oRJHM/jW6', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(132, 'Alvin aprilio', 'ikhwan', '23.1853', '$2y$12$EV0onzi0ElRMT9DXs9OECOL3pF3KkQc6wxtIluT2tjm1AcgsWO.C6', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(133, 'Andi Muaz Averroes', 'ikhwan', '23.1854', '$2y$12$P2v9FuLnBdVUEu9z.nESI.s.FGHoyznKaDjTHdTJK1T6MZ3ghBWSu', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(134, 'Arsyila Madiha', 'akhwat', '23.1855', '$2y$12$urcgmV6pqwanwm/atR/mU.Z/Ixi5bC1ufC7UrX0Cg.Wvx5V8Rvyha', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(135, 'Azzahra Rizhani Siregar', 'akhwat', '23.1856', '$2y$12$2ieWeHghEBV5aqQUwkLMXeEWOSR9sg2yI3o6LzkMIW8jBw2RJRNt6', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(136, 'Dhefin El Fatih Vydi', 'ikhwan', '23.1857', '$2y$12$2zz/kKSCxF1Ee/Gzuw/.UulRr3e5agQSbwaxM5utsA1tnPO7oQN62', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(137, 'Fathiyah Yasmin Abbassy', 'ikhwan', '23.1858', '$2y$12$m6k3ZMi93rI30jQnKcyGCeaDSh51qdKLBwHlGbeYk5Vl//DXKkHfm', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(138, 'Humaira Shaza Aqisya', 'akhwat', '23.1859', '$2y$12$k61hJ.TBIvsOh0kgHbGL.uxADU8rNvl1WfHl3/2A3enCe4uB12c/y', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(139, 'Irsyad Keitaro Digunov', 'ikhwan', '23.1860', '$2y$12$AbY7/nJgVnhwY1NNZK5mE.9bx.jJ4ixkga16itLQ8js3lWUHc8F2.', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(140, 'Khairunnisa Tasmina Yasmin', 'akhwat', '23.1861', '$2y$12$aofR7TMzNdbSO1iya3Hxn.aaOjKimY/IYz4Yaca6MStJEMXtx5vcu', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(141, 'Muhammad Afif Gani Putra', 'ikhwan', '23.1862', '$2y$12$DLRNCMJARao0vrAPoZDx2OQas7LNLWkHBNOYEVf4RV/0Kx.H3yiiy', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(142, 'MUHAMMAD ALI TSAQIB', 'ikhwan', '24.2092', '$2y$12$1gZm/4yfTHojmTCKpugiMuj7aOPDO9Nvbc3gEw3UU4qH/z9UNvWV6', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(143, 'Muhammad Haziq Zahran', 'ikhwan', '23.1863', '$2y$12$cAA0trCJNcn2nhV4PhC6iOAGaT5/ZFMVs7d29fIkQCr8oQB/Sl1TW', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(144, 'Muhammad Reynand Ritonga', 'ikhwan', '23.1864', '$2y$12$TIBgVK9z4tY0Ef5hMamzUeT4xZ98mpipnqjkl7RApVwzCn9p9AFrm', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(145, 'Muhammad Zaky Al Jahidi', 'ikhwan', '23.1865', '$2y$12$D.hBokZPK8GtWqbj7LghU.Y78d4aWpHHGGsvqgthFPNWFOKZ1fRjK', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(146, 'Nyimas Fakhira Nur Izzati', 'akhwat', '23.1866', '$2y$12$YdeT0Xhr98cVcOVXeOqhEO/L0g.cT79JGLb1staEMU/vYNrBm47dC', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(147, 'Raisha Ramadhani', 'akhwat', '23.1867', '$2y$12$RSFdOS0hJuO.OurH1wL4mOn8pXFpsn2SVePM5nYazf9NGw2bQQuye', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(148, 'Raisya Kamila Cahyanti', 'akhwat', '23.1868', '$2y$12$YXNHsHLXPdjmx8u/xrJDEus2U8vriKB64pSAwg1SOUNNP1mEx7QA6', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(149, 'Yahya Abdilhayyi', 'ikhwan', '23.1869', '$2y$12$uPo9Oxo8TEmiqHtFAVyDqeRXBDXnejFEWOFAOQOnWuRe8wb6ZpUQm', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(150, 'Zafira Athiyah Zulkarnain', 'akhwat', '23.1870', '$2y$12$Vm5Re1mYTbYLlBBD2hGLQeTL6L6YS7uSgN.MrPjv391UMs1m2JDLK', NULL, 3, NULL, NULL, 1, 0, 1, '2026-07-13 16:36:52', '2026-10-22 06:58:32'),
(151, 'Adella Putri Hermawab', NULL, '22.1718', '$2y$12$kvMnxi1aEjX8y8lFcjalcueaZg1KlR14TcbW3hrCefS1CG8I31NWe', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:28'),
(152, 'Aisha Hanna Maheswari', NULL, '22.1780', '$2y$12$ysuEAvrcMsrbkFeVZottZeO3WthJ3JZ2RYrwATbbvm4tJUP9t.7tW', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:29'),
(153, 'Aisyah Ayzzahrah Satrya', NULL, '22.1725', '$2y$12$9NfLwV4RwEXctUAgQOSa4.GHH2vInGP1scK5LJ3vknKS/P0LaiBAu', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:29'),
(154, 'Aisyah Nuha Zahira Ibrahim', NULL, '22.1726', '$2y$12$9gyQDqsCYAQrxZiODKC9jeHxKE3HLYOj6gkwJuigsTocR7tX7lci2', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:29'),
(155, 'Alesha Difatri Orlin', NULL, '22.1728', '$2y$12$VUwO3TpqBch5M.iFE3OnKeSmYtL2GTwcOjY8FWdhel4kn1Zc0TOki', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:29'),
(156, 'Alina Ziya Abidah', NULL, '22.1784', '$2y$12$Sg33h30l.f7rLOUDA.sujugdynX79rwCCBMueQaAU0aC/ap.nSRLa', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(157, 'Anisa Istiqamah', NULL, '22.1809', '$2y$12$jPVS3hLE6TYRX6JQYEbrUeEChYK3xIkDGK9Dqt0KToeVSUV9dFTOC', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(158, 'Annisa zhahira Agatia', NULL, '22.1730', '$2y$12$G9kU7rhJD7.nvYHVhw77COjzSqSi/OBVZat6VU8aEHWyPZYbYIzyy', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(159, 'Arsyila Adini Ramadhani', NULL, '22.1788', '$2y$12$zq0dD4QqG1waHFNmxjXMG.6OQpUABhMqD/67oVImQ8ZtHJa7fD1um', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(160, 'Askanah Havika Addia Putri', NULL, '22.1789', '$2y$12$UGq.jdgKeFFy6s8Sz37mduUT44CJZQVO1r0EX8tZXnrTnbbWJDy12', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:30'),
(161, 'Aulia Arsy Azzahra', NULL, '22.1811', '$2y$12$daKKUPTi0oknkWiW0AEkqOZNnuX23J5nDPnZcrV0f8HHirARc6FvK', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(162, 'Chayra Almuna Qotrunnada', NULL, '22.1791', '$2y$12$UU7FPrQinn0jOxsWstt6D.0NIcIly5d9Hf7NRVJnN9D3tAPMPRuza', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(163, 'Dzhiwi Naufalyn Maryam', NULL, '22.1750', '$2y$12$g8OSWakJghPzgpi7CK5Ha.//u0x/jSNxNZtR9DwPLwz.rxfpex2ym', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(164, 'Elena Adelia Syahla', NULL, '22.1751', '$2y$12$g3CDLnQUO6mJ0imm2Sg8AOGMi.Y/8aUUqTl5JHPB3zmHMUxd6XKf6', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(165, 'Fathin Amirah Lathifah', NULL, '22.1736', '$2y$12$A94Y.ZgpL9mRp8oHrTohs.Im1kHSpMvOHkb7PMNRzsT7FgOI5614K', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:31'),
(166, 'Hilya Humairah Bages', NULL, '22.1816', '$2y$12$/RbUuAMOlGlLvRksFSlWkuVdCQD3ENfcw4D5K6Nanv3zM3bM/GBa2', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:32'),
(167, 'Kamila Dania Mumtaza', NULL, '22.1755', '$2y$12$A5/N0LCHddvA0KtNZzRLyeUIc0IapMtRFoViggzz/z.wqbwfGmz/q', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:32'),
(168, 'Khaira Yumna Fariha', NULL, '22.1818', '$2y$12$XkSvSjqtyNbIVEXyfBNa2uuYOL/LkmowPr3Ef6Q20aaXw05FfQFFK', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:32'),
(169, 'Kiara Silmi Fatihah', NULL, '22.1819', '$2y$12$Dklsllk824EBi0KZlSXIZ.x6S3jvBO2U3tJVW80MipmKsOw.PMUdu', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:32'),
(170, 'Marsya Ayu Andini', NULL, '22.1822', '$2y$12$f58DV7Eoi7/r1YOj4vh59eL/qDeoZvMMI0Aou7S1D2ZZoj04aea0O', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(171, 'Nadine Queisha', NULL, '22.1764', '$2y$12$9Tp0oBC8e3ZEAjlqlSpzP.5LHGavsk9gWiB3M5eBUstj2j65UH2Ke', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(172, 'Nur Ayudia Azahra', NULL, '22.1766', '$2y$12$8Dg8lahQQwLzA9pf01MQ.uAbChR9vPH5WUr79rgQfW/M7b.O79Kpq', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(173, 'Shaheera Zevania Wijaya', NULL, '22.1803', '$2y$12$D.QpfLU6AehJ.w0XE6HBPuakb5SjQEovcWH267SSjGbUs30dB20o.', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(174, 'Shakila Azka Tanisha', NULL, '23.1964', '$2y$12$n6OvCNZO/oB4GAot/SUByu9hyntZggb3negSkCu/nNYcyVvSorR6G', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:33'),
(175, 'Shakila Lathifah Putri', NULL, '22.1775', '$2y$12$rnZ0XnhsHxqfp4BC4Ts.IuHO6ykONvvMCt8OQNLSpyFaF3D7ES31W', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(176, 'Syahira Naladhipa Arsyila', NULL, '22.1836', '$2y$12$AByXtsn1y.ff7VI4A2FcSOSdpR5x73z/sAF63kMofMFnnZAkJ0QpO', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(177, 'Vadelia Adeeva Inanda Purba', NULL, '22.1806', '$2y$12$Kw2lqzuNBIvOWqL4r6T53erK.wWD7af3ygyUVUsfRPrVEDvDbZ4c6', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(178, 'Varisha Putri Sulistia', NULL, '22.1837', '$2y$12$.GDzmNqrEFc3Shstki1SxOZhi.QfvW9zm.uxyqUs42JHzZNhxNx2a', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(179, 'Zaviera Ayudia Inara', NULL, '22.1807', '$2y$12$Ddsot7tGaHsbQi0q7U5Mvu/BNYi0M6DH4x94u1tWQs3bInKU3s3Fy', NULL, 4, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:34'),
(180, 'Adalyn Myesha Zara', NULL, '21.1577', '$2y$12$yFivLGEy/LhpNIxxOPFol.PaSXMokyVFr.iXzemZlwEoRd0ysdwni', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:35'),
(181, 'Adeeva Khoirunnisa Rois Kaimudin', NULL, '22.1713', '$2y$12$iKcfa3SyQCRccjUsESQ/qeHkdncKbnWRGXdnITcwFdnEsJmgchjfa', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:35'),
(182, 'Anbiya Khaliluna Neldi', NULL, '21.1671', '$2y$12$m/VOj2/18N2phQ5rQCxquOSD9TwdHzc8WeuDaC065mnxy0pugMoxa', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:35'),
(183, 'Andi Haura Amatillah', NULL, '21.1639', '$2y$12$odbaxVf4ZjzdFWmukPWr9.6s9.WLwD/mQNC/DIhyNILffbvTZ0V32', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:35'),
(184, 'Aquina Naima Febriawan', NULL, '21.1640', '$2y$12$auPWfXuiX1K9Eeqi5Og8MO12gHiq8fSGYxUyFBD74n8QjFzJwiPqK', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(185, 'Ardeeva Myesha Zaviera', NULL, '21.1611', '$2y$12$8jDtafzM7Gc14XBR6mCNZu3tCsJQmoHdGVSJhQBAdZ0yV7bYg.Tu2', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(186, 'Atiqa Qonita Hafizdhoh', NULL, '21.1641', '$2y$12$HPpYzUMbUZIhdtVSnvdsNezN9tw914SJg3jSq2y6bjv58BH2aPGtm', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(187, 'Bilqis Kinanti Golfany', NULL, '21.1614', '$2y$12$9yAeYFBi6.hkM2GuPx8ur.1e9JqTDfjY4NaNT1rA7zwPou0VcbNba', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(188, 'Caitlyn Myra Arsa', NULL, '21.1674', '$2y$12$G/xgs8lDAA925WyxS01RleYKF.Z9EaIySXmEGrQ3GZ3fiJjLqzXqe', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:36'),
(189, 'Chelsea Maisyara Salsabila', NULL, '21.1586', '$2y$12$eWKYgVJDfP6OxEFKsYxM3ekX7z3s.RNE/tTPnm/Dg0gp/EBPaVjBK', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(190, 'Dalisha Ceza Nuria', NULL, '22.1714', '$2y$12$S8K0KU.HgWsjXdF412z5OeuL0OXXfP3VcxtFZnY3hS8/cfTy1b1vq', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(191, 'Diomyra Faqihah Karimli', NULL, '21.1588', '$2y$12$K0M7yj05ZqgvcqD9JgyU1updLDv1FdL3Rgfgp/pTYWUvVYDetXBQC', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(192, 'Farraas Alaa Hifzhiya Robiyan', NULL, '21.1679', '$2y$12$PpvY3SuFFS6LjoT/iuwXXeOOZFhrGR2k.136tVNpGUkTgz9iz6YcO', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(193, 'Fatimah Azzahra', NULL, '21.1681', '$2y$12$H1BMuCnzWY4VxwnEj4FjyOJpOcOkKHVODx6ci2uFnsGMVDFJGvKTm', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:37'),
(194, 'Fildzah Athaya Rizal', NULL, '21.1590', '$2y$12$HAVAb1qC8JKOQQyiRkbzduMgvvrJqLxBKpqkueRxNdlIA1aALGVdq', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(195, 'Fionna Amira Salsabila', NULL, '21.1620', '$2y$12$kexEm1/J1Dtndy7SVZzn4uclDpBVS8cEHq6jlO08i/xF0YvZ0Fb6K', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(196, 'Hanisah Alifah', NULL, '21.1682', '$2y$12$uFt4.fE2kng/tRKDvnvsleV.Ld5Is1ooFFzzRTX/cyYRxxSQqZ70m', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(197, 'Hilya Nur Asy-Syifa', NULL, '21.1622', '$2y$12$9bxIOnEtccu8g2N1xmvZq.eHEhc4SymO96crFJK8RG/53H2IwuUFq', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(198, 'Husna Hayuning', NULL, '21.1651', '$2y$12$y.yc/w8Be87DcAeWye3OLOXAZhtbMvsa641HlBApOeQ84UqiGdDDe', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:38'),
(199, 'Khairunnisa Safwan Al Ghifari', NULL, '21.1685', '$2y$12$lgt/v0qferglevtqfM4.meevGuoKGVe1YmUWWOd2nFcyJasQVotiu', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:39'),
(200, 'Malala Mysha Marauleng Pawara', NULL, '21.1625', '$2y$12$E20LbmrFtyIXa3uEuew.8.4uOWMM2A8HwS7TN5yZOpoe18bYGjuuC', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:39'),
(201, 'Nabila Nuri Syahira', NULL, '21.1631', '$2y$12$JgmuvQ3iX.VUJb35BiA7BekTnrjz5EOLGS0ZI/lwwGlUIMSBI0o5q', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:39'),
(202, 'Nadhifah Alief Dytia', NULL, '22.1962', '$2y$12$S51DSjWWFBAAqlLvoyKy9ulWOyLVrQ3dLl.r7KLofZkX78nPDG2Q.', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:39'),
(203, 'Nafisah Putri Qairina', NULL, '21.1662', '$2y$12$.1qOvK6RF53Z9UzSvOey/uaxueJ2YOWeKfqPbmNIG1xyExUb2KoFu', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(204, 'Putri Erina Zafira', NULL, '21.1601', '$2y$12$28R38z.fKFiMEbo/.P9F8.8nvBGgPgYP8./4vkyw/7NHpf6hbFSC.', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(205, 'Rainvalov Adirah Queenov', NULL, '21.1695', '$2y$12$qqWmctnIsybxZn/J38plquTI61Qe1uOChUQHJo0jvAdbNwMf6iRCy', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(206, 'Raisha earlyta shaki', NULL, '21.1602', '$2y$12$XlfQqeTT20BP6lqYSb.H3OhVCBR1zzRDErQDWA8RFPKl6P6z8bO5a', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(207, 'Shanum Ranamia', NULL, '24.2091', '$2y$12$2cKsHM9GPEggwJCcC5mbW.1mhXdEcpgFsvLU/3MP9ahX0Q.LNAEQ2', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:40'),
(208, 'Siti Hafizhah Sahra', NULL, '21.1603', '$2y$12$28IGMoMI8OnL5lOM0J0Qp.yIsYyGlGsT94Q/dW0DwIO1jsXrJc4gy', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(209, 'Sri Ufaira BilQis', NULL, '21.1699', '$2y$12$zQCixeNY9mqYDE46QUN4qeYJx0rU3xrOWpYcgUx99e6.dHtidemx2', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(210, 'Syakila khansa Rafani Akbar', NULL, '21.1605', '$2y$12$HqlBBZ9VxzllgCF17MfkVurjjmcf2ew9uYI2jRG694tzZdpJHIaUi', NULL, 5, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(211, 'ABIDAH FAIQAH', NULL, '20.1477', '$2y$12$wip5ubVCb/xaVI8ZiC3C9e0fVbxrkihZzcC0obwhK/bbQPRU3DxJW', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(212, 'ADZRA KIRANA', NULL, '20.1507', '$2y$12$nRBhLcWzySPpsUBuJAjtM.8iiu/6aTiBtdY0W0tjI5hahrGjlWXle', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:41'),
(213, 'AFIFAH BALQIS AZIMARSONO', NULL, '20.1446', '$2y$12$LI2OtRwMNQFF7MQYmDlqNeM9rLd/pD5xVfJC5XN1v8Kb1vmegeJ9C', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:42'),
(214, 'ALIFAH RAISA BADRI', NULL, '20.1447', '$2y$12$B7RcM9pvAlbNvoyTqv59fuXfvO5xwTA25zXiX9k2saP55e/30ZL0O', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:42'),
(215, 'ALYA MAHIRA HASNA', NULL, '20.1481', '$2y$12$vnG6nh4wKVtPaXZNkWb5S.j5WcxIUWoRXzRioWWndMxwMLmiiNfjO', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:42'),
(216, 'ALYSSA NAILA PUTRI ARIF', NULL, '20.1541', '$2y$12$SNmMf8LyCU2U78N7XBYaOe0rU9d1GTcmWNNffZtRJOWzEhPVg6qbi', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:42'),
(217, 'AQILA TUNNISA QARIAH', NULL, '20.1448', '$2y$12$0RyWRCJeRovIx3SC247RyuxnMWKZLv.69Y8cOxZa3uGCIbM3.CdqK', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(218, 'Assyifa Sauqina Pranajaya', NULL, '22.1960', '$2y$12$1WpasabV7R0kMlI.zpfQfea22r.n4VTD9d2PyErkVhggUrOjH6UWS', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(219, 'CEISYA DINARA ARIFAH', NULL, '20.1483', '$2y$12$nzEHQPd4rd8cHCu6OyDXhO.mDkyNA/gw8gZJ1xV6UOeI7FCpxphDq', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(220, 'DIANDREA ASFA ZARANADA', NULL, '20.1516', '$2y$12$xQQNsza69nKgO3TeDOCXxuqdbpvbCLoGRsRrkrl1qaHJaWRxBfzfi', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(221, 'DZAKIRA YOSIKA', NULL, '20.1545', '$2y$12$OEDXEGfIoxbwJE/zVPyP0uRBl2H8nFMLlhLwdZwkLICDhYGxR3/FS', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:43'),
(222, 'GHOZIYAH JILAN SUCIAWAN', NULL, '20.1486', '$2y$12$10C9GwUb/jsru62kTPl33eGpfqzu6UITfzb.B4PC3bc4EBXNO2kmm', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(223, 'KAISA THAFANA HARAHAP', NULL, '20.1458', '$2y$12$kdXcCmMoYdBV8UJce3Ig.eoKQ3EDn.l4OFxo1jepYMiSkt326kqbO', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(224, 'KHANSA SANIYAH', NULL, '20.1550', '$2y$12$sCbbYntzX8V5ZFBYIDhADu5lRIkKuxOVCh/umXxTgf0i1kCHal2Se', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(225, 'KIANINARA QAIREENSUPRIADI', NULL, '20.1524', '$2y$12$Z8EJkbw9FBjaLkl1TiqlKOmwAKuoEwmDLbJduJ4cuzeeir5mUV0cC', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(226, 'LUTHFIA ZAHRA THALITA', NULL, '20.1525', '$2y$12$S0FtIhvdn2EJshSKSPTbWOXXa6roxGsokgNYPlCATJdo7ZH/MzctO', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:44'),
(227, 'MALAIKA NAFEEZA AL-KHOIR', NULL, '20.1462', '$2y$12$USWGGCL.YHNMyAFILZMnxutKE7iZpJWgTBQKf5EKrsCX2wpg8pBjy', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:45'),
(228, 'NADHIFAH SYAKIRA QUEENSYAH', NULL, '20.1558', '$2y$12$2Z5YHnFuZ/EuOyv0SlWonucOfTcPtesu2LWtk6RC7DMP.IkrQL5be', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:45'),
(229, 'NUR SYAH MURNI', NULL, '20.1561', '$2y$12$016.w.cQ3FF2f5MJlJOFlOmTcwiZiYR7ONWENglJ5B93CHX8V.a32', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:45'),
(230, 'NURMAYDA AINI DWI PRATIWI', NULL, '20.1529', '$2y$12$eBjK7ukRykn1NBMsSEljmOopSmltHKid3FujTvGXnNi6Kd8ImwuxC', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:45'),
(231, 'PUTRI ZAHRA FARIHA', NULL, '20.1530', '$2y$12$foAimSvXk87XVg6iZpVa5uu0WBgXfnrL7vvA8N6tI/PJTAo3Xv.py', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(232, 'R.FIONA TRISHA MAULANA', NULL, '20.1562', '$2y$12$ccUFASlEWyLUXvbpIZw6U.7phP8rAnZCrIwdpNIUbKmX0S64iY/RS', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(233, 'RAISA ANANDA USKARA', NULL, '20.1564', '$2y$12$09c0BTeAEJbemnPiL2CoUuvXOcyt9bGGI2fSu.b.2HPO3a5d85.eq', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(234, 'REVALINA PUTRI SULISTIA', NULL, '20.1472', '$2y$12$3qK9FNALLPyb3qU0DeS03edpVsHfZOyGulbOg1jSsfCJhCv2uY646', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(235, 'SALSABILA AZZAHRA SASMITA', NULL, '20.1502', '$2y$12$uDnFxLS6RGqYxIWtcQcUYudIU2APW3WzdMmiW5VyitdQFy.pyxJuq', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:46'),
(236, 'ZAHIRA RAHMANIA', NULL, '20.1475', '$2y$12$MjV33dwLiFBryjCtdlq0JuBkJti6B4.G3nfjZSJOOGbLb5Ra1k9DS', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:47'),
(237, 'ZAKIRA TANIA RAHMADINY', NULL, '20.1535', '$2y$12$osotOw9j5CvazOjRm8uaGebFqjr3lRFXsd.J5OJQkDPWLqoVXfXVy', NULL, 6, NULL, NULL, 1, 0, 0, '2026-07-13 16:36:52', '2026-07-30 01:52:47'),
(240, 'Aditya Pratama', 'ikhwan', '43434', '$2y$12$6HeGQTnB5DNb0YsFsoeCrOyxRZWGb6bcBvyNLUtBp.aSDxI540z8m', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:21:44', '2026-10-22 07:06:01'),
(241, 'Bayu Nugroho', 'ikhwan', '2026003', '$2y$12$h2UGTtN9e//qVhWlpX9zn.98DqTqAm24kz2hQgXtInWTI.EtF1uD.', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:24:45', '2026-10-22 07:06:08'),
(242, 'Budi Santoso', 'ikhwan', '2026004', '$2y$12$7f1iotL7HqjmNPLWwuzn6.4xiiuoRGXhdZMx.Xfz4h73JAmwSMJqy', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:24:46', '2026-10-22 07:06:10'),
(243, 'Catur Wibowo', 'ikhwan', '2026005', '$2y$12$LIHWWxKedkUT0ig9SqoaSeXOxTBF/7zyWpXoMmMrcdu1UQgS6BesS', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:24:48', '2026-10-22 07:06:12'),
(244, 'Dimas Anggara', 'ikhwan', '2026006', '$2y$12$lQbN.DGm2L4duUKuJbNybuk.kA2ZK1v44pwonLM4fjk83ejpTQjFu', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:24:49', '2026-10-22 07:06:15'),
(245, 'Dwi Ningsih', 'akhwat', '2026007', '$2y$12$oBWyhMiMLBB0hnfTzRGVNeZqXNYcpi5ZrEK0Wk5SULv5XRIZYjbQ2', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:24:50', '2026-10-22 07:06:17'),
(246, 'Eko Prasetyo', 'ikhwan', '2026008', '$2y$12$DNfOSd4L/k2vd8Q.7dFI/eDj.Xzn6b00k6kSZvdQEHIuMgyOj03Z.', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:24:54', '2026-10-22 07:06:20'),
(247, 'Fitriani', 'akhwat', '2026009', '$2y$12$8bMk2p/togq/ivfiOUomdO1OKe3i5KB64hsES8WPiIl5.rVWNy29e', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:24:57', '2026-10-22 07:06:32'),
(248, 'Hendra Gunawan', 'ikhwan', '2026010', '$2y$12$LWZQLMd05quDyw9DH8JiD.xb6t.8pNZidp8j4U0FLRb11AyU/3DHq', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:24:59', '2026-10-22 07:06:37'),
(249, 'Ayu Wandira', 'akhwat', '2026002', '$2y$12$HI3Vl1sIowKXDuySpmazc.Dp4GkIjUWiCOpvvD6zVZZtoXN4WiK6W', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:25:01', '2026-10-22 07:06:05'),
(250, 'Indah Permatasari', 'akhwat', '2026011', '$2y$12$8rflxyOc5gICOMcnGOHTIe0OPVmryD0zZyklZFzFtJi4hUq0v6JBe', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:25:36', '2026-10-22 07:06:41'),
(251, 'Joko Anwar', 'ikhwan', '2026012', '$2y$12$vjhc8q4wvKqT8I/BNV9C3uUCnp9sjNiNdBjopsrdRKCm/3gwoSgxS', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:25:38', '2026-10-22 07:06:46'),
(252, 'Kartika Putri', 'akhwat', '2026013', '$2y$12$3.v.4L6cEdXlsVigfGzsNOWIV70IAtFR7F7TRBMvOAuZGLP6w.8fy', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:25:40', '2026-10-22 07:06:49'),
(253, 'Maya Sari', 'akhwat', '2026015', '$2y$12$iN5RJA4P6xSoHOzJBco.seJ2SiXqD0EkUwUZEXwYqAbAy6xJvErz2', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:25:40', '2026-10-22 07:06:56'),
(254, 'Lestari', 'akhwat', '2026014', '$2y$12$FkvEIDZPin2bmi9GqI6FV.uaGb/K2pu6tvT8SZGC6oekOix8hGMcy', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:25:44', '2026-10-22 07:06:53'),
(255, 'Muhammad Ali', 'ikhwan', '2026016', '$2y$12$Hl6Hn9OVLq12xV3m8M6at.aA9Y.NmmsspCgJwWtGpsag0A/9dLt1K', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:26:48', '2026-10-22 07:07:00'),
(256, 'Nita Kumala', 'akhwat', '2026017', '$2y$12$erOt8s/lQHNml2vUbmT47ezfmngGeoWAdper5gsyF2X0QGI5gY2.S', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:26:50', '2026-10-22 07:07:02'),
(257, 'Nurul Hidayah', 'akhwat', '2026018', '$2y$12$8svtqfgmxR30kpzdfZ/f9ux14xNKrjq93WM4nfVixKyFK7PGzQ4bG', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:26:52', '2026-10-22 07:07:28'),
(258, 'Panca Putra', 'ikhwan', '2026019', '$2y$12$xxDRY2qrdbkRZCgSXXoTHOuCV8gM.NxKw5XPqDfxVVb4rkaevkhXu', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:26:53', '2026-10-22 07:07:30'),
(259, 'Ratna Sari', 'akhwat', '2026020', '$2y$12$5swVAoMoEw4EQn7dU9YOnuxkhFXX3cxHLN79naG0u3hypGRarUVe6', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:26:56', '2026-10-22 07:07:46'),
(260, 'Reza Rahadian', 'ikhwan', '2026021', '$2y$12$f7a3yZIgc/4/tSNWrf2tPeFAPTzot4IoeLusrt032p2.KNmaEB9/K', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:26:57', '2026-10-22 07:07:49'),
(261, 'Rina Wati', 'akhwat', '2026022', '$2y$12$UecAGRHjL3GK8xClNxhuOOOXGxzpWZ46PhX3nbfL3o3yGsXvZVYZ6', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:26:59', '2026-10-22 07:07:52'),
(262, 'Rini Yulianti', 'akhwat', '2026023', '$2y$12$BrYeT.FheX/Qj21VEOWc2.UoCgcNKOjSAjyT2BdDUd/hI45K/1SNG', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:27:01', '2026-10-22 07:07:56'),
(263, 'Rizky Maulana', 'ikhwan', '2026024', '$2y$12$MFNLJf96/S0b4W7HpMsPyuwBFSVxFYbDq5h5jHzmRcDYx.PGtQSRi', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:27:03', '2026-10-22 07:07:59'),
(264, 'Siti Aminah', 'akhwat', '2026025', '$2y$12$elg8nEnIB/RBQnxuxH1E8.Veo6168fINq3uQQcQGp0lpwlHJ1fpjW', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:27:05', '2026-10-22 07:08:01'),
(265, 'Surya Dharma', 'ikhwan', '2026026', '$2y$12$8t0SmWkyyx1MMJDKyIeLJOmVqN6Te5oJgvsrD56QUXHEuLjIsrI..', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:27:31', '2026-10-22 07:08:06'),
(266, 'Taufik Hidayat', 'ikhwan', '2026027', '$2y$12$VHqzJ6tmejzIND1ScRkJFuwmqHyZ4FAO9Twnw3xh45oLJZnh5ngwO', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:27:32', '2026-10-22 07:08:09'),
(267, 'Tri Handayani', 'akhwat', '2026028', '$2y$12$0gLYNPiMLUjMSMnyrTc4xuOcJe6afKvcchmmO2lQXJH47f67vVLKm', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:27:34', '2026-10-22 07:08:14'),
(268, 'Wahyu Hidayat', 'ikhwan', '2026029', '$2y$12$Kx57EH0DjMzcZmhaVV3rMelFADXYs0UtOIhGsc2EXKhUxovnF1pK.', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:27:36', '2026-10-22 07:08:17'),
(269, 'Yuni Shara', 'akhwat', '2026030', '$2y$12$/h26Uwpeo6zSgpePbYKNgeF4pRCLxP4xyw1KDhDUkHxddukwfZNQi', NULL, 4, NULL, NULL, 6, 0, 0, '2026-07-13 17:27:39', '2026-10-22 07:08:21'),
(270, 'Joko Susilo', NULL, '2027001', '$2y$12$SYJTLFWRks6WL1x7arT1VO8rJGndby21hP5l55148AsngA09HQ0DK', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:00', '2026-10-22 06:58:32'),
(271, 'Kartika Sari', NULL, '2027002', '$2y$12$yhquZ4hFKucDN/Zh.bQxXOx/lJG.IZEWe8LJP6gpA..QX9pIvicTm', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:04', '2026-10-22 06:58:32'),
(272, 'Lukman Hakim', NULL, '2027003', '$2y$12$TfLDSLLpONInWgUdDcrLLui5rAcmr21gtb7yXVgbSGurg3XqO7mZW', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:10', '2026-10-22 06:58:32'),
(273, 'Melati Putri', NULL, '2027004', '$2y$12$1vDG3UY.aj93j.9nKckFbugu3kS7u04FdnC4cygw/CwhLYPWEi2OC', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:11', '2026-10-22 06:58:32'),
(274, 'Nanda Pratiwi', NULL, '2027005', '$2y$12$vlgPjh3f.6KeWsOeDwnmhOYSRvGDC.CejfS80/QhKJ4EJLQGn4.mG', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:14', '2026-10-22 06:58:32'),
(275, 'Oki Setiawan', NULL, '2027006', '$2y$12$mqHq/Hwbd5d4YXButmoXJObOfW4guns9cAwblV174/UbKzuAqtskW', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:16', '2026-10-22 06:58:32'),
(276, 'Putri Ayuningsih', NULL, '2027007', '$2y$12$CFCWC/DKayR/4E9JdhY2uem.PhEI55UNR0YtChufDptTBT9ti1Nme', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:18', '2026-10-22 06:58:32'),
(277, 'Rendra Kurniawan', NULL, '2027008', '$2y$12$/zcm48CnfeUB77zJCOKDA.RYFtAYxBjIToPXhCcYoyvcPQ2u6yBnC', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:20', '2026-10-22 06:58:32'),
(278, 'Siti Rahmawati', NULL, '2027009', '$2y$12$34MYS0RdGwwi3M4n6gwWK.S1AtH07wtqZt0creH9aj0YmH5K2nhiO', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:22', '2026-10-22 06:58:32'),
(279, 'Taufik Hidayat', NULL, '2027010', '$2y$12$HrNdo4/QPslTdno4snEBHelyk2sLopXtc7MFQmp5zJMAnZVHn0Oca', NULL, 3, NULL, NULL, 6, 0, 0, '2026-07-14 02:40:24', '2026-10-22 06:58:32'),
(280, 'Ahmad Fadli', NULL, '2028001', '$2y$12$MCZeYTtGA92oy1JFrvm7x.BYsT5iL.sRgyM3LHRx9Lwb2AA7P40YC', NULL, 2, NULL, NULL, 6, 0, 0, '2026-07-16 03:05:48', '2026-10-22 06:58:32'),
(281, 'Muhammad Alif', NULL, '2028002', '$2y$12$9s0.KFHyHNsv7T1zEJqfTOPWevYa1OaGnkxlHxi1kVg/ouHVxjF4m', NULL, 2, NULL, NULL, 6, 0, 0, '2026-07-16 03:05:51', '2026-10-22 06:58:32'),
(282, 'Nabila Azzahra', NULL, '2028003', '$2y$12$9WwM6A1Cb9KdKoS8PdTzG.uPRysODBBI5jZedSROqQyVPkWyPzk56', NULL, 2, NULL, NULL, 6, 0, 0, '2026-07-16 03:05:58', '2026-10-22 06:58:32'),
(283, 'Rizky Maulana', NULL, '2028004', '$2y$12$OFsd9.NuM0Ipy4Mn0JXYGOuU8qpvYX08g2vdByfhVid2PYLe4p4Ta', NULL, 2, NULL, NULL, 6, 0, 0, '2026-07-16 03:06:01', '2026-10-22 06:58:32'),
(284, 'Siti Zahra', NULL, '2028005', '$2y$12$W/EpQ3W2iNzvPzh4AxYP5Op9iHKtWp0AQcMClMmOniZEU74vy9DOm', NULL, 2, NULL, NULL, 6, 0, 0, '2026-07-16 03:06:04', '2026-10-22 06:58:32'),
(286, 'Aisyah Humaira (Siswa Tes SMP)', 'akhwat', '2627001', '$2y$12$ictqkfqYNFMe1dww7L2jkOWWA2GmG5W/XiNxxZ/oNAmFap.AizozO', NULL, 7, NULL, NULL, NULL, 0, 0, '2026-10-20 03:55:35', '2026-10-21 01:54:09'),
(287, 'Muhammad Fatih (Siswa Tes SMP)', 'ikhwan', '2627002', '$2y$12$pkSsNztAHW2TJde/7CMhWeLXoMdBNS2/819VjHs4C5sDZHrGSBcye', NULL, 7, NULL, NULL, NULL, 0, 0, '2026-10-20 03:55:53', '2026-10-21 01:54:09'),
(288, 'Fathimah Azzahra (Siswa Tes SMA)', 'akhwat', '2637001', '$2y$12$8rqIxx4s1U57NWeanuzGIOTRBPu6XnZEunNOBg/2hYEC22B5bso0G', NULL, 10, NULL, NULL, NULL, 0, 0, '2026-10-20 03:57:57', '2026-10-21 01:54:10'),
(289, 'Zaid bin Tsabit (Siswa Tes SMA)', 'ikhwan', '2637002', '$2y$12$dCWJbgoZQnAx0KiFubKtJuJ0ZWt53pRmiV2Zw1t1/LoJ8I/5x7Kyy', NULL, 10, NULL, NULL, NULL, 0, 0, '2026-10-20 03:58:13', '2026-10-21 01:54:10');

-- --------------------------------------------------------

--
-- Table structure for table `siswas`
--

CREATE TABLE `siswas` (
  `id` bigint UNSIGNED NOT NULL,
  `nama_user` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kategori` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenjang_id` bigint UNSIGNED DEFAULT NULL,
  `kelas` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_kelas` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nis` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `ppdb_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nisn` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_processed` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `siswas`
--

INSERT INTO `siswas` (`id`, `nama_user`, `kategori`, `jenjang_id`, `kelas`, `sub_kelas`, `nis`, `password`, `created_at`, `updated_at`, `ppdb_id`, `nisn`, `is_processed`) VALUES
(1, 'Aditya Pratama', NULL, 1, '1', 'A', '43434', '$2y$12$mjLTDOU7I76tEFT9sUAvce2GLwSyuHfEdBe8mvNa8Q4I42HYhE4MW', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-001', NULL, 1),
(2, 'Ayu Wandira', NULL, 1, '1', 'A', '2026002', '$2y$12$dV6qwi4Zx2phD.M72rja.eTkN0Qi0mdewsvlGYLNVfxWqyc7ID.4u', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-002', NULL, 1),
(3, 'Budi Santoso', NULL, 1, '1', 'A', '2026004', '$2y$12$7nKcQuQVxcv5I.gEXEL0Z.Ns0iT86oiAvJu/GGsiPzVB1bPEUQGgC', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-003', NULL, 1),
(4, 'Bayu Nugroho', NULL, 1, '1', 'A', '2026003', '$2y$12$h3RjgPRKwYkzXsPGSzDNsOUnF0Eg3V2sT0tDz4dlwq.nNZ3uN3/4K', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-004', NULL, 1),
(5, 'Catur Wibowo', NULL, 1, '1', 'A', '2026005', '$2y$12$EIu2Q25Myk/Ap7z75U44xeAHwv9Vo5yY3MrwlYrwfakgDVpwPFrDO', '2026-07-13 17:03:57', '2026-07-30 01:52:57', 'PPDB-2026-005', NULL, 1),
(6, 'Dimas Anggara', NULL, 1, '1', 'A', '2026006', '$2y$12$OlQ8aphu5epZThbzKcmMaeBZqMtbti/CIaa.dtysZQlzVwh6zpBJG', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-006', NULL, 1),
(7, 'Dwi Ningsih', NULL, 1, '1', 'A', '2026007', '$2y$12$9LZLagv0xS1ImY.sUGe.Q.koK3TW5WgCgqDR7Oasgb8.moJL9p6vW', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-007', NULL, 1),
(8, 'Eko Prasetyo', NULL, 1, '1', 'A', '2026008', '$2y$12$dOXT5zn.wJesO3sZmtFMveaPGccGP.jJTiGp2oJeidMKU0CJc6um2', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-008', NULL, 1),
(9, 'Fitriani', NULL, 1, '1', 'A', '2026009', '$2y$12$LFekqiEHKcQmGhDx56piTunUxqmdUHeFt5XEsqWjfa/FIoKfflHEi', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-009', NULL, 1),
(10, 'Hendra Gunawan', NULL, 1, '1', 'A', '2026010', '$2y$12$H9/qMI0IR4Qz7qdOG.0yaeHKEepFiYo752uv.G26uGvezyIw7xs3O', '2026-07-13 17:03:57', '2026-07-30 01:52:58', 'PPDB-2026-0010', NULL, 1),
(11, 'Indah Permatasari', NULL, 1, '1', 'A', '2026011', '$2y$12$bbeb09jpigyxb4w7tGZi0.V5szfv9ho2eGB6Bv1VEXsWcbVOQb676', '2026-07-13 17:03:57', '2026-07-30 01:52:59', 'PPDB-2026-0011', NULL, 1),
(12, 'Joko Anwar', NULL, 1, '1', 'A', '2026012', '$2y$12$.xsFfUxh.0Am0t.iXQFXHO4tMJ21nNNSXUWcuB5B7aHdT0riJ/BHW', '2026-07-13 17:03:57', '2026-07-30 01:52:59', 'PPDB-2026-0012', NULL, 1),
(13, 'Kartika Putri', NULL, 1, '1', 'A', '2026013', '$2y$12$KGGnrMBKc8sUyEXaP88/u.1J.QqlfUq21jlA6SWG1XroYdBynnp2q', '2026-07-13 17:03:57', '2026-07-30 01:52:59', 'PPDB-2026-0013', NULL, 1),
(14, 'Lestari', NULL, 1, '1', 'A', '2026014', '$2y$12$qXBI46Fmxzt.KdykMCDDQulJauLqhE9TAiC0fEnHQfygK/Nxm/tfq', '2026-07-13 17:03:57', '2026-07-30 01:52:59', 'PPDB-2026-0014', NULL, 1),
(15, 'Muhammad Ali', NULL, 1, '1', 'B', '2026016', '$2y$12$Y/i5LWQIpxBBu5Zo0qKve.AuXLGgaeWPmAnTucho9CjB3vS1IJ92.', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0015', NULL, 1),
(16, 'Maya Sari', NULL, 1, '1', 'A', '2026015', '$2y$12$ZIbeJz4eold6vpBOlU01Zu9cnGVgMx/oOK6S6ib9SYvynSubWFgF.', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0016', NULL, 1),
(17, 'Nurul Hidayah', NULL, 1, '1', 'B', '2026018', '$2y$12$js/bpF4guxFcoagXL0/mMOdYY7oYm6mH5zSzDGRHj0t.Z62F6mW5O', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0017', NULL, 1),
(18, 'Nita Kumala', NULL, 1, '1', 'B', '2026017', '$2y$12$MvUXA2gcVXZCSfvKTx0I0O4APu9Mpj9H27nKF6b.y.EYxKzp6j01y', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0018', NULL, 1),
(19, 'Panca Putra', NULL, 1, '1', 'B', '2026019', '$2y$12$Cyvy2DdZxiwt4pHOBwdeU.X/cTnpSmAzEuafqoxciyWTMeifAbKdK', '2026-07-13 17:03:57', '2026-07-30 01:53:00', 'PPDB-2026-0019', NULL, 1),
(20, 'Ratna Sari', NULL, 1, '1', 'B', '2026020', '$2y$12$uEiEnFe1GLbfmFRCUWbfKOqL4p3gyTYDhOhV.yeYwBOlZfmwS4vsO', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0020', NULL, 1),
(21, 'Rina Wati', NULL, 1, '1', 'B', '2026022', '$2y$12$RFHkD7yMfYx/NBhtVk.Qne/7B8nQO1wTFf926/bx.t30ZVr02kDvu', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0021', NULL, 1),
(22, 'Reza Rahadian', NULL, 1, '1', 'B', '2026021', '$2y$12$J/9v2lnhBjBrp27Pi4jxo.11xvDc6UW3NbH.22J5kS2V.jS2ZVDxG', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0022', NULL, 1),
(23, 'Rizky Maulana', NULL, 1, '1', 'B', '2026024', '$2y$12$3HLTzIh1jqeuJm3EAIArN.6oesBOHSL1ei49uxr.yzIa1h.ETBtR6', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0023', NULL, 1),
(24, 'Rini Yulianti', NULL, 1, '1', 'B', '2026023', '$2y$12$FwOkg04O5ejW.cUUmL9UReFFL8t1cVXsfHCb8uwypZjfI0dDZmyLG', '2026-07-13 17:03:57', '2026-07-30 01:53:01', 'PPDB-2026-0024', NULL, 1),
(25, 'Siti Aminah', NULL, 1, '1', 'B', '2026025', '$2y$12$fYx/ABC.oADphO8PXmjnbeNqueuonqOAqTOYtbHAf/kEOzSNkWdNG', '2026-07-13 17:03:57', '2026-07-30 01:53:02', 'PPDB-2026-0025', NULL, 1),
(26, 'Surya Dharma', NULL, 1, '1', 'B', '2026026', '$2y$12$beh77dTsfwvg5c.5QX7gf.p6yzbH8pBnsH8zWqpcJehwxdq/9sMLy', '2026-07-13 17:03:57', '2026-07-30 01:53:02', 'PPDB-2026-0026', NULL, 1),
(27, 'Tri Handayani', NULL, 1, '1', 'B', '2026028', '$2y$12$EM5iWF3Vd3qhrXDNq6f.uu4IaxW.qJCHXRCfZHsZ2BytnQz2pjReG', '2026-07-13 17:03:57', '2026-07-30 01:53:02', 'PPDB-2026-0027', NULL, 1),
(28, 'Taufik Hidayat', NULL, 1, '1', 'B', '2026027', '$2y$12$ciGaUHH8uVNxKAWLgIqxAu9bjDdov38MN8IcLLfeWs1rxSSTQ1dZi', '2026-07-13 17:03:57', '2026-07-30 01:53:02', 'PPDB-2026-0028', NULL, 1),
(29, 'Wahyu Hidayat', NULL, 1, '1', 'B', '2026029', '$2y$12$O9WZiClbOK70K/uyU0zXtOqya2IlCtLbaXT77fsyUWSW6FkBAQIHK', '2026-07-13 17:03:57', '2026-07-30 01:53:03', 'PPDB-2026-0029', NULL, 1),
(30, 'Yuni Shara', NULL, 1, '1', 'B', '2026030', '$2y$12$6s3MeeFlom1IlKSdPOQb/Of/jMQuGsS6VB30nCfdV3FGVII/H/Fz.', '2026-07-13 17:03:57', '2026-07-30 01:53:03', 'PPDB-2026-0030', NULL, 1),
(31, 'Joko Susilo', NULL, 1, '1', 'A', '2027001', '$2y$12$d4MGRR.mgGq/o20J.ObYVOli1BURYVZ1ZBclJ4twg5xjnhIGK.lwC', '2026-07-14 01:53:06', '2026-07-30 01:53:03', 'PPDB-2026-0031', NULL, 1),
(32, 'Kartika Sari', NULL, 1, '1', 'A', '2027002', '$2y$12$z3XaJ01XMCgRgnyqxogKrOrrkB5YA3JfhSA0e9X6JdF77ieA.5.fy', '2026-07-14 01:53:06', '2026-07-30 01:53:03', 'PPDB-2026-0032', NULL, 1),
(33, 'Lukman Hakim', NULL, 1, '1', 'A', '2027003', '$2y$12$lCBfpQONhWe8RVtZMyVfM.kNJmC/DbpvKNCn9YRgdo/mdF86JGbsS', '2026-07-14 01:53:06', '2026-07-30 01:53:03', 'PPDB-2026-0033', NULL, 1),
(34, 'Melati Putri', NULL, 1, '1', 'A', '2027004', '$2y$12$UmXMrgthguLW.V6YzmH3leUoNGO0bStqK1uq7ig5jTqoFx18ENhx.', '2026-07-14 01:53:06', '2026-07-30 01:53:04', 'PPDB-2026-0034', NULL, 1),
(35, 'Nanda Pratiwi', NULL, 1, '1', 'A', '2027005', '$2y$12$rmy5xd/LtOq9Pf3czzkWfOTmfE.1rjQZmsIcEBlIhyJblSEdlb1bW', '2026-07-14 01:53:06', '2026-07-30 01:53:04', 'PPDB-2026-0035', NULL, 1),
(36, 'Oki Setiawan', NULL, 1, '1', 'A', '2027006', '$2y$12$LULUehT.dV50bR34MUEBOuE6syB6obrNXg4U.59KGsQR0Lvkc0r8a', '2026-07-14 01:53:06', '2026-07-30 01:53:04', 'PPDB-2026-0036', NULL, 1),
(37, 'Putri Ayuningsih', NULL, 1, '1', 'A', '2027007', '$2y$12$4GQW3h72J.1hgO.7jUZTj.2jn3Me5V.9UGzC9H9bIEZ4t1nvo7hIG', '2026-07-14 01:53:06', '2026-07-30 01:53:04', 'PPDB-2026-0037', NULL, 1),
(38, 'Rendra Kurniawan', NULL, 1, '1', 'A', '2027008', '$2y$12$yorBZCm5iW2iNhXpZbJiGu5nzBn9NsZB4opVop6FJ06/1CQVLRQfS', '2026-07-14 01:53:06', '2026-07-30 01:53:05', 'PPDB-2026-0038', NULL, 1),
(39, 'Siti Rahmawati', NULL, 1, '1', 'A', '2027009', '$2y$12$k9FClVOecwGXOIA9A9yTl.YIh6iRcnDJZQt4RRZtsAByCGd3t3au6', '2026-07-14 01:53:06', '2026-07-30 01:53:05', 'PPDB-2026-0039', NULL, 1),
(40, 'Taufik Hidayat', NULL, 1, '1', 'A', '2027010', '$2y$12$2YkIVe2ZSOA2zH8XvEbLleCSS8VPZEr0.GUpRXvmh9/w6vwsGuVm.', '2026-07-14 01:53:06', '2026-07-30 01:53:05', 'PPDB-2026-0040', NULL, 1),
(46, 'Muhammad Alif', NULL, 1, '1', 'A', '2028002', '$2y$12$0BiF1UOZ/x39wp7Ey3klled4mgk.4I3s6AgAdsYWjcGbKb5PfWLZK', '2026-07-16 03:03:18', '2026-07-30 01:53:05', 'PPDB-2026-041', NULL, 1),
(47, 'Siti Zahra', NULL, 1, '1', 'A', '2028005', '$2y$12$Q7/GjRwkLB/Iqaoq2P0qwOShN8hpmeKMvGP1SywEIFp0/2MwY1vFu', '2026-07-16 03:03:18', '2026-07-30 01:53:05', 'PPDB-2026-042', NULL, 1),
(48, 'Ahmad Fadli', NULL, 1, '1', 'A', '2028001', '$2y$12$K7PQcJNRAf0ONhGCbKRvseCJfawWhi4sowa4Yz5hs73hr7jb3zYra', '2026-07-16 03:03:18', '2026-07-30 01:53:06', 'PPDB-2026-043', NULL, 1),
(49, 'Nabila Azzahra', NULL, 1, '1', 'A', '2028003', '$2y$12$BDPjejhXNDIMrGSk50.MyuZWUJT7qn8FutnKD1.rPC3XMDoYpFTQC', '2026-07-16 03:03:18', '2026-07-30 01:53:06', 'PPDB-2026-044', NULL, 1),
(50, 'Rizky Maulana', NULL, 1, '1', 'A', '2028004', '$2y$12$v1Z572uXpnI31MQYHDPi0u/O94/VEdNP.pCA6cN.dgxQoHBF8AVl.', '2026-07-16 03:03:18', '2026-07-30 01:53:06', 'PPDB-2026-045', NULL, 1),
(52, 'Muhammad Fatih (Siswa Tes SMP)', 'ikhwan', 2, '7', 'A', '2627002', '$2y$12$RqnjI9/1QTL50knwj3rTA.162.mzRvPx2YbdRW79Wctm.iI0qFQHm', '2026-10-20 03:35:15', '2026-10-21 01:54:11', 'PPDB-SMP-001', NULL, 1),
(53, 'Aisyah Humaira (Siswa Tes SMP)', 'akhwat', 2, '7', 'A', '2627001', '$2y$12$jAAM5tacRR0t9CpV3DsUCu/oZKLXSbJxo.WIo1AO0x5DtBxb0VKaK', '2026-10-20 03:35:15', '2026-10-21 01:54:11', 'PPDB-SMP-002', NULL, 1),
(54, 'Zaid bin Tsabit (Siswa Tes SMA)', 'ikhwan', 3, '10', 'A', '2637002', '$2y$12$ypnQYWSPBzZNM1yR2kikO.V57dDzDF1rAXZhwoQI60ze5hGJrxqZi', '2026-10-20 03:35:15', '2026-10-21 01:54:11', 'PPDB-SMA-001', NULL, 1),
(55, 'Fathimah Azzahra (Siswa Tes SMA)', 'akhwat', 3, '10', 'A', '2637001', '$2y$12$ILrjXteBz2JhkjLO//Avs.vZXIUAcwpMBi67XFycOLURo5Hcuv1I.', '2026-10-20 03:35:23', '2026-10-21 01:54:12', 'PPDB-SMA-002', NULL, 1),
(76, 'Ahmad Fauzi', NULL, 1, '1', 'A', NULL, 'hash_pw_1', '2026-10-23 01:00:00', '2026-10-23 08:11:18', 'PPDB-001', '0051234567', 0),
(77, 'Budi Santoso', NULL, 1, '1', 'A', NULL, 'hash_pw_2', '2026-10-23 01:00:00', '2026-10-23 08:11:18', 'PPDB-002', '0052234568', 0),
(78, 'Citra Lestari', NULL, 1, '1', 'A', NULL, 'hash_pw_3', '2026-10-23 01:00:00', '2026-10-23 08:11:18', 'PPDB-003', '0053234569', 0),
(79, 'Dewi Sartika', NULL, 1, '1', 'A', NULL, 'hash_pw_4', '2026-10-23 01:00:00', '2026-10-23 08:11:18', 'PPDB-004', '0054234570', 0),
(80, 'Eko Prasetyo', NULL, 1, '1', 'A', NULL, 'hash_pw_5', '2026-10-23 01:00:00', '2026-10-23 08:11:18', 'PPDB-005', '0055234571', 0),
(81, 'Fatimah Az-Zahra', NULL, 1, '1', 'B', NULL, 'hash_pw_6', '2026-10-23 01:00:00', '2026-10-26 05:53:31', 'PPDB-006', '0056234572', 0),
(82, 'Gilang Ramadhan', NULL, 1, '1', 'B', NULL, 'hash_pw_7', '2026-10-23 01:00:00', '2026-10-26 05:53:31', 'PPDB-007', '0057234573', 0),
(83, 'Hendra Wijaya', NULL, 1, '1', 'B', NULL, 'hash_pw_8', '2026-10-23 01:00:00', '2026-10-26 05:53:31', 'PPDB-008', '0058234574', 0),
(84, 'Indah Permatasari', NULL, 1, '1', 'B', NULL, 'hash_pw_9', '2026-10-23 01:00:00', '2026-10-26 05:53:31', 'PPDB-009', '0059234575', 0),
(85, 'Joko Anwar', NULL, 1, '1', 'B', NULL, 'hash_pw_10', '2026-10-23 01:00:00', '2026-10-26 05:53:31', 'PPDB-010', '0060234576', 0),
(88, 'Dwi Nurul Azizah', 'akhwat', 1, '1', 'B', NULL, NULL, '2026-10-26 06:29:05', '2026-10-26 06:29:36', 'TEST-20261026-D6B1BB', '2700010904', 0);

-- --------------------------------------------------------

--
-- Table structure for table `siswa_tahun`
--

CREATE TABLE `siswa_tahun` (
  `id` bigint UNSIGNED NOT NULL,
  `siswa_id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rombel_id` bigint UNSIGNED DEFAULT NULL,
  `jenjang_id` bigint UNSIGNED DEFAULT NULL,
  `is_processed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `siswa_tahun`
--

INSERT INTO `siswa_tahun` (`id`, `siswa_id`, `tahun_ajaran_id`, `status`, `rombel_id`, `jenjang_id`, `is_processed`, `created_at`, `updated_at`) VALUES
(1, 61, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(2, 62, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(3, 63, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(4, 64, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(5, 65, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(6, 66, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(7, 67, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(8, 68, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(9, 69, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(10, 70, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(11, 71, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(12, 72, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(13, 73, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(14, 74, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(15, 75, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(16, 76, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(17, 77, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(18, 78, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(19, 79, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(20, 80, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(21, 81, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(22, 82, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(23, 83, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(24, 84, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(25, 85, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(26, 86, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(27, 87, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(28, 88, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(29, 89, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(30, 90, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:02', '2026-07-13 16:44:13'),
(32, 91, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(33, 92, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(34, 93, 1, 'aktif', 22, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(35, 94, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(36, 95, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(37, 96, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(38, 97, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(39, 98, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(40, 99, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(41, 100, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(42, 101, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(43, 102, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(44, 103, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(45, 104, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(46, 105, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(47, 106, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(48, 107, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(49, 108, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(50, 109, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(51, 110, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(52, 111, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(53, 112, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(54, 113, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(55, 114, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(56, 115, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(57, 116, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(58, 117, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(59, 118, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(60, 119, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(61, 120, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:39:49', '2026-07-13 16:44:13'),
(63, 121, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(64, 122, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(65, 123, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(66, 124, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(67, 125, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(68, 126, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(69, 127, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(70, 128, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(71, 129, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(72, 130, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(73, 131, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(74, 132, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(75, 133, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(76, 134, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(77, 135, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(78, 136, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(79, 137, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(80, 138, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(81, 139, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(82, 140, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(83, 141, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(84, 142, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(85, 143, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(86, 144, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(87, 145, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(88, 146, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(89, 147, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(90, 148, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(91, 149, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(92, 150, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:40:45', '2026-07-13 16:44:13'),
(94, 151, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(95, 152, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(96, 153, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(97, 154, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(98, 155, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(99, 156, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(100, 157, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(101, 158, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(102, 159, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(103, 160, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(104, 161, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(105, 162, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(106, 163, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(107, 164, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(108, 165, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(109, 166, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(110, 167, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(111, 168, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(112, 169, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(113, 170, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(114, 171, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(115, 172, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(116, 173, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(117, 174, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(118, 175, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(119, 176, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(120, 177, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(121, 178, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(122, 179, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:41:36', '2026-07-13 16:44:13'),
(125, 180, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(126, 181, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(127, 182, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(128, 183, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(129, 184, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(130, 185, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(131, 186, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(132, 187, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(133, 188, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(134, 189, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(135, 190, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(136, 191, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(137, 192, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(138, 193, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(139, 194, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(140, 195, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(141, 196, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(142, 197, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(143, 198, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(144, 199, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:13'),
(145, 200, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(146, 201, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(147, 202, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(148, 203, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(149, 204, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(150, 205, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(151, 206, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(152, 207, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(153, 208, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(154, 209, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(155, 210, 1, 'aktif', NULL, 1, 1, '2026-07-13 16:42:23', '2026-07-13 16:44:14'),
(156, 211, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(157, 212, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(158, 213, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(159, 214, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(160, 215, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(161, 216, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(162, 217, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(163, 218, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(164, 219, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(165, 220, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(166, 221, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(167, 222, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(168, 223, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(169, 224, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(170, 225, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(171, 226, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(172, 227, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(173, 228, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(174, 229, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(175, 230, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(176, 231, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(177, 232, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(178, 233, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(179, 234, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(180, 235, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(181, 236, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(182, 237, 1, 'LULUS', NULL, 1, 1, '2026-07-13 16:43:42', '2026-07-13 16:44:14'),
(187, 61, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(188, 62, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(189, 63, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(190, 64, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(191, 65, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(192, 66, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(193, 67, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(194, 68, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(195, 69, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(196, 70, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(197, 71, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(198, 72, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(199, 73, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(200, 74, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(201, 75, 2, 'AKTIF', 1, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(202, 76, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(203, 77, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(204, 78, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(205, 79, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(206, 80, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(207, 81, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(208, 82, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(209, 83, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(210, 84, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(211, 85, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(212, 86, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(213, 87, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(214, 88, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(215, 89, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:01'),
(216, 90, 2, 'AKTIF', 2, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(217, 91, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(218, 92, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(219, 93, 2, 'AKTIF', 22, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(220, 94, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(221, 95, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(222, 96, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(223, 97, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(224, 98, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(225, 99, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(226, 100, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(227, 101, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(228, 102, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(229, 103, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(230, 104, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(231, 105, 2, 'AKTIF', 3, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(232, 106, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(233, 107, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(234, 108, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(235, 109, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(236, 110, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(237, 111, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(238, 112, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(239, 113, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(240, 114, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(241, 115, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(242, 116, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(243, 117, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(244, 118, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(245, 119, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(246, 120, 2, 'AKTIF', 4, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(247, 121, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(248, 122, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(249, 123, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(250, 124, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(251, 125, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(252, 126, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(253, 127, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(254, 128, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(255, 129, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(256, 130, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(257, 131, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(258, 132, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(259, 133, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(260, 134, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(261, 135, 2, 'AKTIF', 5, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(262, 136, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(263, 137, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(264, 138, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(265, 139, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(266, 140, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(267, 141, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(268, 142, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(269, 143, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(270, 144, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(271, 145, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(272, 146, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(273, 147, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(274, 148, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(275, 149, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(276, 150, 2, 'AKTIF', 6, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(277, 151, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(278, 152, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(279, 153, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(280, 154, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(281, 155, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(282, 156, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(283, 157, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(284, 158, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(285, 159, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(286, 160, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(287, 161, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(288, 162, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(289, 163, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(290, 164, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(291, 165, 2, 'AKTIF', 7, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(292, 166, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(293, 167, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(294, 168, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(295, 169, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(296, 170, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(297, 171, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(298, 172, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(299, 173, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(300, 174, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(301, 175, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(302, 176, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(303, 177, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(304, 178, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(305, 179, 2, 'AKTIF', 8, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(306, 180, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(307, 181, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(308, 182, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(309, 183, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(310, 184, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(311, 185, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(312, 186, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(313, 187, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(314, 188, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(315, 189, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(316, 190, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(317, 191, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(318, 192, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(319, 193, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(320, 194, 2, 'LULUS', 9, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(321, 195, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(322, 196, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(323, 197, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(324, 198, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(325, 199, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(326, 200, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:13', '2026-07-14 02:34:02'),
(327, 201, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(328, 202, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(329, 203, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(330, 204, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(331, 205, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(332, 206, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(333, 207, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(334, 208, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(335, 209, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(336, 210, 2, 'LULUS', 10, 1, 1, '2026-07-13 16:44:14', '2026-07-14 02:34:02'),
(337, 240, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:21:46', '2026-07-14 02:34:02'),
(338, 241, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:24:45', '2026-07-14 02:34:02'),
(339, 242, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:24:46', '2026-07-14 02:34:02'),
(340, 243, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:24:48', '2026-07-14 02:34:02'),
(341, 244, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:24:49', '2026-07-14 02:34:02'),
(342, 245, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:24:50', '2026-07-14 02:34:02'),
(343, 246, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:24:54', '2026-07-14 02:34:02'),
(344, 247, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:24:57', '2026-07-14 02:34:02'),
(345, 248, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:24:59', '2026-07-14 02:34:02'),
(346, 249, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:25:01', '2026-07-14 02:34:02'),
(347, 250, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:25:36', '2026-07-14 02:34:02'),
(348, 251, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:25:38', '2026-07-14 02:34:02'),
(349, 252, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:25:40', '2026-07-14 02:34:02'),
(350, 253, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:25:40', '2026-07-14 02:34:02'),
(351, 254, 2, 'AKTIF', 11, 1, 1, '2026-07-13 17:25:44', '2026-07-14 02:34:02'),
(352, 255, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:26:48', '2026-07-14 02:34:02'),
(353, 256, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:26:50', '2026-07-14 02:34:02'),
(354, 257, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:26:52', '2026-07-14 02:34:02'),
(355, 258, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:26:53', '2026-07-14 02:34:02'),
(356, 259, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:26:56', '2026-07-14 02:34:02'),
(357, 260, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:26:57', '2026-07-14 02:34:02'),
(358, 261, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:26:59', '2026-07-14 02:34:02'),
(359, 262, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:27:01', '2026-07-14 02:34:02'),
(360, 263, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:27:03', '2026-07-14 02:34:02'),
(361, 264, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:27:05', '2026-07-14 02:34:02'),
(362, 265, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:27:31', '2026-07-14 02:34:02'),
(363, 266, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:27:32', '2026-07-14 02:34:02'),
(364, 267, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:27:34', '2026-07-14 02:34:02'),
(365, 268, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:27:36', '2026-07-14 02:34:02'),
(366, 269, 2, 'AKTIF', 12, 1, 1, '2026-07-13 17:27:39', '2026-07-14 02:34:02'),
(367, 61, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(368, 62, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(369, 63, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(370, 64, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(371, 65, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(372, 66, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(373, 67, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(374, 68, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(375, 69, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(376, 70, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(377, 71, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(378, 72, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(379, 73, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(380, 74, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(381, 75, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(382, 76, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(383, 77, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(384, 78, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(385, 79, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(386, 80, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(387, 81, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(388, 82, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(389, 83, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(390, 84, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(391, 85, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(392, 86, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(393, 87, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(394, 88, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(395, 89, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:01', '2026-07-16 02:52:17'),
(396, 90, 3, 'AKTIF', 14, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(397, 91, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(398, 92, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(399, 93, 3, 'AKTIF', 22, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(400, 94, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(401, 95, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(402, 96, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(403, 97, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:17'),
(404, 98, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(405, 99, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(406, 100, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(407, 101, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(408, 102, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(409, 103, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(410, 104, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(411, 105, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(412, 106, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(413, 107, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(414, 108, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(415, 109, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(416, 110, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(417, 111, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(418, 112, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(419, 113, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(420, 114, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(421, 115, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(422, 116, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(423, 117, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(424, 118, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(425, 119, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(426, 120, 3, 'AKTIF', 15, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(427, 121, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(428, 122, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(429, 123, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(430, 124, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(431, 125, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(432, 126, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(433, 127, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(434, 128, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(435, 129, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(436, 130, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(437, 131, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(438, 132, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(439, 133, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(440, 134, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(441, 135, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(442, 136, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(443, 137, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(444, 138, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(445, 139, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(446, 140, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(447, 141, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(448, 142, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(449, 143, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(450, 144, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(451, 145, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(452, 146, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(453, 147, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(454, 148, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(455, 149, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(456, 150, 3, 'AKTIF', 16, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(457, 151, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(458, 152, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(459, 153, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(460, 154, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(461, 155, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(462, 156, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(463, 157, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(464, 158, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(465, 159, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(466, 160, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(467, 161, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(468, 162, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(469, 163, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(470, 164, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(471, 165, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(472, 166, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(473, 167, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(474, 168, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(475, 169, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(476, 170, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(477, 171, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(478, 172, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(479, 173, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(480, 174, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(481, 175, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(482, 176, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(483, 177, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(484, 178, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(485, 179, 3, 'LULUS', 17, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(486, 240, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(487, 241, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(488, 242, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(489, 243, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(490, 244, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(491, 245, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(492, 246, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(493, 247, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(494, 248, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(495, 249, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(496, 250, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(497, 251, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(498, 252, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(499, 253, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(500, 254, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(501, 255, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(502, 256, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(503, 257, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(504, 258, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(505, 259, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(506, 260, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(507, 261, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(508, 262, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(509, 263, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(510, 264, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(511, 265, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(512, 266, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(513, 267, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(514, 268, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(515, 269, 3, 'AKTIF', 13, 1, 1, '2026-07-14 02:34:02', '2026-07-16 02:52:18'),
(516, 270, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:00', '2026-07-16 02:52:18'),
(517, 271, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:04', '2026-07-16 02:52:18'),
(518, 272, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:10', '2026-07-16 02:52:18'),
(519, 273, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:12', '2026-07-16 02:52:18'),
(520, 274, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:14', '2026-07-16 02:52:18'),
(521, 275, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:16', '2026-07-16 02:52:18'),
(522, 276, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:18', '2026-07-16 02:52:18'),
(523, 277, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:20', '2026-07-16 02:52:18'),
(524, 278, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:22', '2026-07-16 02:52:18'),
(525, 279, 3, 'AKTIF', 18, 1, 1, '2026-07-14 02:40:24', '2026-07-16 02:52:18'),
(526, 61, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(527, 62, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(528, 63, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(529, 64, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(530, 65, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(531, 66, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(532, 67, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(533, 68, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(534, 69, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(535, 70, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(536, 71, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(537, 72, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(538, 73, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(539, 74, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(540, 75, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(541, 76, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(542, 77, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(543, 78, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(544, 79, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(545, 80, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(546, 81, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(547, 82, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(548, 83, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(549, 84, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(550, 85, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(551, 86, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(552, 87, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(553, 88, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(554, 89, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(555, 90, 4, 'AKTIF', 21, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(556, 91, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(557, 92, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(558, 93, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(559, 94, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(560, 95, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(561, 96, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(562, 97, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:17', '2026-10-22 06:58:31'),
(563, 98, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(564, 99, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(565, 100, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(566, 101, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(567, 102, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(568, 103, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(569, 104, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(570, 105, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(571, 106, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(572, 107, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(573, 108, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(574, 109, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(575, 110, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(576, 111, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(577, 112, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(578, 113, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(579, 114, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(580, 115, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(581, 116, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(582, 117, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(583, 118, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(584, 119, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(585, 120, 4, 'AKTIF', 22, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(586, 121, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(587, 122, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(588, 123, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(589, 124, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(590, 125, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(591, 126, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(592, 127, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(593, 128, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(594, 129, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(595, 130, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(596, 131, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(597, 132, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(598, 133, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(599, 134, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(600, 135, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(601, 136, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(602, 137, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(603, 138, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(604, 139, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(605, 140, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(606, 141, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(607, 142, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(608, 143, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(609, 144, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(610, 145, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(611, 146, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(612, 147, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(613, 148, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(614, 149, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(615, 150, 4, 'LULUS', 23, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(616, 240, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(617, 241, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(618, 242, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(619, 243, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(620, 244, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(621, 245, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(622, 246, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(623, 247, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(624, 248, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(625, 249, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(626, 250, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(627, 251, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(628, 252, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(629, 253, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(630, 254, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(631, 255, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(632, 256, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:31'),
(633, 257, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(634, 258, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(635, 259, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(636, 260, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(637, 261, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(638, 262, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(639, 263, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(640, 264, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(641, 265, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(642, 266, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(643, 267, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(644, 268, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(645, 269, 4, 'AKTIF', 20, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(646, 270, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(647, 271, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(648, 272, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32');
INSERT INTO `siswa_tahun` (`id`, `siswa_id`, `tahun_ajaran_id`, `status`, `rombel_id`, `jenjang_id`, `is_processed`, `created_at`, `updated_at`) VALUES
(649, 273, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(650, 274, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(651, 275, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(652, 276, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(653, 277, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(654, 278, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(655, 279, 4, 'AKTIF', 19, 1, 1, '2026-07-16 02:52:18', '2026-10-22 06:58:32'),
(656, 280, 4, 'AKTIF', 24, 1, 1, '2026-07-16 03:05:48', '2026-10-22 06:58:32'),
(657, 281, 4, 'AKTIF', 24, 1, 1, '2026-07-16 03:05:51', '2026-10-22 06:58:32'),
(658, 282, 4, 'AKTIF', 24, 1, 1, '2026-07-16 03:05:58', '2026-10-22 06:58:32'),
(659, 283, 4, 'AKTIF', 24, 1, 1, '2026-07-16 03:06:01', '2026-10-22 06:58:32'),
(660, 284, 4, 'AKTIF', 24, 1, 1, '2026-07-16 03:06:04', '2026-10-22 06:58:32'),
(766, 286, 6, 'AKTIF', 38, 2, 0, '2026-10-20 03:55:35', '2026-10-20 03:55:35'),
(767, 287, 6, 'AKTIF', 37, 2, 0, '2026-10-20 03:55:53', '2026-10-20 03:55:53'),
(768, 288, 6, 'AKTIF', 40, 3, 0, '2026-10-20 03:57:57', '2026-10-20 03:57:57'),
(769, 289, 6, 'AKTIF', 39, 3, 0, '2026-10-20 03:58:13', '2026-10-20 03:58:13'),
(770, 61, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(771, 62, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(772, 63, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(773, 64, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(774, 65, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(775, 66, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(776, 67, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(777, 68, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(778, 69, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(779, 70, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(780, 71, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(781, 72, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(782, 73, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(783, 74, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(784, 75, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(785, 76, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(786, 77, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(787, 78, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(788, 79, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(789, 80, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(790, 81, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(791, 82, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(792, 83, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(793, 84, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(794, 85, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(795, 86, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(796, 87, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(797, 88, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(798, 89, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(799, 90, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(800, 91, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(801, 92, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(802, 93, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(803, 94, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(804, 95, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(805, 96, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(806, 97, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(807, 98, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(808, 99, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(809, 100, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(810, 101, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(811, 102, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(812, 103, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(813, 104, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(814, 105, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(815, 106, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(816, 107, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(817, 108, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(818, 109, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(819, 110, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(820, 111, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(821, 112, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(822, 113, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(823, 114, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(824, 115, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(825, 116, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(826, 117, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(827, 118, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(828, 119, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(829, 120, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(830, 240, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(831, 241, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(832, 242, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(833, 243, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(834, 244, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(835, 245, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(836, 246, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(837, 247, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(838, 248, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(839, 249, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(840, 250, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(841, 251, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(842, 252, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(843, 253, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(844, 254, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(845, 255, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(846, 256, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:31', '2026-10-22 06:58:31'),
(847, 257, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(848, 258, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(849, 259, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(850, 260, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(851, 261, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(852, 262, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(853, 263, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(854, 264, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(855, 265, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(856, 266, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(857, 267, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(858, 268, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(859, 269, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(860, 270, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(861, 271, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(862, 272, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(863, 273, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(864, 274, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(865, 275, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(866, 276, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(867, 277, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(868, 278, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(869, 279, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(870, 280, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(871, 281, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(872, 282, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(873, 283, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32'),
(874, 284, 6, 'AKTIF', NULL, 1, 0, '2026-10-22 06:58:32', '2026-10-22 06:58:32');

-- --------------------------------------------------------

--
-- Table structure for table `system_backups`
--

CREATE TABLE `system_backups` (
  `id` bigint UNSIGNED NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tahun_ajaran`
--

CREATE TABLE `tahun_ajaran` (
  `id` bigint UNSIGNED NOT NULL,
  `nama` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('draft','aktif','dikunci') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `semester_aktif` enum('ganjil','genap') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '0',
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
(4, '2029/2030', 'aktif', 'ganjil', 1, '2026-07-14 02:58:25', '2026-10-26 07:35:08', '2026-10-14 07:59:00'),
(6, '2030/2031', 'dikunci', 'ganjil', 0, '2026-10-15 02:45:06', '2026-10-26 06:36:03', NULL),
(8, '2031/2032', 'dikunci', NULL, 0, '2026-10-23 03:44:38', '2026-10-23 07:45:03', NULL),
(10, '2032/2033', 'dikunci', NULL, 0, '2026-10-26 03:59:39', '2026-10-26 03:59:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tahun_ajaran_jenjang`
--

CREATE TABLE `tahun_ajaran_jenjang` (
  `id` bigint UNSIGNED NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
  `jenjang_id` bigint UNSIGNED NOT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `semester_aktif` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tahun_ajaran_jenjang`
--

INSERT INTO `tahun_ajaran_jenjang` (`id`, `tahun_ajaran_id`, `jenjang_id`, `aktif`, `status`, `semester_aktif`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 0, 'dikunci', 'ganjil', '2026-10-27 01:49:25', '2026-10-27 01:49:25'),
(2, 2, 1, 0, 'dikunci', 'ganjil', '2026-10-27 01:49:25', '2026-10-27 01:49:25'),
(3, 3, 1, 0, 'dikunci', 'ganjil', '2026-10-27 01:49:25', '2026-10-27 01:49:25'),
(4, 4, 1, 1, 'aktif', 'ganjil', '2026-10-27 01:49:25', '2026-10-27 01:49:25'),
(5, 6, 1, 0, 'dikunci', 'ganjil', '2026-10-27 01:49:25', '2026-10-27 01:49:25'),
(6, 8, 1, 0, 'dikunci', NULL, '2026-10-27 01:49:25', '2026-10-27 01:49:25'),
(7, 10, 1, 0, 'dikunci', NULL, '2026-10-27 01:49:25', '2026-10-27 01:49:25'),
(8, 6, 2, 0, 'draft', NULL, '2026-10-27 01:49:25', '2026-10-27 01:49:25'),
(9, 6, 3, 0, 'draft', NULL, '2026-10-27 01:49:25', '2026-10-27 01:49:25');

-- --------------------------------------------------------

--
-- Table structure for table `template_deskripsi`
--

CREATE TABLE `template_deskripsi` (
  `id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED NOT NULL,
  `jenis` enum('kokurikuler','ekstrakurikuler') COLLATE utf8mb4_unicode_ci NOT NULL,
  `aspek` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade` enum('A','B','C','D','E') COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `template_deskripsi_intrakurikuler`
--

CREATE TABLE `template_deskripsi_intrakurikuler` (
  `id` bigint UNSIGNED NOT NULL,
  `guru_id` bigint UNSIGNED NOT NULL,
  `min_nilai` int NOT NULL,
  `max_nilai` int NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nipy` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jenjang_id` bigint UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `nipy`, `email_verified_at`, `password`, `foto`, `role`, `jenjang_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', '1001', NULL, '$2y$12$VB71K3T95wVlXmfFUN9Ys.hCwXjr3ZU0PQy3G9vVGH3LIP9kexDSy', NULL, 'superadmin', NULL, NULL, '2026-07-13 16:29:04', '2026-07-13 16:29:04'),
(2, 'Admin TU SD', '200001', NULL, '$2y$12$nMfXwflHsPVNpTS6oj4wQeDg0SLJcehUdZir3.AmC3Vt9UK3E24bq', NULL, 'admintu', 1, NULL, '2026-07-13 16:29:04', '2026-07-13 16:29:04'),
(3, 'Guru SD', '300001', NULL, '$2y$12$tFp5D7Esk6Od8xSJg5LVnu4BBjwDSFYSI7dVD1/oiGwMpMiMG9W4W', NULL, 'guru', 1, NULL, '2026-07-13 16:29:04', '2026-07-13 16:29:04'),
(4, 'damarjati', '2001', NULL, '$2y$12$ijg02Bl2YSsfMdSB/aSdq.ixqUbi3EtVk5SxV86vQFrkJ4y378VyC', NULL, 'admintu', 1, NULL, '2026-07-13 16:29:35', '2026-07-13 16:29:35'),
(5, 'Hendra Wicaksono, S.Pd', '4001', NULL, '$2y$12$RikYwePJNDIw/j6XnD3DVeLhfyUO/J.LZl5ZToVPHzzA8BffZWN4K', NULL, 'guru', 1, NULL, '2026-07-13 16:52:24', '2026-07-13 16:52:24'),
(6, 'Daliana Sari, S.Pd.SD', '4002', NULL, '$2y$12$56e5F1Y4hIxKdy2IEM0uEOU23WLn5Nl7ITRVMvxlxCUca169NpbVq', NULL, 'guru', 1, NULL, '2026-07-13 16:52:42', '2026-07-13 16:52:42'),
(7, 'Yan Palupi R, S.Pd', '4003', NULL, '$2y$12$6073fcNbXkCyRGNnSUO7c.0RASA1qLaD6Ai/7xwWocwkylSA2B2hG', NULL, 'guru', 1, NULL, '2026-07-13 16:53:00', '2026-07-13 16:53:00'),
(8, 'Farianti, S.Pd', '4004', NULL, '$2y$12$VUwv/1LPrOD9bXbtl3nOAuhrDZnzOwiPYDIeEMwOXLBtyUyNPfiOy', NULL, 'guru', 1, NULL, '2026-07-13 16:53:16', '2026-07-13 16:53:16'),
(9, 'Sindi Kurniawati, S.Pd', '4005', NULL, '$2y$12$sWPoTbFNM.i/aeN0327txOE5O3S32wIMTLS/sfgsd38b8fsZ3cSxq', NULL, 'guru', 1, NULL, '2026-07-13 16:53:31', '2026-07-13 16:53:31'),
(10, 'Eriyani Sembiring, S.Pd', '4006', NULL, '$2y$12$kmNVQ0k4vZu2LsOsqeYja.E8MJxkGWb76cCx/2HanZ5VPfAAEH0H2', NULL, 'guru', 1, NULL, '2026-07-13 16:53:43', '2026-07-13 16:53:43'),
(11, 'Silvani Al Fajri, S.Si', '4007', NULL, '$2y$12$48bO/uBtV2YYYEvOlHyPve3l8w57DiOxZ086h1eYUhGm5gT1GE/Tq', NULL, 'guru', 1, NULL, '2026-07-13 16:54:00', '2026-07-13 16:54:00'),
(12, 'Reni Rosida, S.Pd.', '4008', NULL, '$2y$12$EJkAHeu4Carg5NIcWZG7/edZJa8Dz3BpyZ2fFZtvUIdgAe4ZEN3zm', NULL, 'guru', 1, NULL, '2026-07-13 16:54:15', '2026-07-13 16:54:15'),
(13, 'Umu Salma, S.Pd.', '4009', NULL, '$2y$12$6D8zjFzpyofyZjwd9RZehu4Pf3rAGGfbloFY2TbrR7ZlkqCOwzwJO', NULL, 'guru', 1, NULL, '2026-07-13 16:54:37', '2026-07-13 16:54:37'),
(14, 'Mutia Nurul Audah, S.Pd', '4010', NULL, '$2y$12$51G4PUosOXBjzGpi.QoRRO4rSZjhG5nIoQqJleGQR/rDczFe.xMzS', NULL, 'guru', 1, NULL, '2026-07-13 16:55:08', '2026-07-13 16:55:08'),
(15, 'Yuliani Rahayu,S.Pd', '4011', NULL, '$2y$12$Bpy8FuRh2E6jVJ6.3k/f1ezajtc2xqXMggjsoaltY6nD3fX9Edini', NULL, 'guru', 1, NULL, '2026-07-13 16:55:35', '2026-07-13 16:55:35'),
(16, 'Daman, S.Pd', '4012', NULL, '$2y$12$EjE1WNEX7BLf7hOsyFzP8eFaKUv5BxutVPQFOdIXUsyqr6hhL12HK', NULL, 'guru', 1, NULL, '2026-07-13 16:55:48', '2026-07-13 16:55:48'),
(18, 'valukh', '5001', NULL, '$2y$12$F7uCKtUfskUvaCH1SvRRU.3qJDo95zxJEXjnaJrnTWYrv2ucLoVBK', NULL, 'kepala_sekolah', 1, NULL, '2026-07-13 19:13:28', '2026-07-13 19:13:28'),
(19, 'bagas', '9000', NULL, '$2y$12$d2.3dhlqBMGakK3cjmJjtefS/J0dmgdu06akDYk1k3mJ11FCipRx.', NULL, 'guru', 1, NULL, '2026-07-14 02:31:50', '2026-07-14 02:32:15'),
(24, 'Dwi', '2002', NULL, '$2y$12$uZy5.lWiMF7vZrpj2cMWS.CvHfuHUjVRpgK9/4t1re3CTcTfC2bhu', NULL, 'admintu', 2, NULL, '2026-10-19 04:18:37', '2026-10-21 02:42:38'),
(26, 'Raka', '2003', NULL, '$2y$12$CGJhJgCN3ja/j6AM4lFNQ.jogTABsAi7xAc27XTfwKhh1lmmfa./W', NULL, 'admintu', 3, NULL, '2026-10-20 02:27:24', '2026-10-20 02:27:24'),
(27, 'Ahmad Fauzi, S.Pd', '5002', NULL, '$2y$12$wGPveBqRwnBy8NiTIri4AuFxKr0Y6bDkkAGbCSNnz5aB3L9VLcRjq', NULL, 'guru', 2, NULL, '2026-10-20 03:51:57', '2026-10-20 03:51:57'),
(28, 'Siti Aminah, S.Pd', '5003', NULL, '$2y$12$F4AC59xv/bg2HLiTDJ4hgOtwTQfq6XKHOjIcg1CtqhJ1MaJUdCGh2', NULL, 'guru', 2, NULL, '2026-10-20 03:51:58', '2026-10-20 03:51:58'),
(29, 'Budi Pratama, M.Pd', '6001', NULL, '$2y$12$CmhzoFr22dy14fCCUuU4vehfhuR6DFpU8FgHoUsu8/PLfCXxZbWb.', NULL, 'guru', 3, NULL, '2026-10-20 03:51:58', '2026-10-20 03:51:58'),
(30, 'Nurul Hidayah, S.Pd', '6002', NULL, '$2y$12$TgkeAZ/3RYXBt1b1dLhe4uToUqd2uCBYa70cbswKD.VGYmR.EK73.', NULL, 'guru', 3, NULL, '2026-10-20 03:51:58', '2026-10-20 03:51:58');

-- --------------------------------------------------------

--
-- Table structure for table `wali_kelas`
--

CREATE TABLE `wali_kelas` (
  `id` bigint UNSIGNED NOT NULL,
  `nipy_guru` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tahun_ajaran_id` bigint UNSIGNED NOT NULL,
  `kelas` int NOT NULL,
  `sub` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- Indexes for table `finalisasi_jenjang`
--
ALTER TABLE `finalisasi_jenjang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `finalisasi_jenjang_tahun_ajaran_id_jenjang_id_unique` (`tahun_ajaran_id`,`jenjang_id`),
  ADD KEY `finalisasi_jenjang_finalized_by_foreign` (`finalized_by`),
  ADD KEY `finalisasi_jenjang_jenjang_id_foreign` (`jenjang_id`);

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
-- Indexes for table `jenjang`
--
ALTER TABLE `jenjang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `jenjang_kode_unique` (`kode`);

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
  ADD UNIQUE KEY `rombel_unik_per_tahun_gender` (`tahun_ajaran_id`,`tingkat_kelas`,`sub_nama`,`kelompok_gender`),
  ADD KEY `rombel_tahun_ajaran_id_index` (`tahun_ajaran_id`),
  ADD KEY `rombel_guru_id_foreign` (`guru_id`),
  ADD KEY `rombel_jenjang_id_foreign` (`jenjang_id`);

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
  ADD UNIQUE KEY `siswas_ppdb_id_unique` (`ppdb_id`),
  ADD KEY `siswas_jenjang_id_foreign` (`jenjang_id`);

--
-- Indexes for table `siswa_tahun`
--
ALTER TABLE `siswa_tahun`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_siswa_tahun` (`siswa_id`,`tahun_ajaran_id`),
  ADD KEY `siswa_tahun_tahun_ajaran_id_foreign` (`tahun_ajaran_id`),
  ADD KEY `siswa_tahun_rombel_id_foreign` (`rombel_id`),
  ADD KEY `siswa_tahun_jenjang_id_foreign` (`jenjang_id`);

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
-- Indexes for table `tahun_ajaran_jenjang`
--
ALTER TABLE `tahun_ajaran_jenjang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tahun_ajaran_jenjang_tahun_ajaran_id_jenjang_id_unique` (`tahun_ajaran_id`,`jenjang_id`),
  ADD KEY `tahun_ajaran_jenjang_jenjang_id_foreign` (`jenjang_id`);

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
  ADD UNIQUE KEY `users_nipy_unique` (`nipy`),
  ADD KEY `users_jenjang_id_foreign` (`jenjang_id`);

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
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `absensi_mapel`
--
ALTER TABLE `absensi_mapel`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `anggota_kelompok_quran`
--
ALTER TABLE `anggota_kelompok_quran`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `catatan_wali_kelas`
--
ALTER TABLE `catatan_wali_kelas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ekstrakurikuler`
--
ALTER TABLE `ekstrakurikuler`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ekstrakurikuler_siswa`
--
ALTER TABLE `ekstrakurikuler_siswa`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finalisasi_jenjang`
--
ALTER TABLE `finalisasi_jenjang`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `finalisasi_rapor`
--
ALTER TABLE `finalisasi_rapor`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `jadwal`
--
ALTER TABLE `jadwal`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `jenjang`
--
ALTER TABLE `jenjang`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kelompok_quran`
--
ALTER TABLE `kelompok_quran`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mapel`
--
ALTER TABLE `mapel`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `mata_pelajaran`
--
ALTER TABLE `mata_pelajaran`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `mutasi`
--
ALTER TABLE `mutasi`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `nilai_kokurikuler`
--
ALTER TABLE `nilai_kokurikuler`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nilai_quran`
--
ALTER TABLE `nilai_quran`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `nilai_siswa`
--
ALTER TABLE `nilai_siswa`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `nilai_siswa_detail`
--
ALTER TABLE `nilai_siswa_detail`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengaturan`
--
ALTER TABLE `pengaturan`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pengaturans`
--
ALTER TABLE `pengaturans`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `penugasan_guru`
--
ALTER TABLE `penugasan_guru`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=310;

--
-- AUTO_INCREMENT for table `pertemuan_quran`
--
ALTER TABLE `pertemuan_quran`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pjbl_judul`
--
ALTER TABLE `pjbl_judul`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promosi_siswa`
--
ALTER TABLE `promosi_siswa`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rapor_siswa`
--
ALTER TABLE `rapor_siswa`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rombel`
--
ALTER TABLE `rombel`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `siswa`
--
ALTER TABLE `siswa`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=290;

--
-- AUTO_INCREMENT for table `siswas`
--
ALTER TABLE `siswas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `siswa_tahun`
--
ALTER TABLE `siswa_tahun`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=875;

--
-- AUTO_INCREMENT for table `system_backups`
--
ALTER TABLE `system_backups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tahun_ajaran`
--
ALTER TABLE `tahun_ajaran`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tahun_ajaran_jenjang`
--
ALTER TABLE `tahun_ajaran_jenjang`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `template_deskripsi`
--
ALTER TABLE `template_deskripsi`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `template_deskripsi_intrakurikuler`
--
ALTER TABLE `template_deskripsi_intrakurikuler`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `wali_kelas`
--
ALTER TABLE `wali_kelas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

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
-- Constraints for table `finalisasi_jenjang`
--
ALTER TABLE `finalisasi_jenjang`
  ADD CONSTRAINT `finalisasi_jenjang_finalized_by_foreign` FOREIGN KEY (`finalized_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `finalisasi_jenjang_jenjang_id_foreign` FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `finalisasi_jenjang_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE RESTRICT;

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
  ADD CONSTRAINT `rombel_jenjang_id_foreign` FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang` (`id`),
  ADD CONSTRAINT `rombel_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `siswa`
--
ALTER TABLE `siswa`
  ADD CONSTRAINT `siswa_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `siswa_wali_id_foreign` FOREIGN KEY (`wali_id`) REFERENCES `wali_kelas` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `siswas`
--
ALTER TABLE `siswas`
  ADD CONSTRAINT `siswas_jenjang_id_foreign` FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `siswa_tahun`
--
ALTER TABLE `siswa_tahun`
  ADD CONSTRAINT `siswa_tahun_jenjang_id_foreign` FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `siswa_tahun_rombel_id_foreign` FOREIGN KEY (`rombel_id`) REFERENCES `rombel` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `siswa_tahun_siswa_id_foreign` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `siswa_tahun_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tahun_ajaran_jenjang`
--
ALTER TABLE `tahun_ajaran_jenjang`
  ADD CONSTRAINT `tahun_ajaran_jenjang_jenjang_id_foreign` FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `tahun_ajaran_jenjang_tahun_ajaran_id_foreign` FOREIGN KEY (`tahun_ajaran_id`) REFERENCES `tahun_ajaran` (`id`) ON DELETE RESTRICT;

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
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_jenjang_id_foreign` FOREIGN KEY (`jenjang_id`) REFERENCES `jenjang` (`id`) ON DELETE RESTRICT;

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
