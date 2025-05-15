<?php

namespace App\Http\Controllers;

use App\Models\Dato;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatoInfluencersController extends Controller
{
    /* public function index()
    {
        // Obtener solo los usuarios con el rol 'influencer' y cargar la relación 'roles'
        $users = User::role('influencer')->with('roles')->get();

        return response()->json($users);
    } */


    public function index()
    {
        $users = User::role('influencer')
            ->with(['roles', 'dato'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'cantidad' => $user->dato->cantidad ?? 0,
                ];
            });

        return response()->json($users);
    }
    public function store(Request $request)
    {
        // Validamos los datos de entrada
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name', // Validamos que el rol exista
        ]);

        // Creamos el nuevo usuario
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Si el rol proporcionado es 'influencer', se le asigna este rol por defecto
        $role = $validated['role'] ?? 'influencer'; // Si no se pasa un rol, asignamos 'influencer'

        // Asignamos el rol al usuario (puede ser 'influencer' o el rol proporcionado)
        $user->assignRole($role);

        return response()->json($user, 201);
    }


    /*  public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // Validación de los campos proporcionados
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . $id,
            'cantidad' => 'nullable|integer|min:0',  // Validación para el campo cantidad
        ]);

        // Actualizar los campos de la tabla 'users'
        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }

        // Actualizar el campo cantidad en la tabla 'datos'
        if ($request->has('cantidad')) {
            // Verificar si el usuario tiene un dato asociado
            $dato = $user->dato; // Relación con el modelo Dato (User tiene un Dato)

            if ($dato) {
                // Si ya existe el Dato, lo actualizamos
                $dato->cantidad = $request->cantidad;
                $dato->save();
            } else {
                // Si no existe el Dato, creamos uno nuevo
                $user->dato()->create([
                    'cantidad' => $request->cantidad,
                    'id_user' => $user->id,
                ]);
            }
        }

        // Guardar cambios en el usuario
        $user->save();

        return response()->json(['dato' => $user]);
    } */
    public function update(Request $request, $id)
    {
        $user = User::with('dato')->find($id); // Asegúrate de cargar la relación

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . $id,
            'cantidad' => 'nullable|integer|min:0',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('cantidad')) {
            $dato = $user->dato;

            if ($dato) {
                $dato->cantidad = $request->cantidad;
                $dato->save();
            } else {
                $dato = $user->dato()->create([
                    'cantidad' => $request->cantidad,
                    'id_user' => $user->id,
                ]);
            }
        }

        $user->save();

        // Devuelve una respuesta compatible con lo que espera el frontend
        return response()->json([
            'dato' => [
                'cantidad' => $dato->cantidad ?? null,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ]);
    }


    // Eliminar un usuario
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado']);
    }
}
