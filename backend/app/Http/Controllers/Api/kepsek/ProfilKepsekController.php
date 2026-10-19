<?php

namespace App\Http\Controllers\Api\Kepsek;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfilKepsekController extends Controller
{
    /**
     * GET /api/kepsek/profil
     * Mengembalikan data profil kepala sekolah yang sedang login.
     */
    public function index()
    {
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'       => $user->id,
                'name'     => $user->name,
                'nip'      => $user->nip,
                'email'    => $user->email,
                'role'     => $user->role,
                'foto_url' => $user->foto_url
                    ? asset('storage/' . $user->foto_url)
                    : null,
            ],
        ]);
    }

    /**
     * POST /api/kepsek/profil/update  (_method=PUT)
     * Memperbarui nama, NIP, dan foto profil.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'nip'  => 'nullable|string|max:50|unique:users,nip,' . $user->id,
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user->name = $request->name;
        $user->nip  = $request->nip;

        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($user->foto_url) {
                \Storage::disk('public')->delete($user->foto_url);
            }

            $path = $request->file('foto')->store('foto-profil', 'public');
            $user->foto_url = $path;
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'data'    => [
                'id'       => $user->id,
                'name'     => $user->name,
                'nip'      => $user->nip,
                'foto_url' => $user->foto_url
                    ? asset('storage/' . $user->foto_url)
                    : null,
            ],
        ]);
    }

    /**
     * POST /api/kepsek/profil/ganti-password
     * Mengganti password kepala sekolah.
     */
    public function gantiPassword(Request $request)
    {
        $request->validate([
            'current' => 'required|string',
            'new'     => 'required|string|min:8',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current, $user->password)) {
            throw ValidationException::withMessages([
                'current' => ['Password lama tidak sesuai.'],
            ]);
        }

        $user->password = Hash::make($request->new);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah',
        ]);
    }
}