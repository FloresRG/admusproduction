import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type Company = {
    id: number;
    name: string;
    contract_duration: string;
    company_category_id: number;
    category?: {
        name: string;
    };
    paquete?: {
        nombre_paquete: string;
    };
};

type TareaSeguimiento = {
    id: number;
    titulo: string;
    anio: string;
    mes: string;
    semana: string;
    fecha_produccion: string | null;
    estado_produccion: string;
    fecha_edicion: string | null;
    estado_edicion: string;
    fecha_entrega: string | null;
    estado_entrega: string;
    estrategia: string;
    comentario: string;
    guion: string;
};

type Props = {
    empresa: Company;
    tareas: TareaSeguimiento[];
};

export default function SeguimientoTareas({ empresa, tareas }: Props) {
    // Año y mes actual
    const now = new Date();
    const mesActualPorDefecto = (now.getMonth() + 1).toString().padStart(2, '0'); // 01-12
    const anioActualPorDefecto = now.getFullYear().toString();

    // Si hay tareas, toma el primer mes/año; si no, usa fecha actual
    const anioActual = tareas.length > 0 ? tareas[0].anio : anioActualPorDefecto;
    const mesActual = tareas.length > 0 ? tareas[0].mes : mesActualPorDefecto;

    // Asignar semana por defecto si falta (cada 3 tareas cambia la semana)
    const tareasConSemana = tareas.map((tarea, index) => ({
        ...tarea,
        semana: tarea.semana || `Semana ${Math.min(Math.floor(index / 3) + 1, 4)}`,
    }));

    return (
        <AppLayout>
            <Head title="Tareas de Seguimiento" />

            <div className="container mx-auto p-6">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Seguimiento de Tareas</h1>

                {/* Info Empresa */}
                <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-semibold text-indigo-700">Datos de la Empresa</h2>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Nombre:</strong> {empresa.name}</p>
                        <p><strong>Categoría:</strong> {empresa.category?.name || '-'}</p>
                        <p><strong>Duración del Contrato:</strong> {empresa.contract_duration}</p>
                        <p><strong>Paquete:</strong> {empresa.paquete?.nombre_paquete || '-'}</p>
                    </div>
                </div>

                {/* Mes y Año */}
                <div className="mb-4 text-lg font-medium text-gray-700">
                    <span className="text-indigo-600">Mes:</span> {mesActual} &nbsp; | &nbsp;
                    <span className="text-indigo-600">Año:</span> {anioActual}
                </div>

                {/* Tabla de Tareas */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 rounded-lg border bg-white shadow-sm">
                        <thead className="bg-indigo-100 text-sm text-indigo-800">
                            <tr>
                                <th className="px-4 py-2 text-center">Semana</th>
                                <th className="px-4 py-2 text-center">Producción</th>
                                <th className="px-4 py-2 text-center">Edición</th>
                                <th className="px-4 py-2 text-center">Entrega</th>
                                <th className="px-4 py-2 text-left">Estrategia</th>
                                <th className="px-4 py-2 text-left">Guión</th>
                                <th className="px-4 py-2 text-left">Comentario</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                            {tareasConSemana.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                        No hay tareas registradas.
                                    </td>
                                </tr>
                            ) : (
                                tareasConSemana.map((tarea) => (
                                    <tr key={tarea.id} className="transition hover:bg-gray-50">
                                        <td className="px-4 py-2 text-center font-medium">{tarea.semana}</td>
                                        <td className="px-4 py-2 text-center">
                                            <div>{tarea.fecha_produccion || '-'}</div>
                                            <div className="text-xs text-gray-500">{tarea.estado_produccion}</div>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <div>{tarea.fecha_edicion || '-'}</div>
                                            <div className="text-xs text-gray-500">{tarea.estado_edicion}</div>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <div>{tarea.fecha_entrega || '-'}</div>
                                            <div className="text-xs text-gray-500">{tarea.estado_entrega}</div>
                                        </td>
                                        <td className="px-4 py-2">{tarea.estrategia}</td>
                                        <td className="px-4 py-2">{tarea.guion}</td>
                                        <td className="px-4 py-2">{tarea.comentario}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
