<?php

namespace App\Http\Controllers;

use App\Models\InfluencerAvailability;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InfluencerAvailabilityController extends Controller
{

    public function index()
    {
        // Obtener todas las disponibilidades de los influencers
        return response()->json(InfluencerAvailability::with('user')->get());
    }


    public function store(Request $request)
    {
        $request->validate([
            'day_of_week' => 'required|string',
            'turno' => 'required|string',
        ]);

        $user_id = Auth::id();
        $start_time = $request->turno == 'tarde' ? '14:00' : '09:30';
        $end_time = $request->turno == 'tarde' ? '18:00' : '13:00';

        $existingAvailability = InfluencerAvailability::where('user_id', $user_id)
            ->where('day_of_week', $request->day_of_week)
            ->where('turno', $request->turno)
            ->first();

        if ($existingAvailability) {
            $existingAvailability->update([
                'start_time' => $start_time,
                'end_time' => $end_time,
            ]);
            return response()->json($existingAvailability);
        } else {
            $availability = InfluencerAvailability::create([
                'user_id' => $user_id,
                'day_of_week' => $request->day_of_week,
                'turno' => $request->turno,
                'start_time' => $start_time,
                'end_time' => $end_time,
            ]);
            return response()->json($availability, 201);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'turno' => 'required|string',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
        ]);

        $user_id = Auth::id();

        // Obtener la disponibilidad que queremos actualizar
        $availability = InfluencerAvailability::where('user_id', $user_id)->findOrFail($id);

        // Actualizar las horas del turno
        $availability->update([
            'turno' => $request->turno,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return response()->json($availability);
    }

    public function destroy($id)
    {
        $user_id = Auth::id();

        $availability = InfluencerAvailability::where('user_id', $user_id)->findOrFail($id);
        $availability->delete();

        return response()->json(null, 204);
    }
}
