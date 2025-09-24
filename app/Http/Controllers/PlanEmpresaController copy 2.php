<?php

namespace App\Http\Controllers;

use App\Models\ComentarioPlan;
use App\Models\Company;
use App\Models\EmpresaVideo;
use App\Models\PlanEmpresa;
use App\Models\VideoSeguimiento;
use FPDF;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class PlanEmpresaController extends Controller
{
    public function index()
    {
        $empresas = Company::with(['planEmpresa.comentarios' => function ($query) {
            $query->with('user'); // si quieres mostrar autor comentario
        }, 'category', 'paquete'])->get();

        $planes = $empresas->map(function ($empresa) {
            return [
                'id' => $empresa->planEmpresa->id ?? null,
                'empresa_id' => $empresa->id,
                'tiktok_mes' => $empresa->planEmpresa->tiktok_mes ?? '',
                'tiktok_semana' => $empresa->planEmpresa->tiktok_semana ?? '',
                'facebook_mes' => $empresa->planEmpresa->facebook_mes ?? '',
                'facebook_semana' => $empresa->planEmpresa->facebook_semana ?? '',
                'instagram_mes' => $empresa->planEmpresa->instagram_mes ?? '',
                'instagram_semana' => $empresa->planEmpresa->instagram_semana ?? '',
                'mensajes' => $empresa->planEmpresa->mensajes ?? '',
                'empresa' => [
                    'id' => $empresa->id,
                    'name' => $empresa->name,
                    'influencer' => $empresa->influencer,
                    'category_name' => $empresa->category->name ?? 'Sin categoría',
                    'paquete_nombre' => $empresa->paquete->nombre_paquete ?? 'Sin paquete',
                ],
                'comentarios' => $empresa->planEmpresa->comentarios ?? [],

            ];
        });

        return Inertia::render('PlanesEmpresas/Index', [
            'planes' => $planes,
        ]);
    }
    public function save(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'empresa_id' => 'required|exists:companies,id',
            'tiktok_mes' => 'nullable|string',
            'tiktok_semana' => 'nullable|string',
            'facebook_mes' => 'nullable|string',
            'facebook_semana' => 'nullable|string',
            'instagram_mes' => 'nullable|string',
            'instagram_semana' => 'nullable|string',
            'mensajes' => 'nullable|string',
        ])->validate();

        $plan = PlanEmpresa::updateOrCreate(
            ['empresa_id' => $validated['empresa_id']],
            $validated
        );

        return back()->with('success', 'Plan guardado correctamente.');
    }
    public function addComment(Request $request)
    {
        $request->validate([
            'contenido' => 'required|string',
            'plan_empresa_id' => 'required|exists:planes_empresas,id',
        ]);

        ComentarioPlan::create([
            'contenido' => $request->contenido,
            'plan_empresa_id' => $request->plan_empresa_id,
            'user_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Comentario agregado');
    }
    public function updateComment(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:comentarios_planes,id',
            'contenido' => 'required|string',
        ]);

        $comentario = ComentarioPlan::findOrFail($validated['id']);
        $comentario->contenido = $validated['contenido'];
        $comentario->save();

        return redirect()->back()->with('success', 'Comentario actualizado.');
    }


    public function generarPDF()
    {
        $empresas = Company::with(['planEmpresa.comentarios.user', 'category', 'paquete'])->get();

        $pdf = new Fpdf();
        $pdf->AddPage('L'); // Horizontal
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 10, 'Reporte de Planes de Empresas', 0, 1, 'C');

        $pdf->Ln(5);

        foreach ($empresas as $empresa) {
            $plan = $empresa->planEmpresa;

            // === Datos de empresa ===
            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(30, 8, 'Empresa:', 0, 0);
            $pdf->SetFont('Arial', '', 10);
            $pdf->Cell(80, 8, utf8_decode($empresa->name), 0, 1);

            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(30, 8, 'Categoría:', 0, 0);
            $pdf->SetFont('Arial', '', 10);
            $pdf->Cell(80, 8, utf8_decode($empresa->category->name ?? 'Sin categoría'), 0, 1);

            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(30, 8, 'Plan:', 0, 0);
            $pdf->SetFont('Arial', '', 10);
            $pdf->Cell(80, 8, utf8_decode($empresa->paquete->nombre_paquete ?? 'Sin paquete'), 0, 1);

            $pdf->SetFont('Arial', 'B', 10);
            $pdf->Cell(30, 8, 'Influencer:', 0, 0);
            $pdf->SetFont('Arial', '', 10);
            $pdf->Cell(80, 8, utf8_decode($empresa->influencer ?? 'N/A'), 0, 1);

            $pdf->Ln(2);

            // === Tabla de plan ===
            if ($plan) {
                $pdf->SetFont('Arial', 'B', 9);
                $headers = ['TikTok (Mes)', 'TikTok (Semana)', 'Facebook (Mes)', 'Facebook (Semana)', 'Instagram (Mes)', 'Instagram (Semana)', 'Mensajes'];
                $widths = [35, 35, 35, 35, 35, 35, 45];

                foreach ($headers as $i => $header) {
                    $pdf->Cell($widths[$i], 8, utf8_decode($header), 1, 0, 'C');
                }
                $pdf->Ln();

                $pdf->SetFont('Arial', '', 9);
                $data = [
                    $plan->tiktok_mes ?? '',
                    $plan->tiktok_semana ?? '',
                    $plan->facebook_mes ?? '',
                    $plan->facebook_semana ?? '',
                    $plan->instagram_mes ?? '',
                    $plan->instagram_semana ?? '',
                    $plan->mensajes ?? '',
                ];

                foreach ($data as $i => $value) {
                    $pdf->Cell($widths[$i], 8, utf8_decode($value), 1);
                }
                $pdf->Ln();
            } else {
                $pdf->SetFont('Arial', 'I', 9);
                $pdf->Cell(0, 8, 'Sin plan registrado.', 1, 1);
            }

            // === Comentarios ===
            if ($plan && $plan->comentarios && count($plan->comentarios)) {
                $pdf->Ln(2);
                $pdf->SetFont('Arial', 'B', 9);
                $pdf->Cell(0, 6, 'Comentarios:', 0, 1);

                $pdf->SetFont('Arial', '', 8);
                $pdf->SetTextColor(60, 60, 60);
                foreach ($plan->comentarios as $comentario) {
                    $autor = $comentario->user->name ?? 'Anónimo';
                    $contenido = $comentario->contenido;

                    $pdf->MultiCell(0, 6, utf8_decode("- {$autor}: {$contenido}"), 0, 1);
                }
                $pdf->SetTextColor(0, 0, 0);
            }

            $pdf->Ln(6);
            $pdf->Line(10, $pdf->GetY(), 285, $pdf->GetY()); // Línea separadora
            $pdf->Ln(6);
        }

        return response($pdf->Output('S'), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="reporte_planes_empresas.pdf"');
    }

    public function seguimientoVideos($empresaId)
    {
        $empresa = Company::findOrFail($empresaId);
        $videos = VideoSeguimiento::where('empresa_id', $empresaId)->get();

        return inertia('PlanesEmpresas/VideosSeguimiento', [
            'empresa' => $empresa,
            'videos' => $videos,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'empresa_id' => 'required|exists:companies,id',
            'nombre' => 'required|string',
            'semana' => 'required|string',
            'fecha_produccion' => 'nullable|date',
            'fecha_edicion' => 'nullable|date',
            'fecha_entrega' => 'nullable|date',
            'estrategia' => 'nullable|string',
            'retroalimentacion' => 'nullable|string',
        ]);

        $now = Carbon::now()->locale('es');

        $data['year'] = $now->year;
        $data['mes'] = ucfirst($now->translatedFormat('F'));
        $data['estado_entrega'] = 'Pendiente';
        $data['estado_edicion'] = 'Pendiente';
        $data['estado_entrega_final'] = 'Pendiente';

        VideoSeguimiento::create($data);


        return redirect()->back()->with('success', 'Video creado correctamente.');
    }
    public function update(Request $request, VideoSeguimiento $video)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string',
            'semana' => 'required|string',
            'fecha_produccion' => 'nullable|date',
            'fecha_edicion' => 'nullable|date',
            'fecha_entrega' => 'nullable|date',
            'estrategia' => 'nullable|string',
            'retroalimentacion' => 'nullable|string',
        ]);

        $video->update($validatedData);

        return redirect()->back()->with('success', 'Video actualizado correctamente.');
    }
    public function actualizarEstado(Request $request, VideoSeguimiento $video)
    {
        $request->validate([
            'campo' => 'required|in:estado_entrega,estado_edicion,estado_entrega_final',
            'valor' => 'required|in:Pendiente,Completado',
        ]);

        $video->{$request->campo} = $request->valor;
        $video->save();

        // En lugar de return response()->json(...)
        // Haz un redirect para que Inertia recargue la página (o solo parte de ella)
        return redirect()->back();
    }


    public function generarPDFSeguimientoVideos($empresaId)
    {
        $empresa = Company::findOrFail($empresaId);
        $videos = VideoSeguimiento::where('empresa_id', $empresaId)->get();

        $pdf = new Fpdf();
        $pdf->AddPage('L'); // horizontal
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 10, utf8_decode('Seguimiento de Videos - ' . $empresa->name), 0, 1, 'C');
        $pdf->Ln(5);

        // Datos de la empresa
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(40, 8, 'Empresa:', 0, 0);
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 8, utf8_decode($empresa->name), 0, 1);

        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(40, 8, 'Categoría:', 0, 0);
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 8, utf8_decode($empresa->category->name ?? 'Sin categoría'), 0, 1);

        $pdf->Ln(10);

        // Encabezado tabla videos
        $pdf->SetFont('Arial', 'B', 10);
        $header = ['Nombre', 'Semana', 'F. Producción', 'Estado Entrega', 'F. Edición', 'Estado Edición', 'F. Entrega', 'Estado Entrega Final', 'Estrategia', 'Retroalimentación'];
        $widths = [35, 20, 25, 25, 25, 25, 25, 30, 40, 50];

        foreach ($header as $i => $heading) {
            $pdf->Cell($widths[$i], 8, utf8_decode($heading), 1, 0, 'C');
        }
        $pdf->Ln();

        $pdf->SetFont('Arial', '', 9);
        foreach ($videos as $video) {
            $pdf->Cell($widths[0], 8, utf8_decode($video->nombre), 1);
            $pdf->Cell($widths[1], 8, utf8_decode($video->semana), 1);
            $pdf->Cell($widths[2], 8, $video->fecha_produccion ? $video->fecha_produccion->format('d/m/Y') : '', 1);
            $pdf->Cell($widths[3], 8, utf8_decode($video->estado_entrega), 1);
            $pdf->Cell($widths[4], 8, $video->fecha_edicion ? $video->fecha_edicion->format('d/m/Y') : '', 1);
            $pdf->Cell($widths[5], 8, utf8_decode($video->estado_edicion), 1);
            $pdf->Cell($widths[6], 8, $video->fecha_entrega ? $video->fecha_entrega->format('d/m/Y') : '', 1);
            $pdf->Cell($widths[7], 8, utf8_decode($video->estado_entrega_final), 1);
            $pdf->Cell($widths[8], 8, utf8_decode($video->estrategia ?? ''), 1);
            $pdf->Cell($widths[9], 8, utf8_decode($video->retroalimentacion ?? ''), 1);
            $pdf->Ln();
        }

        $filename = 'seguimiento_videos_empresa_' . $empresa->id . '.pdf';

        return response($pdf->Output('S'), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generarPDFseguimiento($empresaId)
    {
        $empresa = Company::findOrFail($empresaId);
        $videos = VideoSeguimiento::where('empresa_id', $empresaId)->get();

        // Agrupar videos por semana
        $videosPorSemana = [];
        foreach ($videos as $video) {
            $semana = $video->semana ?: 'Sin Semana';
            if (!isset($videosPorSemana[$semana])) {
                $videosPorSemana[$semana] = [];
            }
            $videosPorSemana[$semana][] = $video;
        }

        // Ordenar semanas numéricamente si vienen en formato "Semana X"
        uksort($videosPorSemana, function ($a, $b) {
            $numA = (int) filter_var($a, FILTER_SANITIZE_NUMBER_INT);
            $numB = (int) filter_var($b, FILTER_SANITIZE_NUMBER_INT);
            return $numA <=> $numB;
        });

        $pdf = new \FPDF('L', 'mm', 'A4');
        $pdf->AddPage();

        // Fuente título y subtítulo
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(0, 10, utf8_decode('Reporte de Seguimiento de Videos - ' . $empresa->name), 0, 1, 'C');

        // Fecha actual
        $mes = ucfirst(strftime('%B'));
        $anio = date('Y');
        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(0, 10, "$mes $anio", 0, 1, 'C');

        $pdf->Ln(5);

        // Datos empresa (puedes agregar más o menos según necesites)
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(40, 8, 'Categoria:', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(0, 8, utf8_decode($empresa->company_category_id), 0, 1);

        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(40, 8, 'Duracion Contrato:', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(0, 8, utf8_decode($empresa->contract_duration), 0, 1);

        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Cell(40, 8, 'Inicio Contrato:', 0);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(0, 8, utf8_decode($empresa->start_date), 0, 1);

        $pdf->Ln(10);

        // Configuración de ancho columnas para tabla (ajusta a tus necesidades)
        $w = [
            'Nombre' => 40,
            'Fecha Producción' => 30,
            'Estado Entrega' => 25,
            'Fecha Edición' => 30,
            'Estado Edición' => 25,
            'Fecha Entrega' => 30,
            'Estado Entrega Final' => 30,
            'Estrategia' => 40,
            'Retroalimentación' => 50,
        ];

        // Recorrer semanas
        foreach ($videosPorSemana as $semana => $videosSemana) {
            $pdf->SetFont('Arial', 'B', 14);
            $pdf->SetFillColor(200, 200, 200);
            $pdf->Cell(array_sum($w), 10, utf8_decode($semana), 0, 1, 'L', true);

            // Encabezados tabla
            $pdf->SetFont('Arial', 'B', 9);
            foreach ($w as $col => $ancho) {
                $pdf->Cell($ancho, 8, utf8_decode($col), 1, 0, 'C');
            }
            $pdf->Ln();

            // Datos de videos
            $pdf->SetFont('Arial', '', 8);
            foreach ($videosSemana as $video) {
                $pdf->Cell($w['Nombre'], 7, utf8_decode($video->nombre), 1);
                $pdf->Cell($w['Fecha Producción'], 7, utf8_decode($video->fecha_produccion ?? '-'), 1);
                $pdf->Cell($w['Estado Entrega'], 7, utf8_decode($video->estado_entrega), 1);
                $pdf->Cell($w['Fecha Edición'], 7, utf8_decode($video->fecha_edicion ?? '-'), 1);
                $pdf->Cell($w['Estado Edición'], 7, utf8_decode($video->estado_edicion), 1);
                $pdf->Cell($w['Fecha Entrega'], 7, utf8_decode($video->fecha_entrega ?? '-'), 1);
                $pdf->Cell($w['Estado Entrega Final'], 7, utf8_decode($video->estado_entrega_final), 1);
                $pdf->Cell($w['Estrategia'], 7, utf8_decode($video->estrategia ?? '-'), 1);
                $pdf->Cell($w['Retroalimentación'], 7, utf8_decode($video->retroalimentacion ?? '-'), 1);
                $pdf->Ln();
            }

            $pdf->Ln(10); // espacio después de cada semana
        }

        return response($pdf->Output('S'), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="seguimiento_videos_' . $empresa->id . '.pdf"');
    }
}
