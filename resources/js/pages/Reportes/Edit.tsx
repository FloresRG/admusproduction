import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';

type SectionKey = 'actividades' | 'estrategias' | 'resultados' | 'dificultades' | 'metas';

type ReporteForm = {
    tipo_periodo: string;
    fecha_reporte: string;
    fecha_inicio: string;
    fecha_fin: string;
    observaciones: string;
    recomendaciones: string;
    seguimiento_empresa_ids: string[];
    actividades: any[];
    estrategias: any[];
    resultados: any[];
    dificultades: any[];
    metas: any[];
};

export default function Edit({ reporte, empresas }: { reporte: any; empresas: any[] }) {
    // Initialize form with nested arrays (ensure defaults if null)
    const form = useForm<ReporteForm>({
        tipo_periodo: reporte.tipo_periodo || 'semanal',
        fecha_reporte: reporte.fecha_reporte || '',
        fecha_inicio: reporte.fecha_inicio || '',
        fecha_fin: reporte.fecha_fin || '',
        observaciones: reporte.observaciones || '',
        recomendaciones: reporte.recomendaciones || '',
    seguimiento_empresa_ids: (reporte.empresas || []).map((e: any) => String(e.id)) || [],
        actividades: (reporte.actividades || []).map((a: any) => ({
            tipo_actividad: a.tipo_actividad || '',
            descripcion: a.descripcion || '',
            fecha_actividad: a.fecha_actividad || '',
            observaciones: a.observaciones || '',
        })),
        estrategias: (reporte.estrategias || []).map((s: any) => ({
            metodo_estrategia: s.metodo_estrategia || '',
            herramientas_usadas: s.herramientas_usadas || '',
            resultado_esperado: s.resultado_esperado || '',
        })),
        resultados: (reporte.resultados || []).map((r: any) => ({
            indicador: r.indicador || '',
            meta_mes: r.meta_mes || '',
            resultado_real: r.resultado_real || '',
            observaciones: r.observaciones || '',
        })),
        dificultades: (reporte.dificultades || []).map((d: any) => ({
            tipo: d.tipo || '',
            descripcion: d.descripcion || '',
            impacto: d.impacto || '',
            accion_tomada: d.accion_tomada || '',
        })),
        metas: (reporte.metas || []).map((m: any) => ({
            objetivo: m.objetivo || '',
            accion_implementar: m.accion_implementar || '',
            responsable: m.responsable || '',
            fecha_cumplimiento: m.fecha_cumplimiento || '',
        })),
    });

    // local UI-only errors for simple validation display (optional)
    const [errors, setErrors] = useState<Record<string, string>>({});

    function addItem(section: SectionKey) {
        const defaults: Record<SectionKey, any> = {
            actividades: { tipo_actividad: '', descripcion: '', fecha_actividad: '', observaciones: '' },
            estrategias: { metodo_estrategia: '', herramientas_usadas: '', resultado_esperado: '' },
            resultados: { indicador: '', meta_mes: '', resultado_real: '', observaciones: '' },
            dificultades: { tipo: '', descripcion: '', impacto: '', accion_tomada: '' },
            metas: { objetivo: '', accion_implementar: '', responsable: '', fecha_cumplimiento: '' },
        };
        const current = form.data[section] || [];
        form.setData(section, [...current, defaults[section]] as any);
    }

    function removeItem(section: SectionKey, index: number) {
        const updated = [...(form.data[section] || [])];
        updated.splice(index, 1);
        form.setData(section, updated as any);
    }

    function updateItem(section: SectionKey, index: number, field: string, value: any) {
        const updated = [...(form.data[section] || [])];
        updated[index] = { ...updated[index], [field]: value };
        form.setData(section, updated as any);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        // minimal client validation: require at least one item in each section
        const newErrors: Record<string, string> = {};
        const fd = form.data as any;
        if (!fd.actividades || fd.actividades.length === 0) newErrors['actividades'] = 'Agrega al menos una actividad';
        if (!fd.estrategias || fd.estrategias.length === 0) newErrors['estrategias'] = 'Agrega al menos una estrategia';
        if (!fd.resultados || fd.resultados.length === 0) newErrors['resultados'] = 'Agrega al menos un resultado';
        if (!fd.dificultades || fd.dificultades.length === 0) newErrors['dificultades'] = 'Agrega al menos una dificultad';
        if (!fd.metas || fd.metas.length === 0) newErrors['metas'] = 'Agrega al menos una meta';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        form.put(route('reportes.update', reporte.id));
    }

    return (
        <AppLayout>
            <div className="mx-auto max-w-5xl p-4">
                <h1 className="mb-4 text-2xl font-bold">Editar Reporte #{reporte.id}</h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="block">
                            Tipo de Periodo:
                            <select
                                value={form.data.tipo_periodo}
                                onChange={(e) => form.setData('tipo_periodo', e.target.value)}
                                className="mt-1 block w-full rounded border px-2 py-1"
                            >
                                <option value="diario">Diario</option>
                                <option value="semanal">Semanal</option>
                                <option value="mensual">Mensual</option>
                            </select>
                        </label>

                        <label className="block">
                            Fecha inicio:
                            <input
                                type="date"
                                value={form.data.fecha_inicio}
                                onChange={(e) => form.setData('fecha_inicio', e.target.value)}
                                className="mt-1 block w-full rounded border px-2 py-1"
                            />
                        </label>

                        <label className="block">
                            Fecha fin:
                            <input
                                type="date"
                                value={form.data.fecha_fin}
                                onChange={(e) => form.setData('fecha_fin', e.target.value)}
                                className="mt-1 block w-full rounded border px-2 py-1"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block mb-2">Empresas relacionadas:</label>
                        <select
                            multiple
                            value={form.data.seguimiento_empresa_ids}
                            onChange={(e) =>
                                form.setData(
                                    'seguimiento_empresa_ids',
                                    Array.from(e.target.selectedOptions, (o) => o.value),
                                )
                            }
                            className="w-full rounded border px-2 py-1"
                        >
                            {empresas.map((empresa: any) => (
                                <option key={empresa.id} value={empresa.id}>
                                    {empresa.nombre_empresa} ({empresa.estado})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                            Observaciones:
                            <textarea
                                value={form.data.observaciones}
                                onChange={(e) => form.setData('observaciones', e.target.value)}
                                className="mt-1 block w-full rounded border px-2 py-1"
                                rows={4}
                            />
                        </label>

                        <label className="block">
                            Recomendaciones:
                            <textarea
                                value={form.data.recomendaciones}
                                onChange={(e) => form.setData('recomendaciones', e.target.value)}
                                className="mt-1 block w-full rounded border px-2 py-1"
                                rows={4}
                            />
                        </label>
                    </div>

                    {/* Actividades */}
                    <section className="border rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Actividades</h3>
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => addItem('actividades')} className="rounded bg-blue-600 px-3 py-1 text-white">
                                    Añadir
                                </button>
                            </div>
                        </div>

                        {errors['actividades'] && <p className="text-red-600 mb-2">{errors['actividades']}</p>}

                        {(form.data as any).actividades && (form.data as any).actividades.length === 0 ? (
                            <p className="text-sm text-slate-500">No hay actividades.</p>
                        ) : (
                            (form.data as any).actividades.map((actividad: any, idx: number) => (
                                <div key={idx} className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                                    <input
                                        placeholder="Tipo"
                                        value={actividad.tipo_actividad}
                                        onChange={(e) => updateItem('actividades', idx, 'tipo_actividad', e.target.value)}
                                        className="rounded border px-2 py-1"
                                    />
                                    <input
                                        placeholder="Descripción"
                                        value={actividad.descripcion}
                                        onChange={(e) => updateItem('actividades', idx, 'descripcion', e.target.value)}
                                        className="rounded border px-2 py-1 md:col-span-2"
                                    />
                                    <input
                                        type="date"
                                        value={actividad.fecha_actividad}
                                        onChange={(e) => updateItem('actividades', idx, 'fecha_actividad', e.target.value)}
                                        className="rounded border px-2 py-1"
                                    />
                                    <textarea
                                        placeholder="Observaciones"
                                        value={actividad.observaciones}
                                        onChange={(e) => updateItem('actividades', idx, 'observaciones', e.target.value)}
                                        className="rounded border px-2 py-1 md:col-span-4"
                                        rows={2}
                                    />
                                    <div className="md:col-span-4 flex justify-end">
                                        <button type="button" onClick={() => removeItem('actividades', idx)} className="text-red-600">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>

                    {/* Estrategias */}
                    <section className="border rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Estrategias</h3>
                            <button type="button" onClick={() => addItem('estrategias')} className="rounded bg-blue-600 px-3 py-1 text-white">
                                Añadir
                            </button>
                        </div>

                        {errors['estrategias'] && <p className="text-red-600 mb-2">{errors['estrategias']}</p>}

                        {((form.data as any).estrategias || []).map((s: any, i: number) => (
                            <div key={i} className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                                <input
                                    placeholder="Método"
                                    value={s.metodo_estrategia}
                                    onChange={(e) => updateItem('estrategias', i, 'metodo_estrategia', e.target.value)}
                                    className="rounded border px-2 py-1"
                                />
                                <input
                                    placeholder="Herramientas usadas"
                                    value={s.herramientas_usadas}
                                    onChange={(e) => updateItem('estrategias', i, 'herramientas_usadas', e.target.value)}
                                    className="rounded border px-2 py-1"
                                />
                                <input
                                    placeholder="Resultado esperado"
                                    value={s.resultado_esperado}
                                    onChange={(e) => updateItem('estrategias', i, 'resultado_esperado', e.target.value)}
                                    className="rounded border px-2 py-1"
                                />
                                <div className="md:col-span-3 flex justify-end">
                                    <button type="button" onClick={() => removeItem('estrategias', i)} className="text-red-600">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Resultados */}
                    <section className="border rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Resultados</h3>
                            <button type="button" onClick={() => addItem('resultados')} className="rounded bg-blue-600 px-3 py-1 text-white">
                                Añadir
                            </button>
                        </div>

                        {errors['resultados'] && <p className="text-red-600 mb-2">{errors['resultados']}</p>}

                        {((form.data as any).resultados || []).map((r: any, i: number) => (
                            <div key={i} className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                                <input placeholder="Indicador" value={r.indicador} onChange={(e) => updateItem('resultados', i, 'indicador', e.target.value)} className="rounded border px-2 py-1" />
                                <input placeholder="Meta mes" value={r.meta_mes} onChange={(e) => updateItem('resultados', i, 'meta_mes', e.target.value)} className="rounded border px-2 py-1" />
                                <input placeholder="Resultado real" value={r.resultado_real} onChange={(e) => updateItem('resultados', i, 'resultado_real', e.target.value)} className="rounded border px-2 py-1" />
                                <textarea placeholder="Observaciones" value={r.observaciones} onChange={(e) => updateItem('resultados', i, 'observaciones', e.target.value)} className="rounded border px-2 py-1 md:col-span-4" rows={2} />
                                <div className="md:col-span-4 flex justify-end">
                                    <button type="button" onClick={() => removeItem('resultados', i)} className="text-red-600">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Dificultades */}
                    <section className="border rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Dificultades</h3>
                            <button type="button" onClick={() => addItem('dificultades')} className="rounded bg-blue-600 px-3 py-1 text-white">
                                Añadir
                            </button>
                        </div>

                        {errors['dificultades'] && <p className="text-red-600 mb-2">{errors['dificultades']}</p>}

                        {((form.data as any).dificultades || []).map((d: any, i: number) => (
                            <div key={i} className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                                <input placeholder="Tipo" value={d.tipo} onChange={(e) => updateItem('dificultades', i, 'tipo', e.target.value)} className="rounded border px-2 py-1" />
                                <input placeholder="Descripción" value={d.descripcion} onChange={(e) => updateItem('dificultades', i, 'descripcion', e.target.value)} className="rounded border px-2 py-1 md:col-span-2" />
                                <input placeholder="Impacto" value={d.impacto} onChange={(e) => updateItem('dificultades', i, 'impacto', e.target.value)} className="rounded border px-2 py-1" />
                                <input placeholder="Acción tomada" value={d.accion_tomada} onChange={(e) => updateItem('dificultades', i, 'accion_tomada', e.target.value)} className="rounded border px-2 py-1 md:col-span-4" />
                                <div className="md:col-span-4 flex justify-end">
                                    <button type="button" onClick={() => removeItem('dificultades', i)} className="text-red-600">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Metas Siguientes */}
                    <section className="border rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Metas Siguientes</h3>
                            <button type="button" onClick={() => addItem('metas')} className="rounded bg-blue-600 px-3 py-1 text-white">
                                Añadir
                            </button>
                        </div>

                        {errors['metas'] && <p className="text-red-600 mb-2">{errors['metas']}</p>}

                        {((form.data as any).metas || []).map((m: any, i: number) => (
                            <div key={i} className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                                <input placeholder="Objetivo" value={m.objetivo} onChange={(e) => updateItem('metas', i, 'objetivo', e.target.value)} className="rounded border px-2 py-1 md:col-span-2" />
                                <input placeholder="Acción a implementar" value={m.accion_implementar} onChange={(e) => updateItem('metas', i, 'accion_implementar', e.target.value)} className="rounded border px-2 py-1 md:col-span-2" />
                                <input placeholder="Responsable" value={m.responsable} onChange={(e) => updateItem('metas', i, 'responsable', e.target.value)} className="rounded border px-2 py-1" />
                                <input type="date" placeholder="Fecha cumplimiento" value={m.fecha_cumplimiento} onChange={(e) => updateItem('metas', i, 'fecha_cumplimiento', e.target.value)} className="rounded border px-2 py-1" />
                                <div className="md:col-span-4 flex justify-end">
                                    <button type="button" onClick={() => removeItem('metas', i)} className="text-red-600">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => window.history.back()} className="rounded border px-4 py-2">
                            Cancelar
                        </button>
                        <button type="submit" disabled={form.processing} className="rounded bg-blue-600 px-4 py-2 text-white">
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
