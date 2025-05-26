<?php

namespace App\Http\Controllers;

use App\Models\AsignacionTarea;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PasanteController extends Controller
{
    public function index(Request $request)
    {
        $fechaHoy = Carbon::today()->toDateString();
        $userId = Auth::id();

        $query = AsignacionTarea::with([

            'tarea.tipo:id,nombre_tipo',
            'tarea.company:id,name' // ⚠️ nos aseguramos de solo traer lo necesario
        ])
            ->where('user_id', $userId)
            ->whereDate('fecha', $fechaHoy);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('tarea', function ($q) use ($search) {
                $q->where('titulo', 'like', "%$search%");
            });
        }

        // Agrupamos por prioridad (usamos strtolower para normalizar)
        $tareas = $query->get()->groupBy(fn($item) => strtolower($item->tarea->prioridad));

        return Inertia::render('pasante/index', [
            'tareas' => $tareas,
            'filters' => $request->only('search'),
        ]);
    }



    public function historial(Request $request)
    {
        $userId = Auth::id();

        $query = AsignacionTarea::with(['tarea.tipo', 'tarea.company'])
            ->where('user_id', $userId)
            ->orderBy('fecha', 'desc');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('tarea', function ($q) use ($search) {
                $q->where('titulo', 'like', "%$search%");
            });
        }

        $asignaciones = $query->paginate(10)->withQueryString();

        return Inertia::render('pasante/historial', [
            'asignaciones' => $asignaciones,
            'filters' => $request->only('search'),
        ]);
    }
    public function actualizarEstado(Request $request, $tareaId)
    {
        $request->validate([
            'estado' => 'required|string|max:255',
            'detalle' => 'nullable|string',
        ]);

        $userId = Auth::id();

        $asignacion = AsignacionTarea::where('tarea_id', $tareaId)
            ->where('user_id', $userId)
            ->first();

        if (!$asignacion) {
            return response()->json([
                'message' => 'Tarea no encontrada o no autorizada.'
            ], 404);
        }

        $asignacion->update([
            'estado' => $request->input('estado'),
            'detalle' => $request->input('detalle'),
        ]);

        return response()->json([
            'message' => 'Tarea actualizada correctamente.',
            'data' => $asignacion
        ]);
    }
}
