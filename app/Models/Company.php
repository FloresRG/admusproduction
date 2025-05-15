<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company_category_id',
        'contract_duration',
        'description',
        'start_date',
        'end_date',
    ];

    public function category()
    {
        return $this->belongsTo(CompanyCategory::class, 'company_category_id');
    }

    public function availabilityDays()
    {
        return $this->hasMany(AvailabilityDay::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
