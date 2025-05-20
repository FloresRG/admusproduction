<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Company;
use App\Models\User;
use App\Models\Week;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'user_id',
        'start_time',
        'end_time',
        'status',
        'turno',
        'week_id',
        'day_of_week',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function week()
    {
        return $this->belongsTo(Week::class);
    }
}
