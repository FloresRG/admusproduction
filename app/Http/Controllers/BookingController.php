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
        $bookings = Booking::with(['user', 'company', 'week'])->get();
        return Inertia::render('Bookings/Index', ['bookings' => $bookings]);
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

    public function update(Request $request, Booking $booking)
    {
        $booking->update($request->all());
        return redirect('/bookings');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return redirect('/bookings');
    }
    public function bookingsThisWeekForAuthenticatedUser()
    {
         $bookings = \App\Models\Booking::with([
        'week',
        'company',
        'user', // opcional, si lo necesitas en frontend
    ])
    ->where('user_id', Auth::id())
    ->orderByDesc('start_time')
    ->get();

    return \Inertia\Inertia::render('Bookings/ThisWeek', [
        'bookings' => $bookings,
        'user' => Auth::user(), // Por si necesitas mostrar datos del usuario
    ]);
    }
}
