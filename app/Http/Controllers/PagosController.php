<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyLinkComprobante;
use App\Models\Comprobante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class PagosController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('empresa')) {
            // Buscar la empresa cuyo nombre coincide con el del usuario autenticado
            $company = Company::where('name', $user->name)->first();

            if ($company) {
                // Obtener solo los comprobantes asociados a esta empresa
                $comprobantes = Comprobante::whereHas('companyAssociations', function ($query) use ($company) {
                    $query->where('company_id', $company->id);
                })->with(['companyAssociations.company'])->orderBy('created_at', 'desc')->get();
            } else {
                $comprobantes = collect(); // Empresa no encontrada, lista vacía
            }
        } else {
            // Otros roles (admin, etc.) ven todo
            $comprobantes = Comprobante::with(['companyAssociations.company'])->orderBy('created_at', 'desc')->get();
        }

        return Inertia::render('pagos/index', [
            'comprobantes' => $comprobantes->map(function ($comp) {
                return [
                    'id' => $comp->id,
                    'comprobante' => asset($comp->comprobante),
                    'detalle' => $comp->detalle,
                    'glosa' => $comp->glosa,
                    'tipo' => $comp->tipo,
                    'company_associations' => $comp->companyAssociations->map(function ($assoc) {
                        return [
                            'id' => $assoc->id,
                            'mes' => $assoc->mes,
                            'fecha' => $assoc->fecha,
                            'company' => [
                                'id' => $assoc->company->id,
                                'name' => $assoc->company->name,
                            ],
                        ];
                    }),
                ];
            }),
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'detalle' => 'required|string|max:255',
            'comprobante' => 'required|file|mimes:pdf,jpg,jpeg,png',
            'mes' => 'nullable|string|max:20',
        ]);

        // Procesar archivo y mover a carpeta pública
        $file = $request->file('comprobante');
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $destination = $_SERVER['DOCUMENT_ROOT'] . '/comprobantes';

        if (!file_exists($destination)) {
            mkdir($destination, 0755, true);
        }

        $file->move($destination, $filename);

        // Ruta relativa para guardar en la base de datos
        $path = 'comprobantes/' . $filename;
        $extension = $file->getClientOriginalExtension();

        // Crear comprobante
        $comprobante = Comprobante::create([
            'detalle' => $request->detalle,
            'glosa' => $request->glosa,
            'tipo' => $extension,
            'comprobante' => $path,
        ]);

        $user = Auth::user();

        if ($user->hasRole('empresa')) {
            $company = Company::where('name', $user->name)->first();

            if ($company) {
                $mes = $request->input('mes');
                if (!$mes) {
                    $mes = Carbon::now()->locale('es')->translatedFormat('F');
                }

                CompanyLinkComprobante::create([
                    'company_id' => $company->id,
                    'comprobante_id' => $comprobante->id,
                    'mes' => $mes,
                    'fecha' => now()->toDateString(),
                    'link_id' => 1,
                ]);
            } else {
                \Log::warning("Empresa no encontrada para el usuario '{$user->name}'");
            }
        }

        return redirect()->route('pagos.index')->with('success', 'Comprobante guardado correctamente.');
    }
}
