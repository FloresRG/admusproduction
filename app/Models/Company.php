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
        'ubicacion',
        'direccion',
        'start_date',
        'end_date',
        'contrato',
        'monto_mensual',
        'celular',
        'logo',
    ];
    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
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
    public function linkComprobantes()
    {
        return $this->hasMany(CompanyLinkComprobante::class);
    }
    public function informes()
    {
        return $this->hasMany(Informe::class);
    }
}
