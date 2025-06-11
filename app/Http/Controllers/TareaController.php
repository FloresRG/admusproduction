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
        // 1. Validar incluyendo el nuevo campo de asignación
        $data = $request->validate([
            'titulo'      => 'required|string|max:255',
            'prioridad'   => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha'       => 'nullable|date',
            'tipo_id'     => 'nullable|exists:tipos,id',
            'company_id'  => 'nullable|exists:companies,id',
            'asignacion_aleatoria' => 'required|boolean', // Nuevo campo
            'pasante_id' => 'required_if:asignacion_aleatoria,false|nullable|exists:users,id', // Solo requerido si no es aleatorio

            // Agregar detalle y estado para la asignacion
        'estado' => 'nullable|string|in:pendiente,en_progreso,finalizado', // ajusta según tus estados válidos
        'detalle' => 'nullable|string',


        ]);

        // 2. Crear la tarea
        $tarea = Tarea::create([
            'titulo' => $data['titulo'],
            'prioridad' => $data['prioridad'],
            'descripcion' => $data['descripcion'],
            'fecha' => $data['fecha'],
            'tipo_id' => $data['tipo_id'],
            'company_id' => $data['company_id'],
        ]);

        // 3. Determinar fecha de asignación
        $fechaAsignacion = $data['fecha'] ?? Carbon::now()->toDateString();

        // 4. Proceso de asignación según el tipo seleccionado
        if ($data['asignacion_aleatoria']) {
            // Asignación aleatoria
            $pasantesQuery = User::role('pasante');

            if (!empty($data['tipo_id'])) {
                $pasantesQuery = $pasantesQuery->whereHas('tipos', function ($q) use ($data) {
                    $q->where('tipo_id', $data['tipo_id']);
                });
            }

            $pasantes = $pasantesQuery->get();

            if ($pasantes->isEmpty()) {
                $pasantes = User::role('pasante')->get();
            }

            if ($pasantes->isNotEmpty()) {
                $pasanteElegido = $pasantes->random();
                $pasanteId = $pasanteElegido->id;
            } else {
                return response()->json([
                    'message' => 'No hay pasantes disponibles para asignar la tarea'
                ], 400);
            }
        } else {
            // Asignación manual
            $pasanteId = $data['pasante_id'];

            // Verificar que el usuario seleccionado sea un pasante
            $esPasante = User::role('pasante')->where('id', $pasanteId)->exists();

            if (!$esPasante) {
                return response()->json([
                    'message' => 'El usuario seleccionado no es un pasante'
                ], 400);
            }
        }

        // 5. Crear la asignación
        AsignacionTarea::create([
            'user_id'  => $pasanteId,
            'tarea_id' => $tarea->id,
            'estado'   => 'pendiente',
            'detalle'  => '',
            'fecha'    => $fechaAsignacion,
        ]);

        // 6. Respuesta al frontend
        return response()->json([
            'message' => 'Tarea creada y asignada correctamente',
            'data' => [
                'tarea' => $tarea,
                'pasante_id' => $pasanteId
            ]
        ], 201);
    }

public function tareasConAsignaciones()
{
    $tareas = Tarea::with(['asignaciones.user', 'tipo', 'company'])->get();

    $resultado = $tareas->map(function ($tarea) {
        return [
            'id' => $tarea->id,
            'titulo' => $tarea->titulo,
            'descripcion' => $tarea->descripcion,
            'prioridad' => $tarea->prioridad,
            'fecha' => $tarea->fecha,
            'tipo' => $tarea->tipo?->nombre,
            'company' => $tarea->company?->nombre,
            'asignaciones' => $tarea->asignaciones->map(function ($asignacion) {
                return [
                    'id' => $asignacion->id,
                    'user' => $asignacion->user?->name,
                    'estado' => $asignacion->estado,
                    'detalle' => $asignacion->detalle,
                ];
            }),
        ];
    });

    return response()->json($resultado);
}
public function actualizarAsignacion(Request $request, $id)
{
    $data = $request->validate([
        'estado' => 'required|string|in:pendiente,en progreso,completado',
        'detalle' => 'nullable|string',
    ]);

    $asignacion = AsignacionTarea::findOrFail($id);
    $asignacion->update($data);

    return response()->json(['message' => 'Asignación actualizada con éxito.']);
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

    public function tareasAsignadas()
    {
        // Traemos todas las tareas que tengan al menos una asignación
        // e incluimos la relación con 'tipo', 'company' y 'asignaciones.user'.
        $tareas = Tarea::with([
            'tipo:id,nombre_tipo',
            'company:id,name',
            'asignaciones.user:id,name'
        ])
            ->whereHas('asignaciones') // solo las que tengan asignaciones
            ->get();

        // Transformamos cada tarea para enviar en JSON:
        // - Queremos enviar id, titulo, prioridad, descripcion, fecha, tipo, company
        // - Y, por cada asignación, el nombre del usuario asignado.
        $resultado = $tareas->map(fn($t) => [
            'id'            => $t->id,
            'titulo'        => $t->titulo,
            'prioridad'     => $t->prioridad,
            'descripcion'   => $t->descripcion,
            'fecha'         => $t->fecha,
            'tipo'          => $t->tipo ? [
                'id'          => $t->tipo->id,
                'nombre_tipo' => $t->tipo->nombre_tipo,
            ] : null,
            'company'       => $t->company ? [
                'id'     => $t->company->id,
                'name'   => $t->company->name,
            ] : null,
            'asignados'     => $t->asignaciones->map(fn($a) => [
                'user_id'   => $a->user->id,
                'user_name' => $a->user->name,
                'estado'    => $a->estado,
                'detalle'   => $a->detalle,
            ]),
        ]);

        return response()->json($resultado);
    }
}
