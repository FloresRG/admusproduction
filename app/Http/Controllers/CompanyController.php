<?php

namespace App\Http\Controllers;

use App\Models\AvailabilityDay;
use App\Models\Booking;
use App\Models\Company;
use App\Models\CompanyCategory;
use App\Models\Paquete;
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
            ->orderBy('created_at', 'desc')
            ->get();

        // Semana actual (lunes a domingo)
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        // Bookings de la semana actual con usuario e empresa
        $bookings = Booking::with(['company', 'user'])
            ->whereBetween('start_time', [$startOfWeek, $endOfWeek])
            ->get()
            ->groupBy('day_of_week');

        // Estructura: [day_of_week => [ [empresa, influencer] ]]
        $influencersByDay = [];
        foreach ($bookings as $day => $dayBookings) {
            foreach ($dayBookings as $booking) {
                $influencersByDay[$day][] = [
                    'empresa' => $booking->company->name,
                    'influencer' => $booking->user->name,
                ];
            }
        }

        return Inertia::render('companies/Index', [
            'companies' => $companies,
            'influencersByDay' => $influencersByDay,
        ]);
    }

    // Mostrar formulario para crear una nueva compañía
    public function create()
    {
        $categories = CompanyCategory::all();
        $paquetes = Paquete::all(); // Agrega esto

        return Inertia::render('companies/create', [
            'categories' => $categories,
            'paquetes' => $paquetes, // Agrega esto
        ]);
    }

    // Almacenar una nueva compañía
    public function store(Request $request)
    {
        $availability = $request->input('availability', []);

        foreach ($availability as $key => $slot) {
            // Si no se define 'turno', se usa 'mañana'
            $turno = $slot['turno'] ?? 'mañana';

            // Si no se definen tiempos, se colocan por defecto según el turno
            if (!isset($slot['start_time']) || !isset($slot['end_time'])) {
                if ($turno === 'mañana') {
                    $availability[$key]['start_time'] = '09:30';
                    $availability[$key]['end_time'] = '13:00';
                } elseif ($turno === 'tarde') {
                    $availability[$key]['start_time'] = '14:00';
                    $availability[$key]['end_time'] = '18:00';
                }
            }

            // Asegurar que 'turno' tenga valor si no se envió
            if (!isset($slot['turno'])) {
                $availability[$key]['turno'] = 'mañana';
            }
        }

        // Reemplazamos los datos modificados antes de validar
        $request->merge(['availability' => $availability]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string',
            'description' => 'nullable|string',
            'influencer' => 'required|in:si,no',
            'paquete_id' => 'nullable|exists:paquetes,id',
            'nombre_cliente' => 'nullable|string|max:255',
            'especificaciones' => 'nullable|string|max:255',
            'seguidores_inicio' => 'nullable|integer|min:0',
            'seguidores_fin' => 'nullable|integer|min:0',
            'direccion' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'celular' => 'nullable|string',
            'monto_mensual' => 'nullable|string',
            'contrato' => 'nullable|file|mimes:pdf',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'crear_usuario' => 'nullable|boolean',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required',
            'availability.*.end_time' => 'required',
            'availability.*.cantidad' => 'nullable|integer|min:0',
        ]);

        // Guardar contrato
        if ($request->hasFile('contrato')) {
            $filename = time() . '_' . uniqid() . '.' . $request->file('contrato')->getClientOriginalExtension();
            $destination = $_SERVER['DOCUMENT_ROOT'] . '/contratos';
            if (!file_exists($destination)) mkdir($destination, 0755, true);
            $request->file('contrato')->move($destination, $filename);
            $validated['contrato'] = 'contratos/' . $filename;
        }

        // Guardar logo
        if ($request->hasFile('logo')) {
            $filename = time() . '_' . uniqid() . '.' . $request->file('logo')->getClientOriginalExtension();
            $destination = $_SERVER['DOCUMENT_ROOT'] . '/logos';
            if (!file_exists($destination)) mkdir($destination, 0755, true);
            $request->file('logo')->move($destination, $filename);
            $validated['logo'] = 'logos/' . $filename;
        }

        $company = Company::create($validated);

        $days = [1 => 'monday', 2 => 'tuesday', 3 => 'wednesday', 4 => 'thursday', 5 => 'friday', 6 => 'saturday', 7 => 'sunday'];
        foreach ($validated['availability'] as $availability) {
            $availability['day_of_week'] = $days[$availability['day_of_week']] ?? $availability['day_of_week'];
            $company->availabilityDays()->create($availability);
        }

        if ($request->boolean('crear_usuario')) {
            $email = Str::slug($company->name, '') . '@gmail.com';
            $password = $email;

            $user = User::create([
                'name' => $company->name,
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            $user->assignRole('empresa');
        }

        return redirect()->route('companies.index')
            ->with('success', 'Empresa creada correctamente');
    }
    // Mostrar formulario para editar una compañía existente
    public function edit($id)
    {
        $company = Company::with(['availabilityDays', 'category'])->findOrFail($id);
        $categories = CompanyCategory::all();
        $paquetes = Paquete::all();
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
                'contrato_url' => $company->contrato ? asset($company->contrato) : null,
                'logo_url' => $company->logo ? asset($company->logo) : null,
                'availability' => $availability,
                'influencer' => $company->influencer, // Agrega esto
                'paquete_id' => $company->paquete_id,
                'nombre_cliente' => $company->nombre_cliente,
                'especificaciones' => $company->especificaciones,
                'seguidores_inicio' => $company->seguidores_inicio,
                'seguidores_fin' => $company->seguidores_fin,
            ],
            'categories' => $categories,
            'paquetes' => $paquetes,
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
            'influencer' => 'required|in:si,no',
            'paquete_id' => 'nullable|exists:paquetes,id',
            'nombre_cliente' => 'nullable|string|max:255',
            'especificaciones' => 'nullable|string|max:255',
            'seguidores_inicio' => 'nullable|integer|min:0',
            'seguidores_fin' => 'nullable|integer|min:0',
            'direccion' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'celular' => 'nullable|string',
            'monto_mensual' => 'nullable|string',
            'contrato' => 'nullable|file|mimes:pdf',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required',
            'availability.*.end_time' => 'required',
            'availability.*.cantidad' => 'nullable|integer|min:0',
            'crear_usuario' => 'nullable|boolean',
        ]);

        // Contrato
        if ($request->hasFile('contrato')) {
            if ($company->contrato && file_exists($_SERVER['DOCUMENT_ROOT'] . '/' . $company->contrato)) {
                unlink($_SERVER['DOCUMENT_ROOT'] . '/' . $company->contrato);
            }

            $filename = time() . '_' . uniqid() . '.' . $request->file('contrato')->getClientOriginalExtension();
            $destination = $_SERVER['DOCUMENT_ROOT'] . '/contratos';
            if (!file_exists($destination)) mkdir($destination, 0755, true);
            $request->file('contrato')->move($destination, $filename);
            $validated['contrato'] = 'contratos/' . $filename;
        } else {
            unset($validated['contrato']);
        }

        // Logo
        if ($request->hasFile('logo')) {
            if ($company->logo && file_exists($_SERVER['DOCUMENT_ROOT'] . '/' . $company->logo)) {
                unlink($_SERVER['DOCUMENT_ROOT'] . '/' . $company->logo);
            }

            $filename = time() . '_' . uniqid() . '.' . $request->file('logo')->getClientOriginalExtension();
            $destination = $_SERVER['DOCUMENT_ROOT'] . '/logos';
            if (!file_exists($destination)) mkdir($destination, 0755, true);
            $request->file('logo')->move($destination, $filename);
            $validated['logo'] = 'logos/' . $filename;
        } else {
            unset($validated['logo']);
        }

        $company->update($validated);

        $days = [1 => 'monday', 2 => 'tuesday', 3 => 'wednesday', 4 => 'thursday', 5 => 'friday', 6 => 'saturday', 7 => 'sunday'];
        $company->availabilityDays()->delete();
        foreach ($validated['availability'] as $availability) {
            $availability['day_of_week'] = $days[$availability['day_of_week']] ?? $availability['day_of_week'];
            $company->availabilityDays()->create($availability);
        }

        if ($request->boolean('crear_usuario')) {
            $email = Str::slug($company->name, '') . '@gmail.com';
            $password = $email;

            $user = User::create([
                'name' => $company->name,
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            $user->assignRole('empresa');
        }

        return redirect()->route('companies.index')
            ->with('success', 'Empresa actualizada correctamente');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return response()->json(['success' => 'Compañía eliminada con éxito.']);
    }
    public function toggleEstado(Company $company)
    {
        $company->estado = $company->estado === 'activo' ? 'inactivo' : 'activo';
        $company->save();

        return response()->json($company);
    }

    public function indexmark()
    {
        $companies = Company::with(['category', 'availabilityDays'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Semana actual (lunes a domingo)
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        // Bookings de la semana actual con usuario e empresa
        $bookings = Booking::with(['company', 'user'])
            ->whereBetween('start_time', [$startOfWeek, $endOfWeek])
            ->get()
            ->groupBy('day_of_week');

        // Estructura: [day_of_week => [ [empresa, influencer] ]]
        $influencersByDay = [];
        foreach ($bookings as $day => $dayBookings) {
            foreach ($dayBookings as $booking) {
                $influencersByDay[$day][] = [
                    'empresa' => $booking->company->name,
                    'influencer' => $booking->user->name,
                ];
            }
        }

        return Inertia::render('companies/Indexmark', [
            'companies' => $companies,
            'influencersByDay' => $influencersByDay,
        ]);
    }

    // Mostrar formulario para crear una nueva compañía
    public function createmark()
    {
        $categories = CompanyCategory::all();
        $paquetes = Paquete::all(); // Agrega esto

        return Inertia::render('companies/createmark', [
            'categories' => $categories,
            'paquetes' => $paquetes, // Agrega esto
        ]);
    }
     // Almacenar una nueva compañía
    public function storemark(Request $request)
    {
        $availability = $request->input('availability', []);

        foreach ($availability as $key => $slot) {
            // Si no se define 'turno', se usa 'mañana'
            $turno = $slot['turno'] ?? 'mañana';

            // Si no se definen tiempos, se colocan por defecto según el turno
            if (!isset($slot['start_time']) || !isset($slot['end_time'])) {
                if ($turno === 'mañana') {
                    $availability[$key]['start_time'] = '09:30';
                    $availability[$key]['end_time'] = '13:00';
                } elseif ($turno === 'tarde') {
                    $availability[$key]['start_time'] = '14:00';
                    $availability[$key]['end_time'] = '18:00';
                }
            }

            // Asegurar que 'turno' tenga valor si no se envió
            if (!isset($slot['turno'])) {
                $availability[$key]['turno'] = 'mañana';
            }
        }

        // Reemplazamos los datos modificados antes de validar
        $request->merge(['availability' => $availability]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string',
            'description' => 'nullable|string',
            'influencer' => 'required|in:si,no',
            'paquete_id' => 'nullable|exists:paquetes,id',
            'nombre_cliente' => 'nullable|string|max:255',
            'especificaciones' => 'nullable|string|max:255',
            'seguidores_inicio' => 'nullable|integer|min:0',
            'seguidores_fin' => 'nullable|integer|min:0',
            'direccion' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'celular' => 'nullable|string',
            'monto_mensual' => 'nullable|string',
            'contrato' => 'nullable|file|mimes:pdf',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'crear_usuario' => 'nullable|boolean',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required',
            'availability.*.end_time' => 'required',
            'availability.*.cantidad' => 'nullable|integer|min:0',
        ]);

        // Guardar contrato
        if ($request->hasFile('contrato')) {
            $filename = time() . '_' . uniqid() . '.' . $request->file('contrato')->getClientOriginalExtension();
            $destination = $_SERVER['DOCUMENT_ROOT'] . '/contratos';
            if (!file_exists($destination)) mkdir($destination, 0755, true);
            $request->file('contrato')->move($destination, $filename);
            $validated['contrato'] = 'contratos/' . $filename;
        }

        // Guardar logo
        if ($request->hasFile('logo')) {
            $filename = time() . '_' . uniqid() . '.' . $request->file('logo')->getClientOriginalExtension();
            $destination = $_SERVER['DOCUMENT_ROOT'] . '/logos';
            if (!file_exists($destination)) mkdir($destination, 0755, true);
            $request->file('logo')->move($destination, $filename);
            $validated['logo'] = 'logos/' . $filename;
        }

        $company = Company::create($validated);

        $days = [1 => 'monday', 2 => 'tuesday', 3 => 'wednesday', 4 => 'thursday', 5 => 'friday', 6 => 'saturday', 7 => 'sunday'];
        foreach ($validated['availability'] as $availability) {
            $availability['day_of_week'] = $days[$availability['day_of_week']] ?? $availability['day_of_week'];
            $company->availabilityDays()->create($availability);
        }

        if ($request->boolean('crear_usuario')) {
            $email = Str::slug($company->name, '') . '@gmail.com';
            $password = $email;

            $user = User::create([
                'name' => $company->name,
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            $user->assignRole('empresa');
        }

        return redirect()->route('indexmark')
            ->with('success', 'Empresa creada correctamente');
    }

    // Mostrar formulario para editar una compañía existente
    public function editmark($id)
    {
        $company = Company::with(['availabilityDays', 'category'])->findOrFail($id);
        $categories = CompanyCategory::all();
        $paquetes = Paquete::all();
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

        return Inertia::render('companies/editmark', [
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
                'contrato_url' => $company->contrato ? asset($company->contrato) : null,
                'logo_url' => $company->logo ? asset($company->logo) : null,
                'availability' => $availability,
                'influencer' => $company->influencer, // Agrega esto
                'paquete_id' => $company->paquete_id,
                'nombre_cliente' => $company->nombre_cliente,
                'especificaciones' => $company->especificaciones,
                'seguidores_inicio' => $company->seguidores_inicio,
                'seguidores_fin' => $company->seguidores_fin,
            ],
            'categories' => $categories,
            'paquetes' => $paquetes,
            'has_user' => $hasUser,
        ]);
    }
     public function updatemark(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|string',
            'description' => 'nullable|string',
            'influencer' => 'required|in:si,no',
            'paquete_id' => 'nullable|exists:paquetes,id',
            'nombre_cliente' => 'nullable|string|max:255',
            'especificaciones' => 'nullable|string|max:255',
            'seguidores_inicio' => 'nullable|integer|min:0',
            'seguidores_fin' => 'nullable|integer|min:0',
            'direccion' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'celular' => 'nullable|string',
            'monto_mensual' => 'nullable|string',
            'contrato' => 'nullable|file|mimes:pdf',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:1,7',
            'availability.*.turno' => 'required|in:mañana,tarde',
            'availability.*.start_time' => 'required',
            'availability.*.end_time' => 'required',
            'availability.*.cantidad' => 'nullable|integer|min:0',
            'crear_usuario' => 'nullable|boolean',
        ]);

        // Contrato
        if ($request->hasFile('contrato')) {
            if ($company->contrato && file_exists($_SERVER['DOCUMENT_ROOT'] . '/' . $company->contrato)) {
                unlink($_SERVER['DOCUMENT_ROOT'] . '/' . $company->contrato);
            }

            $filename = time() . '_' . uniqid() . '.' . $request->file('contrato')->getClientOriginalExtension();
            $destination = $_SERVER['DOCUMENT_ROOT'] . '/contratos';
            if (!file_exists($destination)) mkdir($destination, 0755, true);
            $request->file('contrato')->move($destination, $filename);
            $validated['contrato'] = 'contratos/' . $filename;
        } else {
            unset($validated['contrato']);
        }

        // Logo
        if ($request->hasFile('logo')) {
            if ($company->logo && file_exists($_SERVER['DOCUMENT_ROOT'] . '/' . $company->logo)) {
                unlink($_SERVER['DOCUMENT_ROOT'] . '/' . $company->logo);
            }

            $filename = time() . '_' . uniqid() . '.' . $request->file('logo')->getClientOriginalExtension();
            $destination = $_SERVER['DOCUMENT_ROOT'] . '/logos';
            if (!file_exists($destination)) mkdir($destination, 0755, true);
            $request->file('logo')->move($destination, $filename);
            $validated['logo'] = 'logos/' . $filename;
        } else {
            unset($validated['logo']);
        }

        $company->update($validated);

        $days = [1 => 'monday', 2 => 'tuesday', 3 => 'wednesday', 4 => 'thursday', 5 => 'friday', 6 => 'saturday', 7 => 'sunday'];
        $company->availabilityDays()->delete();
        foreach ($validated['availability'] as $availability) {
            $availability['day_of_week'] = $days[$availability['day_of_week']] ?? $availability['day_of_week'];
            $company->availabilityDays()->create($availability);
        }

        if ($request->boolean('crear_usuario')) {
            $email = Str::slug($company->name, '') . '@gmail.com';
            $password = $email;

            $user = User::create([
                'name' => $company->name,
                'email' => $email,
                'password' => Hash::make($password),
            ]);

            $user->assignRole('empresa');
        }

        return redirect()->route('indexmark')
            ->with('success', 'Empresa actualizada correctamente');
    }
}
