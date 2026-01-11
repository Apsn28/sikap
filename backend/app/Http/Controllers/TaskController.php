<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::with(['legalCase', 'assignee'])->latest();
        
        if ($request->has('case_id')) {
            $query->where('case_id', $request->case_id);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'priority' => 'required|string',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
            'case_id' => 'nullable|exists:cases,id',
            'team_member_id' => 'nullable|exists:team_members,id',
        ]);

        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    public function show($id)
    {
        return Task::with(['legalCase', 'assignee'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'string',
            'priority' => 'string',
            'due_date' => 'nullable|date',
            'progress' => 'integer|min:0|max:100',
            'case_id' => 'nullable|exists:cases,id',
            'team_member_id' => 'nullable|exists:team_members,id',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(null, 204);
    }
}
