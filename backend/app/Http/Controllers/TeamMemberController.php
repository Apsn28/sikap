<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        return TeamMember::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:team_members',
            'phone' => 'nullable|string',
            'role' => 'required|string',
            'specialization' => 'nullable|string',
            'photo_url' => 'nullable|string',
            'jabatan' => 'required|string',
            'divisi' => 'required|string',
            'status' => 'nullable|string',
        ]);

        if (!isset($validated['status'])) {
            $validated['status'] = 'Aktif';
        }

        $teamMember = TeamMember::create($validated);

        return response()->json($teamMember, 201);
    }

    public function show($id)
    {
        return TeamMember::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $teamMember = TeamMember::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:team_members,email,'.$id,
            'phone' => 'nullable|string',
            'role' => 'string',
            'specialization' => 'nullable|string',
            'status' => 'string',
            'photo_url' => 'nullable|string',
            'jabatan' => 'string',
            'divisi' => 'string',
        ]);

        $teamMember->update($validated);

        return response()->json($teamMember);
    }

    public function destroy($id)
    {
        $teamMember = TeamMember::findOrFail($id);
        $teamMember->delete();

        return response()->json(null, 204);
    }
}
