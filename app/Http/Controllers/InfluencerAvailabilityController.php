<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityDay;
use App\Models\Booking;
use App\Models\Company;
use App\Models\Dato;
use App\Models\InfluencerAvailability;
use App\Models\User;
use App\Models\Week;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use FPDF;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class InfluencerAvailabilityController extends Controller
{
    private function autoCleanIfNeeded()
    {
        $now = Carbon::now();
        $lastCleanDate = Cache::get('last_availability_clean');

        // Verifica si hoy es viernes y la hora es 23:59
        if ($now->isFriday() && $now->format('H:i') === '23:59') {
            // Evita limpiar más de una vez por minuto
            if ($lastCleanDate !== $now->format('Y-m-d H:i')) {
                InfluencerAvailability::truncate();

                // Guarda en la caché la fecha y hora exacta de la última limpieza
                Cache::put('last_availability_clean', $now->format('Y-m-d H:i'), 60 * 24 * 7); // 1 semana

                \Log::info('🧹 Auto-limpieza de disponibilidades ejecutada (viernes 23:59)', [
                    'timestamp' => $now->toDateTimeString()
                ]);
            }
        }
    }
    public function clearAll()
    {
        $count = InfluencerAvailability::count();
        InfluencerAvailability::truncate();

        return response()->json([
            'message' => "Se eliminaron {$count} disponibilidades",
            'count' => $count
        ]);
    }

    public function index()
    {
        $this->autoCleanIfNeeded();
        $userId = Auth::id();
        $availabilities = InfluencerAvailability::with('user')
            ->where('user_id', $userId)
            ->get();

        return response()->json($availabilities);
    }

    public function store(Request $request)
    {
        $request->validate([
            'day_of_week' => 'required|string',
            'turno' => 'required|string',
        ]);

        $user_id = Auth::id();
        $start_time = $request->turno == 'tarde' ? '14:00' : '09:30';
        $end_time = $request->turno == 'tarde' ? '18:00' : '13:00';

        $existingAvailability = InfluencerAvailability::where('user_id', $user_id)
            ->where('day_of_week', $request->day_of_week)
            ->where('turno', $request->turno)
            ->first();

        if ($existingAvailability) {
            $existingAvailability->update([
                'start_time' => $start_time,
                'end_time' => $end_time,
            ]);
            return response()->json($existingAvailability);
        } else {
            $availability = InfluencerAvailability::create([
                'user_id' => $user_id,
                'day_of_week' => $request->day_of_week,
                'turno' => $request->turno,
                'start_time' => $start_time,
                'end_time' => $end_time,
            ]);
            return response()->json($availability, 201);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'turno' => 'required|string',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
        ]);

        $user_id = Auth::id();

        // Obtener la disponibilidad que queremos actualizar
        $availability = InfluencerAvailability::where('user_id', $user_id)->findOrFail($id);

        // Actualizar las horas del turno
        $availability->update([
            'turno' => $request->turno,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return response()->json($availability);
    }

    public function destroy($id)
    {
        $user_id = Auth::id();

        $availability = InfluencerAvailability::where('user_id', $user_id)->findOrFail($id);
        $availability->delete();

        return response()->json(null, 204);
    }


    public function asignarEmpresa()
    {
        $userId = Auth::id();

        // Obtener el lunes de la próxima semana
        $nextMonday = now()->addWeek()->startOfWeek();

        // Verificar si ya existe una semana con este lunes
        $week = Week::where('start_date', $nextMonday->format('Y-m-d'))->first();

        if ($week) {
            // Verificar si ya existen bookings para ese usuario en esa semana
            $existingBookings = Booking::where('user_id', $userId)
                ->where('week_id', $week->id)
                ->exists();

            if ($existingBookings) {
                return response()->json(['message' => 'Ya tienes asignado empresas para la próxima semana.'], 403);
            }
        }

        // Obtener las disponibilidades del influencer
        $influencerDisponibilidad = InfluencerAvailability::where('user_id', $userId)->get();

        if ($influencerDisponibilidad->isEmpty()) {
            return response()->json(['message' => 'No tienes disponibilidad registrada. Agrega Dias Diponibles'], 404);
        }

        // Obtener cuántas empresas puede tener asignadas (por 'cantidad' en la tabla 'datos')
        $cantidadPermitida = Dato::where('id_user', $userId)->value('cantidad') ?? 1;

        // Traer empresas con días y turnos compatibles (no filtramos por bookings)
        $empresasCompatibles = Company::whereHas('availabilityDays', function ($query) use ($influencerDisponibilidad) {
            foreach ($influencerDisponibilidad as $disp) {
                $query->orWhere(function ($subquery) use ($disp) {
                    $subquery->where('day_of_week', $disp->day_of_week)
                        ->where('turno', $disp->turno);
                });
            }
        })->with('availabilityDays')->get();

        if ($empresasCompatibles->isEmpty()) {
            return response()->json(['message' => 'No hay empresas con la misma disponibilidad.'], 404);
        }

        $empresasAsignables = [];

        // Recorremos empresas compatibles y sus días para hacer match con la disponibilidad del influencer
        foreach ($empresasCompatibles as $empresa) {
            foreach ($empresa->availabilityDays as $empresaDisp) {
                foreach ($influencerDisponibilidad as $userDisp) {
                    if (
                        $empresaDisp->day_of_week === $userDisp->day_of_week &&
                        $empresaDisp->turno === $userDisp->turno
                    ) {
                        // Guardamos la empresa y el día de la semana en el array
                        $empresasAsignables[] = [
                            'empresa' => $empresa,
                            'turno' => $empresaDisp->turno,
                            'day_of_week' => $empresaDisp->day_of_week, // Guardamos el día
                        ];
                        break 2; // Ya hizo match esta empresa con una disponibilidad
                    }
                }
            }
        }

        // Mezclamos aleatoriamente las empresas encontradas
        shuffle($empresasAsignables);

        // Limitamos a la cantidad permitida por el campo `cantidad`
        $seleccionadas = array_slice($empresasAsignables, 0, $cantidadPermitida);

        $bookingsCreados = [];
        $empresasAsignadas = [];  // Guardaremos los nombres de las empresas asignadas

        // Obtener el lunes de la próxima semana
        $nextMonday = now()->addWeek()->startOfWeek();

        // Verificar si ya existe una semana con este lunes
        $week = Week::where('start_date', $nextMonday->format('Y-m-d'))->first();

        if (!$week) {
            // Si no existe, crear la nueva semana
            $week = Week::create([
                'name' => $nextMonday->format('Y-m-d'),
                'start_date' => $nextMonday->format('Y-m-d'),
                'end_date' => $nextMonday->addDays(6)->format('Y-m-d'), // Sábado de esa semana
            ]);
        }

        // Creamos los bookings con el week_id de la nueva semana o la semVolver a Fechasana existente
        foreach ($seleccionadas as $item) {
            // Verificar si ya existe un booking para esa empresa, día y turno en la misma semana
            // Contar cuántos bookings existen ya para esa empresa en ese día, turno y semana
            // Contar cuántos bookings ya existen para esa empresa en ese día, turno y semana
            $existingBookingsCount = Booking::where('company_id', $item['empresa']->id)
                ->where('day_of_week', $item['day_of_week'])
                ->where('turno', $item['turno'])
                ->where('week_id', $week->id)
                ->count();

            // Obtener la cantidad máxima permitida para ese día y turno
            $cantidadMaxima = AvailabilityDay::where('company_id', $item['empresa']->id)
                ->where('day_of_week', $item['day_of_week'])
                ->where('turno', $item['turno'])
                ->value('cantidad') ?? 1; // fallback a 1 si es null

            // Validar correctamente
            if ($existingBookingsCount >= (int) $cantidadMaxima) {
                continue;
            }



            // Crear el nuevo booking si no existe
            $booking = Booking::create([
                'company_id' => $item['empresa']->id,
                'user_id' => $userId,
                'status' => 'activo',
                'turno' => $item['turno'],
                'day_of_week' => $item['day_of_week'], // Guardamos el día de la semana
                'week_id' => $week->id, // Asignamos el week_id de la semana encontrada o creada
            ]);

            $bookingsCreados[] = $booking;
            // Añadimos el nombre de la empresa a la lista de empresas asignadas
            $empresasAsignadas[] = $item['empresa']->name;
        }

        if (empty($bookingsCreados)) {
            return response()->json(['message' => 'No se encontraron Empresas Disponibles.'], 404);
        }

        return response()->json([
            'message' => 'Empresas asignadas correctamente.',
            'empresa_nombre' => implode(', ', $empresasAsignadas),  // Convertimos el array en una cadena de nombres
            'total_bookings' => count($bookingsCreados),
            'empresa_ids' => collect($bookingsCreados)->pluck('company_id')->unique(),
        ]);
    }





    public function generarPdfEmpresasAsignadas()
    {
        $userId = Auth::id();

        $nextMonday = now()->addWeek()->startOfWeek()->format('Y-m-d');
        $week = Week::where('start_date', $nextMonday)->first();

        if (!$week) {
            return response()->json(['error' => 'No se encontró la semana asignada.'], 404);
        }

        $bookings = Booking::with('company')
            ->where('user_id', $userId)
            ->where('week_id', $week->id)
            ->get();

        if ($bookings->isEmpty()) {
            return response()->json(['error' => 'No hay empresas asignadas para esa semana.'], 404);
        }

        $diasTraducidos = [
            'monday' => 'Lunes',
            'tuesday' => 'Martes',
            'wednesday' => 'Miércoles',
            'thursday' => 'Jueves',
            'friday' => 'Viernes',
            'saturday' => 'Sábado',
            'sunday' => 'Domingo',
        ];

        $pdf = new \FPDF();
        $pdf->AddPage();

        // Márgenes
        $pdf->SetMargins(10, 10, 10);

        // Logos (ajusta las rutas si es necesario)
        $pdf->Image(public_path('logo.jpeg'), 10, 10, 30);
        $pdf->Image(public_path('logo.jpeg'), 170, 10, 30);

        // Nombre de la empresa centrado con degradado de rojo a negro
        $nombreEmpresa = 'ADMUS PRODUCTION'; // Puedes cambiar este nombre
        $xInicio = ($pdf->GetPageWidth() - (strlen($nombreEmpresa) * 4)) / 2;
        $yInicio = 15;

        $rojo = 255;
        $verde = 0;
        $azul = 0;
        $pasos = strlen($nombreEmpresa);
        $decremento = intval($rojo / max($pasos - 1, 1)); // Evita división por cero

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->SetXY($xInicio, $yInicio);

        for ($i = 0; $i < $pasos; $i++) {
            $letra = $nombreEmpresa[$i];
            $pdf->SetTextColor($rojo, $verde, $azul);
            $pdf->Cell(4, 7, $letra, 0, 0, 'C');
            $rojo = max(0, $rojo - $decremento);
            $verde = max(0, $verde - $decremento);
            $azul = max(0, $azul - $decremento);
        }

        $pdf->Ln(20); // Espacio después del título

        // Título del documento
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->SetTextColor(33, 37, 41);
        $pdf->SetFillColor(230, 230, 250);
        $pdf->Cell(0, 12, utf8_decode('Empresas Asignadas'), 0, 1, 'C', true);
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 10, utf8_decode('Semana: ' . $week->name), 0, 1, 'C');
        $pdf->Ln(10);

        // Encabezado de tabla
        $pdf->SetFillColor(255, 0, 0); // Rojo
        $pdf->SetTextColor(255, 255, 255); // Blanco
        $pdf->SetDrawColor(0, 0, 0); // Borde negro
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(80, 10, utf8_decode('Empresa'), 1, 0, 'C', true);
        $pdf->Cell(50, 10, utf8_decode('Día'), 1, 0, 'C', true);
        $pdf->Cell(50, 10, utf8_decode('Turno'), 1, 1, 'C', true);


        // Filas de la tabla
        $pdf->SetFont('Arial', '', 12);
        $pdf->SetTextColor(0, 0, 0); // Texto negro
        foreach ($bookings as $booking) {
            $empresa = utf8_decode($booking->company->name);
            $dia = $diasTraducidos[strtolower($booking->day_of_week)] ?? ucfirst($booking->day_of_week);
            $turno = ucfirst($booking->turno);

            $pdf->Cell(80, 10, $empresa, 1, 0, 'L');
            $pdf->Cell(50, 10, utf8_decode($dia), 1, 0, 'C');
            $pdf->Cell(50, 10, utf8_decode($turno), 1, 1, 'C');
        }

        return response($pdf->Output('S', 'empresas_asignadas.pdf'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="empresas_asignadas.pdf"');
    }
}
