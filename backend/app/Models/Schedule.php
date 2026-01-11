<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'location',
        'type',
        'case_id',
    ];

    public function legalCase()
    {
        return $this->belongsTo(LegalCase::class, 'case_id');
    }
}
