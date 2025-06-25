<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use App\Models\Week;
use App\Models\Company; // Agregamos el modelo Company
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
            $user->hasRole('influencer') => $this->showInfluencerDashboard($user),
            $user->hasRole('pasante') => Inertia::render('Dashboard/Pasante', [
                'user' => $user,
            ]),
            // Actualizado: vista para empresa con datos de la empresa
            $user->hasRole('empresa') => $this->showEmpresaDashboard($user),
            default => abort(403, 'Acceso no autorizado'),
        };
    }

    /**
     * Prepara los datos iniciales para el dashboard de la empresa.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    protected function showEmpresaDashboard(User $user)
    {
        // Buscar la empresa por nombre (asumiendo que el nombre del usuario coincide con el nombre de la empresa)
        $company = Company::where('name', $user->name)->first();

        // Si no se encuentra la empresa, crear datos por defecto o manejar el error
        if (!$company) {
            // Opción 1: Devolver error
            // abort(404, 'No se encontró la empresa asociada a este usuario');
            
            // Opción 2: Crear datos por defecto (recomendado para desarrollo)
            $company = (object) [
                'id' => null,
                'name' => $user->name,
                'logo' => null,
                'description' => 'Empresa sin información adicional',
                'ubicacion' => 'No especificada',
                'celular' => 'No especificado',
            ];
        }

        return Inertia::render('Dashboard/Empresa', [
            'user' => $user,
            'company' => $company, // Pasamos los datos de la empresa
        ]);
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
            return Inertia::location(route('login'));
        }

        $bookingsInWeek = $user->bookings()
            ->where('week_id', $week->id)
            ->with('company')
            ->get();

        if ($bookingsInWeek->isEmpty()) {
            return Inertia::render('Error', ['status' => 404, 'message' => 'No se encontraron reservas para esta semana en tu perfil.']);
        }

        $uniqueDaysWorkedInWeek = $bookingsInWeek->pluck('day_of_week')->unique()->count();
        $companiesInWeek = $bookingsInWeek->pluck('company')->unique('id')->values();

        return Inertia::render('Dashboard/WeekDetails', [
            'weekData' => [
                'week' => $week,
                'bookings' => $bookingsInWeek,
                'unique_days_worked' => $uniqueDaysWorkedInWeek,
                'companies_in_week' => $companiesInWeek,
            ],
            'user' => $user->only('name', 'email', 'profile_photo_url'),
        ]);
    }
}