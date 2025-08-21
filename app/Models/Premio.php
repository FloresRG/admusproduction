<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Premio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_premio',
        'descripcion',
        'puntos_necesarios',
    ];

    // Relación con los canjes
    public function canjes()
    {
        return $this->hasMany(Canje::class, 'id_premio');
    }
}
