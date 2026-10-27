<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use App\Models\PjblJudul;
use App\Models\Rombel;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PjblJudulController extends Controller
{
    /**
     * Ambil semua judul PJBL berdasarkan tahun ajaran aktif
     * dengan data rombel (tingkat_kelas + sub_nama)
     */
    public function index(Request $request): JsonResponse
    {
        $tahunAjaran = TahunAjaran::getAktif();

        if (!$tahunAjaran) {
            return response()->json(['message' => 'Tidak ada tahun ajaran aktif'], 404);
        }

        $semester = $request->query('semester', $tahunAjaran->semester_aktif);

        // Ambil semua rombel pada tahun ajaran aktif, beserta judul PJBL jika ada
        $rombel = Rombel::where('tahun_ajaran_id', $tahunAjaran->id)
            ->untukUser($request->user())
            ->with(['pjblJudul' => function ($query) use ($tahunAjaran, $semester) {
                $query->where('tahun_ajaran_id', $tahunAjaran->id)
                      ->where('semester', $semester);
            }])
            ->orderBy('tingkat_kelas')
            ->orderBy('sub_nama')
            ->get()
            ->map(function ($r) {
                $judul = $r->pjblJudul->first();
                return [
                    'rombel_id'      => $r->id,
                    'tingkat_kelas'  => $r->tingkat_kelas,
                    'sub_nama'       => $r->sub_nama,
                    'nama_kelas'     => 'Kelas ' . $r->tingkat_kelas . $r->sub_nama,
                    'pjbl_judul_id'  => $judul?->id,
                    'judul'          => $judul?->judul,
                    'deskripsi'      => $judul?->deskripsi,
                ];
            });

        return response()->json([
            'tahun_ajaran'   => $tahunAjaran,
            'semester'       => $semester,
            'data'           => $rombel,
        ]);
    }

    /**
     * Simpan atau update judul PJBL untuk satu rombel
     */
    public function store(Request $request): JsonResponse
    {
        $tahunAjaran = TahunAjaran::getAktif();

        if (!$tahunAjaran) {
            return response()->json(['message' => 'Tidak ada tahun ajaran aktif'], 404);
        }

        $validated = $request->validate([
            'rombel_id'  => 'required|exists:rombel,id',
            'semester'   => 'required|in:ganjil,genap',
            'judul'      => 'required|string|max:255',
            'deskripsi'  => 'nullable|string',
        ]);

        $rombel = Rombel::findOrFail($validated['rombel_id']);
        if (!$request->user()->bolehJenjang($rombel->jenjang_id)) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses ke rombel ini.'], 403);
        }

        $pjbl = PjblJudul::updateOrCreate(
            [
                'rombel_id'      => $validated['rombel_id'],
                'tahun_ajaran_id' => $tahunAjaran->id,
                'semester'       => $validated['semester'],
            ],
            [
                'judul'      => $validated['judul'],
                'deskripsi'  => $validated['deskripsi'] ?? null,
            ]
        );

        return response()->json([
            'message' => $pjbl->wasRecentlyCreated ? 'Judul PJBL berhasil disimpan' : 'Judul PJBL berhasil diperbarui',
            'data'    => $pjbl->load('rombel'),
        ], $pjbl->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Simpan judul PJBL untuk banyak kelas sekaligus (bulk)
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $tahunAjaran = TahunAjaran::getAktif();

        if (!$tahunAjaran) {
            return response()->json(['message' => 'Tidak ada tahun ajaran aktif'], 404);
        }

        $validated = $request->validate([
            'semester'       => 'required|in:ganjil,genap',
            'items'          => 'required|array|min:1',
            'items.*.rombel_id' => 'required|exists:rombel,id',
            'items.*.judul'     => 'required|string|max:255',
            'items.*.deskripsi' => 'nullable|string',
        ]);

        $saved = [];
        foreach ($validated['items'] as $item) {
            $rombel = Rombel::find($item['rombel_id']);
            if (!$rombel || !$request->user()->bolehJenjang($rombel->jenjang_id)) {
                continue;
            }

            $pjbl = PjblJudul::updateOrCreate(
                [
                    'rombel_id'       => $item['rombel_id'],
                    'tahun_ajaran_id' => $tahunAjaran->id,
                    'semester'        => $validated['semester'],
                ],
                [
                    'judul'      => $item['judul'],
                    'deskripsi'  => $item['deskripsi'] ?? null,
                ]
            );
            $saved[] = $pjbl;
        }

        return response()->json([
            'message' => count($saved) . ' judul PJBL berhasil disimpan',
            'data'    => $saved,
        ]);
    }

    /**
     * Hapus judul PJBL
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $pjbl = PjblJudul::with('rombel')->findOrFail($id);

        if ($pjbl->rombel && !$request->user()->bolehJenjang($pjbl->rombel->jenjang_id)) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses ke data ini.'], 403);
        }

        $pjbl->delete();

        return response()->json(['message' => 'Judul PJBL berhasil dihapus']);
    }
}