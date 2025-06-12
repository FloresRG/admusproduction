<?php

// app/Models/Photo.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = ['path', 'nombre', 'tipo'];
    //tipo:datos personales
    //nombre:
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    // Función para obtener URL completa
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->path);
    }
}

