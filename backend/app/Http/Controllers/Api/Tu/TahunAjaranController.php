<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TahunAjaran;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TahunAjaranController extends Controller
{
    private function jenjangUser(Request $request)
    {
        $u = $request->user();
        if (!$u) {
            return null;
        }
        $j = $u->isSuperadmin() ? ($request->input('jenjang_id') ?: $request->header('X-Jenjang-Id')) : $u->jenjang_id;
        return $j ? (int) $j : null;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $isSuperadmin = $user && $user->isSuperadmin();
        $jenjangId = $this->jenjangUser($request);

        if (!$isSuperadmin || $jenjangId) {
            if (!$jenjangId) {
                $allYears = collect();
            } else {
                $allYears = TahunAjaran::join('tahun_ajaran_jenjang', 'tahun_ajaran_jenjang.tahun_ajaran_id', '=', 'tahun_ajaran.id')
                    ->where('tahun_ajaran_jenjang.jenjang_id', $jenjangId)
                    ->select(
                        'tahun_ajaran.*',
                        'tahun_ajaran_jenjang.aktif as jenjang_aktif',
                        'tahun_ajaran_jenjang.status as jenjang_status',
                        'tahun_ajaran_jenjang.semester_aktif as jenjang_semester_aktif'
                    )
                    ->orderBy('tahun_ajaran.nama', 'desc')
                    ->get();

                foreach ($allYears as $t) {
                    $t->aktif = (bool) $t->jenjang_aktif;
                    $t->status = $t->jenjang_status;
                    $t->semester_aktif = $t->jenjang_semester_aktif;
                    $t->finalized_at = $t->finalizedAtForJenjang($jenjangId);
                    $t->is_finalized = $t->isFinalizedForJenjang($jenjangId);
                    unset($t->jenjang_aktif, $t->jenjang_status, $t->jenjang_semester_aktif);
                }
            }
        } else {
            $query = TahunAjaran::orderBy('nama', 'desc');
            $allYears = $query->get();
        }

        Log::info('TahunAjaranController@index', [
            'returned_count' => $allYears->count(),
            'years' => $allYears->pluck('nama', 'id', 'aktif')->toArray(),
            'user_id' => auth()->id() ?? 'guest',
            'request_url' => request()->fullUrl(),
        ]);

        return response()->json([
            'success' => true,
            'data'    => $allYears,
        ]);
    }

    public function store(Request $request)
    {
        $request->merge(['nama' => trim($request->nama ?? '')]);

        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'regex:/^\d{4}\/\d{4}$/',
            ],
        ]);

        $nama = $validated['nama'];
        $user = $request->user();

        $targetJenjangIds = [];
        if (!$user || !$user->isSuperadmin()) {
            $jenjangId = $user ? $user->jenjang_id : null;
            if (!$jenjangId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akun Anda belum terhubung ke jenjang.'
                ], 422);
            }
            $targetJenjangIds = [(int) $jenjangId];
        } else {
            $semuaJenjang = filter_var($request->input('semua_jenjang'), FILTER_VALIDATE_BOOLEAN) ||
                $request->input('semua_jenjang') === 'true' ||
                $request->input('semua_jenjang') === 1 ||
                $request->input('semua_jenjang') === '1';

            $inputJenjangId = $request->input('jenjang_id') ?: $request->header('X-Jenjang-Id');

            if ($semuaJenjang) {
                $targetJenjangIds = DB::table('jenjang')->pluck('id')->map(fn($id) => (int) $id)->all();
            } elseif ($inputJenjangId) {
                $targetJenjangIds = [(int) $inputJenjangId];
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Pilih jenjang atau semua jenjang.'
                ], 422);
            }
        }

        try {
            $tahun = DB::transaction(function () use ($nama, $targetJenjangIds) {
                $tahun = TahunAjaran::firstOrCreate(
                    ['nama' => $nama],
                    ['status' => 'draft', 'aktif' => 0, 'semester_aktif' => null]
                );

                $now = now();
                $isSingleTarget = count($targetJenjangIds) === 1;

                foreach ($targetJenjangIds as $jid) {
                    $exists = DB::table('tahun_ajaran_jenjang')
                        ->where('tahun_ajaran_id', $tahun->id)
                        ->where('jenjang_id', $jid)
                        ->exists();

                    if ($exists && $isSingleTarget) {
                        throw new \DomainException('Tahun ajaran ini sudah ada untuk jenjang Anda.');
                    }

                    DB::table('tahun_ajaran_jenjang')->insertOrIgnore([
                        'tahun_ajaran_id' => $tahun->id,
                        'jenjang_id'      => $jid,
                        'aktif'           => 0,
                        'status'          => 'draft',
                        'semester_aktif'  => null,
                        'created_at'      => $now,
                        'updated_at'      => $now,
                    ]);
                }

                return $tahun;
            });
        } catch (\DomainException $de) {
            return response()->json([
                'success' => false,
                'message' => $de->getMessage()
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat tahun ajaran'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran berhasil dibuat',
            'data'    => $tahun
        ], 201);
    }

    public function aktifkan(Request $request, $id)
    {
        $jid = $this->jenjangUser($request);
        if (!$jid) {
            return response()->json([
                'success' => false,
                'message' => 'Jenjang tidak diketahui.'
            ], 422);
        }

        $tahunTarget = TahunAjaran::find($id);
        if (!$tahunTarget) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan'
            ], 404);
        }

        $barisTarget = $tahunTarget->barisJenjang($jid);
        if (!$barisTarget) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan untuk jenjang ini'
            ], 404);
        }

        $user = $request->user();
        if ((!$user || !$user->isSuperadmin()) && $barisTarget->status === 'dikunci') {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran yang sudah dikunci hanya bisa diaktifkan kembali oleh superadmin.'
            ], 403);
        }

        $barisAktifLain = DB::table('tahun_ajaran_jenjang')
            ->where('jenjang_id', $jid)
            ->where('aktif', 1)
            ->where('tahun_ajaran_id', '!=', $id)
            ->first();

        if ($barisAktifLain) {
            $tahunAktifLain = TahunAjaran::find($barisAktifLain->tahun_ajaran_id);
            if ($tahunAktifLain && !$tahunAktifLain->isFinalizedForJenjang($jid)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tahun ajaran sebelumnya belum difinalisasi untuk jenjang Anda.'
                ], 422);
            }
        }

        DB::transaction(function () use ($jid, $id) {
            $now = now();

            DB::table('tahun_ajaran_jenjang')
                ->where('jenjang_id', $jid)
                ->where('aktif', 1)
                ->where('tahun_ajaran_id', '!=', $id)
                ->update([
                    'aktif'      => 0,
                    'status'     => 'dikunci',
                    'updated_at' => $now,
                ]);

            DB::table('tahun_ajaran_jenjang')
                ->where('jenjang_id', $jid)
                ->where('tahun_ajaran_id', $id)
                ->update([
                    'aktif'          => 1,
                    'status'         => 'aktif',
                    'semester_aktif' => 'ganjil',
                    'updated_at'     => $now,
                ]);
        });

        $tahunTarget = $tahunTarget->fresh();
        $b = $tahunTarget->barisJenjang($jid);
        if ($b) {
            $tahunTarget->aktif = (bool) $b->aktif;
            $tahunTarget->status = $b->status;
            $tahunTarget->semester_aktif = $b->semester_aktif;
            $tahunTarget->finalized_at = $tahunTarget->finalizedAtForJenjang($jid);
            $tahunTarget->is_finalized = $tahunTarget->isFinalizedForJenjang($jid);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran berhasil diaktifkan',
            'data'    => $tahunTarget
        ]);
    }

    public function tutup(Request $request, $id)
    {
        $jid = $this->jenjangUser($request);
        if (!$jid) {
            return response()->json([
                'success' => false,
                'message' => 'Jenjang tidak diketahui.'
            ], 422);
        }

        $tahun = TahunAjaran::find($id);
        if (!$tahun) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan'
            ], 404);
        }

        $barisJenjang = $tahun->barisJenjang($jid);
        if (!$barisJenjang) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan untuk jenjang ini'
            ], 404);
        }

        if (!$barisJenjang->aktif) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya tahun ajaran aktif yang dapat ditutup'
            ], 422);
        }

        if (!$tahun->isFinalizedForJenjang($jid)) {
            return response()->json([
                'success' => false,
                'message' => 'Belum difinalisasi untuk jenjang Anda.'
            ], 422);
        }

        DB::table('tahun_ajaran_jenjang')
            ->where('tahun_ajaran_id', $id)
            ->where('jenjang_id', $jid)
            ->update([
                'aktif'      => 0,
                'status'     => 'dikunci',
                'updated_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran berhasil ditutup dan dikunci'
        ]);
    }

    public function aktif(Request $request)
    {
        $tahun = TahunAjaran::aktifUntuk($request->user());

        if ($tahun) {
            $jenjangId = $this->jenjangUser($request);
            if ($jenjangId) {
                $baris = $tahun->barisJenjang($jenjangId);
                if ($baris) {
                    $tahun->aktif = (bool) $baris->aktif;
                    $tahun->status = $baris->status;
                    $tahun->semester_aktif = $baris->semester_aktif;
                }
                $isFinalizedJenjang = $tahun->isFinalizedForJenjang($jenjangId);
                $finalizedAtJenjang = $tahun->finalizedAtForJenjang($jenjangId);
                $tahun->is_finalized = $isFinalizedJenjang;
                $tahun->finalized_at = $finalizedAtJenjang;
                $tahun->kenaikan_kelas_finalized_at = $finalizedAtJenjang;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $tahun,
            'message' => $tahun ? null : 'Belum ada tahun ajaran aktif'
        ]);
    }

    public function gantiSemester(Request $request, $id)
    {
        $request->validate([
            'semester' => 'required|in:ganjil,genap'
        ]);

        $jid = $this->jenjangUser($request);
        if (!$jid) {
            return response()->json([
                'success' => false,
                'message' => 'Jenjang tidak diketahui.'
            ], 422);
        }

        $tahun = TahunAjaran::find($id);
        if (!$tahun) {
            return response()->json([
                'success' => false,
                'message' => 'Tahun ajaran tidak ditemukan'
            ], 404);
        }

        $barisJenjang = $tahun->barisJenjang($jid);
        if (!$barisJenjang || !$barisJenjang->aktif) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya tahun ajaran aktif yang dapat mengganti semester'
            ], 422);
        }

        DB::table('tahun_ajaran_jenjang')
            ->where('tahun_ajaran_id', $id)
            ->where('jenjang_id', $jid)
            ->update([
                'semester_aktif' => $request->semester,
                'updated_at'     => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Semester berhasil diubah'
        ]);
    }
}