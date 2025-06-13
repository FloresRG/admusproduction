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
        // ✅ Validación dinámica
        $request->validate([
            'photos.*' => 'nullable|image',
            'video_links.*' => 'nullable|url|max:255',
            'nombre' => 'nullable|string|max:255',
            'edad' => 'nullable|integer|min:0|max:120',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        // ✅ 1. Guardar fotos si existen
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photoFile) {
                $path = $photoFile->store('user_photos', 'public');

                $photo = Photo::create([
                    'path' => $path,
                    'tipo' => 'foto',
                ]);

                $user->photos()->attach($photo->id);
            }
        }

        // ✅ 2. Guardar links de videos si existen
        if ($request->filled('video_links')) {
            foreach ($request->input('video_links') as $link) {
                if ($link) {
                    $photo = Photo::create([
                        'path' => $link,
                        'tipo' => 'video',
                    ]);

                    $user->photos()->attach($photo->id);
                }
            }
        }

        // ✅ 3. Guardar datos si al menos un campo existe
        if ($request->filled('nombre') || $request->filled('edad') || $request->filled('descripcion')) {
            $jsonData = json_encode([
                'nombre' => $request->input('nombre'),
                'edad' => $request->input('edad'),
                'descripcion' => $request->input('descripcion'),
            ]);

            $photo = Photo::create([
                'path' => $jsonData,
                'tipo' => 'datos',
            ]);

            $user->photos()->attach($photo->id);
        }

        return redirect()->route('infuencersdatos.index')
            ->with('success', 'Contenido subido correctamente');
    }
}
