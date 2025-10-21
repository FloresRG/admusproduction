<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstrategiaUtilizada extends Model
{
    use HasFactory;
    protected $table = 'estrategias_utilizadas';
    protected $fillable = [
        'reporte_venta_id',
        'metodo_estrategia',
        'herramientas_usadas',
        'resultado_esperado',
    ];

    public function reporte()
    {
        return $this->belongsTo(ReporteVenta::class, 'reporte_venta_id');
    }
}
