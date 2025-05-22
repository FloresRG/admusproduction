<?php

namespace App\Http\Controllers;

use App\Models\Tarea;
use App\Models\Tipo;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TareaController extends Controller
{
    public function index()
    {
        // Obtenemos las tareas con los datos relacionados de tipo y empresa.
        $tareas = Tarea::with(['tipo', 'company'])->latest()->get();

        // Devolvemos los datos en un formato que el frontend pueda consumir.
        return Inertia::render('tareas/Index', [
            'tareas' => $tareas->map(function ($tarea) {
                return [
                    'id' => $tarea->id,
                    'titulo' => $tarea->titulo,
                    'descripcion' => $tarea->descripcion,
                    'fecha' => $tarea->fecha,
                    'prioridad' => $tarea->prioridad,
                    'tipo' => $tarea->tipo ? $tarea->tipo->nombre_tipo : null,  // nombre del tipo de tarea
                    'company' => $tarea->company ? $tarea->company->nombre : null, // nombre de la empresa
                ];
            }),
        ]);
    }

    public function create()
    {
        // Devolvemos los tipos y empresas disponibles para la creación de tareas.
        return Inertia::render('Tareas/Create', [
            'tipos' => Tipo::all(),
            'companies' => Company::all(),
        ]);
    }

    public function store(Request $request)
    {
        // Validación de los campos del formulario.
        $request->validate([
            'titulo' => 'required|string|max:255',
            'prioridad' => 'required|string',
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'tipo_id' => 'required|exists:tipos,id',
            'company_id' => 'required|exists:companies,id',
        ]);

        // Creamos una nueva tarea con los datos enviados.
        Tarea::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'prioridad' => $request->prioridad,
            'tipo_id' => $request->tipo_id,
            'company_id' => $request->company_id,
        ]);

        // Redirigimos a la página de tareas con un mensaje de éxito.
        return redirect()->route('tareas.index')->with('success', 'Tarea creada correctamente.');
    }

    public function edit($id)
    {
        // Obtenemos la tarea con su tipo y empresa.
        $tarea = Tarea::with(['tipo', 'company'])->findOrFail($id);

        // Devolvemos la tarea, tipos y empresas para ser usados en el formulario de edición.
        return Inertia::render('Tareas/Edit', [
            'tarea' => $tarea,
            'tipos' => Tipo::all(),
            'companies' => Company::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validación de los campos del formulario.
        $request->validate([
            'titulo' => 'required|string|max:255',
            'prioridad' => 'required|string',
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'tipo_id' => 'required|exists:tipos,id',
            'company_id' => 'required|exists:companies,id',
        ]);

        // Obtenemos la tarea a actualizar.
        $tarea = Tarea::findOrFail($id);

        // Actualizamos la tarea con los nuevos datos.
        $tarea->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'prioridad' => $request->prioridad,
            'tipo_id' => $request->tipo_id,
            'company_id' => $request->company_id,
        ]);

        // Redirigimos a la página de tareas con un mensaje de éxito.
        return redirect()->route('tareas.index')->with('success', 'Tarea actualizada.');
    }

    public function destroy($id)
    {
        // Eliminamos la tarea con el ID especificado.
        Tarea::destroy($id);

        // Redirigimos a la página de tareas con un mensaje de éxito.
        return redirect()->route('tareas.index')->with('success', 'Tarea eliminada.');
    }
}
