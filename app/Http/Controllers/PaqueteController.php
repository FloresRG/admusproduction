<?php

namespace App\Http\Controllers;

use App\Models\Paquete;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaqueteController extends Controller
{
    public function index()
    {
        $paquetes = Paquete::all();
        return Inertia::render('Paquetes/Index', [
            'paquetes' => $paquetes,
            'flash' => [
                'success' => session('success')
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Paquetes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_paquete' => 'required|string|max:255',
            'caracteristicas' => 'required|string',
            'descripcion' => 'required|string',
            'monto' => 'required|numeric',
            'puntos' => 'required|integer',
        ]);

        Paquete::create($request->all());
        return redirect()->route('paquetes.index')->with('success', 'Paquete creado exitosamente');
    }

    public function show(Paquete $paquete)
    {
        return Inertia::render('Paquetes/Show', [
            'paquete' => $paquete
        ]);
    }

    public function edit(Paquete $paquete)
    {
        return Inertia::render('Paquetes/Edit', [
            'paquete' => $paquete
        ]);
    }

    public function update(Request $request, Paquete $paquete)
    {
        $request->validate([
            'nombre_paquete' => 'required|string|max:255',
            'caracteristicas' => 'required|string',
            'descripcion' => 'required|string',
            'monto' => 'required|numeric',
            'puntos' => 'required|integer',
        ]);

        $paquete->update($request->all());
        return redirect()->route('paquetes.index')->with('success', 'Paquete actualizado exitosamente');
    }

    public function destroy(Paquete $paquete)
    {
        $paquete->delete();
        return redirect()->route('paquetes.index')->with('success', 'Paquete eliminado exitosamente');
    }
}