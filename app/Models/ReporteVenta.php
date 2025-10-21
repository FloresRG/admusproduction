<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReporteVenta extends Model
{
    use HasFactory;
    protected $table = 'reportes_ventas';
    protected $fillable = [
        'jefe_ventas_id',
        'tipo_periodo',
        'fecha_reporte',
        'fecha_inicio',
        'fecha_fin',
        'observaciones',
        'recomendaciones',
    ];

    public function jefeVentas()
    {
        return $this->belongsTo(User::class, 'jefe_ventas_id');
    }

    public function actividades()
    {
        return $this->hasMany(ActividadRealizada::class);
    }

    public function estrategias()
    {
        return $this->hasMany(EstrategiaUtilizada::class);
    }

    public function resultados()
    {
        return $this->hasMany(ResultadoEquipo::class);
    }

    public function dificultades()
    {
        return $this->hasMany(Dificultad::class);
    }

    public function metas()
    {
        return $this->hasMany(MetaSiguiente::class);
    }
    public function empresas()
{
    return $this->belongsToMany(SeguimientoEmpresa::class, 'reporte_venta_seguimiento_empresa');
}
}
