<?php

namespace App\Http\Controllers;

use App\Models\Dato;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatoInfluencersController extends Controller
{
    public function index()
    {
        // Obtener solo los usuarios con el rol 'influencer' y cargar la relación 'roles'
        $users = User::role('influencer')->with('roles')->get();

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

    
    public function update(Request $request, $id)
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
    }


    public function storedato(Request $request)
    {
        // Validar los campos recibidos
        $request->validate([
            'cantidad' => 'required|integer|min:0',  // Validar cantidad
            'id_user' => 'required|exists:users,id', // Validar que el id_user exista en la tabla 'users'
        ]);

        // Crear un nuevo registro en la tabla 'datos'
        $dato = Dato::create([
            'cantidad' => $request->cantidad,
            'id_user' => $request->id_user,
        ]);

        // Retornar el nuevo dato creado
        return response()->json($dato, 201);
    }


    // Eliminar un usuario
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado']);
    }
}
