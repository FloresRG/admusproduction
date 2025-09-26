import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Company = {
    id: number;
    name: string;
    contract_duration: string;
    company_category_id: number;
    description: string;
    ubicacion: string;
    direccion: string;
    start_date: string;
    end_date: string;
    contrato: string;
    monto_mensual: string;
    celular: string;
    influencer: string;
    logo: string | null;
    paquete?: {
        nombre_paquete: string;
    };
    nombre_cliente: string;
    especificaciones: string;
    seguidores_inicio: string;
    seguidores_fin: string;
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
    fecha_nueva_produccion: string | null; // <-- Nuevo
    razon_produccion: string | null; // <-- Nuevo
    estado_produccion: string;
    user_produccion_id: number | null;
    fecha_edicion: string | null;
    fecha_nueva_edicion: string | null; // <-- Nuevo
    razon_edicion: string | null; // <-- Nuevo
    estado_edicion: string;
    user_edicion_id: number | null;
    fecha_entrega: string | null;
    fecha_nueva_entrega: string | null; // <-- Nuevo
    razon_entrega: string | null; // <-- Nuevo
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
// Fila editable para cada tarea
function EditableRow({ tarea, usersProduccion, usersEdicion }: { tarea: TareaSeguimiento; usersProduccion: User[]; usersEdicion: User[] }) {
    const [formData, setFormData] = useState({
        titulo: tarea.titulo,
        fecha_produccion: tarea.fecha_produccion ?? '',
        fecha_nueva_produccion: tarea.fecha_nueva_produccion ?? '',
        razon_produccion: tarea.razon_produccion ?? '',
        estado_produccion: tarea.estado_produccion || 'pendiente',
        user_produccion_id: tarea.user_produccion_id ?? null,
        fecha_edicion: tarea.fecha_edicion ?? '',
        fecha_nueva_edicion: tarea.fecha_nueva_edicion ?? '',
        razon_edicion: tarea.razon_edicion ?? '',
        estado_edicion: tarea.estado_edicion || 'pendiente',
        user_edicion_id: tarea.user_edicion_id ?? null,
        fecha_entrega: tarea.fecha_entrega ?? '',
        fecha_nueva_entrega: tarea.fecha_nueva_entrega ?? '',
        razon_entrega: tarea.razon_entrega ?? '',
        estado_entrega: tarea.estado_entrega || 'pendiente',
        estrategia: tarea.estrategia,
        comentario: tarea.comentario,
        guion: tarea.guion,
    });

    // Nuevo estado para controlar la visibilidad de los campos de nueva fecha
    const [showNewProduccion, setShowNewProduccion] = useState(!!tarea.fecha_nueva_produccion);
    const [showNewEdicion, setShowNewEdicion] = useState(!!tarea.fecha_nueva_edicion);
    const [showNewEntrega, setShowNewEntrega] = useState(!!tarea.fecha_nueva_entrega);

    const handleEstadoChange = (campo: 'estado_produccion' | 'estado_edicion' | 'estado_entrega', valor: 'pendiente' | 'revision' | 'completado') => {
        setFormData((prev) => {
            const newForm = { ...prev, [campo]: valor };
            router.patch(
                route('tareas.actualizar', tarea.id),
                {
                    ...newForm,
                    fecha_produccion: newForm.fecha_produccion || null,
                    fecha_nueva_produccion: newForm.fecha_nueva_produccion || null,
                    fecha_edicion: newForm.fecha_edicion || null,
                    fecha_nueva_edicion: newForm.fecha_nueva_edicion || null,
                    fecha_entrega: newForm.fecha_entrega || null,
                    fecha_nueva_entrega: newForm.fecha_nueva_entrega || null,
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
                fecha_nueva_produccion: newForm.fecha_nueva_produccion || null,
                fecha_edicion: newForm.fecha_edicion || null,
                fecha_nueva_edicion: newForm.fecha_nueva_edicion || null,
                fecha_entrega: newForm.fecha_entrega || null,
                fecha_nueva_entrega: newForm.fecha_nueva_entrega || null,
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
            fecha_nueva_produccion: formData.fecha_nueva_produccion || null,
            fecha_edicion: formData.fecha_edicion || null,
            fecha_nueva_edicion: formData.fecha_nueva_edicion || null,
            fecha_entrega: formData.fecha_entrega || null,
            fecha_nueva_entrega: formData.fecha_nueva_entrega || null,
        };
        router.patch(route('tareas.actualizar', tarea.id), payload, {
            preserveScroll: true,
            onError: () => alert('Error al actualizar tarea'),
        });
    };

    // ✅ Clase condicional para la fila
    const rowClass = formData.estado_entrega === 'completado' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50';

    return (
        // ✅ Aplicamos la clase condicional en el <tr>
        <tr className={`text-sm ${rowClass}`}>
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
                        className="w-full rounded border px-2 py-1"
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
                {/* Botón y campos para la nueva fecha de producción */}
                {!showNewProduccion && !formData.fecha_nueva_produccion ? (
                    <button onClick={() => setShowNewProduccion(true)} className="mt-2 text-blue-500 hover:text-blue-700">
                        ➕ Agregar nueva fecha
                    </button>
                ) : (
                    <div className="mt-2 space-y-2">
                        <label className="text-xs text-gray-500">Nueva Fecha:</label>
                        <input
                            type="date"
                            name="fecha_nueva_produccion"
                            value={formData.fecha_nueva_produccion ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full rounded border px-2 py-1"
                        />
                        <label className="text-xs text-gray-500">Razón:</label>
                        <textarea
                            name="razon_produccion"
                            value={formData.razon_produccion ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full rounded border px-2 py-1"
                            rows={2}
                        />
                    </div>
                )}
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
                {!showNewEdicion && !formData.fecha_nueva_edicion ? (
                    <button onClick={() => setShowNewEdicion(true)} className="mt-2 text-blue-500 hover:text-blue-700">
                        ➕ Agregar nueva fecha
                    </button>
                ) : (
                    <div className="mt-2 space-y-2">
                        <label className="text-xs text-gray-500">Nueva Fecha:</label>
                        <input
                            type="date"
                            name="fecha_nueva_edicion"
                            value={formData.fecha_nueva_edicion ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full rounded border px-2 py-1"
                        />
                        <label className="text-xs text-gray-500">Razón:</label>
                        <textarea
                            name="razon_edicion"
                            value={formData.razon_edicion ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full rounded border px-2 py-1"
                            rows={2}
                        />
                    </div>
                )}
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
                {!showNewEntrega && !formData.fecha_nueva_entrega ? (
                    <button onClick={() => setShowNewEntrega(true)} className="mt-2 text-blue-500 hover:text-blue-700">
                        ➕ Agregar nueva fecha
                    </button>
                ) : (
                    <div className="mt-2 space-y-2">
                        <label className="text-xs text-gray-500">Nueva Fecha:</label>
                        <input
                            type="date"
                            name="fecha_nueva_entrega"
                            value={formData.fecha_nueva_entrega ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full rounded border px-2 py-1"
                        />
                        <label className="text-xs text-gray-500">Razón:</label>
                        <textarea
                            name="razon_entrega"
                            value={formData.razon_entrega ?? ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full rounded border px-2 py-1"
                            rows={2}
                        />
                    </div>
                )}
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
                        className="w-full rounded border px-2 py-1"
                        rows={2}
                    />
                    <label className="text-xs text-gray-500">Guión:</label>
                    <textarea
                        name="guion"
                        value={formData.guion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full rounded border px-2 py-1"
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
        if (confirm('¿Estás seguro de generar registros por defecto para esta empresa?')) {
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
                <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center justify-between border-b pb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{empresa.name}</h1>
                        {/* {empresa.logo && <img src={empresa.logo} alt={`${empresa.name} logo`} className="h-16 w-16 object-contain" />} */}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-500">Categoría</span>
                            <span className="text-gray-900">{empresa.category?.name ?? 'No asignada'}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-500">Duración del Contrato</span>
                            <span className="text-gray-900">{empresa.contract_duration}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-500">Paquete</span>
                            <span className="text-gray-900">{empresa.paquete?.nombre_paquete ?? 'No asignado'}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-500">Cliente</span>
                            <span className="text-gray-900">{empresa.nombre_cliente}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-500">Fechas del Contrato</span>
                            <span className="text-gray-900">
                                Inicio: {empresa.start_date} / Fin: {empresa.end_date}
                            </span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-500">Seguidores</span>
                            <span className="text-gray-900">
                                Inicio: {empresa.seguidores_inicio} / Fin: {empresa.seguidores_fin}
                            </span>
                        </div>

                        
                    </div>
                </div>

                {mensaje && <div className="mb-4 rounded bg-green-100 p-4 text-green-800">{mensaje}</div>}

                <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-700">
                        {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)} {anioActual}
                    </p>
                </div>

                {tareas.length === 0 && (
                    <div className="mb-6">
                        <button onClick={handleGenerar} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            Generar registros
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
