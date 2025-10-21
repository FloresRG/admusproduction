<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeguimientoEmpresa extends Model
{
    use HasFactory;

    protected $table = 'seguimiento_empresa';

    protected $fillable = [
        'nombre_empresa',
        'id_user',
        'id_paquete',
        'estado',
        'fecha_inicio',
        'fecha_fin',
        'descripcion',
        'celular',
    ];


    // Relación con el usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    public function usuariovendedor()
    {
        return $this->belongsTo(User::class, 'user_vendedor_id');
    }

    // Relación con el paquete
    public function paquete()
    {
        return $this->belongsTo(Paquete::class, 'id_paquete');
    }
    public function reportes()
    {
        return $this->belongsToMany(ReporteVenta::class, 'reporte_venta_seguimiento_empresa');
    }
}
