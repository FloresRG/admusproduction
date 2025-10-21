<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActividadRealizada extends Model
{
    use HasFactory;
    protected $table = 'actividades_realizadas';
    protected $fillable = [
        'reporte_venta_id',
        'tipo_actividad',
        'descripcion',
        'fecha_actividad',
        'observaciones',
    ];

    public function reporte()
    {
        return $this->belongsTo(ReporteVenta::class, 'reporte_venta_id');
    }
}
