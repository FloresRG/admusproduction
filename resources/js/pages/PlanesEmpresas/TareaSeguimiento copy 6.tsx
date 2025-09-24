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

type User = {
    id: number;
    name: string;
};

type TareaSeguimiento = {
    id: number;
    titulo: string;
    anio: string;
    mes: string;
    semana: string;
    fecha_produccion: string | null;
    estado_produccion: string;
    user_produccion_id: number | null; // Nuevo campo
    fecha_edicion: string | null;
    estado_edicion: string;
    user_edicion_id: number | null; // Nuevo campo
    fecha_entrega: string | null;
    estado_entrega: string;
    estrategia: string;
    comentario: string;
    guion: string;
};

type Props = {
    empresa: Company;
    tareas: TareaSeguimiento[];
    // ✅ Ahora recibimos dos listas, una para cada rol
    usersProduccion: User[];
    usersEdicion: User[];
    mensaje?: string;
};
// Componente auxiliar para el indicador de estado
function ColoredStatusIndicator({ status, fieldName, value, onChange }) {
    const isChecked = status === value;
    const colors = {
        pendiente: 'bg-red-500 border-red-500',
        revision: 'bg-yellow-500 border-yellow-500',
        completado: 'bg-green-500 border-green-500',

    };

    return (
        <div
            className={`h-5 w-5 cursor-pointer rounded-full border-2 transition-colors duration-200 ${isChecked ? colors[value] : 'border-gray-400 bg-white'} `}
            onClick={() => onChange(fieldName, value)}
        />
    );
}
// Fila editable para cada tarea
function EditableRow({ tarea, usersProduccion, usersEdicion }: { tarea: TareaSeguimiento; usersProduccion: User[]; usersEdicion: User[] }) {
    const [formData, setFormData] = useState({
        titulo: tarea.titulo,
        fecha_produccion: tarea.fecha_produccion ?? '',
        estado_produccion: tarea.estado_produccion || 'pendiente',
        user_produccion_id: tarea.user_produccion_id ?? null,
        fecha_edicion: tarea.fecha_edicion ?? '',
        estado_edicion: tarea.estado_edicion || 'pendiente',
        user_edicion_id: tarea.user_edicion_id ?? null,
        fecha_entrega: tarea.fecha_entrega ?? '',
        estado_entrega: tarea.estado_entrega || 'pendiente',
        estrategia: tarea.estrategia,
        comentario: tarea.comentario,
        guion: tarea.guion,
    });

    const handleEstadoChange = (campo: 'estado_produccion' | 'estado_edicion' | 'estado_entrega', valor: 'pendiente' | 'revision' | 'completado') => {
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
                },
            );
            return newForm;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = value === '' ? null : Number(value);
        const newForm = { ...formData, [name]: finalValue };
        setFormData(newForm);
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
            },
        );
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
            {/* Celda combinada para Título y Estrategia */}
            <td className="border px-4 py-2">
                <div className="flex flex-col space-y-2">
                    <label className="text-xs text-gray-500">Título:</label>
                    <input
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full rounded border px-2 py-1"
                    />
                    <label className="text-xs text-gray-500">Estrategia:</label>
                    <textarea
                        name="estrategia"
                        value={formData.estrategia}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full resize-none rounded border px-2 py-1"
                        rows={2}
                    />
                </div>
            </td>
            {/* Fechas y estados */}
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
            {/* Estado Producción */}
            <td className="border px-4 py-2 text-center">
                <ColoredStatusIndicator
                    status={formData.estado_produccion}
                    fieldName="estado_produccion"
                    value="pendiente"
                    onChange={handleEstadoChange}
                />
            </td>
            <td className="border px-4 py-2 text-center">
                <ColoredStatusIndicator
                    status={formData.estado_produccion}
                    fieldName="estado_produccion"
                    value="completado"
                    onChange={handleEstadoChange}
                />
            </td>
            {/* Nuevo: Usuario de Producción */}
            <td className="border px-4 py-2">
                <label className="text-xs text-gray-500">Asignado:</label>
                <select
                    name="user_produccion_id"
                    value={formData.user_produccion_id ?? ''}
                    onChange={handleSelectChange}
                    className="w-full rounded border px-2 py-1"
                >
                    <option value="">Seleccionar</option>
                    {usersProduccion.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
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
            {/* Estado Edición */}
            <td className="border px-4 py-2 text-center">
                <ColoredStatusIndicator status={formData.estado_edicion} fieldName="estado_edicion" value="pendiente" onChange={handleEstadoChange} />
            </td>
            <td className="border px-4 py-2 text-center">
                <ColoredStatusIndicator status={formData.estado_edicion} fieldName="estado_edicion" value="revision" onChange={handleEstadoChange} />
            </td>
            <td className="border px-4 py-2 text-center">
                <ColoredStatusIndicator
                    status={formData.estado_edicion}
                    fieldName="estado_edicion"
                    value="completado"
                    onChange={handleEstadoChange}
                />
            </td>
            {/* Nuevo: Usuario de Edición */}
            <td className="border px-4 py-2">
                <label className="text-xs text-gray-500">Asignado:</label>
                <select
                    name="user_edicion_id"
                    value={formData.user_edicion_id ?? ''}
                    onChange={handleSelectChange}
                    className="w-full rounded border px-2 py-1"
                >
                    <option value="">Seleccionar</option>
                    {usersEdicion.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
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
            {/* Estado Entrega */}
            <td className="border px-4 py-2 text-center">
                <ColoredStatusIndicator status={formData.estado_entrega} fieldName="estado_entrega" value="pendiente" onChange={handleEstadoChange} />
            </td>
            <td className="border px-4 py-2 text-center">
                <ColoredStatusIndicator
                    status={formData.estado_entrega}
                    fieldName="estado_entrega"
                    value="completado"
                    onChange={handleEstadoChange}
                />
            </td>
            {/* Celda combinada para Comentario y Guión */}
            <td className="border px-4 py-2">
                <div className="flex flex-col space-y-2">
                    <label className="text-xs text-gray-500">Comentario:</label>
                    <textarea
                        name="comentario"
                        value={formData.comentario}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full resize-none rounded border px-2 py-1"
                        rows={2}
                    />
                    <label className="text-xs text-gray-500">Guión:</label>
                    <textarea
                        name="guion"
                        value={formData.guion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full resize-none rounded border px-2 py-1"
                        rows={2}
                    />
                </div>
            </td>
        </tr>
    );
}

// ---
// El resto del componente principal se mantiene igual, solo necesitas pasar 'users' a EditableRow
// ---

export default function SeguimientoTareas({ empresa, tareas = [], usersProduccion, usersEdicion, mensaje }: Props) {
    const now = new Date();
    const mesActual = now.toLocaleString('es-ES', { month: 'long' });
    const anioActual = now.getFullYear();

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

    const verticalText = {
        writingMode: 'vertical-rl' as 'vertical-rl',
        transform: 'rotate(180deg)',
        height: '100px',
        width: '30px',
        padding: '0 4px',
        textAlign: 'center' as 'center',
        verticalAlign: 'bottom' as 'bottom',
    };

    return (
        <AppLayout>
            <Head title="Tareas de Seguimiento" />
            <div className="p-6">
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

                {mensaje && <div className="mb-4 rounded bg-green-100 p-4 text-green-800">{mensaje}</div>}

                <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-700">
                        Mostrando tareas de: {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)} {anioActual}
                    </p>
                </div>

                {tareas.length === 0 && (
                    <div className="mb-6">
                        <button onClick={handleGenerar} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            Generar datos de tareas
                        </button>
                    </div>
                )}

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
                                                    Título/Estrategia
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Fecha Producción
                                                </th>
                                                <th className="border px-4 py-2" colSpan={2}>
                                                    Estado Producción
                                                </th>
                                                {/* Encabezado para User Producción */}
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Usuario Producción
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Fecha Edición
                                                </th>
                                                <th className="border px-4 py-2" colSpan={3}>
                                                    Estado Edición
                                                </th>
                                                {/* Encabezado para User Edición */}
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Usuario Edición
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Fecha Entrega
                                                </th>
                                                <th className="border px-4 py-2" colSpan={2}>
                                                    Estado Entrega
                                                </th>
                                                <th className="border px-4 py-2" rowSpan={2}>
                                                    Comentario/Guión
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="border bg-gray-200" style={verticalText}>
                                                    Pendiente
                                                </th>
                                                <th className="border bg-gray-200" style={verticalText}>
                                                    Completado
                                                </th>
                                                <th className="border bg-gray-200" style={verticalText}>
                                                    Pendiente
                                                </th>
                                                <th className="border bg-gray-200" style={verticalText}>
                                                    En revision
                                                </th>
                                                <th className="border bg-gray-200" style={verticalText}>
                                                    Completado
                                                </th>
                                                <th className="border bg-gray-200" style={verticalText}>
                                                    Pendiente
                                                </th>
                                                <th className="border bg-gray-200" style={verticalText}>
                                                    Publicado
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(tareasPorSemana[semana]) &&
                                                tareasPorSemana[semana].map((tarea) => (
                                                    <EditableRow
                                                        key={tarea.id}
                                                        tarea={tarea}
                                                        usersProduccion={usersProduccion} // ✅ Pasar la nueva prop correctamente
                                                        usersEdicion={usersEdicion} // ✅ Pasar la nueva prop correctamente
                                                    />
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
