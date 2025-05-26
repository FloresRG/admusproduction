<?php
// app/Http/Controllers/AsignacionTareaController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request; 
use Inertia\Inertia;
use App\Models\AsignacionTarea;
use App\Models\Tarea;
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
        $tareasAsignadas = AsignacionTarea::with('tarea','user')
            ->whereDate('fecha', $fecha)
            ->get();

        // Lista de todas las posibles tareas (para el dropdown)
        $todasTareas = Tarea::select('id','titulo')->get();

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

}
