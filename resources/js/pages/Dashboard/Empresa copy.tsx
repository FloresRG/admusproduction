import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ChartBarIcon, EyeIcon, HeartIcon, PlayCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import Chart from 'chart.js/auto'; // Importamos Chart.js para gráficos
import { FC, useEffect, useRef } from 'react';

// Interfaces
interface TikTokVideoProps {
    title: string;
    views: number;
    likes: number;
    thumbnailUrl: string;
    videoId: string;
    embedHtml: string; // Added for embedding
    description: string; // Added for more context
}

interface MonthlyStats {
    month: string;
    videos: number;
    totalViews: number;
    totalLikes: number;
}

// --- Componente Auxiliar para Inyectar Estilos Globales de Animación ---
// Esto es para resolver el error de "Invalid hook call" si no puedes usar tailwind.config.js
// No es la práctica recomendada a largo plazo para Tailwind, pero funciona.
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
        `; // Todas tus definiciones de @keyframes

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = keyframes;
        document.head.appendChild(styleSheet);

        // Limpiar los estilos cuando el componente se desmonte (buena práctica)
        return () => {
            if (document.head.contains(styleSheet)) {
                document.head.removeChild(styleSheet);
            }
        };
    }, []); // Array de dependencias vacío para que se ejecute solo una vez al montar

    return null; // Este componente no renderiza nada visualmente
};
// --- Fin del Componente Auxiliar ---

// Constantes
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

// Datos de videos específicos para Importadora Miranda
const TIKTOK_VIDEOS: TikTokVideoProps[] = [
    {
        title: '¡El iPhone Mini que buscabas! Compacto y potente 🚀',
        views: 75240,
        likes: 12890,
        thumbnailUrl: 'https://placehold.co/400x600/FF69B4/FFFFFF?text=iPhone+Mini',
        videoId: '7442827702920351032',
        description: 'Descubre la magia del tamaño perfecto. Ideal para tus manos, ¡pero con el poder de un grande!',
        embedHtml: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@importadoramiranda777/video/7442827702920351032" data-video-id="7442827702920351032" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@importadoramiranda777" href="https://www.tiktok.com/@importadoramiranda777?refer=embed">@importadoramiranda777</a> IphoneMini <a title="importadoramiranda777" target="_blank" href="https://www.tiktok.com/tag/importadoramiranda777?refer=embed">#importadoramiranda777</a> <a title="iphone" target="_blank" href="https://www.tiktok.com/tag/iphone?refer=embed">#iphone</a> <a title="apple" target="_blank" href="https://www.tiktok.com/tag/apple?refer=embed">#apple</a> <a title="iphone16pro" target="_blank" href="https://www.tiktok.com/tag/iphone16pro?refer=embed">#iphone16pro</a> <a title="minicelular" target="_blank" href="https://www.tiktok.com/tag/minicelular?refer=embed">#minicelular</a> <a title="celularmini" target="_blank" href="https://www.tiktok.com/tag/celularmini?refer=embed">#celularmini</a> <a title="celularconteclas" target="_blank" href="https://www.tiktok.com/tag/celularconteclas?refer=embed">#celularconteclas</a> <a title="remate" target="_blank" href="https://www.tiktok.com/tag/remate?refer=embed">#remate</a> <a title="liquidacionmiranda" target="_blank" href="https://www.tiktok.com/tag/liquidacionmiranda?refer=embed">#liquidacionmiranda</a> <a title="lapaz" target="_blank" href="https://www.tiktok.com/tag/lapaz?refer=embed">#lapaz</a> <a title="cochabamba" target="_blank" href="https://www.tiktok.com/tag/cochabamba?refer=embed">#cochabamba</a> <a title="tarija" target="_blank" href="https://www.tiktok.com/tag/tarija?refer=embed">#tarija</a> <a title="santacruzdelasierra🇳🇬" target="_blank" href="https://www.tiktok.com/tag/santacruzdelasierra%F0%9F%87%B3%F0%9F%87%AC?refer=embed">#santacruzdelasierra🇳🇬</a> <a title="beni" target="_blank" href="https://www.tiktok.com/tag/beni?refer=embed">#beni</a> <a title="pando" target="_blank" href="https://www.tiktok.com/tag/pando?refer=embed">#pando</a> <a title="oruro" target="_blank" href="https://www.tiktok.com/tag/oruro?refer=embed">#oruro</a> <a title="sucre" target="_blank" href="https://www.tiktok.com/tag/sucre?refer=embed">#sucre</a> <a title="enviosatodobolovia🇧🇴" target="_blank" href="https://www.tiktok.com/tag/enviosatodobolovia%F0%9F%87%A7%F0%9F%87%B4?refer=embed">#enviosatodobolovia🇧🇴</a> <a target="_blank" title="♬ APT. - ROSÉ &#38; Bruno Mars" href="https://www.tiktok.com/music/APT-7424743471180040193?refer=embed">♬ APT. - ROSÉ &#38; Bruno Mars</a> </section> </td>`,
    },
    {
        title: '¡El iPhone Mini que buscabas! Compacto y potente 🚀',
        views: 75240,
        likes: 12890,
        thumbnailUrl: 'https://placehold.co/400x600/FF69B4/FFFFFF?text=iPhone+Mini',
        videoId: '7442827702920351032',
        description: 'Descubre la magia del tamaño perfecto. Ideal para tus manos, ¡pero con el poder de un grande!',
        embedHtml: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@importadoramiranda777/video/7442827702920351032" data-video-id="7442827702920351032" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@importadoramiranda777" href="https://www.tiktok.com/@importadoramiranda777?refer=embed">@importadoramiranda777</a> IphoneMini <a title="importadoramiranda777" target="_blank" href="https://www.tiktok.com/tag/importadoramiranda777?refer=embed">#importadoramiranda777</a> <a title="iphone" target="_blank" href="https://www.tiktok.com/tag/iphone?refer=embed">#iphone</a> <a title="apple" target="_blank" href="https://www.tiktok.com/tag/apple?refer=embed">#apple</a> <a title="iphone16pro" target="_blank" href="https://www.tiktok.com/tag/iphone16pro?refer=embed">#iphone16pro</a> <a title="minicelular" target="_blank" href="https://www.tiktok.com/tag/minicelular?refer=embed">#minicelular</a> <a title="celularmini" target="_blank" href="https://www.tiktok.com/tag/celularmini?refer=embed">#celularmini</a> <a title="celularconteclas" target="_blank" href="https://www.tiktok.com/tag/celularconteclas?refer=embed">#celularconteclas</a> <a title="remate" target="_blank" href="https://www.tiktok.com/tag/remate?refer=embed">#remate</a> <a title="liquidacionmiranda" target="_blank" href="https://www.tiktok.com/tag/liquidacionmiranda?refer=embed">#liquidacionmiranda</a> <a title="lapaz" target="_blank" href="https://www.tiktok.com/tag/lapaz?refer=embed">#lapaz</a> <a title="cochabamba" target="_blank" href="https://www.tiktok.com/tag/cochabamba?refer=embed">#cochabamba</a> <a title="tarija" target="_blank" href="https://www.tiktok.com/tag/tarija?refer=embed">#tarija</a> <a title="santacruzdelasierra🇳🇬" target="_blank" href="https://www.tiktok.com/tag/santacruzdelasierra%F0%9F%87%B3%F0%9F%87%AC?refer=embed">#santacruzdelasierra🇳🇬</a> <a title="beni" target="_blank" href="https://www.tiktok.com/tag/beni?refer=embed">#beni</a> <a title="pando" target="_blank" href="https://www.tiktok.com/tag/pando?refer=embed">#pando</a> <a title="oruro" target="_blank" href="https://www.tiktok.com/tag/oruro?refer=embed">#oruro</a> <a title="sucre" target="_blank" href="https://www.tiktok.com/tag/sucre?refer=embed">#sucre</a> <a title="enviosatodobolovia🇧🇴" target="_blank" href="https://www.tiktok.com/tag/enviosatodobolovia%F0%9F%87%A7%F0%9F%87%B4?refer=embed">#enviosatodobolovia🇧🇴</a> <a target="_blank" title="♬ APT. - ROSÉ &#38; Bruno Mars" href="https://www.tiktok.com/music/APT-7424743471180040193?refer=embed">♬ APT. - ROSÉ &#38; Bruno Mars</a> </section> </td>`,
    },
    {
        title: '¡El iPhone Mini que buscabas! Compacto y potente 🚀',
        views: 75240,
        likes: 12890,
        thumbnailUrl: 'https://placehold.co/400x600/FF69B4/FFFFFF?text=iPhone+Mini',
        videoId: '7442827702920351032',
        description: 'Descubre la magia del tamaño perfecto. Ideal para tus manos, ¡pero con el poder de un grande!',
        embedHtml: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@importadoramiranda777/video/7442827702920351032" data-video-id="7442827702920351032" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@importadoramiranda777" href="https://www.tiktok.com/@importadoramiranda777?refer=embed">@importadoramiranda777</a> IphoneMini <a title="importadoramiranda777" target="_blank" href="https://www.tiktok.com/tag/importadoramiranda777?refer=embed">#importadoramiranda777</a> <a title="iphone" target="_blank" href="https://www.tiktok.com/tag/iphone?refer=embed">#iphone</a> <a title="apple" target="_blank" href="https://www.tiktok.com/tag/apple?refer=embed">#apple</a> <a title="iphone16pro" target="_blank" href="https://www.tiktok.com/tag/iphone16pro?refer=embed">#iphone16pro</a> <a title="minicelular" target="_blank" href="https://www.tiktok.com/tag/minicelular?refer=embed">#minicelular</a> <a title="celularmini" target="_blank" href="https://www.tiktok.com/tag/celularmini?refer=embed">#celularmini</a> <a title="celularconteclas" target="_blank" href="https://www.tiktok.com/tag/celularconteclas?refer=embed">#celularconteclas</a> <a title="remate" target="_blank" href="https://www.tiktok.com/tag/remate?refer=embed">#remate</a> <a title="liquidacionmiranda" target="_blank" href="https://www.tiktok.com/tag/liquidacionmiranda?refer=embed">#liquidacionmiranda</a> <a title="lapaz" target="_blank" href="https://www.tiktok.com/tag/lapaz?refer=embed">#lapaz</a> <a title="cochabamba" target="_blank" href="https://www.tiktok.com/tag/cochabamba?refer=embed">#cochabamba</a> <a title="tarija" target="_blank" href="https://www.tiktok.com/tag/tarija?refer=embed">#tarija</a> <a title="santacruzdelasierra🇳🇬" target="_blank" href="https://www.tiktok.com/tag/santacruzdelasierra%F0%9F%87%B3%F0%9F%87%AC?refer=embed">#santacruzdelasierra🇳🇬</a> <a title="beni" target="_blank" href="https://www.tiktok.com/tag/beni?refer=embed">#beni</a> <a title="pando" target="_blank" href="https://www.tiktok.com/tag/pando?refer=embed">#pando</a> <a title="oruro" target="_blank" href="https://www.tiktok.com/tag/oruro?refer=embed">#oruro</a> <a title="sucre" target="_blank" href="https://www.tiktok.com/tag/sucre?refer=embed">#sucre</a> <a title="enviosatodobolovia🇧🇴" target="_blank" href="https://www.tiktok.com/tag/enviosatodobolovia%F0%9F%87%A7%F0%9F%87%B4?refer=embed">#enviosatodobolovia🇧🇴</a> <a target="_blank" title="♬ APT. - ROSÉ &#38; Bruno Mars" href="https://www.tiktok.com/music/APT-7424743471180040193?refer=embed">♬ APT. - ROSÉ &#38; Bruno Mars</a> </section> </td>`,
    },
    {
        title: '¡El iPhone Mini que buscabas! Compacto y potente 🚀',
        views: 75240,
        likes: 12890,
        thumbnailUrl: 'https://placehold.co/400x600/FF69B4/FFFFFF?text=iPhone+Mini',
        videoId: '7442827702920351032',
        description: 'Descubre la magia del tamaño perfecto. Ideal para tus manos, ¡pero con el poder de un grande!',
        embedHtml: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@importadoramiranda777/video/7442827702920351032" data-video-id="7442827702920351032" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@importadoramiranda777" href="https://www.tiktok.com/@importadoramiranda777?refer=embed">@importadoramiranda777</a> IphoneMini <a title="importadoramiranda777" target="_blank" href="https://www.tiktok.com/tag/importadoramiranda777?refer=embed">#importadoramiranda777</a> <a title="iphone" target="_blank" href="https://www.tiktok.com/tag/iphone?refer=embed">#iphone</a> <a title="apple" target="_blank" href="https://www.tiktok.com/tag/apple?refer=embed">#apple</a> <a title="iphone16pro" target="_blank" href="https://www.tiktok.com/tag/iphone16pro?refer=embed">#iphone16pro</a> <a title="minicelular" target="_blank" href="https://www.tiktok.com/tag/minicelular?refer=embed">#minicelular</a> <a title="celularmini" target="_blank" href="https://www.tiktok.com/tag/celularmini?refer=embed">#celularmini</a> <a title="celularconteclas" target="_blank" href="https://www.tiktok.com/tag/celularconteclas?refer=embed">#celularconteclas</a> <a title="remate" target="_blank" href="https://www.tiktok.com/tag/remate?refer=embed">#remate</a> <a title="liquidacionmiranda" target="_blank" href="https://www.tiktok.com/tag/liquidacionmiranda?refer=embed">#liquidacionmiranda</a> <a title="lapaz" target="_blank" href="https://www.tiktok.com/tag/lapaz?refer=embed">#lapaz</a> <a title="cochabamba" target="_blank" href="https://www.tiktok.com/tag/cochabamba?refer=embed">#cochabamba</a> <a title="tarija" target="_blank" href="https://www.tiktok.com/tag/tarija?refer=embed">#tarija</a> <a title="santacruzdelasierra🇳🇬" target="_blank" href="https://www.tiktok.com/tag/santacruzdelasierra%F0%9F%87%B3%F0%9F%87%AC?refer=embed">#santacruzdelasierra🇳🇬</a> <a title="beni" target="_blank" href="https://www.tiktok.com/tag/beni?refer=embed">#beni</a> <a title="pando" target="_blank" href="https://www.tiktok.com/tag/pando?refer=embed">#pando</a> <a title="oruro" target="_blank" href="https://www.tiktok.com/tag/oruro?refer=embed">#oruro</a> <a title="sucre" target="_blank" href="https://www.tiktok.com/tag/sucre?refer=embed">#sucre</a> <a title="enviosatodobolovia🇧🇴" target="_blank" href="https://www.tiktok.com/tag/enviosatodobolovia%F0%9F%87%A7%F0%9F%87%B4?refer=embed">#enviosatodobolovia🇧🇴</a> <a target="_blank" title="♬ APT. - ROSÉ &#38; Bruno Mars" href="https://www.tiktok.com/music/APT-7424743471180040193?refer=embed">♬ APT. - ROSÉ &#38; Bruno Mars</a> </section> </td>`,
    },
    {
        title: '¡El iPhone Mini que buscabas! Compacto y potente 🚀',
        views: 75240,
        likes: 12890,
        thumbnailUrl: 'https://placehold.co/400x600/FF69B4/FFFFFF?text=iPhone+Mini',
        videoId: '7442827702920351032',
        description: 'Descubre la magia del tamaño perfecto. Ideal para tus manos, ¡pero con el poder de un grande!',
        embedHtml: `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@importadoramiranda777/video/7442827702920351032" data-video-id="7442827702920351032" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@importadoramiranda777" href="https://www.tiktok.com/@importadoramiranda777?refer=embed">@importadoramiranda777</a> IphoneMini <a title="importadoramiranda777" target="_blank" href="https://www.tiktok.com/tag/importadoramiranda777?refer=embed">#importadoramiranda777</a> <a title="iphone" target="_blank" href="https://www.tiktok.com/tag/iphone?refer=embed">#iphone</a> <a title="apple" target="_blank" href="https://www.tiktok.com/tag/apple?refer=embed">#apple</a> <a title="iphone16pro" target="_blank" href="https://www.tiktok.com/tag/iphone16pro?refer=embed">#iphone16pro</a> <a title="minicelular" target="_blank" href="https://www.tiktok.com/tag/minicelular?refer=embed">#minicelular</a> <a title="celularmini" target="_blank" href="https://www.tiktok.com/tag/celularmini?refer=embed">#celularmini</a> <a title="celularconteclas" target="_blank" href="https://www.tiktok.com/tag/celularconteclas?refer=embed">#celularconteclas</a> <a title="remate" target="_blank" href="https://www.tiktok.com/tag/remate?refer=embed">#remate</a> <a title="liquidacionmiranda" target="_blank" href="https://www.tiktok.com/tag/liquidacionmiranda?refer=embed">#liquidacionmiranda</a> <a title="lapaz" target="_blank" href="https://www.tiktok.com/tag/lapaz?refer=embed">#lapaz</a> <a title="cochabamba" target="_blank" href="https://www.tiktok.com/tag/cochabamba?refer=embed">#cochabamba</a> <a title="tarija" target="_blank" href="https://www.tiktok.com/tag/tarija?refer=embed">#tarija</a> <a title="santacruzdelasierra🇳🇬" target="_blank" href="https://www.tiktok.com/tag/santacruzdelasierra%F0%9F%87%B3%F0%9F%87%AC?refer=embed">#santacruzdelasierra🇳🇬</a> <a title="beni" target="_blank" href="https://www.tiktok.com/tag/beni?refer=embed">#beni</a> <a title="pando" target="_blank" href="https://www.tiktok.com/tag/pando?refer=embed">#pando</a> <a title="oruro" target="_blank" href="https://www.tiktok.com/tag/oruro?refer=embed">#oruro</a> <a title="sucre" target="_blank" href="https://www.tiktok.com/tag/sucre?refer=embed">#sucre</a> <a title="enviosatodobolovia🇧🇴" target="_blank" href="https://www.tiktok.com/tag/enviosatodobolovia%F0%9F%87%A7%F0%9F%87%B4?refer=embed">#enviosatodobolovia🇧🇴</a> <a target="_blank" title="♬ APT. - ROSÉ &#38; Bruno Mars" href="https://www.tiktok.com/music/APT-7424743471180040193?refer=embed">♬ APT. - ROSÉ &#38; Bruno Mars</a> </section> </td>`,
    },
];

