<?php

namespace App\Http\Controllers;

use App\Models\Premio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PremioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $premios = Premio::latest()->paginate(10);
        
        return Inertia::render('Premios/Index', [
            'premios' => $premios
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Premios/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_premio' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'puntos_necesarios' => 'nullable|integer|min:0',
        ]);

        Premio::create($validated);

        return redirect()->route('premios.index')
            ->with('success', 'Premio creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Premio $premio)
    {
        return Inertia::render('Premios/Show', [
            'premio' => $premio
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Premio $premio)
    {
        return Inertia::render('Premios/Edit', [
            'premio' => $premio
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Premio $premio)
    {
        $validated = $request->validate([
            'nombre_premio' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'puntos_necesarios' => 'nullable|integer|min:0',
        ]);

        $premio->update($validated);

        return redirect()->route('premios.index')
            ->with('success', 'Premio actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Premio $premio)
    {
        $premio->delete();

        return redirect()->route('premios.index')
            ->with('success', 'Premio eliminado exitosamente.');
    }
}