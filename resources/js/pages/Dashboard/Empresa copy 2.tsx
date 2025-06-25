import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { BuildingOfficeIcon, ChartBarIcon, EyeIcon, HeartIcon, PlayCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import Chart from 'chart.js/auto';
import { FC, useEffect, useRef } from 'react';

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

interface EmpresaDashboardProps {
    user: User;
    company: Company;
}

interface TikTokVideoProps {
    title: string;
    views: number;
    likes: number;
    thumbnailUrl: string;
    videoId: string;
    embedHtml: string;
    description: string;
}

interface MonthlyStats {
    month: string;
    videos: number;
    totalViews: number;
    totalLikes: number;
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

// Datos de videos específicos (ejemplo - estos deberían venir del backend en el futuro)
const TIKTOK_VIDEOS: TikTokVideoProps[] = [
    {
        title: '¡Nuestros mejores productos! 🚀',
        views: 45240,
        likes: 8890,
        thumbnailUrl: 'https://placehold.co/400x600/3B82F6/FFFFFF?text=Producto+1',
        videoId: '1',
        description: 'Descubre nuestra línea de productos más vendidos',
        embedHtml: `<div class="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg h-full flex items-center justify-center text-white font-bold">Video Promocional</div>`,
    },
    {
        title: 'Ofertas especiales de temporada 💫',
        views: 32150,
        likes: 6420,
        thumbnailUrl: 'https://placehold.co/400x600/EF4444/FFFFFF?text=Oferta+Especial',
        videoId: '2',
        description: 'No te pierdas nuestras ofertas limitadas',
        embedHtml: `<div class="bg-gradient-to-br from-red-400 to-pink-500 rounded-lg h-full flex items-center justify-center text-white font-bold">Ofertas</div>`,
    },
];

// Utilidades
const getRandomStats = () => ({
    videos: Math.floor(Math.random() * 20) + 5,
    totalViews: Math.floor(Math.random() * 200000) + 50000,
    totalLikes: Math.floor(Math.random() * 80000) + 10000,
});

const generateMonthlyStats = (): MonthlyStats[] => {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const stats = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        stats.push({
            month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
            ...getRandomStats(),
        });
    }
    return stats;
};

// Componente TikTokCard
const TikTokCard: FC<TikTokVideoProps> = ({ title, views, likes, embedHtml, description }) => {
    const embedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (embedRef.current) {
            embedRef.current.innerHTML = embedHtml;
        }
    }, [embedHtml]);

    return (
        <div
            className="group relative transform cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            style={{ animation: 'fade-in-up 0.7s ease-out forwards' }}
        >
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl">
                <div className="flex aspect-[9/16] max-h-[400px] w-full items-center justify-center overflow-hidden bg-gray-200">
                    <div ref={embedRef} className="flex h-full w-full items-center justify-center"></div>
                </div>
                <div className="bg-gradient-to-t from-gray-50 to-white p-4">
                    <h3 className="mb-1 line-clamp-2 text-lg font-bold text-gray-900">{title}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">{description}</p>
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
                </div>
            </div>
        </div>
    );
};

// Componente para el Gráfico de Rendimiento
interface PerformanceChartProps {
    monthlyStats: MonthlyStats[];
}

