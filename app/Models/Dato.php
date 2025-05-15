<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dato extends Model
{
    use HasFactory;

    // Especifica la tabla de la base de datos
    protected $table = 'datos';

    // Define los campos que pueden ser llenados de forma masiva (mass assignment)
    protected $fillable = [
        'cantidad',
        'id_user',
    ];

    /**
     * Relación con el modelo User (un dato pertenece a un usuario).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
