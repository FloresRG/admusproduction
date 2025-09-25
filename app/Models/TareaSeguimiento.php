<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TareaSeguimiento extends Model
{
    use HasFactory;

    protected $table = 'tarea_seguimiento';

    protected $fillable = [
        'titulo',
        'empresa_id',
        'anio',
        'mes',
        'semana',
        'fecha_produccion',
        'fecha_nueva_produccion',
        'razon_produccion',
        'estado_produccion',
        'user_produccion_id',
        'fecha_edicion',
        'fecha_nueva_edicion',
        'razon_edicion',
        'estado_edicion',
        'user_edicion_id',
        'fecha_entrega',
        'fecha_nueva_entrega',
        'razon_entrega',
        'estado_entrega',
        'estrategia',
        'comentario',
        'guion',
    ];

    public function empresa()
    {
        return $this->belongsTo(Company::class);
    }

    // Relación con usuario de producción
    public function usuarioProduccion()
    {
        return $this->belongsTo(User::class, 'user_produccion_id');
    }

    // Relación con usuario de edición
    public function usuarioEdicion()
    {
        return $this->belongsTo(User::class, 'user_edicion_id');
    }
}
