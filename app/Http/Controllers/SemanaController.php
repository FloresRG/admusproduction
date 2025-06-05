<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Company;
use App\Models\Tarea;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function indexinfluencer()
    {
        // días de semana
        $hoy = Carbon::now();
        $inicioSemana = $hoy->copy()->startOfWeek(Carbon::MONDAY);
        $diasSemana = [];

        for ($i = 0; $i < 6; $i++) {
            $fecha = $inicioSemana->copy()->addDays($i);
            $diasSemana[] = [
                'nombre' => strtolower($fecha->englishDayOfWeek),
                'fecha' => $fecha->format('Y-m-d'),
            ];
        }

        // empresas + disponibilidad
        $empresas = Company::with('availabilityDays')->get();

        $datosPorEmpresa = $empresas->map(function ($empresa) {
            $disponibilidad = [];

            foreach ($empresa->availabilityDays as $availability) {
                $day = strtolower($availability->day_of_week);
                $turno = strtolower($availability->turno);

                if (!isset($disponibilidad[$day])) {
                    $disponibilidad[$day] = [];
                }

                $disponibilidad[$day][] = $turno;
            }

            return [
                'empresa' => [
                    'id' => $empresa->id,
                    'name' => $empresa->name,
                ],
                'disponibilidad' => $disponibilidad,
            ];
        });

        // obtener usuarios con rol de influencer
        $influencers = User::role('influencer')->select('id', 'name')->get();

        return Inertia::render('Semana/influencer', [
            'datosPorEmpresa' => $datosPorEmpresa,
            'diasSemana' => $diasSemana,
            'influencers' => $influencers,
        ]);
    }
    public function asignarInfluencer(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:companies,id',
            'dia' => 'required|string',
            'turno' => 'required|string', // 'mañana' o 'tarde'
            'influencer_id' => 'required|exists:users,id',
        ]);

        // Determinar fecha a partir del día de la semana
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $dias = [
            'monday' => 0,
            'tuesday' => 1,
            'wednesday' => 2,
            'thursday' => 3,
            'friday' => 4,
            'saturday' => 5,
            'sunday' => 6,
        ];

        $diaOffset = $dias[$validated['dia']] ?? 0;
        $fecha = $startOfWeek->copy()->addDays($diaOffset);

        // Simular horarios
        $startTime = $validated['turno'] === 'mañana' ? '09:00:00' : '14:00:00';
        $endTime = $validated['turno'] === 'mañana' ? '13:00:00' : '18:00:00';

        // Aquí podrías obtener la `week_id` si la manejas aparte
        $weekId = 11; // Asigna el ID de la semana si es necesario

        Booking::create([
            'company_id'   => $validated['empresa_id'],
            'user_id'      => $validated['influencer_id'],
            'start_time'   => $fecha->format("Y-m-d") . " " . $startTime,
            'end_time'     => $fecha->format("Y-m-d") . " " . $endTime,
            'status'       => 'pendiente', // o confirmado, según tu lógica
            'turno'        => $validated['turno'],
            'week_id'      => $weekId,
            'day_of_week'  => $validated['dia'],
        ]);

        return back()->with('success', 'Influencer asignado exitosamente.');
    }
}
