<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityDay;
use App\Models\Company;
use App\Models\CompanyCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            'direccion' => 'required|string', // Formato: "latitud,longitud"
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required',
            'availability.*.end_time' => 'required',
            'availability.*.cantidad' => 'nullable|integer|min:0',
        ]);

        $company = Company::create($validated);

        $days = [
            1 => 'monday',
            2 => 'tuesday',
            3 => 'wednesday',
            4 => 'thursday',
            5 => 'friday',
            6 => 'saturday',
            7 => 'sunday',
        ];

        foreach ($validated['availability'] as $availability) {
            $availability['day_of_week'] = $days[$availability['day_of_week']] ?? $availability['day_of_week'];
            $company->availabilityDays()->create($availability);
        }

        return redirect()->route('companies.index')
            ->with('success', 'Empresa creada correctamente');
    }

    public function edit($id)
    {
        $company = Company::with('availabilityDays')->findOrFail($id);
        $categories = CompanyCategory::all();

        // Formatear disponibilidad para el frontend
        $availability = $company->availabilityDays->map(function ($item) {
            return [
                'day_of_week' => is_numeric($item->day_of_week) ? $item->day_of_week : array_search($item->day_of_week, [
                    1 => 'monday',
                    2 => 'tuesday',
                    3 => 'wednesday',
                    4 => 'thursday',
                    5 => 'friday',
                    6 => 'saturday',
                    7 => 'sunday',
                ]),
                'start_time' => $item->start_time,
                'end_time' => $item->end_time,
                'turno' => $item->turno,
                'cantidad' => $item->cantidad,
            ];
        });

        return Inertia::render('companies/edit', [
            'company' => $company,
            'categories' => $categories,
            'availability' => $availability,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string',
            'description' => 'nullable|string',
            'direccion' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required',
            'availability.*.end_time' => 'required',
            'availability.*.cantidad' => 'nullable|integer|min:0',
        ]);

        $company = Company::findOrFail($id);
        $company->update($validated);

        // Actualizar disponibilidad
        $company->availabilityDays()->delete();

        $days = [
            1 => 'monday',
            2 => 'tuesday',
            3 => 'wednesday',
            4 => 'thursday',
            5 => 'friday',
            6 => 'saturday',
            7 => 'sunday',
        ];

        foreach ($validated['availability'] as $availability) {
            $availability['day_of_week'] = $days[$availability['day_of_week']] ?? $availability['day_of_week'];
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
