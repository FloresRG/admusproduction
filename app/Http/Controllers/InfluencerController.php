<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InfluencerController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        // Obtener las fotos del usuario con la relación many-to-many
        $userPhotos = $user->photos()->get();

        // Preparar los datos del perfil
        $profileData = [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $userPhotos->count() > 0 ? $userPhotos->first()->url : 'https://randomuser.me/api/portraits/men/32.jpg' // foto por defecto
            ],
            'datos' => [
                'biografia' => $user->biografia ?? 'Creador de contenido digital',
                'telefono' => $user->telefono ?? '',
                'ciudad' => $user->ciudad ?? '',
                'redesSociales' => [
                    'instagram' => $user->instagram ?? '',
                    'youtube' => $user->youtube ?? '',
                    'tiktok' => $user->tiktok ?? ''
                ]
            ],
            'tipos' => $user->tipos ?? [], // Asumiendo que tienes una relación con tipos de influencer
            'photos' => $userPhotos->map(function ($photo) {
                return [
                    'id' => $photo->id,
                    'url' => $photo->url,
                    'nombre' => $photo->nombre
                ];
            }),
            'availabilities' => $user->availabilities->map(function ($availability) {
                return [
                    'id' => $availability->id,
                    'day_of_week' => $availability->day_of_week,
                    'time_start' => $availability->start_time,
                    'time_end' => $availability->end_time,
                    'turno' => $availability->turno,
                    'status' => 'disponible' // Puedes ajustar si tienes lógica de estados
                ];
            }),

        ];

        return Inertia::render('influencers/Perfil', [
            'profileData' => $profileData
        ]);
    }
}
