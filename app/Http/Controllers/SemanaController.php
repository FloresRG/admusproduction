<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SemanaController extends Controller
{
    
    public function index()
    {
        $hoy = Carbon::now();
        $inicioSemana = $hoy->copy()->startOfWeek(Carbon::MONDAY);
        $finSemana = $inicioSemana->copy()->addDays(5); // lunes a sábado

        $tareas = Tarea::with([
            'company',
            'tipo',
            'asignaciones.user' // traemos también el usuario asignado
        ])
            ->whereBetween('fecha', [$inicioSemana->toDateString(), $finSemana->toDateString()])
            ->orderBy('fecha')
            ->orderByRaw("FIELD(prioridad, 'alta', 'media', 'baja')")
            ->get();


        $datosPorEmpresa = [];

        foreach ($tareas as $tarea) {
            $empresaId = $tarea->company_id ?? 0;

            if (!isset($datosPorEmpresa[$empresaId])) {
                $datosPorEmpresa[$empresaId] = [
                    'empresa' => $tarea->company ?? ['id' => 0, 'nombre' => 'Sin empresa'],
                    'tareas' => [],
                ];
            }

            $fecha = $tarea->fecha;
            if (!isset($datosPorEmpresa[$empresaId]['tareas'][$fecha])) {
                $datosPorEmpresa[$empresaId]['tareas'][$fecha] = [];
            }

            $datosPorEmpresa[$empresaId]['tareas'][$fecha][] = $tarea;
        }

        return Inertia::render('Semana/Index', [
            'datosPorEmpresa' => array_values($datosPorEmpresa), // para evitar objetos asociativos
            'diasSemana' => collect(range(0, 5))->map(function ($i) use ($inicioSemana) {
                $dia = $inicioSemana->copy()->addDays($i);
                return [
                    'fecha' => $dia->toDateString(),
                    'nombre' => $dia->translatedFormat('l'), // nombre del día en español si tienes locales
                ];
            }),
        ]);
    }
}
