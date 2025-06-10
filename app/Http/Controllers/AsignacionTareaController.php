<?php
// app/Http/Controllers/AsignacionTareaController.php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AsignacionTarea;
use App\Models\Company;
use App\Models\Tarea;
use App\Models\Tipo;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AsignacionTareaController extends Controller
{
    public function index()
    {
        // Carga todas las tareas con tipo, empresa y asignaciones → user
    $tareas = Tarea::with(['tipo', 'company', 'asignaciones.user'])->get();

    // Opcional: si necesitas la lista de tipos y empresas
    $tipos     = Tipo::all(['id','nombre']);
    $empresas  = Company::all(['id','nombre']);

        // Trae todas las asignaciones con usuario y tarea
        $asignaciones = AsignacionTarea::with(['user', 'tarea'])->get();

        // Renderiza Inertia y pasa los datos como prop
        return Inertia::render('asignaciones/asignacioneslist', [
            'asignaciones' => $asignaciones,
            'tareas'    => $tareas,
        'tipos'     => $tipos,
        'empresas'  => $empresas,
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
        'estado'   => ['required', Rule::in(['pendiente', 'en_revision', 'publicada'])],
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

    // app/Http/Controllers/AsignacionTareaController.php

public function update(Request $request, AsignacionTarea $asignacion)
{
    $data = $request->validate([
        // Validamos 'estado' solo si viene en la petición
        'estado'  => ['sometimes', 'required', Rule::in(['pendiente', 'en_revision', 'publicada'])],
        // Validamos 'detalle' solo si viene en la petición
        'detalle' => ['sometimes', 'nullable', 'string'],
    ]);

    // Con esto, $data tendrá solo las claves que se enviaron. 
    // Actualizamos solo los campos remitidos por el front-end.
    $asignacion->update($data);

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

    // -- aquí creas la variable --
    $todasTareas = Tarea::select('id','titulo')->get();

    return Inertia::render('tareas/fecha', [
        'fecha'           => $fecha,
        'tareasAsignadas' => $tareasAsignadas,
        'todasTareas'     => $todasTareas,
    ]);
}


}
