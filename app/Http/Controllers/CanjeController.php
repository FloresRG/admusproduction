<?php

namespace App\Http\Controllers;

use App\Models\Canje;
use App\Models\Premio;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CanjeController extends Controller
{
    /**
     * Mostrar la página de canje de premios
     */
    public function index()
    {
        $user = auth()->user();
        $puntosUsuario = $user->puntos_ganados ?? 0;

        // Traer TODOS los premios
        $premios = Premio::all();

        return Inertia::render('Canjes/Index', [
            'premios' => $premios,
            'puntosUsuario' => $puntosUsuario,
            'canjesRecientes' => Canje::with('premio')
                ->where('id_user', $user->id)
                ->orderBy('fecha', 'desc')
                ->limit(5)
                ->get()
        ]);
    }

    /**
     * Procesar el canje de premios
     */
    public function store(Request $request)
    {
        $request->validate([
            'premio_id' => 'required|exists:premios,id'
        ]);

        $user = auth()->user();
        $premio = Premio::findOrFail($request->premio_id);

        // Verificar si el usuario tiene puntos suficientes
        $puntosUsuario = $user->puntos_ganados ?? 0;
        if ($puntosUsuario < $premio->puntos_necesarios) {
            return redirect()->back()->withErrors([
                'message' => 'No tienes suficientes puntos para canjear este premio.'
            ]);
        }

        try {
            // Usar transacción para asegurar que ambas operaciones se completen
            DB::transaction(function () use ($user, $premio) {
                // Crear el registro de canje con estado pendiente
                Canje::create([
                    'id_user' => $user->id,
                    'id_premio' => $premio->id,
                    'fecha' => now(),
                    'estado' => Canje::ESTADO_PENDIENTE // Estado inicial
                ]);

                // Restar los puntos al usuario
                $user->puntos_ganados -= $premio->puntos_necesarios;
                $user->save();
            });

            return redirect()->route('canjes.index')
                ->with('success', '¡Canje exitoso! Reclama tu premio en ADMUS. Estado: Pendiente');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'message' => 'Ocurrió un error al procesar el canje. Intenta nuevamente.'
            ]);
        }
    }

    /**
     * Mostrar historial de canjes
     */
    public function historial()
    {
        $user = auth()->user();
        
        $canjes = Canje::with('premio')
            ->where('id_user', $user->id)
            ->orderBy('fecha', 'desc')
            ->paginate(10);

        return Inertia::render('Canjes/Historial', [
            'canjes' => $canjes,
            'puntosUsuario' => $user->puntos_ganados ?? 0,
            'totalPuntosGastados' => $this->calcularPuntosGastados($user->id)
        ]);
    }

    /**
     * Mostrar canjes pendientes (vista para administración/recolección)
     */
   /**
 * Mostrar canjes pendientes y historial de recogidos
 */
public function pendientes()
{
    // Canjes pendientes
    $canjesPendientes = Canje::with(['premio', 'usuario'])
        ->where('estado', Canje::ESTADO_PENDIENTE)
        ->orderBy('fecha', 'asc')
        ->paginate(15);

    // Canjes recogidos (historial)
    $canjesRecogidos = Canje::with(['premio', 'usuario'])
        ->where('estado', Canje::ESTADO_RECOJIDO)
        ->orderBy('fecha_recogido', 'desc')
        ->paginate(15);

    return Inertia::render('Canjes/Pendientes', [
        'canjesPendientes' => $canjesPendientes,
        'canjesRecogidos' => $canjesRecogidos
    ]);
}

    /**
     * Marcar canje como recogido
     */
    public function marcarRecogido($id)
    {
        $canje = Canje::findOrFail($id);

        // Verificar que el canje esté pendiente
        if (!$canje->estaPendiente()) {
            return redirect()->back()->withErrors([
                'message' => 'Este canje ya fue procesado anteriormente.'
            ]);
        }

        $canje->update([
            'estado' => Canje::ESTADO_RECOJIDO,
            'fecha_recogido' => now()
        ]);

        return redirect()->back()->with('success', 'Canje marcado como recogido correctamente.');
    }

    /**
     * Calcular el total de puntos gastados en canjes
     */
    private function calcularPuntosGastados($userId)
    {
        return Canje::with('premio')
            ->where('id_user', $userId)
            ->get()
            ->sum(function($canje) {
                return $canje->premio->puntos_necesarios;
            });
    }
}