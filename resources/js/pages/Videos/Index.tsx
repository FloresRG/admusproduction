import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/inertia';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Company {
    id: number;
    name: string;
    logo?: string;
}

interface LinkData {
    id: number;
    link: string;
    detalle?: string;
}

interface Video {
    id: number;
    company_id: number;
    link_id: number;
    mes: string;
    fecha: string;
    company: Company;
    link: LinkData;
}

interface VideosPageProps extends PageProps {
    videos: {
        data: Video[];
        links: any;
        current_page: number;
        last_page: number;
    };
    companies: Company[];
    months: string[];
    filters: {
        search: string;
        company: string;
        month: string;
        fecha_desde?: string;
        fecha_hasta?: string;
    };
    empresaNombre?: string;
}

export default function VideosIndex({ videos, companies, months, filters, empresaNombre }: VideosPageProps) {
    const [search, setSearch] = useState(filters.search);
    const [selectedCompany, setSelectedCompany] = useState(filters.company);
    const [selectedMonth, setSelectedMonth] = useState(filters.month);
    const [fechaDesde, setFechaDesde] = useState(filters.fecha_desde || '');
    const [fechaHasta, setFechaHasta] = useState(filters.fecha_hasta || '');

    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const handleSearch = () => {
        router.get(
            '/videos',
            {
                search,
                company: selectedCompany,
                month: selectedMonth,
                fecha_desde: fechaDesde,
                fecha_hasta: fechaHasta,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCompany('');
        setSelectedMonth('');
        setFechaDesde('');
        setFechaHasta('');
        router.get(
            '/videos',
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    const getTikTokEmbed = (url: string): string => {
        const match = url.match(/video\/(\d+)/);
        const videoId = match ? match[1] : null;
        return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : url;
    };

    return (
        <AppLayout>
            <Head title="Videos de Empresas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-3xl font-bold text-gray-900">{empresaNombre ?? 'Videos de la Empresa'}</h1>

                                <div className="text-sm text-gray-500">Total: {videos.data.length} videos</div>
                            </div>

                            {/* Filtros */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Buscar</label>
                                        <input
                                            type="text"
                                            placeholder="Buscar titulo o detalle..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Mes</label>
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            <option value="">Todos los meses</option>
                                            {months.map((month) => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Desde</label>
                                        <input
                                            type="date"
                                            value={fechaDesde}
                                            onChange={(e) => setFechaDesde(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Hasta</label>
                                        <input
                                            type="date"
                                            value={fechaHasta}
                                            onChange={(e) => setFechaHasta(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex items-end space-x-2">
                                        <button
                                            onClick={handleSearch}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            Filtrar
                                        </button>
                                        <button
                                            onClick={clearFilters}
                                            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                                        >
                                            Limpiar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Grid de Videos */}
                            {videos.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {videos.data.map((video) => (
                                        <div
                                            key={video.id}
                                            className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                                        >
                                            <div className="aspect-[9/16] w-full overflow-hidden">
                                                <iframe
                                                    src={getTikTokEmbed(video.link.link)}
                                                    width="100%"
                                                    height="100%"
                                                    allowFullScreen
                                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                                    className="h-full w-full border-none"
                                                ></iframe>
                                            </div>

                                            <div className="p-4">
                                                <div className="mb-2 flex items-center">
                                                    {video.company.logo && (
                                                        <img
                                                            src={video.company.logo}
                                                            alt={video.company.name}
                                                            className="mr-2 h-8 w-8 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <span className="text-sm font-semibold text-gray-900">{video.company.name}</span>
                                                </div>

                                                {video.link.detalle && (
                                                    <p className="mb-2 line-clamp-2 text-sm text-gray-600">{video.link.detalle}</p>
                                                )}

                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>{video.mes}</span>
                                                    <span>{formatDate(video.fecha)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay videos</h3>
                                    <p className="mt-1 text-sm text-gray-500">No se encontraron videos con los filtros aplicados.</p>
                                </div>
                            )}

                            {/* Paginación */}
                            {videos.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {videos.links.map((link: any, index: number) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-md px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                          ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                          : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
