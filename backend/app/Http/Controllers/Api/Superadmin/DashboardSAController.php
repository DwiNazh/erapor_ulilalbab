<?php

namespace App\Http\Controllers\Api\Superadmin;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardSAController extends Controller
{
    public function index(): JsonResponse
    {
        $tahunAjaran = DB::table('tahun_ajaran')
            ->where('aktif', 1)
            ->first();

        $tahunAjaranId = $tahunAjaran?->id;

        // =========================
        // STATS
        // =========================

        $stats = [
            'total_users' => DB::table('users')
                ->whereNotIn('role', ['superadmin'])
                ->count(),

            'total_guru' => DB::table('users')
                ->where('role', 'guru')
                ->count(),

            'total_siswa' => DB::table('siswa_tahun')
                ->where('status', 'AKTIF')
                ->when($tahunAjaranId, fn($q) =>
                    $q->where('tahun_ajaran_id', $tahunAjaranId)
                )
                ->distinct('siswa_id')
                ->count('siswa_id'),

            'total_rombel' => DB::table('rombel')
                ->when($tahunAjaranId, fn($q) =>
                    $q->where('tahun_ajaran_id', $tahunAjaranId)
                )
                ->count(),

            'new_users_this_month' => DB::table('users')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),

            'new_siswa_this_month' => DB::table('siswa_tahun')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),

            'tahun_ajaran_aktif' => $tahunAjaran?->nama ?? '-',
            'semester_aktif' => $tahunAjaran?->semester_aktif ?? '-',
        ];

        // =========================
        // RECENT ACCOUNTS
        // =========================

        $recentAccounts = DB::table('users')
            ->select('id', 'name', 'role', 'foto', 'created_at')
            ->whereNotIn('role', ['superadmin'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($user) {

                $unit = '-';

                if ($user->role === 'guru') {
                    $rombel = DB::table('rombel')
                        ->where('guru_id', $user->id)
                        ->select('tingkat_kelas', 'sub_nama')
                        ->first();

                    if ($rombel) {
                        $unit = trim($rombel->tingkat_kelas . ' ' . $rombel->sub_nama);
                    }
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'foto' => $user->foto,
                    'unit' => $unit,
                    'created_at' => $user->created_at,
                ];
            });

        // =========================
        // ACTIVITIES
        // =========================

        $activities = DB::table('users')
            ->select(
                DB::raw("CONCAT('User ', name, ' berhasil ditambahkan') as description"),
                'created_at'
            )
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'description' => $item->description,
                    'created_at' => $item->created_at,
                    'color' => '#4F46E5',
                ];
            });

        // =========================
        // COMPLETENESS
        // =========================

        $totalGuru = DB::table('users')
            ->where('role', 'guru')
            ->count();

        $guruAdaRombel = DB::table('rombel')
            ->whereNotNull('guru_id')
            ->count();

        $safe = fn($num, $den) => $den > 0
            ? round(($num / $den) * 100)
            : 0;

        $completeness = [
            [
                'label' => 'Data Guru',
                'value' => $safe($guruAdaRombel, $totalGuru),
                'color' => '#4F46E5',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_accounts' => $recentAccounts,
                'activities' => $activities,
                'completeness' => $completeness,
            ],
        ]);
    }
}