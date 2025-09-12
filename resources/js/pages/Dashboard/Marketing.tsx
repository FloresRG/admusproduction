// MarketingDashboard.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowPathIcon, ChartBarIcon, CheckCircleIcon, ClipboardDocumentListIcon, LinkIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { PictureAsPdf } from '@mui/icons-material';
import { alpha, Button } from '@mui/material';
import { FC } from 'react';
import { FaTiktok } from 'react-icons/fa';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
}
interface Estadisticas {
    total: number;
    pendiente: number;
    en_revision: number;
    publicada: number;
}
interface Tarea {
    id: number;
    titulo: string;
    prioridad: string;
    fecha: string;
    descripcion: string;
    created_at: string;
}
interface TareaAsignada {
    id: number;
    tarea: Tarea;
    user: { id: number; name: string };
}
interface Influencer {
    id: number;
    user: { id: number; name: string };
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
}
interface Campania {
    id: number;
    company: { id: number; name: string };
    link: { id: number; link: string };
    comprobante: { id: number; detalle: string };
    fecha: string;
}
interface MarketingDashboardProps {
    user: User;
    estadisticas: Estadisticas;
    tareas: TareaAsignada[];
    influencers: Influencer[];
    campanias: Campania[];
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];
const handleGeneratePdf = async () => {
    try {
        // Se usa window.open para que el navegador maneje la descarga del PDF
        // Esto es más simple que manejar la respuesta binaria con fetch
        window.open('/generar-pdf-disponibilidad', '_blank');
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        // Opcional: mostrar un mensaje de error al usuario
        alert('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
};

const MarketingDashboard: FC<MarketingDashboardProps> = ({ user, estadisticas, tareas, influencers, campanias }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                {/* Bienvenida */}
                <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
                    <h1 className="text-4xl font-extrabold tracking-tight">✨ Bienvenido, {user.name}</h1>
                    <p className="mt-2 text-lg text-indigo-100">Panel de control del Área de Marketing</p>
                </div>

                {/* Estadísticas */}
                <h2 className="mb-4 text-2xl font-bold text-gray-700">📊 Estadísticas de Tareas</h2>
                <Button
                    variant="contained"
                    startIcon={<PictureAsPdf />}
                    onClick={() => window.open('/disponibilidad-semanal-pdf', '_blank')}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #ff4e50 0%, #000000 100%)',
                        color: '#fff',
                        boxShadow: `0 8px 32px ${alpha('#ff4e50', 0.3)}`,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #d7263d 0%, #111111 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: `0 12px 40px ${alpha('#ff4e50', 0.4)}`,
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    Generar Reporte PDF de Horario Influencers
                </Button>
                <Button variant="contained" color="success" onClick={handleGeneratePdf}>
                    Generar Reporte PDF de Horario Camarografos
                </Button>
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card
                        title="Total de Tareas"
                        value={estadisticas.total}
                        color="from-blue-400 to-blue-600"
                        icon={<ChartBarIcon className="h-8 w-8 text-white" />}
                    />
                    <Card
                        title="Pendientes"
                        value={estadisticas.pendiente}
                        color="from-yellow-400 to-yellow-600"
                        icon={<ArrowPathIcon className="h-8 w-8 text-white" />}
                    />
                    <Card
                        title="En Revisión"
                        value={estadisticas.en_revision}
                        color="from-indigo-400 to-indigo-600"
                        icon={<CheckCircleIcon className="h-8 w-8 text-white" />}
                    />
                    <Card
                        title="Publicadas"
                        value={estadisticas.publicada}
                        color="from-green-400 to-green-600"
                        icon={<CheckCircleIcon className="h-8 w-8 text-white" />}
                    />
                </div>

                {/* Secciones extras */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Últimas Tareas */}
                    <SectionCard title="Últimas Tareas" icon={<ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />}>
                        {tareas.length > 0 ? (
                            <ul className="space-y-3">
                                {tareas.map((t) => (
                                    <li key={t.id} className="rounded-lg border bg-gray-50 p-3 transition hover:bg-gray-100">
                                        <p className="font-semibold text-gray-800">{t.tarea.titulo}</p>
                                        <p className="text-sm text-gray-500">
                                            Prioridad: {t.tarea.prioridad} • {t.tarea.fecha}
                                        </p>
                                        <p className="text-xs text-gray-400">Asignado a: {t.user?.name || 'Sin asignar'}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No hay tareas asignadas</p>
                        )}
                    </SectionCard>

                    {/* Campañas */}
                    <SectionCard title="Últimas Publicaciones" icon={<LinkIcon className="h-6 w-6 text-green-500" />}>
                        {campanias.length > 0 ? (
                            <ul className="space-y-3">
                                {campanias.map((c) => (
                                    <li key={c.id} className="rounded-lg border bg-gray-50 p-3 transition hover:bg-gray-100">
                                        <p className="font-semibold text-gray-800">{c.company?.name || 'Empresa'}</p>
                                        <a
                                            href={c.link?.link}
                                            target="_blank"
                                            className="mt-1 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            <FaTiktok className="text-lg text-black" />
                                            <span>Ver video</span>
                                        </a>
                                        <p className="text-xs text-gray-400">Fecha Publicada: {c.fecha}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No hay campañas registradas</p>
                        )}
                    </SectionCard>
                    {/* Influencers disponibles */}
                    <SectionCard title="Influencers Disponibles Hoy" icon={<UserGroupIcon className="h-6 w-6 text-indigo-500" />}>
                        {influencers.length > 0 ? (
                            <ul className="space-y-3">
                                {influencers.map((inf) => (
                                    <li key={inf.id} className="rounded-lg border bg-gray-50 p-3 transition hover:bg-gray-100">
                                        <p className="font-semibold text-gray-800">{inf.user.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {inf.start_time} - {inf.end_time} ({inf.turno})
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No hay influencers disponibles hoy</p>
                        )}
                    </SectionCard>
                </div>
            </div>
        </AppLayout>
    );
};

// Card mejorada
const Card = ({ title, value, color, icon }: { title: string; value: number; color: string; icon: JSX.Element }) => (
    <div className="rounded-xl bg-white p-6 shadow-md transition hover:scale-105 hover:shadow-lg">
        <div className={`mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r ${color} p-3 shadow-md`}>{icon}</div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

// SectionCard reusable
const SectionCard = ({ title, icon, children }: { title: string; icon: JSX.Element; children: React.ReactNode }) => (
    <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-700">
            {icon} {title}
        </h2>
        {children}
    </div>
);

export default MarketingDashboard;
