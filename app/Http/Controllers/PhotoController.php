<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PhotoController extends Controller
{
    public function create(User $user)
    {
        return Inertia::render('fotos/fotoinfluencer', [
            'user' => $user,
        ]);
    }

    // Guardar foto subida
    /* public function store(Request $request, User $user)
    {
        $request->validate([
            'photo' => 'required|image|max:2048', // validar imagen max 2MB
        ]);

        // Guardar archivo en storage
        $path = $request->file('photo')->store('user_photos', 'public');

        // Crear el registro de la foto en la tabla photos
        $photo = Photo::create(['path' => $path]);

        // Asociar la foto al usuario en la tabla pivote
        $user->photos()->attach($photo->id);

        return redirect()->route('users.photos.upload', $user->id)
            ->with('success', 'Foto subida correctamente');
    } */
    public function store(Request $request, User $user)
    {
        $request->validate([
            'photos.*' => 'required|image', // validar cada imagen max 2MB
        ]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photoFile) {
                // Guardar archivo
                $path = $photoFile->store('user_photos', 'public');

                // Crear registro en photos
                $photo = Photo::create(['path' => $path]);

                // Asociar la foto al usuario (tabla pivote)
                $user->photos()->attach($photo->id);
            }
        }

        return redirect()->route('users.photos.upload', $user->id)
            ->with('success', 'Fotos subidas correctamente');
    }
}
