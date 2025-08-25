<?php

namespace App\Http\Controllers;

use App\Models\SeguimientoEmpresa;
use App\Models\User;
use App\Models\Paquete;
use FPDF;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeguimientoEmpresaController extends Controller
{
    public function index(Request $request)
    {
        $seguimientos = SeguimientoEmpresa::query()
            ->with('usuario', 'paquete')
            // Agrega esta línea para filtrar por estado
            ->where('estado', 'En proceso')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nombre_empresa', 'like', "%{$search}%")
                    ->orWhereHas('usuario', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhere('estado', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();
        // Agrega esta línea para obtener todos los seguimientos (sin paginar)
        $seguimientosAll = SeguimientoEmpresa::with('usuario', 'paquete')
            ->where('estado', 'En proceso')
            ->get();
        $users = User::whereHas('roles', function ($q) {
            $q->where('name', 'Ejecutivo de Ventas');
        })->get();

        $paquetes = Paquete::all();

        return Inertia::render('SeguimientoEmpresa/Index', [
            'seguimientos' => $seguimientos,
            'seguimientosAll' => $seguimientosAll,
            'users' => $users,
            'paquetes' => $paquetes,
            'filters' => $request->only('search'),
        ]);
    }
    public function historial(Request $request)
    {
        $seguimientos = SeguimientoEmpresa::query()
            ->with('usuario', 'paquete')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nombre_empresa', 'like', "%{$search}%")
                    ->orWhereHas('usuario', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhere('estado', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();
        $users = User::whereHas('roles', function ($q) {
            $q->where('name', 'Ejecutivo de Ventas');
        })->get();

        $paquetes = Paquete::all();

        return Inertia::render('SeguimientoEmpresa/historial', [
            'seguimientos' => $seguimientos,
            'users' => $users,
            'paquetes' => $paquetes,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'id_user' => 'required|exists:users,id',
            'id_paquete' => 'required|exists:paquetes,id',
            'estado' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date',
            'descripcion' => 'nullable|string',
        ]);

        SeguimientoEmpresa::create($request->all());

        return redirect()->route('seguimiento-empresa.index')->with('success', 'Seguimiento creado correctamente.');
    }

    public function update(Request $request, SeguimientoEmpresa $seguimiento_empresa)
    {
        $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'id_user' => 'required|exists:users,id',
            'id_paquete' => 'required|exists:paquetes,id',
            'estado' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date',
            'descripcion' => 'nullable|string',
        ]);

        $seguimiento_empresa->update($request->all());

        return redirect()->route('seguimiento-empresa.index')->with('success', 'Seguimiento actualizado correctamente.');
    }

    public function destroy(SeguimientoEmpresa $seguimiento_empresa)
    {
        $seguimiento_empresa->delete();

        return redirect()->route('seguimiento-empresa.index')->with('success', 'Seguimiento eliminado correctamente.');
    }
    public function generarPdf(Request $request)
    {
        $query = SeguimientoEmpresa::with('usuario', 'paquete')
            ->where('estado', 'En proceso');

        // Aplicar el filtro si se proporciona un término de búsqueda
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nombre_empresa', 'like', "%{$search}%")
                    ->orWhereHas('usuario', function ($q_user) use ($search) {
                        $q_user->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $seguimientos = $query->get();

        if ($seguimientos->isEmpty()) {
            return response('No hay seguimientos "En proceso" para generar el PDF.', 404);
        }

        $groupedSeguimientos = $seguimientos->groupBy('id_user');

        $pdf = new FPDF('L', 'mm', 'A4');

        // 🎨 Definición de colores modernos (RGB)
        $colorRojoFuerte = [186, 30, 40];   // Rojo oscuro
        $colorGrisTexto = [40, 40, 40];     // Gris oscuro para texto
        $colorGrisFondo = [240, 240, 240];  // Gris claro para fondo de cabeceras

        // Función para el encabezado
        $agregarEncabezado = function () use ($pdf, $colorRojoFuerte, $colorGrisTexto) {
            $pdf->AddPage();
            $pdf->SetMargins(15, 15, 15);
            $pdf->Image(public_path('logo.jpeg'), 15, 15, 20);
            $pdf->SetFont('Arial', 'B', 20);
            $pdf->SetTextColor($colorRojoFuerte[0], $colorRojoFuerte[1], $colorRojoFuerte[2]);
            $pdf->SetXY(0, 20);
            $pdf->Cell(0, 10, utf8_decode('ADMUS PRODUCTIONS'), 0, 1, 'C');
            $pdf->SetFont('Arial', '', 14);
            $pdf->SetTextColor($colorGrisTexto[0], $colorGrisTexto[1], $colorGrisTexto[2]);
            $pdf->Cell(0, 10, utf8_decode('Reporte de Seguimientos "En Proceso"'), 0, 1, 'C');
            $pdf->Ln(10);
        };

        $agregarEncabezado();

        // Ancho de las columnas
        $widths = [
            'empresa' => 55,
            'paquete' => 45,
            'fecha' => 35,
            'descripcion' => 135,
        ];

        foreach ($groupedSeguimientos as $userId => $seguimientosPorUsuario) {
            $user = $seguimientosPorUsuario->first()->usuario;

            // Título del ejecutivo de ventas con fondo de color
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->SetFillColor($colorRojoFuerte[0], $colorRojoFuerte[1], $colorRojoFuerte[2]);
            $pdf->SetTextColor(255, 255, 255);
            $pdf->Cell(0, 8, utf8_decode('  Ejecutivo de Ventas: ' . $user->name), 0, 1, 'L', true);
            $pdf->Ln(2);

            // Cabeceras de la tabla
            $pdf->SetFont('Arial', 'B', 9);
            $pdf->SetFillColor($colorGrisFondo[0], $colorGrisFondo[1], $colorGrisFondo[2]);
            $pdf->SetTextColor($colorGrisTexto[0], $colorGrisTexto[1], $colorGrisTexto[2]);
            $pdf->Cell($widths['empresa'], 8, utf8_decode('Empresa'), 1, 0, 'C', true);
            $pdf->Cell($widths['paquete'], 8, utf8_decode('Paquete'), 1, 0, 'C', true);
            $pdf->Cell($widths['fecha'], 8, utf8_decode('Fecha de Inicio'), 1, 0, 'C', true);
            $pdf->Cell($widths['descripcion'], 8, utf8_decode('Descripción'), 1, 1, 'C', true);

            // Contenido de la tabla
            $pdf->SetFont('Arial', '', 8);
            $pdf->SetTextColor($colorGrisTexto[0], $colorGrisTexto[1], $colorGrisTexto[2]);

            foreach ($seguimientosPorUsuario as $seguimiento) {
                // Salto de página si es necesario
                if ($pdf->GetY() > 185) {
                    $agregarEncabezado();
                    // Repetimos la cabecera de la tabla en la nueva página
                    $pdf->SetFont('Arial', 'B', 12);
                    $pdf->SetFillColor($colorRojoFuerte[0], $colorRojoFuerte[1], $colorRojoFuerte[2]);
                    $pdf->SetTextColor(255, 255, 255);
                    $pdf->Cell(0, 8, utf8_decode('  Ejecutivo de Ventas: ' . $user->name), 0, 1, 'L', true);
                    $pdf->Ln(2);
                    $pdf->SetFont('Arial', 'B', 9);
                    $pdf->SetFillColor($colorGrisFondo[0], $colorGrisFondo[1], $colorGrisFondo[2]);
                    $pdf->SetTextColor($colorGrisTexto[0], $colorGrisTexto[1], $colorGrisTexto[2]);
                    $pdf->Cell($widths['empresa'], 8, utf8_decode('Empresa'), 1, 0, 'C', true);
                    $pdf->Cell($widths['paquete'], 8, utf8_decode('Paquete'), 1, 0, 'C', true);
                    $pdf->Cell($widths['fecha'], 8, utf8_decode('Fecha de Inicio'), 1, 0, 'C', true);
                    $pdf->Cell($widths['descripcion'], 8, utf8_decode('Descripción'), 1, 1, 'C', true);
                    $pdf->SetFont('Arial', '', 8);
                    $pdf->SetTextColor($colorGrisTexto[0], $colorGrisTexto[1], $colorGrisTexto[2]);
                }

                $descripcion = $seguimiento->descripcion ?: 'Sin descripción';

                // Calculamos la altura de la celda de descripción
                $nb = 0;
                $w = $widths['descripcion'];
                $txt = utf8_decode($descripcion);
                $cw = $pdf->GetStringWidth($txt);
                $alturaFila = 8;
                if ($cw > $w) {
                    $nb = ceil($cw / $w);
                    $alturaFila = 4 * $nb;
                }

                $x = $pdf->GetX();
                $y = $pdf->GetY();

                // Dibujamos las celdas
                $pdf->Cell($widths['empresa'], $alturaFila, utf8_decode($seguimiento->nombre_empresa), 1, 0, 'L');
                $pdf->Cell($widths['paquete'], $alturaFila, utf8_decode($seguimiento->paquete->nombre_paquete), 1, 0, 'L');
                $pdf->Cell($widths['fecha'], $alturaFila, utf8_decode($seguimiento->fecha_inicio), 1, 0, 'L');

                // Posicionamos el cursor para el MultiCell
                $pdf->SetXY($x + $widths['empresa'] + $widths['paquete'] + $widths['fecha'], $y);
                $pdf->MultiCell($widths['descripcion'], 4, utf8_decode($descripcion), 1, 'L');

                // Ajustamos la posición Y para la siguiente fila
                $pdf->SetY($y + $alturaFila);
            }
            $pdf->Ln(8);
        }

        return response()->stream(function () use ($pdf) {
            $pdf->Output();
        }, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="seguimientos_en_proceso.pdf"',
        ]);
    }
}
