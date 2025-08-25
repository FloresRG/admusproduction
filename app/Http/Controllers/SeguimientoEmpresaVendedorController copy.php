<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\SeguimientoEmpresa;
use App\Models\User;
use App\Models\Paquete;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; // Agrega esta línea para usar Auth

class SeguimientoEmpresaVendedorController extends Controller
{
    public function index()
    {
        // Filtra los seguimientos para mostrar solo los del usuario logueado
        $seguimientos = SeguimientoEmpresa::where('id_user', Auth::id())
            ->where('estado', '!=', 'Sin exito')
            ->with('usuario', 'paquete')
            ->paginate(10);

        // Filtra solo usuarios con el rol "Ejecutivo de Ventas"
        $users = User::whereHas('roles', function ($q) {
            $q->where('name', 'Ejecutivo de Ventas');
        })->get();

        $paquetes = Paquete::all();

        return Inertia::render('SeguimientoEmpresa/seguimiento-vendedor', [
            'seguimientos' => $seguimientos,
            'users' => $users,
            'paquetes' => $paquetes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'id_user' => 'required|exists:users,id',
            'id_paquete' => 'required|exists:paquetes,id',
            'estado' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date',
            'descripcion' => 'nullable|string',
            'celular' => 'nullable|string|max:20', // <-- Agrega esta línea
        ]);

        SeguimientoEmpresa::create($request->all());

        return redirect()->route('seguimiento-empresa-vendedor.index')->with('success', 'Seguimiento creado correctamente.');
    }

    public function update(Request $request, $seguimiento_empresa_vendedor)
{
    $validated = $request->validate([
        'nombre_empresa' => 'required|string|max:255',
        'id_user'        => 'required|exists:users,id',
        'id_paquete'     => 'required|exists:paquetes,id',
        'estado'         => 'required|string',
        'fecha_inicio'   => 'required|date',
        'fecha_fin'      => 'nullable|date',
        'descripcion'    => 'nullable|string',
        'celular'        => 'nullable|string|max:20',
    ]);

    $seguimiento_empresa_vendedor->update($validated);

    return redirect()
        ->route('seguimiento-empresa-vendedor.index')
        ->with('success', 'Seguimiento actualizado correctamente.');
}

    public function destroy(SeguimientoEmpresa $seguimiento_empresa)
    {
        $seguimiento_empresa->delete();

        return redirect()->route('seguimiento-empresa-vendedor.index')->with('success', 'Seguimiento eliminado correctamente.');
    }
    
    public function finalize(SeguimientoEmpresa $seguimiento_empresa)
    {
        // 1. Verifica que el seguimiento pertenezca al usuario autenticado
        if ($seguimiento_empresa->id_user !== Auth::id()) {
            abort(403);
        }

        // 2. Obtiene el paquete asociado al seguimiento
        $paquete = $seguimiento_empresa->paquete;

        // 3. Verifica si el paquete existe y tiene puntos definidos
        if ($paquete && isset($paquete->puntos)) {
            // 4. Obtiene el usuario autenticado
            $user = Auth::user();

            // 5. Suma los puntos del paquete a los puntos ganados del usuario
            $user->puntos_ganados += $paquete->puntos;
            $user->save();
        }

        // 6. Crea la empresa en la tabla 'companies'
        // Asegúrate de que el modelo Company tenga 'name' y 'company_category_id' en $fillable
        $company = Company::create([
            'name' => $seguimiento_empresa->nombre_empresa,
            'company_category_id' => 1, // Puedes usar un valor por defecto o nulo si lo permites
            'contract_duration' => 'Por definir', // Puedes ajustar esto según tus necesidades
            'start_date' => $seguimiento_empresa->fecha_inicio,
            'end_date' => now()->addYear(), // Opcional: Define una fecha de fin por defecto
        ]);

        // 7. Finaliza el seguimiento de la empresa
        $seguimiento_empresa->update([
            'estado' => 'Completado',
            'fecha_fin' => now(),
        ]);

        return redirect()->back()->with('success', 'Contrato finalizado, empresa creada y puntos asignados correctamente.');
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
            'fecha_fin' => now(), // Opcional: registrar la fecha de cancelación
        ]);

        return redirect()->back()->with('success', 'Seguimiento cancelado correctamente.');
    }
}
