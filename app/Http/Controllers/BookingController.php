<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use App\Models\Company;
use App\Models\Week;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
   public function index()
{
    $bookings = Booking::with(['user', 'company', 'week'])
        // Filtrar por coincidencia con la disponibilidad de la empresa
        ->whereHas('company.availabilityDays', function($q) {
            $q->whereColumn('availability_days.day_of_week', 'bookings.day_of_week')
              ->whereColumn('availability_days.turno', 'bookings.turno');
        })
        // Filtrar por coincidencia con la disponibilidad del usuario (influencer)
        ->whereHas('user.influencerAvailabilities', function($q) {
            $q->whereColumn('influencer_availabilities.day_of_week', 'bookings.day_of_week')
              ->whereColumn('influencer_availabilities.turno', 'bookings.turno');
        })
        ->get()
        // Mapear para añadir un campo concatenado
        ->map(function($b) {
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
                'day_company_turno'=> "{$b->day_of_week} – {$b->company->name} – {$b->turno}",
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

    public function store(Request $request)
    {
        $request->validate([
            'company_id' => 'required',
            'user_id' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'status' => 'required',
            'turno' => 'required',
            'week_id' => 'required',
        ]);

        Booking::create($request->all());
        return redirect('/bookings');
    }

    public function edit(Booking $booking)
    {
        $users = User::all();
        $companies = Company::all();
        $weeks = Week::all();

        return Inertia::render('Bookings/Edit', [
            'booking' => $booking,
            'users' => $users,
            'companies' => $companies,
            'weeks' => $weeks
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




    public function destroy(Booking $booking)
    {
        $booking->delete();
        return redirect('/bookings');
    }
}
