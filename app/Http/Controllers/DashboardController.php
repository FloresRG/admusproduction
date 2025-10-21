<?php

namespace App\Http\Controllers;

use App\Models\AsignacionTarea;
use App\Models\Booking; // Asegúrate de tener estas importaciones
use App\Models\Company;
use App\Models\CompanyLinkComprobante;
use App\Models\Dato;
use App\Models\InfluencerAvailability;
use App\Models\Photo;
use App\Models\SeguimientoEmpresa;
use App\Models\Tipo;
use App\Models\User;
use App\Models\Week; // Importamos el modelo Week
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use GuzzleHttp\Client;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return match (true) {
            $user->hasRole('admin') => Inertia::render('Dashboard/Admin', [
                'user' => $user,
            ]),
            // ¡Cambiamos la vista renderizada aquí!
            $user->hasRole('influencer') => $this->showInfluencerDashboard($user),
            $user->hasRole('pasante') => app(TareaController::class)->estadisticasUsuario(),
            $user->hasRole('camarografo') => app(TareaController::class)->estadisticasUsuarioCamarografo(),
            $user->hasRole('editor') => app(TareaController::class)->estadisticasUsuarioEditor(),
            $user->hasRole('Ejecutivo de Ventas') => $this->showVendedorDashboard($user),
            $user->hasRole('marketing') => $this->showMarketingDashboard($user),
            $user->hasRole('empresa') => $this->showEmpresaDashboard($user),
            $user->hasRole('Jefe de Ventas') => $this->showJefeVentasDashboard($user),
            default => abort(403, 'Acceso no autorizado'),
        };
    }

    protected function showJefeVentasDashboard(User $user)
    {
        return Inertia::render('Dashboard/JefeVentas', [
            'user' => $user
        ]);
    }


    protected function showEmpresaDashboard(User $user)
    {
        // Buscar la empresa por nombre (asumiendo que el nombre del usuario coincide con el nombre de la empresa)
        $company = Company::where('name', $user->name)->first();

        // Si no se encuentra la empresa, crear datos por defecto o manejar el error
        if (!$company) {
            // Opción 2: Crear datos por defecto (recomendado para desarrollo)
            $company = (object) [
                'id' => null,
                'name' => $user->name,
                'logo' => null,
                'description' => 'Empresa sin información adicional',
                'direccion' => 'No especificada', // Cambiado de 'ubicacion' a 'direccion' para coincidir con el componente React
                'celular' => 'No especificado',
            ];

            $tiktokVideos = []; // Sin videos si no existe la empresa
            $monthlyStats = $this->generateEmptyMonthlyStats();
        } else {
            // Obtener los videos de TikTok asociados a la empresa
            $tiktokVideos = $this->getTikTokVideosForCompany($company->id);

            // Generar estadísticas mensuales basadas en los videos reales
            $monthlyStats = $this->generateMonthlyStatsForCompany($company->id);
        }

        return Inertia::render('Dashboard/Empresa', [
            'user' => $user,
            'company' => $company,
            'tiktokVideos' => $tiktokVideos,
            'monthlyStats' => $monthlyStats,
        ]);
    }

    protected function showVendedorDashboard(User $user)
    {
        $seguimientos = SeguimientoEmpresa::where('id_user', $user->id)->get();

        $estadisticas = [
            'total' => $seguimientos->count(),
            'completado' => $seguimientos->where('estado', 'Completado')->count(),
            'en_proceso' => $seguimientos->where('estado', 'En proceso')->count(),
            'sin_exito' => $seguimientos->where('estado', 'Sin exito')->count(),
        ];

        return Inertia::render('Dashboard/Vendedor', [
            'user' => $user,
            'estadisticas' => $estadisticas,
        ]);
    }
    protected function showMarketingDashboard(User $user)
    {
        // Todas las tareas para estadísticas
        // Todas las tareas (de todos los usuarios)
        $todasTareas = AsignacionTarea::all();


        $estadisticas = [
            'total' => $todasTareas->count(),
            'pendiente' => $todasTareas->where('estado', 'pendiente')->count(),
            'en_revision' => $todasTareas->where('estado', 'en_revision')->count(),
            'publicada' => $todasTareas->where('estado', 'publicada')->count(),
        ];

        // Últimas 5 tareas asignadas basadas en la fecha de la tabla Tarea
        // Últimas 5 tareas (solo del usuario actual)
        $ultimasTareas = AsignacionTarea::with(['tarea', 'user']) // incluir user
            ->join('tareas', 'asignacion_tarea.tarea_id', '=', 'tareas.id')
            ->orderBy('tareas.fecha', 'desc')
            ->select('asignacion_tarea.*')
            ->take(10) // si quieres limitar, por ejemplo las 10 últimas
            ->get();


        // Influencers disponibles hoy
        $influencers = InfluencerAvailability::with('user')
            ->where('day_of_week', now()->format('l'))
            ->get();

        // Campañas activas con comprobantes
        $campanias = CompanyLinkComprobante::with(['company', 'link', 'comprobante'])
            ->orderBy('fecha', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Dashboard/Marketing', [
            'user' => $user,
            'estadisticas' => $estadisticas,
            'tareas' => $ultimasTareas,
            'influencers' => $influencers,
            'campanias' => $campanias,
        ]);
    }





    /**
     * Obtiene los videos de TikTok para una empresa específica
     */
    protected function getTikTokVideosForCompany($companyId)
    {
        $companyLinks = CompanyLinkComprobante::with(['link', 'comprobante'])
            ->where('company_id', $companyId)
            ->orderBy('fecha', 'desc')
            ->get();

        $videos = [];

        foreach ($companyLinks as $association) {
            $link = $association->link;

            // Verificar si el link es de TikTok
            if ($this->isTikTokLink($link->link)) {
                $videoData = $this->extractTikTokVideoData($link, $association);
                if ($videoData) {
                    $videos[] = $videoData;
                }
            }
        }

        return $videos;
    }

    /**
     * Verifica si un link es de TikTok
     */
    protected function isTikTokLink($url)
    {
        return strpos($url, 'tiktok.com') !== false || strpos($url, 'vm.tiktok.com') !== false;
    }





    protected function fetchTikTokData($url)
    {
        try {
            $client = new Client([
                'timeout' => 10,
                'verify' => false, // Si tienes problemas con SSL en local
            ]);

            // Ejemplo usando la API pública de tikwm.com (no requiere API key para pruebas)
            $response = $client->get('https://tikwm.com/api/', [
                'query' => [
                    'url' => $url,
                ],
                'headers' => [
                    'Accept' => 'application/json',
                ],
            ]);

            $data = json_decode($response->getBody(), true);

            if (isset($data['data'])) {
                return [
                    'title' => $data['data']['title'] ?? null,
                    'description' => $data['data']['desc'] ?? null,
                    'thumbnail' => $data['data']['cover'] ?? null,
                    'views' => $data['data']['play_count'] ?? null,
                    'likes' => $data['data']['digg_count'] ?? null,
                ];
            }
        } catch (\Exception $e) {
            // Puedes loguear el error si quieres
            // \Log::error('TikTok fetch error: ' . $e->getMessage());
            return [];
        }

        return [];
    }
    /**
     * Extrae datos del video de TikTok
     */
    protected function extractTikTokVideoData($link, $association)
    {
        try {
            // Aquí podrías usar la API de TikTok o scraping (respetando términos de servicio)
            $realData = $this->fetchTikTokData($link->link);

            return [
                'id' => $association->id,
                'title' => $realData['title'] ?? $link->detalle ?? 'Video de TikTok',
                'description' => $realData['description'] ?? $link->detalle ?? 'Contenido promocional',
                'videoUrl' => $link->link,
                'thumbnailUrl' => $realData['thumbnail'] ?? $this->generateThumbnailUrl($link->link),
                'views' => $realData['views'] ?? $this->generateRandomViews(),
                'likes' => $realData['likes'] ?? $this->generateRandomLikes(),
                'fecha' => $association->fecha,
                'mes' => $association->mes,
                'videoId' => $this->extractVideoIdFromTikTokUrl($link->link),
                'embedHtml' => $this->generateEmbedHtml($link->link, $link->detalle),
            ];
        } catch (\Exception $e) {
            // Fallback a datos simulados si falla la extracción real
            return $this->getFallbackVideoData($link, $association);
        }
    }

    /**
     * Genera una URL de thumbnail para el video
     */
    protected function generateThumbnailUrl($videoUrl)
    {
        // Por ahora usamos placeholder, pero podrías implementar lógica para obtener thumbnails reales
        $colors = ['3B82F6', 'EF4444', '10B981', 'F59E0B', '8B5CF6'];
        $color = $colors[array_rand($colors)];
        return "https://placehold.co/400x600/{$color}/FFFFFF?text=TikTok+Video";
    }

    /**
     * Genera vistas aleatorias (esto debería reemplazarse con datos reales de la API de TikTok)
     */
    protected function generateRandomViews()
    {
        return rand(1000, 100000);
    }

    /**
     * Genera likes aleatorios (esto debería reemplazarse con datos reales de la API de TikTok)
     */
    protected function generateRandomLikes()
    {
        return rand(100, 10000);
    }

    /**
     * Extrae el ID del video de la URL de TikTok
     */
    protected function extractVideoIdFromTikTokUrl($url)
    {
        // Lógica básica para extraer ID, puede necesitar ajustes según el formato de URLs
        preg_match('/\/video\/(\d+)/', $url, $matches);
        return $matches[1] ?? uniqid();
    }

    /**
     * Genera HTML embed para el video
     */
    protected function generateEmbedHtml($videoUrl, $title)
    {
        $title = htmlspecialchars($title ?: 'Video TikTok');
        return "<div class='bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg h-full flex flex-col items-center justify-center text-white font-bold p-4'>
                <div class='text-4xl mb-2'>📱</div>
                <div class='text-center text-sm'>{$title}</div>
                <div class='mt-2 text-xs opacity-75'>Clic para ver en TikTok</div>
            </div>";
    }

    /**
     * Genera estadísticas mensuales para la empresa
     */
    protected function generateMonthlyStatsForCompany($companyId)
    {
        $monthNames = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
        ];

        $stats = [];
        $now = new \DateTime();

        for ($i = 5; $i >= 0; $i--) {
            $date = clone $now;
            $date->modify("-{$i} months");

            // Contar videos reales para este mes
            $videosCount = CompanyLinkComprobante::where('company_id', $companyId)
                ->where('mes', $date->format('Y-m'))
                ->count();

            $stats[] = [
                'month' => $monthNames[$date->format('n') - 1] . ' ' . $date->format('Y'),
                'videos' => $videosCount,
                'totalViews' => $videosCount * rand(5000, 25000), // Simulado
                'totalLikes' => $videosCount * rand(500, 5000),   // Simulado
            ];
        }

        return $stats;
    }

    /**
     * Genera estadísticas vacías cuando no hay empresa
     */
    protected function generateEmptyMonthlyStats()
    {
        $monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
        $stats = [];
        $now = new \DateTime();

        for ($i = 5; $i >= 0; $i--) {
            $date = clone $now;
            $date->modify("-{$i} months");

            $stats[] = [
                'month' => $monthNames[$date->format('n') - 1] . ' ' . $date->format('Y'),
                'videos' => 0,
                'totalViews' => 0,
                'totalLikes' => 0,
            ];
        }

        return $stats;
    }
    protected function showInfluencerDashboard(User $user)
    {
        $bookings = $user->bookings()->with(['week', 'company'])->get();
        $workingWeeks = $bookings->pluck('week')->unique('id')->values();
        $daysWorkedByWeek = $bookings->groupBy('week_id')->map(function ($bookingsPerWeek) {
            return [
                'week_id' => $bookingsPerWeek->first()->week->id,
                'week_name' => $bookingsPerWeek->first()->week->name,
                'total_days_worked' => $bookingsPerWeek->pluck('day_of_week')->unique()->count(),
            ];
        })->values();
        $workedCompanies = $bookings->pluck('company')->unique('id')->values();
        $availabilities = $user->availabilities()->get();
        $totalBookings = $bookings->count();
        $bookingStatusCounts = $bookings->groupBy('status')->map->count();
        $totalAvailabilityHours = $availabilities->sum(function ($availability) {
            try {
                $start = Carbon::parse($availability->start_time);
                $end = Carbon::parse($availability->end_time);
                return $end->diffInMinutes($start) / 60;
            } catch (\Exception $e) {
                return 0;
            }
        });

        $nextBooking = $bookings->filter(function ($booking) {
            return Carbon::parse($booking->start_time)->isFuture();
        })->sortBy('start_time')->first();

        $lastWorkedCompany = $bookings->sortByDesc('start_time')->first()->company->name ?? 'N/A';
        $averageDaysPerWeek = $daysWorkedByWeek->count() > 0
            ? $daysWorkedByWeek->sum('total_days_worked') / $daysWorkedByWeek->count()
            : 0;
        $totalPhotos = $user->photos()->count();
        $daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
        $availableDays = $availabilities->pluck('day_of_week')
            ->unique()
            ->map(function ($day) {
                return mb_strtolower($day, 'UTF-8');
            })
            ->toArray();
        $daysWithoutAvailability = array_diff($daysOfWeek, $availableDays);

        // ¡Renderizamos la nueva vista principal del influencer!
        return Inertia::render('Dashboard/Influencer', [
            'user' => $user,
            'workingWeeks' => $workingWeeks,
            'daysWorkedByWeek' => $daysWorkedByWeek,
            'workedCompanies' => $workedCompanies,
            'availabilities' => $availabilities,
            'totalBookings' => $totalBookings,
            'bookingStatusCounts' => $bookingStatusCounts,
            'totalAvailabilityHours' => round($totalAvailabilityHours, 2),
            'nextBooking' => $nextBooking ? [
                'company_name' => $nextBooking->company->name,
                'start_time' => Carbon::parse($nextBooking->start_time)->format('d M H:i'),
                'day_of_week' => $nextBooking->day_of_week,
            ] : null,
            'lastWorkedCompany' => $lastWorkedCompany,
            'averageDaysPerWeek' => round($averageDaysPerWeek, 2),
            'totalPhotos' => $totalPhotos,
            'daysWithoutAvailability' => array_values($daysWithoutAvailability),
        ]);
    }

    /**
     * Devuelve todas las semanas en las que el usuario logueado tiene reservas (JSON).
     * Este método es para API, no para renderizar una página completa.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWorkingWeeksList()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $weeks = $user->bookings()->with('week')
            ->get()
            ->pluck('week')
            ->unique('id')
            ->values();

        return response()->json($weeks);
    }

    /**
     * Devuelve los datos detallados para una semana específica del usuario logueado (JSON).
     * Este método es para API, no para renderizar una página completa.
     *
     * @param  \App\Models\Week  $week
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSpecificWeekDetails(Week $week)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $userHasBookingsInWeek = $user->bookings()
            ->where('week_id', $week->id)
            ->exists();

        if (!$userHasBookingsInWeek) {
            return response()->json(['message' => 'Semana no encontrada para este usuario o acceso no autorizado'], 404);
        }

        $bookingsInWeek = $user->bookings()
            ->where('week_id', $week->id)
            ->with('company')
            ->get();

        $uniqueDaysWorkedInWeek = $bookingsInWeek->pluck('day_of_week')->unique()->count();
        $companiesInWeek = $bookingsInWeek->pluck('company')->unique('id')->values();

        return response()->json([
            'week' => $week,
            'bookings' => $bookingsInWeek,
            'unique_days_worked' => $uniqueDaysWorkedInWeek,
            'companies_in_week' => $companiesInWeek,
        ]);
    }

    /**
     * Prepara los datos para la vista de detalles de una semana específica.
     * Este método renderiza una nueva página de Inertia.
     *
     * @param  \App\Models\Week  $week  El modelo Week inyectado por Laravel.
     * @return \Inertia\Response
     */
    public function showWeekDetails(Week $week)
    {
        $user = Auth::user();
        if (!$user) {
            return Inertia::location(route('login')); // Redirigir si no está autenticado
        }

        // Obtener todas las reservas del usuario para esta semana, cargando la empresa
        $bookingsInWeek = $user->bookings()
            ->where('week_id', $week->id)
            ->with('company')
            ->get();

        // Si el usuario no tiene reservas en esta semana, podría ser un intento de acceso no autorizado
        if ($bookingsInWeek->isEmpty()) {
            // Opcional: abort(404) o redirigir a un dashboard con mensaje de error
            return Inertia::render('Error', ['status' => 404, 'message' => 'No se encontraron reservas para esta semana en tu perfil.']);
        }

        // Contar días únicos trabajados en esta semana específica
        $uniqueDaysWorkedInWeek = $bookingsInWeek->pluck('day_of_week')->unique()->count();

        // Empresas únicas en esta semana
        $companiesInWeek = $bookingsInWeek->pluck('company')->unique('id')->values();

        // Renderizar la nueva vista de detalles de la semana
        return Inertia::render('Dashboard/WeekDetails', [
            'weekData' => [
                'week' => $week,
                'bookings' => $bookingsInWeek,
                'unique_days_worked' => $uniqueDaysWorkedInWeek,
                'companies_in_week' => $companiesInWeek,
            ],
            'user' => $user->only('name', 'email', 'profile_photo_url'), // Pasa algunos datos del usuario si la vista los necesita
        ]);
    }
}
