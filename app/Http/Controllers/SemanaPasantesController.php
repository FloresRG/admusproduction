<?php

namespace App\Http\Controllers;

use App\Models\AsignacionPasante;
use App\Models\Company;
use App\Models\User;
use App\Models\Week;
use Carbon\Carbon;
use FPDF;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SemanaPasantesController extends Controller
{
    /* public function index(Request $request)
    {
        // Obtener la semana actual o la especificada
        $weekId = $request->get('week_id');
        $currentWeek = $weekId ? Week::find($weekId) : Week::where('start_date', '<=', Carbon::now())
            ->where('end_date', '>=', Carbon::now())
            ->first();


        if (!$currentWeek) {
            // Crear semana actual si no existe
            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();

            $currentWeek = Week::create([
                'name' => 'Semana ' . $startOfWeek->format('d/m') . ' - ' . $endOfWeek->format('d/m'),
                'start_date' => $startOfWeek,
                'end_date' => $endOfWeek,

            ]);
        }

        // Obtener todas las empresas
        $companies = Company::select('id', 'name')->get();

        // Obtener todos los usuarios con rol de pasante
        $pasantes = User::whereHas('roles', function ($query) {
            $query->where('name', 'pasante');
        })->whereHas('tipos', function ($query) {
            $query->where('nombre_tipo', 'grabacion');
        })->select('id', 'name', 'email')->get();


        // Obtener asignaciones de la semana actual
        $asignaciones = AsignacionPasante::with(['user:id,name', 'company:id,name'])
            ->where('week_id', $currentWeek->id)
            ->get()
            ->groupBy(['company_id', 'turno', 'dia']);

        // Días de la semana
        $diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        $turnos = ['mañana', 'tarde', 'noche'];

        // Obtener todas las semanas para el selector
        $weeks = Week::orderBy('start_date', 'desc')->get();

        return Inertia::render('Semana/pasante', [
            'companies' => $companies,
            'pasantes' => $pasantes,
            'asignaciones' => $asignaciones,
            'currentWeek' => $currentWeek,
            'weeks' => $weeks,
            'diasSemana' => $diasSemana,
            'turnos' => $turnos
        ]);
    } */
    /* public function index(Request $request)
    {
        // Obtener la semana actual o la especificada
        $weekId = $request->get('week_id');
        $search = $request->get('search'); // 👈 nuevo parámetro para buscar

        $currentWeek = $weekId ? Week::find($weekId) : Week::where('start_date', '<=', Carbon::now())
            ->where('end_date', '>=', Carbon::now())
            ->first();

        if (!$currentWeek) {
            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();

            $currentWeek = Week::create([
                'name' => 'Semana ' . $startOfWeek->format('d/m') . ' - ' . $endOfWeek->format('d/m'),
                'start_date' => $startOfWeek,
                'end_date' => $endOfWeek,
            ]);
        }

        // 🔎 Filtro de empresas
        $companiesQuery = Company::select('id', 'name');
        if ($search) {
            $companiesQuery->where('name', 'like', "%{$search}%");
        }
        $companies = $companiesQuery->get();

        // Obtener todos los usuarios con rol de pasante
        $pasantes = User::whereHas('roles', function ($query) {
            $query->where('name', 'pasante');
        })->whereHas('tipos', function ($query) {
            $query->where('nombre_tipo', 'grabacion');
        })
            ->select('id', 'name', 'email')
            ->get();

        // Obtener asignaciones de la semana actual
        $asignaciones = AsignacionPasante::with(['user:id,name', 'company:id,name'])
            ->where('week_id', $currentWeek->id)
            ->get()
            ->groupBy(['company_id', 'turno', 'dia']);

        $diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        $turnos = ['mañana', 'tarde', 'noche'];

        $weeks = Week::orderBy('start_date', 'desc')->get();

        return Inertia::render('Semana/pasante', [
            'companies' => $companies,
            'pasantes' => $pasantes,
            'asignaciones' => $asignaciones,
            'currentWeek' => $currentWeek,
            'weeks' => $weeks,
            'diasSemana' => $diasSemana,
            'turnos' => $turnos,
            'filters' => [
                'search' => $search, // 👈 devolvemos el valor actual
            ]
        ]);
    } */
    public function index(Request $request)
    {
        $search = $request->get('search');

        // 📅 Fecha actual
        $today = Carbon::now();

        // 🟢 Si es domingo → tomar la próxima semana
        if ($today->isSunday()) {
            $startOfWeek = $today->copy()->addDay()->startOfWeek(); // lunes próximo
            $endOfWeek = $startOfWeek->copy()->endOfWeek();
        } else {
            // 🟢 Lunes a sábado → tomar esta semana
            $startOfWeek = $today->copy()->startOfWeek();
            $endOfWeek = $today->copy()->endOfWeek();
        }

        // Buscar semana ya creada
        $currentWeek = Week::where('start_date', $startOfWeek->toDateString())
            ->where('end_date', $endOfWeek->toDateString())
            ->first();

        // Si no existe → crearla
        if (!$currentWeek) {
            $currentWeek = Week::create([
                'name' => 'Semana del ' . $startOfWeek->format('d/m/Y'),
                'start_date' => $startOfWeek,
                'end_date' => $endOfWeek,
            ]);
        }

        // 🔎 Filtro de empresas
        $companiesQuery = Company::select('id', 'name');
        if ($search) {
            $companiesQuery->where('name', 'like', "%{$search}%");
        }
        $companies = $companiesQuery->get();

        // Pasantes
        $pasantes = User::whereHas('roles', function ($query) {
            $query->where('name', 'camarografo');
        })
            
            ->select('id', 'name', 'email')
            ->get();

        // Asignaciones de la semana actual
        $asignaciones = AsignacionPasante::with(['user:id,name', 'company:id,name'])
            ->where('week_id', $currentWeek->id)
            ->get()
            ->groupBy(['company_id', 'turno', 'dia']);

        $diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        $turnos = ['mañana', 'tarde', 'noche'];

        return Inertia::render('Semana/pasante', [
            'companies' => $companies,
            'pasantes' => $pasantes,
            'asignaciones' => $asignaciones,
            'currentWeek' => $currentWeek,
            'diasSemana' => $diasSemana,
            'turnos' => $turnos,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }



    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'company_id' => 'required|exists:companies,id',
            'turno' => 'required|in:mañana,tarde,noche',
            'dia' => 'required|in:lunes,martes,miercoles,jueves,viernes,sabado',
            'week_id' => 'required|exists:weeks,id',
            'fecha' => 'required|date'
        ]);

        // Verificar que no existe ya una asignación para ese usuario en ese día y turno
        $existeAsignacion = AsignacionPasante::where([
            'user_id' => $request->user_id,
            'dia' => $request->dia,
            'turno' => $request->turno,
            'week_id' => $request->week_id
        ])->exists();

        if ($existeAsignacion) {
            return back()->withErrors(['error' => 'El pasante ya tiene una asignación en ese día y turno']);
        }

        AsignacionPasante::create($request->all());

        return back()->with('success', 'Pasante asignado correctamente');
    }

    public function destroy($id)
    {
        $asignacion = AsignacionPasante::findOrFail($id);
        $asignacion->delete();

        return back()->with('success', 'Asignación eliminada correctamente');
    }

    public function getAsignacionesByWeek($weekId)
    {
        $asignaciones = AsignacionPasante::with(['user:id,name', 'company:id,name'])
            ->where('week_id', $weekId)
            ->get()
            ->groupBy(['company_id', 'turno', 'dia']);

        return response()->json($asignaciones);
    }
    public function generarPdfDisponibilidad()
    {
        // 📅 Lógica para obtener la semana actual (la misma que en el método index)
        $today = Carbon::now();
        if ($today->isSunday()) {
            $startOfWeek = $today->copy()->addDay()->startOfWeek();
            $endOfWeek = $startOfWeek->copy()->endOfWeek();
        } else {
            $startOfWeek = $today->copy()->startOfWeek();
            $endOfWeek = $today->copy()->endOfWeek();
        }

        $week = Week::where('start_date', $startOfWeek->toDateString())
            ->where('end_date', $endOfWeek->toDateString())
            ->first();

        if (!$week) {
            return response('No se encontró la semana actual.', 404);
        }

        // 📊 Consulta para obtener las asignaciones de la tabla AsignacionPasante
        $asignaciones = AsignacionPasante::with(['company', 'user'])
            ->where('week_id', $week->id)
            ->orderBy('company_id')
            ->orderBy('dia')
            ->orderBy('turno')
            ->get();

        if ($asignaciones->isEmpty()) {
            return response('No hay asignaciones para la semana actual.', 404);
        }

        $dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        $turnos = ['mañana', 'tarde', 'noche'];

        $calendario = [];
        foreach ($asignaciones as $asignacion) {
            $empresaNombre = $asignacion->company->name;
            $dia = strtolower($asignacion->dia);
            $primerNombre = explode(' ', $asignacion->user->name)[0];
            $pasanteTurno = $primerNombre . ' (' . ucfirst($asignacion->turno) . ')';

            $calendario[$empresaNombre][$dia][] = $pasanteTurno;
        }

        // FPDF
        $pdf = new FPDF('L', 'mm', 'A4');
        $cellWidth = 38;
        $empresaWidth = 50;
        $lineHeight = 6.5;

        // Función para encabezado
        $agregarEncabezado = function () use ($pdf, $dias, $week, $empresaWidth, $cellWidth) {
            $pdf->AddPage();
            $pdf->SetMargins(10, 10, 10);
            $pdf->Image(public_path('logo.jpeg'), 10, 10, 25);
            $pdf->Image(public_path('logo.jpeg'), 255, 10, 25);
            $pdf->SetFont('Arial', 'B', 16);
            $pdf->SetXY(0, 15);
            $pdf->Cell(0, 10, utf8_decode('ADMUS PRODUCTIONS'), 0, 1, 'C');

            $pdf->Ln(8);
            $pdf->SetFont('Arial', 'B', 18);
            $pdf->SetFillColor(25, 118, 210);
            $pdf->SetTextColor(255, 255, 255);
            $pdf->Cell(0, 14, utf8_decode('Disponibilidad Semanal por Empresa'), 0, 1, 'C', true);

            $pdf->SetFont('Arial', '', 12);
            $pdf->SetTextColor(0, 0, 0);
            $pdf->Cell(0, 10, utf8_decode('Semana: ' . $week->name), 0, 1, 'C');
            $pdf->Ln(4);

            $pdf->SetFont('Arial', 'B', 10);
            $pdf->SetFillColor(33, 150, 243);
            $pdf->SetTextColor(255, 255, 255);
            $pdf->Cell($empresaWidth, 10, utf8_decode('Empresa'), 1, 0, 'C', true);
            foreach ($dias as $dia) {
                $pdf->Cell($cellWidth, 10, utf8_decode(ucfirst($dia)), 1, 0, 'C', true);
            }
            $pdf->Ln();
        };

        $agregarEncabezado();

        $empresaCount = 0;
        $pdf->SetFont('Arial', '', 9);

        foreach ($calendario as $empresaNombre => $diasData) {
            if ($empresaCount === 8) {
                $agregarEncabezado();
                $empresaCount = 0;
            }

            $maxLines = 1;
            foreach ($dias as $dia) {
                $text = isset($diasData[$dia]) ? implode("\n", $diasData[$dia]) : '';
                $lines = substr_count($text, "\n") + 1;
                $maxLines = max($maxLines, $lines);
            }
            $rowHeight = $lineHeight * $maxLines;

            $yStart = $pdf->GetY();
            $xStart = $pdf->GetX();

            $fillColor = ($empresaCount % 2 === 0) ? [245, 245, 245] : [255, 255, 255];
            $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
            $pdf->Rect($xStart, $yStart, $pdf->GetPageWidth() - 20, $rowHeight, 'F');
            $pdf->Rect($xStart, $yStart, $pdf->GetPageWidth() - 20, $rowHeight, 'D');

            $pdf->SetFont('Arial', 'B', 9);
            $pdf->SetTextColor(37, 37, 37);
            $pdf->SetXY($xStart, $yStart);
            $pdf->MultiCell($empresaWidth, $rowHeight, utf8_decode($empresaNombre), 0, 'C');
            $pdf->SetXY($xStart + $empresaWidth, $yStart);

            $pdf->SetFont('Arial', '', 9);
            $pdf->SetTextColor(0, 0, 0);
            foreach ($dias as $dia) {
                $text = isset($diasData[$dia]) ? implode("\n", $diasData[$dia]) : '';
                $x = $pdf->GetX();
                $y = $pdf->GetY();

                $pdf->SetFillColor($fillColor[0], $fillColor[1], $fillColor[2]);
                $pdf->Rect($x, $y, $cellWidth, $rowHeight, 'F');
                $pdf->SetDrawColor(180, 180, 180);
                $pdf->Rect($x, $y, $cellWidth, $rowHeight);

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
}
