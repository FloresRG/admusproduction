import AppLayout from '@/layouts/app-layout';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { usePage } from '@inertiajs/react';
import {
    Assignment,
    Business,
    CalendarMonth,
    Category,
    CheckCircle,
    Close,
    Flag,
    Person,
    PictureAsPdf,
    PriorityHigh,
    Schedule,
} from '@mui/icons-material';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
};

type AsignacionTarea = {
    id: number;
    estado: string;
    detalle: string;
    user?: User;
};

type Tipo = {
    id: number;
    nombre_tipo: string;
};

type Tarea = {
    id: number;
    titulo: string;
    prioridad: 'alta' | 'media' | 'baja';
    fecha: string;
    descripcion: string;
    tipo?: Tipo;
    asignaciones?: AsignacionTarea[];
};

type Empresa = {
    id: number;
    name?: string;
};

type DiaCalendario = {
    fecha: string;
    empresas: {
        [empresaId: string]: {
            empresa: Empresa;
            tareas: Tarea[];
        };
    };
};

// Styled Components usando MUI
const GradientCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
    marginBottom: theme.spacing(4),
}));

const CalendarCard = styled(Card)(({ theme }) => ({
    borderRadius: 24,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    '& .fc': {
        fontFamily: theme.typography.fontFamily,
    },
    '& .fc-toolbar': {
        padding: theme.spacing(2),
        background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
        borderBottom: '1px solid #e2e8f0',
    },
    '& .fc-toolbar-title': {
        fontSize: '1.5rem !important',
        fontWeight: '700 !important',
        color: '#1e293b',
    },
    '& .fc-button': {
        borderRadius: '8px !important',
        border: 'none !important',
        padding: '8px 16px !important',
        fontWeight: '600 !important',
        textTransform: 'none !important',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
    },
    '& .fc-button-primary': {
        background: 'linear-gradient(45deg, #3b82f6 30%, #6366f1 90%) !important',
    },
    '& .fc-daygrid-day': {
        '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
        },
    },
    '& .fc-event': {
        border: 'none !important',
        borderRadius: '6px !important',
        margin: '2px !important',
        padding: '2px 6px !important',
        fontSize: '0.8rem !important',
        fontWeight: '500 !important',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        },
    },
}));

const TaskCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        borderColor: '#3b82f6',
    },
}));

const PriorityChip = styled(Chip)<{ priority?: 'alta' | 'media' | 'baja' }>(({ theme, priority }) => ({
    fontWeight: 'bold',
    color: 'white',
    '& .MuiChip-icon': {
        color: 'white !important',
    },
    ...(priority === 'alta' && {
        background: 'linear-gradient(45deg, #ef4444 30%, #dc2626 90%)',
    }),
    ...(priority === 'media' && {
        background: 'linear-gradient(45deg, #f59e0b 30%, #d97706 90%)',
    }),
    ...(priority === 'baja' && {
        background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
    }),
}));

const GradientButton = styled(Button)(({ theme }) => ({
    borderRadius: 12,
    padding: '12px 32px',
    background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
    boxShadow: '0 3px 5px 2px rgba(99, 102, 241, .3)',
    '&:hover': {
        background: 'linear-gradient(45deg, #5b21b6 30%, #7c3aed 90%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 10px 4px rgba(99, 102, 241, .3)',
    },
    transition: 'all 0.3s ease',
}));

