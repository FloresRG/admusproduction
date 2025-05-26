<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tipo extends Model
{
    use HasFactory;

    // Nombre de la tabla asociada
    protected $table = 'tipos';

    // Campos asignables masivamente
    protected $fillable = [
        'nombre_tipo',
    ];

    /**
     * Relación uno a muchos con Tarea
     * Un tipo puede tener muchas tareas
     */
    public function tareas()
    {
        return $this->hasMany(Tarea::class, 'tipo_id');
    }

    /**
     * Relación muchos a muchos con User
     * Un tipo puede estar asociado a muchos usuarios
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'tipo_user', 'tipo_id', 'user_id');
    }
}
