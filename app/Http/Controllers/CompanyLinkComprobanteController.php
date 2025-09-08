<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Link;
use App\Models\CompanyLinkComprobante;
use App\Models\Comprobante;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyLinkComprobanteController extends Controller
{
    public function index(Request $request)
    {
        $empresaId = $request->input('empresa_id');
        $mes = $request->input('mes');

        $empresas = Company::select('id', 'name')->get();
        $links = Link::select('id', 'link', 'detalle')->get();

        $registros = CompanyLinkComprobante::with(['company', 'link', 'comprobante'])
            ->when($empresaId, fn($q) => $q->where('company_id', $empresaId))
            ->when($mes, fn($q) => $q->where('mes', $mes))
            ->latest()
            ->get();

        return Inertia::render('CompanyLinkComprobante/Index', [
            'registros' => $registros,
            'empresas' => $empresas,
            'links' => $links,
        ]);
    }
    public function indexMarketing(Request $request)
    {
        $empresaId = $request->input('empresa_id');
        $mes = $request->input('mes');

        $empresas = Company::select('id', 'name')->get();
        $links = Link::select('id', 'link', 'detalle')->get();

        $registros = CompanyLinkComprobante::with(['company', 'link', 'comprobante'])
            ->when($empresaId, fn($q) => $q->where('company_id', $empresaId))
            ->when($mes, fn($q) => $q->where('mes', $mes))
            ->latest()
            ->get();

        return Inertia::render('CompanyLinkComprobante/IndexMarketing', [
            'registros' => $registros,
            'empresas' => $empresas,
            'links' => $links,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'link' => 'required|string|max:255',
            'detalle' => 'nullable|string',
            'mes' => 'required|string',
            'fecha' => 'required|date_format:Y-m-d',

        ]);

        // Crear el link
        $link = Link::create([
            'link' => $data['link'],
            'detalle' => $data['detalle'] ?? null,
        ]);

        // Crear relación
        $nuevoRegistro = CompanyLinkComprobante::create([
            'company_id' => $data['company_id'],
            'link_id' => $link->id,
            'mes' => $data['mes'],
            'fecha' => $data['fecha'],
        ]);

        return redirect()->back()->with('nuevoRegistro', $nuevoRegistro->load(['company', 'link', 'comprobante']));
    }

    public function update(Request $request, CompanyLinkComprobante $registro)
    {
        $data = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'mes' => 'required|string',
            'fecha' => 'required|date',
            'link' => 'required|string|max:255',
            'detalle' => 'nullable|string',
        ]);

        // Actualizar registro principal
        $registro->update([
            'company_id' => $data['company_id'],
            'mes' => $data['mes'],
            'fecha' => $data['fecha'],
        ]);

        // Actualizar el link relacionado
        if ($registro->link) {
            $registro->link->update([
                'link' => $data['link'],
                'detalle' => $data['detalle'],
            ]);
        }

        return response()->json(['message' => 'Guardado correctamente']);
    }


    public function destroy(CompanyLinkComprobante $registro)
    {
        $registro->delete();

        return response()->json(['message' => 'Eliminado correctamente']);
    }

    public function pagosDelMes()
    {
        $hoy = now();

        // Establece el mes actual en formato capitalizado como en la DB (ej: "Junio")
        $mesActual = ucfirst($hoy->locale('es')->translatedFormat('F')); // "Junio", "Julio", etc.

        // Empresas vigentes hoy + sus comprobantes
        $empresasVigentes = Company::whereDate('start_date', '<=', $hoy)
            ->whereDate('end_date', '>=', $hoy)
            ->with('linkComprobantes')
            ->get();

        return Inertia::render('CompanyLinkComprobante/PagosDelMes', [
            'empresas' => $empresasVigentes,
            'mesActual' => $mesActual,
        ]);
    }






    public function reporteAnual()
    {
        $anioActual = now()->year;

        // Traer todas las empresas vigentes este año
        $empresas = Company::whereYear('start_date', '<=', $anioActual)
            ->whereYear('end_date', '>=', $anioActual)
            ->get();

        // Traer los pagos registrados por mes
        $pagos = CompanyLinkComprobante::with('company')
            ->whereYear('fecha', $anioActual)
            ->get()
            ->groupBy(fn($r) => $r->company_id . '-' . $r->mes); // agrupado por empresa y mes

        return Inertia::render('CompanyLinkComprobante/PagosAnuales', [
            'anio' => $anioActual,
            'empresas' => $empresas,
            'pagos' => $pagos,
        ]);
    }
}
