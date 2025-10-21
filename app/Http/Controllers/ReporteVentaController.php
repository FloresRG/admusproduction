<?php

namespace App\Http\Controllers;

use App\Models\ReporteVenta;
use App\Models\ActividadRealizada;
use App\Models\EstrategiaUtilizada;
use App\Models\ResultadoEquipo;
use App\Models\Dificultad;
use App\Models\MetaSiguiente;
use App\Models\SeguimientoEmpresa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReporteVentaController extends Controller
{
    public function index()
    {
        $reportes = ReporteVenta::with([
            'actividades',
            'estrategias',
            'resultados',
            'dificultades',
            'metas',
            'empresas' // suponiendo que tienes esta relación para las empresas relacionadas
        ])
            ->where('jefe_ventas_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Reportes/Index', [
            'reportes' => $reportes
        ]);
    }
    public function indexgeneral()
    {
        $reportes = ReporteVenta::with([
            'jefeVentas:id,name',    // <-- agregar esta relación para traer datos del usuario
            'actividades',
            'estrategias',
            'resultados',
            'dificultades',
            'metas',
            'empresas'
        ])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Reportes/Indexgeneral', [
            'reportes' => $reportes
        ]);
    }
    public function create()
    {
        $empresas = \App\Models\SeguimientoEmpresa::with(['paquete', 'usuario'])
            ->get()
            ->map(function ($empresa) {
                return [
                    'id' => $empresa->id,
                    'nombre_empresa' => $empresa->nombre_empresa,
                    'estado' => $empresa->estado,
                    'fecha_inicio' => $empresa->fecha_inicio,
                    'fecha_fin' => $empresa->fecha_fin,
                    'descripcion' => $empresa->descripcion,
                    'celular' => $empresa->celular,
                    'paquete' => optional($empresa->paquete)->nombre_paquete ?? null,
                    'usuario' => optional($empresa->usuario)->name ?? null,
                ];
            });

        return Inertia::render('Reportes/Create', [
            'empresas' => $empresas,
        ]);
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

            'seguimiento_empresa_ids' => 'array',
            'seguimiento_empresa_ids.*' => 'integer|exists:seguimiento_empresa,id',

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

            // Asociar empresas
            $reporte->empresas()->attach($data['seguimiento_empresa_ids'] ?? []);

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
    public function edit($id)
    {
        $reporte = ReporteVenta::with([
            'actividades',
            'estrategias',
            'resultados',
            'dificultades',
            'metas',
            'empresas'
        ])->findOrFail($id);

        $empresas = SeguimientoEmpresa::all(); // para mostrar las opciones en el formulario si lo necesitas

        return Inertia::render('Reportes/Edit', [
            'reporte' => $reporte,
            'empresas' => $empresas,
        ]);
    }
    public function update(Request $request, $id)
    {
        $reporte = ReporteVenta::findOrFail($id);

        $data = $request->validate([
            'tipo_periodo' => 'required|in:diario,semanal,mensual',
            'fecha_reporte' => 'nullable|date',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'observaciones' => 'nullable|string',
            'recomendaciones' => 'nullable|string',
            'seguimiento_empresa_ids' => 'array',
            'seguimiento_empresa_ids.*' => 'integer|exists:seguimiento_empresa,id',
            // Si quieres validar actividades, estrategias, etc. puedes hacerlo igual que en store
        ]);

        DB::transaction(function () use ($reporte, $data, $request) {
            $reporte->update([
                'tipo_periodo' => $data['tipo_periodo'],
                'fecha_reporte' => $data['fecha_reporte'] ?? now()->toDateString(),
                'fecha_inicio' => $data['fecha_inicio'],
                'fecha_fin' => $data['fecha_fin'],
                'observaciones' => $data['observaciones'] ?? null,
                'recomendaciones' => $data['recomendaciones'] ?? null,
            ]);

            // Sincronizar empresas
            $reporte->empresas()->sync($data['seguimiento_empresa_ids'] ?? []);

            // Aquí puedes borrar y crear o actualizar relaciones (actividades, estrategias, etc.)
            // Esto depende de la lógica y estructura que tengas para editar esos arrays
        });

        return redirect()->route('reportes.indexgeneral')->with('success', 'Reporte actualizado correctamente.');
    }


    public function show($id)
    {
        $reporte = ReporteVenta::with([
            'actividades',
            'estrategias',
            'resultados',
            'dificultades',
            'metas',
            'empresas'
        ])->findOrFail($id);

        return Inertia::render('Reportes/Show', [
            'reporte' => $reporte,
        ]);
    }
    public function showuser($id)
    {
        $reporte = ReporteVenta::with([
            'actividades',
            'estrategias',
            'resultados',
            'dificultades',
            'metas',
            'empresas'
        ])->findOrFail($id);

        return Inertia::render('Reportes/Showuser', [
            'reporte' => $reporte,
        ]);
    }
    public function pdf($id)
    {
        $reporte = ReporteVenta::with([
            'actividades',
            'estrategias',
            'resultados',
            'dificultades',
            'metas',
            'empresas'
        ])->findOrFail($id);

        $pdf = new \FPDF('P', 'mm', 'A4'); // Carta o A4 (A4 es más estándar)
        $pdf->AddPage();

        // Logos
        $logoPath = public_path('logo.jpeg');
        $pdf->Image($logoPath, 10, 10, 30);
        $pdf->Image($logoPath, 170, 10, 30);

        // Título
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->SetY(15);
        $pdf->Cell(0, 10, 'Admus Productions', 0, 1, 'C');

        $pdf->Ln(5);

        // Datos generales
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(0, 10, "Reporte de Venta #" . $reporte->id, 0, 1, 'C');

        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(0, 7, "Periodo: {$reporte->fecha_inicio} - {$reporte->fecha_fin}", 0, 1);
        $pdf->Cell(0, 7, "Creado: " . date('d/m/Y', strtotime($reporte->created_at)), 0, 1);

        $pdf->Ln(3);
        $pdf->MultiCell(0, 6, "Observaciones: " . ($reporte->observaciones ?? 'N/A'));
        $pdf->MultiCell(0, 6, "Recomendaciones: " . ($reporte->recomendaciones ?? 'N/A'));
        $pdf->Ln(4);

        // Empresas
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 7, "Empresas relacionadas:", 0, 1);
        $pdf->SetFont('Arial', '', 11);

        if ($reporte->empresas->count() > 0) {
            foreach ($reporte->empresas as $empresa) {
                $pdf->Cell(0, 6, "- {$empresa->nombre_empresa} ({$empresa->estado})", 0, 1);
            }
        } else {
            $pdf->Cell(0, 6, "No hay empresas asignadas.", 0, 1);
        }

        $pdf->Ln(4);

        // Función para imprimir listas compactas para que no se pase de página
        $printList = function ($title, $items, $formatter) use ($pdf) {
            $pdf->SetFont('Arial', 'B', 13);
            $pdf->Cell(0, 7, "$title:", 0, 1);
            $pdf->SetFont('Arial', '', 10);
            if (count($items) > 0) {
                foreach ($items as $item) {
                    $text = $formatter($item);
                    // MultiCell para texto con saltos y que ajuste
                    $pdf->MultiCell(0, 5, $text);
                    $pdf->Ln(2);
                }
            } else {
                $pdf->Cell(0, 6, "No hay $title.", 0, 1);
            }
            $pdf->Ln(4);
        };

        $printList('Actividades', $reporte->actividades, function ($a) {
            return "- Tipo: {$a->tipo_actividad}\n  Descripcion: {$a->descripcion}\n  Fecha: {$a->fecha_actividad}\n  Observaciones: " . ($a->observaciones ?? 'N/A');
        });

        $printList('Estrategias', $reporte->estrategias, function ($e) {
            return "- Método: {$e->metodo_estrategia}\n  Herramientas: {$e->herramientas_usadas}\n  Resultado esperado: {$e->resultado_esperado}";
        });

        $printList('Resultados', $reporte->resultados, function ($r) {
            return "- Indicador: {$r->indicador}\n  Meta: {$r->meta_mes}\n  Real: {$r->resultado_real}";
        });

        $printList('Dificultades', $reporte->dificultades, function ($d) {
            return "- Tipo: {$d->tipo}\n  Descripcion: {$d->descripcion}\n  Impacto: {$d->impacto}\n  Accion tomada: " . ($d->accion_tomada ?? 'N/A');
        });

        $printList('Metas', $reporte->metas, function ($m) {
            return "- Objetivo: {$m->objetivo}\n  Accion: {$m->accion_implementar}\n  Responsable: {$m->responsable}\n  Fecha cumplimiento: {$m->fecha_cumplimiento}";
        });

        $pdf->Output("I", "ReporteVenta_{$reporte->id}.pdf");
        exit;
    }
}
