import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

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
    mensaje?: string;
};

// Fila editable para cada tarea
// EditableRow.tsx (solo parte relevante)

function EditableRow({ tarea }: { tarea: TareaSeguimiento }) {
    const [formData, setFormData] = useState({
        titulo: tarea.titulo,
        fecha_produccion: tarea.fecha_produccion ?? '',
        estado_produccion: tarea.estado_produccion || 'pendiente', // 'pendiente' o 'completado'
        fecha_edicion: tarea.fecha_edicion ?? '',
        estado_edicion: tarea.estado_edicion || 'pendiente',
        fecha_entrega: tarea.fecha_entrega ?? '',
        estado_entrega: tarea.estado_entrega || 'pendiente',
        estrategia: tarea.estrategia,
        comentario: tarea.comentario,
        guion: tarea.guion,
    });

    const handleEstadoChange = (
        campo: 'estado_produccion' | 'estado_edicion' | 'estado_entrega',
        valor: 'pendiente' | 'completado'
    ) => {
        setFormData((prev) => {
            const newForm = { ...prev, [campo]: valor };
            router.patch(
                route('tareas.actualizar', tarea.id),
                {
                    ...newForm,
                    fecha_produccion: newForm.fecha_produccion || null,
                    fecha_edicion: newForm.fecha_edicion || null,
                    fecha_entrega: newForm.fecha_entrega || null,
                },
                {
                    preserveScroll: true,
                    onError: () => alert('Error al actualizar tarea'),
                }
            );
            return newForm;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBlur = () => {
        const payload = {
            ...formData,
            fecha_produccion: formData.fecha_produccion || null,
            fecha_edicion: formData.fecha_edicion || null,
            fecha_entrega: formData.fecha_entrega || null,
        };
        router.patch(route('tareas.actualizar', tarea.id), payload, {
            preserveScroll: true,
            onError: () => alert('Error al actualizar tarea'),
        });
    };

    return (
        <tr className="text-sm hover:bg-gray-50">
            <td className="border px-4 py-2">
                <input
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded border px-2 py-1"
                />
            </td>
            <td className="border px-4 py-2">
                <input
                    type="date"
                    name="fecha_produccion"
                    value={formData.fecha_produccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded border px-2 py-1"
                />
            </td>

            {/* Estado Producción - Pendiente */}
            <td className="border px-4 py-2 text-center">
                <input
                    type="checkbox"
                    checked={formData.estado_produccion === 'pendiente'}
                    onChange={() => handleEstadoChange('estado_produccion', 'pendiente')}
                />
            </td>

            {/* Estado Producción - Completado */}
            <td className="border px-4 py-2 text-center">
                <input
                    type="checkbox"
                    checked={formData.estado_produccion === 'completado'}
                    onChange={() => handleEstadoChange('estado_produccion', 'completado')}
                />
            </td>

            <td className="border px-4 py-2">
                <input
                    type="date"
                    name="fecha_edicion"
                    value={formData.fecha_edicion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded border px-2 py-1"
                />
            </td>

            {/* Estado Edición - Pendiente */}
            <td className="border px-4 py-2 text-center">
                <input
                    type="checkbox"
                    checked={formData.estado_edicion === 'pendiente'}
                    onChange={() => handleEstadoChange('estado_edicion', 'pendiente')}
                />
            </td>

            {/* Estado Edición - Completado */}
            <td className="border px-4 py-2 text-center">
                <input
                    type="checkbox"
                    checked={formData.estado_edicion === 'completado'}
                    onChange={() => handleEstadoChange('estado_edicion', 'completado')}
                />
            </td>

            <td className="border px-4 py-2">
                <input
                    type="date"
                    name="fecha_entrega"
                    value={formData.fecha_entrega}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded border px-2 py-1"
                />
            </td>

            {/* Estado Entrega - Pendiente */}
            <td className="border px-4 py-2 text-center">
                <input
                    type="checkbox"
                    checked={formData.estado_entrega === 'pendiente'}
                    onChange={() => handleEstadoChange('estado_entrega', 'pendiente')}
                />
            </td>

            {/* Estado Entrega - Completado */}
            <td className="border px-4 py-2 text-center">
                <input
                    type="checkbox"
                    checked={formData.estado_entrega === 'completado'}
                    onChange={() => handleEstadoChange('estado_entrega', 'completado')}
                />
            </td>

            <td className="border px-4 py-2">
                <textarea
                    name="estrategia"
                    value={formData.estrategia}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full resize-none rounded border px-2 py-1"
                    rows={2}
                />
            </td>
            <td className="border px-4 py-2">
                <textarea
                    name="comentario"
                    value={formData.comentario}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full resize-none rounded border px-2 py-1"
                    rows={2}
                />
            </td>
            <td className="border px-4 py-2">
                <textarea
                    name="guion"
                    value={formData.guion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full resize-none rounded border px-2 py-1"
                    rows={2}
                />
            </td>
        </tr>
    );
}


export default function SeguimientoTareas({ empresa, tareas = [], mensaje }: Props) {
    const now = new Date();
    const mesActual = now.toLocaleString('es-ES', { month: 'long' });
    const anioActual = now.getFullYear();

    // Agrupar tareas por semana
    const tareasPorSemana = (tareas ?? []).reduce(
        (acc, tarea) => {
            const semana = tarea.semana ?? '0';
            if (!acc[semana]) acc[semana] = [];
            acc[semana].push(tarea);
            return acc;
        },
        {} as Record<string, TareaSeguimiento[]>,
    );

    const semanasOrdenadas = Object.keys(tareasPorSemana)
        .filter(Boolean)
        .map((s) => Number(s))
        .sort((a, b) => a - b)
        .map((n) => n.toString());

    const handleGenerar = () => {
        if (confirm('¿Estás seguro de generar las tareas por defecto para esta empresa?')) {
            router.post(route('tareas.generar', empresa.id));
        }
    };

    return (
        <AppLayout>
            <Head title="Tareas de Seguimiento" />

            <div className="p-6">
                {/* Info empresa */}
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

                {/* Mensaje si existe */}
                {mensaje && <div className="mb-4 rounded bg-green-100 p-4 text-green-800">{mensaje}</div>}

                {/* Mes y año */}
                <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-700">
                        Mostrando tareas de: {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)} {anioActual}
                    </p>
                </div>

                {/* Botón generar si no hay tareas */}
                {tareas.length === 0 && (
                    <div className="mb-6">
                        <button onClick={handleGenerar} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            Generar datos de tareas
                        </button>
                    </div>
                )}

                {/* Tareas por semana */}
                <div>
                    <h2 className="mb-4 text-xl font-semibold">Tareas de Seguimiento</h2>

                    {semanasOrdenadas.length === 0 ? (
                        <p className="py-4 text-center">No hay tareas registradas.</p>
                    ) : (
                        semanasOrdenadas.map((semana) => (
                            <div key={semana} className="mb-8">
                                <h3 className="mb-2 text-lg font-bold text-blue-700">Semana {semana}</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300 bg-white">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Título
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Fecha Producción
                                                </th>
                                                <th className="border px-4 py-2" colSpan={2}>
                                                    Estado Producción
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Fecha Edición
                                                </th>
                                                <th className="border px-4 py-2" colSpan={2}>
                                                    Estado Edición
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Fecha Entrega
                                                </th>
                                                <th className="border px-4 py-2" colSpan={2}>
                                                    Estado Entrega
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Estrategia
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Comentario
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Guión
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="border px-4 py-2">Pendiente</th>
                                                <th className="border px-4 py-2">Completado</th>

                                                <th className="border px-4 py-2">Pendiente</th>
                                                <th className="border px-4 py-2">Completado</th>

                                                <th className="border px-4 py-2">Pendiente</th>
                                                <th className="border px-4 py-2">Completado</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {Array.isArray(tareasPorSemana[semana]) &&
                                                tareasPorSemana[semana].map((tarea) => <EditableRow key={tarea.id} tarea={tarea} />)}
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
