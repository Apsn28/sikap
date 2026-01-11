<?php

namespace App\Http\Controllers;

use App\Models\LegalCase;
use Illuminate\Http\Request;

class LegalCaseController extends Controller
{
    public function index()
    {
        return LegalCase::with('client')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'case_number' => 'required|string|unique:cases',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'category' => 'required|string',
            'priority' => 'required|string',
            'client_id' => 'required|exists:clients,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'progress_status' => 'nullable|string',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
            'responsible_person' => 'nullable|string',
        ]);

        $legalCase = LegalCase::create($validated);

        return response()->json($legalCase, 201);
    }

    public function show($id)
    {
        return LegalCase::with(['client', 'tasks', 'documents', 'schedules', 'notes.user'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $legalCase = LegalCase::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'string',
            'category' => 'string',
            'priority' => 'string',
            'client_id' => 'exists:clients,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'progress_status' => 'nullable|string',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
            'responsible_person' => 'nullable|string',
            'case_number' => 'string|unique:cases,case_number,'.$id,
        ]);

        $legalCase->update($validated);

        return response()->json($legalCase);
    }

    public function destroy($id)
    {
        $legalCase = LegalCase::findOrFail($id);
        $legalCase->delete();

        return response()->json(null, 204);
    }
}
