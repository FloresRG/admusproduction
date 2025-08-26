<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\SeguimientoEmpresa;
use App\Models\User;
use App\Models\Paquete;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SeguimientoEmpresaVendedorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');

        // Query base para seguimientos del usuario logueado
        $query = SeguimientoEmpresa::where('id_user', Auth::id())
            ->whereNotIn('estado', ['Sin exito', 'Completado'])
            ->with(['usuario', 'paquete']);


        // Aplicar filtros de búsqueda
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre_empresa', 'like', "%{$search}%")
                    ->orWhere('celular', 'like', "%{$search}%")
                    ->orWhereHas('paquete', function ($pq) use ($search) {
                        $pq->where('nombre_paquete', 'like', "%{$search}%");
                    });
            });
        }

        // Ordenar por fecha de creación más reciente
        $seguimientos = $query->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString(); // Mantiene los parámetros de búsqueda en la paginación

        // Filtra solo usuarios con el rol "Ejecutivo de Ventas"
        $users = User::whereHas('roles', function ($q) {
            $q->where('name', 'Ejecutivo de Ventas');
        })->get();

        $paquetes = Paquete::all();

        return Inertia::render('SeguimientoEmpresa/seguimiento-vendedor', [
            'seguimientos' => $seguimientos,
            'users' => $users,
            'paquetes' => $paquetes,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'id_user' => 'required|exists:users,id',
            'id_paquete' => 'required|exists:paquetes,id',
            'estado' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date',
            'descripcion' => 'nullable|string|max:1000',
            'celular' => 'nullable|string|max:20',
        ]);

        SeguimientoEmpresa::create($validated);

        return redirect()
            ->route('seguimiento-empresa-vendedor.index')
            ->with('success', 'Seguimiento creado correctamente.');
    }

    public function update(Request $request, SeguimientoEmpresa $seguimiento_empresa)
    {
        // Verifica que el seguimiento pertenezca al usuario autenticado
        if ($seguimiento_empresa->id_user !== Auth::id()) {
            abort(403, 'No tienes permiso para realizar esta acción.');
        }

        $validated = $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'id_user'        => 'required|exists:users,id',
            'id_paquete'     => 'required|exists:paquetes,id',
            'estado'         => 'required|string',
            'fecha_inicio'   => 'required|date',
            'fecha_fin'      => 'nullable|date',
            'descripcion'    => 'nullable|string|max:1000',
            'celular'        => 'nullable|string|max:20',
        ]);

        $seguimiento_empresa->update($validated);

        return redirect()
            ->route('seguimiento-empresa-vendedor.index')
            ->with('success', 'Seguimiento actualizado correctamente.');
    }

    public function destroy(SeguimientoEmpresa $seguimiento_empresa)
    {
        // Verifica que el seguimiento pertenezca al usuario autenticado
        if ($seguimiento_empresa->id_user !== Auth::id()) {
            abort(403, 'No tienes permiso para realizar esta acción.');
        }

        $seguimiento_empresa->delete();

        return redirect()
            ->route('seguimiento-empresa-vendedor.index')
            ->with('success', 'Seguimiento eliminado correctamente.');
    }

    public function finalize(SeguimientoEmpresa $seguimiento_empresa)
    {
        // Verifica que el seguimiento pertenezca al usuario autenticado
        if ($seguimiento_empresa->id_user !== Auth::id()) {
            abort(403, 'No tienes permiso para realizar esta acción.');
        }

        // Obtiene el paquete asociado al seguimiento
        $paquete = $seguimiento_empresa->paquete;

        // Verifica si el paquete existe y tiene puntos definidos
        if ($paquete && isset($paquete->puntos)) {
            // Obtiene el usuario autenticado
            $user = Auth::user();

            // Suma los puntos del paquete a los puntos ganados del usuario
            $user->puntos_ganados += $paquete->puntos;
            $user->save();
        }

        // Crea la empresa en la tabla 'companies'
        try {
            $company = Company::create([
                'name' => $seguimiento_empresa->nombre_empresa,
                'company_category_id' => 1,
                'contract_duration' => 'Por definir',
                'start_date' => $seguimiento_empresa->fecha_inicio,
                'end_date' => now()->addYear(),
            ]);
        } catch (\Exception $e) {
            // Si hay error al crear la empresa, continúa sin detener el proceso
            \Log::warning('Error al crear empresa: ' . $e->getMessage());
        }

        // Finaliza el seguimiento de la empresa
        $seguimiento_empresa->update([
            'estado' => 'Completado',
            'fecha_fin' => now(),
        ]);

        return redirect()->back()->with('success', 'Contrato finalizado correctamente.');
    }

    public function cancel(SeguimientoEmpresa $seguimiento_empresa)
    {
        // Verifica que el seguimiento pertenezca al usuario autenticado
        if ($seguimiento_empresa->id_user !== Auth::id()) {
            abort(403, 'No tienes permiso para realizar esta acción.');
        }

        // Actualiza el estado a 'Sin exito'
        $seguimiento_empresa->update([
            'estado' => 'Sin exito',
            'fecha_fin' => now(),
        ]);

        return redirect()->back()->with('success', 'Seguimiento cancelado correctamente.');
    }
}
