<?php

namespace App\Http\Controllers;

use App\Models\InfluencerAvailability;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InfluencerAvailabilityController extends Controller
{
    public function index()
    {
        $availabilities = InfluencerAvailability::with('user')->get();
        return Inertia::render('InfluencerAvailabilities/Index', ['availabilities' => $availabilities]);
    }

    public function create()
    {
        $users = User::all();
        return Inertia::render('InfluencerAvailabilities/Create', ['users' => $users]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'day_of_week' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'turno' => 'required',
        ]);

        InfluencerAvailability::create($request->all());
        return redirect('/influencer-availabilities');
    }

    public function edit(InfluencerAvailability $influencerAvailability)
    {
        $users = User::all();
        return Inertia::render('InfluencerAvailabilities/Edit', [
            'availability' => $influencerAvailability,
            'users' => $users
        ]);
    }

    public function update(Request $request, InfluencerAvailability $influencerAvailability)
    {
        $influencerAvailability->update($request->all());
        return redirect('/influencer-availabilities');
    }

    public function destroy(InfluencerAvailability $influencerAvailability)
    {
        $influencerAvailability->delete();
        return redirect('/influencer-availabilities');
    }
}
