<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Str; 
class InfluencerDatosController extends Controller
{
    public function index()
    {
        $influencers = User::role('influencer')
            ->with(['dato', 'photos'])
            ->get()
            ->map(function ($user) {
                $dato = $user->dato;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => '@' . strtolower(str_replace(' ', '', $user->name)),
                    'followers' => $dato?->seguidores ?? '0',
                    'category' => $dato?->categoria ?? 'Sin categoría',
                    'description' => $dato?->descripcion ?? 'Sin descripción',
                    'avatar' => $user->photos->first()?->url ?? '/placeholder.svg',
                    'coverImage' => $user->photos->skip(1)->first()?->url ?? '/placeholder.svg',
                    'verified' => true,
                    'engagement' => $dato?->engagement ?? '0%',
                    'rating' => $dato?->rating ?? '0',
                    'specialties' => $dato?->especialidades
                        ? explode(',', $dato->especialidades)
                        : ['Sin especialidades'],
                    'videos' => $dato?->videos ? json_decode($dato->videos) : [],
                    'gallery' => $user->photos->pluck('url')->toArray(), // ✅ Añadir todas las fotos
                ];
            });

        return Inertia::render('portafolio/TikTokerPortfolio', [
            'influencers' => $influencers,
        ]);
    }

public function show($id)
    {
        $user = User::role('influencer')
            ->with(['dato', 'photos'])
            ->findOrFail($id);

        $dato = $user->dato;

        $influencer = [
            'id'             => $user->id,
            'name'           => $user->name,
            'username'       => '@' . Str::of($user->name)->lower()->slug(''),
            'followers'      => $dato?->seguidores       ?? '0',
            'category'       => $dato?->categoria        ?? 'Sin categoría',
            'description'    => $dato?->descripcion      ?? 'Sin descripción',
            'avatar'         => $user->photos->first()?->url          ?? '/placeholder.svg',
            'coverImage'     => $user->photos->skip(1)->first()?->url ?? '/placeholder.svg',
            'verified'       => true,
            'engagement'     => $dato?->engagement      ?? '0%',
            'rating'         => $dato?->rating          ?? '0',
            'specialties'    => $dato && $dato->especialidades
                                    ? explode(',', $dato->especialidades)
                                    : [],
            'videos'         => $dato && $dato->videos
                                    ? json_decode($dato->videos, true)
                                    : [],
            'gallery'        => $user->photos->pluck('url')->toArray() ?: [],

            // Campos para la sección de perfil completo
            'socialNetworks' => $dato && $dato->redes_sociales
                                    ? json_decode($dato->redes_sociales, true)
                                    : [],
            'location'       => $dato?->ubicacion        ?? '',
            'joinDate'       => $dato?->fecha_alta       ?? '',
            'bio'            => $dato?->bio              ?? '',
            'languages'      => $dato && $dato->idiomas
                                    ? explode(',', $dato->idiomas)
                                    : [],
            'packages'       => $dato && $dato->paquetes
                                    ? json_decode($dato->paquetes, true)
                                    : [],
            'reviews'        => $dato && $dato->reseñas
                                    ? json_decode($dato->reseñas, true)
                                    : [],
            'totalReviews'   => $dato?->total_reseñas    ?? 0,
            'responseTime'   => $dato?->tiempo_respuesta ?? '',
            'availability'   => 'available',  // o null si no lo quieres hardcodear
        ];

        return Inertia::render('portafolio/InfluencerProfile', [
            'influencer' => $influencer,
        ]);
    }

}
