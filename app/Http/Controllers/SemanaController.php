<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Company;
use App\Models\Tarea;
use App\Models\User;
use App\Models\Week;
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
        $hoy = Carbon::now();
        $inicioSemana = $hoy->copy()->startOfWeek(Carbon::MONDAY);
        $finSemana = $hoy->copy()->endOfWeek(Carbon::SUNDAY);

        // Obtener o crear la semana actual
        $week = Week::where('start_date', $inicioSemana->toDateString())
            ->where('end_date', $finSemana->toDateString())
            ->first();

        if (!$week) {
            $week = Week::create([
                'name' => 'Semana del ' . $inicioSemana->format('d/m/Y'),
                'start_date' => $inicioSemana->toDateString(),
                'end_date' => $finSemana->toDateString(),
            ]);
        }

        $weekId = $week->id;

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

        // Influencers con disponibilidad
        $influencers = User::role('influencer')
            ->with('availabilities')
            ->select('id', 'name')
            ->get();

        // Bookings de toda la semana (usado para validaciones cruzadas)
        $bookingsSemana = Booking::where('week_id', $weekId)->get();

        $datosPorEmpresa = $empresas->map(function ($empresa) use ($influencers, $weekId, $bookingsSemana) {
            // Bookings de esta empresa en la semana
            $bookings = $bookingsSemana->where('company_id', $empresa->id);

            $disponibilidadEmpresa = [];
            $influencersDisponibles = [];
            $influencersAsignados = [];

            foreach ($empresa->availabilityDays as $availability) {
                $day = strtolower($availability->day_of_week);
                $turno = strtolower($availability->turno);

                if (!isset($disponibilidadEmpresa[$day])) {
                    $disponibilidadEmpresa[$day] = [];
                }

                $disponibilidadEmpresa[$day][] = $turno;

                $coincidentes = $influencers->filter(function ($influencer) use ($day, $turno, $bookings, $bookingsSemana, $empresa) {
                    // Verifica si ya está asignado en esta empresa, día y turno
                    $yaAsignadoEstaEmpresa = $bookings->contains(function ($b) use ($influencer, $day, $turno) {
                        return $b->user_id === $influencer->id &&
                            strtolower($b->day_of_week) === $day &&
                            strtolower($b->turno) === $turno;
                    });

                    // Verifica si está asignado en otra empresa con mismo día y turno
                    $yaAsignadoOtraEmpresa = $bookingsSemana->contains(function ($b) use ($influencer, $day, $turno, $empresa) {
                        return $b->user_id === $influencer->id &&
                            strtolower($b->day_of_week) === $day &&
                            strtolower($b->turno) === $turno &&
                            $b->company_id !== $empresa->id;
                    });

                    // Solo incluir si tiene disponibilidad, no está asignado en esta empresa, y no está asignado en otra empresa en mismo día y turno
                    return !$yaAsignadoEstaEmpresa && !$yaAsignadoOtraEmpresa && $influencer->availabilities->contains(function ($a) use ($day, $turno) {
                        return strtolower($a->day_of_week) === $day &&
                            strtolower($a->turno) === $turno;
                    });
                })->map(fn($i) => ['id' => $i->id, 'name' => $i->name])->values();

                $influencersDisponibles[$day][$turno] = $coincidentes;

                $asignados = $bookings->filter(function ($b) use ($day, $turno) {
                    return strtolower($b->day_of_week) === $day && strtolower($b->turno) === $turno;
                })->map(fn($b) => [
                    'id' => $b->user_id,
                    'name' => optional($b->user)->name,
                ])->values();

                $influencersAsignados[$day][$turno] = $asignados;
            }

            return [
                'empresa' => [
                    'id' => $empresa->id,
                    'name' => $empresa->name,
                ],
                'disponibilidad' => $disponibilidadEmpresa,
                'influencersDisponibles' => $influencersDisponibles,
                'influencersAsignados' => $influencersAsignados,
            ];
        });

        return Inertia::render('Semana/influencer', [
            'datosPorEmpresa' => $datosPorEmpresa,
            'diasSemana' => $diasSemana,
        ]);
    }


    public function asignarInfluencer(Request $request)
    {
        // Validar datos de entrada
        $validated = $request->validate([
            'empresa_id' => 'required|exists:companies,id',
            'dia' => 'required|string',
            'turno' => 'required|string', // 'mañana' o 'tarde'
            'influencer_id' => 'required|exists:users,id',
        ]);

        // Calcular inicio y fin de la semana actual
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY);

        // Buscar o crear la semana actual
        $week = Week::where('start_date', $startOfWeek->toDateString())
            ->where('end_date', $endOfWeek->toDateString())
            ->first();

        if (!$week) {
            $week = Week::create([
                'name' => 'Semana del ' . $startOfWeek->format('d/m/Y'),
                'start_date' => $startOfWeek->toDateString(),
                'end_date' => $endOfWeek->toDateString(),
            ]);
        }

        $weekId = $week->id;

        // Calcular fecha del día de la semana indicado
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

        // Definir hora de inicio y fin según turno
        $startTime = $validated['turno'] === 'mañana' ? '09:00:00' : '14:00:00';
        $endTime = $validated['turno'] === 'mañana' ? '13:00:00' : '18:00:00';

        // Crear la reserva
        Booking::create([
            'company_id'   => $validated['empresa_id'],
            'user_id'      => $validated['influencer_id'],
            'start_time'   => $fecha->format("Y-m-d") . " " . $startTime,
            'end_time'     => $fecha->format("Y-m-d") . " " . $endTime,
            'status'       => 'pendiente', // Puedes ajustar según lógica de negocio
            'turno'        => $validated['turno'],
            'week_id'      => $weekId,
            'day_of_week'  => strtolower($validated['dia']),
        ]);

        return back()->with('success', 'Influencer asignado exitosamente.');
    }
    public function quitarInfluencer(Request $request)
    {
        // Validar datos de entrada
        $validated = $request->validate([
            'empresa_id' => 'required|exists:companies,id',
            'dia' => 'required|string',
            'turno' => 'required|string', // 'mañana' o 'tarde'
            'influencer_id' => 'required|exists:users,id',
        ]);

        // Calcular inicio y fin de la semana actual
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY);

        // Buscar la semana actual
        $week = Week::where('start_date', $startOfWeek->toDateString())
            ->where('end_date', $endOfWeek->toDateString())
            ->first();

        if (!$week) {
            return back()->withErrors(['error' => 'No se encontró la semana actual']);
        }

        $weekId = $week->id;

        // Calcular el día de la semana (offset)
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

        // Definir hora de inicio y fin según turno
        $startTime = $validated['turno'] === 'mañana' ? '09:00:00' : '14:00:00';
        $endTime = $validated['turno'] === 'mañana' ? '13:00:00' : '18:00:00';

        // Buscar la reserva para eliminar
        $booking = Booking::where('company_id', $validated['empresa_id'])
            ->where('user_id', $validated['influencer_id'])
            ->where('week_id', $weekId)
            ->where('day_of_week', strtolower($validated['dia']))
            ->where('turno', strtolower($validated['turno']))
            ->where('start_time', $fecha->format("Y-m-d") . " " . $startTime)
            ->where('end_time', $fecha->format("Y-m-d") . " " . $endTime)
            ->first();

        if (!$booking) {
            return back()->withErrors(['error' => 'No se encontró la asignación para eliminar']);
        }

        // Eliminar la reserva
        $booking->delete();

        return back()->with('success', 'Influencer removido exitosamente.');
    }
}
