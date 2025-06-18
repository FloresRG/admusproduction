'use client';

import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Building2, Calendar, CheckCircle, Edit3, ExternalLink, FileText, LinkIcon, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function Index({ empresas, registros }) {
    const [empresaNombre, setEmpresaNombre] = useState('');
    const { data, setData, post, reset } = useForm({
        company_id: '',
        link: '',
        detalle: '',
        comprobante_id: '',
        mes: '',
        fecha: '',
    });

    const [notificaciones, setNotificaciones] = useState<string | null>(null);
    const [allRegistros, setAllRegistros] = useState(registros);

    const [inlineData, setInlineData] = useState(() => {
        const mapa = {};
        registros.forEach((r) => {
            mapa[r.id] = {
                company_id: r.company.id,
                link: r.link.link,
                detalle: r.link.detalle || '',
                mes: r.mes,
                fecha: r.fecha?.slice(0, 10) || '',
                comprobante_id: r.comprobante?.id || '',
            };
        });
        return mapa;
    });

    const getEmpresaIdByName = (nombre: string) => {
        const empresa = empresas.find((e) => e.name === nombre);
        return empresa ? empresa.id : '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('company-links.store'), {
            onSuccess: (response) => {
                reset();
                setEmpresaNombre('');
                setNotificaciones('✅ Registro creado correctamente');
                setTimeout(() => setNotificaciones(null), 3000);

                const nuevo = response.props.flash.nuevoRegistro;
                setAllRegistros((prev) => [...prev, nuevo]);
                setInlineData((prev) => ({
                    ...prev,
                    [nuevo.id]: {
                        company_id: nuevo.company_id,
                        link: nuevo.link.link,
                        detalle: nuevo.link.detalle || '',
                        mes: nuevo.mes,
                        fecha: nuevo.fecha,
                        comprobante_id: nuevo.comprobante_id || '',
                    },
                }));
                window.location.reload();
            },
        });
    };

    const handleInlineChange = (id, campo, valor) => {
        setInlineData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [campo]: valor,
            },
        }));
    };

    const handleInlineSave = async (id) => {
        const campos = inlineData[id];
        const body = { ...campos, _method: 'PUT' };

        try {
            const response = await fetch(route('company-links.update', id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setNotificaciones('✅ Guardado correctamente');
                setTimeout(() => setNotificaciones(null), 2000);
            }
        } catch {
            setNotificaciones('❌ Error al guardar');
        }
    };

    const eliminarRegistro = async (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;

        try {
            await fetch(route('company-links.destroy', id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ _method: 'DELETE' }),
            });

            setAllRegistros((prev) => prev.filter((r) => r.id !== id));
            const newData = { ...inlineData };
            delete newData[id];
            setInlineData(newData);

            setNotificaciones('🗑 Registro eliminado correctamente');
            setTimeout(() => setNotificaciones(null), 2000);
        } catch {
            setNotificaciones('❌ Error al eliminar');
        }
    };

    return (
        <AppLayout>
            <Head title="Links por Empresa" />

            {/* Header con gradiente azul */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
                <div className="px-6 py-8">
                    <div className="mb-2 flex items-center gap-3">
                        <LinkIcon className="h-8 w-8" />
                        <h1 className="text-3xl font-bold">Gestión de Links por Empresa</h1>
                    </div>
                    <p className="text-lg text-blue-100">Administra los enlaces y comprobantes de cada empresa</p>
                </div>
            </div>

            <div className="min-h-screen space-y-8 bg-gray-50 p-6">
                {/* Notificaciones */}
                {notificaciones && (
                    <div
                        className={`rounded-xl border-l-4 p-4 shadow-lg ${
                            notificaciones.includes('❌') ? 'border-red-500 bg-red-50 text-red-800' : 'border-green-500 bg-green-50 text-green-800'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {notificaciones.includes('❌') ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                            <span className="font-medium">{notificaciones}</span>
                        </div>
                    </div>
                )}

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-3">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Empresas</p>
                                <p className="text-2xl font-bold text-gray-900">{empresas.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-3">
                                <LinkIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Links</p>
                                <p className="text-2xl font-bold text-gray-900">{allRegistros.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-3">
                                <FileText className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Con Comprobante</p>
                                <p className="text-2xl font-bold text-gray-900">{allRegistros.filter((r) => r.comprobante?.id).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulario para agregar nuevo link */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Plus className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-blue-900">Agregar Nuevo Link</h2>
                        </div>
                        <p className="mt-1 text-sm text-blue-700">Completa la información para registrar un nuevo enlace</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Empresa */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Building2 className="h-4 w-4 text-blue-600" />
                                    Empresa
                                </label>
                                <input
                                    list="empresa-list"
                                    className="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    value={empresaNombre}
                                    onChange={(e) => {
                                        const nombre = e.target.value;
                                        setEmpresaNombre(nombre);
                                        const idEncontrado = getEmpresaIdByName(nombre);
                                        setData('company_id', idEncontrado);
                                    }}
                                    required
                                    placeholder="Selecciona una empresa..."
                                />
                                <datalist id="empresa-list">
                                    {empresas.map((e) => (
                                        <option key={e.id} value={e.name} />
                                    ))}
                                </datalist>
                            </div>

                            {/* Mes */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    Mes
                                </label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    value={data.mes}
                                    onChange={(e) => setData('mes', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione mes</option>
                                    {meses.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    value={data.fecha}
                                    onChange={(e) => setData('fecha', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Link */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <LinkIcon className="h-4 w-4 text-blue-600" />
                                    Link
                                </label>
                                <input
                                    type="url"
                                    className="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    value={data.link}
                                    onChange={(e) => setData('link', e.target.value)}
                                    required
                                    placeholder="https://ejemplo.com"
                                />
                            </div>

                            {/* ID Comprobante */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    ID Comprobante
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    value={data.comprobante_id || ''}
                                    onChange={(e) => setData('comprobante_id', e.target.value)}
                                    placeholder="Opcional"
                                />
                            </div>

                            {/* Detalle */}
                            <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Edit3 className="h-4 w-4 text-blue-600" />
                                    Detalle
                                </label>
                                <textarea
                                    className="w-full resize-none rounded-lg border border-gray-300 p-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    value={data.detalle}
                                    onChange={(e) => setData('detalle', e.target.value)}
                                    placeholder="Descripción adicional (opcional)"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                            >
                                <Save className="h-4 w-4" />
                                Guardar Link
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla de registros existentes */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-blue-600" />
                            <h3 className="text-xl font-semibold text-blue-900">Registros Existentes</h3>
                        </div>
                        <p className="mt-1 text-sm text-blue-700">Edita directamente en la tabla o elimina registros</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                    <th className="px-4 py-4 text-left font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Empresa
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="h-4 w-4" />
                                            Link
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold">Detalle</th>
                                    <th className="px-4 py-4 text-left font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Mes
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold">Fecha</th>
                                    <th className="px-4 py-4 text-left font-semibold">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Comprobante
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-center font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allRegistros.map((r, index) => (
                                    <tr
                                        key={r.id}
                                        className={`transition-colors duration-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className="px-4 py-3">
                                            <select
                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                value={inlineData[r.id]?.company_id}
                                                onChange={(e) => handleInlineChange(r.id, 'company_id', e.target.value)}
                                                onBlur={() => handleInlineSave(r.id)}
                                            >
                                                {empresas.map((e) => (
                                                    <option key={e.id} value={e.id}>
                                                        {e.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="url"
                                                    className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    value={inlineData[r.id]?.link}
                                                    onChange={(e) => handleInlineChange(r.id, 'link', e.target.value)}
                                                    onBlur={() => handleInlineSave(r.id)}
                                                />
                                                {inlineData[r.id]?.link && (
                                                    <a
                                                        href={inlineData[r.id]?.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-blue-600 transition-colors hover:text-blue-800"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                value={inlineData[r.id]?.detalle}
                                                onChange={(e) => handleInlineChange(r.id, 'detalle', e.target.value)}
                                                onBlur={() => handleInlineSave(r.id)}
                                                placeholder="Detalle..."
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                value={inlineData[r.id]?.mes || ''}
                                                onChange={(e) => handleInlineChange(r.id, 'mes', e.target.value)}
                                                onBlur={() => handleInlineSave(r.id)}
                                            >
                                                {meses.map((m) => (
                                                    <option key={m} value={m}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="date"
                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                value={inlineData[r.id]?.fecha || ''}
                                                onChange={(e) => handleInlineChange(r.id, 'fecha', e.target.value)}
                                                onBlur={() => handleInlineSave(r.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                value={inlineData[r.id]?.comprobante_id || ''}
                                                onChange={(e) => handleInlineChange(r.id, 'comprobante_id', e.target.value)}
                                                onBlur={() => handleInlineSave(r.id)}
                                                placeholder="ID..."
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-800"
                                                onClick={() => eliminarRegistro(r.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {allRegistros.length === 0 && (
                        <div className="py-12 text-center">
                            <LinkIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <p className="text-lg text-gray-500">No hay registros aún</p>
                            <p className="text-sm text-gray-400">Agrega tu primer link usando el formulario de arriba</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
