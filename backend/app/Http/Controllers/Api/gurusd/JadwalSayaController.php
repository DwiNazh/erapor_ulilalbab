<?php

namespace App\Http\Controllers\Api\gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JadwalSayaController extends Controller
{
    public function index()
    {
        try {
            $guruId = Auth::id();

            // 1. Dapatkan ID Tahun Ajaran yang sedang Aktif saat ini
            $tahunAktif = DB::table('tahun_ajaran')
                ->where('status', 'aktif') 
                ->first();

            if (!$tahunAktif) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tahun ajaran aktif belum dikonfigurasi oleh Admin.'
                ], 400);
            }

            $tahunAjaranId = $tahunAktif->id; // Mengambil ID tahun aktif (misal: 8)

            // 2. Ambil jadwal dengan filter tahun ajaran aktif dari penugasan_guru
            $jadwal = DB::table('jadwal')
                ->join('penugasan_guru', function ($join) use ($tahunAjaranId) {
                    $join->on('jadwal.rombel_id', '=', 'penugasan_guru.rombel_id')
                         ->on('jadwal.mapel_id', '=', 'penugasan_guru.mapel_id')
                         ->where('penugasan_guru.tahun_ajaran_id', $tahunAjaranId); // Filter Tahun Ajaran Aktif di sini
                })
                ->join('mapel', 'jadwal.mapel_id', '=', 'mapel.id')
                ->join('rombel', 'jadwal.rombel_id', '=', 'rombel.id')
                ->where('penugasan_guru.guru_id', $guruId)
                ->select(
                    'jadwal.hari',
                    'jadwal.jam_mulai',
                    'jadwal.jam_selesai',
                    'mapel.nama as nama_mapel',
                    'rombel.tingkat_kelas',
                    'rombel.sub_nama'
                )
                ->orderByRaw("FIELD(jadwal.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')")
                ->orderBy('jadwal.jam_mulai')
                ->get();

            $formattedData = $jadwal->map(function ($item) {
                return [
                    'hari' => $item->hari,
                    'jam_mulai' => substr($item->jam_mulai, 0, 5),
                    'jam_selesai' => substr($item->jam_selesai, 0, 5),
                    'mapel' => [
                        'nama' => $item->nama_mapel
                    ],
                    'rombel' => [
                        'nama' => "Kelas " . $item->tingkat_kelas . ($item->sub_nama ? ' ' . $item->sub_nama : ''),
                        'tingkat_kelas' => $item->tingkat_kelas
                    ]
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}