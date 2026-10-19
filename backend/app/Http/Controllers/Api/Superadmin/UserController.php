<?php

namespace App\Http\Controllers\Api\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * GET /api/superadmin/users
     */
    public function index()
    {
        try {
            $users = User::with('jenjang')->get();
            return response()->json($users, 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/superadmin/jenjang
     */
    public function getJenjang()
    {
        try {
            $jenjang = \App\Models\Jenjang::orderBy('id')->get();
            return response()->json($jenjang, 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/superadmin/users
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'       => 'required|string|max:255',
                'nipy'       => 'required|string|max:255|unique:users,nipy',
                'password'   => 'required|string|min:6',
                'role'       => 'required|in:superadmin,admintu,guru,kepala_sekolah,siswa',
                'jenjang_id' => 'nullable|integer|exists:jenjang,id|required_unless:role,superadmin',
            ]);

            $user = User::create([
                'name'       => $validated['name'],
                'nipy'       => $validated['nipy'],
                'password'   => Hash::make($validated['password']),
                'role'       => $validated['role'],
                'jenjang_id' => $validated['role'] === 'superadmin' ? null : ($validated['jenjang_id'] ?? null),
            ]);

            return response()->json([
                'message' => 'User berhasil dibuat',
                'data'    => $user,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal membuat user',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/superadmin/users/{id}
     */
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json($user, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User tidak ditemukan',
            ], 404);
        }
    }

    /**
     * PUT /api/superadmin/users/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'name'       => 'required|string|max:255',
                'nipy'       => 'required|string|max:255|unique:users,nipy,' . $id,
                'role'       => 'required|in:superadmin,admintu,guru,kepala_sekolah,siswa',
                'jenjang_id' => 'nullable|integer|exists:jenjang,id|required_unless:role,superadmin',
            ]);

            $user->update([
                'name'       => $validated['name'],
                'nipy'       => $validated['nipy'],
                'role'       => $validated['role'],
                'jenjang_id' => $validated['role'] === 'superadmin' ? null : ($validated['jenjang_id'] ?? null),
            ]);

            return response()->json([
                'message' => 'User berhasil diupdate',
                'data'    => $user,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengupdate user',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE /api/superadmin/users/{id}
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'message' => 'User berhasil dihapus',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus user',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/superadmin/gurus
     */
    public function gurus()
    {
        try {
            $gurus = User::where('role', 'guru')
                ->select('id', 'name as nama', 'nipy')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data'    => $gurus,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data guru',
            ], 500);
        }
    }
}