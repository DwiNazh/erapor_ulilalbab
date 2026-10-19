<?php

namespace App\Http\Controllers\Api\Tu;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class GuruController extends Controller
{
    // ================= GET ALL GURU =================
    public function index(Request $request)
    {
        $user = $request->user();
        $query = User::where('role', 'guru');

        if ($user && $user->jenjangIds() !== null) {
            $query->where(function ($q) use ($user) {
                $q->whereIn('jenjang_id', $user->jenjangIds())
                  ->orWhereNull('jenjang_id');
            });
        }

        $guru = $query->select('id', 'name', 'nipy', 'jenjang_id')
            ->get();

        return response()->json($guru);
    }

    // ================= STORE =================
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'nipy' => 'required|unique:users,nipy',
            'jenjang_id' => 'nullable|exists:jenjang,id',
        ]);

        $user = $request->user();
        $jenjangId = $request->jenjang_id;

        if (!$user->isSuperadmin()) {
            $jenjangId = $user->jenjang_id;
        }

        $guru = User::create([
            'name' => $request->name,
            'nipy' => $request->nipy,
            'password' => Hash::make('123456'), // default password
            'role' => 'guru',
            'jenjang_id' => $jenjangId,
        ]);

        return response()->json($guru, 201);
    }

    // ================= UPDATE =================
    public function update(Request $request, $id)
    {
        $guru = User::findOrFail($id);

        if ($guru->jenjang_id && !$request->user()->bolehJenjang($guru->jenjang_id)) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses ke data guru ini.'], 403);
        }

        $request->validate([
            'name' => 'required',
            'nipy' => 'required|unique:users,nipy,' . $id,
        ]);

        $guru->update([
            'name' => $request->name,
            'nipy' => $request->nipy,
        ]);

        return response()->json(['message' => 'Berhasil update']);
    }

    // ================= DELETE =================
    public function destroy(Request $request, $id)
    {
        $guru = User::findOrFail($id);

        if ($guru->jenjang_id && !$request->user()->bolehJenjang($guru->jenjang_id)) {
            return response()->json(['message' => 'Anda tidak memiliki hak akses ke data guru ini.'], 403);
        }

        $guru->delete();

        return response()->json(['message' => 'Berhasil hapus']);
    }
}