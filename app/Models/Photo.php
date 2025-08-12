<?php

// app/Models/Photo.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = ['path', 'nombre', 'tipo', 'cupon'];
    public function users()
    {
        return $this->belongsToMany(User::class, 'photo_user');
    }

    // Función para obtener URL completa
    public function getUrlAttribute()
    {
        return asset($this->path); // ✅ ya no uses 'storage/', solo el path tal cual esté guardado
    }
}
