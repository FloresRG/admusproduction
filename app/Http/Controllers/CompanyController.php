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
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.end_time' => 'required|date_format:H:i',
            'availability.*.turno' => 'required|string|in:mañana,tarde',
        ]);

        $company = Company::create($validated);

        foreach ($validated['availability'] as $day) {
            $company->availabilityDays()->create($day);
        }

        // Redirigir a la vista de la lista de compañías utilizando Inertia
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

            'company' => $company->load('availabilityDays'), // <- asegúrate de cargarlo
            'categories' => $categories,
        ]);
    }

    // Actualizar una compañía existente


 public function update(Request $request, Company $company)
{
    // Validar los datos entrantes
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'company_category_id' => 'required|exists:company_categories,id',
        'contract_duration' => 'required|string|max:255',
        'description' => 'nullable|string',
        'availability' => 'required|array',
        'availability.*.day_of_week' => 'required|integer|between:1,7',
        'availability.*.start_time' => 'required|date_format:H:i',
        'availability.*.end_time' => 'required|date_format:H:i',
        'availability.*.turno' => 'required|string|in:mañana,tarde',
    ]);

    // Limpiar las horas de la disponibilidad antes de guardar
    foreach ($validated['availability'] as &$day) {
        // Verifica si las horas tienen segundos, y si es así, elimínalos
        $day['start_time'] = Carbon::parse($day['start_time'])->format('H:i');
        $day['end_time'] = Carbon::parse($day['end_time'])->format('H:i');
    }

    // Actualizar la información principal de la compañía
    $company->update([
        'name' => $validated['name'],
        'company_category_id' => $validated['company_category_id'],
        'contract_duration' => $validated['contract_duration'],
        'description' => $validated['description'],
    ]);

    // Eliminar días de disponibilidad antiguos
    $company->availabilityDays()->delete();

    // Crear nuevos días de disponibilidad
    foreach ($validated['availability'] as $day) {
        $company->availabilityDays()->create([
            'day_of_week' => $day['day_of_week'],
            'start_time' => $day['start_time'],
            'end_time' => $day['end_time'],
            'turno' => $day['turno'],
        ]);
    }

    // Redirigir a la vista de la lista de compañías con un mensaje de éxito
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
