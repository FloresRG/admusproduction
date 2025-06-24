<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyLinkComprobante;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideosController extends Controller
{
    /**
     * Mostrar todos los videos de las empresas
     */
    /* public function index(Request $request)
    {
        // Verificar si el usuario está autenticado y tiene el rol 'empresa'
        $user = auth()->user();

        // Verificar si el usuario está autenticado y tiene el rol 'empresa'
        if (!$user || !$user->hasRole('empresa')) {
            abort(403, 'Acceso no autorizado');
        }
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
            $query->whereHas('link', function ($q) use ($search) {
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
    } */
    /* public function index(Request $request)
    {
        $user = auth()->user();

        // Solo usuarios con rol empresa o admin pueden acceder
        if (!$user || !$user->hasAnyRole(['empresa', 'admin'])) {
            abort(403, 'Acceso no autorizado');
        }

        $search = $request->get('search', '');
        $companyFilter = $request->get('company', '');
        $monthFilter = $request->get('month', '');

        $query = CompanyLinkComprobante::with([
            'company:id,name,logo',
            'link:id,link,detalle',
            'comprobante:id,nombre'
        ]);

        // Filtrar solo links de video
        $query->whereHas('link', function ($q) {
            $q->where('link', 'like', '%youtube%')
                ->orWhere('link', 'like', '%youtu.be%')
                ->orWhere('link', 'like', '%vimeo%')
                ->orWhere('link', 'like', '%dailymotion%')
                ->orWhere('link', 'like', '%tiktok.com%')
                ->orWhere('link', 'like', '%video%');
        });

        // 🟡 Filtrar por empresa solo si el usuario es del tipo empresa
        if ($user->hasRole('empresa')) {
            $query->whereHas('company', function ($q) use ($user) {
                $q->where('name', $user->name);
            });
        }

        // Aplicar filtros adicionales
        if ($search) {
            $query->whereHas('link', function ($q) use ($search) {
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

        // Obtener empresas para filtros (solo si es admin)
        $companies = $user->hasRole('admin')
            ? Company::select('id', 'name')->orderBy('name')->get()
            : [];

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
    } */



    public function index(Request $request)
    {
        $user = auth()->user();

         if (!$user || !$user->hasAnyRole(['empresa', 'admin'])) {
            abort(403, 'Acceso no autorizado');
        } 
        // Verificar si el usuario está autenticado y tiene el rol 'empresa'
        // if (!$user || !$user->hasRole('empresa')) {
        //     abort(403, 'Acceso no autorizado');
        // }
        $empresaNombre = null;
        if ($user->hasRole('empresa')) {
            $empresaNombre = $user->name;
        }

        $search = $request->get('search', '');
        $companyFilter = $request->get('company', '');
        $monthFilter = $request->get('month', '');
        $fechaDesde = $request->get('fecha_desde');
        $fechaHasta = $request->get('fecha_hasta');

        $query = CompanyLinkComprobante::with([
            'company:id,name,logo',
            'link:id,link,detalle',
            'comprobante:id,nombre'
        ]);

        // Solo videos (links válidos)
        $query->whereHas('link', function ($q) {
            $q->where('link', 'like', '%youtube%')
                ->orWhere('link', 'like', '%youtu.be%')
                ->orWhere('link', 'like', '%vimeo%')
                ->orWhere('link', 'like', '%dailymotion%')
                ->orWhere('link', 'like', '%tiktok.com%')
                ->orWhere('link', 'like', '%video%');
        });

        // Filtrar por empresa si es empresa
        if ($user->hasRole('empresa')) {
            $query->whereHas('company', function ($q) use ($user) {
                $q->where('name', $user->name);
            });
        }

        // Filtros personalizados
        if ($search) {
            $query->whereHas('link', function ($q) use ($search) {
                $q->where('detalle', 'like', "%{$search}%");
            });
        }

        if ($companyFilter) {
            $query->where('company_id', $companyFilter);
        }

        if ($monthFilter) {
            $query->where('mes', $monthFilter);
        }

        if ($fechaDesde) {
            $query->whereDate('fecha', '>=', date('Y-m-d', strtotime($fechaDesde)));
        }

        if ($fechaHasta) {
            $query->whereDate('fecha', '<=', date('Y-m-d', strtotime($fechaHasta)));
        }


        $videos = $query->orderBy('fecha', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->appends($request->all());


        $companies = $user->hasRole('admin')
            ? Company::select('id', 'name')->orderBy('name')->get()
            : [];

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
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
            ],
            'empresaNombre' => $empresaNombre,
        ]);
    }

    public function indexmes(Request $request)
    {
        $user = auth()->user();

         if (!$user || !$user->hasAnyRole(['empresa', 'admin'])) {
            abort(403, 'Acceso no autorizado');
        } 
        // Verificar si el usuario está autenticado y tiene el rol 'empresa'
        // if (!$user || !$user->hasRole('empresa')) {
        //     abort(403, 'Acceso no autorizado');
        // }

        $search = $request->get('search', '');
        $companyFilter = $request->get('company', '');
        // Ignoramos el filtro $monthFilter porque queremos solo mes actual
        $fechaDesde = $request->get('fecha_desde');
        $fechaHasta = $request->get('fecha_hasta');

        $query = CompanyLinkComprobante::with([
            'company:id,name,logo',
            'link:id,link,detalle',
            'comprobante:id,nombre'
        ]);

        // Solo videos (links válidos)
        $query->whereHas('link', function ($q) {
            $q->where('link', 'like', '%youtube%')
                ->orWhere('link', 'like', '%youtu.be%')
                ->orWhere('link', 'like', '%vimeo%')
                ->orWhere('link', 'like', '%dailymotion%')
                ->orWhere('link', 'like', '%tiktok.com%')
                ->orWhere('link', 'like', '%video%');
        });

        // Filtrar por empresa si es empresa
        if ($user->hasRole('empresa')) {
            $query->whereHas('company', function ($q) use ($user) {
                $q->where('name', $user->name);
            });
        }

        // Filtros personalizados
        if ($search) {
            $query->whereHas('link', function ($q) use ($search) {
                $q->where('detalle', 'like', "%{$search}%");
            });
        }

        if ($companyFilter) {
            $query->where('company_id', $companyFilter);
        }

        // FILTRAR SOLO MES ACTUAL USANDO 'fecha'
        $startOfMonth = Carbon::now()->startOfMonth()->format('Y-m-d');
        $endOfMonth = Carbon::now()->endOfMonth()->format('Y-m-d');
        $query->whereDate('fecha', '>=', $startOfMonth)
            ->whereDate('fecha', '<=', $endOfMonth);

        // Opcional: si quieres mantener filtros de fecha desde/hasta, los puedes ignorar o comentar para evitar conflicto

        if ($fechaDesde) {
            $query->whereDate('fecha', '>=', date('Y-m-d', strtotime($fechaDesde)));
        }

        if ($fechaHasta) {
            $query->whereDate('fecha', '<=', date('Y-m-d', strtotime($fechaHasta)));
        }


        $videos = $query->orderBy('fecha', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->appends($request->all());

        $companies = $user->hasRole('admin')
            ? Company::select('id', 'name')->orderBy('name')->get()
            : [];

        $months = CompanyLinkComprobante::select('mes')
            ->distinct()
            ->whereNotNull('mes')
            ->orderBy('mes')
            ->pluck('mes');

        return Inertia::render('Videos/Indexmes', [
            'videos' => $videos,
            'companies' => $companies,
            'months' => $months,
            'filters' => [
                'search' => $search,
                'company' => $companyFilter,
                'month' => Carbon::now()->format('Y-m'), // Indicamos mes actual en el filtro
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
            ]
        ]);
    }

}
