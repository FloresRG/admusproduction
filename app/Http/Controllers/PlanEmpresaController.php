<?php

namespace App\Http\Controllers;

use App\Models\ComentarioPlan;
use App\Models\Company;
use App\Models\EmpresaVideo;
use App\Models\PlanEmpresa;
use App\Models\TareaSeguimiento;
use App\Models\User;
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
        $companies = Company::with(['category', 'paquete'])
            ->where('estado', 'activo') // 👈 FILTRO AÑADIDO
            ->get();

        return Inertia::render('PlanesEmpresas/Index', [
            'companies' => $companies
        ]);
    }
    public function seguimientoTareas(Request $request, $empresaId)
    {
        $empresa = Company::with(['category', 'paquete'])->findOrFail($empresaId);

        $anio = $request->get('anio', now()->year);
        $mes = str_pad($request->get('mes', now()->format('m')), 2, '0', STR_PAD_LEFT);
        $hoy = Carbon::today()->toDateString();
        $tareas = TareaSeguimiento::where('empresa_id', $empresaId)
            ->where('anio', $anio)
            ->where('mes', $mes)
            ->get();

        $usersProduccion = User::role('camarografo')->get(['id', 'name']);
        $usersEdicion = User::role('editor')->get(['id', 'name']);

        return inertia('PlanesEmpresas/TareaSeguimiento', [
            'empresa' => $empresa,
            'tareas' => $tareas,
            'usersProduccion' => $usersProduccion,
            'usersEdicion' => $usersEdicion,
            'mensaje' => session('message'),
            'mes' => $mes,
            'anio' => $anio,
        ]);
    }

    public function seguimientoTareasTodos(Request $request)
    {
        $anio = $request->get('anio', now()->year);
        $mes = str_pad($request->get('mes', now()->format('m')), 2, '0', STR_PAD_LEFT);

        $empresa = $request->get('empresa');
        $titulo = $request->get('titulo');

        $tareas = TareaSeguimiento::where('anio', $anio)
            ->where('mes', $mes)
            ->when($empresa, function ($q) use ($empresa) {
                $q->whereHas('empresa', function ($sub) use ($empresa) {
                    $sub->where('name', 'like', "%{$empresa}%");
                });
            })
            ->when($titulo, function ($q) use ($titulo) {
                $q->where('titulo', 'like', "%{$titulo}%");
            })
            ->with('empresa')
            ->get();

        $usersProduccion = User::role('camarografo')->get(['id', 'name']);
        $usersEdicion = User::role('editor')->get(['id', 'name']);

        return inertia('PlanesEmpresas/TareaSeguimientoTodos', [
            'tareas' => $tareas,
            'usersProduccion' => $usersProduccion,
            'usersEdicion' => $usersEdicion,
            'mensaje' => session('message'),
            'mes' => $mes,
            'anio' => $anio,
            'filtros' => [
                'empresa' => $empresa,
                'titulo' => $titulo,
            ],
        ]);
    }

    public function seguimientoTareasPendientes(Request $request)
    {
        $anio = $request->get('anio', now()->year);
        $mes = str_pad($request->get('mes', now()->format('m')), 2, '0', STR_PAD_LEFT);

        // Traemos todas las tareas pendientes de producción de todas las empresas
        $tareas = TareaSeguimiento::where('anio', $anio)
            ->where('mes', $mes)
            ->where(function ($q) {
                $q->where('estado_produccion', 'pendiente')
                    ->orWhere('estado_edicion', 'pendiente')
                    ->orWhere('estado_entrega', 'pendiente');
            })
            ->with('empresa')
            ->get();

        $usersProduccion = User::role('camarografo')->get(['id', 'name']);
        $usersEdicion = User::role('editor')->get(['id', 'name']);

        return inertia('PlanesEmpresas/TareaSeguimientoPendientes', [
            'tareas' => $tareas,
            'usersProduccion' => $usersProduccion,
            'usersEdicion' => $usersEdicion,
            'mensaje' => session('message'),
            'mes' => $mes,
            'anio' => $anio,
        ]);
    }
    public function seguimientoTareasPendientesHoy(Request $request)
    {
        $anio = $request->get('anio', now()->year);
        $mes = str_pad($request->get('mes', now()->format('m')), 2, '0', STR_PAD_LEFT);
        $hoy = now()->toDateString(); // yyyy-mm-dd

        $tareas = TareaSeguimiento::where('anio', $anio)
            ->where('mes', $mes)
            ->where(function ($q) use ($hoy) {
                // Producción pendiente y fecha igual a hoy
                $q->where(function ($sub) use ($hoy) {
                    $sub->where('estado_produccion', 'pendiente')
                        ->where(function ($f) use ($hoy) {
                            $f->whereDate('fecha_produccion', $hoy)
                                ->orWhereDate('fecha_nueva_produccion', $hoy);
                        });
                })
                    // Edición pendiente y fecha igual a hoy
                    ->orWhere(function ($sub) use ($hoy) {
                        $sub->where('estado_edicion', 'pendiente')
                            ->where(function ($f) use ($hoy) {
                                $f->whereDate('fecha_edicion', $hoy)
                                    ->orWhereDate('fecha_nueva_edicion', $hoy);
                            });
                    })
                    // Entrega pendiente y fecha igual a hoy
                    ->orWhere(function ($sub) use ($hoy) {
                        $sub->where('estado_entrega', 'pendiente')
                            ->where(function ($f) use ($hoy) {
                                $f->whereDate('fecha_entrega', $hoy)
                                    ->orWhereDate('fecha_nueva_entrega', $hoy);
                            });
                    });
            })
            ->with('empresa')
            ->get();

        $usersProduccion = User::role('camarografo')->get(['id', 'name']);
        $usersEdicion = User::role('editor')->get(['id', 'name']);

        return inertia('PlanesEmpresas/TareaSeguimientoPendientesHoy', [
            'tareas' => $tareas,
            'usersProduccion' => $usersProduccion,
            'usersEdicion' => $usersEdicion,
            'mensaje' => session('message'),
            'mes' => $mes,
            'anio' => $anio,
        ]);
    }
    public function seguimientoTareasPendientesHoyProduccion(Request $request)
    {
        $anio = $request->get('anio', now()->year);
        $mes = str_pad($request->get('mes', now()->format('m')), 2, '0', STR_PAD_LEFT);
        $hoy = now()->toDateString(); // yyyy-mm-dd

        $tareas = TareaSeguimiento::where('anio', $anio)
            ->where('mes', $mes)
            ->where('estado_produccion', 'pendiente')
            ->where(function ($q) use ($hoy) {
                $q->whereDate('fecha_produccion', $hoy)
                    ->orWhereDate('fecha_nueva_produccion', $hoy);
            })
            ->with('empresa')
            ->get();

        $usersProduccion = User::role('camarografo')->get(['id', 'name']);
        $usersEdicion = User::role('editor')->get(['id', 'name']);

        return inertia('PlanesEmpresas/TareaSeguimientoPendientesHoyProduccion', [
            'tareas' => $tareas,
            'usersProduccion' => $usersProduccion,
            'usersEdicion' => $usersEdicion,
            'mensaje' => session('message'),
            'mes' => $mes,
            'anio' => $anio,
        ]);
    }
    public function seguimientoTareasPendientesHoyEdicion(Request $request)
    {
        $anio = $request->get('anio', now()->year);
        $mes = str_pad($request->get('mes', now()->format('m')), 2, '0', STR_PAD_LEFT);
        $hoy = now()->toDateString(); // yyyy-mm-dd

        $tareas = TareaSeguimiento::where('anio', $anio)
            ->where('mes', $mes)
            ->where('estado_edicion', 'pendiente')
            ->where(function ($q) use ($hoy) {
                $q->whereDate('fecha_edicion', $hoy)
                    ->orWhereDate('fecha_nueva_edicion', $hoy);
            })
            ->with('empresa')
            ->get();

        $usersProduccion = User::role('camarografo')->get(['id', 'name']);
        $usersEdicion = User::role('editor')->get(['id', 'name']);

        return inertia('PlanesEmpresas/TareaSeguimientoPendientesHoyEdicion', [
            'tareas' => $tareas,
            'usersProduccion' => $usersProduccion,
            'usersEdicion' => $usersEdicion,
            'mensaje' => session('message'),
            'mes' => $mes,
            'anio' => $anio,
        ]);
    }
    public function seguimientoTareasPendientesHoyEdicionRevision(Request $request)
    {
        $anio = $request->get('anio', now()->year);
        $mes = str_pad($request->get('mes', now()->format('m')), 2, '0', STR_PAD_LEFT);
        $hoy = now()->toDateString(); // yyyy-mm-dd

        $tareas = TareaSeguimiento::where('anio', $anio)
            ->where('mes', $mes)
            ->where('estado_edicion', 'revision')
            ->with('empresa')
            ->get();

        $usersProduccion = User::role('camarografo')->get(['id', 'name']);
        $usersEdicion = User::role('editor')->get(['id', 'name']);

        return inertia('PlanesEmpresas/TareaSeguimientoPendientesHoyRevision', [
            'tareas' => $tareas,
            'usersProduccion' => $usersProduccion,
            'usersEdicion' => $usersEdicion,
            'mensaje' => session('message'),
            'mes' => $mes,
            'anio' => $anio,
        ]);
    }
    public function seguimientoTareasPublicados(Request $request)
    {
        $anio = $request->get('anio', now()->year);
        $mes = str_pad($request->get('mes', now()->format('m')), 2, '0', STR_PAD_LEFT);

        $tareas = TareaSeguimiento::where('anio', $anio)
            ->where('mes', $mes)
            ->where('estado_entrega', 'completado')
            ->with('empresa')
            ->get();

        $usersProduccion = User::role('camarografo')->get(['id', 'name']);
        $usersEdicion = User::role('editor')->get(['id', 'name']);

        return inertia('PlanesEmpresas/TareaSeguimientoPublicados', [
            'tareas' => $tareas,
            'usersProduccion' => $usersProduccion,
            'usersEdicion' => $usersEdicion,
            'mensaje' => session('message'),
            'mes' => $mes,
            'anio' => $anio,
        ]);
    }

    public function generarTareas(Request $request, $empresaId)
    {
        $empresa = Company::findOrFail($empresaId);

        $anio = $request->get('anio', now()->year);
        $mes = $request->get('mes', now()->format('m'));

        // Verifica si ya tiene tareas para ese mes/año
        $existing = TareaSeguimiento::where('empresa_id', $empresaId)
            ->where('anio', $anio)
            ->where('mes', $mes)
            ->exists();

        if ($existing) {
            return redirect()->back()->with('message', 'Ya existen tareas para este mes.');
        }

        // Crear 4 semanas, 3 videos por semana
        for ($sem = 1; $sem <= 4; $sem++) {
            for ($i = 1; $i <= 3; $i++) {
                TareaSeguimiento::create([
                    'empresa_id' => $empresaId,
                    'titulo' => "Video {$i}",
                    'anio' => (string)$anio,
                    'mes' => (string)$mes,
                    'semana' => (string)$sem,
                    'fecha_produccion' => null,
                    'estado_produccion' => 'pendiente',
                    'fecha_edicion' => null,
                    'estado_edicion' => 'pendiente',
                    'fecha_entrega' => null,
                    'estado_entrega' => 'pendiente',
                    'estrategia' => '',
                    'comentario' => '',
                    'guion' => '',
                ]);
            }
        }

        return redirect()->back()->with('message', 'Tareas generadas exitosamente.');
    }
    public function crear(Request $request, $empresaId)
    {
        $mes = $request->get('mes', now()->format('m')); // Usa el mes actual si no se envía
        $anio = $request->get('anio', now()->year);      // Usa el año actual si no se envía

        $request->validate([
            'titulo' => 'required|string|max:255',
            'semana' => 'required|in:1,2,3,4',
        ]);

        TareaSeguimiento::create([
            'empresa_id' => $empresaId,
            'titulo' => $request->titulo,
            'anio' => (string)$anio,
            'mes' => str_pad($mes, 2, '0', STR_PAD_LEFT),
            'semana' => $request->semana,
            'fecha_produccion' => null,
            'estado_produccion' => 'pendiente',
            'fecha_edicion' => null,
            'estado_edicion' => 'pendiente',
            'fecha_entrega' => null,
            'estado_entrega' => 'pendiente',
            'estrategia' => '',
            'comentario' => '',
            'guion' => '',
        ]);

        return redirect()->back()->with('message', 'Tarea creada exitosamente.');
    }


    public function actualizarTarea(Request $request, $tareaId)
    {
        $tarea = TareaSeguimiento::findOrFail($tareaId);

        $validated = $request->validate([
            'titulo' => 'nullable|string|max:255',
            'fecha_produccion' => 'nullable|date',
            'fecha_nueva_produccion' => 'nullable|date',
            'razon_produccion' => 'nullable|string|max:1000',
            'estado_produccion' => 'nullable|string|max:255',
            'user_produccion_id' => 'nullable|integer|exists:users,id', // Validar el ID del usuario
            'fecha_edicion' => 'nullable|date',
            'fecha_nueva_edicion' => 'nullable|date',
            'razon_edicion' => 'nullable|string|max:1000',
            'estado_edicion' => 'nullable|string|max:255',
            'user_edicion_id' => 'nullable|integer|exists:users,id', // Validar el ID del usuario
            'fecha_entrega' => 'nullable|date',
            'fecha_nueva_entrega' => 'nullable|date',
            'razon_entrega' => 'nullable|string|max:1000',
            'estado_entrega' => 'nullable|string|max:255',
            'estrategia' => 'nullable|string|max:1000',
            'comentario' => 'nullable|string|max:1000',
            'guion' => 'nullable|string|max:1000',
        ]);

        $tarea->update($validated);

        return redirect()->back()->with('success', 'Tarea actualizada correctamente.');
    }
}
