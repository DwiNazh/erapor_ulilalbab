<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;

class SiswaController extends Controller
{
    // --- DATA DUMMY (SESUAIKAN DENGAN STRUKTUR DATA ASLI ANDA) ---
    private $dataSemuaKelas = [
        1 => [
            "1A" => [["nama" => "Siti Aminah", "nis" => "001"], ["nama" => "Budi Santoso", "nis" => "002"]],
        ],
        2 => [
            "2A" => [["nama" => "Gita Maharani", "nis" => "107"], ["nama" => "Indah Permata", "nis" => "108"]],
        ],
        3 => [
            "3A" => [["nama" => "Rafi Ahmad", "nis" => "201"], ["nama" => "Lina Putri", "nis" => "202"]],
        ],
        4 => [
            "4A" => [["nama" => "Bagus Hendra", "nis" => "301"], ["nama" => "Intan Sari", "nis" => "302"]],
        ],
        5 => [
            "5A" => [["nama" => "Anisa Rahma", "nis" => "401"], ["nama" => "Bayu Saputra", "nis" => "402"]],
        ],
        6 => [
            "6A" => [["nama" => "Fajar Pratama", "nis" => "501"], ["nama" => "Lulu Safitri", "nis" => "502"]],
        ],
    ];

    /**
     * Menggabungkan semua siswa menjadi satu Collection dengan info kelas
     */
    private function getAllSiswa(): Collection
    {
        $semuaSiswa = [];
        foreach ($this->dataSemuaKelas as $kelas => $subs) {
            foreach ($subs as $subKelas => $siswaList) {
                foreach ($siswaList as $siswa) {
                    $semuaSiswa[] = array_merge($siswa, [
                        'kelas' => (string)$kelas,
                        'subKelas' => $subKelas
                    ]);
                }
            }
        }
        return collect($semuaSiswa);
    }

    // 1. ENDPOINT: GET /api/siswa (Pencarian & Semua Siswa)
    public function index(Request $request)
    {
        $searchTerm = $request->query('search');
        $semuaSiswa = $this->getAllSiswa();

        if ($searchTerm) {
            $termLower = Str::lower($searchTerm);
            $hasilPencarian = $semuaSiswa->filter(function ($siswa) use ($termLower) {
                return Str::contains(Str::lower($siswa['nama']), $termLower) ||
                       Str::contains(Str::lower($siswa['nis']), $termLower);
            })->values()->all();

            return response()->json(['siswa' => $hasilPencarian]);
        }

        // Jika tidak ada parameter pencarian
        return response()->json(['siswa' => $semuaSiswa->all()]);
    }

    // 2. ENDPOINT: GET /api/kelas (Daftar Kelas)
    public function getKelas()
    {
        $daftarKelas = [];
        foreach ($this->dataSemuaKelas as $kelas => $subkelasData) {
            $totalSiswa = 0;
            foreach ($subkelasData as $siswaList) {
                $totalSiswa += count($siswaList);
            }

            $daftarKelas[] = [
                'kelas' => (string)$kelas,
                'jumlahSubkelas' => count($subkelasData),
                'totalSiswa' => $totalSiswa,
            ];
        }

        return response()->json(['kelas' => $daftarKelas]);
    }

    // 3. ENDPOINT: GET /api/kelas/{kelas}/subkelas (Daftar Subkelas per Kelas)
    public function getSubkelas($kelas)
    {
        // Konversi kelas menjadi integer (karena kunci array dataSemuaKelas adalah integer)
        $kelasInt = (int)$kelas;

        if (!isset($this->dataSemuaKelas[$kelasInt])) {
            return response()->json(['error' => 'Kelas tidak ditemukan'], 404);
        }

        $subkelasData = $this->dataSemuaKelas[$kelasInt];
        $daftarSubkelas = [];

        foreach ($subkelasData as $sub => $siswaList) {
            $daftarSubkelas[] = [
                'subKelas' => $sub,
                'jumlahSiswa' => count($siswaList)
            ];
        }

        return response()->json(['subkelas' => $daftarSubkelas, 'kelas' => $kelas]);
    }

    // 4. ENDPOINT: GET /api/kelas/{kelas}/subkelas/{subkelas} (Daftar Siswa per Subkelas)
    public function getSiswaPerSubkelas($kelas, $subkelas)
    {
        $kelasInt = (int)$kelas;

        if (!isset($this->dataSemuaKelas[$kelasInt]) || !isset($this->dataSemuaKelas[$kelasInt][$subkelas])) {
            return response()->json(['error' => "Data subkelas tidak ditemukan"], 404);
        }

        $siswaList = $this->dataSemuaKelas[$kelasInt][$subkelas];

        $dataSubkelas = collect($siswaList)->map(function ($siswa) use ($kelas, $subkelas) {
            return array_merge($siswa, [
                'kelas' => (string)$kelas,
                'subKelas' => $subkelas
            ]);
        })->all();

        return response()->json([
            'siswa' => $dataSubkelas,
            'kelas' => (string)$kelas,
            'subKelas' => $subkelas
        ]);
    }
}