<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dificultad extends Model
{
    use HasFactory;
    protected $table = 'dificultades';
    protected $fillable = [
        'reporte_venta_id',
        'tipo',
        'descripcion',
        'impacto',
        'accion_tomada',
    ];

    public function reporte()
    {
        return $this->belongsTo(ReporteVenta::class, 'reporte_venta_id');
    }
}
