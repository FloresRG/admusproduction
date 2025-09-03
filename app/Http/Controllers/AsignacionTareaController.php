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

       $asignaciones = $query->orderBy('fecha', 'desc')->get();


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

        $asignaciones = $query->orderBy('fecha', 'desc')->get();


        if ($asignaciones->isEmpty()) {
            return redirect()->back()->with('error', 'No hay registros para generar el PDF.');
        }

        $pdf = new \FPDF();
        $pdf->AddPage();
        $pdf->SetMargins(15, 15, 15);

        // === HEADER SECTION CON DISEÑO MODERNO ===

        // Fondo azul para el header
        $pdf->SetFillColor(41, 128, 185); // Azul profesional
        $pdf->Rect(0, 0, 210, 45, 'F');

        // Logos (ajusta la ruta si es necesario)
        if (file_exists(public_path('logo.jpeg'))) {
            $pdf->Image(public_path('logo.jpeg'), 15, 8, 25);
            $pdf->Image(public_path('logo.jpeg'), 170, 8, 25);
        }

        // Título principal en blanco
        $pdf->SetTextColor(255, 255, 255); // Blanco
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->SetY(15);
        $pdf->Cell(0, 12, utf8_decode('REPORTE DE TAREAS'), 0, 1, 'C');

        // Subtítulo
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(0, 8, utf8_decode('Asignaciones y Estado de Tareas'), 0, 1, 'C');

        // Reset color de texto
        $pdf->SetTextColor(0, 0, 0);

        // === INFORMACIÓN DE FILTROS ===
        $pdf->SetY(50);

        // Caja de información con fondo gris claro
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
            $pdf->SetFillColor(236, 240, 241); // Gris muy claro
            $pdf->Rect(15, 50, 180, 15, 'F');

            $pdf->SetFont('Arial', 'B', 10);
            $pdf->SetY(53);
            $pdf->Cell(0, 5, utf8_decode('FILTROS APLICADOS:'), 0, 1, 'C');

            $pdf->SetFont('Arial', '', 9);
            $pdf->Cell(0, 5, utf8_decode(implode(' • ', $filtrosTexto)), 0, 1, 'C');
            $pdf->Ln(10);
        } else {
            $pdf->Ln(5);
        }

        // Fecha de generación
        $pdf->SetFont('Arial', 'I', 9);
        $pdf->SetTextColor(127, 140, 141); // Gris
        $pdf->Cell(0, 5, utf8_decode('Generado el: ' . now()->format('d/m/Y H:i')), 0, 1, 'R');
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(5);

        // === TABLA CON DISEÑO MODERNO ===

        // Encabezado de tabla con gradiente azul
        $pdf->SetFillColor(52, 152, 219); // Azul header
        $pdf->SetTextColor(255, 255, 255); // Texto blanco
        $pdf->SetFont('Arial', 'B', 9);

        // Definir anchos de columnas optimizados
        $colWidths = [25, 35, 18, 25, 25, 22, 20, 35];
        $headers = ['Usuario', 'Tarea', 'Prioridad', 'Tipo', 'Empresa', 'Fecha', 'Estado', 'Detalle'];

        $x = 15;
        foreach ($headers as $i => $header) {
            $pdf->SetXY($x, $pdf->GetY());
            $pdf->Cell($colWidths[$i], 10, utf8_decode($header), 1, 0, 'C', true);
            $x += $colWidths[$i];
        }
        $pdf->Ln();

        // Contenido de la tabla con colores alternados
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetTextColor(0, 0, 0);

        $fillColor1 = [255, 255, 255]; // Blanco
        $fillColor2 = [248, 249, 250]; // Gris muy claro

        foreach ($asignaciones as $index => $asignacion) {
            // Alternar colores de fila
            $isEvenRow = $index % 2 == 0;
            $currentFill = $isEvenRow ? $fillColor1 : $fillColor2;
            $pdf->SetFillColor($currentFill[0], $currentFill[1], $currentFill[2]);

            // Altura de fila dinámica basada en contenido
            $rowHeight = 8;

            $x = 15;
            $y = $pdf->GetY();

            // Usuario
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[0], $rowHeight, utf8_decode(substr($asignacion->user->name, 0, 15)), 1, 0, 'L', true);
            $x += $colWidths[0];

            // Tarea
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[1], $rowHeight, utf8_decode(substr($asignacion->tarea->titulo, 0, 20)), 1, 0, 'L', true);
            $x += $colWidths[1];

            // Prioridad con color
            $pdf->SetXY($x, $y);
            $prioridad = $asignacion->tarea->prioridad;

            // Color según prioridad
            switch (strtolower($prioridad)) {
                case 'alta':
                    $pdf->SetTextColor(231, 76, 60); // Rojo
                    break;
                case 'media':
                    $pdf->SetTextColor(243, 156, 18); // Naranja
                    break;
                case 'baja':
                    $pdf->SetTextColor(39, 174, 96); // Verde
                    break;
                default:
                    $pdf->SetTextColor(0, 0, 0);
            }

            $pdf->Cell($colWidths[2], $rowHeight, utf8_decode($prioridad), 1, 0, 'C', true);
            $pdf->SetTextColor(0, 0, 0); // Reset color
            $x += $colWidths[2];

            // Tipo
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[3], $rowHeight, utf8_decode(substr($asignacion->tarea->tipo->nombre_tipo ?? 'N/A', 0, 15)), 1, 0, 'L', true);
            $x += $colWidths[3];

            // Empresa
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[4], $rowHeight, utf8_decode(substr($asignacion->tarea->company->name ?? 'N/A', 0, 15)), 1, 0, 'L', true);
            $x += $colWidths[4];

            // Fecha
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[5], $rowHeight, \Carbon\Carbon::parse($asignacion->fecha)->format('d/m/Y'), 1, 0, 'C', true);
            $x += $colWidths[5];

            // Estado con color
            $pdf->SetXY($x, $y);
            $estado = $asignacion->estado;

            // Color según estado
            switch (strtolower($estado)) {
                case 'publicada':
                case 'finalizado':
                    $pdf->SetTextColor(39, 174, 96); // Verde
                    break;
                case 'en_proceso':
                case 'proceso':
                    $pdf->SetTextColor(243, 156, 18); // Naranja
                    break;
                case 'pendiente':
                    $pdf->SetTextColor(231, 76, 60); // Rojo
                    break;
                default:
                    $pdf->SetTextColor(0, 0, 0);
            }

            $pdf->Cell($colWidths[6], $rowHeight, utf8_decode($estado), 1, 0, 'C', true);
            $pdf->SetTextColor(0, 0, 0); // Reset color
            $x += $colWidths[6];

            // Detalle
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[7], $rowHeight, utf8_decode(substr($asignacion->detalle, 0, 25)), 1, 0, 'L', true);

            $pdf->Ln();
        }

        // === FOOTER SECTION ===
        $pdf->Ln(10);

        // Estadísticas rápidas
        $totalTareas = $asignaciones->count();
        $completadas = $asignaciones->where('estado', 'publicada')->count();
        $pendientes = $asignaciones->where('estado', 'pendiente')->count();
        $enProceso = $asignaciones->where('estado', 'en_proceso')->count();

        // Caja de estadísticas
        $pdf->SetFillColor(236, 240, 241);
        $pdf->Rect(15, $pdf->GetY(), 180, 25, 'F');

        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(0, 8, utf8_decode('RESUMEN ESTADÍSTICO'), 0, 1, 'C');

        $pdf->SetFont('Arial', '', 9);
        $statsY = $pdf->GetY();

        // Total
        $pdf->SetXY(25, $statsY);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(40, 6, utf8_decode("Total de tareas: $totalTareas"), 0, 0, 'L');

        // Completadas
        $pdf->SetTextColor(39, 174, 96);
        $pdf->Cell(40, 6, utf8_decode("Completadas: $completadas"), 0, 0, 'L');

        // En proceso
        $pdf->SetTextColor(243, 156, 18);
        $pdf->Cell(40, 6, utf8_decode("En proceso: $enProceso"), 0, 0, 'L');

        // Pendientes
        $pdf->SetTextColor(231, 76, 60);
        $pdf->Cell(40, 6, utf8_decode("Pendientes: $pendientes"), 0, 1, 'L');

        // Reset color
        $pdf->SetTextColor(0, 0, 0);

        // Footer final
        $pdf->Ln(5);
        $pdf->SetFont('Arial', 'I', 8);
        $pdf->SetTextColor(127, 140, 141);
        $pdf->Cell(0, 5, utf8_decode('Reporte generado automáticamente por el sistema de gestión de tareas'), 0, 1, 'C');

        return response($pdf->Output('S', 'reporte_tareas.pdf'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="reporte_tareas_' . date('Y-m-d') . '.pdf"');
    }
    public function generarPdfReporteTareasmes(Request $request)
    {
        $query = AsignacionTarea::with([
            'user:id,name,email',
            'tarea.tipo:id,nombre_tipo',
            'tarea.company:id,name'
        ]);

        // Filtrar solo por el mes actual
        $mesActual = now()->month;
        $añoActual = now()->year;

        $query->whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $añoActual);

        $asignaciones = $query->orderBy('fecha', 'desc')->get();

        if ($asignaciones->isEmpty()) {
            return redirect()->back()->with('error', 'No hay registros para generar el PDF.');
        }

        $pdf = new \FPDF();
        $pdf->AddPage();
        $pdf->SetMargins(15, 15, 15);

        // === HEADER SECTION CON DISEÑO MODERNO ===

        // Fondo azul para el header
        $pdf->SetFillColor(41, 128, 185); // Azul profesional
        $pdf->Rect(0, 0, 210, 45, 'F');

        // Logos (ajusta la ruta si es necesario)
        if (file_exists(public_path('logo.jpeg'))) {
            $pdf->Image(public_path('logo.jpeg'), 15, 8, 25);
            $pdf->Image(public_path('logo.jpeg'), 170, 8, 25);
        }

        // Título principal en blanco
        $pdf->SetTextColor(255, 255, 255); // Blanco
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->SetY(15);
        $pdf->Cell(0, 12, utf8_decode('REPORTE DE TAREAS'), 0, 1, 'C');

        // Subtítulo: Mes actual en español
        setlocale(LC_TIME, 'es_ES.UTF-8'); // Para sistemas compatibles
        $nombreMes = ucfirst(now()->locale('es')->monthName);
        $pdf->SetFont('Arial', 'I', 12);
        $pdf->Cell(0, 8, utf8_decode("Mes de $nombreMes"), 0, 1, 'C');


        // Reset color de texto
        $pdf->SetTextColor(0, 0, 0);

        // === INFORMACIÓN DE FILTROS ===
        $pdf->SetY(50);

        // Caja de información con fondo gris claro
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
            $pdf->SetFillColor(236, 240, 241); // Gris muy claro
            $pdf->Rect(15, 50, 180, 15, 'F');

            $pdf->SetFont('Arial', 'B', 10);
            $pdf->SetY(53);
            $pdf->Cell(0, 5, utf8_decode('FILTROS APLICADOS:'), 0, 1, 'C');

            $pdf->SetFont('Arial', '', 9);
            $pdf->Cell(0, 5, utf8_decode(implode(' • ', $filtrosTexto)), 0, 1, 'C');
            $pdf->Ln(10);
        } else {
            $pdf->Ln(5);
        }

        // Fecha de generación
        $pdf->SetFont('Arial', 'I', 9);
        $pdf->SetTextColor(127, 140, 141); // Gris
        $pdf->Cell(0, 5, utf8_decode('Generado el: ' . now()->format('d/m/Y H:i')), 0, 1, 'R');
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Ln(5);

        // === TABLA CON DISEÑO MODERNO ===

        // Encabezado de tabla con gradiente azul
        $pdf->SetFillColor(52, 152, 219); // Azul header
        $pdf->SetTextColor(255, 255, 255); // Texto blanco
        $pdf->SetFont('Arial', 'B', 9);

        // Definir anchos de columnas optimizados
        $colWidths = [25, 35, 18, 25, 25, 22, 20, 35];
        $headers = ['Usuario', 'Tarea', 'Prioridad', 'Tipo', 'Empresa', 'Fecha', 'Estado', 'Detalle'];

        $x = 15;
        foreach ($headers as $i => $header) {
            $pdf->SetXY($x, $pdf->GetY());
            $pdf->Cell($colWidths[$i], 10, utf8_decode($header), 1, 0, 'C', true);
            $x += $colWidths[$i];
        }
        $pdf->Ln();

        // Contenido de la tabla con colores alternados
        $pdf->SetFont('Arial', '', 8);
        $pdf->SetTextColor(0, 0, 0);

        $fillColor1 = [255, 255, 255]; // Blanco
        $fillColor2 = [248, 249, 250]; // Gris muy claro

        foreach ($asignaciones as $index => $asignacion) {
            // Alternar colores de fila
            $isEvenRow = $index % 2 == 0;
            $currentFill = $isEvenRow ? $fillColor1 : $fillColor2;
            $pdf->SetFillColor($currentFill[0], $currentFill[1], $currentFill[2]);

            // Altura de fila dinámica basada en contenido
            $rowHeight = 8;

            $x = 15;
            $y = $pdf->GetY();

            // Usuario
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[0], $rowHeight, utf8_decode(substr($asignacion->user->name, 0, 15)), 1, 0, 'L', true);
            $x += $colWidths[0];

            // Tarea
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[1], $rowHeight, utf8_decode(substr($asignacion->tarea->titulo, 0, 20)), 1, 0, 'L', true);
            $x += $colWidths[1];

            // Prioridad con color
            $pdf->SetXY($x, $y);
            $prioridad = $asignacion->tarea->prioridad;

            // Color según prioridad
            switch (strtolower($prioridad)) {
                case 'alta':
                    $pdf->SetTextColor(231, 76, 60); // Rojo
                    break;
                case 'media':
                    $pdf->SetTextColor(243, 156, 18); // Naranja
                    break;
                case 'baja':
                    $pdf->SetTextColor(39, 174, 96); // Verde
                    break;
                default:
                    $pdf->SetTextColor(0, 0, 0);
            }

            $pdf->Cell($colWidths[2], $rowHeight, utf8_decode($prioridad), 1, 0, 'C', true);
            $pdf->SetTextColor(0, 0, 0); // Reset color
            $x += $colWidths[2];

            // Tipo
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[3], $rowHeight, utf8_decode(substr($asignacion->tarea->tipo->nombre_tipo ?? 'N/A', 0, 15)), 1, 0, 'L', true);
            $x += $colWidths[3];

            // Empresa
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[4], $rowHeight, utf8_decode(substr($asignacion->tarea->company->name ?? 'N/A', 0, 15)), 1, 0, 'L', true);
            $x += $colWidths[4];

            // Fecha
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[5], $rowHeight, \Carbon\Carbon::parse($asignacion->fecha)->format('d/m/Y'), 1, 0, 'C', true);
            $x += $colWidths[5];

            // Estado con color
            $pdf->SetXY($x, $y);
            $estado = $asignacion->estado;

            // Color según estado
            switch (strtolower($estado)) {
                case 'completado':
                case 'finalizado':
                    $pdf->SetTextColor(39, 174, 96); // Verde
                    break;
                case 'en progreso':
                case 'proceso':
                    $pdf->SetTextColor(243, 156, 18); // Naranja
                    break;
                case 'pendiente':
                    $pdf->SetTextColor(231, 76, 60); // Rojo
                    break;
                default:
                    $pdf->SetTextColor(0, 0, 0);
            }

            $pdf->Cell($colWidths[6], $rowHeight, utf8_decode($estado), 1, 0, 'C', true);
            $pdf->SetTextColor(0, 0, 0); // Reset color
            $x += $colWidths[6];

            // Detalle
            $pdf->SetXY($x, $y);
            $pdf->Cell($colWidths[7], $rowHeight, utf8_decode(substr($asignacion->detalle, 0, 25)), 1, 0, 'L', true);

            $pdf->Ln();
        }

        // === FOOTER SECTION ===
        $pdf->Ln(10);

        // Estadísticas rápidas
        $totalTareas = $asignaciones->count();
        $completadas = $asignaciones->where('estado', 'completado')->count();
        $pendientes = $asignaciones->where('estado', 'pendiente')->count();
        $enProceso = $asignaciones->where('estado', 'en progreso')->count();

        // Caja de estadísticas
        $pdf->SetFillColor(236, 240, 241);
        $pdf->Rect(15, $pdf->GetY(), 180, 25, 'F');

        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(0, 8, utf8_decode('RESUMEN ESTADÍSTICO'), 0, 1, 'C');

        $pdf->SetFont('Arial', '', 9);
        $statsY = $pdf->GetY();

        // Total
        $pdf->SetXY(25, $statsY);
        $pdf->SetTextColor(52, 73, 94);
        $pdf->Cell(40, 6, utf8_decode("Total de tareas: $totalTareas"), 0, 0, 'L');

        // Completadas
        $pdf->SetTextColor(39, 174, 96);
        $pdf->Cell(40, 6, utf8_decode("Completadas: $completadas"), 0, 0, 'L');

        // En proceso
        $pdf->SetTextColor(243, 156, 18);
        $pdf->Cell(40, 6, utf8_decode("En proceso: $enProceso"), 0, 0, 'L');

        // Pendientes
        $pdf->SetTextColor(231, 76, 60);
        $pdf->Cell(40, 6, utf8_decode("Pendientes: $pendientes"), 0, 1, 'L');

        // Reset color
        $pdf->SetTextColor(0, 0, 0);

        // Footer final
        $pdf->Ln(5);
        $pdf->SetFont('Arial', 'I', 8);
        $pdf->SetTextColor(127, 140, 141);
        $pdf->Cell(0, 5, utf8_decode('Reporte generado automáticamente por el sistema de gestión de tareas'), 0, 1, 'C');

        return response($pdf->Output('S', 'reporte_tareas.pdf'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="reporte_tareas_' . strtolower($mesActual) . '_' . $añoActual . '.pdf"');
    }
}