const Mes = () => {
    const { semanas } = usePage<{ semanas: DiaCalendario[][] }>().props;
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<{
        empresa: Empresa;
        tareas: Tarea[];
    } | null>(null);
    const [empresaColores] = useState<Record<number, string>>({});

    const getColorEmpresa = (empresaId: number) => {
        if (empresaColores[empresaId]) {
            return empresaColores[empresaId];
        }

        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'];
        const newColor = colors[empresaId % colors.length];
        empresaColores[empresaId] = newColor;
        return newColor;
    };

    // Convertimos los datos a eventos para FullCalendar
    const eventos: any[] = [];
    semanas.forEach((semana) =>
        semana.forEach((dia) => {
            Object.values(dia.empresas).forEach((empresaData) => {
                const colorEmpresa = getColorEmpresa(empresaData.empresa.id);

                eventos.push({
                    id: `${dia.fecha}-${empresaData.empresa.id}`,
                    title: `${empresaData.empresa.name ?? 'Empresa'} (${empresaData.tareas.length})`,
                    date: dia.fecha,
                    extendedProps: {
                        empresa: empresaData.empresa,
                        tareas: empresaData.tareas,
                    },
                    backgroundColor: colorEmpresa,
                    textColor: '#fff',
                    borderColor: colorEmpresa,
                });
            });
        }),
    );

    const handleEventClick = (info: any) => {
        setEmpresaSeleccionada(info.event.extendedProps);
    };

    const getPriorityIcon = (prioridad: Tarea['prioridad']) => {
        switch (prioridad) {
            case 'alta':
                return <PriorityHigh />;
            case 'media':
                return <Schedule />;
            case 'baja':
                return <CheckCircle />;
            default:
                return <Flag />;
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'completado':
                return 'success';
            case 'en progreso':
                return 'primary';
            case 'pendiente':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <AppLayout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <GradientCard elevation={8}>
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" alignItems="center" gap={3}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                                <CalendarMonth sx={{ fontSize: '2rem' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h3" fontWeight="bold" gutterBottom>
                                    Calendario Mensual
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    Visualiza y gestiona las tareas de todas las empresas
                                </Typography>
                            </Box>

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
                                Generar Reporte PDF de Influencers
                            </Button>
                        </Box>
                    </CardContent>
                </GradientCard>

                {/* Calendar */}
                <CalendarCard elevation={12}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={esLocale}
                        events={eventos}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek,dayGridDay',
                        }}
                        height="auto"
                        eventDisplay="block"
                        dayMaxEvents={3}
                        moreLinkClick="popover"
                    />
                </CalendarCard>

                {/* Modal de detalle por empresa */}
                <Dialog
                    open={!!empresaSeleccionada}
                    onClose={() => setEmpresaSeleccionada(null)}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            maxHeight: '90vh',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            p: 3,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                <Business />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">
                                    {empresaSeleccionada?.empresa.name || 'Empresa'}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {empresaSeleccionada?.tareas.length || 0} tareas programadas
                                </Typography>
                            </Box>
                        </Box>
                    </DialogTitle>

                    <DialogContent dividers sx={{ p: 3 }}>
                        {empresaSeleccionada?.tareas.length ? (
                            <Stack spacing={3}>
                                {empresaSeleccionada.tareas.map((tarea) => (
                                    <TaskCard key={tarea.id} elevation={2}>
                                        {/* Header de la tarea */}
                                        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{ bgcolor: '#6366f1' }}>
                                                    <Assignment />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                                        {tarea.titulo}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        ID: {tarea.id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <PriorityChip
                                                priority={tarea.prioridad}
                                                label={tarea.prioridad.toUpperCase()}
                                                icon={getPriorityIcon(tarea.prioridad)}
                                                size="small"
                                            />
                                        </Box>

                                        {/* Información de la tarea */}
                                        <Box mb={3}>
                                            <Stack direction="row" spacing={2} mb={2}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Category color="action" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Tipo:
                                                    </Typography>
                                                    <Chip
                                                        label={tarea.tipo?.nombre_tipo || 'No especificado'}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                    />
                                                </Box>
                                            </Stack>

                                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                                                <strong>Descripción:</strong> {tarea.descripcion || 'Sin descripción disponible'}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        {/* Asignaciones */}
                                        <Box>
                                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                                <Person color="action" />
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    Asignaciones
                                                </Typography>
                                                <Badge badgeContent={tarea.asignaciones?.length || 0} color="primary" sx={{ ml: 1 }}>
                                                    <Box />
                                                </Badge>
                                            </Box>

                                            {tarea.asignaciones && tarea.asignaciones.length > 0 ? (
                                                <Stack spacing={2}>
                                                    {tarea.asignaciones.map((asg) => (
                                                        <Paper
                                                            key={asg.id}
                                                            sx={{
                                                                p: 2,
                                                                bgcolor: '#f8fafc',
                                                                borderRadius: 2,
                                                                border: '1px solid #e2e8f0',
                                                            }}
                                                        >
                                                            <Box display="flex" alignItems="center" justify="space-between">
                                                                <Box display="flex" alignItems="center" gap={2}>
                                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366f1' }}>
                                                                        <Person fontSize="small" />
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography variant="body1" fontWeight="medium">
                                                                            {asg.user?.name || 'Sin asignar'}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {asg.detalle || 'Sin detalles'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                                <Chip
                                                                    label={asg.estado}
                                                                    color={getEstadoColor(asg.estado) as any}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </Box>
                                                        </Paper>
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Paper
                                                    sx={{
                                                        p: 3,
                                                        textAlign: 'center',
                                                        bgcolor: '#f8fafc',
                                                        borderRadius: 2,
                                                        border: '1px dashed #cbd5e1',
                                                    }}
                                                >
                                                    <Typography variant="body1" color="text.secondary">
                                                        No hay asignaciones para esta tarea
                                                    </Typography>
                                                </Paper>
                                            )}
                                        </Box>
                                    </TaskCard>
                                ))}
                            </Stack>
                        ) : (
                            <Box textAlign="center" py={6}>
                                <Avatar sx={{ width: 64, height: 64, bgcolor: '#f1f5f9', color: '#64748b', mx: 'auto', mb: 2 }}>
                                    <Assignment sx={{ fontSize: '2rem' }} />
                                </Avatar>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No hay tareas programadas
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Esta empresa no tiene tareas asignadas para esta fecha
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
                        <GradientButton onClick={() => setEmpresaSeleccionada(null)} variant="contained" startIcon={<Close />}>
                            Cerrar
                        </GradientButton>
                    </DialogActions>
                </Dialog>
            </Container>
        </AppLayout>
    );
};

export default Mes;
