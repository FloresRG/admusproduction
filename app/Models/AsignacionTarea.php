<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsignacionTarea extends Model
{
    use HasFactory;

    protected $table = 'asignacion_tarea';

    protected $fillable = [
        'user_id',
        'tarea_id',
        'estado',
        'detalle',
        'fecha',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tarea()
    {
        return $this->belongsTo(Tarea::class, 'tarea_id');
    }
}
