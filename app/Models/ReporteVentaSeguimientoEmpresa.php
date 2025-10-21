<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReporteVentaSeguimientoEmpresa extends Model
{
    protected $table = 'reporte_venta_seguimiento_empresa';

    protected $fillable = [
        'reporte_venta_id',
        'seguimiento_empresa_id',
        // otros campos si los agregas en la tabla pivote
    ];
}
