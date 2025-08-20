<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AsignacionPasante extends Model
{
    protected $table = 'asignacion_pasantes';
    
    protected $fillable = [
        'user_id',
        'company_id',
        'turno',
        'fecha',
        'week_id',
        'dia',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function week(): BelongsTo
    {
        return $this->belongsTo(Week::class);
    }
}