<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
                  ->orWhereIn('rombel_tujuan.jenjang_id', $jenjangIds);
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

        // Validasi siswa milik jenjang pengguna
        $siswa = DB::table('siswa')->where('id', $request->siswa_id)->first();
        if (!$siswa) {
            return response()->json(['success' => false, 'message' => 'Siswa tidak ditemukan.'], 404);
        }

        if ($user && !$user->isSuperadmin()) {
            $range = $user->kelasRange();
            if ($siswa->kelas < $range['min'] || $siswa->kelas > $range['max']) {
                return response()->json(['success' => false, 'message' => 'Siswa di luar jenjang sekolah Anda.'], 403);
            }
        }

        if ($request->tipe_mutasi === 'pindah_rombel') {
            $rombelTujuan = DB::table('rombel')->where('id', $request->rombel_tujuan_id)->first();
            if (!$rombelTujuan || ($user && !$user->bolehJenjang($rombelTujuan->jenjang_id))) {
                return response()->json(['success' => false, 'message' => 'Rombel tujuan di luar jenjang Anda.'], 403);
            }
        }

        DB::beginTransaction();
        try {
            // Cari rombel asal siswa
            $penempatan = DB::table('siswa_tahun')  // ✅ fix
                ->where('siswa_id', $request->siswa_id)
                ->orderByDesc('id')
                ->first();

            $rombelAsalId = $penempatan?->rombel_id;

            if ($request->tipe_mutasi === 'pindah_rombel') {
                DB::table('siswa_tahun')  // ✅ fix
                    ->where('siswa_id', $request->siswa_id)
                    ->update(['rombel_id' => $request->rombel_tujuan_id]);

                $rombelTujuan = DB::table('rombel')->where('id', $request->rombel_tujuan_id)->first();
                if ($rombelTujuan) {
                    DB::table('siswa')
                        ->where('id', $request->siswa_id)
                        ->update([
                            'kelas' => $rombelTujuan->tingkat_kelas,
                            'sub' => $rombelTujuan->sub_nama,
                        ]);
                }
            } else {
                DB::table('siswa_tahun')  // ✅ fix
                    ->where('siswa_id', $request->siswa_id)
                    ->delete();

                DB::table('siswa')
                    ->where('id', $request->siswa_id)
                    ->update(['status' => 'mutasi']);
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
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function rombelAktif(Request $request)
    {
        $tahunAjaranAktif = DB::table('tahun_ajaran')
            ->where('aktif', 1)
            ->value('id');

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
            'debug_tahun_ajaran_id' => $tahunAjaranAktif,
            'total' => count($data),
            'data' => $data
    ]);
}

    // Proses mutasi guru
    public function mutasiGuru(Request $request)
    {
        $request->validate([
            'guru_id'          => 'required|numeric',
            'tipe_mutasi'      => 'required|in:pindah_rombel,pindah_sekolah',
            'rombel_asal_id'   => 'required_if:tipe_mutasi,pindah_rombel|numeric|nullable',
            'rombel_tujuan_id' => 'required_if:tipe_mutasi,pindah_rombel|numeric|nullable', // ✅ fix: typo numreic
            'mapel_id'         => 'required_if:tipe_mutasi,pindah_rombel|numeric|nullable', // ✅ fix: typo numreic
            'sekolah_tujuan'   => 'required_if:tipe_mutasi,pindah_sekolah|string|nullable',
            'tanggal_mutasi'   => 'required|date',
            'keterangan'       => 'nullable|string',
        ]);

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
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}