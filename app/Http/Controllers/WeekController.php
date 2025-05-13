<?php

namespace App\Http\Controllers;

use App\Models\Week;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WeekController extends Controller
{
    public function index()
    {
        $weeks = Week::all();
        return Inertia::render('Weeks/Index', ['weeks' => $weeks]);
    }

    public function create()
    {
        return Inertia::render('Weeks/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        Week::create($request->all());
        return redirect('/weeks');
    }

    public function edit(Week $week)
    {
        return Inertia::render('Weeks/Edit', ['week' => $week]);
    }

    public function update(Request $request, Week $week)
    {
        $week->update($request->all());
        return redirect('/weeks');
    }

    public function destroy(Week $week)
    {
        $week->delete();
        return redirect('/weeks');
    }
}
