<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Company;
use App\Models\TareaSeguimiento;
use App\Models\Week;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class EditorController extends Controller
{
    
    public function tareasSemanaActual()
    {
        $user = auth()->user();
        $hoy = Carbon::today();
        $inicioSemana = $hoy->copy()->startOfWeek(); // Lunes
        $finSemana = $hoy->copy()->endOfWeek(); // Domingo

        // Obtener tareas con empresa
        $tareas = TareaSeguimiento::with(['empresa'])
            ->where('user_edicion_id', $user->id)
            ->whereBetween('fecha_edicion', [$inicioSemana, $finSemana])
            ->orderBy('fecha_edicion')
            ->get();

        // Obtener bookings de influencers agrupados por empresa_id + fecha
        $bookings = Booking::with('user')
            ->whereBetween('start_time', [$inicioSemana, $finSemana])
            ->get()
            ->groupBy(function ($booking) {
                return $booking->company_id . '_' . Carbon::parse($booking->start_time)->format('Y-m-d');
            });

        // Agregar los influencers correspondientes a cada tarea
        foreach ($tareas as $tarea) {
            $key = $tarea->empresa->id . '_' . Carbon::parse($tarea->fecha_edicion)->format('Y-m-d');
            $tarea->influencers = $bookings[$key] ?? collect(); // colección de bookings
        }

        // Agrupar tareas por fecha
        $tareasAgrupadas = $tareas->groupBy(function ($tarea) {
            return Carbon::parse($tarea->fecha_edicion)->format('Y-m-d');
        });

        return inertia('Editor/TareasSemana', [
            'tareas' => $tareasAgrupadas,
        ]);
    }
    public function tareasHoy()
    {
        $user = auth()->user();
        $hoy = Carbon::today()->format('Y-m-d');

        // Tareas asignadas al camarógrafo para hoy
        $tareas = TareaSeguimiento::with(['empresa'])
            ->where('user_edicion_id', $user->id)
            ->whereDate('fecha_edicion', $hoy)
            ->orderBy('fecha_edicion')
            ->get();

        // Bookings de influencers para hoy
        $bookings = Booking::with('user')
            ->whereDate('start_time', $hoy)
            ->get()
            ->groupBy(function ($booking) {
                return $booking->company_id . '_' . Carbon::parse($booking->start_time)->format('Y-m-d');
            });

        // Asociar influencers a cada tarea
        foreach ($tareas as $tarea) {
            $key = $tarea->empresa->id . '_' . $tarea->fecha_edicion;
            $tarea->influencers = $bookings[$key] ?? collect();
        }

        return Inertia::render('Editor/TareasHoy', [
            'tareas' => $tareas,
            'hoy' => $hoy,
        ]);
    }


    public function marcarComoCompletada($id)
    {
        $tarea = TareaSeguimiento::findOrFail($id);
        $tarea->estado_edicion = 'revision';
        $tarea->save();

        return redirect()->back()->with('success', 'Tarea marcada para revision.');
    }
    
}
