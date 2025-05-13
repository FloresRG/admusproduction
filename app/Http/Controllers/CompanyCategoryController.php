<?php

namespace App\Http\Controllers;

use App\Models\CompanyCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyCategoryController extends Controller
{
    // Listar todas las categorías
    public function index()
    {
        // Obtiene todas las categorías
        $categories = CompanyCategory::all();

        // Pasa las categorías a la vista de Inertia
        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }


    // Crear una nueva categoría
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = CompanyCategory::create($request->only('name'));

        return response()->json($category, 201);
    }

    // Editar una categoría
    public function update(Request $request, $id)
    {
        $category = CompanyCategory::findOrFail($id);
        $category->update($request->only('name'));

        return response()->json($category);
    }

    // Eliminar una categoría
    public function destroy($id)
    {
        $category = CompanyCategory::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Categoría eliminada']);
    }
}
