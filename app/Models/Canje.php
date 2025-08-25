<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Canje extends Model
{
    use HasFactory;

    // Estados disponibles
    const ESTADO_PENDIENTE = 'pendiente';
    const ESTADO_RECOJIDO = 'recogido';
    const ESTADO_CANCELADO = 'cancelado';

    protected $fillable = [
        'id_user',
        'id_premio',
        'fecha',
        'estado', // Nuevo campo
        'fecha_recogido' // Nuevo campo para timestamp de recogida
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'fecha_recogido' => 'datetime',
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

    // Scope para canjes pendientes
    public function scopePendientes($query)
    {
        return $query->where('estado', self::ESTADO_PENDIENTE);
    }

    // Scope para canjes recogidos
    public function scopeRecogidos($query)
    {
        return $query->where('estado', self::ESTADO_RECOJIDO);
    }

    // Verificar si está pendiente
    public function estaPendiente()
    {
        return $this->estado === self::ESTADO_PENDIENTE;
    }

    // Verificar si está recogido
    public function estaRecogido()
    {
        return $this->estado === self::ESTADO_RECOJIDO;
    }
}