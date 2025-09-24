<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\PlanEmpresa;
use FPDF;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class PlanEmpresaController extends Controller
{
    public function index()
    {
        $empresas = Company::with(['planEmpresa', 'category', 'paquete'])->get();

        $planes = $empresas->map(function ($empresa) {
            return [
                'id' => $empresa->planEmpresa->id ?? null,
                'empresa_id' => $empresa->id,
                'tiktok_mes' => $empresa->planEmpresa->tiktok_mes ?? '',
                'tiktok_semana' => $empresa->planEmpresa->tiktok_semana ?? '',
                'facebook_mes' => $empresa->planEmpresa->facebook_mes ?? '',
                'facebook_semana' => $empresa->planEmpresa->facebook_semana ?? '',
                'instagram_mes' => $empresa->planEmpresa->instagram_mes ?? '',
                'instagram_semana' => $empresa->planEmpresa->instagram_semana ?? '',
                'mensajes' => $empresa->planEmpresa->mensajes ?? '',
                'empresa' => [
                    'id' => $empresa->id,
                    'name' => $empresa->name,
                    'influencer' => $empresa->influencer,
                    'category_name' => $empresa->category->name ?? 'Sin categoría',
                    'paquete_nombre' => $empresa->paquete->nombre_paquete ?? 'Sin paquete',
                ],

            ];
        });

        return Inertia::render('PlanesEmpresas/Index', [
            'planes' => $planes,
        ]);
    }
    public function save(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'empresa_id' => 'required|exists:companies,id',
            'tiktok_mes' => 'nullable|string',
            'tiktok_semana' => 'nullable|string',
            'facebook_mes' => 'nullable|string',
            'facebook_semana' => 'nullable|string',
            'instagram_mes' => 'nullable|string',
            'instagram_semana' => 'nullable|string',
            'mensajes' => 'nullable|string',
        ])->validate();

        $plan = PlanEmpresa::updateOrCreate(
            ['empresa_id' => $validated['empresa_id']],
            $validated
        );

        return back()->with('success', 'Plan guardado correctamente.');
    }
}
