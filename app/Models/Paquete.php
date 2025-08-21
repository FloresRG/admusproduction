<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paquete extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_paquete',
        'caracteristicas',
        'descripcion',
        'monto',
        'puntos',
    ];

    // Un paquete puede estar en muchos seguimientos
    public function seguimientos()
    {
        return $this->hasMany(SeguimientoEmpresa::class, 'id_paquete');
    }
}
