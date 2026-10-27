<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use App\Models\Rombel;
use App\Models\SiswaTahun;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MutasiController extends Controller
{
    // List semua mutasi
    public function index(Request $request)
    {
        $query = DB::table('mutasi')
            ->leftJoin('rombel as rombel_asal', 'mutasi.rombel_asal_id', '=', 'rombel_asal.id')
            ->leftJoin('rombel as rombel_tujuan', 'mutasi.rombel_tujuan_id', '=', 'rombel_tujuan.id')
            ->leftJoin('users as admin', 'mutasi.dilakukan_oleh', '=', 'admin.id')
            ->select(
                'mutasi.*',
                DB::raw("CONCAT('Kelas ', rombel_asal.tingkat_kelas, ' ', rombel_asal.sub_nama) as nama_rombel_asal"),
                DB::raw("CONCAT('Kelas ', rombel_tujuan.tingkat_kelas, ' ', rombel_tujuan.sub_nama) as nama_rombel_tujuan"),
                'admin.name as dilakukan_oleh_nama'
            )
            ->orderByDesc('mutasi.tanggal_mutasi');

        $user = $request->user();
        $jenjangIds = $user ? $user->jenjangIds() : null;

        if ($jenjangIds !== null) {
            $query->where(function ($q) use ($jenjangIds) {
                $q->whereIn('rombel_asal.jenjang_id', $jenjangIds)
                  ->orWhereIn('rombel_tujuan.jenjang_id', $jenjangIds)
                  ->orWhere(function ($g) use ($jenjangIds) {
                      $g->where('mutasi.jenis', 'guru')
                        ->whereIn('mutasi.target_id', DB::table('users')->whereIn('jenjang_id', $jenjangIds)->select('id'));
                  });
            });
        }

        if ($request->jenis) {
            $query->where('mutasi.jenis', $request->jenis);
        }

        $data = $query->get()->map(function ($item) {
            if ($item->jenis === 'siswa') {
                $target = DB::table('siswa')->where('id', $item->target_id)->first();
                $item->nama_target = $target?->nama ?? '-';
            } else {
                $target = DB::table('users')->where('id', $item->target_id)->first();
                $item->nama_target = $target?->name ?? '-';
            }
            return $item;
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    // Proses mutasi siswa
    public function mutasiSiswa(Request $request)
    {
        $request->validate([
            'siswa_id'         => 'required|numeric',
            'tipe_mutasi'      => 'required|in:pindah_rombel,pindah_sekolah',
            'rombel_tujuan_id' => 'required_if:tipe_mutasi,pindah_rombel|numeric|nullable',
            'sekolah_tujuan'   => 'required_if:tipe_mutasi,pindah_sekolah|string|nullable',
            'tanggal_mutasi'   => 'required|date',
            'keterangan'       => 'nullable|string',
        ]);

        $user = $request->user();
        $siswa = DB::table('siswa')->where('id', $request->siswa_id)->first();
        if (!$siswa || !SiswaTahun::untukUser($user)->where('siswa_id', $request->siswa_id)->exists()) {
            return response()->json(['success' => false, 'message' => 'Siswa tidak ditemukan.'], 404);
        }

        if ($request->tipe_mutasi === 'pindah_rombel') {
            $rombelTujuan = DB::table('rombel')->where('id', $request->rombel_tujuan_id)->first();
            if (!$rombelTujuan || !$user->bolehJenjang($rombelTujuan->jenjang_id)) {
                return response()->json(['success' => false, 'message' => 'Rombel tujuan tidak ditemukan.'], 404);
            }

            $penempatan = DB::table('siswa_tahun')
                ->where('siswa_id', $request->siswa_id)
                ->where('tahun_ajaran_id', $rombelTujuan->tahun_ajaran_id)
                ->first();
            if (!$penempatan) {
                return response()->json(['success' => false, 'message' => 'Siswa tidak punya data pada tahun ajaran rombel tujuan.'], 422);
            }

            if ($penempatan->jenjang_id !== null && (int)$penempatan->jenjang_id !== (int)$rombelTujuan->jenjang_id) {
                return response()->json(['success' => false, 'message' => 'Rombel tujuan beda jenjang dengan siswa.'], 422);
            }

            if (in_array($rombelTujuan->kelompok_gender, ['ikhwan', 'akhwat'], true) && $siswa->kategori !== $rombelTujuan->kelompok_gender) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kategori siswa tidak sesuai dengan rombel ' . ucfirst($rombelTujuan->kelompok_gender) . ' (kategori berbeda atau belum diisi).'
                ], 422);
            }

            $rombelAsalId = $penempatan->rombel_id;
        } else {
            $penempatan = DB::table('siswa_tahun')
                ->join('tahun_ajaran', 'tahun_ajaran.id', '=', 'siswa_tahun.tahun_ajaran_id')
                ->where('siswa_tahun.siswa_id', $request->siswa_id)
                ->where('tahun_ajaran.aktif', 1)
                ->select('siswa_tahun.*')
                ->first();
            if (!$penempatan) {
                return response()->json(['success' => false, 'message' => 'Siswa tidak punya data pada tahun ajaran aktif.'], 422);
            }

            $rombelAsalId = $penempatan->rombel_id;
        }

        DB::beginTransaction();
        try {
            if ($request->tipe_mutasi === 'pindah_rombel') {
                DB::table('siswa_tahun')
                    ->where('id', $penempatan->id)
                    ->update([
                        'rombel_id'  => $request->rombel_tujuan_id,
                        'jenjang_id' => $rombelTujuan->jenjang_id,
                        'updated_at' => now(),
                    ]);

                DB::table('siswa')
                    ->where('id', $request->siswa_id)
                    ->update([
                        'kelas' => $rombelTujuan->tingkat_kelas,
                        'sub'   => $rombelTujuan->sub_nama,
                    ]);
            } else {
                DB::table('siswa_tahun')
                    ->where('id', $penempatan->id)
                    ->update([
                        'status'       => 'MUTASI',
                        'is_processed' => 1,
                        'updated_at'   => now(),
                    ]);
            }

            DB::table('mutasi')->insert([
                'jenis'            => 'siswa',
                'target_id'        => $request->siswa_id,
                'tipe_mutasi'      => $request->tipe_mutasi,
                'rombel_asal_id'   => $rombelAsalId,
                'rombel_tujuan_id' => $request->rombel_tujuan_id ?? null,
                'sekolah_tujuan'   => $request->sekolah_tujuan ?? null,
                'keterangan'       => $request->keterangan,
                'tanggal_mutasi'   => $request->tanggal_mutasi,
                'dilakukan_oleh'   => Auth::id(),
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Mutasi siswa berhasil dicatat.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Mutasi siswa: '.$e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal memproses mutasi.'], 500);
        }
    }

    public function rombelAktif(Request $request)
    {
        $tahunAjaranAktif = TahunAjaran::getAktif()?->id;

        $user = $request->user();
        $jenjangIds = $user ? $user->jenjangIds() : null;

        $data = DB::table('rombel')
            ->where('tahun_ajaran_id', $tahunAjaranAktif)
            ->when($jenjangIds !== null, fn($q) => $q->whereIn('jenjang_id', $jenjangIds))
            ->select('id', 'tingkat_kelas', 'sub_nama', 'jenjang_id')
            ->orderBy('tingkat_kelas')
            ->orderBy('sub_nama')
            ->get();

        return response()->json([
            'success' => true,
            'total'   => count($data),
            'data'    => $data,
        ]);
    }

    // Proses mutasi guru
    public function mutasiGuru(Request $request)
    {
        $request->validate([
            'guru_id'          => 'required|numeric',
            'tipe_mutasi'      => 'required|in:pindah_rombel,pindah_sekolah',
            'rombel_asal_id'   => 'required_if:tipe_mutasi,pindah_rombel|numeric|nullable',
            'rombel_tujuan_id' => 'required_if:tipe_mutasi,pindah_rombel|numeric|nullable',
            'mapel_id'         => 'required_if:tipe_mutasi,pindah_rombel|numeric|nullable',
            'sekolah_tujuan'   => 'required_if:tipe_mutasi,pindah_sekolah|string|nullable',
            'tanggal_mutasi'   => 'required|date',
            'keterangan'       => 'nullable|string',
        ]);

        $guru = DB::table('users')->where('id', $request->guru_id)->where('role', 'guru')->first();
        if (!$guru || !$request->user()->bolehJenjang($guru->jenjang_id)) {
            return response()->json(['success' => false, 'message' => 'Guru tidak ditemukan.'], 404);
        }

        if ($request->tipe_mutasi === 'pindah_rombel') {
            $rombelAsal = Rombel::untukUser($request->user())->find($request->rombel_asal_id);
            if (!$rombelAsal) {
                return response()->json(['success' => false, 'message' => 'Rombel asal tidak ditemukan.'], 404);
            }
            $rombelTujuan = Rombel::untukUser($request->user())->find($request->rombel_tujuan_id);
            if (!$rombelTujuan) {
                return response()->json(['success' => false, 'message' => 'Rombel tujuan tidak ditemukan.'], 404);
            }
        }

        DB::beginTransaction();
        try {
            if ($request->tipe_mutasi === 'pindah_rombel') {
                DB::table('penugasan_guru')
                    ->where('guru_id', $request->guru_id)
                    ->where('rombel_id', $request->rombel_asal_id)
                    ->where('mapel_id', $request->mapel_id)
                    ->update(['rombel_id' => $request->rombel_tujuan_id]);
            } else {
                DB::table('penugasan_guru')
                    ->where('guru_id', $request->guru_id)
                    ->delete();

                DB::table('users')
                    ->where('id', $request->guru_id)
                    ->update(['status' => 'mutasi']);
            }

            DB::table('mutasi')->insert([
                'jenis'            => 'guru',
                'target_id'        => $request->guru_id,
                'tipe_mutasi'      => $request->tipe_mutasi,
                'rombel_asal_id'   => $request->rombel_asal_id ?? null,
                'rombel_tujuan_id' => $request->rombel_tujuan_id ?? null,
                'sekolah_tujuan'   => $request->sekolah_tujuan ?? null,
                'keterangan'       => $request->keterangan,
                'tanggal_mutasi'   => $request->tanggal_mutasi,
                'dilakukan_oleh'   => Auth::id(),
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Mutasi guru berhasil dicatat.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Mutasi guru: '.$e->getMessage());
            return response()->json(['success' => false, 'message' => 'Gagal memproses mutasi.'], 500);
        }
    }
}