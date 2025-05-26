<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tipo extends Model
{
    use HasFactory;

    // Nombre de la tabla asociada
    protected $table = 'tipos';

    protected $fillable = ['nombre_tipo'];

    // Relación: Un tipo tiene muchas tareas
    public function tareas()
    {
        return $this->hasMany(Tarea::class);
    }

    // Si tienes relación con usuarios a través de tipo_user
    public function users()
    {
        return $this->belongsToMany(User::class, 'tipo_user');
    }
}
