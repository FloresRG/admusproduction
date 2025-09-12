<?php

namespace App\Http\Controllers;

use App\Models\AsignacionPasante;
use App\Models\Week;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HorarioPersonalController extends Controller
{
    public function index(Request $request)
    {
        // Obtener el usuario autenticado
        $user = Auth::user();
        
        // OPCIÓN 1: Verificar si tiene rol de pasante usando relaciones
        $esPasante = $user->roles()->where('name', 'camarografo')->exists();
        if (!$esPasante) {
            return redirect()->route('dashboard')->withErrors(['error' => 'No tienes permisos para acceder a esta página']);
        }

        // Obtener la semana seleccionada o la actual
        $weekId = $request->get('week_id');
        $currentWeek = $this->getCurrentWeek($weekId);

        // Obtener todas las asignaciones del usuario para la semana
       // En el método index(), modifica la línea del with():
        $asignaciones = AsignacionPasante::with(['company:id,name,direccion,ubicacion'])
            ->where('user_id', $user->id)
            ->where('week_id', $currentWeek->id)
            ->get();
            
        // Organizar las asignaciones por día y turno
        $horarioSemanal = $this->organizarHorario($asignaciones);

        // Obtener todas las semanas disponibles (últimas 10 semanas y próximas 4)
        $weeks = Week::where('start_date', '>=', Carbon::now()->subWeeks(10))
            ->where('start_date', '<=', Carbon::now()->addWeeks(4))
            ->orderBy('start_date', 'desc')
            ->get();

        // Días de la semana en español
        $diasSemana = [
            'lunes' => 'Lunes',
            'martes' => 'Martes', 
            'miercoles' => 'Miércoles',
            'jueves' => 'Jueves',
            'viernes' => 'Viernes',
            'sabado' => 'Sábado'
        ];

        // Turnos
        $turnos = [
            'mañana' => 'Mañana (8:00 - 14:00)',
            'tarde' => 'Tarde (14:00 - 20:00)',
            'noche' => 'Noche (20:00 - 2:00)'
        ];

        return Inertia::render('Semana/HorarioPersonal', [
            'user' => $user->only(['id', 'name', 'email']),
            'horarioSemanal' => $horarioSemanal,
            'currentWeek' => $currentWeek,
            'weeks' => $weeks,
            'diasSemana' => $diasSemana,
            'turnos' => $turnos,
            'totalAsignaciones' => $asignaciones->count()
        ]);
    }

    private function getCurrentWeek($weekId = null)
    {
        if ($weekId) {
            return Week::findOrFail($weekId);
        }

        // Lógica similar a tu controlador original
        $today = Carbon::now();
        
        if ($today->isSunday()) {
            $startOfWeek = $today->copy()->addDay()->startOfWeek();
            $endOfWeek = $startOfWeek->copy()->endOfWeek();
        } else {
            $startOfWeek = $today->copy()->startOfWeek();
            $endOfWeek = $today->copy()->endOfWeek();
        }

        $currentWeek = Week::where('start_date', $startOfWeek->toDateString())
            ->where('end_date', $endOfWeek->toDateString())
            ->first();

        if (!$currentWeek) {
            $currentWeek = Week::create([
                'name' => 'Semana del ' . $startOfWeek->format('d/m/Y'),
                'start_date' => $startOfWeek,
                'end_date' => $endOfWeek,
            ]);
        }

        return $currentWeek;
    }

    private function organizarHorario($asignaciones)
    {
        $diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        $turnos = ['mañana', 'tarde', 'noche'];
        
        $horario = [];
        
        // Inicializar estructura del horario
        foreach ($diasSemana as $dia) {
            $horario[$dia] = [];
            foreach ($turnos as $turno) {
                $horario[$dia][$turno] = null;
            }
        }
        
        // Llenar con las asignaciones
        foreach ($asignaciones as $asignacion) {
            $horario[$asignacion->dia][$asignacion->turno] = [
                'company' => $asignacion->company,
                'fecha' => $asignacion->fecha,
                'asignacion_id' => $asignacion->id
            ];
        }
        
        return $horario;
    }


}