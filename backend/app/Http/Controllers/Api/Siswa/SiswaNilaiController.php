<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\NilaiSiswa;
use App\Models\NilaiKokurikuler;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class SiswaNilaiController extends Controller
{
    private function getSiswaId()
    {
        return Auth::id();
    }

    private function konversiSkalaKeGrade($nilaiSkala)
    {
        if ($nilaiSkala === null || !is_numeric($nilaiSkala)) return $nilaiSkala;
        $n = (float) $nilaiSkala;
        if ($n >= 3.5) return 'A';
        if ($n >= 2.8) return 'B';
        if ($n >= 2.0) return 'C';
        if ($n >= 1.0) return 'D';
        return 'E';
    }

    private function getTemplateDeskripsiKokurikuler($siswaId, $tahunAjaran)
    {
        $waliKelas = DB::table('siswa_tahun as st')
            ->join('tahun_ajaran as ta', 'ta.id', '=', 'st.tahun_ajaran_id')
            ->join('rombel as r', 'r.id', '=', 'st.rombel_id')
            ->where('st.siswa_id', $siswaId)
            ->where('ta.nama', trim($tahunAjaran))
            ->select('r.guru_id')
            ->first();

        if (!$waliKelas || !$waliKelas->guru_id) {
            return collect();
        }

        return DB::table('template_deskripsi')
            ->where('guru_id', $waliKelas->guru_id)
            ->where('jenis', 'kokurikuler')
            ->get()
            ->groupBy(fn($t) => $t->aspek . '_' . $t->grade);
    }

    private function buildDeskripsiKokurikuler($row, $templates)
    {
        $getDesc = function ($aspek, $grade) use ($templates) {
            $key = $aspek . '_' . $grade;
            return $templates[$key][0]->deskripsi ?? null;
        };

        $gradeMutabaah = $this->konversiSkalaKeGrade($row->mutabaah_yaumiyah);

        return [
            $getDesc('mutabaah_yaumiyah', $gradeMutabaah),
            $getDesc('bina_pribadi_islam', $row->bina_pribadi_islam),
            $getDesc('literasi', $row->literasi),
            $getDesc('pjbl', $row->pjbl),
        ];
    }

    // ================================================================
    // GET /api/siswa/nilai — intrakurikuler + pecahan quran (UPDATED)
    // ================================================================
    public function index(Request $request)
    {
        $siswaId = $this->getSiswaId();

        if (!$siswaId) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi tidak valid, silakan login ulang.',
            ], 401);
        }

        $semesterReq = $request->query('semester', '1');
        $tahunReq    = $request->query('tahun_ajaran');

        // 1. Ambil Nilai Mapel Intrakurikuler Biasa
        $queryMapel = DB::table('nilai_siswa')
            ->join('mapel', 'nilai_siswa.mapel_id', '=', 'mapel.id')
            ->where('nilai_siswa.siswa_id', $siswaId)
            ->where('nilai_siswa.semester', $semesterReq);

        if ($request->filled('tahun_ajaran')) {
            $queryMapel->where('nilai_siswa.tahun_ajaran', $tahunReq);
        }

        $nilaiMapel = $queryMapel->select([
            'mapel.nama as nama_mapel',
            'mapel.kode',
            'nilai_siswa.semester',
            'nilai_siswa.tahun_ajaran',
            'nilai_siswa.uh1', 'nilai_siswa.uh2', 'nilai_siswa.uh3', 'nilai_siswa.uh4', 'nilai_siswa.uh5',
            'nilai_siswa.pts',
            'nilai_siswa.pas'
        ])->orderBy('mapel.nama')->get()->map(function ($item) {
            $item->is_quran = false;
            return $item;
        });

        // Tentukan target tahun ajaran aktif jika params kosong
        $targetTahun = $tahunReq;
        if (!$targetTahun && $nilaiMapel->isNotEmpty()) {
            $targetTahun = $nilaiMapel->first()->tahun_ajaran;
        }

        // 2. Ambil Nilai Pecahan Al-Qur'an (Tahfidz & Tilawah)
        $nilaiQuranFormatted = [];
        if ($targetTahun) {
            $queryQuran = DB::table('nilai_quran')
                ->where('siswa_id', $siswaId)
                ->where('semester', $semesterReq)
                ->where('tahun_ajaran', $targetTahun)
                ->get();

            foreach (['tahfidz', 'tilawah'] as $jenis) {
                $qRow = $queryQuran->firstWhere('jenis', $jenis);
                $nilaiQuranFormatted[] = [
                    'nama_mapel'   => "Al-Qur'an — " . ucfirst($jenis),
                    'kode'         => 'QURAN_' . strtoupper($jenis),
                    'semester'     => $semesterReq,
                    'tahun_ajaran' => $targetTahun,
                    'uh1'          => $qRow?->uh1 ?? null,
                    'uh2'          => $qRow?->uh2 ?? null,
                    'uh3'          => $qRow?->uh3 ?? null,
                    'uh4'          => $qRow?->uh4 ?? null,
                    'uh5'          => $qRow?->uh5 ?? null,
                    'pts'          => $qRow?->pts ?? null,
                    'pas'          => $qRow?->pas ?? null,
                    'is_quran'     => true
                ];
            }
        }

        // Merge Gabungkan data mapel dan Al-Qur'an pecahan
        $finalData = array_merge($nilaiMapel->toArray(), $nilaiQuranFormatted);

        // Ambil daftar history tahun ajaran siswa untuk filter dropdown
        $tahunList = DB::table('nilai_siswa')
            ->where('siswa_id', $siswaId)
            ->distinct()
            ->orderByDesc('tahun_ajaran')
            ->pluck('tahun_ajaran');

        return response()->json([
            'success'    => true,
            'data'       => $finalData,
            'tahun_list' => $tahunList,
        ]);
    }

    public function kokurikuler(Request $request)
    {
        $siswaId = $this->getSiswaId();

        if (!$siswaId) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi tidak valid, silakan login ulang.',
            ], 401);
        }

        $semesterReq = $request->query('semester', '1');
        $tahunReq    = $request->query('tahun_ajaran');

        $query = DB::table('nilai_kokurikuler')->where('siswa_id', $siswaId);

        if ($request->filled('semester')) {
            $query->where('semester', $semesterReq);
        }

        if ($request->filled('tahun_ajaran')) {
            $query->where('tahun_ajaran', $tahunReq);
        }

        $nilai = $query->orderByDesc('tahun_ajaran')->get();

        $targetTahun = $tahunReq;
        if (!$targetTahun && $nilai->isNotEmpty()) {
            $targetTahun = $nilai->first()->tahun_ajaran;
        }

        $templates = $targetTahun
            ? $this->getTemplateDeskripsiKokurikuler($siswaId, $targetTahun)
            : collect();

        $pjblJudul = null;

        if ($targetTahun) {
            $siswaTahun = DB::table('siswa_tahun')
                ->join('tahun_ajaran', 'tahun_ajaran.id', '=', 'siswa_tahun.tahun_ajaran_id')
                ->where('siswa_tahun.siswa_id', $siswaId)
                ->where('tahun_ajaran.nama', trim($targetTahun))
                ->select('siswa_tahun.rombel_id')
                ->first();

            if ($siswaTahun) {
                $semesterString = ($semesterReq == "1") ? "ganjil" : "genap";

                $pjblData = DB::table('pjbl_judul')
                    ->where('rombel_id', $siswaTahun->rombel_id)
                    ->where('semester', $semesterString)
                    ->first();

                if ($pjblData) {
                    $pjblJudul = $pjblData->judul;
                }
            }
        }

        $nilai->transform(function ($item) use ($templates) {
            $item->mutabaah_yaumiyah = $this->konversiSkalaKeGrade($item->mutabaah_yaumiyah);
            $deskripsiDariTemplate = $this->buildDeskripsiKokurikuler($item, $templates);

            $deskripsiDb = [];
            if (isset($item->deskripsi_aspek) && is_string($item->deskripsi_aspek)) {
                $decoded     = json_decode($item->deskripsi_aspek, true);
                $deskripsiDb = is_array($decoded) ? $decoded : [];
            }

            $item->deskripsi_aspek = [
                $deskripsiDariTemplate[0] ?? $deskripsiDb[0] ?? null,
                $deskripsiDariTemplate[1] ?? $deskripsiDb[1] ?? null,
                $deskripsiDariTemplate[2] ?? $deskripsiDb[2] ?? null,
                $deskripsiDariTemplate[3] ?? $deskripsiDb[3] ?? null,
            ];

            return $item;
        });

        $tahunList = DB::table('nilai_kokurikuler')
            ->where('siswa_id', $siswaId)
            ->distinct()
            ->orderByDesc('tahun_ajaran')
            ->pluck('tahun_ajaran');

        return response()->json([
            'success'    => true,
            'jenis'      => 'kokurikuler',
            'data'       => $nilai,
            'tahun_list' => $tahunList,
            'pjbl_judul' => $pjblJudul,
        ]);
    }

    public function ekstrakurikuler(Request $request)
    {
        $siswaId = $this->getSiswaId();

        if (!$siswaId) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi tidak valid, silakan login ulang.',
            ], 401);
        }

        $query = DB::table('ekstrakurikuler_siswa')
            ->join('ekstrakurikuler', 'ekstrakurikuler_siswa.ekstrakurikuler_id', '=', 'ekstrakurikuler.id')
            ->where('ekstrakurikuler_siswa.siswa_id', $siswaId)
            ->select(
                'ekstrakurikuler.nama as nama_ekstrakurikuler',
                'ekstrakurikuler_siswa.nilai',
                'ekstrakurikuler_siswa.deskripsi',
                'ekstrakurikuler_siswa.semester',
                'ekstrakurikuler_siswa.tahun_ajaran'
            );

        if ($request->filled('semester')) {
            $query->where('ekstrakurikuler_siswa.semester', $request->semester);
        }

        if ($request->filled('tahun_ajaran')) {
            $query->where('ekstrakurikuler_siswa.tahun_ajaran', $request->tahun_ajaran);
        }

        $nilai = $query->orderBy('ekstrakurikuler.nama')->get();

        $tahunList = DB::table('ekstrakurikuler_siswa')
            ->where('siswa_id', $siswaId)
            ->distinct()
            ->orderByDesc('tahun_ajaran')
            ->pluck('tahun_ajaran');

        return response()->json([
            'success'    => true,
            'jenis'      => 'ekstrakurikuler',
            'data'       => $nilai,
            'tahun_list' => $tahunList,
        ]);
    }
}