<?php

namespace App\Http\Controllers;

use App\Models\Booking; // Asegúrate de tener estas importaciones
use App\Models\Company;
use App\Models\Dato;
use App\Models\InfluencerAvailability;
use App\Models\Photo;
use App\Models\Tipo;
use App\Models\User;
use App\Models\Week; // Importamos el modelo Week
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
            $user->hasRole('pasante') => Inertia::render('Dashboard/Pasante', [
                'user' => $user,
            ]),
            // Nuevo: vista para empresa
    $user->hasRole('empresa') => Inertia::render('Dashboard/Empresa', [
        'user' => $user,
    ]),
            default => abort(403, 'Acceso no autorizado'),
        };
    }

    /**
     * Prepara los datos iniciales para el dashboard del influencer.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
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
        $totalAvailabilityHours = $availabilities->sum(function($availability) {
            try {
                $start = Carbon::parse($availability->start_time);
                $end = Carbon::parse($availability->end_time);
                return $end->diffInMinutes($start) / 60;
            } catch (\Exception $e) {
                return 0;
            }
        });

        $nextBooking = $bookings->filter(function($booking) {
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
            ->map(function($day) {
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