import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import BusinessIcon from '@mui/icons-material/Business';
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
    };
    estado_produccion: string;
    estrategia: string;
    guion: string;
    comentario: string;
    influencers?: Influencer[];
};

type Props = PageProps<{
    tareas: Tarea[];
    hoy: string;
}>;

const TareasHoy = ({ tareas, hoy }: Props) => {
    const [openMap, setOpenMap] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Tarea['empresa'] | null>(null);

    const handleOpenMap = (empresa: Tarea['empresa']) => {
        setSelectedCompany(empresa);
        setOpenMap(true);
    };

    const handleCloseMap = () => {
        setOpenMap(false);
        setSelectedCompany(null);
    };

    return (
        <AppLayout>
            <Head title="Tareas de Hoy" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl">
                    <h1 className="text-3xl font-bold">Videos para Editar de Hoy</h1>
                    <p className="text-blue-100">Fecha: {hoy}</p>
                </div>

                {tareas.length === 0 ? (
                    <div className="text-center text-gray-400">
                        <CheckCircleIcon sx={{ fontSize: 48 }} />
                        <p className="mt-2 text-lg">No tienes grabaciones asignadas para hoy.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tareas.map((tarea) => (
                            <div key={tarea.id} className="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MovieIcon sx={{ color: '#8b5cf6' }} />
                                        <h2 className="text-lg font-bold text-gray-800">{tarea.titulo}</h2>
                                    </div>
                                    <Chip
                                        label={
                                            tarea.estado_edicion === 'revision'
                                                ? 'En revisión'
                                                : tarea.estado_edicion === 'completado'
                                                  ? 'Completada'
                                                  : 'Pendiente'
                                        }
                                        icon={
                                            tarea.estado_edicion === 'revision' ? (
                                                <PendingIcon />
                                            ) : tarea.estado_edicion === 'completado' ? (
                                                <CheckCircleIcon />
                                            ) : (
                                                <PendingIcon />
                                            )
                                        }
                                        sx={{
                                            bgcolor:
                                                tarea.estado_edicion === 'revision'
                                                    ? '#fef3c7'
                                                    : tarea.estado_edicion === 'completado'
                                                      ? '#d1fae5'
                                                      : '#e0f2fe',
                                            color:
                                                tarea.estado_edicion === 'revision'
                                                    ? '#92400e'
                                                    : tarea.estado_edicion === 'completado'
                                                      ? '#065f46'
                                                      : '#075985',
                                            fontWeight: 'bold',
                                            '& .MuiChip-icon': {
                                                color:
                                                    tarea.estado_edicion === 'revision'
                                                        ? '#f59e0b'
                                                        : tarea.estado_edicion === 'completado'
                                                          ? '#10b981'
                                                          : '#0284c7',
                                            },
                                        }}
                                    />
                                </div>

                                <div className="mb-3 flex items-center gap-2">
                                    <BusinessIcon sx={{ fontSize: 20, color: '#3b82f6' }} />
                                    <span className="text-sm font-medium text-blue-900">{tarea.empresa.name}</span>
                                </div>

                                {/* Detalles */}
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="flex items-start gap-2">
                                        <DescriptionIcon sx={{ fontSize: 18 }} />
                                        <div>
                                            <strong>Estrategia:</strong> {tarea.estrategia}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <MovieIcon sx={{ fontSize: 18 }} />
                                        <div>
                                            <strong>Guion:</strong> {tarea.guion}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <CommentIcon sx={{ fontSize: 18 }} />
                                        <div>
                                            <strong>Comentario:</strong> {tarea.comentario}
                                        </div>
                                    </div>
                                </div>

                                {/* Influencers */}
                                {tarea.influencers && tarea.influencers.length > 0 && (
                                    <div className="mt-4 rounded-lg bg-blue-50 p-3">
                                        <div className="mb-2 flex items-center gap-2">
                                            <PersonIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                                            <span className="font-bold text-indigo-800">Influencers asignados</span>
                                        </div>
                                        <div className="space-y-2">
                                            {tarea.influencers.map((booking, idx) => (
                                                <div key={idx} className="flex items-center gap-2 rounded bg-white p-2 shadow-sm">
                                                    <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32 }}>{booking.user.name.charAt(0)}</Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{booking.user.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(booking.start_time).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}{' '}
                                                            -{' '}
                                                            {new Date(booking.end_time).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Botón completar */}
                                {tarea.estado_edicion !== 'revision' && tarea.estado_edicion !== 'completado' && (

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => {
                                            if (confirm('¿Marcar como completada esta tarea?')) {
                                                router.put(route('tareaseditor.completar', tarea.id));
                                            }
                                        }}
                                        sx={{
                                            mt: 3,
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            borderRadius: '10px',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                            },
                                        }}
                                    >
                                        Marcar como realizada para revision
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal mapa */}
            <Dialog open={openMap} onClose={handleCloseMap} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', gap: 1, alignItems: 'center', fontWeight: 'bold' }}>
                    <LocationOnIcon />
                    Ubicación de la empresa
                </DialogTitle>
                <DialogContent>
                    {selectedCompany ? <MapComponent company={selectedCompany} /> : <Typography>No se pudo cargar la empresa.</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMap}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default TareasHoy;
