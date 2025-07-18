import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Add,
    ArrowBack,
    Assignment,
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    CalendarViewMonth,
    CalendarViewWeek,
    Cancel,
    Category as CategoryIcon,
    Delete as DeleteIcon,
    Edit,
    ExpandLess,
    ExpandMore,
    Person,
    PriorityHigh,
    Refresh as RefreshIcon,
    Save,
    Search,
    Star,
    TrendingDown,
    TrendingUp,
    ViewList,
} from '@mui/icons-material';
import {
    Alert,
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Collapse,
    Container,
    Divider,
    Fab,
    Fade,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
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
    useMediaQuery,
    useTheme,
    Zoom,
} from '@mui/material';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Asignado {
    id: number; // ← PK de la asignación
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
    const [asignacionTipo, setAsignacionTipo] = useState<'aleatoria' | 'manual'>('aleatoria');
    const [pasantes, setPasantes] = useState<Array<{ id: number; name: string; email: string }>>([]);
    const [selectedPasanteId, setSelectedPasanteId] = useState<string>('');

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

    // Estados de vista
    const [viewMode, setViewMode] = useState<'semana' | 'mes' | 'todas' | 'dia'>('semana');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Estados de filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUser, setFilterUser] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('');

    // Estados de edición inline
    const [editingTask, setEditingTask] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState({
        titulo: '',
        prioridad: '',
        descripcion: '',
        fecha: '',
        tipo_id: '',
        company_id: '',
    });

    // Estados para nueva tarea
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [newTaskData, setNewTaskData] = useState({
        titulo: '',
        prioridad: '',
        descripcion: '',
        fecha: '',
        tipo_id: '',
        company_id: '',
    });
    const [asignarEmpresa, setAsignarEmpresa] = useState('no');
    const [editarEmpresa, setEditarEmpresa] = useState('no');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Función para cargar datos iniciales
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [tareasRes, tiposRes, empresasRes, pasantesRes] = await Promise.all([
                axios.get('/tareas-con-asignaciones'),
                axios.get('/api/tipos'),
                axios.get('/api/companies'),
                axios.get('/api/pasantes'),
            ]);

            setTareas(tareasRes.data);
            setTipos(tiposRes.data);
            setEmpresas(empresasRes.data);
            setPasantes(pasantesRes.data); // Nota el .data.data debido a la estructura de la respuesta
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
        let result = tareas;

        if (viewMode === 'semana') {
            result = tareas.filter((t) => isDateInCurrentWeek(t.fecha));
        } else if (viewMode === 'mes') {
            const now = new Date();
            result = tareas.filter((t) => {
                const date = parseLocalDate(t.fecha);
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            });
        } else if (viewMode === 'dia' && selectedDate) {
            result = tareas.filter((t) => t.fecha === selectedDate);
        }
        // Para "todas" no filtramos por fecha

        // Aplicar filtros adicionales
        if (searchTerm) {
            result = result.filter((t) => t.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (filterPriority) {
            result = result.filter((t) => t.prioridad === filterPriority);
        }

        if (filterUser) {
            result = result.filter((t) => t.asignados.some((a) => a.user_name === filterUser));
        }

        return result;
    }, [tareas, viewMode, selectedDate, isDateInCurrentWeek, parseLocalDate, searchTerm, filterPriority, filterUser]);

    // Agrupar tareas por fecha (para vista semanal)
    const tareasPorFecha = useMemo(() => {
        const mapa: Record<string, TareaAsignada[]> = {};
        if (viewMode === 'semana') {
            tareas
                .filter((t) => isDateInCurrentWeek(t.fecha))
                .forEach((tarea) => {
                    if (!mapa[tarea.fecha]) {
                        mapa[tarea.fecha] = [];
                    }
                    mapa[tarea.fecha].push(tarea);
                });
        }
        return mapa;
    }, [tareas, viewMode, isDateInCurrentWeek]);

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

    // Obtener lista de usuarios únicos
    const usuariosUnicos = useMemo(() => {
        const setNames = new Set<string>();
        tareas.forEach((t) => {
            t.asignados.forEach((a) => {
                setNames.add(a.user_name);
            });
        });
        return Array.from(setNames).sort();
    }, [tareas]);

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
        setEditingTask(null);
        setShowNewTaskForm(false);
    };

    // Funciones de edición inline
    const startEditing = (tarea: TareaAsignada) => {
        setEditingTask(tarea.id);
        setEditFormData({
            titulo: tarea.titulo,
            prioridad: tarea.prioridad,
            descripcion: tarea.descripcion,
            fecha: tarea.fecha,
            tipo_id: tarea.tipo?.id ? String(tarea.tipo.id) : '',
            company_id: tarea.company?.id ? String(tarea.company.id) : '',
        });
        setEditarEmpresa(tarea.company ? 'si' : 'no');
    };

    const cancelEditing = () => {
        setEditingTask(null);
        setEditFormData({
            titulo: '',
            prioridad: '',
            descripcion: '',
            fecha: '',
            tipo_id: '',
            company_id: '',
        });
        setEditarEmpresa('no');
    };

    // Funciones para nueva tarea
    const startNewTask = (fecha?: string) => {
        setShowNewTaskForm(true);
        setNewTaskData({
            titulo: '',
            prioridad: '',
            descripcion: '',
            fecha: fecha || new Date().toISOString().split('T')[0],
            tipo_id: '',
            company_id: '',
        });
        setAsignarEmpresa('no');
    };

    const cancelNewTask = () => {
        setShowNewTaskForm(false);
        setNewTaskData({
            titulo: '',
            prioridad: '',
            descripcion: '',
            fecha: '',
            tipo_id: '',
            company_id: '',
        });
        setAsignarEmpresa('no');
        setAsignacionTipo('aleatoria');
        setSelectedPasanteId('');
    };

    const saveNewTask = async () => {
        if (!newTaskData.titulo.trim()) return;

        try {
            const payload = {
                ...newTaskData,
                tipo_id: newTaskData.tipo_id ? Number(newTaskData.tipo_id) : null,
                company_id: newTaskData.company_id ? Number(newTaskData.company_id) : null,
                asignacion_aleatoria: asignacionTipo === 'aleatoria',
                pasante_id: asignacionTipo === 'manual' ? Number(selectedPasanteId) : null,
            };

            await axios.post('/create/tareas', payload);
            setShowNewTaskForm(false);
            fetchData();
            // Limpiar estados
            setAsignacionTipo('aleatoria');
            setSelectedPasanteId('');
        } catch (err) {
            console.error('Error al crear tarea:', err);
            setError('Error al crear la tarea');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;

        try {
            await axios.delete(`/tareas/${id}`);
            fetchData();
        } catch (err) {
            console.error('Error al eliminar tarea:', err);
            setError('Error al eliminar la tarea');
        }
    };

    // Función para obtener el color de prioridad - COLORES VIVOS
    const getPriorityColor = (prioridad: string) => {
        switch (prioridad.toLowerCase()) {
            case 'alta':
                return '#FF1744'; // Rojo vibrante
            case 'media':
                return '#FF9100'; // Naranja vibrante
            case 'baja':
                return '#00E676'; // Verde vibrante
            default:
                return '#9E9E9E';
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

    // Función para obtener el gradiente del día - COLORES MÁS VIVOS
    const getDayGradient = (index: number, isToday = false) => {
        if (isToday) {
            return 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%)'; // Gradiente dorado vibrante para HOY
        }

        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Lunes - Azul púrpura
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Martes - Rosa fucsia
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Miércoles - Azul cyan
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Jueves - Verde turquesa
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Viernes - Rosa amarillo
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Sábado - Turquesa rosa
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Domingo - Melocotón
        ];
        return gradients[index % gradients.length];
    };

    // Dentro de tu función Tareas(), junto al resto de useState(...)
    const [editAsignacionId, setEditAsignacionId] = useState<number | null>(null);
    const [editAsignData, setEditAsignData] = useState<{ estado: string; detalle: string }>({
        estado: '',
        detalle: '',
    });

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
                                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </AppLayout>
        );
    }
    function startEditAsignacion(asignado: Asignado) {
        setEditAsignacionId(asignado.id);
        setEditAsignData({
            estado: asignado.estado,
            detalle: asignado.detalle ?? '',
        });
    }

    function cancelEditAsignacion() {
        setEditAsignacionId(null);
        setEditAsignData({ estado: '', detalle: '' });
    }

    async function saveEditAsignacion() {
        if (!editAsignacionId) return;

        try {
            // Para actualizar una asignación
            await axios.patch(`/asignaciones/${editAsignacionId}`, { estado: editAsignData.estado, detalle: editAsignData.detalle });
            await fetchData();
            setEditAsignacionId(null);
        } catch (err) {
            console.error('Error al actualizar asignación:', err);
            setError('No se pudo actualizar la asignación');
        }
    }
    const saveEdit = async () => {
        if (!editFormData.titulo.trim()) return;

        try {
            const payload = {
                ...editFormData,
                tipo_id: editFormData.tipo_id ? Number(editFormData.tipo_id) : null,
                company_id: editFormData.company_id ? Number(editFormData.company_id) : null,
            };

            await axios.put(`/tareas/${editingTask}`, payload);
            setEditingTask(null);
            fetchData();
        } catch (err) {
            console.error('Error al actualizar tarea:', err);
            setError('Error al actualizar la tarea');
        }
    };

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
                                📅 {viewMode === 'dia' ? `Tareas del ${selectedDate}` : 'Gestión de Tareas'}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                {viewMode === 'dia'
                                    ? 'Edita las tareas directamente en la lista'
                                    : 'Organiza y gestiona todas tus tareas de manera eficiente'}
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

                {/* Barra de herramientas principal */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                >
                    <Stack spacing={3}>
                        {/* Controles principales */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            {/* Botón de volver si estamos en vista de día */}
                            {viewMode === 'dia' && (
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBack />}
                                    onClick={handleBackToWeek}
                                    sx={{ borderRadius: 2, borderColor: '#1976d2', color: '#1976d2' }}
                                >
                                    Volver a la semana
                                </Button>
                            )}

                            {/* Botones de vista */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant={viewMode === 'semana' ? 'contained' : 'outlined'}
                                    startIcon={<CalendarViewWeek />}
                                    onClick={() => setViewMode('semana')}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Semana
                                </Button>
                                <Button
                                    variant={viewMode === 'mes' ? 'contained' : 'outlined'}
                                    startIcon={<CalendarViewMonth />}
                                    onClick={() => setViewMode('mes')}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Mes
                                </Button>
                                <Button
                                    variant={viewMode === 'todas' ? 'contained' : 'outlined'}
                                    startIcon={<ViewList />}
                                    onClick={() => setViewMode('todas')}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Todas
                                </Button>
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Actualizar">
                                    <IconButton onClick={fetchData} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>

                                <Button
                                    variant="contained"
                                    onClick={() => startNewTask()}
                                    startIcon={<Add />}
                                    sx={{
                                        borderRadius: 2,
                                        background: 'linear-gradient(45deg, #1976d2 0%, #0d47a1 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1565c0 0%, #0a3880 100%)',
                                        },
                                        px: 3,
                                        py: 1,
                                    }}
                                >
                                    Nueva Tarea Para HOY
                                </Button>
                            </Box>
                        </Box>

                        {/* Filtros */}
                        {viewMode !== 'dia' && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        placeholder="Buscar tareas..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Filtrar por usuario"
                                        value={filterUser}
                                        onChange={(e) => setFilterUser(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        <MenuItem value="">Todos los usuarios</MenuItem>
                                        {usuariosUnicos.map((user) => (
                                            <MenuItem key={user} value={user}>
                                                {user}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Filtrar por prioridad"
                                        value={filterPriority}
                                        onChange={(e) => setFilterPriority(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        <MenuItem value="">Todas las prioridades</MenuItem>
                                        <MenuItem value="alta">Alta</MenuItem>
                                        <MenuItem value="media">Media</MenuItem>
                                        <MenuItem value="baja">Baja</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        )}

                        {/* Estadísticas */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip
                                icon={<Assignment />}
                                label={`${filteredTareas.length} tareas`}
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                            />
                            {viewMode !== 'dia' && (
                                <>
                                    <Chip
                                        icon={<Person />}
                                        label={`${usuariosUnicos.length} usuarios`}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                    <Chip
                                        icon={<BusinessIcon />}
                                        label={`${new Set(tareas.map((t) => t.company?.name).filter(Boolean)).size} empresas`}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </>
                            )}
                        </Box>
                    </Stack>
                </Paper>

                {/* Formulario para nueva tarea - Mejorado y más visible */}
                {showNewTaskForm && (
                    <Zoom in>
                        <Card
                            sx={{
                                mb: 3,
                                borderRadius: 3,
                                border: '3px solid #1976d2',
                                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.2)',
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                                    color: 'white',
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    ✨ Crear Nueva Tarea
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                    Completa todos los campos para crear una tarea detallada
                                </Typography>
                            </Box>
                            <Box sx={{ p: 4, background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)' }}>
                                <Grid container spacing={3}>
                                    {/* Dentro del formulario de nueva tarea, después de los campos existentes */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset" fullWidth>
                                            <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                                                👥 Tipo de Asignación
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                value={asignacionTipo}
                                                onChange={(e) => {
                                                    setAsignacionTipo(e.target.value as 'aleatoria' | 'manual');
                                                    if (e.target.value === 'aleatoria') {
                                                        setSelectedPasanteId('');
                                                    }
                                                }}
                                            >
                                                <FormControlLabel value="aleatoria" control={<Radio />} label="Aleatoria" />
                                                <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    {asignacionTipo === 'manual' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="🧑‍💼 Seleccionar Pasante"
                                                value={selectedPasanteId}
                                                onChange={(e) => setSelectedPasanteId(e.target.value)}
                                                required
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">Seleccionar pasante</MenuItem>
                                                {pasantes.map((pasante) => (
                                                    <MenuItem key={pasante.id} value={pasante.id}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    bgcolor: getAvatarColor(pasante.name),
                                                                    fontSize: '0.875rem',
                                                                }}
                                                            >
                                                                {getInitials(pasante.name)}
                                                            </Avatar>
                                                            <Typography>{pasante.name}</Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                ({pasante.email})
                                                            </Typography>
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="📝 Título de la tarea"
                                            value={newTaskData.titulo}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, titulo: e.target.value })}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover': { borderColor: '#1976d2' },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            type="date"
                                            fullWidth
                                            label="📅 Fecha"
                                            value={newTaskData.fecha}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, fecha: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="🏷️ Tipo"
                                            value={newTaskData.tipo_id}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, tipo_id: e.target.value })}
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
                                            <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                                                ⚡ Prioridad
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                value={newTaskData.prioridad}
                                                onChange={(e) => setNewTaskData({ ...newTaskData, prioridad: e.target.value })}
                                            >
                                                <FormControlLabel
                                                    value="alta"
                                                    control={<Radio sx={{ color: '#FF1744', '&.Mui-checked': { color: '#FF1744' } }} />}
                                                    label="🔴 Alta"
                                                />
                                                <FormControlLabel
                                                    value="media"
                                                    control={<Radio sx={{ color: '#FF9100', '&.Mui-checked': { color: '#FF9100' } }} />}
                                                    label="🟡 Media"
                                                />
                                                <FormControlLabel
                                                    value="baja"
                                                    control={<Radio sx={{ color: '#00E676', '&.Mui-checked': { color: '#00E676' } }} />}
                                                    label="🟢 Baja"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset" fullWidth>
                                            <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
                                                🏢 ¿Asignar empresa?
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                value={asignarEmpresa}
                                                onChange={(e) => {
                                                    setAsignarEmpresa(e.target.value);
                                                    if (e.target.value === 'no') {
                                                        setNewTaskData({ ...newTaskData, company_id: '' });
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
                                                fullWidth
                                                label="🏢 Empresa"
                                                value={newTaskData.company_id}
                                                onChange={(e) => setNewTaskData({ ...newTaskData, company_id: e.target.value })}
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

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="📄 Descripción"
                                            value={newTaskData.descripcion}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, descripcion: e.target.value })}
                                            placeholder="Describe la tarea en detalle..."
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Cancel />}
                                                onClick={cancelNewTask}
                                                sx={{ borderRadius: 2, minWidth: 120 }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<Save />}
                                                onClick={saveNewTask}
                                                disabled={!newTaskData.titulo.trim() || (asignacionTipo === 'manual' && !selectedPasanteId)}
                                                sx={{
                                                    borderRadius: 2,
                                                    minWidth: 120,
                                                    background: 'linear-gradient(45deg, #4caf50 0%, #2e7d32 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #388e3c 0%, #1b5e20 100%)',
                                                    },
                                                }}
                                            >
                                                Crear Tarea
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Zoom>
                )}

                {/* Formulario de edición - Igual que nueva tarea */}
                {editingTask && (
                    <Zoom in>
                        <Card
                            sx={{
                                mb: 3,
                                borderRadius: 3,
                                border: '3px solid #FF9100',
                                boxShadow: '0 8px 32px rgba(255, 145, 0, 0.2)',
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6F00 100%)',
                                    color: 'white',
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    ✏️ Editar Tarea
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                    Modifica los campos que necesites actualizar
                                </Typography>
                            </Box>
                            <Box sx={{ p: 4, background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)' }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="📝 Título de la tarea"
                                            value={editFormData.titulo}
                                            onChange={(e) => setEditFormData({ ...editFormData, titulo: e.target.value })}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover': { borderColor: '#FF9100' },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            type="date"
                                            fullWidth
                                            label="📅 Fecha"
                                            value={editFormData.fecha}
                                            onChange={(e) => setEditFormData({ ...editFormData, fecha: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="🏷️ Tipo"
                                            value={editFormData.tipo_id}
                                            onChange={(e) => setEditFormData({ ...editFormData, tipo_id: e.target.value })}
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
                                            <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1, color: '#FF9100' }}>
                                                ⚡ Prioridad
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                value={editFormData.prioridad}
                                                onChange={(e) => setEditFormData({ ...editFormData, prioridad: e.target.value })}
                                            >
                                                <FormControlLabel
                                                    value="alta"
                                                    control={<Radio sx={{ color: '#FF1744', '&.Mui-checked': { color: '#FF1744' } }} />}
                                                    label="🔴 Alta"
                                                />
                                                <FormControlLabel
                                                    value="media"
                                                    control={<Radio sx={{ color: '#FF9100', '&.Mui-checked': { color: '#FF9100' } }} />}
                                                    label="🟡 Media"
                                                />
                                                <FormControlLabel
                                                    value="baja"
                                                    control={<Radio sx={{ color: '#00E676', '&.Mui-checked': { color: '#00E676' } }} />}
                                                    label="🟢 Baja"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset" fullWidth>
                                            <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1, color: '#FF9100' }}>
                                                🏢 ¿Cambiar empresa?
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                value={editarEmpresa}
                                                onChange={(e) => {
                                                    setEditarEmpresa(e.target.value);
                                                    if (e.target.value === 'no') {
                                                        setEditFormData({ ...editFormData, company_id: '' });
                                                    }
                                                }}
                                            >
                                                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    {editarEmpresa === 'si' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="🏢 Empresa"
                                                value={editFormData.company_id}
                                                onChange={(e) => setEditFormData({ ...editFormData, company_id: e.target.value })}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            >
                                                <MenuItem value="">Sin empresa</MenuItem>
                                                {empresas.map((emp) => (
                                                    <MenuItem key={emp.id} value={emp.id}>
                                                        {emp.nombre}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="📄 Descripción"
                                            value={editFormData.descripcion}
                                            onChange={(e) => setEditFormData({ ...editFormData, descripcion: e.target.value })}
                                            placeholder="Describe la tarea en detalle..."
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Cancel />}
                                                onClick={cancelEditing}
                                                sx={{ borderRadius: 2, minWidth: 120 }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<Save />}
                                                onClick={saveEdit}
                                                disabled={!editFormData.titulo.trim()}
                                                sx={{
                                                    borderRadius: 2,
                                                    minWidth: 120,
                                                    background: 'linear-gradient(45deg, #FF9100 0%, #FF6F00 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #FF8F00 0%, #E65100 100%)',
                                                    },
                                                }}
                                            >
                                                Actualizar
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Zoom>
                )}

                {/* Vista Semanal - Calendario mejorado SIN usuarios, tareas en filas */}
                {viewMode === 'semana' && (
                    <Fade in>
                        <Paper
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            }}
                        >
                            {/* Header del calendario */}
                            <Box
                                sx={{
                                    background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                                    color: 'white',
                                    p: 2,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold">
                                    📅 Calendario Semanal
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {weekDates[0]} - {weekDates[6]}
                                </Typography>
                            </Box>

                            {/* Grid del calendario - ALTURA FIJA PARA ALINEACIÓN */}
                            <Box sx={{ display: 'flex', minHeight: 600 }}>
                                {weekDates.map((date, index) => {
                                    const d = parseLocalDate(date);
                                    const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
                                    const dayNumber = d.getDate();
                                    const month = d.toLocaleDateString('es-ES', { month: 'short' });
                                    const tareasDelDia = tareasPorFecha[date] || [];
                                    const isToday = date === new Date().toISOString().split('T')[0];

                                    return (
                                        <Box
                                            key={date}
                                            sx={{
                                                flex: 1,
                                                borderRight: index < 6 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: alpha('#1976d2', 0.05),
                                                },
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                            onClick={() => handleDateClick(date)}
                                        >
                                            {/* Header del día - MÁS GRANDE PARA HOY */}
                                            <Box
                                                sx={{
                                                    background: getDayGradient(index, isToday),
                                                    color: 'white',
                                                    p: isToday ? 3 : 2, // Más padding para HOY
                                                    textAlign: 'center',
                                                    position: 'relative',
                                                    minHeight: isToday ? 140 : 100, // Más altura para HOY
                                                }}
                                            >
                                                <Typography variant={isToday ? 'h6' : 'body2'} fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                                    {dayName}
                                                </Typography>
                                                <Typography variant={isToday ? 'h2' : 'h4'} fontWeight="bold" sx={{ my: isToday ? 1 : 0 }}>
                                                    {dayNumber}
                                                </Typography>
                                                <Typography variant={isToday ? 'body1' : 'caption'} sx={{ opacity: 0.9 }}>
                                                    {month}
                                                </Typography>
                                                {isToday && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                                                        <Star sx={{ fontSize: 20 }} />
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                            HOY
                                                        </Typography>
                                                        <Star sx={{ fontSize: 20 }} />
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Lista de tareas del día - EN FILAS HORIZONTALES */}
                                            <Box sx={{ p: 1, flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                {tareasDelDia.length === 0 ? (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flex: 1,
                                                            color: 'text.secondary',
                                                        }}
                                                    >
                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                            Sin tareas
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<Add />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                startNewTask(date);
                                                            }}
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            Agregar
                                                        </Button>
                                                    </Box>
                                                ) : (
                                                    <>
                                                        {tareasDelDia.map((tarea, tareaIndex) => (
                                                            <Zoom key={tarea.id} in style={{ transitionDelay: `${tareaIndex * 100}ms` }}>
                                                                <Card
                                                                    sx={{
                                                                        p: 1,
                                                                        borderRadius: 2,
                                                                        borderLeft: `4px solid ${getPriorityColor(tarea.prioridad)}`,
                                                                        bgcolor: getPriorityColor(tarea.prioridad), // COLOR SÓLIDO VIBRANTE
                                                                        color: 'white',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            transform: 'translateX(4px)',
                                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                                                            filter: 'brightness(1.1)',
                                                                        },
                                                                        minHeight: 50,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                    }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDateClick(date);
                                                                    }}
                                                                >
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight="bold"
                                                                            sx={{
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap',
                                                                                fontSize: '0.85rem',
                                                                            }}
                                                                        >
                                                                            {tarea.titulo}
                                                                        </Typography>
                                                                        {tarea.tipo && (
                                                                            <Typography
                                                                                variant="caption"
                                                                                sx={{
                                                                                    opacity: 0.9,
                                                                                    fontSize: '0.7rem',
                                                                                    display: 'block',
                                                                                }}
                                                                            >
                                                                                {tarea.tipo.nombre_tipo}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </Card>
                                                            </Zoom>
                                                        ))}
                                                        <Button
                                                            size="small"
                                                            variant="text"
                                                            startIcon={<Add />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                startNewTask(date);
                                                            }}
                                                            sx={{
                                                                borderRadius: 2,
                                                                color: '#1976d2',
                                                                '&:hover': { bgcolor: alpha('#1976d2', 0.1) },
                                                                mt: 'auto',
                                                            }}
                                                        >
                                                            Agregar
                                                        </Button>
                                                    </>
                                                )}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Paper>
                    </Fade>
                )}

                {/* Vista de Mes y Todas - Lista funcional */}
                {(viewMode === 'mes' || viewMode === 'todas') && (
                    <Fade in>
                        <Box>
                            {filteredTareas.length === 0 ? (
                                <Paper
                                    sx={{
                                        p: 6,
                                        textAlign: 'center',
                                        borderRadius: 3,
                                        background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                                    }}
                                >
                                    <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                                        📝 No hay tareas que mostrar
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        {viewMode === 'mes' ? 'No se encontraron tareas para este mes' : 'No se encontraron tareas'}
                                    </Typography>
                                </Paper>
                            ) : (
                                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                                            color: 'white',
                                            p: 2,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight="bold">
                                            📋 {viewMode === 'mes' ? 'Tareas del Mes' : 'Todas las Tareas'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {filteredTareas.length} tareas encontradas
                                        </Typography>
                                    </Box>
                                    <List disablePadding>
                                        {filteredTareas.map((tarea, index) => (
                                            <Zoom key={tarea.id} in style={{ transitionDelay: `${index * 50}ms` }}>
                                                <Box>
                                                    <ListItem
                                                        sx={{
                                                            py: 2,
                                                            px: 3,
                                                            borderLeft: `6px solid ${getPriorityColor(tarea.prioridad)}`,
                                                            '&:hover': {
                                                                bgcolor: alpha(getPriorityColor(tarea.prioridad), 0.05),
                                                            },
                                                        }}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: getPriorityColor(tarea.prioridad),
                                                                    color: 'white',
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
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                                                    <Typography variant="h6" fontWeight="bold">
                                                                        {tarea.titulo}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={tarea.prioridad.toUpperCase()}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: getPriorityColor(tarea.prioridad),
                                                                            color: 'white',
                                                                            fontWeight: 'bold',
                                                                        }}
                                                                    />
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <Box>
                                                                    <Box
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 2,
                                                                            flexWrap: 'wrap',
                                                                            mb: 1,
                                                                        }}
                                                                    >
                                                                        <Chip
                                                                            icon={<CalendarTodayIcon fontSize="small" />}
                                                                            label={tarea.fecha}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            color="primary"
                                                                        />
                                                                        {tarea.company && (
                                                                            <Chip
                                                                                icon={<BusinessIcon fontSize="small" />}
                                                                                label={tarea.company.name}
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="primary"
                                                                            />
                                                                        )}
                                                                        {tarea.tipo && (
                                                                            <Chip
                                                                                icon={<CategoryIcon fontSize="small" />}
                                                                                label={tarea.tipo.nombre_tipo}
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="primary"
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                    {tarea.descripcion && (
                                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                                            {tarea.descripcion}
                                                                        </Typography>
                                                                    )}
                                                                    {tarea.asignados.length > 0 && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                Asignado a:
                                                                            </Typography>
                                                                            {tarea.asignados.map((asignado) => (
                                                                                <Chip
                                                                                    key={asignado.user_id}
                                                                                    avatar={
                                                                                        <Avatar sx={{ bgcolor: getAvatarColor(asignado.user_name) }}>
                                                                                            {getInitials(asignado.user_name)}
                                                                                        </Avatar>
                                                                                    }
                                                                                    label={asignado.user_name}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                />
                                                                            ))}
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            }
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Tooltip title="Editar tarea">
                                                                    <IconButton
                                                                        onClick={() => startEditing(tarea)}
                                                                        color="primary"
                                                                        sx={{
                                                                            bgcolor: alpha('#1976d2', 0.1),
                                                                            '&:hover': { bgcolor: alpha('#1976d2', 0.2) },
                                                                        }}
                                                                    >
                                                                        <Edit />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title="Eliminar tarea">
                                                                    <IconButton
                                                                        onClick={() => handleDelete(tarea.id)}
                                                                        color="error"
                                                                        sx={{
                                                                            bgcolor: alpha('#f44336', 0.1),
                                                                            '&:hover': { bgcolor: alpha('#f44336', 0.2) },
                                                                        }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                    {index < filteredTareas.length - 1 && <Divider variant="inset" component="li" />}
                                                </Box>
                                            </Zoom>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </Box>
                    </Fade>
                )}

                {/* Vista de Día - Lista editable agrupada por usuarios con botón editar */}
                {viewMode === 'dia' && (
                    <Fade in>
                        <Box>
                            {Object.keys(tareasPorUsuario).length === 0 ? (
                                <Paper
                                    sx={{
                                        p: 6,
                                        textAlign: 'center',
                                        borderRadius: 3,
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
                                        onClick={() => startNewTask(selectedDate || undefined)}
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
                                                mb: 3,
                                                borderRadius: 3,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            {/* Cabecera de usuario */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    p: 3,
                                                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                                                    },
                                                    transition: 'background 0.3s ease',
                                                }}
                                                onClick={() => toggleUserExpanded(userName)}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: 'white',
                                                            color: getAvatarColor(userName),
                                                            fontWeight: 'bold',
                                                            width: 48,
                                                            height: 48,
                                                        }}
                                                    >
                                                        {getInitials(userName)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h5" fontWeight="bold">
                                                            {userName}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                            {tareas.length} {tareas.length === 1 ? 'tarea asignada' : 'tareas asignadas'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton sx={{ color: 'white' }}>
                                                    {expandedUsers[userName] ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </Box>

                                            {/* Lista de tareas del usuario */}
                                            <Collapse in={expandedUsers[userName] ?? true}>
                                                <Box sx={{ p: 2 }}>
                                                    {tareas.map((tarea, index) => (
                                                        <Zoom key={tarea.id} in style={{ transitionDelay: `${index * 100}ms` }}>
                                                            <Card
                                                                sx={{
                                                                    mb: 2,
                                                                    borderRadius: 2,
                                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                                    transition: 'all 0.3s ease',
                                                                    '&:hover': {
                                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                                    },
                                                                    borderLeft: `6px solid ${getPriorityColor(tarea.prioridad)}`,
                                                                }}
                                                            >
                                                                <Box sx={{ p: 3 }}>
                                                                    <Box
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'flex-start',
                                                                            justifyContent: 'space-between',
                                                                            mb: 2,
                                                                        }}
                                                                    >
                                                                        <Box sx={{ flexGrow: 1 }}>
                                                                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                                                                {tarea.titulo}
                                                                            </Typography>
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 1,
                                                                                    flexWrap: 'wrap',
                                                                                }}
                                                                            >
                                                                                <Chip
                                                                                    label={tarea.prioridad.toUpperCase()}
                                                                                    sx={{
                                                                                        bgcolor: getPriorityColor(tarea.prioridad),
                                                                                        color: 'white',
                                                                                        fontWeight: 'bold',
                                                                                    }}
                                                                                />
                                                                                <Chip
                                                                                    icon={<CalendarTodayIcon fontSize="small" />}
                                                                                    label={tarea.fecha}
                                                                                    variant="outlined"
                                                                                    color="primary"
                                                                                />
                                                                                {tarea.tipo && (
                                                                                    <Chip
                                                                                        icon={<CategoryIcon fontSize="small" />}
                                                                                        label={tarea.tipo.nombre_tipo}
                                                                                        variant="outlined"
                                                                                        color="primary"
                                                                                    />
                                                                                )}
                                                                                {tarea.company && (
                                                                                    <Chip
                                                                                        icon={<BusinessIcon fontSize="small" />}
                                                                                        label={tarea.company.name}
                                                                                        variant="outlined"
                                                                                        color="primary"
                                                                                    />
                                                                                )}
                                                                            </Box>
                                                                        </Box>
                                                                        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                                                                            <Tooltip title="Editar tarea">
                                                                                <IconButton
                                                                                    onClick={() => startEditing(tarea)}
                                                                                    color="primary"
                                                                                    sx={{
                                                                                        bgcolor: alpha('#1976d2', 0.1),
                                                                                        '&:hover': { bgcolor: alpha('#1976d2', 0.2) },
                                                                                    }}
                                                                                >
                                                                                    <Edit />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Eliminar tarea">
                                                                                <IconButton
                                                                                    onClick={() => handleDelete(tarea.id)}
                                                                                    color="error"
                                                                                    sx={{
                                                                                        bgcolor: alpha('#f44336', 0.1),
                                                                                        '&:hover': { bgcolor: alpha('#f44336', 0.2) },
                                                                                    }}
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Box>
                                                                    </Box>
                                                                    <Box
                                                                        sx={{
                                                                            p: 2,
                                                                            bgcolor: alpha('#1976d2', 0.05),
                                                                            borderRadius: 2,
                                                                            borderLeft: '4px solid #1976d2',
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            gap: 1,
                                                                        }}
                                                                    >
                                                                        {tarea.descripcion && (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                <strong>Descripción:</strong> {tarea.descripcion}
                                                                            </Typography>
                                                                        )}

                                                                        {tarea.asignados.map((asignado) => (
                                                                            <Box key={asignado.id} sx={{ ml: 1, mb: 1 }}>
                                                                                {editAsignacionId === asignado.id ? (
                                                                                    // MODO EDICIÓN
                                                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                                                        <FormControl component="fieldset" size="small">
                                                                                            <RadioGroup
                                                                                                row
                                                                                                value={editAsignData.estado}
                                                                                                onChange={(e) =>
                                                                                                    setEditAsignData((d) => ({
                                                                                                        ...d,
                                                                                                        estado: e.target.value,
                                                                                                    }))
                                                                                                }
                                                                                            >
                                                                                                <FormControlLabel
                                                                                                    value="pendiente"
                                                                                                    control={<Radio />}
                                                                                                    label="Pendiente"
                                                                                                />
                                                                                                <FormControlLabel
                                                                                                    value="en_revision"
                                                                                                    control={<Radio />}
                                                                                                    label="En revisión"
                                                                                                />
                                                                                                <FormControlLabel
                                                                                                    value="publicada"
                                                                                                    control={<Radio />}
                                                                                                    label="Publicada"
                                                                                                />
                                                                                            </RadioGroup>
                                                                                            <TextField
                                                                                                fullWidth
                                                                                                size="small"
                                                                                                label="Detalle"
                                                                                                value={editAsignData.detalle}
                                                                                                onChange={(e) =>
                                                                                                    setEditAsignData((d) => ({
                                                                                                        ...d,
                                                                                                        detalle: e.target.value,
                                                                                                    }))
                                                                                                }
                                                                                                sx={{ mt: 2 }}
                                                                                            />
                                                                                        </FormControl>
                                                                                        <IconButton size="small" onClick={saveEditAsignacion}>
                                                                                            <Save fontSize="small" />
                                                                                        </IconButton>
                                                                                        <IconButton size="small" onClick={cancelEditAsignacion}>
                                                                                            <Cancel fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Stack>
                                                                                ) : (
                                                                                    // MODO LECTURA
                                                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                                                        <Typography variant="body2" color="text.secondary">
                                                                                            <strong>Estado:</strong> {asignado.estado}
                                                                                        </Typography>
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            onClick={() => startEditAsignacion(asignado)}
                                                                                        >
                                                                                            <Edit fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Stack>
                                                                                )}

                                                                                {/* Detalle siempre visible */}
                                                                                {asignado.detalle && (
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color="text.secondary"
                                                                                        sx={{ ml: 4, mt: 0.5 }}
                                                                                    >
                                                                                        <strong>Detalle:</strong> {asignado.detalle}
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                        ))}
                                                                    </Box>
                                                                </Box>
                                                            </Card>
                                                        </Zoom>
                                                    ))}
                                                </Box>
                                            </Collapse>
                                        </Card>
                                    </Fade>
                                ))
                            )}
                        </Box>
                    </Fade>
                )}

                {/* Botón flotante para agregar tarea - Solo en vista de día */}
                {viewMode === 'dia' && !showNewTaskForm && !editingTask && (
                    <Fab
                        color="primary"
                        aria-label="Nueva tarea rápida"
                        onClick={() => startNewTask(selectedDate || undefined)}
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            background: 'linear-gradient(45deg, #4caf50 0%, #2e7d32 100%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #388e3c 0%, #1b5e20 100%)',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                            zIndex: 1000,
                        }}
                    >
                        <Add />
                    </Fab>
                )}
            </Container>
        </AppLayout>
    );
}
