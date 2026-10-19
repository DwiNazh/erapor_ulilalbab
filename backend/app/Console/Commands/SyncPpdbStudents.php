<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Command\Command as SymfonyCommand;
use Illuminate\Support\Facades\Http;
use App\Models\SiswaBaru;

class SyncPpdbStudents extends Command
{
    protected $signature = 'app:sync-ppdb-students {tahun?}
        {--field= : Nama field PPDB yang memuat unit pendaftaran (mis. "SDIT Ikhwan")}
        {--contoh : Hanya tampilkan nama field dan nilai unit, tanpa menyimpan}';

    protected $description = 'Sinkronisasi data siswa dari API PPDB ke tabel siswas';

    public function handle()
    {
        $tahun = $this->argument('tahun');

        $this->info('Mengambil data dari PPDB...');

        $url = config('services.ppdb.url');
        $key = config('services.ppdb.key');

        if (!$url || !$key) {
            $this->error('PPDB_API_URL dan PPDB_API_KEY belum diisi di .env. Minta ke tim PPDB, lalu jalankan: php artisan config:clear');
            return SymfonyCommand::FAILURE;
        }

        try {
            $response = Http::withHeaders(['X-API-KEY' => $key])
                ->timeout(30)
                ->get($url, ['tahun' => $tahun, 'status' => 1]);
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            $this->error('Tidak bisa terhubung ke PPDB: ' . $e->getMessage());
            return SymfonyCommand::FAILURE;
        }

        if ($response->failed()) {
            $this->error('PPDB menjawab dengan status ' . $response->status() . '. Periksa API key atau parameter.');
            return SymfonyCommand::FAILURE;
        }

        $data = $response->json()['data'] ?? [];
        $this->info('Total data diterima: ' . count($data));

        if ($this->option('contoh')) {
            return $this->tampilkanContoh($data);
        }

        $field = $this->option('field');
        if (!$field) {
            $this->warn('Opsi --field belum diisi: kategori tidak akan disinkronkan.');
        }

        $baru = 0;
        $diperbarui = 0;
        $dilewati = 0;
        $jumlahL = 0;
        $jumlahP = 0;
        $tidakDikenali = [];

        foreach ($data as $row) {
            if (empty($row['no_reg'])) {
                $dilewati++;
                continue;
            }

            $siswa = SiswaBaru::firstOrNew(['ppdb_id' => $row['no_reg']]);
            $isBaru = !$siswa->exists;

            $siswa->nama_user = $row['nama_user'] ?? ($siswa->nama_user ?: 'Nama Tidak Ditemukan');

            // Nilai awal HANYA untuk siswa baru. Siswa lama tidak boleh
            // kehilangan pembagian kelas atau status prosesnya.
            if ($isBaru) {
                $siswa->kelas = null;
                $siswa->sub_kelas = null;
                $siswa->is_processed = 0;
            }

            if ($field) {
                $nilai = data_get($row, $field);
                $kat = $this->petakanKategori($nilai);

                if ($kat) {
                    $siswa->kategori = $kat;
                    $kat === 'ikhwan' ? $jumlahIkhwan++ : $jumlahAkhwat++;
                } else {
                    $kunci = (string) $nilai;
                    $tidakDikenali[$kunci] = ($tidakDikenali[$kunci] ?? 0) + 1;
                }

                $jenjangId = $this->petakanJenjang($nilai);
                if ($jenjangId) {
                    $siswa->jenjang_id = $jenjangId;
                }
            }

            $siswa->save();
            $isBaru ? $baru++ : $diperbarui++;
        }

        $this->info("Baru: {$baru} | Diperbarui: {$diperbarui} | Dilewati (tanpa no_reg): {$dilewati}");

        if ($field) {
            $this->info("Kategori terisi: Ikhwan = {$jumlahIkhwan}, Akhwat = {$jumlahAkhwat}");

            if (!empty($tidakDikenali)) {
                $this->warn('Nilai unit yang TIDAK dikenali (kategori dibiarkan kosong):');
                foreach ($tidakDikenali as $nilai => $jumlah) {
                    $this->line('  - "' . ($nilai === '' ? '(kosong)' : $nilai) . "\" : {$jumlah} siswa");
                }
            }
        }

        $this->info('Sinkronisasi selesai.');
        return SymfonyCommand::SUCCESS;
    }

    /**
     * Hanya mengenali kata "ikhwan" atau "akhwat" pada teks unit.
     * Jika tidak ada atau keduanya ada, hasilnya null (tidak ditebak).
     */
    private function petakanKategori($nilai): ?string
    {
        if (!is_string($nilai)) {
            return null;
        }

        $teks = mb_strtolower($nilai);
        $ikhwan = str_contains($teks, 'ikhwan');
        $akhwat = str_contains($teks, 'akhwat');

        if ($ikhwan xor $akhwat) {
            return $ikhwan ? 'L' : 'P';
        }

        return null;
    }

    /**
     * Memetakan teks unit PPDB (misal: "SDIT Ikhwan", "SMPIT Putri") ke jenjang_id
     */
    private function petakanJenjang($nilai): ?int
    {
        if (!is_string($nilai)) {
            return null;
        }

        $teks = mb_strtolower($nilai);
        if (str_contains($teks, 'smp')) {
            return \Illuminate\Support\Facades\DB::table('jenjang')->where('kode', 'SMP')->value('id');
        } elseif (str_contains($teks, 'sma')) {
            return \Illuminate\Support\Facades\DB::table('jenjang')->where('kode', 'SMA')->value('id');
        } elseif (str_contains($teks, 'sd')) {
            return \Illuminate\Support\Facades\DB::table('jenjang')->where('kode', 'SD')->value('id');
        }

        return null;
    }

    private function tampilkanContoh(array $data): int
    {
        if (empty($data)) {
            $this->warn('Tidak ada data dari API.');
            return SymfonyCommand::SUCCESS;
        }

        $this->info('Nama field pada data pertama:');
        foreach (array_keys($data[0]) as $kunci) {
            $this->line('  - ' . $kunci);
        }

        // Cari field mana yang nilainya memuat "ikhwan" / "akhwat"
        $ditemukan = [];
        foreach ($data as $row) {
            foreach ($row as $kunci => $nilai) {
                if (is_string($nilai) && $this->petakanKategori($nilai)) {
                    $ditemukan[$kunci][$nilai] = true;
                }
            }
        }

        if (empty($ditemukan)) {
            $this->warn('Tidak ada field yang nilainya memuat "ikhwan" atau "akhwat".');
            $this->line('Mungkin field-nya bersarang (nested) atau memakai istilah lain. Kirimkan satu contoh data (dengan data pribadi diganti) ke saya.');
            return SymfonyCommand::SUCCESS;
        }

        $this->info('Field yang memuat "ikhwan" atau "akhwat":');
        foreach ($ditemukan as $kunci => $nilaiList) {
            $this->line("  Field: {$kunci}");
            foreach (array_slice(array_keys($nilaiList), 0, 10) as $nilai) {
                $this->line('     "' . mb_strimwidth($nilai, 0, 60, '...') . '"');
            }
        }

        $this->info('Lanjutkan dengan: php artisan app:sync-ppdb-students --field=NAMA_FIELD');
        return SymfonyCommand::SUCCESS;
    }
}