<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityDay;
use App\Models\Company;
use App\Models\CompanyCategory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;


class CompanyController extends Controller
{
    // Listar compañías con sus categorías y días de disponibilidad
    public function index()
    {
        $companies = Company::with(['category', 'availabilityDays'])
            ->orderBy('created_at', 'desc') // 👈 Aquí está el ordenamiento
            ->get();

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
            'celular' => 'nullable|string',
            'monto_mensual' => 'nullable|string',
            'contrato' => 'nullable|file|mimes:pdf', // Max 2MB
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'crear_usuario' => 'nullable|boolean',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required',
            'availability.*.end_time' => 'required',
            'availability.*.cantidad' => 'nullable|integer|min:0',
        ]);
        if ($request->hasFile('contrato')) {
            $validated['contrato'] = $request->file('contrato')->store('contratos', 'public');
        }

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }


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
        if ($request->boolean('crear_usuario')) {
            $email = Str::slug($company->name, '') . '@gmail.com'; // sin espacios ni símbolos
            $password = $email;

            $user = User::create([
                'name' => $company->name,
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            $user->assignRole('empresa'); // Spatie Role
        }

        return redirect()->route('companies.index')
            ->with('success', 'Empresa creada correctamente');
    }

    // Mostrar formulario para editar una compañía existente
    public function edit($id)
    {
        $company = Company::with(['availabilityDays', 'category'])->findOrFail($id);
        $categories = CompanyCategory::all();
        // Verifica si existe un usuario con el mismo nombre de la empresa
        $hasUser = User::where('name', $company->name)->exists();

        // Convertir los días de disponibilidad al formato esperado por el frontend
        $availability = $company->availabilityDays->map(function ($day) {
            $dayNumbers = [
                'monday' => 1,
                'tuesday' => 2,
                'wednesday' => 3,
                'thursday' => 4,
                'friday' => 5,
                'saturday' => 6,
                'sunday' => 7,
            ];

            return [
                'id' => $day->id,
                'day_of_week' => $dayNumbers[$day->day_of_week] ?? $day->day_of_week,
                'turno' => $day->turno,
                'start_time' => $day->start_time,
                'end_time' => $day->end_time,
                'cantidad' => $day->cantidad,
            ];
        })->toArray();

        return Inertia::render('companies/edit', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'company_category_id' => $company->company_category_id,
                'contract_duration' => $company->contract_duration,
                'description' => $company->description,
                'direccion' => $company->direccion,
                'start_date' => $company->start_date,
                'end_date' => $company->end_date,
                'celular' => $company->celular,
                'monto_mensual' => $company->monto_mensual,
                'contrato_url' => $company->contrato ? Storage::url($company->contrato) : null,
                'logo_url' => $company->logo ? Storage::url($company->logo) : null,
                'availability' => $availability,
            ],
            'categories' => $categories,
            'has_user' => $hasUser,
        ]);
    }

    // Actualizar una compañía existente
    public function update(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string',
            'description' => 'nullable|string',
            'direccion' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'celular' => 'nullable|string',
            'monto_mensual' => 'nullable|string',
            'contrato' => 'nullable|file|mimes:pdf|max:2048',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required',
            'availability.*.end_time' => 'required',
            'availability.*.cantidad' => 'nullable|integer|min:0',
            'crear_usuario' => 'nullable|boolean',
        ]);

        // Manejar archivo de contrato
        if ($request->hasFile('contrato')) {
            if ($company->contrato) {
                Storage::disk('public')->delete($company->contrato);
            }
            $validated['contrato'] = $request->file('contrato')->store('contratos', 'public');
        } else {
            // No se subió nuevo contrato, no actualizar el campo
            unset($validated['contrato']);
        }

        // Manejar archivo de logo
        if ($request->hasFile('logo')) {
            if ($company->logo) {
                Storage::disk('public')->delete($company->logo);
            }
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        } else {
            // No se subió nuevo logo, no actualizar el campo
            unset($validated['logo']);
        }

        // Actualizar la compañía
        $company->update($validated);

        // Actualizar días de disponibilidad
        $days = [
            1 => 'monday',
            2 => 'tuesday',
            3 => 'wednesday',
            4 => 'thursday',
            5 => 'friday',
            6 => 'saturday',
            7 => 'sunday',
        ];

        // Eliminar disponibilidades anteriores
        $company->availabilityDays()->delete();

        // Crear nuevas disponibilidades
        foreach ($validated['availability'] as $availability) {
            $availability['day_of_week'] = $days[$availability['day_of_week']] ?? $availability['day_of_week'];
            $company->availabilityDays()->create($availability);
        }
        if ($request->boolean('crear_usuario')) {
            $email = Str::slug($company->name, '') . '@gmail.com'; // sin espacios ni símbolos
            $password = $email;

            $user = User::create([
                'name' => $company->name,
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            $user->assignRole('empresa'); // Spatie Role
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
