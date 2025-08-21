<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Canje extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'id_premio',
        'fecha',
    ];

    // Relación con el usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    // Relación con el premio
    public function premio()
    {
        return $this->belongsTo(Premio::class, 'id_premio');
    }
}
