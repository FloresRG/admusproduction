import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CommentIcon from '@mui/icons-material/Comment';
import DescriptionIcon from '@mui/icons-material/Description';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MovieIcon from '@mui/icons-material/Movie';
import PendingIcon from '@mui/icons-material/Pending';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import MapComponent from './MapComponent';

// Tipos
type Influencer = {
    user: {
        id: number;
        name: string;
        email?: string;
    };
    start_time: string;
    end_time: string;
};

type Tarea = {
    id: number;
    titulo: string;
    fecha_produccion: string;
    empresa: {
        id: number;
        name: string;
        direccion: string;
        descripcion?: string;
        ubicacion?: string;
        contract_duration?: string;
        start_date?: string;
        end_date?: string;
    };
    estado_produccion: string;
    estrategia: string;
    guion: string;
    comentario: string;
    influencers?: Influencer[];
};

type Props = PageProps<{
    tareas: Record<string, Tarea[]>;
}>;

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getFechasSemana = (): string[] => {
    const hoy = new Date();
    const primerDia = new Date(hoy);
    const day = hoy.getDay();
    const diferencia = day === 0 ? -6 : 1 - day;
    primerDia.setDate(hoy.getDate() + diferencia);

    const fechas: string[] = [];
    for (let i = 0; i < 6; i++) {
        const fecha = new Date(primerDia);
        fecha.setDate(primerDia.getDate() + i);
        fechas.push(fecha.toISOString().split('T')[0]);
    }
    return fechas;
};

