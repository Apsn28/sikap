<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegalCase extends Model
{
    use HasFactory;

    protected $table = 'cases';

    protected $fillable = [
        'title',
        'case_number',
        'description',
        'status',
        'category',
        'progress_status',
        'progress_percentage',
        'responsible_person',
        'priority',
        'start_date',
        'end_date',
        'client_id',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'case_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'case_id');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'case_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'case_id');
    }
}
