<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyLinkComprobante;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideosController extends Controller
{
    /**
     * Mostrar todos los videos de las empresas
     */
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $companyFilter = $request->get('company', '');
        $monthFilter = $request->get('month', '');

        $query = CompanyLinkComprobante::with([
            'company:id,name,logo',
            'link:id,link,detalle',
            'comprobante:id,nombre'
        ]);

        // Filtrar solo links que contengan videos (YouTube, Vimeo, etc.)
        $query->whereHas('link', function ($q) {
            $q->where('link', 'like', '%youtube%')
              ->orWhere('link', 'like', '%youtu.be%')
              ->orWhere('link', 'like', '%vimeo%')
              ->orWhere('link', 'like', '%dailymotion%')
              ->orWhere('link', 'like', '%tiktok.com%')
              ->orWhere('link', 'like', '%video%');
        });

        // Aplicar filtros
        if ($search) {
            $query->whereHas('company', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('link', function ($q) use ($search) {
                $q->where('detalle', 'like', "%{$search}%");
            });
        }

        if ($companyFilter) {
            $query->where('company_id', $companyFilter);
        }

        if ($monthFilter) {
            $query->where('mes', $monthFilter);
        }

        $videos = $query->orderBy('fecha', 'desc')
                       ->orderBy('created_at', 'desc')
                       ->paginate(12);

        // Obtener empresas para el filtro
        $companies = Company::select('id', 'name')
                           ->orderBy('name')
                           ->get();

        // Obtener meses disponibles para el filtro
        $months = CompanyLinkComprobante::select('mes')
                                      ->distinct()
                                      ->whereNotNull('mes')
                                      ->orderBy('mes')
                                      ->pluck('mes');

        return Inertia::render('Videos/Index', [
            'videos' => $videos,
            'companies' => $companies,
            'months' => $months,
            'filters' => [
                'search' => $search,
                'company' => $companyFilter,
                'month' => $monthFilter,
            ]
        ]);
    }
    


    /**
     * Mostrar videos de una empresa específica
     */
    public function show(Company $company)
    {
        $videos = CompanyLinkComprobante::with([
            'link:id,link,detalle',
            'comprobante:id,nombre'
        ])
            ->where('company_id', $company->id)
            ->whereHas('link', function ($q) {
                $q->where('link', 'like', '%youtube%')
                    ->orWhere('link', 'like', '%youtu.be%')
                    ->orWhere('link', 'like', '%vimeo%')
                    ->orWhere('link', 'like', '%dailymotion%')
                    ->orWhere('link', 'like', '%tiktok.com%')
                    ->orWhere('link', 'like', '%video%');
            })
            ->orderBy('fecha', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Videos/Show', [
            'company' => $company,
            'videos' => $videos
        ]);
    }
}
