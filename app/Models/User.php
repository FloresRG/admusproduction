<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'puntos_ganados',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    // En el modelo User
    public function dato()
    {
        return $this->hasOne(Dato::class, 'id_user');  // Relación uno a uno con el modelo Dato
    }
    public function tipos()
    {
        return $this->belongsToMany(Tipo::class, 'tipo_user', 'user_id', 'tipo_id');
    }



    public function asignaciones()
    {
        return $this->hasMany(AsignacionTarea::class);
    }

    public function availabilities()
    {
        return $this->hasMany(InfluencerAvailability::class);
    }
    public function photos()
    {
        return $this->belongsToMany(Photo::class, 'photo_user');
    }
    // ¡¡AÑADE ESTA FUNCIÓN!!
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'user_id'); // Asumiendo que la tabla 'bookings' tiene una columna 'user_id'
    }
    public function fotos()
    {
        return $this->photos()->where('tipo', 'foto');
    }

    public function videos()
    {
        return $this->photos()->where('tipo', 'video');
    }

    public function datos()
    {
        return $this->photos()->where('tipo', 'dato');
    }


    public function asignacionesPasante()
    {
        return $this->hasMany(AsignacionPasante::class);
    }

    public function seguimientos()
    {
        return $this->hasMany(SeguimientoEmpresa::class, 'id_user');
    }

    public function canjes()
    {
        return $this->hasMany(Canje::class, 'id_user');
    }
    public function reportesVentas()
    {
        return $this->hasMany(ReporteVenta::class, 'jefe_ventas_id');
    }
}
