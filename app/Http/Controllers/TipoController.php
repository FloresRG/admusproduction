<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Tipo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipoController extends Controller
{
    /**
     * Mostrar todos los usuarios y todos los tipos usando Inertia.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Obtiene solo los usuarios con el rol 'pasante'
        $users = User::role('pasante')->get();

        // Obtiene todos los tipos
        $tipos = Tipo::all();

        // Retorna la vista con los usuarios y tipos
        return Inertia::render('Tipos/Index', [
            'users' => $users,
            'tipos' => $tipos,
        ]);
    }

    /**
     * Obtener los tipos asociados a un usuario.
     *
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTiposByUserId($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Obtiene los tipos asociados al usuario
        $tipos = $user->tipos;
        return response()->json($tipos);
    }

    /**
     * Actualizar los tipos de un usuario.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTiposByUserId(Request $request, $userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Sincroniza los tipos con los datos enviados
        $user->tipos()->sync($request->tipos); // Asumiendo que los tipos son enviados como un array de IDs

        return response()->json(['message' => 'Tipos actualizados con éxito']);
    }

    /**
     * Editar un tipo específico.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $tipoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function editTipo(Request $request, $tipoId)
    {
        $tipo = Tipo::find($tipoId);

        if (!$tipo) {
            return response()->json(['message' => 'Tipo no encontrado'], 404);
        }

        // Actualiza el nombre del tipo
        $tipo->update([
            'nombre_tipo' => $request->nombre_tipo,
        ]);

        return response()->json(['message' => 'Tipo actualizado con éxito', 'tipo' => $tipo]);
    }

    /**
     * Eliminar un tipo.
     *
     * @param int $tipoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyTipo($tipoId)
    {
        $tipo = Tipo::find($tipoId);

        if (!$tipo) {
            return response()->json(['message' => 'Tipo no encontrado'], 404);
        }

        // Elimina el tipo
        $tipo->delete();

        return response()->json(['message' => 'Tipo eliminado con éxito']);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_tipo' => 'required|string|max:255|unique:tipos,nombre_tipo',
        ]);

        $tipo = Tipo::create([
            'nombre_tipo' => $validated['nombre_tipo'],
        ]);

        return response()->json(['message' => 'Tipo creado con éxito', 'tipo' => $tipo]);
    }
}
