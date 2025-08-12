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

                // Buscar el primer registro de tipo 'datos' en photos y decodificar el JSON
                $rawData = $user->photos
                    ->where('tipo', 'datos')
                    ->map(function ($photo) {
                        $json = json_decode($photo->path, true);
                        return is_array($json) ? $json : null;
                    })
                    ->filter() // eliminar nulos
                    ->first();

                // Buscar solo los videos
                $videos = $user->photos
                    ->where('tipo', 'video')
                    ->map(function ($video) {
                        return [
                            'id'        => $video->id,
                            'title'     => $video->nombre,
                            'url'       => $video->path,
                            'thumbnail' => '/video-thumbnail.jpg', // Puedes reemplazar con lógica real
                            'duration'  => 'N/A',
                            'views'     => 'N/A',
                            'likes'     => 'N/A',
                        ];
                    })
                    ->values()
                    ->toArray();

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
                    'videos' => $videos,
                    'gallery' => $user->photos->where('tipo', 'foto')->pluck('url')->toArray(),
                    'rawData' => $rawData, // ✅ Datos adicionales desde el JSON
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
            'id'           => $user->id,
            'name'         => $user->name,
            'username'     => '@' . Str::of($user->name)->lower()->slug(''),
            'followers'    => $dato?->seguidores ?? '0',
            'category'     => $dato?->categoria ?? 'Sin categoría',
            'description'  => $dato?->descripcion ?? 'Sin descripción',
            'avatar'       => $user->fotos->first()?->url ?? '/placeholder.svg',
            'coverImage'   => $user->fotos->skip(1)->first()?->url ?? '/placeholder.svg',
            'verified'     => true,
            'engagement'   => $dato?->engagement ?? '0%',
            'rating'       => $dato?->rating ?? '0',

            // Clasificados por tipo
            'gallery' => $user->fotos->pluck('url')->toArray(),

            'videos' => $user->videos->map(fn($video) => [
                'id'        => $video->id,
                'title'     => $video->nombre ?? 'Video sin título',
                'url'       => $video->url,
                'thumbnail' => '/video-thumbnail.jpg', // puedes personalizar
                'duration'  => 'N/A',
                'views'     => 'N/A',
                'likes'     => 'N/A',
            ])->toArray(),

            'rawData' => $user->datos->map(fn($d) => json_decode($d->path, true))
                ->collapse()
                ->toArray(),

            // Perfil extendido
            'specialties'    => $dato && $dato->especialidades
                ? explode(',', $dato->especialidades)
                : [],
            'socialNetworks' => $dato && $dato->redes_sociales
                ? json_decode($dato->redes_sociales, true)
                : [],
            'location'       => $dato?->ubicacion ?? '',
            'joinDate'       => $dato?->fecha_alta ?? '',
            'bio'            => $dato?->bio ?? '',
            'languages'      => $dato && $dato->idiomas
                ? explode(',', $dato->idiomas)
                : [],
            'packages'       => $dato && $dato->paquetes
                ? json_decode($dato->paquetes, true)
                : [],
            'reviews'        => $dato && $dato->reseñas
                ? json_decode($dato->reseñas, true)
                : [],
            'totalReviews'   => $dato?->total_reseñas ?? 0,
            'responseTime'   => $dato?->tiempo_respuesta ?? '',
            'availability'   => 'available',
        ];

        return Inertia::render('portafolio/InfluencerProfile', [
            'influencer' => $influencer,
        ]);
    }
}
