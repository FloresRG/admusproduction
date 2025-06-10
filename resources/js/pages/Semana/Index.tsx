'use client';

// resources/js/Pages/tareas/index.tsx

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Add,
    ArrowBack,
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    Category as CategoryIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ExpandLess,
    ExpandMore,
    PriorityHigh,
    Refresh as RefreshIcon,
    TrendingDown,
    TrendingUp,
    WbSunny,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fade,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Skeleton,
    Slide,
    Stack,
    TextField,
    Tooltip,
    Typography,
    Zoom,
    alpha,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Asignado {
    user_id: number;
    user_name: string;
    estado: string;
    detalle: string;
}

interface TareaAsignada {
    id: number;
    titulo: string;
    prioridad: string;
    descripcion: string;
    fecha: string;
    tipo?: { id: number; nombre_tipo: string };
    company?: { id: number; name: string };
    asignados: Asignado[];
}

interface TipoTarea {
    id: number;
    nombre: string;
}

interface Empresa {
    id: number;
    nombre: string;
}

export default function Tareas() {
    // Estados principales
    const [tareas, setTareas] = useState<TareaAsignada[]>([]);
    const [tipos, setTipos] = useState<TipoTarea[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

    // Estados de vista
    const [viewMode, setViewMode] = useState<'semana' | 'dia'>('semana');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Estados del formulario
    const [showModal, setShowModal] = useState(false);
    const [asignarEmpresa, setAsignarEmpresa] = useState('no');
    const [formData, setFormData] = useState({
        titulo: '',
        prioridad: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        tipo_id: '',
        company_id: '',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Función para cargar datos iniciales
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [tareasRes, tiposRes, empresasRes] = await Promise.all([
                axios.get('/api/tareas-asignadas'),
                axios.get('/api/tipos'),
                axios.get('/api/companies'),
            ]);

            setTareas(tareasRes.data);
            setTipos(tiposRes.data);
            setEmpresas(empresasRes.data);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Hubo un error al cargar los datos. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auxiliar: interpretar "YYYY-MM-DD" como fecha LOCAL
    const parseLocalDate = useCallback((dateStr: string): Date => {
        const [year, month, day] = dateStr.split('-').map((p) => Number.parseInt(p, 10));
        return new Date(year, month - 1, day);
    }, []);

    // Chequear si "dateStr" está en la SEMANA ACTUAL
    const isDateInCurrentWeek = useCallback(
        (dateStr: string) => {
            const date = parseLocalDate(dateStr);
            const now = new Date();
            const dayOfWeek = now.getDay();
            const diffToMonday = (dayOfWeek + 6) % 7;
            const thisMonday = new Date(now);
            thisMonday.setDate(now.getDate() - diffToMonday);
            thisMonday.setHours(0, 0, 0, 0);

            const thisSunday = new Date(thisMonday);
            thisSunday.setDate(thisMonday.getDate() + 6);
            thisSunday.setHours(23, 59, 59, 999);

            return date >= thisMonday && date <= thisSunday;
        },
        [parseLocalDate],
    );

    // Construir el array de 7 fechas de la semana actual (Lunes a Domingo)
    const weekDates = useMemo(() => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diffToMonday = (dayOfWeek + 6) % 7;
        const thisMonday = new Date(now);
        thisMonday.setDate(now.getDate() - diffToMonday);
        thisMonday.setHours(0, 0, 0, 0);

        const dates: string[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(thisMonday);
            d.setDate(thisMonday.getDate() + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            dates.push(`${yyyy}-${mm}-${dd}`);
        }
        return dates;
    }, []);

    // Filtrado de tareas para la vista actual
    const filteredTareas = useMemo(() => {
        if (viewMode === 'semana') {
            return tareas.filter((t) => isDateInCurrentWeek(t.fecha));
        } else if (viewMode === 'dia' && selectedDate) {
            return tareas.filter((t) => t.fecha === selectedDate);
        }
        return tareas;
    }, [tareas, viewMode, selectedDate, isDateInCurrentWeek]);

    // Agrupar tareas por fecha (para vista semanal)
    const tareasPorFecha = useMemo(() => {
        const mapa: Record<string, TareaAsignada[]> = {};
        filteredTareas.forEach((tarea) => {
            if (!mapa[tarea.fecha]) {
                mapa[tarea.fecha] = [];
            }
            mapa[tarea.fecha].push(tarea);
        });
        return mapa;
    }, [filteredTareas]);

    // Agrupar tareas por usuario (para vista de día)
    const tareasPorUsuario = useMemo(() => {
        if (viewMode !== 'dia') return {};

        const mapa: Record<string, TareaAsignada[]> = {};
        filteredTareas.forEach((tarea) => {
            tarea.asignados.forEach((asig) => {
                const nombre = asig.user_name;
                if (!mapa[nombre]) {
                    mapa[nombre] = [];
                }
                mapa[nombre].push(tarea);
            });
        });
        return mapa;
    }, [filteredTareas, viewMode]);

    // Inicializar expandedUsers
    useEffect(() => {
        const initialExpandedState: Record<string, boolean> = {};
        Object.keys(tareasPorUsuario).forEach((userName) => {
            initialExpandedState[userName] = true;
        });
        setExpandedUsers(initialExpandedState);
    }, [tareasPorUsuario]);

    // Funciones de manejo
    const toggleUserExpanded = (userName: string) => {
        setExpandedUsers((prev) => ({
            ...prev,
            [userName]: !prev[userName],
        }));
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        setViewMode('dia');
    };

    const handleBackToWeek = () => {
        setViewMode('semana');
        setSelectedDate(null);
    };

    const openCreateModal = (fecha?: string) => {
        setIsEditMode(false);
        setEditId(null);
        setAsignarEmpresa('no');
        setFormError(null);
        setFormData({
            titulo: '',
            prioridad: '',
            descripcion: '',
            fecha: fecha || new Date().toISOString().split('T')[0],
            tipo_id: '',
            company_id: '',
        });
        setShowModal(true);
    };

    const openEditModal = (tarea: TareaAsignada) => {
        setIsEditMode(true);
        setEditId(tarea.id);
        setFormError(null);
        setFormData({
            titulo: tarea.titulo,
            prioridad: tarea.prioridad,
            descripcion: tarea.descripcion,
            fecha: tarea.fecha,
            tipo_id: tarea.tipo?.id ? String(tarea.tipo.id) : '',
            company_id: tarea.company?.id ? String(tarea.company.id) : '',
        });
        setAsignarEmpresa(tarea.company ? 'si' : 'no');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.titulo.trim()) {
            setFormError('El título es obligatorio');
            return;
        }

        setFormLoading(true);
        setFormError(null);

        const payload = {
            ...formData,
            tipo_id: formData.tipo_id ? Number(formData.tipo_id) : null,
            company_id: formData.company_id ? Number(formData.company_id) : null,
        };

        try {
            if (isEditMode) {
                await axios.put(`/tareas/${editId}`, payload);
            } else {
                await axios.post('/create/tareas', payload);
            }

            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error('Error al guardar tarea:', err);
            setFormError('Hubo un error al guardar la tarea. Por favor, intenta de nuevo.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;

        try {
            await axios.delete(`/tareas/${id}`);
            fetchData();
        } catch (err) {
            console.error('Error al eliminar tarea:', err);
            setError('Hubo un error al eliminar la tarea. Por favor, intenta de nuevo.');
        }
    };

    // Función para obtener el color de prioridad
    const getPriorityColor = (prioridad: string) => {
        switch (prioridad.toLowerCase()) {
            case 'alta':
                return '#f44336';
            case 'media':
                return '#ff9800';
            case 'baja':
                return '#4caf50';
            default:
                return '#9e9e9e';
        }
    };

    // Función para obtener el color de avatar para usuarios
    const getAvatarColor = (name: string) => {
        const colors = ['#1976d2', '#1565c0', '#0d47a1', '#2196f3', '#0288d1', '#01579b', '#03a9f4', '#00b0ff', '#0091ea', '#3f51b5'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Función para obtener iniciales
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Función para obtener el gradiente del día
    const getDayGradient = (index: number) => {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Lunes
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Martes
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Miércoles
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Jueves
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Viernes
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Sábado
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Domingo
        ];
        return gradients[index % gradients.length];
    };

    // Renderizado condicional para estados de carga
    if (loading) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Tareas', href: '/tareas' }]}>
                <Head title="Tareas" />
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                    <Grid container spacing={2}>
                        {[...Array(7)].map((_, i) => (
                            <Grid item xs={12} sm={6} md key={i}>
                                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Tareas', href: '/tareas' }]}>
            <Head title="Tareas" />

            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                    color: 'white',
                    py: 3,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Fade in timeout={800}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                📅 {viewMode === 'dia' ? `Tareas del ${selectedDate}` : 'Calendario Semanal'}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                {viewMode === 'dia'
                                    ? 'Vista detallada de las tareas del día seleccionado'
                                    : 'Haz clic en cualquier día para ver los detalles'}
                            </Typography>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 3 }}>
                {error && (
                    <Slide direction="down" in={!!error}>
                        <Alert
                            severity="error"
                            sx={{ mb: 3, borderRadius: 2 }}
                            action={
                                <Button color="inherit" size="small" onClick={fetchData}>
                                    Reintentar
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    </Slide>
                )}

                {/* Barra de herramientas */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                        border: '1px solid rgba(0,0,0,0.05)',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Botón de volver si estamos en vista de día */}
                        {viewMode === 'dia' && (
                            <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBackToWeek} sx={{ borderRadius: 2 }}>
                                Volver a la semana
                            </Button>
                        )}

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Actualizar">
                                <IconButton onClick={fetchData} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>

                            <Button
                                variant="contained"
                                onClick={() => openCreateModal(selectedDate || undefined)}
                                startIcon={<Add />}
                                sx={{
                                    borderRadius: 2,
                                    background: 'linear-gradient(45deg, #1976d2 0%, #0d47a1 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1565c0 0%, #0a3880 100%)',
                                    },
                                }}
                            >
                                Nueva Tarea
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Vista Semanal - Grid de días */}
                {viewMode === 'semana' && (
                    <Fade in>
                        <Grid container spacing={2}>
                            {weekDates.map((date, index) => {
                                const d = parseLocalDate(date);
                                const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
                                const dayNumber = d.getDate();
                                const month = d.toLocaleDateString('es-ES', { month: 'short' });
                                const tareasDelDia = tareasPorFecha[date] || [];

                                return (
                                    <Grid item xs={12} sm={6} md key={date}>
                                        <Zoom in timeout={300 + index * 100}>
                                            <Card
                                                sx={{
                                                    height: '100%',
                                                    minHeight: 300,
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                    },
                                                }}
                                                onClick={() => handleDateClick(date)}
                                            >
                                                {/* Header del día */}
                                                <Box
                                                    sx={{
                                                        background: getDayGradient(index),
                                                        color: 'white',
                                                        p: 2,
                                                        textAlign: 'center',
                                                        position: 'relative',
                                                        '&::before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            background:
                                                                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
                                                        },
                                                    }}
                                                >
                                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                                                            <WbSunny fontSize="small" />
                                                            <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                                                {dayName}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="h4" fontWeight="bold">
                                                            {dayNumber}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ opacity: 0.9, textTransform: 'uppercase' }}>
                                                            {month} {d.getFullYear()}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Contenido de tareas */}
                                                <Box sx={{ p: 2, flexGrow: 1 }}>
                                                    {tareasDelDia.length === 0 ? (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                height: 150,
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                Sin tareas programadas
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<Add />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openCreateModal(date);
                                                                }}
                                                                sx={{ borderRadius: 2 }}
                                                            >
                                                                Agregar
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <Stack spacing={1}>
                                                            {tareasDelDia.slice(0, 4).map((tarea) => (
                                                                <Chip
                                                                    key={tarea.id}
                                                                    label={tarea.titulo}
                                                                    sx={{
                                                                        bgcolor: alpha(getPriorityColor(tarea.prioridad), 0.1),
                                                                        color: getPriorityColor(tarea.prioridad),
                                                                        fontWeight: 'bold',
                                                                        fontSize: '0.8rem',
                                                                        height: 32,
                                                                        justifyContent: 'flex-start',
                                                                        '& .MuiChip-label': {
                                                                            px: 1,
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap',
                                                                        },
                                                                        '&:hover': {
                                                                            bgcolor: alpha(getPriorityColor(tarea.prioridad), 0.2),
                                                                            transform: 'scale(1.02)',
                                                                        },
                                                                        transition: 'all 0.2s ease',
                                                                    }}
                                                                />
                                                            ))}
                                                            {tareasDelDia.length > 4 && (
                                                                <Typography
                                                                    variant="caption"
                                                                    color="primary"
                                                                    fontWeight="bold"
                                                                    sx={{ textAlign: 'center', mt: 1 }}
                                                                >
                                                                    +{tareasDelDia.length - 4} tareas más
                                                                </Typography>
                                                            )}
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<Add />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    openCreateModal(date);
                                                                }}
                                                                sx={{ borderRadius: 2, mt: 1 }}
                                                            >
                                                                Agregar
                                                            </Button>
                                                        </Stack>
                                                    )}
                                                </Box>
                                            </Card>
                                        </Zoom>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Fade>
                )}

                {/* Vista de Día - Lista detallada agrupada por usuarios */}
                {viewMode === 'dia' && (
                    <Fade in>
                        <Box>
                            {Object.keys(tareasPorUsuario).length === 0 ? (
                                <Paper
                                    sx={{
                                        p: 6,
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                                    }}
                                >
                                    <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                                        📝 No hay tareas para este día
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        No se encontraron tareas programadas para el {selectedDate}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => openCreateModal(selectedDate || undefined)}
                                        sx={{
                                            borderRadius: 2,
                                            background: 'linear-gradient(45deg, #1976d2 0%, #0d47a1 100%)',
                                        }}
                                    >
                                        Crear primera tarea
                                    </Button>
                                </Paper>
                            ) : (
                                Object.entries(tareasPorUsuario).map(([userName, tareas], userIndex) => (
                                    <Fade key={userName} in timeout={300 + userIndex * 100}>
                                        <Card
                                            sx={{
                                                mb: 2,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            }}
                                        >
                                            {/* Cabecera de usuario */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    p: 2,
                                                    background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                                                    },
                                                    transition: 'background 0.3s ease',
                                                }}
                                                onClick={() => toggleUserExpanded(userName)}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: getAvatarColor(userName), fontWeight: 'bold' }}>
                                                        {getInitials(userName)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {userName}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                            {tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'} asignadas
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton sx={{ color: 'white' }}>
                                                    {expandedUsers[userName] ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </Box>

                                            {/* Lista de tareas del usuario */}
                                            <Box sx={{ display: expandedUsers[userName] ? 'block' : 'none' }}>
                                                <List disablePadding>
                                                    {tareas.map((tarea, index) => (
                                                        <Zoom key={tarea.id} in style={{ transitionDelay: `${index * 50}ms` }}>
                                                            <Box>
                                                                <ListItem
                                                                    sx={{
                                                                        py: 1.5,
                                                                        px: 2,
                                                                        transition: 'background-color 0.2s',
                                                                        '&:hover': {
                                                                            bgcolor: alpha('#1976d2', 0.05),
                                                                        },
                                                                        borderLeft: `4px solid ${getPriorityColor(tarea.prioridad)}`,
                                                                    }}
                                                                >
                                                                    <ListItemAvatar>
                                                                        <Avatar
                                                                            sx={{
                                                                                bgcolor: alpha(getPriorityColor(tarea.prioridad), 0.1),
                                                                                color: getPriorityColor(tarea.prioridad),
                                                                            }}
                                                                        >
                                                                            {tarea.prioridad === 'alta' ? (
                                                                                <PriorityHigh />
                                                                            ) : tarea.prioridad === 'media' ? (
                                                                                <TrendingUp />
                                                                            ) : (
                                                                                <TrendingDown />
                                                                            )}
                                                                        </Avatar>
                                                                    </ListItemAvatar>

                                                                    <ListItemText
                                                                        primary={
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 1,
                                                                                    flexWrap: 'wrap',
                                                                                }}
                                                                            >
                                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                                    {tarea.titulo}
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={tarea.prioridad}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        bgcolor: alpha(getPriorityColor(tarea.prioridad), 0.1),
                                                                                        color: getPriorityColor(tarea.prioridad),
                                                                                        fontWeight: 'bold',
                                                                                        fontSize: '0.7rem',
                                                                                    }}
                                                                                />
                                                                                {tarea.tipo && (
                                                                                    <Chip
                                                                                        label={tarea.tipo.nombre_tipo}
                                                                                        size="small"
                                                                                        icon={<CategoryIcon fontSize="small" />}
                                                                                        variant="outlined"
                                                                                        color="primary"
                                                                                    />
                                                                                )}
                                                                            </Box>
                                                                        }
                                                                        secondary={
                                                                            <Box sx={{ mt: 0.5 }}>
                                                                                <Box
                                                                                    sx={{
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        gap: 2,
                                                                                        flexWrap: 'wrap',
                                                                                        mb: 0.5,
                                                                                    }}
                                                                                >
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                        <CalendarTodayIcon fontSize="small" color="action" />
                                                                                        <Typography variant="body2" color="text.secondary">
                                                                                            {tarea.fecha}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                    {tarea.company && (
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                                            <BusinessIcon fontSize="small" color="action" />
                                                                                            <Typography variant="body2" color="text.secondary">
                                                                                                {tarea.company.name}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    )}
                                                                                </Box>
                                                                                {tarea.descripcion && (
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color="text.secondary"
                                                                                        sx={{
                                                                                            display: '-webkit-box',
                                                                                            WebkitLineClamp: 2,
                                                                                            WebkitBoxOrient: 'vertical',
                                                                                            overflow: 'hidden',
                                                                                            textOverflow: 'ellipsis',
                                                                                        }}
                                                                                    >
                                                                                        {tarea.descripcion}
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                        }
                                                                    />

                                                                    <ListItemSecondaryAction>
                                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                                            <Tooltip title="Editar">
                                                                                <IconButton
                                                                                    edge="end"
                                                                                    aria-label="editar"
                                                                                    onClick={() => openEditModal(tarea)}
                                                                                    color="primary"
                                                                                    size="small"
                                                                                    sx={{
                                                                                        bgcolor: alpha('#1976d2', 0.1),
                                                                                        '&:hover': { bgcolor: alpha('#1976d2', 0.2) },
                                                                                    }}
                                                                                >
                                                                                    <EditIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Eliminar">
                                                                                <IconButton
                                                                                    edge="end"
                                                                                    aria-label="eliminar"
                                                                                    onClick={() => handleDelete(tarea.id)}
                                                                                    color="error"
                                                                                    size="small"
                                                                                    sx={{
                                                                                        bgcolor: alpha('#f44336', 0.1),
                                                                                        '&:hover': { bgcolor: alpha('#f44336', 0.2) },
                                                                                    }}
                                                                                >
                                                                                    <DeleteIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Box>
                                                                    </ListItemSecondaryAction>
                                                                </ListItem>
                                                                {index < tareas.length - 1 && <Divider variant="inset" component="li" />}
                                                            </Box>
                                                        </Zoom>
                                                    ))}
                                                </List>
                                            </Box>
                                        </Card>
                                    </Fade>
                                ))
                            )}
                        </Box>
                    </Fade>
                )}
            </Container>

            {/* Modal mejorado */}
            <Dialog
                open={showModal}
                onClose={() => setShowModal(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        {isEditMode ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}
                    </Typography>
                    <IconButton onClick={() => setShowModal(false)} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    {formLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                    {formError && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {formError}
                        </Alert>
                    )}

                    <Grid container spacing={3} sx={{ mt: 0 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="📝 Título de la tarea"
                                fullWidth
                                value={formData.titulo}
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                required
                                error={formError && !formData.titulo.trim()}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    ⚡ Prioridad
                                </FormLabel>
                                <RadioGroup row value={formData.prioridad} onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}>
                                    <FormControlLabel
                                        value="alta"
                                        control={<Radio sx={{ color: '#f44336', '&.Mui-checked': { color: '#f44336' } }} />}
                                        label="🔴 Alta"
                                    />
                                    <FormControlLabel
                                        value="media"
                                        control={<Radio sx={{ color: '#ff9800', '&.Mui-checked': { color: '#ff9800' } }} />}
                                        label="🟡 Media"
                                    />
                                    <FormControlLabel
                                        value="baja"
                                        control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />}
                                        label="🟢 Baja"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="📅 Fecha"
                                type="date"
                                fullWidth
                                value={formData.fecha}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="📄 Descripción"
                                fullWidth
                                multiline
                                minRows={3}
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                placeholder="Describe la tarea en detalle..."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                label="🏷️ Tipo"
                                fullWidth
                                value={formData.tipo_id}
                                onChange={(e) => setFormData({ ...formData, tipo_id: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="">Sin tipo</MenuItem>
                                {tipos.map((tipo) => (
                                    <MenuItem key={tipo.id} value={tipo.id}>
                                        {tipo.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    🏢 ¿Asignar empresa?
                                </FormLabel>
                                <RadioGroup
                                    row
                                    value={asignarEmpresa}
                                    onChange={(e) => {
                                        setAsignarEmpresa(e.target.value);
                                        if (e.target.value === 'no') {
                                            setFormData({ ...formData, company_id: '' });
                                        }
                                    }}
                                >
                                    <FormControlLabel value="si" control={<Radio />} label="Sí" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {asignarEmpresa === 'si' && (
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="🏢 Empresa"
                                    fullWidth
                                    value={formData.company_id}
                                    onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                >
                                    <MenuItem value="">Seleccionar empresa</MenuItem>
                                    {empresas.map((emp) => (
                                        <MenuItem key={emp.id} value={emp.id}>
                                            {emp.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3, gap: 2 }}>
                    <Button onClick={() => setShowModal(false)} variant="outlined" sx={{ borderRadius: 2, minWidth: 100 }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={formLoading}
                        sx={{
                            borderRadius: 2,
                            minWidth: 120,
                            background: 'linear-gradient(45deg, #1976d2 0%, #0d47a1 100%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 0%, #0a3880 100%)',
                            },
                        }}
                    >
                        {formLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Tarea'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
}