const PerformanceChart: FC<PerformanceChartProps> = ({ monthlyStats }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: monthlyStats.map((s) => s.month),
                        datasets: [
                            {
                                label: 'Videos Publicados',
                                data: monthlyStats.map((s) => s.videos),
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: 'rgb(59, 130, 246)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(59, 130, 246)',
                            },
                            {
                                label: 'Vistas Totales',
                                data: monthlyStats.map((s) => s.totalViews),
                                borderColor: 'rgb(16, 185, 129)',
                                backgroundColor: 'rgba(16, 185, 129, 0.3)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: 'rgb(16, 185, 129)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(16, 185, 129)',
                            },
                            {
                                label: 'Likes Totales',
                                data: monthlyStats.map((s) => s.totalLikes),
                                borderColor: 'rgb(239, 68, 68)',
                                backgroundColor: 'rgba(239, 68, 68, 0.3)',
                                tension: 0.4,
                                fill: true,
                                pointBackgroundColor: 'rgb(239, 68, 68)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(239, 68, 68)',
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Evolución Mensual del Contenido',
                                font: {
                                    size: 20,
                                    weight: 'bold',
                                },
                                color: '#333',
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                                padding: 12,
                                boxPadding: 8,
                            },
                            legend: {
                                display: true,
                                position: 'top',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: '#e0e0e0',
                                    drawBorder: false,
                                },
                                ticks: {
                                    callback: function (value) {
                                        if (typeof value === 'number') {
                                            return value.toLocaleString();
                                        }
                                        return value;
                                    },
                                },
                            },
                            x: {
                                grid: {
                                    display: false,
                                },
                            },
                        },
                        animation: {
                            duration: 1800,
                            easing: 'easeInOutQuart',
                        },
                    },
                });
            }
        }
    }, [monthlyStats]);

    return (
        <div className="flex h-[400px] items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

// Componente Dashboard principal
const EmpresaDashboard: FC<EmpresaDashboardProps> = ({ user, company }) => {
    const monthlyStats = generateMonthlyStats();

    // Función para obtener la URL del logo
    const getLogoUrl = (logoPath: string | null) => {
        if (!logoPath) return null;
        // Si ya es una URL completa, devolverla tal como está
        if (logoPath.startsWith('http')) return logoPath;
        // Si es un path relativo, construir la URL completa apuntando a /logos/
        return `/${logoPath}`;
    };

    const logoUrl = getLogoUrl(company.logo);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <GlobalAnimationStyles />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                {/* Hero Section con información de la empresa */}
                <div
                    className="relative mb-10 flex transform items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.005]"
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
                            <h1
                                className="mb-2 text-4xl font-extrabold drop-shadow-lg sm:text-5xl"
                                style={{ animation: 'slide-in-left 0.7s ease-out forwards' }}
                            >
                                {company.name}
                            </h1>
                            <div className="space-y-1 text-lg text-blue-100">
                                {company.direccion && <p className="flex items-center opacity-90">📍 {company.direccion}</p>}
                                {company.celular && <p className="flex items-center opacity-90">📞 {company.celular}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Botón de acción */}
                    <div className="hidden md:block">
                        <button
                            className="group flex transform items-center justify-center rounded-full bg-white px-8 py-3 font-bold text-blue-700 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-blue-50"
                            style={{ animation: 'float 3s ease-in-out infinite' }}
                        >
                            <SparklesIcon className="mr-2 h-5 w-5 text-yellow-500 group-hover:animate-spin" />
                            Ver Estadísticas
                        </button>
                    </div>
                </div>

                {/* Métricas Clave */}
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Vistas</p>
                            <p className="mt-1 text-3xl font-bold text-blue-700">
                                {monthlyStats.reduce((sum, stat) => sum + stat.totalViews, 0).toLocaleString()}
                            </p>
                        </div>
                        <EyeIcon className="h-10 w-10 text-blue-400 opacity-60" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Likes</p>
                            <p className="mt-1 text-3xl font-bold text-red-600">
                                {monthlyStats.reduce((sum, stat) => sum + stat.totalLikes, 0).toLocaleString()}
                            </p>
                        </div>
                        <HeartIcon className="h-10 w-10 text-red-400 opacity-60" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Videos</p>
                            <p className="mt-1 text-3xl font-bold text-indigo-600">
                                {monthlyStats.reduce((sum, stat) => sum + stat.videos, 0).toLocaleString()}
                            </p>
                        </div>
                        <PlayCircleIcon className="h-10 w-10 text-indigo-400 opacity-60" />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Mes con más vistas</p>
                            <p className="mt-1 text-2xl font-bold text-blue-700">
                                {monthlyStats.reduce((max, stat) => (stat.totalViews > max.totalViews ? stat : max), monthlyStats[0]).month}
                            </p>
                        </div>
                        <ChartBarIcon className="h-10 w-10 text-blue-400 opacity-60" />
                    </div>
                </div>

                {/* Gráfico de rendimiento */}
                <div className="mb-12">
                    <PerformanceChart monthlyStats={monthlyStats} />
                </div>

                {/* Videos destacados */}
                <div>
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Videos Destacados</h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                        {TIKTOK_VIDEOS.map((video) => (
                            <TikTokCard key={video.videoId} {...video} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default EmpresaDashboard;
