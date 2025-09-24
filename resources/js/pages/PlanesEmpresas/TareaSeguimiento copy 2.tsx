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
    // Obtener mes y año actual
    const now = new Date();
    const mesActual = now.toLocaleString('es-ES', { month: 'long' });
    const anioActual = now.getFullYear();

    // Agrupar tareas por semana
    const tareasPorSemana = tareas.reduce((acc, tarea) => {
        const semana = tarea.semana;
        if (!acc[semana]) {
            acc[semana] = [];
        }
        acc[semana].push(tarea);
        return acc;
    }, {} as Record<string, TareaSeguimiento[]>);

    // Obtener las semanas ordenadas
    const semanasOrdenadas = Object.keys(tareasPorSemana).sort((a, b) => Number(a) - Number(b));

    return (
        <AppLayout>
            <Head title="Tareas de Seguimiento" />

            <div className="p-6">
                {/* Información de la empresa */}
                <div className="mb-6 border-b pb-4">
                    <h1 className="mb-2 text-2xl font-bold">Empresa: {empresa.name}</h1>
                    <p>
                        <strong>Duración del contrato:</strong> {empresa.contract_duration}
                    </p>
                    {empresa.category && (
                        <p>
                            <strong>Categoría:</strong> {empresa.category.name}
                        </p>
                    )}
                </div>

                {/* Mes y año actual */}
                <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-700">
                        Mostrando tareas de: {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)} {anioActual}
                    </p>
                </div>

                {/* Tabla de tareas agrupadas por semana */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold">Tareas de Seguimiento</h2>

                    {semanasOrdenadas.length === 0 ? (
                        <p className="text-center py-4">No hay tareas registradas.</p>
                    ) : (
                        semanasOrdenadas.map((semana) => (
                            <div key={semana} className="mb-8">
                                <h3 className="mb-2 text-lg font-bold text-blue-700">Semana {semana}</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300 bg-white">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-4 py-2">Título</th>
                                                <th className="border px-4 py-2">Fecha Producción</th>
                                                <th className="border px-4 py-2">Estado Producción</th>
                                                <th className="border px-4 py-2">Fecha Edición</th>
                                                <th className="border px-4 py-2">Estado Edición</th>
                                                <th className="border px-4 py-2">Fecha Entrega</th>
                                                <th className="border px-4 py-2">Estado Entrega</th>
                                                <th className="border px-4 py-2">Estrategia</th>
                                                <th className="border px-4 py-2">Comentario</th>
                                                <th className="border px-4 py-2">Guión</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tareasPorSemana[semana].map((tarea) => (
                                                <tr key={tarea.id} className="text-sm hover:bg-gray-50">
                                                    <td className="border px-4 py-2">{tarea.titulo}</td>
                                                    <td className="border px-4 py-2">{tarea.fecha_produccion ?? '—'}</td>
                                                    <td className="border px-4 py-2">{tarea.estado_produccion}</td>
                                                    <td className="border px-4 py-2">{tarea.fecha_edicion ?? '—'}</td>
                                                    <td className="border px-4 py-2">{tarea.estado_edicion}</td>
                                                    <td className="border px-4 py-2">{tarea.fecha_entrega ?? '—'}</td>
                                                    <td className="border px-4 py-2">{tarea.estado_entrega}</td>
                                                    <td className="border px-4 py-2">{tarea.estrategia}</td>
                                                    <td className="border px-4 py-2">{tarea.comentario}</td>
                                                    <td className="border px-4 py-2">{tarea.guion}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
