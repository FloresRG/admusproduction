<?php

namespace App\Http\Controllers;

use App\Models\Dato;
use App\Models\Photo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;

class DatoInfluencersController extends Controller
{
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

        return Inertia::render('influencers/infuencersdatos', [
            'users' => $users
        ]);
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

        return redirect()->back()->with('success', 'Usuario creado exitosamente');
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return redirect()->back()->with('error', 'Usuario no encontrado');
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

        // Actualizar o crear el campo cantidad en la tabla 'datos'
        if ($request->has('cantidad')) {
            // Verificar si el usuario tiene un dato asociado
            $dato = $user->dato; // Relación con el modelo Dato (User tiene un Dato)

            if ($dato) {
                // Si ya existe el Dato, lo actualizamos
                $dato->cantidad = $request->cantidad;
                $dato->save();
            } else {
                // Si no existe el Dato, creamos uno nuevo
                $user->dato()->create([  // Aquí creamos el nuevo Dato
                    'cantidad' => $request->cantidad,
                    'id_user' => $user->id,
                ]);
            }
        }

        // Guardar cambios en el usuario
        $user->save();

        return redirect()->back()->with('success', 'Campo actualizado exitosamente');
    }

    // Eliminar un usuario
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'Usuario eliminado exitosamente');
    }

    /*  public function uploadPhotos(Request $request, User $user)
    {
        $request->validate([
            'photos' => 'required|array|max:10',
            'photos.*' => 'required|file|image|mimes:jpeg,png,jpg|max:10240', // 10MB max
        ]);

        $uploadedPhotos = [];

        foreach ($request->file('photos') as $photo) {
            // Generar nombre único para la foto
            $filename = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();

            // Guardar en storage/app/public/influencers
            $path = $photo->storeAs('influencers', $filename, 'public');

            // Crear registro en la base de datos
            $photoRecord = Photo::create([
                'path' => $path,
                'nombre' => $photo->getClientOriginalName(),
                'tipo' => $photo->getClientMimeType(),
            ]);

            // Asociar la foto con el usuario
            $user->photos()->attach($photoRecord->id);

            $uploadedPhotos[] = [
                'id' => $photoRecord->id,
                'path' => Storage::url($path),
                'nombre' => $photoRecord->nombre,
            ];
        }

        return response()->json([
            'message' => 'Fotos subidas exitosamente',
            'photos' => $uploadedPhotos
        ]);
    } */
    public function uploadPhotos(Request $request, User $user)
    {
        $request->validate([
            'photos' => 'required|array|max:10',
            'photos.*' => 'required|file|image|mimes:jpeg,png,jpg|max:10240', // 10MB max
        ]);

        $uploadedPhotos = [];

        foreach ($request->file('photos') as $photo) {
            $filename = time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();

            if (app()->environment('production')) {
                // Guardar directamente en public_html/influencers (en producción)
                $destinationPath = public_path('influencers');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0775, true);
                }

                $photo->move($destinationPath, $filename);
                $path = 'influencers/' . $filename;
            } else {
                // En local, usar storage/app/public/influencers
                $path = $photo->storeAs('influencers', $filename, 'public');
            }

            $photoRecord = Photo::create([
                'path' => $path,
                'nombre' => $photo->getClientOriginalName(),
                'tipo' => $photo->getClientMimeType(),
            ]);

            $user->photos()->attach($photoRecord->id);

            $uploadedPhotos[] = [
                'id' => $photoRecord->id,
                'path' => asset($path), // Usamos asset() para ambas ubicaciones
                'nombre' => $photoRecord->nombre,
            ];
        }

        return response()->json([
            'message' => 'Fotos subidas exitosamente',
            'photos' => $uploadedPhotos
        ]);
    }


    public function deletePhoto(User $user, Photo $photo)
    {
        // Verificar que la foto pertenece al usuario
        if (!$user->photos()->where('photo_id', $photo->id)->exists()) {
            return response()->json(['error' => 'Foto no encontrada'], 404);
        }

        // Verificar si la foto está en public_path
        $fullPublicPath = public_path($photo->path);

        if (file_exists($fullPublicPath)) {
            unlink($fullPublicPath); // Eliminar desde public_html
        } elseif (Storage::disk('public')->exists($photo->path)) {
            Storage::disk('public')->delete($photo->path); // Eliminar desde storage
        }

        // Desasociar la relación con el usuario
        $user->photos()->detach($photo->id);

        // Si no hay más usuarios asociados, eliminar el registro
        if ($photo->users()->count() === 0) {
            $photo->delete();
        }

        return response()->json(['message' => 'Foto eliminada exitosamente']);
    }


    public function getPhotos(User $user)
    {
        $photos = $user->photos()->get()->map(function ($photo) {
            return [
                'id' => $photo->id,
                'path' => asset($photo->path), // asset() para compatibilidad con ambos entornos
                'nombre' => $photo->nombre,
                'tipo' => $photo->tipo,
            ];
        });

        return response()->json(['photos' => $photos]);
    }


    public function uploadVideos(Request $request, User $user)
    {
        // Validar según el tipo de contenido
        if ($request->has('content_type') && $request->content_type === 'datos') {
            // Validación para datos del influencer
            $request->validate([
                'content_type' => 'required|string',
                'influencer_data' => 'required|array',
                'influencer_data.nombre' => 'required|string|max:255',
                'influencer_data.edad' => 'required|integer|min:1|max:120',
                'influencer_data.descripcion' => 'required|string|max:1000',
            ]);

            try {
                // Crear registro para datos del influencer
                $dataRecord = Photo::create([
                    'path' => json_encode($request->influencer_data),
                    'nombre' => $request->influencer_data['nombre'] . ' - Datos',
                    'tipo' => 'datos', // Tipo datos
                ]);

                // Asociar los datos con el usuario
                $user->photos()->attach($dataRecord->id);

                return response()->json([
                    'message' => 'Datos del influencer guardados exitosamente',
                    'data' => [
                        'id' => $dataRecord->id,
                        'nombre' => $dataRecord->nombre,
                        'tipo' => $dataRecord->tipo,
                        'influencer_data' => $request->influencer_data,
                    ]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Error al guardar los datos: ' . $e->getMessage()
                ], 500);
            }
        } else {
            // Validación para video
            $request->validate([
                'video_url' => 'required|url',
            ]);

            try {
                // Crear registro para video
                $videoRecord = Photo::create([
                    'path' => $request->video_url, // Solo la URL del video
                    'nombre' => 'Video - ' . date('Y-m-d H:i:s'),
                    'tipo' => 'video', // Tipo video
                ]);

                // Asociar el video con el usuario
                $user->photos()->attach($videoRecord->id);

                return response()->json([
                    'message' => 'Video guardado exitosamente',
                    'video' => [
                        'id' => $videoRecord->id,
                        'url' => $request->video_url,
                        'nombre' => $videoRecord->nombre,
                        'tipo' => $videoRecord->tipo,
                    ]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Error al guardar el video: ' . $e->getMessage()
                ], 500);
            }
        }
    }

    public function getVideos(User $user)
    {
        // Obtener tanto videos como datos
        $items = $user->photos()
            ->whereIn('tipo', ['video', 'datos'])
            ->get()
            ->map(function ($item) {
                $result = [
                    'id' => $item->id,
                    'nombre' => $item->nombre,
                    'tipo' => $item->tipo,
                    'created_at' => $item->created_at,
                ];

                if ($item->tipo === 'video') {
                    // Para videos, path contiene directamente la URL
                    $result['url'] = $item->path;
                } else if ($item->tipo === 'datos') {
                    // Para datos, path contiene JSON con los datos del influencer
                    $pathData = json_decode($item->path, true);
                    $result['influencer_data'] = $pathData;
                }

                return $result;
            });

        return response()->json(['videos' => $items]); // Mantenemos el nombre 'videos' para compatibilidad
    }
    public function deleteVideo(User $user, Photo $video)
    {
        // Verificar que el video pertenece al usuario
        if (!$user->photos()->where('photo_id', $video->id)->exists()) {
            return response()->json(['error' => 'Video no encontrado'], 404);
        }

        // Verificar que es un video
        if ($video->tipo !== 'video') {
            return response()->json(['error' => 'El elemento no es un video'], 400);
        }

        // Desasociar de la tabla pivot
        $user->photos()->detach($video->id);

        // Si no hay más usuarios asociados a este video, eliminarlo completamente
        if ($video->users()->count() === 0) {
            $video->delete();
        }

        return response()->json(['message' => 'Video eliminado exitosamente']);
    }
    public function updateInfluencerData(Request $request, User $user, Photo $photo)
    {
        // Solo permite actualizar si el tipo es 'datos'
        if ($photo->tipo !== 'datos') {
            return response()->json(['error' => 'El elemento no es datos de influencer'], 400);
        }

        $request->validate([
            'influencer_data' => 'required|array',
            'influencer_data.nombre' => 'required|string|max:255',
            'influencer_data.edad' => 'required|integer|min:1|max:120',
            'influencer_data.descripcion' => 'required|string|max:1000',
        ]);

        $photo->path = json_encode($request->influencer_data);
        $photo->nombre = $request->influencer_data['nombre'] . ' - Datos';
        $photo->save();

        return response()->json([
            'message' => 'Datos actualizados exitosamente',
            'data' => [
                'id' => $photo->id,
                'nombre' => $photo->nombre,
                'tipo' => $photo->tipo,
                'influencer_data' => $request->influencer_data,
            ]
        ]);
    }
}
