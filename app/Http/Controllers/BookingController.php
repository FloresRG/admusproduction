<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use App\Models\Company;
use App\Models\Week;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'company', 'week'])
            // Filtrar por coincidencia con la disponibilidad de la empresa
            ->whereHas('company.availabilityDays', function ($q) {
                $q->whereColumn('availability_days.day_of_week', 'bookings.day_of_week')
                    ->whereColumn('availability_days.turno', 'bookings.turno');
            })
            // Filtrar por coincidencia con la disponibilidad del usuario (influencer)
            ->whereHas('user.influencerAvailabilities', function ($q) {
                $q->whereColumn('influencer_availabilities.day_of_week', 'bookings.day_of_week')
                    ->whereColumn('influencer_availabilities.turno', 'bookings.turno');
            })
            ->get()
            // Mapear para añadir un campo concatenado
            ->map(function ($b) {
                return [
                    'id'               => $b->id,
                    'user_id'          => $b->user_id,
                    'company_id'       => $b->company_id,
                    'week_id'          => $b->week_id,
                    'day_of_week'      => $b->day_of_week,
                    'turno'            => $b->turno,
                    'start_time'       => $b->start_time,
                    'end_time'         => $b->end_time,
                    'status'           => $b->status,
                    // aquí concatenas día – empresa – turno
                    'day_company_turno' => "{$b->day_of_week} – {$b->company->name} – {$b->turno}",
                ];
            });

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }


    public function create()
    {
        $users = User::all();
        $companies = Company::all();
        $weeks = Week::all();

        return Inertia::render('Bookings/Create', [
            'users' => $users,
            'companies' => $companies,
            'weeks' => $weeks
        ]);
    }
    private function getDateForDayOfWeek(string $baseDate, string $dayOfWeek): string
    {
        $days = [
            'monday'    => 0,
            'tuesday'   => 1,
            'wednesday' => 2,
            'thursday'  => 3,
            'friday'    => 4,
            'saturday'  => 5,
            'sunday'    => 6,
            'lunes'     => 0,
            'martes'    => 1,
            'miércoles' => 2,
            'jueves'    => 3,
            'viernes'   => 4,
            'sábado'    => 5,
            'domingo'   => 6,
        ];

        return \Carbon\Carbon::parse($baseDate)
            ->addDays($days[strtolower($dayOfWeek)] ?? 0)
            ->toDateString();
    }



    // CREA la nueva reserva en la semana $week
    public function store(Request $request, Week $week)
    {
        $request->validate([
            'user_id'     => 'required|exists:users,id',
            'company_id'  => 'required|exists:companies,id',
            'day_of_week' => 'required|string',
            'turno'       => 'required|string',
        ]);

        // Obtenemos la fecha correspondiente al día dentro de la semana
        $fecha = $this->getDateForDayOfWeek($week->start_date, $request->day_of_week);

        // Asignamos horas según turno
        $start_time = $request->turno === 'Morning'   ? '08:00:00'
            : ($request->turno === 'Afternoon' ? '14:00:00' : '18:00:00');

        $end_time = $request->turno === 'Morning'   ? '12:00:00'
            : ($request->turno === 'Afternoon' ? '18:00:00' : '22:00:00');


        Booking::create([
            'week_id'     => $week->id,
            'user_id'     => $request->user_id,
            'company_id'  => $request->company_id,
            'day_of_week' => $request->day_of_week,
            'turno'       => $request->turno,
            'status'      => 'Active',
            'start_time'  => "$fecha $start_time",
            'end_time'    => "$fecha $end_time",
        ]);

        // Regresa a la misma lista de reservas de la semana
        return redirect()->route('weeks.bookings.index', $week);
    }


    public function edit(Booking $booking, Week $week)
    {
        $users = User::all();
        $companies = Company::all();
        $weeks = Week::all();

        return Inertia::render('weeks/BookingsByWeek', [
            'week'      => $week,
            'bookings'  => $week->bookings,
            'companies' => $companies,
        ]);
    }


    // app/Http/Controllers/BookingController.php


    // app/Http/Controllers/BookingController.php

    public function update(Request $request, Booking $booking)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
        ]);

        $booking->update($request->only('company_id'));

        // Devuelve un redirect “back” (302 a la URL previa).
        // Inertia intercepta y vuelve a cargar esa misma página via XHR.
        return redirect()->back()
            ->with('success', 'Se guardó correctamente');
    }




    // Corrección: recibes primero la semana, luego la reserva
    public function destroy(Week $week, Booking $booking)
    {
        $booking->delete();
        // Redirige de nuevo a la lista de bookings de esa semana
        return redirect()->route('weeks.bookings.index', $week);
    }


    public function bookingsThisWeekForAuthenticatedUser()
    {
        // Rango de fechas de la semana actual
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $bookings = Booking::with([
            'week:id,name,start_date,end_date',
            'company:id,name,logo,company_category_id,contract_duration,description,ubicacion,direccion,start_date,end_date',
            'company.category:id,name',
            'user:id,name,email'
        ])
            ->where('user_id', Auth::id())
            ->whereBetween('start_time', [$startOfWeek, $endOfWeek])
            ->orderBy('start_time')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'day_of_week' => $booking->day_of_week,

                    'turno' => $booking->turno,
                    'start_time' => $booking->start_time, // sin toDateTimeString()
                    'end_time' => $booking->end_time,
                    'company' => [
                        'id' => $booking->company->id,
                        'name' => $booking->company->name,
                        'logo' => $booking->company->logo,
                        'category' => $booking->company->category->name ?? null,
                        'contract_duration' => $booking->company->contract_duration,
                        'description' => $booking->company->description,
                        'ubicacion' => $booking->company->ubicacion,
                        'direccion' => $booking->company->direccion,
                        'start_date' => $booking->company->start_date,
                        'end_date' => $booking->company->end_date,
                    ],
                    'week' => $booking->week,
                    'user' => $booking->user,
                ];
            });



        // Devuelve como JSON para verificación
        //  return response()->json([
        //    'bookings' => $bookings,
        //  'user' => Auth::user()
        //]);
        return \Inertia\Inertia::render('Bookings/ThisWeek', [
            'bookings' => $bookings,
            'user' => Auth::user(),
        ]);
    }
}
