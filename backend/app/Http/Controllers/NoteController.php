<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    public function index()
    {
        return Note::with('user')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'case_id' => 'required|exists:cases,id',
            'content' => 'required|string',
        ]);

        $note = Note::create([
            'case_id' => $validated['case_id'],
            'content' => $validated['content'],
            'user_id' => Auth::id(), // Use the authenticated user's ID
        ]);

        return response()->json($note->load('user'), 201);
    }

    public function destroy($id)
    {
        $note = Note::findOrFail($id);
        
        // Authorization check could be added here
        
        $note->delete();

        return response()->json(null, 204);
    }
}
