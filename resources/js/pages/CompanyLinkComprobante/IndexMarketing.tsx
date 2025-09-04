'use client';

import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle,
    Edit3,
    ExternalLink,
    FileText,
    Filter,
    LinkIcon,
    Plus,
    Save,
    Search,
    Trash2,
    VideoIcon,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
interface Company {
    id: number;
    name: string;
}

interface Link {
    id: number;
    link: string;
    detalle?: string;
}

interface CompanyLinkRecord {
    id: number;
    company: Company;
    link: Link;
    mes: string;
    fecha: string;
    comprobante?: {
        id: number;
    };
}

interface InlineDataItem {
    company_id: number;
    link: string;
    detalle: string;
    mes: string;
    fecha: string;
    comprobante_id: string;
}

interface Props {
    empresas: Company[];
    registros: CompanyLinkRecord[];
}

// Constants
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const ITEMS_PER_PAGE = 10;

export default function Index({ empresas, registros }: Props) {
    const today = new Date();
    const defaultMes = MESES[today.getMonth()];
    const defaultFecha = today.toISOString().split('T')[0];

    // Form state
    const { data, setData, post, reset, processing } = useForm({
        company_id: '',
        link: '',
        detalle: '',
        mes: defaultMes,
        fecha: defaultFecha,
    });

    // Component state
    const [empresaNombre, setEmpresaNombre] = useState('');
    const [notificaciones, setNotificaciones] = useState<string | null>(null);
    const [allRegistros, setAllRegistros] = useState(registros);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMes, setFilterMes] = useState('');
    const [filterEmpresa, setFilterEmpresa] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Inline editing state
    const [inlineData, setInlineData] = useState<Record<number, InlineDataItem>>(() => {
        const mapa: Record<number, InlineDataItem> = {};
        registros.forEach((r) => {
            mapa[r.id] = {
                company_id: r.company.id,
                link: r.link.link,
                detalle: r.link.detalle || '',
                mes: r.mes,
                fecha: r.fecha?.slice(0, 10) || '',
                comprobante_id: r.comprobante?.id?.toString() || '',
            };
        });
        return mapa;
    });

    // Computed values
    const filteredRegistros = useMemo(() => {
        return allRegistros.filter((record) => {
            const matchesSearch =
                record.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.link.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (record.link.detalle || '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchesMes = !filterMes || record.mes === filterMes;
            const matchesEmpresa = !filterEmpresa || record.company.id.toString() === filterEmpresa;

            return matchesSearch && matchesMes && matchesEmpresa;
        });
    }, [allRegistros, searchTerm, filterMes, filterEmpresa]);

    const paginatedRegistros = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRegistros.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRegistros, currentPage]);

    const totalPages = Math.ceil(filteredRegistros.length / ITEMS_PER_PAGE);

    // Helper functions
    const getEmpresaIdByName = (nombre: string): string => {
        const empresa = empresas.find((e) => e.name === nombre);
        return empresa ? empresa.id.toString() : '';
    };

    const showNotification = (message: string) => {
        setNotificaciones(message);
        setTimeout(() => setNotificaciones(null), 3000);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterMes('');
        setFilterEmpresa('');
        setCurrentPage(1);
    };

    // Event handlers
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company-links.store'), {
            onSuccess: (response: any) => {
                reset();
                setEmpresaNombre('');
                showNotification('✅ Registro creado correctamente');

                const nuevo = response.props.flash.nuevoRegistro;
                if (nuevo) {
                    setAllRegistros((prev) => [nuevo, ...prev]);
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
                }
            },
            onError: () => {
                showNotification('❌ Error al crear el registro');
            },
        });
        window.location.reload();
    };

    const handleInlineChange = (id: number, campo: keyof InlineDataItem, valor: string) => {
        setInlineData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [campo]: valor,
            },
        }));
    };

    const handleInlineSave = async (id: number) => {
        const campos = inlineData[id];

        // Validar que haya cambios antes de enviar
        if (!campos) return;

        try {
            const response = await fetch(route('company-links.update', id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    company_id: campos.company_id,
                    mes: campos.mes,
                    fecha: campos.fecha,
                    link: campos.link,
                    detalle: campos.detalle,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error HTTP ${response.status}:`, errorText);
                showNotification('❌ Error al guardar');
                return;
            }

            const json = await response.json();
            showNotification(json.message || '✅ Guardado correctamente');

            // Actualizar el registro en el estado local
            setAllRegistros((prev) =>
                prev.map((record) =>
                    record.id === id
                        ? {
                              ...record,
                              company_id: campos.company_id,
                              mes: campos.mes,
                              fecha: campos.fecha,
                              link: {
                                  ...record.link,
                                  link: campos.link,
                                  detalle: campos.detalle,
                              },
                          }
                        : record,
                ),
            );
        } catch (error: any) {
            console.error('Error al guardar inline:', error);
            showNotification('❌ Error al guardar: ' + error.message);
        }
    };

    const eliminarRegistro = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;

        try {
            const response = await fetch(route('company-links.destroy', id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ _method: 'DELETE' }),
            });

            if (response.ok) {
                setAllRegistros((prev) => prev.filter((r) => r.id !== id));
                const newData = { ...inlineData };
                delete newData[id];
                setInlineData(newData);
                showNotification('🗑 Registro eliminado correctamente');
            } else {
                throw new Error('Error en la respuesta');
            }
        } catch (error) {
            showNotification('❌ Error al eliminar');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AppLayout>
            <Head title="Links por Empresa" />

            {/* Header con gradiente mejorado */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl">
                <div className="px-6 py-10">
                    <div className="mb-4 flex items-center gap-4">
                        <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                            <LinkIcon className="h-10 w-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Gestión de Links</h1>
                            <p className="mt-2 text-xl text-blue-100">Administra los enlaces y comprobantes de cada empresa</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen space-y-8 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
                {/* Notificaciones mejoradas */}
                {notificaciones && (
                    <div className="animate-in slide-in-from-right fixed top-4 right-4 z-50 duration-300">
                        <div
                            className={`rounded-xl border-l-4 p-4 shadow-2xl backdrop-blur-sm ${
                                notificaciones.includes('❌')
                                    ? 'border-red-500 bg-red-50/90 text-red-800'
                                    : 'border-green-500 bg-green-50/90 text-green-800'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {notificaciones.includes('❌') ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                                <span className="font-medium">{notificaciones}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Estadísticas mejoradas */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="group rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-lg">
                                <Building2 className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Empresas</p>
                                <p className="text-3xl font-bold text-gray-900">{empresas.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-green-100/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 shadow-lg">
                                <LinkIcon className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Links</p>
                                <p className="text-3xl font-bold text-gray-900">{allRegistros.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-purple-100/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-lg">
                                <VideoIcon className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Videos Activos</p>
                                <p className="text-3xl font-bold text-gray-900">{filteredRegistros.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulario mejorado */}
                <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-sm">
                    <div className="border-b border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-blue-600 p-3">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-blue-900">Agregar Nuevo Link</h2>
                                <p className="mt-1 text-blue-700">Completa la información para registrar un nuevo enlace</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Empresa */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    Empresa *
                                </label>
                                <input
                                    list="empresa-list"
                                    className="w-full rounded-xl border-2 border-gray-200 p-4 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
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
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    Mes *
                                </label>
                                <select
                                    className="w-full rounded-xl border-2 border-gray-200 p-4 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                    value={data.mes}
                                    onChange={(e) => setData('mes', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione mes</option>
                                    {MESES.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    Fecha *
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-xl border-2 border-gray-200 p-4 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                    value={data.fecha}
                                    onChange={(e) => setData('fecha', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Link + Detalle en una fila (ocupan 2 columnas) */}
                            <div className="md:col-span-2 lg:col-span-3">
                                <div className="flex flex-col gap-4 md:flex-row">
                                    {/* Link */}
                                    <div className="w-full space-y-2 md:w-1/3">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <LinkIcon className="h-5 w-5 text-blue-600" />
                                            Link *
                                        </label>
                                        <input
                                            type="url"
                                            className="w-full rounded-xl border-2 border-gray-200 p-4 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                            value={data.link}
                                            onChange={(e) => setData('link', e.target.value)}
                                            required
                                            placeholder="https://www.tiktok.com/"
                                        />
                                    </div>

                                    {/* Detalle */}
                                    <div className="w-full space-y-2 md:w-2/3">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Edit3 className="h-5 w-5 text-blue-600" />
                                            Detalle
                                        </label>
                                        <textarea
                                            className="w-full resize-none rounded-xl border-2 border-gray-200 p-4 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                            rows={4}
                                            value={data.detalle}
                                            onChange={(e) => setData('detalle', e.target.value)}
                                            placeholder="Descripción adicional del contenido (opcional)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-bold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save className="h-5 w-5" />
                                {processing ? 'Guardando...' : 'Guardar Link'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabla con buscador y filtros */}
                <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-sm">
                    {/* Header con controles */}
                    <div className="border-b border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-8 py-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-blue-600 p-3">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-blue-900">Registros Existentes</h3>
                                    <p className="text-blue-700">
                                        Mostrando {paginatedRegistros.length} de {filteredRegistros.length} registros
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {/* Buscador */}
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por empresa, link o detalle..."
                                        className="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-10 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 sm:w-80"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>

                                {/* Toggle filtros */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium transition-all hover:bg-gray-50"
                                >
                                    <Filter className="h-4 w-4" />
                                    Filtros
                                </button>
                            </div>
                        </div>

                        {/* Panel de filtros */}
                        {showFilters && (
                            <div className="mt-6 rounded-xl bg-white/50 p-6 backdrop-blur-sm">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Filtrar por empresa</label>
                                        <select
                                            className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm"
                                            value={filterEmpresa}
                                            onChange={(e) => {
                                                setFilterEmpresa(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value="">Todas las empresas</option>
                                            {empresas.map((e) => (
                                                <option key={e.id} value={e.id}>
                                                    {e.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Filtrar por mes</label>
                                        <select
                                            className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm"
                                            value={filterMes}
                                            onChange={(e) => {
                                                setFilterMes(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value="">Todos los meses</option>
                                            {MESES.map((mes) => (
                                                <option key={mes} value={mes}>
                                                    {mes}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200"
                                        >
                                            <X className="h-4 w-4" />
                                            Limpiar filtros
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Empresa
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="h-4 w-4" />
                                            Link
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Detalle</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Mes
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Fecha</th>
                                    {/* <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Acciones</th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedRegistros.map((r, index) => (
                                    <tr
                                        key={r.id}
                                        className={`transition-all duration-200 hover:bg-blue-50/50 ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                        }`}
                                    >
                                        {/* Empresa */}
                                        <td className="px-6 py-4">
                                            <select
                                                className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                                value={inlineData[r.id]?.company_id || ''}
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

                                        {/* Link */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="url"
                                                    className="flex-1 rounded-lg border-2 border-gray-200 p-3 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                                    value={inlineData[r.id]?.link || ''}
                                                    onChange={(e) => handleInlineChange(r.id, 'link', e.target.value)}
                                                    onBlur={() => handleInlineSave(r.id)}
                                                />
                                                {inlineData[r.id]?.link && (
                                                    <a
                                                        href={inlineData[r.id]?.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded-lg p-3 text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-800"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>

                                        {/* Detalle */}
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                                value={inlineData[r.id]?.detalle || ''}
                                                onChange={(e) => handleInlineChange(r.id, 'detalle', e.target.value)}
                                                onBlur={() => handleInlineSave(r.id)}
                                                placeholder="Detalle..."
                                            />
                                        </td>

                                        {/* Mes */}
                                        <td className="px-6 py-4">
                                            <select
                                                className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                                value={inlineData[r.id]?.mes || ''}
                                                onChange={(e) => handleInlineChange(r.id, 'mes', e.target.value)}
                                                onBlur={() => handleInlineSave(r.id)}
                                            >
                                                {MESES.map((mes) => (
                                                    <option key={mes} value={mes}>
                                                        {mes}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        {/* Fecha */}
                                        <td className="px-6 py-4">
                                            <input
                                                type="date"
                                                className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                                                value={inlineData[r.id]?.fecha || ''}
                                                onChange={(e) => handleInlineChange(r.id, 'fecha', e.target.value)}
                                                onBlur={() => handleInlineSave(r.id)}
                                            />
                                        </td>

                                        {/* Acciones */}
                                        {/* <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => eliminarRegistro(r.id)}
                                                className="rounded-lg bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Paginación */}
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white/50 p-6 backdrop-blur-sm">
                            <div className="text-sm text-gray-600">
                                Página {currentPage} de {totalPages}
                            </div>
                            <div className="flex items-center gap-3">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`rounded-lg px-4 py-2 transition-all ${
                                            currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
