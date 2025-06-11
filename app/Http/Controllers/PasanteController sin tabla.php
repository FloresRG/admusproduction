<?php

namespace App\Http\Controllers;

use App\Models\AsignacionTarea;
use App\Models\User;
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
    public function actualizarEstadoa(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|string|max:255',
            'detalle' => 'nullable|string',
        ]);

        $userId = Auth::id();

        $asignacion = AsignacionTarea::where('id', $id)
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
    public function getPasantes()
    {
        $pasantes = User::role('pasante')
            ->select('id', 'name', 'email')
            ->with(['roles:id,name'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pasantes
        ]);
    }
    public function mistareas(Request $request)
{
    $userId = Auth::id();

    $tareas = AsignacionTarea::with([
        'tarea' => function ($query) {
            $query->select('id', 'titulo', 'descripcion', 'prioridad', 'fecha', 'company_id', 'tipo_id');
        },
        'tarea.tipo' => function ($query) {
            $query->select('id', 'nombre_tipo');
        },
        'tarea.company' => function ($query) {
            $query->select('id', 'name', 'ubicacion', 'direccion');
        }
    ])
        ->where('user_id', $userId)
        ->orderBy('fecha', 'desc')
        ->get();

    return Inertia::render('pasante/mistareas', [
        'tareas' => $tareas,
    ]);
}
    public function actualizarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|string|in:completada,en progreso,pendiente',
            'detalle' => 'nullable|string|max:500',
        ]);

        $asignacion = AsignacionTarea::findOrFail($id);

        if ($asignacion->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'No autorizado'
            ], 403);
        }

        $asignacion->update([
            'estado' => $request->estado,
            'detalle' => $request->detalle,
        ]);

        return response()->json([
            'message' => 'Actualización exitosa',
            'asignacion' => $asignacion
        ]);
    }
}
