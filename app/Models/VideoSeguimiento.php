<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoSeguimiento extends Model
{
    use HasFactory;

    protected $table = 'videos_seguimiento';

    protected $fillable = [
        'empresa_id',
        'year',
        'mes',
        'semana',
        'nombre',
        'fecha_produccion',
        'estado_entrega',
        'fecha_edicion',
        'estado_edicion',
        'fecha_entrega',
        'estado_entrega_final',
        'estrategia',
        'retroalimentacion',
    ];
}
