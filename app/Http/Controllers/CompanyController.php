<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityDay;
use App\Models\Company;
use App\Models\CompanyCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    // Listar compañías con sus categorías y días de disponibilidad
    public function index()
    {
        $companies = Company::with(['category', 'availabilityDays'])->get();
        return Inertia::render('companies/Index', [
            'companies' => $companies,
        ]);
    }

    // Mostrar formulario para crear una nueva compañía
    public function create()
    {
        $categories = CompanyCategory::all();

        return Inertia::render('companies/create', [
            'categories' => $categories,
        ]);
    }

    // Almacenar una nueva compañía
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string',
            'description' => 'nullable|string',
            'ubicacion' => 'required|string',
            'direccion' => 'required|string', // Formato: "latitud,longitud"
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.end_time' => 'required|date_format:H:i',
            'availability.*.cantidad' => 'nullable|integer|min:0',
        ]);

        $company = Company::create($validated);

        foreach ($validated['availability'] as $availability) {
            $company->availabilityDays()->create($availability);
        }

        return redirect()->route('companies.index')
            ->with('success', 'Empresa creada correctamente');
    }

    // Mostrar el formulario de edición
    public function edit($id)
    {
        $company = Company::with('availabilityDays')->findOrFail($id);
        $categories = CompanyCategory::all();

        // Adaptamos availability a lo esperado por el frontend
        $availability = $company->availabilityDays->map(function ($day) {
            return [
                'day_of_week' => match ($day->day_of_week) {
                    'monday' => 1,
                    'tuesday' => 2,
                    'wednesday' => 3,
                    'thursday' => 4,
                    'friday' => 5,
                    'saturday' => 6,
                    'sunday' => 7,
                },
                'turno' => $day->turno,
                'cantidad' => $day->cantidad,
                'start_time' => $day->start_time,
                'end_time' => $day->end_time,
            ];
        });

        return Inertia::render('companies/edita', [
            'company' => $company,
            'categories' => $categories,
            'availability' => $availability,
        ]);
    }

    // Actualizar la compañía
    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string',
            'description' => 'nullable|string',
            'ubicacion' => 'required|string',
            'direccion' => 'required|string', // Formato: "latitud,longitud"
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.end_time' => 'required|date_format:H:i',
            'availability.*.cantidad' => 'nullable|integer|min:0',
        ]);

        $company->update($validated);

        // Actualizar la disponibilidad
        $company->availabilityDays()->delete();
        foreach ($validated['availability'] as $availability) {
            $company->availabilityDays()->create($availability);
        }

        return redirect()->route('companies.index')
            ->with('success', 'Empresa actualizada correctamente');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return response()->json(['success' => 'Compañía eliminada con éxito.']);
    }
}
