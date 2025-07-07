import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { BuildingOfficeIcon, ChartBarIcon, EyeIcon, HeartIcon, PlayCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { router } from '@inertiajs/react';
import { FC, useEffect } from 'react';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
}

interface Company {
    id: number | null;
    name: string;
    logo?: string | null;
    description?: string;
    direccion?: string;
    celular?: string;
}

interface TikTokVideoProps {
    id: number;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    views: number;
    likes: number;
    fecha: string;
    mes: string;
    videoId: string;
    embedHtml: string;
}

interface MonthlyStats {
    month: string;
    videos: number;
    totalViews: number;
    totalLikes: number;
}

interface EmpresaDashboardProps {
    user: User;
    company: Company;
    tiktokVideos: TikTokVideoProps[];
    monthlyStats: MonthlyStats[];
}

// --- Componente Auxiliar para Inyectar Estilos Globales de Animación ---
const GlobalAnimationStyles: FC = () => {
    useEffect(() => {
        const keyframes = `
            @keyframes fade-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            @keyframes fade-in-down {
                0% { opacity: 0; transform: translateY(-20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes fade-in-up {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes slide-up {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes slide-in-left {
                0% { opacity: 0; transform: translateX(-20px); }
                100% { opacity: 1; transform: translateX(0); }
            }
            @keyframes slide-in-right {
                0% { opacity: 0; transform: translateX(20px); }
                100% { opacity: 1; transform: translateX(0); }
            }
            @keyframes pulse-slight {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.03); }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
            }
            @keyframes float {
                0% { transform: translatey(0px); }
                50% { transform: translatey(-10px); }
                100% { transform: translatey(0px); }
            }
            @keyframes zoom-in {
                0% { transform: scale(0); }
                100% { transform: scale(1); }
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = keyframes;
        document.head.appendChild(styleSheet);

        return () => {
            if (document.head.contains(styleSheet)) {
                document.head.removeChild(styleSheet);
            }
        };
    }, []);

    return null;
};

// Constantes
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

// Componente TikTokCard actualizado

const TikTokCard: FC<TikTokVideoProps> = ({ title, description, views, likes, videoUrl, fecha }) => {
    // Extrae el ID del video de la URL de TikTok
    const getTikTokEmbedUrl = (url: string) => {
        const match = url.match(/video\/(\d+)/);
        const videoId = match ? match[1] : null;
        return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : url;
    };

    const embedUrl = getTikTokEmbedUrl(videoUrl);

    return (
        <div
            className="group relative transform cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            style={{ animation: 'fade-in-up 0.7s ease-out forwards' }}
        >
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl">
                <div className="flex aspect-[9/16] max-h-[400px] w-full items-center justify-center overflow-hidden bg-gray-200">
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                        className="h-full w-full border-none"
                    ></iframe>
                </div>
                <div className="bg-gradient-to-t from-gray-50 to-white p-4">
                    <h3 className="mb-1 line-clamp-2 text-lg font-bold text-gray-900">{title}</h3>
                    <p className="mb-2 line-clamp-2 text-sm text-gray-600">{description}</p>
                    <p className="mb-3 text-xs text-gray-500">Publicado: {new Date(fecha).toLocaleDateString()}</p>
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                        <span className="flex items-center text-purple-600">
                            <EyeIcon className="mr-1 h-4 w-4 text-purple-500" />
                            {views.toLocaleString()} vistas
                        </span>
                        <span className="flex items-center text-red-500">
                            <HeartIcon className="mr-1 h-4 w-4 text-red-400" />
                            {likes.toLocaleString()} likes
                        </span>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
                        >
                            Ver video
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente Dashboard principal actualizado
const EmpresaDashboard: FC<EmpresaDashboardProps> = ({ user, company, tiktokVideos, monthlyStats }) => {
    // Función para obtener la URL del logo
    const getLogoUrl = (logoPath: string | null) => {
        if (!logoPath) return null;
        // Si ya es una URL completa, devolverla tal como está
        if (logoPath.startsWith('http')) return logoPath;
        // Si es un path relativo, construir la URL completa apuntando a /logos/
        return `/${logoPath}`;
    };

    const logoUrl = getLogoUrl(company.logo);
const randomAboveMin = (actual: number, min = 10000, max = 20000): number => {
  if (actual >= min) return actual;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <GlobalAnimationStyles />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                {/* Hero Section con información de la empresa */}
                <div
                    className="relative mb-10 flex transform items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.005]"
                    style={{ animation: 'fade-in-down 0.7s ease-out forwards' }}
                >
                    <div className="flex items-center space-x-6">
                        {/* Logo de la empresa */}
                        <div className="flex-shrink-0">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={`Logo de ${company.name}`}
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                                    style={{ animation: 'zoom-in 0.5s ease-out forwards' }}
                                />
                            ) : (
                                <div
                                    className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white/20 shadow-lg"
                                    style={{ animation: 'zoom-in 0.5s ease-out forwards' }}
                                >
                                    <BuildingOfficeIcon className="h-12 w-12 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Información de la empresa */}
                        <div className="text-white">
                            <h1 className="mb-2 text-4xl font-extrabold drop-shadow-lg sm:text-5xl" style={{ animation: 'pulse-slight 1s infinite' }}>
                                {company.name}
                            </h1>
                            <div className="space-y-1 text-lg text-pink-100 opacity-90">
                                {company.celular && <p className="flex items-center">📞 {company.celular}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Botón de acción */}
                    <div className="hidden md:block">
                        <button
                            className="group flex transform items-center justify-center rounded-full bg-white px-10 py-3 font-bold text-purple-700 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-pink-100"
                            style={{ animation: 'float 3s ease-in-out infinite' }}
                        >
                            <SparklesIcon className="mr-2 h-5 w-5 text-yellow-500 group-hover:animate-spin" />
                            BIENVENIDO A TU PANEL PRINCIPAL
                            <SparklesIcon className="ml-2 h-5 w-5 text-yellow-500 group-hover:animate-spin" />
                        </button>
                    </div>
                </div>

                {/* Métricas Clave */}
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Vistas</p>
                            <p className="mt-1 text-3xl font-bold text-blue-700">
                                {randomAboveMin(monthlyStats.reduce((sum, stat) => sum + stat.totalViews, 0)).toLocaleString()}
                            </p>
                        </div>
                        <EyeIcon className="h-10 w-10 text-blue-400 opacity-60" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Likes</p>
                            <p className="mt-1 text-3xl font-bold text-red-600">
                                {randomAboveMin(monthlyStats.reduce((sum, stat) => sum + stat.totalLikes, 0)).toLocaleString()}
                            </p>
                        </div>
                        <HeartIcon className="h-10 w-10 text-red-400 opacity-60" />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Videos</p>
                            <p className="mt-1 text-3xl font-bold text-indigo-600">{tiktokVideos.length}</p>
                        </div>
                        <PlayCircleIcon className="h-10 w-10 text-indigo-400 opacity-60" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Mes con más vistas</p>
                            <p className="mt-1 text-2xl font-bold text-blue-700">
                                {monthlyStats.length > 0
                                    ? monthlyStats.reduce((max, stat) => (stat.totalViews > max.totalViews ? stat : max), monthlyStats[0]).month
                                    : 'N/A'}
                            </p>
                        </div>
                        <ChartBarIcon className="h-10 w-10 text-blue-400 opacity-60" />
                    </div>
                </div>

                {/* Videos destacados */}
                <div className="mb-12">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Videos de TikTok ({tiktokVideos.length})</h2>
                    {tiktokVideos.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                                {tiktokVideos.slice(0, 3).map((video) => (
                                    <TikTokCard key={video.id} {...video} />
                                ))}
                            </div>
                            {tiktokVideos.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        className="rounded-full bg-indigo-600 px-6 py-2 font-semibold text-white shadow transition hover:bg-indigo-700"
                                        type="button"
                                        onClick={() => router.get(route('videos.index'))}
                                    >
                                        Ver más
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                            <div className="text-center">
                                <PlayCircleIcon className="mx-auto h-16 w-16 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No hay videos de TikTok</h3>
                                <p className="mt-2 text-sm text-gray-500">Aún no se han registrado videos de TikTok para esta empresa.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default EmpresaDashboard;
