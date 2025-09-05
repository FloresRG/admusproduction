<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

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

    /* public function videosportafolio()
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

        return Inertia::render('portafolio/TikTokPortafolio', [
            'influencers' => $influencers,
        ]);
    } */
    public function videosportafolio()
    {
        // Obtener todas las empresas de la base de datos y ordenarlas de forma descendente por la fecha de creación
        $companies = Company::orderBy('created_at', 'desc')->get();

        // Renderizar el componente React y pasar las empresas como prop
        return Inertia::render('portafolio/TikTokPortafolio', [
            'companies' => $companies,
        ]);
    }
    function resolveTikTokUrl($url)
    {
        try {
            $response = Http::withOptions(['allow_redirects' => false])->get($url);
            // Reintenta si la primera vez no responde con 301/302
            if (!$response->redirect()) {
                $response = Http::get($url); // Permitir redirección
            }

            $location = $response->header('Location');
            return $location ?? $url;
        } catch (\Exception $e) {
            return $url; // fallback
        }
    }
    public function showvideos(Company $company)
    {
        $companyWithLinks = $company->load([
            'linkComprobantes' => function ($query) {
                // Ordena la tabla intermedia 'company_link_comprobante' por la columna 'fecha'
                $query->orderBy('fecha', 'desc');
            },
            'linkComprobantes.link' => function ($query) {
                // Filtra los enlaces de TikTok
                $query->where('link', 'LIKE', '%tiktok.com%')
                    ->orWhere('link', 'LIKE', '%vm.tiktok.com%');
            }
        ]);

        // Resuelve los enlaces acortados de TikTok antes de pasarlos a la vista
        $companyWithLinks->linkComprobantes->each(function ($linkComprobante) {
            if ($linkComprobante->link && strpos($linkComprobante->link->link, 'vm.tiktok.com') !== false) {
                $linkComprobante->link->link = $this->resolveTikTokUrl($linkComprobante->link->link);
            }
        });

        return Inertia::render('portafolio/CompanyVideos', [
            'company' => $companyWithLinks,
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
