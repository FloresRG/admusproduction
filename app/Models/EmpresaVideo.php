<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmpresaVideo extends Model
{
    use HasFactory;

    protected $table = 'empresa_videos';

    protected $fillable = [
        'video_id',
        'visualizaciones',
        'me_gusta',
        'comentarios',
        'compartidas',
    ];

    // Relaciones
    public function video()
    {
        return $this->belongsTo(VideoSeguimiento::class, 'video_id');
    }

}
