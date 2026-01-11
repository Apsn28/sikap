<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nik',
        'email',
        'phone',
        'address',
        'type',
        'status',
    ];

    public function cases()
    {
        return $this->hasMany(LegalCase::class, 'client_id');
    }
}
