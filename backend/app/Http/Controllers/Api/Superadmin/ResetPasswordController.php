<?php

namespace App\Http\Controllers\Api\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ResetPasswordController extends Controller
{
    /**
     * POST /api/superadmin/users/{id}/reset-password
     * Reset password User (guru/staff) ke NIPY atau custom
     */
    public function resetUserPassword(Request $request, $id)
    {
        $request->validate([
            'password_baru' => 'nullable|string|min:6|max:100',
        ]);

        $user = User::findOrFail($id);
        $passwordBaru = $request->password_baru ?? $user->nipy ?? 'ulilalbab123';

        $user->password = Hash::make($passwordBaru);
        $user->save();

        Log::info("Password user ID {$id} ({$user->name}) direset oleh superadmin.");

        return response()->json([
            'success' => true,
            'message' => "Password berhasil direset untuk {$user->name}.",
            'password_default' => $request->password_baru ? null : $passwordBaru,
        ]);
    }

    /**
     * POST /api/superadmin/siswa/{id}/reset-password
     * Reset password Siswa ke NIS atau custom
     */
    public function resetSiswaPassword(Request $request, $id)
    {
        $request->validate([
            'password_baru' => 'nullable|string|min:6|max:100',
        ]);

        $siswa = Siswa::findOrFail($id);
        $passwordBaru = $request->password_baru ?? $siswa->nis ?? 'siswa123';

        $siswa->password = Hash::make($passwordBaru);
        $siswa->save();

        Log::info("Password siswa ID {$id} ({$siswa->nama}) direset oleh superadmin.");

        return response()->json([
            'success' => true,
            'message' => "Password berhasil direset untuk {$siswa->nama}.",
            'password_default' => $request->password_baru ? null : $passwordBaru,
        ]);
    }
}
