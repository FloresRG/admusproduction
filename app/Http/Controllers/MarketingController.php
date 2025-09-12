<?php

namespace App\Http\Controllers;

use App\Models\AsignacionTarea;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class MarketingController extends Controller
{
    public function tareaspublicadas(Request $request)
    {
        $perPage = 10;

        $query = AsignacionTarea::with([
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
            ->where('estado', 'publicada'); // Filter for pending tasks;


        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('tarea', function ($q) use ($search) {
                $q->where('titulo', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        // Filtro por prioridad
        if ($request->filled('priority')) {
            $query->whereHas('tarea', function ($q) use ($request) {
                $q->where('prioridad', $request->priority);
            });
        }

        // Filtro por estado
        if ($request->filled('status')) {
            $query->where('estado', $request->status);
        }

        // Filtro por tipo
        if ($request->filled('type')) {
            $query->whereHas('tarea.tipo', function ($q) use ($request) {
                $q->where('nombre_tipo', $request->type);
            });
        }

        $tareas = $query->orderBy('fecha', 'desc')->paginate($perPage);

        return response()->json([
            'tareas' => $tareas->items(),
            'total' => $tareas->total(),
            'perPage' => $perPage,
            'currentPage' => $tareas->currentPage(),
        ]);
    }
    public function tareaspendientes(Request $request)
    {
        $perPage = 10;

        $query = AsignacionTarea::with([
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
            ->where('estado', 'pendiente'); // Filter for pending tasks;

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('tarea', function ($q) use ($search) {
                $q->where('titulo', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        // Filtro por prioridad
        if ($request->filled('priority')) {
            $query->whereHas('tarea', function ($q) use ($request) {
                $q->where('prioridad', $request->priority);
            });
        }

        // Filtro por estado
        if ($request->filled('status')) {
            $query->where('estado', $request->status);
        }

        // Filtro por tipo
        if ($request->filled('type')) {
            $query->whereHas('tarea.tipo', function ($q) use ($request) {
                $q->where('nombre_tipo', $request->type);
            });
        }

        $tareas = $query->orderBy('fecha', 'desc')->paginate($perPage);

        return response()->json([
            'tareas' => $tareas->items(),
            'total' => $tareas->total(),
            'perPage' => $perPage,
            'currentPage' => $tareas->currentPage(),
        ]);
    }
}
