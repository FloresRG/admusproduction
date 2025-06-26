import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

import { PageProps } from '@/types';

type Tipo = { id: number; nombre_tipo: string };
type Company = { id: number; name: string };
type Tarea = { id: number; titulo: string; prioridad: string; descripcion: string; fecha: string; tipo: Tipo; company: Company };
type User = { id: number; name: string; email: string };
type Asignacion = { id: number; user: User; tarea: Tarea; estado: string; detalle: string; fecha: string };

export default function Reporte() {
    const { asignaciones, filters } = usePage<PageProps<{ asignaciones: Asignacion[]; filters: any }>>().props;

    const [fechaInicio, setFechaInicio] = useState(filters.fecha_inicio || '');
    const [fechaFin, setFechaFin] = useState(filters.fecha_fin || '');
    const [mes, setMes] = useState(filters.mes || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();

        router.get(
            '/reportetareas',
            {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                mes: mes,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };
    const generarPdf = () => {
        const params = new URLSearchParams({
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            mes: mes,
        }).toString();

        window.open(`/reportetareas/pdf?${params}`, '_blank');
    };

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="mb-4 text-xl font-bold">Tareas Asignadas</h1>
                <button onClick={generarPdf} className="rounded bg-red-600 px-4 py-2 text-white">
                    Generar PDF
                </button>

                {/* Filtros */}
                <form onSubmit={handleFilter} className="mb-6 flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium">Fecha Inicio:</label>
                        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="rounded border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Fecha Fin:</label>
                        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="rounded border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mes:</label>
                        <select value={mes} onChange={(e) => setMes(e.target.value)} className="rounded border p-2">
                            <option value="">-- Selecciona un mes --</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
                        Filtrar
                    </button>
                </form>

                {/* Tabla de resultados */}
                <table className="min-w-full rounded bg-white shadow-md">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Usuario</th>
                            <th className="p-2">Tarea</th>
                            <th className="p-2">Prioridad</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Empresa</th>
                            <th className="p-2">Fecha Asignación</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2">Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asignaciones.map((asignacion) => (
                            <tr key={asignacion.id} className="border-b">
                                <td className="p-2">{asignacion.user.name}</td>
                                <td className="p-2">{asignacion.tarea.titulo}</td>
                                <td className="p-2">{asignacion.tarea.prioridad}</td>
                                <td className="p-2">{asignacion.tarea.tipo?.nombre_tipo || 'N/A'}</td>
                                <td className="p-2">{asignacion.tarea.company?.name || 'N/A'}</td>
                                <td className="p-2">{asignacion.fecha}</td>
                                <td className="p-2">{asignacion.estado}</td>
                                <td className="p-2">{asignacion.detalle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
