<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('roles')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name', // Validamos que el rol exista
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Asignar el rol al usuario
        $user->assignRole($request->role); // Usando el método de Spatie/Permission

        return response()->json(['message' => 'Usuario creado con éxito', 'user' => $user], 201);
    }

    /* public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6|confirmed',
            'role' => 'required|exists:roles,name',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password
                ? Hash::make($request->password)
                : $user->password,
        ]);

        $user->syncRoles([$request->role]);

        return response()->json($user);
    } */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|exists:roles,name', // Validamos que el rol exista
        ]);

        $user = User::findOrFail($id);

        // Actualizar datos del usuario
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
        ]);

        // Asignar el nuevo rol al usuario
        $user->syncRoles([$request->role]); // Asigna un solo rol

        return response()->json(['message' => 'Usuario actualizado con éxito', 'user' => $user]);
    }


    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
