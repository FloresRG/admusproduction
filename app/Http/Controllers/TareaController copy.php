<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use App\Models\AsignacionTarea;
use App\Models\Tarea;
use App\Models\Tipo;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Contracts\Role;

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

    public function tareasConAsignaciones()
    {
        $tareas = Tarea::with(['asignaciones.user', 'tipo', 'company'])->get();

        $resultado = $tareas->map(function ($tarea) {
            return [
                'id'          => $tarea->id,
                'titulo'      => $tarea->titulo,
                'descripcion' => $tarea->descripcion,
                'prioridad'   => $tarea->prioridad,
                'fecha'       => $tarea->fecha,
                'tipo'        => $tarea->tipo ? [
                    'id'          => $tarea->tipo->id,
                    'nombre_tipo' => $tarea->tipo->nombre_tipo,
                ] : null,
                'company_id' => $tarea->company_id, // ✅ agrega esto
                'company' => $tarea->company ? [
                    'id' => $tarea->company->id,
                    'name' => $tarea->company->name,
                ] : null,
                // Aquí renombramos a "asignados" y devolvemos exactamente
                // los campos que tu React espera
                'asignados'   => $tarea->asignaciones->map(function ($asignacion) {
                    return [
                        'id'        => $asignacion->id,
                        'user_id'   => $asignacion->user->id,
                        'user_name' => $asignacion->user->name,
                        'estado'    => $asignacion->estado,
                        'detalle'   => $asignacion->detalle,
                    ];
                }),
            ];
        });

        return response()->json($resultado);
    }

    public function listarEmpresas()
    {
        $empresas = \App\Models\Company::select('id', 'name')->get();

        return response()->json($empresas);
    }


    /**F
     * Actualiza el estado y detalle de una asignación concreta.
     * Esta ruta debe estar en web.php (no api.php) para poder respetar
     * sesiones y CSRF de Laravel sin el prefijo /api.
     */
    public function actualizarAsignacion(Request $request, $id)
    {
        $data = $request->validate([
            'estado'  => 'nullable|string|in:pendiente,en_revision,publicada',
            'detalle' => 'nullable|string',
        ]);

        $asignacion = AsignacionTarea::findOrFail($id);
        $asignacion->update($data);

        return response()->json(['message' => 'Asignación actualizada con éxito.']);
    }

    public function reasignarUsuario(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $asignacionAnterior = AsignacionTarea::findOrFail($id);

        // Copiar los datos de la asignación actual
        $tareaId = $asignacionAnterior->tarea_id;
        $fecha   = $asignacionAnterior->fecha;

        // Eliminar asignación anterior
        $asignacionAnterior->delete();

        // Crear nueva asignación
        $nuevaAsignacion = AsignacionTarea::create([
            'user_id'  => $request->input('user_id'),
            'tarea_id' => $tareaId,
            'estado'   => 'pendiente',
            'detalle'  => '',
            'fecha'    => $fecha,
        ]);

        return response()->json([
            'message' => 'Pasante reasignado correctamente.',
            'nueva_asignacion' => $nuevaAsignacion,
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validar incluyendo el nuevo campo de asignación
        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'prioridad' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha' => 'nullable|date',
            'tipo_id' => 'nullable|exists:tipos,id',
            'company_id' => 'nullable|exists:companies,id',
            'asignacion_aleatoria' => 'required|boolean',
            'pasante_id' => 'required_if:asignacion_aleatoria,false|nullable|exists:users,id',
            'estado' => 'nullable|string|in:pendiente,en_progreso,finalizado',
            'detalle' => 'nullable|string',
        ]);

        // 2. Obtener el nombre de la empresa (si viene el ID)
        $nombreEmpresa = null;
        if (!empty($data['company_id'])) {
            $empresa = Company::find($data['company_id']);
            if ($empresa) {
                $nombreEmpresa = $empresa->name;
            }
        }

        // 3. Crear la tarea
        $tarea = Tarea::create([
            'titulo' => $data['titulo'],
            'prioridad' => $data['prioridad'],
            'descripcion' => $data['descripcion'],
            'fecha' => $data['fecha'],
            'tipo_id' => $data['tipo_id'],
            'empresa' => null,
            'company_id' => $data['company_id'] ?? null,
        ]);

        // 4. Determinar fecha de asignación
        $fechaAsignacion = $data['fecha'] ?? now()->toDateString();

        // 5. Proceso de asignación según el tipo seleccionado
        if ($data['asignacion_aleatoria']) {
            $usuariosQuery = User::role(['pasante', 'marketing']);

            if (!empty($data['tipo_id'])) {
                $usuariosQuery = $usuariosQuery->whereHas('tipos', function ($q) use ($data) {
                    $q->where('tipo_id', $data['tipo_id']);
                });
            }

            $usuarios = $usuariosQuery->get();

            // Si con tipo no encontró, intentar con cualquier usuario de esos roles
            if ($usuarios->isEmpty()) {
                $usuarios = User::role(['pasante', 'marketing'])->get();
            }

            if ($usuarios->isNotEmpty()) {
                $pasanteId = $usuarios->random()->id;
            } else {
                return response()->json([
                    'message' => 'No hay usuarios disponibles para asignar la tarea'
                ], 400);
            }
        } else {
            $pasanteId = $data['pasante_id'];

            // Validar que el usuario tenga el rol correcto
            if (!User::role(['pasante', 'marketing'])->where('id', $pasanteId)->exists()) {
                return response()->json([
                    'message' => 'El usuario seleccionado no tiene un rol válido (pasante o marketing)'
                ], 400);
            }
        }

        // 6. Crear la asignación
        AsignacionTarea::create([
            'user_id' => $pasanteId,
            'tarea_id' => $tarea->id,
            'estado' => 'pendiente',
            'detalle' => '',
            'fecha' => $fechaAsignacion,
        ]);

        // 7. Retornar respuesta
        return response()->json([
            'message' => 'Tarea creada y asignada correctamente',
            'data' => [
                'tarea' => $tarea,
                'pasante_id' => $pasanteId
            ]
        ], 201);
    }


    public function storePersonal(Request $request)
    {

        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'prioridad' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha' => 'nullable|date',
            'tipo_id' => 'nullable|exists:tipos,id',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        $nombreEmpresa = null;
        if (!empty($data['company_id'])) {
            $empresa = Company::find($data['company_id']);
            if ($empresa) {
                $nombreEmpresa = $empresa->name;
            }
        }

        $tarea = Tarea::create([
            'titulo'      => $data['titulo'],
            'prioridad'   => $data['prioridad'],
            'descripcion' => $data['descripcion'],
            'fecha'       => $data['fecha'],
            'tipo_id'     => $data['tipo_id'],
            'empresa'     => null,
            'company_id'  => $data['company_id'] ?? null,
        ]);


        AsignacionTarea::create([
            'tarea_id' => $tarea->id,
            'user_id' => Auth::id(), // Se asigna a sí mismo
            'estado' => 'pendiente',
            'detalle' => '',
            'fecha' => $data['fecha'] ?? now()->toDateString(),
        ]);


        return back()->with('success', 'Tarea personal creada y asignada exitosamente');
    }

    public function estadisticasUsuario()
    {
        $user = Auth::user();

        // Agrupar las tareas asignadas al usuario logueado por estado
        $estadisticas = AsignacionTarea::where('user_id', $user->id)
            ->select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado'); // esto devuelve ['pendiente' => 3, 'en_revision' => 2, ...]

        // Aseguramos que todos los estados estén presentes
        $resultado = [
            'pendiente'    => $estadisticas->get('pendiente', 0),
            'en_revision'  => $estadisticas->get('en_revision', 0),
            'publicada'    => $estadisticas->get('publicada', 0),
        ];

        return Inertia::render('Dashboard/Pasante', [
            'estadisticas' => $resultado,
            'user' => $user,
        ]);
    }
    

    public function estadisticasMesActual()
    {
        $inicioMes = now()->startOfMonth()->toDateString();
        $finMes    = now()->endOfMonth()->toDateString();

        $asignaciones = \App\Models\AsignacionTarea::whereBetween('fecha', [$inicioMes, $finMes])
            ->select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        $resultado = [
            'pendiente'    => $asignaciones->get('pendiente', 0),
            'en_revision'  => $asignaciones->get('en_revision', 0),
            'publicada'    => $asignaciones->get('publicada', 0),
            'total'        => $asignaciones->sum(),
            'mes'          => now()->format('F Y'),
        ];

        return response()->json($resultado);
    }


    public function estadisticasCompletas()
    {
        // Tareas
        $inicioMes = now()->startOfMonth()->toDateString();
        $finMes    = now()->endOfMonth()->toDateString();

        $asignaciones = \App\Models\AsignacionTarea::whereBetween('fecha', [$inicioMes, $finMes])
            ->select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado');

        $totalTareasCreadas = \App\Models\Tarea::whereBetween('fecha', [$inicioMes, $finMes])->count();

        $estadisticasTareas = [
            'pendiente'    => $asignaciones->get('pendiente', 0),
            'en_revision'  => $asignaciones->get('en_revision', 0),
            'publicada'    => $asignaciones->get('publicada', 0),
            'total'        => $asignaciones->sum(),
            'total_tareas_creadas' => $totalTareasCreadas,
            'mes'          => now()->format('F Y'),
        ];

        // Roles y usuarios
        $totalUsuarios = \App\Models\User::count();

        $totalRoles = \Spatie\Permission\Models\Role::count();

        $rolesConUsuarios = \Spatie\Permission\Models\Role::withCount('users')
            ->select('id', 'name')
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'users_count' => $role->users_count,
                ];
            });

        $estadisticasUsuarios = [
            'total_usuarios' => $totalUsuarios,
            'total_roles'    => $totalRoles,
            'roles'          => $rolesConUsuarios,
        ];

        return response()->json([
            'tareas' => $estadisticasTareas,
            'usuarios' => $estadisticasUsuarios,
        ]);
    }
    public function tareasSemana(Request $request)
    {
        $fechaBase = $request->query('fecha') ?? now()->toDateString();

        $inicioSemana = Carbon::parse($fechaBase)->startOfWeek(Carbon::MONDAY);
        $finSemana    = Carbon::parse($fechaBase)->endOfWeek(Carbon::SUNDAY);

        $tareas = Tarea::with(['tipo', 'company'])
            ->whereBetween('fecha', [$inicioSemana->toDateString(), $finSemana->toDateString()])
            ->orderBy('fecha')
            ->get();

        $agrupadas = $tareas->groupBy('fecha')->map(function ($tareasDelDia, $fecha) {
            return $tareasDelDia->map(function ($tarea) {
                return [
                    'id'          => $tarea->id,
                    'titulo'      => $tarea->titulo,
                    'descripcion' => $tarea->descripcion,
                    'prioridad'   => $tarea->prioridad,
                    'fecha'       => $tarea->fecha,
                    'tipo'        => $tarea->tipo ? [
                        'id'          => $tarea->tipo->id,
                        'nombre_tipo' => $tarea->tipo->nombre_tipo,
                    ] : null,
                    'company'     => $tarea->company ? [
                        'id'   => $tarea->company->id,
                        'name' => $tarea->company->name,
                    ] : null,
                ];
            });
        });

        // Completar días faltantes
        $diasSemana = [];
        $fechaActual = $inicioSemana->copy();
        while ($fechaActual->lte($finSemana)) {
            $fechaStr = $fechaActual->toDateString();
            $diasSemana[$fechaStr] = $agrupadas->get($fechaStr, collect());
            $fechaActual->addDay();
        }

        return response()->json([
            'inicio' => $inicioSemana->toDateString(),
            'fin'    => $finSemana->toDateString(),
            'dias'   => $diasSemana,
        ]);
    }












































    public function update(Request $request, $id)
    {
        $tarea = Tarea::findOrFail($id);

        $data = $request->validate([
            'titulo'      => 'required|string|max:255',
            'prioridad'   => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha'       => 'nullable|date',
            'tipo_id'     => 'nullable|exists:tipos,id',
            'company_id'  => 'nullable|exists:companies,id', // usamos solo para obtener el nombre
        ]);

        // Obtener el nombre de la empresa desde el ID (si viene)
        $nombreEmpresa = null;
        if (!empty($data['company_id'])) {
            $empresa = Company::find($data['company_id']);
            if ($empresa) {
                $nombreEmpresa = $empresa->name;
            }
        }

        // Actualizar la tarea con el nombre de la empresa
        $tarea->update([
            'titulo'      => $data['titulo'],
            'prioridad'   => $data['prioridad'],
            'descripcion' => $data['descripcion'],
            'fecha'       => $data['fecha'],
            'tipo_id'     => $data['tipo_id'],
            'company_id'  => $data['company_id'], // ✅ Actualizar company_id directamente
            // ❌ Removemos la línea: 'empresa' => $nombreEmpresa,
        ]);

        return response()->json(['message' => 'Tarea actualizada con éxito']);
    }

    public function actualizarDescripcion(Request $request, $id)
    {
        $request->validate([
            'descripcion' => 'required|string',
        ]);

        $tarea = Tarea::findOrFail($id);
        $tarea->descripcion = $request->input('descripcion');
        $tarea->save();

        return response()->json(['message' => 'Descripción actualizada con éxito']);
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
