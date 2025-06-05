<?php

namespace App\Http\Controllers;

use App\Models\AsignacionTarea;
use App\Models\Tarea;
use App\Models\Tipo;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TareaController extends Controller
{
    public function index()
    {
        return response()->json(Tarea::with(['tipo', 'company'])->get());
    }


    public function vertareas()
    {
        $fechas = Tarea::select('fecha')
            ->groupBy('fecha')
            ->orderBy('fecha', 'desc')
            ->pluck('fecha');

        return response()->json($fechas);
    }


    public function tareasPorFecha(Request $request)
    {
        $fecha = $request->query('fecha');

        if (!$fecha) {
            return response()->json(['message' => 'Fecha es requerida'], 400);
        }

        $tareas = Tarea::with(['tipo', 'company'])
            ->whereDate('fecha', $fecha)
            ->get();

        return response()->json($tareas);
    }


    public function store(Request $request)
{
    // 1. Validar
    $data = $request->validate([
        'titulo'      => 'required|string|max:255',
        'prioridad'   => 'nullable|string|max:255',
        'descripcion' => 'nullable|string',
        'fecha'       => 'nullable|date',
        'tipo_id'     => 'nullable|exists:tipos,id',
        'company_id'  => 'nullable|exists:companies,id',
    ]);

    // 2. Crear la tarea
    $tarea = Tarea::create($data);

    // 3. Determinar fecha de asignación: si el front envió 'fecha', usarla; si no, usar hoy.
    $fechaAsignacion = $data['fecha'] ?? Carbon::now()->toDateString();

    // 4. Buscar pasantes
    //    (a) Primero intento filtrar por tipo_id, si es que el usuario seleccionó un tipo
    $pasantesQuery = User::role('pasante');

    if (!empty($data['tipo_id'])) {
        // Asumo que existe relación User->tipos() (belongsToMany(Tipo::class, 'tipo_user'))
        $pasantesQuery = $pasantesQuery->whereHas('tipos', function($q) use ($data) {
            $q->where('tipo_id', $data['tipo_id']);
        });
    }

    $pasantes = $pasantesQuery->get();

    // Si no quedó ninguno (p. ej. no hay pasantes con ese tipo), vuelvo a cargar todos los pasantes
    if ($pasantes->isEmpty()) {
        $pasantes = User::role('pasante')->get();
    }

    // 5. Si existe al menos un pasante, elijo uno al azar
    if ($pasantes->isNotEmpty()) {
        $pasanteElegido = $pasantes->random();

        // 6. Crear la asignación
        AsignacionTarea::create([
            'user_id'  => $pasanteElegido->id,
            'tarea_id' => $tarea->id,
            'estado'   => 'pendiente',
            'detalle'  => '',
            'fecha'    => $fechaAsignacion,
        ]);
    }

    // 7. Respuesta al frontend. Ahora sí la tarea ya está asignada automáticamente.
    return response()->json(['message' => 'Tarea creada y asignada'], 201);
}


    public function update(Request $request, Tarea $tarea)
    {
        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'prioridad' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha' => 'nullable|date',
            'tipo_id' => 'nullable|exists:tipos,id',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        $tarea->update($data);

        return response()->json(['message' => 'Tarea actualizada']);
    }

    public function destroy(Tarea $tarea)
    {
        $tarea->delete();
        return response()->json(['message' => 'Tarea eliminada']);
    }

    public function asignarTareas()
    {
        $pasantes = User::role('Pasante')->get();

        if ($pasantes->isEmpty()) {
            return response()->json(['message' => 'No hay pasantes disponibles.'], 400);
        }

        $fechaActual = Carbon::now()->toDateString();
        // Obtener IDs de tareas ya asignadas en la fecha actual
        $tareasYaAsignadas = AsignacionTarea::whereDate('fecha', $fechaActual)->pluck('tarea_id')->toArray();


        // Preparar estructura: id => [user, tipos, tareas]
        $pasantesTipos = [];
        foreach ($pasantes as $pasante) {
            $tipos = DB::table('tipo_user')
                ->where('user_id', $pasante->id)
                ->pluck('tipo_id')
                ->toArray();

            $pasantesTipos[$pasante->id] = [
                'user' => $pasante,
                'tipos' => $tipos,
                'tareas' => [],
            ];
        }

        // Función para mapear prioridades a números
        $mapPrioridad = fn($prioridad) => match (strtolower($prioridad)) {
            'alta' => 1,
            'media' => 2,
            'baja' => 3,
            default => 99,
        };

        // 1. Obtener solo las tareas de la fecha actual y ordenarlas por prioridad
        $todasTareas = Tarea::whereDate('fecha', $fechaActual)->whereNotIn('id', $tareasYaAsignadas)->get()->sortBy(fn($tarea) => $mapPrioridad($tarea->prioridad));

        if ($todasTareas->isEmpty()) {
            return response()->json(['message' => 'No hay tareas nuevas para asignar hoy.'], 200);
        }
        if ($todasTareas->isEmpty()) {
            return response()->json(['message' => 'No hay tareas disponibles para hoy.'], 400);
        }

        // 2. Agrupar tareas por tipo_id
        $tareasPorTipo = $todasTareas->groupBy('tipo_id');

        // 3. Tipo con más tareas
        $tipoConMasTareas = $tareasPorTipo->sortByDesc(fn($tareas) => $tareas->count())->keys()->first();

        $tareasAsignadas = [];

        // 4. Asignar todas las tareas del tipo más común
        $tareasMaxTipo = $tareasPorTipo[$tipoConMasTareas]->shuffle();

        $pasantesCompatiblesMax = collect($pasantesTipos)->filter(fn($info) => in_array($tipoConMasTareas, $info['tipos']))->values();

        if ($pasantesCompatiblesMax->isNotEmpty()) {
            $index = 0;
            foreach ($tareasMaxTipo as $tarea) {
                $pasante = $pasantesCompatiblesMax[$index % $pasantesCompatiblesMax->count()];
                $pasantesTipos[$pasante['user']->id]['tareas'][] = $tarea;
                $tareasAsignadas[] = $tarea->id;
                $index++;
            }
        }

        // 5. Repartir tareas restantes respetando tipo y prioridad
        $tareasRestantes = $todasTareas->whereNotIn('id', $tareasAsignadas)->shuffle();

        foreach ($tareasRestantes as $tarea) {
            $pasantesCompatibles = collect($pasantesTipos)
                ->filter(fn($info) => in_array($tarea->tipo_id, $info['tipos']))
                ->sortBy(fn($info) => count($info['tareas']));

            if ($pasantesCompatibles->isEmpty()) continue;

            $pasante = $pasantesCompatibles->first();
            $pasantesTipos[$pasante['user']->id]['tareas'][] = $tarea;
            $tareasAsignadas[] = $tarea->id;
        }

        // 6. Balanceo de carga (diferencia máxima de 1 tarea)
        $maxDiferenciaPermitida = 1;

        while (true) {
            $sorted = collect($pasantesTipos)->sortBy(fn($p) => count($p['tareas']));
            $menosCargado = $sorted->first();
            $masCargado = $sorted->last();

            $dif = count($masCargado['tareas']) - count($menosCargado['tareas']);
            if ($dif <= $maxDiferenciaPermitida) break;

            $tareaParaMover = null;
            foreach ($masCargado['tareas'] as $key => $tarea) {
                if (in_array($tarea->tipo_id, $menosCargado['tipos'])) {
                    $tareaParaMover = $tarea;
                    $indexTarea = $key;
                    break;
                }
            }

            if (!$tareaParaMover) break;

            unset($pasantesTipos[$masCargado['user']->id]['tareas'][$indexTarea]);
            $pasantesTipos[$masCargado['user']->id]['tareas'] = array_values($pasantesTipos[$masCargado['user']->id]['tareas']);
            $pasantesTipos[$menosCargado['user']->id]['tareas'][] = $tareaParaMover;
        }

        // 7. Guardar asignaciones
        foreach ($pasantesTipos as $info) {
            foreach ($info['tareas'] as $tarea) {
                AsignacionTarea::create([
                    'user_id' => $info['user']->id,
                    'tarea_id' => $tarea->id,
                    'estado' => 'pendiente',
                    'detalle' => '',
                    'fecha' => $fechaActual,
                ]);
            }
        }

        return response()->json([
            'message' => 'Tareas asignadas con exito',
            'fecha' => $fechaActual,
            'total_tareas_asignadas' => count($tareasAsignadas),
            'tareas_por_pasante' => collect($pasantesTipos)->mapWithKeys(fn($info) => [$info['user']->name => count($info['tareas'])]),
        ]);
    }
}