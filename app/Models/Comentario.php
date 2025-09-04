<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;

    protected $fillable = [
        'contenido',
        'informe_id',
        'user_id',
    ];

    public function informe()
    {
        return $this->belongsTo(Informe::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
