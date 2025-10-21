<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetaSiguiente extends Model
{
    use HasFactory;
    protected $table = 'metas_siguientes';
    protected $fillable = [
        'reporte_venta_id',
        'objetivo',
        'accion_implementar',
        'responsable',
        'fecha_cumplimiento',
    ];

    public function reporte()
    {
        return $this->belongsTo(ReporteVenta::class, 'reporte_venta_id');
    }
}
