<?php
// app/Http/Controllers/AsignacionTareaController.php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AsignacionTarea;
use App\Models\Tarea;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AsignacionTareaController extends Controller
{
    public function index()
    {
        // Trae todas las asignaciones con usuario y tarea
        $asignaciones = AsignacionTarea::with(['user', 'tarea'])->get();

        // Renderiza Inertia y pasa los datos como prop
        return Inertia::render('asignaciones/asignacioneslist', [
            'asignaciones' => $asignaciones,
        ]);
    }
    public function datesIndex()
    {
        // Trae los días distintos ordenados de más reciente a más antiguo
        $fechas = AsignacionTarea::select('fecha')
            ->distinct()
            ->orderBy('fecha', 'desc')
            ->pluck('fecha')
            ->map(fn($f) => \Carbon\Carbon::parse($f)->format('Y-m-d'));

        return Inertia::render('asignaciones/fechaslist', [
            'fechas' => $fechas,
        ]);
    }

    // 2️⃣ Tareas de una fecha concreta
    public function showByFecha($fecha)
    {
        $tareasAsignadas = AsignacionTarea::with('tarea', 'user')
            ->whereDate('fecha', $fecha)
            ->get();

        // Lista de todas las posibles tareas (para el dropdown)
        $todasTareas = Tarea::select('id', 'titulo')->get();

        return Inertia::render('asignaciones/tareasporfecha', [
            'fecha'           => $fecha,
            'tareasAsignadas' => $tareasAsignadas,
            'todasTareas'     => $todasTareas,
        ]);
    }

    public function store(Request $request, $fecha, User $user)
    {
        $data = $request->validate([
            'tarea_id' => 'required|exists:tareas,id',
            'estado'   => 'required|string',
            'detalle'  => 'nullable|string',
        ]);

        AsignacionTarea::create([
            'user_id'  => $user->id,
            'tarea_id' => $data['tarea_id'],
            'estado'   => $data['estado'],
            'detalle'  => $data['detalle'] ?? '',
            'fecha'    => $fecha,
        ]);

        return redirect()->back();
    }

    public function destroy(AsignacionTarea $asignacion)
    {
        $asignacion->delete();
        return redirect()->back();
    }

    public function update(Request $request, AsignacionTarea $asignacion)
    {
        $data = $request->validate([
            'estado' => ['required', Rule::in(['pendiente', 'en_proceso', 'completada'])],
        ]);

        $asignacion->update(['estado' => $data['estado']]);

        // Si vienes de Inertia, mejor devolver un redirect back manteniendo props
        return back();
    }

    /**
     * Lista las fechas en que el usuario autenticado tiene asignaciones.
     */
    public function myDatesIndex()
    {
        $userId = Auth::id();

        $fechas = AsignacionTarea::query()
            ->where('user_id', $userId)
            ->select('fecha')
            ->distinct()
            ->orderBy('fecha', 'desc')
            ->pluck('fecha')
            ->map(fn($f) => \Carbon\Carbon::parse($f)->format('Y-m-d'));

        return Inertia::render('asignaciones/misfechaslist', [
            'fechas' => $fechas,
        ]);
    }

    /**
     * Muestra sólo mis tareas para la fecha indicada.
     */
    public function myShowByFecha($fecha)
    {
        $userId = Auth::id();

        $tareasAsignadas = AsignacionTarea::with('tarea')
            ->where('user_id', $userId)
            ->whereDate('fecha', $fecha)
            ->get();

        // Opcional: si quieres permitir añadir nuevas tareas a ti mismo,
        // carga también el listado de Tarea para el dropdown:
        $todasTareas = Tarea::select('id', 'titulo')->get();

        return Inertia::render('asignaciones/mistareasporfecha', [
            'fecha'           => $fecha,
            'tareasAsignadas' => $tareasAsignadas,
            'todasTareas'     => $todasTareas,
        ]);
    }
}
