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
        'fecha',
        'tipo_id',
        'company_id',
    ];

    public function tipo()
    {
        return $this->belongsTo(Tipo::class, 'tipo_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function asignaciones()
    {
        return $this->hasMany(AsignacionTarea::class, 'tarea_id');
    }
}
