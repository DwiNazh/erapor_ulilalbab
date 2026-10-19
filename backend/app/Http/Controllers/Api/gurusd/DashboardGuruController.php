<?php

namespace App\Http\Controllers\Api\Gurusd;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PenugasanGuru;
use Illuminate\Support\Facades\DB;

class DashboardGuruController extends Controller
{
    public function getDashboardData(Request $request)
    {
        try {
            $guruId = auth()->user()->id; 

            // 1. Ambil Tahun Ajaran yang statusnya 'aktif' sesuai database Anda
            $tahunAktif = DB::table('tahun_ajaran')
                ->where('status', 'aktif') // atau ->where('aktif', 1)
                ->first();

            if (!$tahunAktif) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tahun ajaran aktif tidak ditemukan di database.'
                ], 400);
            }

            // Berdasarkan screenshot:
            $tahunAjaranId = $tahunAktif->id;   // Akan mengambil id: 8
            $namaTahunAjaran = $tahunAktif->nama; // Akan mengambil teks: "2028/2029"

            // 2. AMBIL DATA KELAS YANG DIAJAR (Hanya Tahun Ajaran Aktif)
            $kelasDiajar = PenugasanGuru::with([
                'rombel' => function($query) {
                    $query->withCount('siswa'); 
                }, 
                'mapel'
            ])
            ->where('guru_id', $guruId)
            ->where('tahun_ajaran_id', $tahunAjaranId) // Memfilter ID Tahun Ajaran Aktif (8)
            ->get()
            ->map(function ($tugas) use ($namaTahunAjaran) {
                return [
                    'id' => $tugas->id,
                    'namaKelas' => 'Kelas ' . $tugas->rombel->tingkat_kelas . '-' . $tugas->rombel->sub_nama,
                    'tahunAjaran' => $namaTahunAjaran, 
                    'mapel' => $tugas->mapel->nama,
                    'kodeMapel' => $tugas->mapel->kode,
                    'jumlahSiswa' => $tugas->rombel->siswa_count ?? 0, 
                    'ruangan' => 'Gedung Rombel ' . $tugas->rombel->sub_nama
                ];
            });

            // 3. AMBIL PERKEMBANGAN NILAI KELAS (Hanya Tahun Ajaran Aktif)
            $perkembanganNilai = DB::table('nilai_siswa')
                ->join('penugasan_guru', function ($join) {
                    $join->on('nilai_siswa.guru_id', '=', 'penugasan_guru.guru_id')
                         ->on('nilai_siswa.mapel_id', '=', 'penugasan_guru.mapel_id');
                })
                ->join('rombel', 'penugasan_guru.rombel_id', '=', 'rombel.id')
                ->join('mapel', 'nilai_siswa.mapel_id', '=', 'mapel.id')
                ->select(
                    'rombel.tingkat_kelas',
                    'rombel.sub_nama',
                    'mapel.kode as kode_mapel',
                    DB::raw('AVG(nilai_siswa.uh1) as avg_uh1'),
                    DB::raw('AVG(nilai_siswa.uh2) as avg_uh2'),
                    DB::raw('AVG(nilai_siswa.uh3) as avg_uh3'),
                    DB::raw('AVG(nilai_siswa.uh4) as avg_uh4'),
                    DB::raw('AVG(nilai_siswa.uh5) as avg_uh5'),
                    DB::raw('AVG(nilai_siswa.pts) as avg_pts'),
                    DB::raw('AVG(nilai_siswa.pas) as avg_pas')
                )
                ->where('nilai_siswa.guru_id', $guruId)
                ->where('nilai_siswa.tahun_ajaran', $namaTahunAjaran) // Mencocokkan string "2028/2029" di tabel nilai_siswa
                ->groupBy(
                    'penugasan_guru.rombel_id',
                    'nilai_siswa.mapel_id',
                    'rombel.tingkat_kelas',
                    'rombel.sub_nama',
                    'mapel.kode'
                )
                ->get();

            // 4. FORMAT DATA UNTUK DATASET CHART.JS REACT
            $paletteWarna = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
            
            $chartDatasets = $perkembanganNilai->map(function($item, $index) use ($paletteWarna) {
                $warna = $paletteWarna[$index % count($paletteWarna)];

                return [
                    'label' => 'Kelas ' . $item->tingkat_kelas . '-' . $item->sub_nama . ' (' . $item->kode_mapel . ')',
                    'data' => [
                        round($item->avg_uh1 ?? 0, 1),
                        round($item->avg_uh2 ?? 0, 1),
                        round($item->avg_uh3 ?? 0, 1),
                        round($item->avg_uh4 ?? 0, 1),
                        round($item->avg_uh5 ?? 0, 1),
                        round($item->avg_pts ?? 0, 1),
                        round($item->avg_pas ?? 0, 1),
                    ],
                    'borderColor' => $warna,
                    'backgroundColor' => $warna,
                    'tension' => 0.2,
                ];
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Data akademik tahun ajaran aktif berhasil dimuat.',
                'data' => [
                    'tahunAjaranAktif' => $namaTahunAjaran, 
                    'daftarKelas' => $kelasDiajar,
                    'chartData' => [
                        'labels' => ['UH 1', 'UH 2', 'UH 3', 'UH 4', 'UH 5', 'PTS', 'PAS'],
                        'datasets' => $chartDatasets
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }
}