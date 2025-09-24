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
        'tiktok_mes',
        'tiktok_semana',
        'facebook_mes',
        'facebook_semana',
        'instagram_mes',
        'instagram_semana',
        'artesfacebook_mes',
        'artesfacebook_semana',
        'artesinstagram_mes',
        'artesinstagram_semana',
        'extras',
        'total_publicaciones',
    ];

    // Un paquete puede estar en muchos seguimientos
    public function seguimientos()
    {
        return $this->hasMany(SeguimientoEmpresa::class, 'id_paquete');
    }
}
