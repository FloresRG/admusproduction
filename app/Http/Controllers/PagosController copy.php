<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyLinkComprobante;
use App\Models\Comprobante;
use Illuminate\Http\Request;

class PagosController extends Controller
{
    public function getComprobantesConCompanies()
    {
        $comprobantes = Comprobante::whereHas('companyAssociations', function ($query) {
            $query->where('company_id', 1);
        })->with(['companyAssociations.company'])->get();

        return response()->json($comprobantes);
    }
    public function storeComprobante(Request $request)
    {
        try {
            // Validación de los datos recibidos
            $request->validate([
                'comprobante' => 'required|file|mimes:pdf,jpeg,png,jpg', // Validar que sea un archivo válido (PDF o imagen)
                'detalle' => 'required|string|max:255',
                'glosa' => 'required|string|max:255',
                'company_id' => 'required|exists:companies,id', // Asegurarse de que la compañía exista en la base de datos
                'mes' => 'required|string|max:255', // Validar que se pase el mes
                'link_id' => 'nullable|integer|min:1',  // Changed to required
            ]);

            // Almacenar el archivo (comprobante) en el sistema de archivos
            $file = $request->file('comprobante');
            $filePath = $file->store('comprobantes', 'public'); // Guardamos el archivo en la carpeta "comprobantes" dentro de "public"

            // Crear el nuevo comprobante
            $comprobante = Comprobante::create([
                'comprobante' => $filePath,  // Guardamos la ruta del archivo
                'detalle' => $request->detalle,
                'glosa' => $request->glosa,
                'tipo' => 'PDF',  // Puede cambiar dependiendo del tipo de archivo, por ahora asumimos que será siempre PDF
            ]);

            // Crear la relación entre el comprobante y la compañía
            $companyAssociation = CompanyLinkComprobante::create([
                'company_id' => $request->company_id,
                'comprobante_id' => $comprobante->id,
                'mes' => $request->mes,  // Asegúrate de que el mes sea pasado en la solicitud
                'fecha' => now(),  // Fecha actual de la asociación
                'link_id' => $request->link_id,
            ]);

            // Responder con el comprobante recién creado y la compañía asociada
            return response()->json([
                'message' => 'Comprobante creado exitosamente',
                'comprobante' => $comprobante,
                'company_association' => $companyAssociation,
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Captura el error de base de datos y proporciona un mensaje adecuado
            return response()->json([
                'error' => 'Error en la base de datos',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            // Captura cualquier otro error inesperado
            return response()->json([
                'error' => 'Error inesperado',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    /* public function storeComprobante(Request $request)
    {
        try {
            // Validar datos
            $validated = $request->validate([
                'comprobante' => 'required|file|mimes:pdf,jpeg,png,jpg',
                'detalle' => 'required|string|max:255',
                'glosa' => 'required|string|max:255',
                'company_id' => 'required|exists:companies,id',
                'mes' => 'required|string|max:255',
                'link_id' => 'nullable|integer|min:1',
            ]);

            // Guardar el archivo en /comprobantes
            $filePath = null;
            $tipo = null;

            if ($request->hasFile('comprobante')) {
                $file = $request->file('comprobante');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $destination = $_SERVER['DOCUMENT_ROOT'] . '/comprobantes';

                if (!file_exists($destination)) {
                    mkdir($destination, 0755, true);
                }

                $file->move($destination, $filename);
                $filePath = 'comprobantes/' . $filename;

                // Determinar tipo
                $mime = $file->getMimeType();
                $tipo = str_contains($mime, 'pdf') ? 'PDF' : 'Imagen';
            }

            // Crear comprobante
            $comprobante = Comprobante::create([
                'comprobante' => $filePath,
                'detalle' => $validated['detalle'],
                'glosa' => $validated['glosa'],
                'tipo' => $tipo ?? 'Desconocido',
            ]);

            // Relación con la empresa
            $companyAssociation = CompanyLinkComprobante::create([
                'company_id' => $validated['company_id'],
                'comprobante_id' => $comprobante->id,
                'mes' => $validated['mes'],
                'fecha' => now(),
                'link_id' => $validated['link_id'],
            ]);

            return response()->json([
                'message' => 'Comprobante creado exitosamente',
                'comprobante' => $comprobante,
                'company_association' => $companyAssociation,
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Error en la base de datos',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error inesperado',
                'message' => $e->getMessage(),
            ], 500);
        }
    } */


    // Método para obtener todas las compañías
    public function getCompanies()
    {
        // Obtener todas las compañías
        $companies = Company::all();

        // Retornar las compañías en formato JSON
        return response()->json($companies);
    }
}
