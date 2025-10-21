<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultadoEquipo extends Model
{
    use HasFactory;
    protected $table = 'resultados_equipo';
    protected $fillable = [
        'reporte_venta_id',
        'indicador',
        'meta_mes',
        'resultado_real',
        'observaciones',
    ];

    public function reporte()
    {
        return $this->belongsTo(ReporteVenta::class, 'reporte_venta_id');
    }
}
