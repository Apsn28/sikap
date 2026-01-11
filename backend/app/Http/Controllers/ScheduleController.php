<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with('legalCase')->orderBy('start_time');

        if ($request->has('case_id')) {
            $query->where('case_id', $request->case_id);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'location' => 'nullable|string',
            'type' => 'required|string',
            'case_id' => 'nullable|exists:cases,id',
        ]);

        $schedule = Schedule::create($validated);

        return response()->json($schedule, 201);
    }

    public function show($id)
    {
        return Schedule::with('legalCase')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'date',
            'end_time' => 'nullable|date|after:start_time',
            'location' => 'nullable|string',
            'type' => 'string',
            'case_id' => 'nullable|exists:cases,id',
        ]);

        $schedule->update($validated);

        return response()->json($schedule);
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return response()->json(null, 204);
    }
}
