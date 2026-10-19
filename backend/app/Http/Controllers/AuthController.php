<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log; // Digunakan untuk logging error
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Melakukan login, memverifikasi password, dan mengirimkan token + data user.
     */
    public function login(Request $request)
    {
        $request->validate([
            'nipy'     => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('nipy', $request->nipy)->first();

        

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'NIPY atau password salah'], 401);
        }

        // Hapus token lama
        $user->tokens()->delete();

        // ✅ Buat Sanctum token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'Login berhasil',
            'token'   => $token,  // ← WAJIB
            'user'    => [
                'id'   => $user->id,
                'nipy' => $user->nipy,
                'name' => $user->name,
                'role' => $user->role ?? 'unknown',
                'jenjang_id' => $user->jenjang_id,
                'jenjang' => $user->kodeJenjang(),
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

/**
     * [GET] Endpoint untuk validasi user saat ini (/api/user)
     * Digunakan untuk memuat sesi saat reload halaman (memakai token dari header).
     */
    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'nipy' => $user->nipy,
            'role' => $user->role,
            'jenjang_id' => $user->jenjang_id,
            'jenjang' => $user->kodeJenjang(),
            'foto_url' => $user->foto 
                ? asset('storage/' . $user->foto) 
                : null,
        ]);
    }

        // ================= UPDATE PROFILE =================
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'nipy' => [
                'required',
                'string',
                'max:50',
                Rule::unique('users', 'nipy')->ignore($user->id),
            ],
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        try {

            // ✅ UPDATE FOTO
            if ($request->hasFile('foto')) {

                if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                    Storage::disk('public')->delete($user->foto);
                }

                $path = $request->file('foto')->store('foto-profil', 'public');
                $user->foto = $path;
            }

            // ✅ UPDATE DATA
            $user->name = $request->name;
            $user->nipy = $request->nipy;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diupdate'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal update profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

       // ================= CHANGE PASSWORD =================
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current' => 'required',
            'new' => 'required|min:6'
        ]);

        // cek password lama
        if (!Hash::check($request->current, $user->password)) {
            return response()->json([
                'message' => 'Password lama salah'
            ], 400);
        }

        // update password
        $user->password = Hash::make($request->new);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah'
        ]);
    }

}