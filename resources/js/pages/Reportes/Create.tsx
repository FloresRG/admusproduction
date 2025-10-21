import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle2, FileText, Plus, Save, Target, Trash2, TrendingUp } from 'lucide-react';
import { useState } from 'react';

// Types for form and items
type Actividad = {
    tipo_actividad: string;
    descripcion: string;
    fecha_actividad: string;
    observaciones: string;
};

type Estrategia = {
    metodo_estrategia: string;
    herramientas_usadas: string;
    resultado_esperado: string;
};

type Resultado = {
    indicador: string;
    meta_mes: string;
    resultado_real: string;
    observaciones?: string;
};

type Dificultad = {
    tipo: string;
    descripcion: string;
    impacto: string;
    accion_tomada?: string;
};

type Meta = {
    objetivo: string;
    accion_implementar: string;
    responsable: string;
    fecha_cumplimiento: string;
};

type FormState = {
    tipo_periodo: string;
    fecha_reporte: string;
    fecha_inicio: string;
    fecha_fin: string;
    observaciones: string;
    recomendaciones: string;
    actividades: Actividad[];
    estrategias: Estrategia[];
    resultados: Resultado[];
    dificultades: Dificultad[];
    metas: Meta[];
    seguimiento_empresa_ids: number[];
};
type Empresa = {
    id: number;
    nombre_empresa: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
    descripcion: string;
    celular: string;
    paquete: string | null;
    usuario: string | null;
};

type Props = {
    empresas: Empresa[];
};

