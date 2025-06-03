<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityDay;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AvailabilityDayController extends Controller
{
    public function index()
    {
        $days = AvailabilityDay::with('company')->get();
        return Inertia::render('AvailabilityDays/Index', ['days' => $days]);
    }

    public function create()
    {
        $companies = Company::all();
        return Inertia::render('AvailabilityDays/Create', ['companies' => $companies]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'company_id' => 'required',
            'day_of_week' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
            'turno' => 'required',
            'cantidad'    => 'nullable|integer|min:0',
            
        ]);

        AvailabilityDay::create($request->all());
        return redirect('/availability-days');
    }

    public function edit(AvailabilityDay $availabilityDay)
    {
        $companies = Company::all();
        return Inertia::render('AvailabilityDays/Edit', [
            'day' => $availabilityDay,
            'companies' => $companies
        ]);
    }

    public function update(Request $request, AvailabilityDay $availabilityDay)
    {
        $availabilityDay->update($request->all());
        return redirect('/availability-days');
    }

    public function destroy(AvailabilityDay $availabilityDay)
    {
        $availabilityDay->delete();
        return redirect('/availability-days');
    }
}
