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

    public function tipos()
    {
        return $this->belongsToMany(Tipo::class, 'tipo_user');
    }

    public function asignaciones()
    {
        return $this->hasMany(AsignacionTarea::class);
    }
}
