<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::with('category')->get();
        $categories = CompanyCategory::all();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|integer',
            'description' => 'nullable|string',
        ]);

        Company::create($validated);

        return redirect()->route('companies.index')->with('success', 'Empresa creada exitosamente.');
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_category_id' => 'required|exists:company_categories,id',
            'contract_duration' => 'required|integer',
            'description' => 'nullable|string',
        ]);

        $company->update($validated);

        return response()->json(['message' => 'Empresa actualizada exitosamente.']);
    }
}
