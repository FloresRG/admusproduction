<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarea extends Model
{
    use HasFactory;

    protected $table = 'tareas';

    protected $fillable = [
        'titulo',
        'prioridad',
        'descripcion', 
        'empresa',
        'fecha',
        'tipo_id',
        'company_id'
    ];

    // Relación: Tarea pertenece a un tipo
    public function tipo()
    {
        return $this->belongsTo(Tipo::class);
    }

    // Relación: Tarea pertenece a una empresa (si existe el modelo Company)
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Relación: Tarea tiene muchas asignaciones
    public function asignaciones()
    {
        return $this->hasMany(AsignacionTarea::class);
    }
}
