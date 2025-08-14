<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Inertia\Inertia;

class InicioController extends Controller
{
    public function index()
    {
        $companies = Company::select('id', 'name', 'logo')->get()
            ->map(function ($company) {
                $company->logo = asset('storage/' . $company->logo);
                return $company;
            });

        return Inertia::render('Marketing', [
            'companies' => $companies,
        ]);
    }
}
