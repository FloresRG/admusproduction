<?php

namespace App\Http\Controllers;

use App\Models\AsignacionPasante;
use App\Models\Company;
use App\Models\User;
use App\Models\Week;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SemanaPasantesController extends Controller
{
    public function index(Request $request)
    {
        $weekId = $request->query('week_id');

        // Si viene el ID, lo usamos; si no, se usa la semana actual
        if ($weekId) {
            $week = Week::findOrFail($weekId);
            $inicioSemana = Carbon::parse($week->start_date);
            $finSemana = Carbon::parse($week->end_date);
        } else {
            // Semana actual por defecto
            $hoy = Carbon::now();
            $inicioSemana = $hoy->copy()->startOfWeek(Carbon::MONDAY);
            $finSemana = $hoy->copy()->endOfWeek(Carbon::SUNDAY);

            $week = Week::firstOrCreate(
                ['start_date' => $inicioSemana->toDateString(), 'end_date' => $finSemana->toDateString()],
                ['name' => 'Semana del ' . $inicioSemana->format('d/m/Y')]
            );
            $weekId = $week->id;
        }

        // Preparar días de la semana para mostrar
        $diasSemana = [];
        for ($i = 0; $i < 6; $i++) {
            $fecha = $inicioSemana->copy()->addDays($i);
            $diasSemana[] = [
                'nombre' => strtolower($fecha->englishDayOfWeek),
                'fecha' => $fecha->format('Y-m-d'),
            ];
        }

        // Empresas con disponibilidad
        $empresas = Company::with('availabilityDays')->get();

        // Pasantes con tipo "grabacion"
        $pasantes = User::role('pasante')
            ->select('id', 'name')
            ->get();

        // Asignaciones de toda la semana
        $asignacionesSemana = AsignacionPasante::where('week_id', $weekId)->with('user')->get();

        $datosPorEmpresa = $empresas->map(function ($empresa) use ($pasantes, $weekId, $asignacionesSemana) {
            // Asignaciones de esta empresa en la semana
            $asignaciones = $asignacionesSemana->where('company_id', $empresa->id);

            $disponibilidadEmpresa = [];
            $pasantesDisponibles = [];
            $pasantesAsignados = [];

            foreach ($empresa->availabilityDays as $availability) {
                $day = strtolower($availability->day_of_week);
                $turno = strtolower($availability->turno);

                if (!isset($disponibilidadEmpresa[$day])) {
                    $disponibilidadEmpresa[$day] = [];
                }

                $disponibilidadEmpresa[$day][] = $turno;

                // Incluir también turno "noche" si es necesario
                if (!in_array('noche', $disponibilidadEmpresa[$day])) {
                    $disponibilidadEmpresa[$day][] = 'noche';
                }

                $turnos = ['mañana', 'tarde', 'noche'];

                foreach ($turnos as $turnoActual) {
                    $coincidentes = $pasantes->filter(function ($pasante) use ($day, $turnoActual, $asignaciones, $asignacionesSemana, $empresa) {
                        // Verifica si ya está asignado en esta empresa, día y turno
                        $yaAsignadoEstaEmpresa = $asignaciones->contains(function ($a) use ($pasante, $day, $turnoActual) {
                            return $a->user_id === $pasante->id &&
                                strtolower($a->day_of_week) === $day &&
                                strtolower($a->turno) === $turnoActual;
                        });

                        // Verifica si está asignado en otra empresa con mismo día y turno
                        $yaAsignadoOtraEmpresa = $asignacionesSemana->contains(function ($a) use ($pasante, $day, $turnoActual, $empresa) {
                            return $a->user_id === $pasante->id &&
                                strtolower($a->day_of_week) === $day &&
                                strtolower($a->turno) === $turnoActual &&
                                $a->company_id !== $empresa->id;
                        });

                        // Verificar disponibilidad del pasante
                        $tieneDisponibilidad = $pasante->availabilities->contains(function ($avail) use ($day, $turnoActual) {
                            return strtolower($avail->day_of_week) === $day &&
                                strtolower($avail->turno) === $turnoActual;
                        });

                        return !$yaAsignadoEstaEmpresa && !$yaAsignadoOtraEmpresa && $tieneDisponibilidad;
                    })->map(fn($p) => ['id' => $p->id, 'name' => $p->name])->values();

                    $pasantesDisponibles[$day][$turnoActual] = $coincidentes;

                    $asignados = $asignaciones->filter(function ($a) use ($day, $turnoActual) {
                        return strtolower($a->day_of_week) === $day && strtolower($a->turno) === $turnoActual;
                    })->map(fn($a) => [
                        'id' => $a->user_id,
                        'name' => optional($a->user)->name,
                    ])->values();

                    $pasantesAsignados[$day][$turnoActual] = $asignados;
                }
            }

            return [
                'empresa' => [
                    'id' => $empresa->id,
                    'name' => $empresa->name,
                ],
                'disponibilidad' => $disponibilidadEmpresa,
                'pasantesDisponibles' => $pasantesDisponibles,
                'pasantesAsignados' => $pasantesAsignados,
            ];
        });

        return Inertia::render('Semana/pasante', [
            'datosPorEmpresa' => $datosPorEmpresa,
            'diasSemana' => $diasSemana,
            'pasantes' => $pasantes,
            'week' => $week,
        ]);
    }

    public function asignarPasante(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:companies,id',
            'dia' => 'required|string',
            'turno' => 'required|string|in:mañana,tarde,noche',
            'pasante_id' => 'required|exists:users,id',
        ]);

        // Obtener semana actual (de lunes a domingo)
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY);

        // Buscar o crear semana
        $week = Week::firstOrCreate(
            ['start_date' => $startOfWeek->toDateString(), 'end_date' => $endOfWeek->toDateString()],
            ['name' => 'Semana del ' . $startOfWeek->format('d/m/Y')]
        );

        $dias = [
            'monday' => 0,
            'tuesday' => 1,
            'wednesday' => 2,
            'thursday' => 3,
            'friday' => 4,
            'saturday' => 5,
            'sunday' => 6,
        ];

        $diaOffset = $dias[strtolower($validated['dia'])] ?? 0;
        $fecha = $startOfWeek->copy()->addDays($diaOffset);

        // Validar si ya está asignado ese pasante en el mismo turno y día
        $existe = AsignacionPasante::where([
            ['user_id', $validated['pasante_id']],
            ['day_of_week', strtolower($validated['dia'])],
            ['turno', $validated['turno']],
            ['week_id', $week->id],
        ])->exists();

        if ($existe) {
            return response()->json(['message' => 'El pasante ya está asignado ese día y turno.'], 422);
        }

        // Crear asignación
        AsignacionPasante::create([
            'company_id'   => $validated['empresa_id'],
            'user_id'      => $validated['pasante_id'],
            'turno'        => $validated['turno'],
            'fecha'        => $fecha->toDateString(),
            'week_id'      => $week->id,
            'day_of_week'  => strtolower($validated['dia']),
        ]);

        return response()->json(['message' => 'Pasante asignado exitosamente.']);
    }


    /* public function quitarPasante(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:companies,id',
            'dia' => 'required|string',
            'turno' => 'required|string|in:mañana,tarde,noche',
            'pasante_id' => 'required|exists:users,id',
        ]);

        // Calcular inicio y fin de la semana actual
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY);

        // Buscar la semana actual
        $week = Week::where('start_date', $startOfWeek->toDateString())
            ->where('end_date', $endOfWeek->toDateString())
            ->first();

        if (!$week) {
            return response()->json(['error' => 'No se encontró la semana actual'], 404);
        }

        $weekId = $week->id;

        // Buscar la asignación para eliminar
        $asignacion = AsignacionPasante::where('company_id', $validated['empresa_id'])
            ->where('user_id', $validated['pasante_id'])
            ->where('week_id', $weekId)
            ->where('day_of_week', strtolower($validated['dia']))
            ->where('turno', strtolower($validated['turno']))
            ->first();

        if (!$asignacion) {
            return response()->json(['error' => 'No se encontró la asignación para eliminar'], 404);
        }

        $asignacion->delete();

        return response()->json(['message' => 'Pasante removido exitosamente.']);
    } */
    public function quitarPasante(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:companies,id',
            'pasante_id' => 'required|exists:users,id',
            'dia' => 'required|string',
            'turno' => 'required|string|in:mañana,tarde,noche',
        ]);

        // Obtener semana actual
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY);

        $week = Week::where('start_date', $startOfWeek->toDateString())
            ->where('end_date', $endOfWeek->toDateString())
            ->first();

        if (!$week) {
            return response()->json(['message' => 'Semana no encontrada.'], 404);
        }

        // Eliminar asignación
        AsignacionPasante::where([
            'company_id' => $validated['empresa_id'],
            'user_id' => $validated['pasante_id'],
            'day_of_week' => strtolower($validated['dia']),
            'turno' => $validated['turno'],
            'week_id' => $week->id,
        ])->delete();

        return response()->json(['message' => 'Pasante eliminado correctamente.']);
    }


    public function asignarEmpresasMasivamente()
    {
        // Implementar lógica de asignación masiva similar a la de influencers
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY);

        $week = Week::firstOrCreate(
            ['start_date' => $startOfWeek->toDateString(), 'end_date' => $endOfWeek->toDateString()],
            ['name' => 'Semana del ' . $startOfWeek->format('d/m/Y')]
        );

        // Aquí puedes implementar la lógica de asignación automática
        return response()->json(['message' => 'Asignación masiva completada']);
    }
}
