<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityDay;
use App\Models\Booking;
use App\Models\Company;
use App\Models\Dato;
use App\Models\InfluencerAvailability;
use App\Models\Tarea;
use App\Models\User;
use App\Models\Week;
use Carbon\Carbon;
use FPDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
    public function indexMensual()
    {
        $hoy = Carbon::now();
        $inicioMes = $hoy->copy()->startOfMonth();
        $finMes = $hoy->copy()->endOfMonth();

        // Traer todas las tareas del mes
        $tareas = Tarea::with(['company', 'tipo', 'asignaciones.user'])
            ->whereBetween('fecha', [$inicioMes->toDateString(), $finMes->toDateString()])
            ->orderBy('fecha')
            ->get();

        // Agrupar tareas por fecha y empresa
        $tareasPorDia = [];
        foreach ($tareas as $tarea) {
            $fecha = $tarea->fecha;
            $empresaId = $tarea->company_id ?? 0;

            if (!isset($tareasPorDia[$fecha])) {
                $tareasPorDia[$fecha] = [];
            }
            if (!isset($tareasPorDia[$fecha][$empresaId])) {
                $tareasPorDia[$fecha][$empresaId] = [
                    'empresa' => $tarea->company ?? ['id' => 0, 'name' => 'Sin empresa'],
                    'tareas' => [],
                ];
            }
            $tareasPorDia[$fecha][$empresaId]['tareas'][] = $tarea;
        }

        // Generar estructura de calendario mensual (semanas x días)
        $inicioCalendario = $inicioMes->copy()->startOfWeek(Carbon::SUNDAY);
        $finCalendario = $finMes->copy()->endOfWeek(Carbon::SATURDAY);

        $semanas = [];
        $semana = [];
        $dia = $inicioCalendario->copy();

        while ($dia->lte($finCalendario)) {
            $fecha = $dia->toDateString();
            $semana[] = [
                'fecha' => $fecha,
                'numero' => $dia->day,
                'esDelMes' => $dia->month === $inicioMes->month,
                'empresas' => $tareasPorDia[$fecha] ?? [],
            ];

            if ($dia->dayOfWeek === Carbon::SATURDAY) {
                $semanas[] = $semana;
                $semana = [];
            }

            $dia->addDay();
        }

        return Inertia::render('Semana/IndexMensual', [
            'semanas' => $semanas,
            'mes' => $inicioMes->translatedFormat('F Y'),
        ]);
    }
    public function indexinfluencer(Request $request)
    {
        $weekId = $request->query('week_id');

        // Si viene el ID, lo usamos; si no, se usa la semana actual
        if ($weekId) {
            $week = Week::findOrFail($weekId); // Lanza 404 si no existe
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
        $empresas = Company::with('availabilityDays')->where('estado', 'activo')->get();

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
                    'bookingId' => $b->id,
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
            'influencers' => $influencers,
            'week' => $week, // También podrías enviar el objeto semana
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
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
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
        $startTime = $validated['start_time'] ?? ($validated['turno'] === 'mañana' ? '09:00:00' : '14:00:00');
        $endTime = $validated['end_time'] ?? ($validated['turno'] === 'mañana' ? '13:00:00' : '18:00:00');

        // Crear la reserva
        Booking::create([
            'company_id'   => $validated['empresa_id'],
            'user_id'      => $validated['influencer_id'],
            'start_time'   => $fecha->format("Y-m-d") . " " . $startTime,
            'end_time'     => $fecha->format("Y-m-d") . " " . $endTime,
            'status'       => 'pendiente',
            'turno'        => $validated['turno'],
            'week_id'      => $weekId,
            'day_of_week'  => strtolower($validated['dia']),
        ]);
        return back()->with('success', 'Influencer asignado exitosamente.');
    }
    public function quitarInfluencer(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $booking = Booking::find($validated['booking_id']);

        if (!$booking) {
            return response()->json(['error' => 'No se encontró la reserva.'], 404);
        }

        $booking->delete();

        return response()->json(['message' => 'Influencer removido exitosamente.']);
    }
    public function generarPdfDisponibilidad()
    {
        $now = Carbon::now();

        $week = Week::whereDate('start_date', '<=', $now)
            ->whereDate('end_date', '>=', $now)
            ->first();

        if (!$week) {
            return response()->json(['error' => 'No se encontró la semana actual.'], 404);
        }

        $bookings = Booking::with(['company', 'user'])
            ->where('week_id', $week->id)
            ->orderBy('company_id')
            ->orderBy('day_of_week')
            ->orderBy('turno')
            ->get();

        if ($bookings->isEmpty()) {
            return response()->json(['error' => 'No hay asignaciones esta semana.'], 404);
        }

        $dias = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $diasTraducidos = [
            'monday' => 'Lunes',
            'tuesday' => 'Martes',
            'wednesday' => 'Miércoles',
            'thursday' => 'Jueves',
            'friday' => 'Viernes',
            'saturday' => 'Sábado',
        ];

        $calendario = [];
        foreach ($bookings as $booking) {
            $empresaNombre = $booking->company->name;
            $dia = strtolower($booking->day_of_week);
            $nombres = explode(' ', $booking->user->name);
            // Solo mostrar la primera palabra (primer nombre) del usuario
            $primerdosNombre = implode(' ', array_slice($nombres, 0, 2));
            $turnoAbreviado = '';
            $turno = strtolower($booking->turno);

            if ($turno === 'mañana') {
                $turnoAbreviado = 'M';
            } elseif ($turno === 'tarde') {
                $turnoAbreviado = 'T';
            } else {
                // Manejar otros casos o dejar en blanco si no es 'mañana' o 'tarde'
                $turnoAbreviado = ucfirst($booking->turno); // o solo '';
            }
            $influencer = $primerdosNombre . ' (' . $turnoAbreviado . ')';

            $calendario[$empresaNombre][$dia][] = $influencer;
        }

        $pdf = new \FPDF('L', 'mm', 'A4');

        $cellWidth = 38;
        $empresaWidth = 50;
        $lineHeight = 6.5;
        // Nueva constante para el límite de empresas por página
        $limitPerPage = 5;

        // Función para encabezado
        $agregarEncabezado = function () use ($pdf, $dias, $diasTraducidos, $week, $empresaWidth, $cellWidth) {
            $pdf->AddPage();
            $pdf->SetMargins(10, 10, 10);
            $pdf->Image(public_path('logo.jpeg'), 10, 10, 25);
            $pdf->Image(public_path('logo.jpeg'), 255, 10, 25);
            $pdf->SetFont('Arial', 'B', 16);
            $pdf->SetXY(0, 15);
            $pdf->Cell(0, 10, utf8_decode('ADMUS PRODUCTIONS'), 0, 1, 'C');

            $pdf->Ln(8);
            $pdf->SetFont('Arial', 'B', 18);
            // Gradiente azul más moderno
            $pdf->SetFillColor(25, 118, 210);
            $pdf->SetTextColor(255, 255, 255);
            $pdf->Cell(0, 14, utf8_decode('Disponibilidad Semanal por Empresa'), 0, 1, 'C', true);

            $pdf->SetFont('Arial', '', 12);
            $pdf->SetTextColor(0, 0, 0);
            $pdf->Cell(0, 10, utf8_decode('Semana: ' . $week->name), 0, 1, 'C');
            $pdf->Ln(4);

            // Encabezado de tabla con colores más modernos
            $pdf->SetFont('Arial', 'B', 10);
            // Color azul oscuro para el encabezado
            $pdf->SetFillColor(33, 150, 243);
            $pdf->SetTextColor(255, 255, 255);
            $pdf->Cell($empresaWidth, 10, utf8_decode('Empresa'), 1, 0, 'C', true);
            foreach ($dias as $dia) {
                $pdf->Cell($cellWidth, 10, utf8_decode($diasTraducidos[$dia]), 1, 0, 'C', true);
            }
            $pdf->Ln();
        };

        $agregarEncabezado();

        $empresaCount = 0;
        $pdf->SetFont('Arial', '', 9);

        foreach ($calendario as $empresaNombre => $diasData) {
            if ($empresaCount >= $limitPerPage) {
                $agregarEncabezado();
                $empresaCount = 0;
            }

            // Calcular altura máxima de fila
            $maxLines = 2;
            foreach ($dias as $dia) {
                $text = isset($diasData[$dia]) ? implode("\n", $diasData[$dia]) : '';
                $lines = substr_count($text, "\n") + 1;
                $maxLines = max($maxLines, $lines);
            }
            $rowHeight = $lineHeight * $maxLines;

            $yStart = $pdf->GetY();
            $xStart = $pdf->GetX();

            // Empresa con estilo mejorado
            // Fondo alternado para las filas
            $fillColor = ($empresaCount % 2 === 0) ? [245, 245, 245] : [255, 255, 255];
            $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
            $pdf->Rect($xStart, $yStart, $empresaWidth, $rowHeight, 'F');
            $pdf->Rect($xStart, $yStart, $empresaWidth, $rowHeight);

            // Texto de empresa en negrita y centrado
            $pdf->SetFont('Arial', 'B', 9);
            $pdf->SetTextColor(37, 37, 37);
            $pdf->SetXY($xStart, $yStart + ($rowHeight - 6.5) / 2);
            $pdf->Cell($empresaWidth, 6.5, utf8_decode($empresaNombre), 0, 0, 'C');
            $pdf->SetXY($xStart + $empresaWidth, $yStart);

            // Días con colores alternados
            $pdf->SetFont('Arial', '', 9);
            $pdf->SetTextColor(0, 0, 0);
            foreach ($dias as $dia) {
                $text = isset($diasData[$dia]) ? implode("\n", $diasData[$dia]) : '';
                $x = $pdf->GetX();
                $y = $pdf->GetY();

                // Aplica el mismo color de fondo alternado
                $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
                $pdf->Rect($x, $y, $cellWidth, $rowHeight, 'F');

                // Dibuja borde externo de la celda
                $pdf->SetDrawColor(180, 180, 180);
                $pdf->Rect($x, $y, $cellWidth, $rowHeight);

                // Escribe el texto sin bordes internos
                $pdf->MultiCell($cellWidth, $lineHeight, utf8_decode($text), 0, 'C');
                $pdf->SetXY($x + $cellWidth, $y);
            }

            $pdf->SetY($yStart + $rowHeight);
            $empresaCount++;
        }

        return response($pdf->Output('S', 'disponibilidad_semanal.pdf'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="disponibilidad_semanal.pdf"');
    }
    public function agregarDisponibilidadEmpresa(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'day_of_week' => 'required|string',
            'turno' => 'required|string',
        ]);

        // Puedes ajustar los valores por defecto de hora y cantidad según tu lógica
        $startTime = $validated['turno'] === 'mañana' ? '09:00:00' : '14:00:00';
        $endTime = $validated['turno'] === 'mañana' ? '13:00:00' : '18:00:00';

        $availability = \App\Models\AvailabilityDay::create([
            'company_id' => $validated['company_id'],
            'day_of_week' => strtolower($validated['day_of_week']),
            'turno' => strtolower($validated['turno']),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'cantidad' => 1, // o el valor que desees por defecto
        ]);

        return response()->json(['success' => true, 'availability' => $availability]);
    }
    public function quitarDisponibilidadEmpresa(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'day_of_week' => 'required|string',
            'turno' => 'required|string',
        ]);

        $deleted = \App\Models\AvailabilityDay::where('company_id', $validated['company_id'])
            ->where('day_of_week', strtolower($validated['day_of_week']))
            ->where('turno', strtolower($validated['turno']))
            ->delete();

        return response()->json(['success' => $deleted > 0]);
    }
    public function asignarEmpresasMasivamente()
    {
        $nextMonday = now()->startOfWeek();

        // Crear semana si no existe
        $week = Week::firstOrCreate(
            ['start_date' => $nextMonday->format('Y-m-d')],
            [
                'name' => $nextMonday->format('Y-m-d'),
                'end_date' => $nextMonday->copy()->addDays(6)->format('Y-m-d'),
            ]
        );

        // Obtener todos los usuarios con rol 'influencer'
        $influencers = User::whereHas('roles', function ($q) {
            $q->where('name', 'influencer');
        })->get();

        $asignaciones = [];

        foreach ($influencers as $influencer) {
            $userId = $influencer->id;

            // Verificar si ya tiene bookings esa semana
            $tieneBookings = Booking::where('user_id', $userId)
                ->where('week_id', $week->id)
                ->exists();

            if ($tieneBookings) {
                continue; // Saltamos usuarios con bookings ya creados
            }

            $disponibilidad = InfluencerAvailability::where('user_id', $userId)->get();
            if ($disponibilidad->isEmpty()) {
                continue; // No tiene disponibilidad registrada
            }

            $cantidadPermitida = Dato::where('id_user', $userId)->value('cantidad') ?? 1;

            // Buscar empresas compatibles con la disponibilidad del influencer
            $empresasCompatibles = Company::whereHas('availabilityDays', function ($query) use ($disponibilidad) {
                foreach ($disponibilidad as $disp) {
                    $query->orWhere(function ($subquery) use ($disp) {
                        $subquery->where('day_of_week', $disp->day_of_week)
                            ->where('turno', $disp->turno);
                    });
                }
            })->with('availabilityDays')->get();

            $empresasAsignables = [];

            foreach ($empresasCompatibles as $empresa) {
                foreach ($empresa->availabilityDays as $empresaDisp) {
                    foreach ($disponibilidad as $userDisp) {
                        if (
                            $empresaDisp->day_of_week === $userDisp->day_of_week &&
                            $empresaDisp->turno === $userDisp->turno
                        ) {
                            $empresasAsignables[] = [
                                'empresa' => $empresa,
                                'turno' => $empresaDisp->turno,
                                'day_of_week' => $empresaDisp->day_of_week,
                            ];
                        }
                    }
                }
            }

            shuffle($empresasAsignables);
            $seleccionadas = array_slice($empresasAsignables, 0, $cantidadPermitida);

            $bookings = [];

            foreach ($seleccionadas as $item) {
                $existingCount = Booking::where('company_id', $item['empresa']->id)
                    ->where('day_of_week', $item['day_of_week'])
                    ->where('turno', $item['turno'])
                    ->where('week_id', $week->id)
                    ->count();

                $cantidadMaxima = AvailabilityDay::where('company_id', $item['empresa']->id)
                    ->where('day_of_week', $item['day_of_week'])
                    ->where('turno', $item['turno'])
                    ->value('cantidad') ?? 1;

                if ($existingCount >= $cantidadMaxima) {
                    continue;
                }

                $startOfWeek = $week->start_date;
                $dias = [
                    'monday' => 0,
                    'tuesday' => 1,
                    'wednesday' => 2,
                    'thursday' => 3,
                    'friday' => 4,
                    'saturday' => 5,
                    'sunday' => 6,
                ];
                $diaOffset = $dias[strtolower($item['day_of_week'])] ?? 0;
                $fecha = Carbon::parse($startOfWeek)->addDays($diaOffset);
                $startTime = $item['turno'] === 'mañana' ? '09:00:00' : '14:00:00';
                $endTime = $item['turno'] === 'mañana' ? '13:00:00' : '18:00:00';

                $booking = Booking::create([
                    'company_id' => $item['empresa']->id,
                    'user_id' => $userId,
                    'status' => 'activo',
                    'turno' => $item['turno'],
                    'day_of_week' => $item['day_of_week'],
                    'week_id' => $week->id,
                    'start_time' => $fecha->format("Y-m-d") . " " . $startTime,
                    'end_time' => $fecha->format("Y-m-d") . " " . $endTime,
                ]);

                $bookings[] = $booking;
            }

            if (!empty($bookings)) {
                $asignaciones[] = [
                    'user_id' => $userId,
                    'nombre_usuario' => $influencer->name,
                    'empresas' => collect($bookings)->pluck('company_id')->unique(),
                ];
            }
        }

        if (empty($asignaciones)) {
            return response()->json(['message' => 'Ya tienes realizaste las asignaciones.'], 404);
        }

        return response()->json([
            'message' => 'Asignaciones completadas exitosamente.',
            'total_usuarios_asignados' => count($asignaciones),
            'detalle' => $asignaciones,
        ]);
    }
    public function indexpasante(Request $request)
    {
        $weekId = $request->query('week_id');

        // Si viene el ID, lo usamos; si no, se usa la semana actual
        if ($weekId) {
            $week = Week::findOrFail($weekId); // Lanza 404 si no existe
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
            'influencers' => $influencers,
            'week' => $week, // También podrías enviar el objeto semana
        ]);
    }
}
