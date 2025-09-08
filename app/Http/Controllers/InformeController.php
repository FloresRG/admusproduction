<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Company;
use App\Models\Informe;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InformeController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $informes = Informe::with(['user', 'company', 'comentarios.user'])
            ->where('titulo', 'like', "%{$search}%")
            ->orWhereHas('company', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString(); // Mantener la búsqueda al paginar

        return Inertia::render('Informes/Index', [
            'informes' => $informes,
            'filters' => ['search' => $search],
        ]);
    }


    public function create()
    {
        $companies = Company::select('id', 'name')->get();

        return Inertia::render('Informes/Create', [
            'authUser' => auth()->user(),
            'companies' => $companies,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo'         => 'required|string|max:255',
            'estado'         => 'nullable|string|max:100',
            'fecha_inicio'   => 'required|date',
            'fecha_fin'      => 'nullable|date|after_or_equal:fecha_inicio',
            'descripcion'    => 'nullable|string',
            'company_id'     => 'nullable|exists:companies,id',
        ]);

        // 🔒 Forzar valores por defecto en backend
        $validated['user_id'] = auth()->id();
        $validated['tipo'] = 'informe';
        $validated['estado'] = 'activo'; // 👈 fijo

        Informe::create($validated);

        return redirect()->route('informes.index');
    }




    public function edit(Informe $informe)
    {
        $companies = Company::select('id', 'name')->get();

        return Inertia::render('Informes/Edit', [
            'authUser'  => auth()->user(),
            'informe'   => $informe,
            'companies' => $companies,
        ]);
    }

    public function update(Request $request, Informe $informe)
    {
        $validated = $request->validate([
            'titulo'       => 'required|string|max:255',
            'estado'       => 'nullable|string|max:100',
            'fecha_inicio' => 'required|date',
            'fecha_fin'    => 'nullable|date|after_or_equal:fecha_inicio',
            'descripcion'  => 'nullable|string',
            'company_id'   => 'nullable|exists:companies,id',
        ]);

        // 🔒 Forzar valores fijos
        $validated['user_id'] = $informe->user_id;
        $validated['tipo'] = 'informe';
        $validated['estado'] = $validated['estado'] ?? 'activo';

        $informe->update($validated);

        return redirect()->route('informes.index');
    }


    public function destroy(Informe $informe)
    {
        $informe->delete();
        return redirect()->route('informes.index');
    }
    public function comentario(Request $request)
    {
        $validated = $request->validate([
            'contenido' => 'required|string',
            'informe_id' => 'required|exists:informes,id',
        ]);

        $validated['user_id'] = auth()->id();

        Comentario::create($validated);

        return redirect()->back();
    }
}
