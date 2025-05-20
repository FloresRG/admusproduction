<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Week;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeekController extends Controller
{
    /**
     * Mostrar todas las semanas (Inertia.js)
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $weeks = Week::where('name', 'like', '%' . $search . '%')
            ->orWhere('start_date', 'like', '%' . $search . '%')
            ->orWhere('end_date', 'like', '%' . $search . '%')
            ->paginate(10); // Paginación de 10 por página

        return Inertia::render('weeks/Index', [
            'weeks' => $weeks,
            'search' => $search
        ]);
    }
    /**
     * Crear una nueva semana
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $week = Week::create($request->all());

        return response()->json([
            'message' => 'Semana creada con éxito',
            'week' => $week,
        ], 201);
    }

    /**
     * Actualizar una semana
     *
     * @param Request $request
     * @param Week $week
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Week $week)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $week->update($request->all());

        return response()->json([
            'message' => 'Semana actualizada con éxito',
            'week' => $week,
        ]);
    }

    /**
     * Eliminar una semana
     *
     * @param Week $week
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Week $week)
    {
        $week->delete();

        return response()->json([
            'message' => 'Semana eliminada con éxito',
        ]);
    }
    public function bookingsByWeek($id)
    {
        $week = Week::with(['bookings.user', 'bookings.company'])
        ->findOrFail($id);

       // Carga las compañías y sus availabilityDays
    $companies = Company::with('availabilityDays')->get()
        ->map(fn($c) => [
            'id'               => $c->id,
            'name'             => $c->name,
            // entregamos SOLO lo que necesitamos en el frontend
            'availabilityDays' => $c->availabilityDays->map(fn($d) => [
                'day_of_week' => $d->day_of_week,
                'turno'       => $d->turno,
            ])->toArray(),
        ]);
        
        return Inertia::render('weeks/BookingsByWeek', [
            'week' => $week,
            'bookings' => $week->bookings,
            'companies' => $companies,        // <-- nuevo
        ]);
    }
  
}
