<?php

namespace App\Http\Controllers;

use App\Models\LegalCase;
use App\Models\Client;
use App\Models\Task;
use App\Models\Schedule;
use App\Models\Document;
use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalCases = LegalCase::count();
        $activeCases = LegalCase::where('progress_status', '!=', 'Selesai')->count();
        $finishedCases = LegalCase::where('progress_status', 'Selesai')->count();
        $courtCases = LegalCase::where('progress_status', 'Persidangan')->count();
        $totalClients = Client::count();

        // Monthly cases (simplified for this year)
        $monthlyCases = LegalCase::select(DB::raw('MONTH(created_at) as month'), DB::raw('count(*) as count'))
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->get();
        
        // Monthly finished cases
        $monthlyFinished = LegalCase::select(DB::raw('MONTH(updated_at) as month'), DB::raw('count(*) as count'))
            ->whereYear('updated_at', date('Y'))
            ->where('progress_status', 'Selesai')
            ->groupBy('month')
            ->get();

        // Map to format required by frontend (Jan, Feb, etc.)
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $formattedMonthlyStats = [];
        
        for ($i = 1; $i <= 12; $i++) {
            $created = $monthlyCases->firstWhere('month', $i);
            $finished = $monthlyFinished->firstWhere('month', $i);
            
            $formattedMonthlyStats[] = [
                'bulan' => $months[$i - 1],
                'kasus' => $created ? $created->count : 0,
                'selesai' => $finished ? $finished->count : 0
            ];
        }

        // Daily Activity (Last 7 days)
        // Aggregating created_at from multiple tables
        $dailyActivity = [];
        $days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayName = $days[$date->dayOfWeek];
            $dateStr = $date->format('Y-m-d');

            $count = 0;
            $count += LegalCase::whereDate('updated_at', $dateStr)->count();
            $count += Task::whereDate('updated_at', $dateStr)->count();
            $count += Document::whereDate('created_at', $dateStr)->count();
            
            $dailyActivity[] = [
                'hari' => $dayName,
                'aktivitas' => $count
            ];
        }

        // Recent cases
        $recentCases = LegalCase::with('client')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($case) {
                return [
                    'id' => $case->id,
                    'nomor' => $case->case_number,
                    'klien' => $case->client ? $case->client->name : 'Unknown',
                    'jenis' => $case->category,
                    'status' => $case->progress_status,
                    'waktu' => $case->updated_at->diffForHumans()
                ];
            });

        // Tasks
        $tasks = Task::with('teamMember')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'judul' => $task->title,
                    'penanggungJawab' => $task->teamMember ? $task->teamMember->name : 'Unassigned',
                    'status' => $task->status,
                    'prioritas' => $task->priority,
                    'tenggat' => $task->due_date ? date('Y-m-d', strtotime($task->due_date)) : '-',
                    'progress' => $task->progress ?? 0
                ];
            });

        // Schedules for today
        $schedules = Schedule::whereDate('start_time', date('Y-m-d'))
            ->orderBy('start_time')
            ->take(2)
            ->get();

        // Activity Timeline (Simulated from recent updates)
        $activities = collect();

        // Recent Case Updates
        $caseUpdates = LegalCase::latest('updated_at')->take(5)->get()->map(function ($item) {
            return [
                'waktu' => $item->updated_at->format('H:i'),
                'user' => 'System', // Idealnya dari updated_by jika ada
                'aksi' => 'memperbarui kasus',
                'detail' => $item->case_number,
                'tipe' => 'update',
                'timestamp' => $item->updated_at->timestamp
            ];
        });

        // Recent Documents
        $docUploads = Document::latest('created_at')->take(5)->get()->map(function ($item) {
            return [
                'waktu' => $item->created_at->format('H:i'),
                'user' => 'System',
                'aksi' => 'mengunggah dokumen',
                'detail' => $item->title,
                'tipe' => 'upload',
                'timestamp' => $item->created_at->timestamp
            ];
        });
        
        $activities = $activities->concat($caseUpdates)->concat($docUploads)->sortByDesc('timestamp')->take(5)->values();

        return response()->json([
            'counts' => [
                'total_cases' => $totalCases,
                'active_cases' => $activeCases,
                'finished_cases' => $finishedCases,
                'court_cases' => $courtCases,
                'total_clients' => $totalClients,
                'pending_cases' => $totalCases - $activeCases - $finishedCases // Approximate
            ],
            'monthly_stats' => $formattedMonthlyStats,
            'daily_activity' => $dailyActivity,
            'recent_cases' => $recentCases,
            'tasks' => $tasks,
            'todays_schedules' => $schedules,
            'activities' => $activities
        ]);
    }

    public function reports()
    {
        // 1. Case Distribution by Type
        $caseTypeData = LegalCase::select('category as name', DB::raw('count(*) as value'))
            ->groupBy('category')
            ->get()
            ->map(function($item) {
                // Assign random colors or fixed based on type
                $colors = [
                    'Pidana' => '#E53935',
                    'Perdata' => '#1DB954',
                    'Tipikor' => '#FFA726',
                    'Narkotika' => '#007BFF',
                    'Tata Usaha Negara' => '#9C27B0'
                ];
                return [
                    'name' => $item->name,
                    'value' => $item->value,
                    'color' => $colors[$item->name] ?? '#8884d8'
                ];
            });

        // 2. Performance (Finished cases by Team Member)
        // Since we don't have a direct relation in LegalCase to TeamMember easily set up for 'responsible_person' as ID yet (it's string in some places), 
        // we will try to match by name or use a simplified approach if responsible_person is just a string name.
        // Assuming responsible_person stores the NAME of the person.
        $performanceData = LegalCase::where('progress_status', 'Selesai')
            ->select('responsible_person as nama', DB::raw('count(*) as selesai'))
            ->groupBy('responsible_person')
            ->get();

        // 3. Workload (Active cases by Team Member)
        $workloadData = LegalCase::where('progress_status', '!=', 'Selesai')
            ->select('responsible_person as wilayah', DB::raw('count(*) as kasus')) // reusing 'wilayah' key for compatibility or change frontend
            ->groupBy('responsible_person')
            ->get();

        // 4. Monthly Stats (Reuse logic)
        $monthlyCases = LegalCase::select(DB::raw('MONTH(created_at) as month'), DB::raw('count(*) as count'))
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->get();
        
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $monthlyData = [];
        // Get finished cases too
        $monthlyFinished = LegalCase::select(DB::raw('MONTH(updated_at) as month'), DB::raw('count(*) as count'))
            ->whereYear('updated_at', date('Y'))
            ->where('progress_status', 'Selesai')
            ->groupBy('month')
            ->get();

        for ($i = 1; $i <= 12; $i++) {
            $created = $monthlyCases->firstWhere('month', $i);
            $finished = $monthlyFinished->firstWhere('month', $i);
            $monthlyData[] = [
                'bulan' => $months[$i - 1],
                'kasus' => $created ? $created->count : 0,
                'selesai' => $finished ? $finished->count : 0
            ];
        }

        return response()->json([
            'monthlyData' => $monthlyData,
            'caseTypeData' => $caseTypeData,
            'performanceData' => $performanceData,
            'workloadData' => $workloadData // Replaces regionalData
        ]);
    }
}