// Utilidades
const getRandomStats = () => ({
    videos: Math.floor(Math.random() * 20) + 5,
    totalViews: Math.floor(Math.random() * 200000) + 50000, // Más vistas para una importadora
    totalLikes: Math.floor(Math.random() * 80000) + 10000, // Más likes
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
            // Cargar el script de incrustación de TikTok dinámicamente
            const script = document.createElement('script');
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;
            embedRef.current.appendChild(script);
        }
    }, [embedHtml]);

    return (
        <div
            className="group relative transform cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            style={{ animation: 'fade-in-up 0.7s ease-out forwards' }}
        >
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl">
                <div className="flex aspect-[9/16] max-h-[400px] w-full items-center justify-center overflow-hidden bg-gray-200">
                    {/* Contenedor para el video incrustado de TikTok */}
                    <div ref={embedRef} className="flex h-full w-full items-center justify-center">
                        {/* El video de TikTok se incrustará aquí */}
                    </div>
                </div>
                <div className="bg-gradient-to-t from-gray-50 to-white p-4">
                    <h3 className="mb-1 line-clamp-2 text-lg font-bold text-gray-900">{title}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">{description}</p>
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                        <span
                            className="flex items-center text-purple-600"
                            style={{ animation: 'pulse-slight 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                        >
                            <EyeIcon className="mr-1 h-4 w-4 text-purple-500" />
                            {views.toLocaleString()} vistas
                        </span>
                        <span
                            className="flex items-center text-red-500"
                            style={{ animation: 'pulse-slight 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.1s' }}
                        >
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
                // Destruir la instancia anterior del gráfico si existe
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
                                borderColor: 'rgb(255, 105, 180)', // Hot pink
                                backgroundColor: 'rgba(255, 105, 180, 0.3)',
                                tension: 0.4, // Curva más suave
                                fill: true,
                                pointBackgroundColor: 'rgb(255, 105, 180)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(255, 105, 180)',
                            },
                            {
                                label: 'Vistas Totales',
                                data: monthlyStats.map((s) => s.totalViews),
                                borderColor: 'rgb(106, 90, 205)', // Slate Blue
                                backgroundColor: 'rgba(106, 90, 205, 0.3)',
                                tension: 0.4,
                                fill: true,
                                hidden: false, // Visible por defecto
                                pointBackgroundColor: 'rgb(106, 90, 205)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(106, 90, 205)',
                            },
                            {
                                label: 'Likes Totales',
                                data: monthlyStats.map((s) => s.totalLikes),
                                borderColor: 'rgb(255, 69, 0)', // Orange Red
                                backgroundColor: 'rgba(255, 69, 0, 0.3)',
                                tension: 0.4,
                                fill: true,
                                hidden: false, // Visible por defecto
                                pointBackgroundColor: 'rgb(255, 69, 0)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgb(255, 69, 0)',
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false, // Permite el control del tamaño con CSS
                        plugins: {
                            title: {
                                display: true,
                                text: 'Evolución Mensual del Contenido en TikTok',
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
                                bodyFont: {
                                    size: 14,
                                },
                                titleFont: {
                                    size: 16,
                                    weight: 'bold',
                                },
                                displayColors: true,
                            },
                            legend: {
                                display: true,
                                position: 'top', // Leyenda en la parte superior
                                labels: {
                                    font: {
                                        size: 14,
                                    },
                                    color: '#555',
                                    usePointStyle: true, // Usa el estilo de punto del dataset
                                },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: '#e0e0e0', // Color de las líneas de la cuadrícula
                                    drawBorder: false,
                                },
                                ticks: {
                                    callback: function (value) {
                                        if (typeof value === 'number') {
                                            return value.toLocaleString();
                                        }
                                        return value;
                                    },
                                    color: '#666',
                                },
                                title: {
                                    display: true,
                                    text: 'Cantidad',
                                    color: '#444',
                                },
                            },
                            x: {
                                grid: {
                                    display: false, // Ocultar líneas de cuadrícula verticales
                                },
                                ticks: {
                                    color: '#666',
                                },
                                title: {
                                    display: true,
                                    text: 'Mes',
                                    color: '#444',
                                },
                            },
                        },
                        animation: {
                            duration: 1800, // Animación más larga
                            easing: 'easeInOutQuart', // Animación más suave
                        },
                    },
                });
            }
        }
    }, [monthlyStats]);

    return (
        <div
            className="flex h-[400px] items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-lg"
            style={{ animation: 'slide-up 0.7s ease-out forwards' }}
        >
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

// Componente Dashboard principal
const Dashboard: FC = () => {
    const monthlyStats = generateMonthlyStats();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <GlobalAnimationStyles /> {/* <-- Aquí se llama el componente auxiliar para inyectar estilos */}
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
                {/* Hero Section */}
                <div
                    className="relative mb-10 flex transform items-center justify-around overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.005]"
                    style={{ animation: 'fade-in-down 0.7s ease-out forwards' }}
                >
                    <div className="relative z-10 max-w-lg text-center sm:text-left">
                        <h1
                            className="mb-4 text-4xl font-extrabold text-white drop-shadow-lg sm:text-5xl"
                            style={{ animation: 'pulse-slight 1s infinite' }}
                        >
                            ¡Bienvenido a Importadora Miranda! 🌸
                        </h1>
                        <p className="mb-6 text-lg text-pink-100 opacity-90" style={{ animation: 'bounce 1s 0.5s infinite' }}>
                            ¡Prepárate para una explosión de ofertas y los celulares más kawaii!
                        </p>
                        <button
                            className="group mx-auto flex transform items-center justify-center rounded-full bg-white px-10 py-3 font-bold text-purple-700 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-pink-100"
                            style={{ animation: 'float 3s ease-in-out infinite' }}
                        >
                            <SparklesIcon className="mr-2 h-5 w-5 text-yellow-500 group-hover:animate-spin" />
                            ¡Explorar Ahora!
                            <SparklesIcon className="ml-2 h-5 w-5 text-yellow-500 group-hover:animate-spin" />
                        </button>
                    </div>
                    <div className="w-1/2 max-w-md">
                        <img
                            src="https://importadoramiranda.com/images/logo.png"
                            alt="Anime Welcome"
                            className="rounded-lg shadow-2xl"
                            style={{ animation: 'zoom-in 0.5s ease-out forwards' }}
                        />
                    </div>
                </div>

                {/* Métricas Clave */}
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div
                        className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md"
                        style={{ animation: 'slide-in-left 0.7s ease-out forwards' }}
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Vistas</p>
                            <p className="mt-1 text-3xl font-bold text-indigo-700">
                                {monthlyStats.reduce((sum, stat) => sum + stat.totalViews, 0).toLocaleString()}
                            </p>
                        </div>
                        <EyeIcon className="h-10 w-10 text-indigo-400 opacity-60" />
                    </div>
                    <div
                        className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md"
                        style={{ animation: 'slide-in-left 0.7s ease-out forwards 0.1s' }}
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Likes</p>
                            <p className="mt-1 text-3xl font-bold text-red-600">
                                {monthlyStats.reduce((sum, stat) => sum + stat.totalLikes, 0).toLocaleString()}
                            </p>
                        </div>
                        <HeartIcon className="h-10 w-10 text-red-400 opacity-60" />
                    </div>
                    <div
                        className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md"
                        style={{ animation: 'slide-in-right 0.7s ease-out forwards 0.2s' }}
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-500">Videos Publicados</p>
                            <p className="mt-1 text-3xl font-bold text-green-700">{monthlyStats.reduce((sum, stat) => sum + stat.videos, 0)}</p>
                        </div>
                        <PlayCircleIcon className="h-10 w-10 text-green-400 opacity-60" />
                    </div>
                    <div
                        className="flex items-center justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-md"
                        style={{ animation: 'slide-in-right 0.7s ease-out forwards 0.3s' }}
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tasa de Engagement</p>
                            <p className="mt-1 text-3xl font-bold text-orange-600">
                                {(
                                    (monthlyStats.reduce((sum, stat) => sum + stat.totalLikes, 0) /
                                        monthlyStats.reduce((sum, stat) => sum + stat.totalViews, 0)) *
                                        100 || 0
                                ).toFixed(2)}
                                %
                            </p>
                        </div>
                        <ChartBarIcon className="h-10 w-10 text-orange-400 opacity-60" />
                    </div>
                </div>
                {/* TikTok Videos Grid */}
                <div className="space-y-6">
                    <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800" style={{ animation: 'fade-in 0.6s ease-out forwards' }}>
                        📱 Últimos Videos de Productos y Ofertas
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {TIKTOK_VIDEOS.map((video) => (
                            <TikTokCard key={video.videoId} {...video} />
                        ))}
                    </div>
                </div>

                {/* Sección de Rendimiento Mensual */}
                <div className="mb-10">
                    <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-800" style={{ animation: 'fade-in 0.6s ease-out forwards' }}>
                        📊 Rendimiento Detallado de Contenido
                    </h2>
                    <PerformanceChart monthlyStats={monthlyStats} />
                </div>

                {/* Sección de Llamada a la Acción (Opcional) */}
                <div
                    className="mt-12 rounded-2xl bg-blue-700 p-8 text-center text-white shadow-xl"
                    style={{ animation: 'fade-in-up 0.7s ease-out forwards 0.4s' }}
                >
                    <h3 className="mb-4 text-3xl font-bold">¿Listo para impulsar tus ventas con TikTok?</h3>
                    <p className="mb-6 text-lg text-blue-100">Analiza, publica y domina la plataforma con las mejores herramientas.</p>
                    <button className="rounded-full bg-white px-8 py-3 font-semibold text-blue-700 shadow-md transition-colors duration-300 hover:bg-gray-100">
                        Explorar Herramientas Avanzadas
                    </button>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
