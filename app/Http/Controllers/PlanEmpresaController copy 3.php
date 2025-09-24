<?php

namespace App\Http\Controllers;

use App\Models\ComentarioPlan;
use App\Models\Company;
use App\Models\EmpresaVideo;
use App\Models\PlanEmpresa;
use App\Models\TareaSeguimiento;
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
        $companies = Company::with(['category', 'paquete'])->get();

        return Inertia::render('PlanesEmpresas/Index', [
            'companies' => $companies
        ]);
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
    public function seguimientoTareas($empresaId)
    {
        $empresa = Company::findOrFail($empresaId);
        $tareas = TareaSeguimiento::where('empresa_id', $empresaId)->get();

        return inertia('PlanesEmpresas/TareaSeguimiento', [
            'empresa' => $empresa,
            'tareas' => $tareas,
            'mensaje' => session('message'), // opcional
        ]);
    }

    public function generarTareas($empresaId)
    {
        $empresa = Company::findOrFail($empresaId);

        // Verifica si ya tiene tareas (opcional, para no duplicar)
        $existing = TareaSeguimiento::where('empresa_id', $empresaId)->exists();
        if ($existing) {
            return redirect()->back()->with('message', 'Ya existen tareas para esta empresa.');
        }

        $now = now();
        $anio = $now->year;
        $mes = $now->format('m'); // si lo guardas como número
        // o $now->format('Y-m') dependiendo de cómo guardes

        // Crear 4 semanas
        for ($sem = 1; $sem <= 4; $sem++) {
            // Para cada semana, 3 registros
            for ($i = 1; $i <= 3; $i++) {
                TareaSeguimiento::create([
                    'empresa_id' => $empresaId,
                    'titulo' => "Video {$i}",
                    'anio' => (string)$anio,
                    'mes' => $mes,
                    'semana' => (string)$sem,
                    // los demás campos pueden quedar en null o default
                    'fecha_produccion' => null,
                    'estado_produccion' => '',
                    'fecha_edicion' => null,
                    'estado_edicion' => '',
                    'fecha_entrega' => null,
                    'estado_entrega' => '',
                    'estrategia' => '',
                    'comentario' => '',
                    'guion' => '',
                ]);
            }
        }

        return redirect()->back()->with('message', 'Tareas generadas exitosamente.');
    }
    public function actualizarTarea(Request $request, $tareaId)
    {
        $tarea = TareaSeguimiento::findOrFail($tareaId);

        $validated = $request->validate([
            'titulo' => 'nullable|string|max:255',
            'fecha_produccion' => 'nullable|date',
            'estado_produccion' => 'nullable|string|max:255',
            'fecha_edicion' => 'nullable|date',
            'estado_edicion' => 'nullable|string|max:255',
            'fecha_entrega' => 'nullable|date',
            'estado_entrega' => 'nullable|string|max:255',
            'estrategia' => 'nullable|string|max:1000',
            'comentario' => 'nullable|string|max:1000',
            'guion' => 'nullable|string|max:1000',
        ]);

        $tarea->update($validated);

        return redirect()->back()->with('success', 'Tarea actualizada correctamente.');
    }




    public function storeTarea(Request $request, $empresaId)
    {
        // validar
        $data = $request->validate([
            'anio' => 'required|string',
            'mes' => 'required|string',
            'semana' => 'required|string',
            'titulo' => 'nullable|string',
            'fecha_produccion' => 'nullable|date',
            'estado_produccion' => 'nullable|string',
            // otros campos si vienen
        ]);

        $data['empresa_id'] = $empresaId;

        $tarea = TareaSeguimiento::create($data);

        return response()->json($tarea);
    }

    public function updateTarea(Request $request, $empresaId, $id)
    {
        $tarea = TareaSeguimiento::where('empresa_id', $empresaId)->findOrFail($id);

        $data = $request->validate([
            'titulo' => 'nullable|string',
            'fecha_produccion' => 'nullable|date',
            'estado_produccion' => 'nullable|string',
            'fecha_edicion' => 'nullable|date',
            'estado_edicion' => 'nullable|string',
            'fecha_entrega' => 'nullable|date',
            'estado_entrega' => 'nullable|string',
            'estrategia' => 'nullable|string',
            'comentario' => 'nullable|string',
            'guion' => 'nullable|string',
            // tal vez anio, mes, semana no cambien
        ]);

        $tarea->update($data);

        return response()->json($tarea);
    }
}
