<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanEmpresa extends Model
{
    use HasFactory;

    protected $table = 'planes_empresas';

    protected $fillable = [
        'empresa_id',
        'mensajes',
        'comentario',
    ];

    public function empresa()
    {
        return $this->belongsTo(Company::class, 'empresa_id');
    }
}