const TareasSemana = ({ tareas }: Props) => {
    const fechasSemana = getFechasSemana();

    const [openMap, setOpenMap] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Tarea['empresa'] | null>(null);

    const handleOpenMap = (empresa: Tarea['empresa']) => {
        if (empresa && empresa.direccion) {
            setSelectedCompany(empresa);
            setOpenMap(true);
        }
    };

    const handleCloseMap = () => {
        setOpenMap(false);
        setSelectedCompany(null);
    };

    const gradientes = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-purple-500',
        'from-teal-500 to-green-500',
    ];

    return (
        <AppLayout>
            <Head title="Tareas de la Semana" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                {/* Header con gradiente */}
                <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <CalendarTodayIcon sx={{ fontSize: 40, color: 'white' }} />
                        <h1 className="text-4xl font-bold text-white">Videos para editar esta Semana</h1>
                    </div>
                    <p className="mt-2 text-purple-100">Visualiza tus ediciones semanales</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {fechasSemana.map((fecha, index) => {
                        const diaSemana = diasSemana[index];
                        const tareasDelDia = tareas[fecha] ?? [];
                        const gradiente = gradientes[index % gradientes.length];

                        return (
                            <div key={fecha} className="group transform transition-all duration-300 hover:scale-105">
                                {/* Card del día */}
                                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                                    {/* Header del día con gradiente */}
                                    <div className={`bg-gradient-to-r ${gradiente} p-4`}>
                                        <h2 className="text-xl font-bold text-white">{diaSemana}</h2>
                                        <p className="text-sm text-white/90">{fecha}</p>
                                        <div className="mt-2">
                                            <Chip
                                                label={`${tareasDelDia.length} tarea${tareasDelDia.length !== 1 ? 's' : ''}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,0.3)',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Lista de tareas */}
                                    <div className="space-y-4 p-4">
                                        {tareasDelDia.length === 0 ? (
                                            <div className="py-8 text-center text-gray-400">
                                                <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                                                <p className="mt-2">Sin ediciones programadas</p>
                                            </div>
                                        ) : (
                                            tareasDelDia.map((tarea) => (
                                                <div
                                                    key={tarea.id}
                                                    className="rounded-xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-all hover:border-purple-200 hover:shadow-md"
                                                >
                                                    {/* Título de la tarea */}
                                                    <div className="mb-3 flex items-start justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <MovieIcon sx={{ color: '#9333ea', fontSize: 24 }} />
                                                            <h3 className="font-bold text-gray-800">{tarea.titulo}</h3>
                                                        </div>
                                                        {tarea.estado_edicion === 'completado' ? (
                                                            <CheckCircleIcon sx={{ color: '#10b981' }} />
                                                        ) : tarea.estado_edicion === 'revision' ? (
                                                            <PendingIcon sx={{ color: '#f59e0b' }} />
                                                        ) : (
                                                            <PendingIcon sx={{ color: '#3b82f6' }} />
                                                        )}
                                                    </div>

                                                    {/* Empresa */}
                                                    <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                                                        <BusinessIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                                                        <span className="text-sm font-medium text-blue-900">{tarea.empresa.name}</span>
                                                    </div>
                                                    

                                                    {/* Estado */}
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <Chip
                                                            label={
                                                                tarea.estado_edicion === 'completado'
                                                                    ? 'Completado'
                                                                    : tarea.estado_edicion === 'revision'
                                                                      ? 'En revisión'
                                                                      : 'Pendiente'
                                                            }
                                                            size="small"
                                                            icon={
                                                                tarea.estado_edicion === 'completado' ? (
                                                                    <CheckCircleIcon />
                                                                ) : tarea.estado_edicion === 'revision' ? (
                                                                    <PendingIcon />
                                                                ) : (
                                                                    <PendingIcon />
                                                                )
                                                            }
                                                            sx={{
                                                                bgcolor:
                                                                    tarea.estado_edicion === 'completado'
                                                                        ? '#d1fae5'
                                                                        : tarea.estado_edicion === 'revision'
                                                                          ? '#fef3c7'
                                                                          : '#e0f2fe',
                                                                color:
                                                                    tarea.estado_edicion === 'completado'
                                                                        ? '#065f46'
                                                                        : tarea.estado_edicion === 'revision'
                                                                          ? '#92400e'
                                                                          : '#075985',
                                                                fontWeight: 'bold',
                                                                '& .MuiChip-icon': {
                                                                    color:
                                                                        tarea.estado_edicion === 'completado'
                                                                            ? '#10b981'
                                                                            : tarea.estado_edicion === 'revision'
                                                                              ? '#f59e0b'
                                                                              : '#0284c7',
                                                                },
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Detalles */}
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex items-start gap-2">
                                                            <DescriptionIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                                                            <div>
                                                                <span className="font-semibold text-gray-700">Estrategia:</span>
                                                                <p className="text-gray-600">{tarea.estrategia}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <MovieIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
                                                            <div>
                                                                <span className="font-semibold text-gray-700">Guion:</span>
                                                                <p className="text-gray-600">{tarea.guion}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-start gap-2">
                                                            <CommentIcon sx={{ fontSize: 18, color: '#ec4899' }} />
                                                            <div>
                                                                <span className="font-semibold text-gray-700">Comentario:</span>
                                                                <p className="text-gray-600">{tarea.comentario}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    

                                                    {/* Botón completar */}
                                                    {tarea.estado_edicion !== 'revision' && tarea.estado_edicion !== 'completado' && (
                                                        <Button
                                                            variant="contained"
                                                            fullWidth
                                                            size="medium"
                                                            startIcon={<CheckCircleIcon />}
                                                            sx={{
                                                                mt: 3,
                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                textTransform: 'none',
                                                                borderRadius: '10px',
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                                                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                                                                },
                                                            }}
                                                            onClick={() => {
                                                                if (confirm('¿Estás seguro que quieres marcar esta tarea como realizada?')) {
                                                                    router.put(route('tareaseditor.completar', tarea.id));
                                                                }
                                                            }}
                                                        >
                                                            Marcar como realizada para revision
                                                        </Button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal del mapa con estilos mejorados */}
            <Dialog
                open={openMap}
                onClose={handleCloseMap}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <LocationOnIcon />
                    Ubicación de la empresa
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedCompany ? (
                        <MapComponent company={selectedCompany} />
                    ) : (
                        <Typography color="error">No se pudo cargar la empresa.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseMap}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3,
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default TareasSemana;
