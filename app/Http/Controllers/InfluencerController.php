<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class InfluencerController extends Controller
{

    /**
     * Obtener perfil del influencer con sus datos relacionados
     */
    public function profile()
    {
        $user = Auth::user();
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
                'datos' => $user->dato,
                'tipos' => $user->tipos,
                'photos' => $user->photos,
                'availabilities' => $user->availabilities
            ]
        ]);
    }

    /**
     * Actualizar fotos del influencer
     */
    public function updatePhotos(Request $request)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'exists:photos,id'
        ]);

        $user = Auth::user();
        $user->photos()->sync($request->photos);

        return response()->json([
            'status' => 'success',
            'message' => 'Photos updated successfully',
            'data' => $user->photos
        ]);
    }

    /**
     * Obtener disponibilidad del influencer
     */
    public function getAvailability()
    {
        $user = Auth::user();
        return response()->json([
            'status' => 'success',
            'data' => $user->availabilities
        ]);
    }

    /**
     * Actualizar disponibilidad del influencer
     */
    public function updateAvailability(Request $request)
    {
        $request->validate([
            'availabilities' => 'required|array',
            'availabilities.*.date' => 'required|date',
            'availabilities.*.time_start' => 'required|date_format:H:i',
            'availabilities.*.time_end' => 'required|date_format:H:i|after:availabilities.*.time_start'
        ]);

        $user = Auth::user();
        
        // Eliminar disponibilidades anteriores
        $user->availabilities()->delete();
        
        // Crear nuevas disponibilidades
        foreach ($request->availabilities as $availability) {
            $user->availabilities()->create($availability);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Availability updated successfully',
            'data' => $user->availabilities
        ]);
    }

    /**
     * Obtener reservas del influencer
     */
    public function getBookings()
    {
        $user = Auth::user();
        return response()->json([
            'status' => 'success',
            'data' => $user->bookings
        ]);
    }

    /**
     * Obtener tareas asignadas al influencer
     */
    public function getAssignments()
    {
        $user = Auth::user();
        return response()->json([
            'status' => 'success',
            'data' => $user->asignaciones
        ]);
    }
}
