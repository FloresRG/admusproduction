import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@inertiajs/inertia';


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

interface Comprobante {
    id: number;
    nombre: string;
}

interface Video {
    id: number;
    company_id: number;
    link_id: number;
    comprobante_id: number;
    mes: string;
    fecha: string;
    company: Company;
    link: LinkData;
    comprobante: Comprobante;
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
    };
}

const getVideoEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('/')[0];
        return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
};

const getVideoThumbnail = (url: string): string => {
    // YouTube thumbnail
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    
    return '/images/video-placeholder.jpg';
};

export default function VideosIndex({ videos, companies, months, filters }: VideosPageProps) {
    const [search, setSearch] = useState(filters.search);
    const [selectedCompany, setSelectedCompany] = useState(filters.company);
    const [selectedMonth, setSelectedMonth] = useState(filters.month);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    const handleSearch = () => {
        router.get('/videos', {
            search,
            company: selectedCompany,
            month: selectedMonth,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCompany('');
        setSelectedMonth('');
        router.get('/videos', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppLayout>
            <Head title="Videos de Empresas" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Videos de Empresas
                                </h1>
                                <div className="text-sm text-gray-500">
                                    Total: {videos.data.length} videos
                                </div>
                            </div>

                            {/* Filtros */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Buscar
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Buscar empresa o detalle..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Empresa
                                        </label>
                                        <select
                                            value={selectedCompany}
                                            onChange={(e) => setSelectedCompany(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Todas las empresas</option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mes
                                        </label>
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Todos los meses</option>
                                            {months.map((month) => (
                                                <option key={month} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="flex items-end space-x-2">
                                        <button
                                            onClick={handleSearch}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            Filtrar
                                        </button>
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Limpiar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Grid de Videos */}
                            {videos.data.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {videos.data.map((video) => (
                                        <div
                                            key={video.id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                            onClick={() => setSelectedVideo(video)}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={getVideoThumbnail(video.link.link)}
                                                    alt={video.link.detalle || 'Video'}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className="p-4">
                                                <div className="flex items-center mb-2">
                                                    {video.company.logo && (
                                                        <img
                                                            src={video.company.logo}
                                                            alt={video.company.name}
                                                            className="w-8 h-8 rounded-full object-cover mr-2"
                                                        />
                                                    )}
                                                    <span className="font-semibold text-gray-900 text-sm">
                                                        {video.company.name}
                                                    </span>
                                                </div>
                                                
                                                {video.link.detalle && (
                                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                        {video.link.detalle}
                                                    </p>
                                                )}
                                                
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span>{video.mes}</span>
                                                    <span>{formatDate(video.fecha)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay videos</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        No se encontraron videos con los filtros aplicados.
                                    </p>
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
                                                className={`px-3 py-2 text-sm rounded-md ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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