<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComentarioPlan extends Model
{
    use HasFactory;

    protected $table = 'comentarios_planes';

    protected $fillable = [
        'contenido',
        'plan_empresa_id',
        'user_id',
    ];

    public function planEmpresa()
    {
        return $this->belongsTo(PlanEmpresa::class, 'plan_empresa_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
