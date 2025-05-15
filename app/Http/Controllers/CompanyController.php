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
            'contract_duration' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.end_time' => 'required|date_format:H:i',
            'availability.*.turno' => 'required|string|in:mañana,tarde',
            'availability.*.cantidad' => 'nullable|integer',
        ]);

        $company = Company::create([
            'name' => $validated['name'],
            'company_category_id' => $validated['company_category_id'],
            'contract_duration' => $validated['contract_duration'],
            'description' => $validated['description'] ?? '',
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
        ]);

        foreach ($validated['availability'] as $day) {
            $company->availabilityDays()->create([
                'day_of_week' => $day['day_of_week'],
                'start_time' => $day['start_time'],
                'end_time' => $day['end_time'],
                'turno' => $day['turno'],
                'cantidad' => $day['cantidad'] ?? null,
            ]);
        }

        return Inertia::render('companies/Index', [
            'companies' => Company::with(['category', 'availabilityDays'])->get(),
            'success' => 'Compañía creada con éxito.'
        ]);
    }

    // Mostrar formulario para editar una compañía existente
    public function edit(Company $company)
    {
        $categories = CompanyCategory::all();

        return Inertia::render('companies/edita', [
            'company' => $company->load('availabilityDays'),
            'categories' => $categories,
        ]);
    }

    // Actualizar una compañía existente
    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.end_time' => 'required|date_format:H:i',
            'availability.*.turno' => 'required|string|in:mañana,tarde',
            'availability.*.cantidad' => 'nullable|integer',
        ]);

        // Limpiar las horas de la disponibilidad antes de guardar
        foreach ($validated['availability'] as &$day) {
            $day['start_time'] = Carbon::parse($day['start_time'])->format('H:i');
            $day['end_time'] = Carbon::parse($day['end_time'])->format('H:i');
        }

        $company->update([
            'name' => $validated['name'],
            'company_category_id' => $validated['company_category_id'],
            'contract_duration' => $validated['contract_duration'],
            'description' => $validated['description'] ?? '',
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
        ]);

        $company->availabilityDays()->delete();

        foreach ($validated['availability'] as $day) {
            $company->availabilityDays()->create([
                'day_of_week' => $day['day_of_week'],
                'start_time' => $day['start_time'],
                'end_time' => $day['end_time'],
                'turno' => $day['turno'],
                'cantidad' => $day['cantidad'] ?? null,
            ]);
        }

        return Inertia::render('companies/Index', [
            'companies' => Company::with(['category', 'availabilityDays'])->get(),
            'success' => 'Compañía actualizada con éxito.',
        ]);
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return response()->json(['success' => 'Compañía eliminada con éxito.']);
    }
}