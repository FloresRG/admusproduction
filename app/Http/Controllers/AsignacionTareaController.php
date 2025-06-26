<?php
// app/Http/Controllers/AsignacionTareaController.php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AsignacionTarea;
use App\Models\Company;
use App\Models\Tarea;
use App\Models\Tipo;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use FPDF;

class AsignacionTareaController extends Controller
{
    public function index()
    {
        // Carga todas las tareas con tipo, empresa y asignaciones → user
        $tareas = Tarea::with(['tipo', 'company', 'asignaciones.user'])->get();

        // Opcional: si necesitas la lista de tipos y empresas
        $tipos     = Tipo::all(['id', 'nombre']);
        $empresas  = Company::all(['id', 'nombre']);

        // Trae todas las asignaciones con usuario y tarea
        $asignaciones = AsignacionTarea::with(['user', 'tarea'])->get();

        // Renderiza Inertia y pasa los datos como prop
        return Inertia::render('asignaciones/asignacioneslist', [
            'asignaciones' => $asignaciones,
            'tareas'    => $tareas,
            'tipos'     => $tipos,
            'empresas'  => $empresas,
        ]);
    }
    public function datesIndex()
    {
        // Trae los días distintos ordenados de más reciente a más antiguo
        $fechas = AsignacionTarea::select('fecha')
            ->distinct()
            ->orderBy('fecha', 'desc')
            ->pluck('fecha')
            ->map(fn($f) => \Carbon\Carbon::parse($f)->format('Y-m-d'));

        return Inertia::render('asignaciones/fechaslist', [
            'fechas' => $fechas,
        ]);
    }

    // 2️⃣ Tareas de una fecha concreta
    public function showByFecha($fecha)
    {
        $tareasAsignadas = AsignacionTarea::with('tarea', 'user')
            ->whereDate('fecha', $fecha)
            ->get();

        // Lista de todas las posibles tareas (para el dropdown)
        $todasTareas = Tarea::select('id', 'titulo')->get();

        return Inertia::render('asignaciones/tareasporfecha', [
            'fecha'           => $fecha,
            'tareasAsignadas' => $tareasAsignadas,
            'todasTareas'     => $todasTareas,
        ]);
    }

    public function store(Request $request, $fecha, User $user)
    {
        $data = $request->validate([
            'tarea_id' => 'required|exists:tareas,id',
            'estado'   => ['required', Rule::in(['pendiente', 'en_revision', 'publicada'])],
            'detalle'  => 'nullable|string',
        ]);

        AsignacionTarea::create([
            'user_id'  => $user->id,
            'tarea_id' => $data['tarea_id'],
            'estado'   => $data['estado'],
            'detalle'  => $data['detalle'] ?? '',
            'fecha'    => $fecha,
        ]);

        return redirect()->back();
    }


    public function destroy(AsignacionTarea $asignacion)
    {
        $asignacion->delete();
        return redirect()->back();
    }

    // app/Http/Controllers/AsignacionTareaController.php

    public function update(Request $request, AsignacionTarea $asignacion)
    {
        $data = $request->validate([
            // Validamos 'estado' solo si viene en la petición
            'estado'  => ['sometimes', 'required', Rule::in(['pendiente', 'en_revision', 'publicada'])],
            // Validamos 'detalle' solo si viene en la petición
            'detalle' => ['sometimes', 'nullable', 'string'],
        ]);

        // Con esto, $data tendrá solo las claves que se enviaron. 
        // Actualizamos solo los campos remitidos por el front-end.
        $asignacion->update($data);

        return back();
    }


    /**
     * Lista las fechas en que el usuario autenticado tiene asignaciones.
     */
    public function myDatesIndex()
    {
        $userId = Auth::id();

        $fechas = AsignacionTarea::query()
            ->where('user_id', $userId)
            ->select('fecha')
            ->distinct()
            ->orderBy('fecha', 'desc')
            ->pluck('fecha')
            ->map(fn($f) => \Carbon\Carbon::parse($f)->format('Y-m-d'));

        return Inertia::render('asignaciones/misfechaslist', [
            'fechas' => $fechas,
        ]);
    }

    /**
     * Muestra sólo mis tareas para la fecha indicada.
     */


    public function myShowByFecha($fecha)
    {
        $userId = Auth::id();

        $tareasAsignadas = AsignacionTarea::with('tarea')
            ->where('user_id', $userId)
            ->whereDate('fecha', $fecha)
            ->get();

        // -- aquí creas la variable --
        $todasTareas = Tarea::select('id', 'titulo')->get();

        return Inertia::render('tareas/fecha', [
            'fecha'           => $fecha,
            'tareasAsignadas' => $tareasAsignadas,
            'todasTareas'     => $todasTareas,
        ]);
    }

