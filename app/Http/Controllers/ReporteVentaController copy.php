<?php

namespace App\Http\Controllers;

use App\Models\ReporteVenta;
use App\Models\ActividadRealizada;
use App\Models\EstrategiaUtilizada;
use App\Models\ResultadoEquipo;
use App\Models\Dificultad;
use App\Models\MetaSiguiente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReporteVentaController extends Controller
{
    public function index()
    {
        $reportes = ReporteVenta::withCount([
            'actividades', 'estrategias', 'resultados', 'dificultades', 'metas'
        ])
        ->where('jefe_ventas_id', Auth::id())
        ->orderByDesc('created_at')
        ->get();

        return Inertia::render('Reportes/Index', [
            'reportes' => $reportes
        ]);
    }

    public function create()
    {
        return Inertia::render('Reportes/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo_periodo' => 'required|in:diario,semanal,mensual',
            'fecha_reporte' => 'nullable|date',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'observaciones' => 'nullable|string',
            'recomendaciones' => 'nullable|string',

            'actividades' => 'array',
            'estrategias' => 'array',
            'resultados' => 'array',
            'dificultades' => 'array',
            'metas' => 'array',
        ]);

        DB::transaction(function () use ($request, $data) {
            $reporte = ReporteVenta::create([
                'jefe_ventas_id' => Auth::id(),
                'tipo_periodo' => $data['tipo_periodo'],
                'fecha_reporte' => $data['fecha_reporte'] ?? now()->toDateString(),
                'fecha_inicio' => $data['fecha_inicio'],
                'fecha_fin' => $data['fecha_fin'],
                'observaciones' => $data['observaciones'] ?? null,
                'recomendaciones' => $data['recomendaciones'] ?? null,
            ]);

            foreach ($request->actividades ?? [] as $actividad) {
                $reporte->actividades()->create($actividad);
            }

            foreach ($request->estrategias ?? [] as $estrategia) {
                $reporte->estrategias()->create($estrategia);
            }

            foreach ($request->resultados ?? [] as $resultado) {
                $reporte->resultados()->create($resultado);
            }

            foreach ($request->dificultades ?? [] as $dificultad) {
                $reporte->dificultades()->create($dificultad);
            }

            foreach ($request->metas ?? [] as $meta) {
                $reporte->metas()->create($meta);
            }
        });

        return redirect()->route('reportes.index')->with('success', 'Reporte creado con éxito.');
    }
}
