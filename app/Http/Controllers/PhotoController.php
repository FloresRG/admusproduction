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

        return redirect()->route('infuencersdatos.index')
            ->with('success', 'Fotos subidas correctamente');
    }
}
