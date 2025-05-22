<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tipo extends Model
{
    use HasFactory;

    protected $table = 'tipos';

    protected $fillable = [
        'nombre_tipo',
    ];

    // Relación con tareas
    public function tareas()
    {
        return $this->hasMany(Tarea::class, 'tipo_id');
    }

    // Relación con usuarios (muchos a muchos)
    public function users()
    {
        return $this->belongsToMany(User::class, 'tipo_user', 'tipo_id', 'user_id');
    }
}
