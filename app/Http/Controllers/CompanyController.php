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
            'direccion' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|string|in:mañana,tarde',
            'availability.*.cantidad' => 'nullable|integer',
        ]);

        $company = Company::create([
            'name' => $validated['name'],
            'company_category_id' => $validated['company_category_id'],
            'contract_duration' => $validated['contract_duration'],
            'description' => $validated['description'] ?? '',
            'direccion' => $validated['direccion'] ?? '',
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
        ]);

        foreach ($validated['availability'] as $day) {
            $dayNames = [
                1 => 'monday',
                2 => 'tuesday',
                3 => 'wednesday',
                4 => 'thursday',
                5 => 'friday',
                6 => 'saturday',
                7 => 'sunday',
            ];

            // Definir horarios por turno
            $horarios = [
                'mañana' => ['start_time' => '09:30', 'end_time' => '13:00'],
                'tarde' => ['start_time' => '14:00', 'end_time' => '18:00'],
            ];

            $company->availabilityDays()->create([
                'day_of_week' => $dayNames[$day['day_of_week']],
                'start_time' => $horarios[$day['turno']]['start_time'],
                'end_time' => $horarios[$day['turno']]['end_time'],
                'turno' => $day['turno'],
                'cantidad' => $day['cantidad'] ?? null,
            ]);
        }


        return Inertia::render('companies/Index', [
            'companies' => Company::with(['category', 'availabilityDays'])->get(),
            'success' => 'Compañía creada con éxito.'
        ]);
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
    public function update(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string|max:255',
            'description' => 'nullable|string',
            'direccion' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|string|in:mañana,tarde',
            'availability.*.cantidad' => 'nullable|integer',
        ]);

        $company->update([
            'name' => $validated['name'],
            'company_category_id' => $validated['company_category_id'],
            'contract_duration' => $validated['contract_duration'],
            'description' => $validated['description'] ?? '',
            'direccion' => $validated['direccion'] ?? '',
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
        ]);

        // Actualizamos la disponibilidad
        $company->availabilityDays()->delete();

        $dayNames = [
            1 => 'monday',
            2 => 'tuesday',
            3 => 'wednesday',
            4 => 'thursday',
            5 => 'friday',
            6 => 'saturday',
            7 => 'sunday',
        ];

        $horarios = [
            'mañana' => ['start_time' => '09:30', 'end_time' => '13:00'],
            'tarde' => ['start_time' => '14:00', 'end_time' => '18:00'],
        ];

        foreach ($validated['availability'] as $day) {
            $company->availabilityDays()->create([
                'day_of_week' => $dayNames[$day['day_of_week']],
                'start_time' => $horarios[$day['turno']]['start_time'],
                'end_time' => $horarios[$day['turno']]['end_time'],
                'turno' => $day['turno'],
                'cantidad' => $day['cantidad'] ?? null,
            ]);
        }

        return redirect()->route('index')->with('success', 'Compañía actualizada con éxito.');

    }

    public function destroy(Company $company)
    {
        $company->delete();

        return response()->json(['success' => 'Compañía eliminada con éxito.']);
    }
}