const Create = ({ empresas }: Props) => {
    const [form, setForm] = useState<FormState>({
        tipo_periodo: 'semanal',
        fecha_reporte: new Date().toISOString().split('T')[0],
        fecha_inicio: '',
        fecha_fin: '',
        observaciones: '',
        recomendaciones: '',
        actividades: [],
        estrategias: [],
        resultados: [],
        dificultades: [],
        metas: [],
        seguimiento_empresa_ids: [],
    });

    // Validation errors for inline display
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manejo dinámico de secciones repetibles
    const handleDynamicChange = (section: string, index: number, field: string, value: any) => {
        const updatedSection = [...(form as any)[section]];
        updatedSection[index][field] = value;
        setForm({ ...form, [section]: updatedSection });
    };

    const addItem = (section: string, defaultItem: any) => {
        setForm({ ...form, [section]: [...(form as any)[section], defaultItem] });
    };

    const removeItem = (section: string, index: number) => {
        const updatedSection = [...(form as any)[section]];
        updatedSection.splice(index, 1);
        setForm({ ...form, [section]: updatedSection });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        const newErrors: { [key: string]: string } = {};
        // Require at least one actividad and one estrategia
        if (!form.actividades || form.actividades.length === 0) {
            newErrors.actividades = 'Agrega al menos una actividad';
        }
        if (!form.estrategias || form.estrategias.length === 0) {
            newErrors.estrategias = 'Agrega al menos una estrategia';
        }
        if (!form.resultados || form.resultados.length === 0) {
            newErrors.resultados = 'Agrega al menos unresultado';
        }
        if (!form.dificultades || form.dificultades.length === 0) {
            newErrors.dificultades = 'Agrega al menos una dificultad';
        }
        if (!form.metas || form.metas.length === 0) {
            newErrors.metas = 'Agrega al menos una meta';
        }

        setErrors(newErrors);

        // If there are validation errors, do not submit
        if (Object.keys(newErrors).length > 0) return;

        router.post('/reportes', form);
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-600 p-2">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-800">Crear Reporte</h1>
                        </div>
                        <p className="ml-14 text-slate-600">Complete la información del reporte periódico</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Información General */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-3">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-slate-800">Información General</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                {/* 1. Tipo de Periodo (Ocupa 1/3) */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Tipo de Periodo</label>
                                    <select
                                        name="tipo_periodo"
                                        value={form.tipo_periodo}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled
                                    >
                                        <option value="diario">Diario</option>
                                        <option value="semanal">Semanal</option>
                                        <option value="mensual">Mensual</option>
                                    </select>
                                </div>

                                {/* 2. Fechas de Actividades (OCUPA 2/3) */}
                                <div className="md:col-span-2">
                                    <div className="rounded-lg border border-slate-300 bg-white p-4">
                                        {/* Título combinado */}
                                        <h3 className="mb-3 text-sm font-semibold text-slate-800">Actividades realizadas (Desde - Hasta)</h3>

                                        {/* Campos de Fecha anidados: usa grid-cols-2 en escritorio (md:grid-cols-2) */}
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {/* Fecha Inicio */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700">Desde</label>
                                                <input
                                                    type="date"
                                                    name="fecha_inicio"
                                                    value={form.fecha_inicio}
                                                    onChange={handleChange}
                                                    // Clases de input originales, ajustadas solo la etiqueta (label)
                                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            {/* Fecha Fin */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-slate-700">Hasta</label>
                                                <input
                                                    type="date"
                                                    name="fecha_fin"
                                                    value={form.fecha_fin}
                                                    onChange={handleChange}
                                                    // Clases de input originales, ajustadas solo la etiqueta (label)
                                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <label className="mb-2 block text-sm font-medium text-slate-700">Empresas en seguimiento</label>

                                <div className="flex items-center gap-4">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            const selectedId = parseInt(e.target.value, 10);
                                            if (!form.seguimiento_empresa_ids.includes(selectedId)) {
                                                setForm({
                                                    ...form,
                                                    seguimiento_empresa_ids: [...form.seguimiento_empresa_ids, selectedId],
                                                });
                                            }
                                        }}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccione una empresa</option>
                                        {empresas
                                            .filter((empresa) => !form.seguimiento_empresa_ids.includes(empresa.id))
                                            .map((empresa) => (
                                                <option key={empresa.id} value={empresa.id}>
                                                    {empresa.nombre_empresa}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {errors.seguimiento_empresa_ids && <p className="mt-1 text-sm text-red-500">{errors.seguimiento_empresa_ids}</p>}

                                {form.seguimiento_empresa_ids.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="mb-2 text-sm font-semibold text-slate-700">Empresas seleccionadas:</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full table-auto border border-slate-200 text-sm text-slate-700">
                                                <thead className="bg-slate-100">
                                                    <tr>
                                                        <th className="border px-3 py-2">Empresa</th>
                                                        <th className="border px-3 py-2">Estado</th>
                                                        <th className="border px-3 py-2">Fecha Inicio</th>
                                                        <th className="border px-3 py-2">Fecha Fin</th>
                                                        <th className="border px-3 py-2">Descripción</th>
                                                        <th className="border px-3 py-2">Celular</th>
                                                        <th className="border px-3 py-2">Paquete</th>
                                                        <th className="border px-3 py-2">Responsable</th>
                                                        <th className="border px-3 py-2 text-center">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {form.seguimiento_empresa_ids.map((id) => {
                                                        const empresa = empresas.find((e) => e.id === id);
                                                        if (!empresa) return null;
                                                        return (
                                                            <tr key={empresa.id}>
                                                                <td className="border px-3 py-2">{empresa.nombre_empresa}</td>
                                                                <td className="border px-3 py-2">{empresa.estado}</td>
                                                                <td className="border px-3 py-2">{empresa.fecha_inicio}</td>
                                                                <td className="border px-3 py-2">{empresa.fecha_fin}</td>
                                                                <td className="border px-3 py-2">{empresa.descripcion}</td>
                                                                <td className="border px-3 py-2">{empresa.celular}</td>
                                                                <td className="border px-3 py-2">{empresa.paquete ?? '—'}</td>
                                                                <td className="border px-3 py-2">{empresa.usuario ?? '—'}</td>
                                                                <td className="border px-3 py-2 text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setForm({
                                                                                ...form,
                                                                                seguimiento_empresa_ids: form.seguimiento_empresa_ids.filter(
                                                                                    (eid) => eid !== id,
                                                                                ),
                                                                            })
                                                                        }
                                                                        className="text-red-600 hover:text-red-800"
                                                                        title="Eliminar"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Observaciones</label>
                                    <textarea
                                        name="observaciones"
                                        value={form.observaciones}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Ingrese observaciones generales..."
                                        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actividades */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-slate-800">Actividades</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        addItem('actividades', { tipo_actividad: '', descripcion: '', fecha_actividad: '', observaciones: '' })
                                    }
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Añadir Actividad
                                </button>
                            </div>

                            <div className="space-y-3">
                                {errors.actividades && <div className="mb-2 text-sm text-red-600">{errors.actividades}</div>}
                                {form.actividades.length === 0 ? (
                                    <div className="py-8 text-center text-slate-500">
                                        <CheckCircle2 className="mx-auto mb-2 h-12 w-12 opacity-30" />
                                        <p>No hay actividades registradas</p>
                                    </div>
                                ) : (
                                    form.actividades.map((actividad, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-5"
                                        >
                                            <input
                                                placeholder="Tipo de actividad"
                                                required
                                                value={actividad.tipo_actividad || ''}
                                                onChange={(e) => handleDynamicChange('actividades', index, 'tipo_actividad', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <textarea
                                                placeholder="Descripción"
                                                required
                                                value={actividad.descripcion || ''}
                                                onChange={(e) => handleDynamicChange('actividades', index, 'descripcion', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                type="date"
                                                required
                                                value={actividad.fecha_actividad || ''}
                                                onChange={(e) => handleDynamicChange('actividades', index, 'fecha_actividad', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />

                                            <textarea
                                                placeholder="Observaciones"
                                                required
                                                value={actividad.observaciones || ''}
                                                onChange={(e) => handleDynamicChange('actividades', index, 'observaciones', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItem('actividades', index)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Estrategias */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-slate-800">Estrategias Utilizadas</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addItem('estrategias', { metodo_estrategia: '', herramientas_usadas: '', resultado_esperado: '' })}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Añadir Estrategia
                                </button>
                            </div>

                            <div className="space-y-3">
                                {errors.estrategias && <div className="mb-2 text-sm text-red-600">{errors.estrategias}</div>}
                                {form.estrategias.length === 0 ? (
                                    <div className="py-8 text-center text-slate-500">
                                        <Target className="mx-auto mb-2 h-12 w-12 opacity-30" />
                                        <p>No hay estrategias registradas</p>
                                    </div>
                                ) : (
                                    form.estrategias.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4"
                                        >
                                            <textarea
                                                placeholder="Método o Estrategia"
                                                required
                                                value={item.metodo_estrategia || ''}
                                                onChange={(e) => handleDynamicChange('estrategias', index, 'metodo_estrategia', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <textarea
                                                placeholder="Herramientas Usadas"
                                                required
                                                value={item.herramientas_usadas || ''}
                                                onChange={(e) => handleDynamicChange('estrategias', index, 'herramientas_usadas', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <textarea
                                                placeholder="Resultado Esperado"
                                                required
                                                value={item.resultado_esperado || ''}
                                                onChange={(e) => handleDynamicChange('estrategias', index, 'resultado_esperado', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItem('estrategias', index)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Resultados */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-slate-800">Resultados del Equipo</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addItem('resultados', { indicador: '', meta_mes: '', resultado_real: '', observaciones: '' })}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Añadir Resultado
                                </button>
                            </div>

                            <div className="space-y-3">
                                {errors.resultados && <div className="mb-2 text-sm text-red-600">{errors.resultados}</div>}
                                {form.resultados.length === 0 ? (
                                    <div className="py-8 text-center text-slate-500">
                                        <TrendingUp className="mx-auto mb-2 h-12 w-12 opacity-30" />
                                        <p>No hay resultados registrados</p>
                                    </div>
                                ) : (
                                    form.resultados.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4"
                                        >
                                            <input
                                                placeholder="Indicador"
                                                required
                                                value={item.indicador || ''}
                                                onChange={(e) => handleDynamicChange('resultados', index, 'indicador', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                placeholder="Meta del Mes"
                                                required
                                                value={item.meta_mes || ''}
                                                onChange={(e) => handleDynamicChange('resultados', index, 'meta_mes', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                placeholder="Resultado Real"
                                                required
                                                value={item.resultado_real || ''}
                                                onChange={(e) => handleDynamicChange('resultados', index, 'resultado_real', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItem('resultados', index)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Dificultades */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-slate-800">Dificultades</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addItem('dificultades', { tipo: '', descripcion: '', impacto: '', accion_tomada: '' })}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Añadir Dificultad
                                </button>
                            </div>

                            <div className="space-y-3">
                                {errors.dificultades && <div className="mb-2 text-sm text-red-600">{errors.dificultades}</div>}
                                {form.dificultades.length === 0 ? (
                                    <div className="py-8 text-center text-slate-500">
                                        <AlertCircle className="mx-auto mb-2 h-12 w-12 opacity-30" />
                                        <p>No hay dificultades registradas</p>
                                    </div>
                                ) : (
                                    form.dificultades.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4"
                                        >
                                            <input
                                                placeholder="Tipo"
                                                required
                                                value={item.tipo || ''}
                                                onChange={(e) => handleDynamicChange('dificultades', index, 'tipo', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <textarea
                                                placeholder="Descripción"
                                                required
                                                value={item.descripcion || ''}
                                                onChange={(e) => handleDynamicChange('dificultades', index, 'descripcion', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <textarea
                                                placeholder="Impacto"
                                                required
                                                value={item.impacto || ''}
                                                onChange={(e) => handleDynamicChange('dificultades', index, 'impacto', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItem('dificultades', index)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Metas Siguientes */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-slate-800">Metas Siguientes</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        addItem('metas', { objetivo: '', accion_implementar: '', responsable: '', fecha_cumplimiento: '' })
                                    }
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Añadir Meta
                                </button>
                            </div>

                            <div className="space-y-3">
                                {errors.metas && <div className="mb-2 text-sm text-red-600">{errors.metas}</div>}
                                {form.metas.length === 0 ? (
                                    <div className="py-8 text-center text-slate-500">
                                        <Target className="mx-auto mb-2 h-12 w-12 opacity-30" />
                                        <p>No hay metas registradas</p>
                                    </div>
                                ) : (
                                    form.metas.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-5"
                                        >
                                            <textarea
                                                placeholder="Objetivo"
                                                required
                                                value={item.objetivo || ''}
                                                onChange={(e) => handleDynamicChange('metas', index, 'objetivo', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <textarea
                                                placeholder="Acción a Implementar"
                                                required
                                                value={item.accion_implementar || ''}
                                                onChange={(e) => handleDynamicChange('metas', index, 'accion_implementar', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                placeholder="Responsable"
                                                required
                                                value={item.responsable || ''}
                                                onChange={(e) => handleDynamicChange('metas', index, 'responsable', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                type="date"
                                                value={item.fecha_cumplimiento || ''}
                                                onChange={(e) => handleDynamicChange('metas', index, 'fecha_cumplimiento', e.target.value)}
                                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItem('metas', index)}
                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Botón de Guardar */}
                        <div className="flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <button
                                type="button"
                                className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                <Save className="h-5 w-5" />
                                Guardar Reporte
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
};

export default Create;
