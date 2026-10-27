<?php

namespace App\Http\Controllers\Api\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class Pengaturansuperadmincontroller extends Controller
{
    // ═══════════════════════════════════════
    // PROFIL SEKOLAH
    // ═══════════════════════════════════════

    public function getSekolah()
    {
        $data = DB::table('pengaturans')->first();

        if (!$data) {
            return response()->json([
                'success' => true,
                'data' => [
                    'nama_sekolah'   => '',
                    'npsn'           => '',
                    'alamat'         => '',
                    'kota'           => '',
                    'provinsi'       => '',
                    'kode_pos'       => '',
                    'telepon'        => '',
                    'email'          => '',
                    'website'        => '',
                    'kepala_sekolah' => '',
                    'nip_kepala'     => '',
                    'logo_url'       => null,
                ]
            ]);
        }

        $arr = (array) $data;

        $arr['logo_url'] = !empty($arr['logo'])
            ? asset('storage/' . $arr['logo'])
            : null;

        return response()->json([
            'success' => true,
            'data' => $arr
        ]);
    }

    public function saveSekolah(Request $request)
    {
        $request->validate([
            'nama_sekolah'   => 'required|string|max:255',
            'npsn'           => 'nullable|string|max:20',
            'alamat'         => 'nullable|string',
            'kota'           => 'nullable|string|max:100',
            'provinsi'       => 'nullable|string|max:100',
            'kode_pos'       => 'nullable|string|max:10',
            'telepon'        => 'nullable|string|max:20',
            'email'          => 'nullable|email|max:100',

            // UBAH BAGIAN INI
            'website'        => 'nullable|string|max:100',

            'kepala_sekolah' => 'nullable|string|max:255',
            'nip_kepala'     => 'nullable|string|max:30',
            'logo'           => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $existing = DB::table('pengaturans')->first();

        $logoPath = $existing->logo ?? null;

        // Upload logo baru
        if ($request->hasFile('logo')) {

            // hapus logo lama
            if ($logoPath && Storage::disk('public')->exists($logoPath)) {
                Storage::disk('public')->delete($logoPath);
            }

            $logoPath = $request->file('logo')
                ->store('logo-sekolah', 'public');
        }

        // otomatis tambah https:// jika belum ada
        $website = $request->website;

        if ($website && !str_starts_with($website, 'http://') && !str_starts_with($website, 'https://')) {
            $website = 'https://' . $website;
        }

        $payload = [
            'nama_sekolah'   => $request->nama_sekolah,
            'npsn'           => $request->npsn,
            'alamat'         => $request->alamat,
            'kota'           => $request->kota,
            'provinsi'       => $request->provinsi,
            'kode_pos'       => $request->kode_pos,
            'telepon'        => $request->telepon,
            'email'          => $request->email,
            'website'        => $website,
            'kepala_sekolah' => $request->kepala_sekolah,
            'nip_kepala'     => $request->nip_kepala,
            'logo'           => $logoPath,
            'updated_at'     => now(),
        ];

        if ($existing) {

            DB::table('pengaturans')
                ->where('id', $existing->id)
                ->update($payload);

        } else {

            $payload['created_at'] = now();

            DB::table('pengaturans')
                ->insert($payload);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil sekolah berhasil disimpan',
        ]);
    }

    // ═══════════════════════════════════════
    // TAHUN AJARAN
    // ═══════════════════════════════════════

    public function getTahunAjaran()
    {
        $data = DB::table('tahun_ajaran')->orderByDesc('id')->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function storeTahunAjaran(Request $request)
    {
        $request->validate([
            'tahun'    => 'required|string|max:20|unique:tahun_ajaran,nama',
            'semester' => 'required|in:1,2',
        ]);

        DB::table('tahun_ajaran')->insert([
            'nama'            => $request->tahun,
            'semester_aktif'  => $request->semester == 1 ? 'ganjil' : 'genap',
            'aktif'           => 0,
            'status'          => 'draft',
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tahun ajaran ditambahkan'
        ]);
    }

    public function aktifkanTahunAjaran($id)
    {
        DB::table('tahun_ajaran')->where('id', '!=', $id)->update([
            'aktif'  => 0,
            'status' => 'dikunci',
        ]);

        DB::table('tahun_ajaran')->where('id', $id)->update([
            'aktif'      => 1,
            'status'     => 'aktif',
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Tahun ajaran diaktifkan']);
    }

    public function deleteTahunAjaran($id)
    {
        $ta = DB::table('tahun_ajaran')->where('id', $id)->first();

        if ($ta && $ta->aktif) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak bisa hapus tahun ajaran yang sedang aktif'
            ], 422);
        }

        DB::table('tahun_ajaran')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Tahun ajaran dihapus']);
    }

    // ═══════════════════════════════════════
    // SISTEM INFO
    // ═══════════════════════════════════════

    public function getSistem()
    {
        try {

            // cek backup terakhir
            $lastBackup = null;

            if (DB::getSchemaBuilder()->hasTable('system_backups')) {
                $lastBackup = DB::table('system_backups')
                    ->orderByDesc('created_at')
                    ->value('created_at');
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'versi_app'   => env('APP_VERSION', '1.0.0'),
                    'total_user'  => User::count(),
                    'total_siswa' => \App\Models\Siswa::count(),
                    'last_backup' => $lastBackup
                        ? \Carbon\Carbon::parse($lastBackup)
                        ->timezone('Asia/Jakarta')
                        ->format('d M Y H:i')
                        : 'Belum pernah backup',
                ],
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    // ═══════════════════════════════════════
    // BACKUP DATABASE
    // ═══════════════════════════════════════

    public function backup()
    {
        try {

            // folder backup
            $backupDir = storage_path('app/backups');

            if (!file_exists($backupDir)) {
                mkdir($backupDir, 0777, true);
            }

            $filename = 'backup_' . now()->format('Ymd_His') . '.sql';
            $filepath = $backupDir . '/' . $filename;

            $dbHost = env('DB_HOST');
            $dbPort = env('DB_PORT');
            $dbName = env('DB_DATABASE');
            $dbUser = env('DB_USERNAME');
            $dbPass = env('DB_PASSWORD');

            // PATH MYSQLDUMP WINDOWS XAMPP
            $mysqldump = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';

            // jika linux/server
            if (!file_exists($mysqldump)) {
                $mysqldump = 'mysqldump';
            }

            $command = "\"{$mysqldump}\" --user={$dbUser} --password={$dbPass} --host={$dbHost} --port={$dbPort} {$dbName} > \"{$filepath}\"";

            exec($command, $output, $result);

            if ($result !== 0 || !file_exists($filepath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Backup database gagal.'
                ], 500);
            }

            // simpan riwayat backup
            if (DB::getSchemaBuilder()->hasTable('system_backups')) {

                DB::table('system_backups')->insert([
                    'filename'   => $filename,
                    'created_at' => now('Asia/Jakarta'),
                    'updated_at' => now('Asia/Jakarta'),
                ]);
            }

            return response()->download($filepath)->deleteFileAfterSend(true);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}