    /* public function reportetareas(Request $request)
    {
        $query = AsignacionTarea::with([
            'user:id,name,email',
            'tarea.tipo:id,nombre_tipo',       // 👈 Asegúrate de que nombre_tipo existe en la tabla 'tipos'
            'tarea.company:id,name'            // 👈 Solo selecciona columnas existentes
        ]);

        // Filtro por rango de fechas (campo 'fecha' de AsignacionTarea)
        if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
            $query->whereBetween('fecha', [$request->fecha_inicio, $request->fecha_fin]);
        }

        // Filtro por mes (mes numérico: 1-12)
        if ($request->filled('mes')) {
            $query->whereMonth('fecha', $request->mes);
        }

        $asignaciones = $query->get();

        return Inertia::render('tareas/reporte', [
            'asignaciones' => $asignaciones,
            'filters' => $request->only('fecha_inicio', 'fecha_fin', 'mes'),
        ]);
    } */
    public function reportetareas(Request $request)
    {
        $query = AsignacionTarea::with([
            'user:id,name,email',
            'tarea.tipo:id,nombre_tipo',
            'tarea.company:id,name'
        ]);

        // Filtro por rango de fechas o fecha individual
        if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
            $query->whereBetween('fecha', [$request->fecha_inicio, $request->fecha_fin]);
        } elseif ($request->filled('fecha_inicio')) {
            $query->whereDate('fecha', '>=', $request->fecha_inicio);
        } elseif ($request->filled('fecha_fin')) {
            $query->whereDate('fecha', '<=', $request->fecha_fin);
        }

        // Filtro por mes
        if ($request->filled('mes')) {
            $query->whereMonth('fecha', $request->mes);
        }

        $asignaciones = $query->get();

        return Inertia::render('tareas/reporte', [
            'asignaciones' => $asignaciones,
            'filters' => $request->only('fecha_inicio', 'fecha_fin', 'mes'),
        ]);
    }

    public function generarPdfReporteTareas(Request $request)
    {
        $query = AsignacionTarea::with([
            'user:id,name,email',
            'tarea.tipo:id,nombre_tipo',
            'tarea.company:id,name'
        ]);

        // Aplicar los mismos filtros que en reportetareas
        if ($request->filled('fecha_inicio') && $request->filled('fecha_fin')) {
            $query->whereBetween('fecha', [$request->fecha_inicio, $request->fecha_fin]);
        } elseif ($request->filled('fecha_inicio')) {
            $query->whereDate('fecha', '>=', $request->fecha_inicio);
        } elseif ($request->filled('fecha_fin')) {
            $query->whereDate('fecha', '<=', $request->fecha_fin);
        }

        if ($request->filled('mes')) {
            $query->whereMonth('fecha', $request->mes);
        }

        $asignaciones = $query->get();

        if ($asignaciones->isEmpty()) {
            return redirect()->back()->with('error', 'No hay registros para generar el PDF.');
        }

        $pdf = new \FPDF();
        $pdf->AddPage();
        $pdf->SetMargins(10, 10, 10);

        // Logos (ajusta la ruta si es necesario)
        $pdf->Image(public_path('logo.jpeg'), 10, 10, 30);
        $pdf->Image(public_path('logo.jpeg'), 170, 10, 30);

        // Título centrado
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Ln(20);
        $pdf->Cell(0, 10, utf8_decode('Reporte de Tareas Asignadas'), 0, 1, 'C');

        // Subtítulo con filtros aplicados
        $filtrosTexto = [];
        if ($request->filled('fecha_inicio')) {
            $filtrosTexto[] = "Fecha Inicio: {$request->fecha_inicio}";
        }
        if ($request->filled('fecha_fin')) {
            $filtrosTexto[] = "Fecha Fin: {$request->fecha_fin}";
        }
        if ($request->filled('mes')) {
            $mesNombre = \Carbon\Carbon::create()->month($request->mes)->locale('es')->monthName;
            $filtrosTexto[] = "Mes: " . ucfirst($mesNombre);
        }
        if (!empty($filtrosTexto)) {
            $pdf->SetFont('Arial', '', 12);
            $pdf->Cell(0, 10, utf8_decode(implode(' | ', $filtrosTexto)), 0, 1, 'C');
        }

        $pdf->Ln(5);

        // Encabezados tabla
        $pdf->SetFillColor(200, 200, 200);
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(30, 8, 'Usuario', 1, 0, 'C', true);
        $pdf->Cell(40, 8, 'Tarea', 1, 0, 'C', true);
        $pdf->Cell(20, 8, 'Prioridad', 1, 0, 'C', true);
        $pdf->Cell(30, 8, 'Tipo', 1, 0, 'C', true);
        $pdf->Cell(30, 8, 'Empresa', 1, 0, 'C', true);
        $pdf->Cell(25, 8, 'Fecha', 1, 0, 'C', true);
        $pdf->Cell(25, 8, 'Estado', 1, 0, 'C', true);
        $pdf->Cell(40, 8, 'Detalle', 1, 1, 'C', true);

        // Contenido tabla
        $pdf->SetFont('Arial', '', 9);
        foreach ($asignaciones as $asignacion) {
            $pdf->Cell(30, 7, utf8_decode($asignacion->user->name), 1);
            $pdf->Cell(40, 7, utf8_decode($asignacion->tarea->titulo), 1);
            $pdf->Cell(20, 7, utf8_decode($asignacion->tarea->prioridad), 1);
            $pdf->Cell(30, 7, utf8_decode($asignacion->tarea->tipo->nombre_tipo ?? 'N/A'), 1);
            $pdf->Cell(30, 7, utf8_decode($asignacion->tarea->company->name ?? 'N/A'), 1);
            $pdf->Cell(25, 7, $asignacion->fecha, 1);
            $pdf->Cell(25, 7, utf8_decode($asignacion->estado), 1);
            $pdf->Cell(40, 7, utf8_decode($asignacion->detalle), 1);
            $pdf->Ln();
        }

        return response($pdf->Output('S', 'reporte_tareas.pdf'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="reporte_tareas.pdf"');
    }
}
