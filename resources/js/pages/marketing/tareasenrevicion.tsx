'use client';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Add,
    Assignment,
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    Cancel,
    Category as CategoryIcon,
    Edit,
    ExpandLess,
    ExpandMore,
    Person,
    Save,
    Search,
} from '@mui/icons-material';
import {
    Alert,
    alpha,
    Autocomplete,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Collapse,
    Container,
    Fade,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
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
import { debounce } from 'lodash';
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
    empresa: string;
    fecha: string;
    tipo?: { id: number; nombre_tipo: string };
    company?: { id: number; name: string };
    asignados: Asignado[];
    estado: string;
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
    // TODOS LOS HOOKS AL PRINCIPIO
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

    // Estados de vista
    const [viewMode, setViewMode] = useState<'dia'>('dia');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

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
        empresa: '',
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
        empresa: '',
        fecha: '',
        tipo_id: '',
        company_id: '',
    });
    const [asignarEmpresa, setAsignarEmpresa] = useState('no');
    const [editarEmpresa, setEditarEmpresa] = useState('no');

    // Estados de edición de asignaciones
    const [editAsignacionId, setEditAsignacionId] = useState<number | null>(null);
    const [editAsignData, setEditAsignData] = useState<{ estado: string; detalle: string }>({
        estado: '',
        detalle: '',
    });

    const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

    // Estados para edición en tiempo real
    const [savingStates, setSavingStates] = useState<Record<number, boolean>>({});
    const [editingDescripcion, setEditingDescripcion] = useState<number | null>(null);
    const [tempDescripcion, setTempDescripcion] = useState<string>('');

    // Estados para tareas expandidas
    const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});

    // Hooks de Material-UI
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // TODOS LOS useCallback y useMemo AQUÍ
    const fetchData = async () => {
        try {
            const [tareasRes, tiposRes, empresasRes, pasantesRes] = await Promise.all([
                axios.get('/tareas-con-asignaciones'),
                axios.get('/api/tipos'),
                axios.get('/api/companies'),
                axios.get('/api/pasantes'),
            ]);

            const tareasEnRevision = tareasRes.data.filter((t) =>
                t.asignados?.some((a) => a.estado?.toLowerCase().replace(/\s/g, '') === 'en_revision'),
            );

            setTareas(tareasEnRevision);
            setTipos(tiposRes.data);
            setEmpresas(empresasRes.data);
            setPasantes(pasantesRes.data.data);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar datos.');
        } finally {
            setLoading(false);
        }
    };

    // Función para auto-guardar estado (inmediato)
    const autoSaveEstado = useCallback(
        async (asignacionId: number, nuevoEstado: string) => {
            setSavingStates((prev) => ({ ...prev, [asignacionId]: true }));

            try {
                await axios.patch(`/asignaciones/${asignacionId}`, { estado: nuevoEstado });
                await fetchData();
            } catch (err) {
                console.error('Error al actualizar estado:', err);
                setError('No se pudo actualizar el estado');
            } finally {
                setSavingStates((prev) => ({ ...prev, [asignacionId]: false }));
            }
        },
        [fetchData],
    );

    // Función para auto-guardar detalle (con debounce)
    const autoSaveDetalle = useCallback(
        debounce(async (asignacionId: number, nuevoDetalle: string) => {
            setSavingStates((prev) => ({ ...prev, [asignacionId]: true }));

            try {
                await axios.patch(`/asignaciones/${asignacionId}`, { detalle: nuevoDetalle });
                await fetchData();
            } catch (err) {
                console.error('Error al actualizar detalle:', err);
                setError('No se pudo actualizar el detalle');
            } finally {
                setSavingStates((prev) => ({ ...prev, [asignacionId]: false }));
            }
        }, 1000),
        [fetchData],
    );

    // Función para auto-guardar descripción de tarea (con debounce)
    const autoSaveDescripcion = useCallback(
        debounce(async (tareaId: number, nuevaDescripcion: string) => {
            setSavingStates((prev) => ({ ...prev, [tareaId]: true }));

            try {
                await axios.put(`/tareas/${tareaId}`, { descripcion: nuevaDescripcion });
                await fetchData();
                setEditingDescripcion(null);
            } catch (err) {
                console.error('Error al actualizar descripción:', err);
                setError('No se pudo actualizar la descripción');
            } finally {
                setSavingStates((prev) => ({ ...prev, [tareaId]: false }));
            }
        }, 1000),
        [fetchData],
    );

    // Filtrado de tareas para la vista actual
    const filteredTareas = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        let result = tareas;
        const tareasEnRevision = tareas.filter((tarea) =>
            tarea.asignados.some((asignado) => asignado.estado?.toLowerCase().replace(/\s/g, '') === 'en_revision'),
        );

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
    }, [tareas, searchTerm, filterPriority, filterUser]);

    // Agrupar tareas por usuario
    const tareasPorUsuario = useMemo(() => {
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
    }, [filteredTareas]);

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

    // TODOS LOS useEffect AQUÍ
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tareasRes, tiposRes, empresasRes, pasantesRes] = await Promise.all([
                    axios.get('/tareas-con-asignaciones'),
                    axios.get('/api/tipos'),
                    axios.get('/api/companies'),
                    axios.get('/api/pasantes'),
                ]);

                const tareasEnRevision = tareasRes.data.filter((t) =>
                    t.asignados?.some((a) => a.estado?.toLowerCase().replace(/\s/g, '') === 'en_revision'),
                );

                console.log('📌 TAREAS EN REVISIÓN:', tareasEnRevision);

                setTareas(tareasEnRevision); // Solo las que están en revisión
                setTipos(tiposRes.data);
                setEmpresas(empresasRes.data);
                setPasantes(pasantesRes.data.data);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('Hubo un error al cargar los datos. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // ✅ ahora sí está definida
    }, []);

    // Inicializar expandedUsers
    useEffect(() => {
        const initialExpandedState: Record<string, boolean> = {};
        Object.keys(tareasPorUsuario).forEach((userName) => {
            initialExpandedState[userName] = true;
        });
        setExpandedUsers(initialExpandedState);
    }, [tareasPorUsuario]);

    // FUNCIONES REGULARES (NO HOOKS) DESPUÉS DE TODOS LOS HOOKS
    const toggleUserExpanded = (userName: string) => {
        setExpandedUsers((prev) => ({
            ...prev,
            [userName]: !prev[userName],
        }));
    };

    // Funciones de manejo

    // Funciones de edición inline
    const startEditing = (tarea: TareaAsignada) => {
        setEditingTask(tarea.id);
        setEditFormData({
            titulo: tarea.titulo,
            prioridad: tarea.prioridad,
            descripcion: tarea.descripcion,
            empresa: tarea.empresa,
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
            empresa: '',
            fecha: '',
            tipo_id: '',
            company_id: '',
        });
        setEditarEmpresa('no');
    };

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

    // Funciones para nueva tarea
    const startNewTask = () => {
        setShowNewTaskForm(true);
        setNewTaskData({
            titulo: '',
            prioridad: '',
            descripcion: '',
            empresa: '',
            fecha: new Date().toISOString().split('T')[0],
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
            empresa: '',
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

    const tareasFiltradas = filteredTareas
        .filter((t) => (filterUser ? t.asignados.some((a) => a.user_name.includes(filterUser)) : true))
        .filter((t) => (filterPriority ? t.prioridad === filterPriority : true))
        .filter((t) => (searchTerm ? t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) : true));

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
            await axios.patch(`/asignaciones/${editAsignacionId}`, {
                estado: editAsignData.estado,
                detalle: editAsignData.detalle,
            });
            await fetchData();
            setEditAsignacionId(null);
        } catch (err) {
            console.error('Error al actualizar asignación:', err);
            setError('No se pudo actualizar la asignación');
        }
    }

    // Función para iniciar edición de descripción
    const startEditingDescripcion = (tarea: TareaAsignada) => {
        setEditingDescripcion(tarea.id);
        setTempDescripcion(tarea.descripcion || '');
    };

    // Función para cancelar edición de descripción
    const cancelEditingDescripcion = () => {
        setEditingDescripcion(null);
        setTempDescripcion('');
    };

    // Agregar este estilo CSS en el head o como parte del tema
    const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

    const toggleTaskExpanded = (taskId: number) => {
        setExpandedTasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tareas', href: '/tareas' }]}>
            <Head title="Tareas" />
            <style>{spinKeyframes}</style>

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
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Typography variant="h5" fontWeight="bold">
                                📄 Tareas
                            </Typography>
                            <Chip label="Para Revisión" color="warning" variant="outlined" />
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
                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{ display: 'flex', gap: 1 }}></Box>
                        </Box>

                        {/* Filtros */}
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
                                <Autocomplete
                                    options={usuariosUnicos}
                                    getOptionLabel={(option) => option}
                                    value={filterUser || null}
                                    onChange={(_, newValue) => setFilterUser(newValue || '')}
                                    clearOnEscape
                                    sx={{ minWidth: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="👤 Filtrar por Usuario" placeholder="Filtrar por usuario" fullWidth />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Autocomplete
                                    options={['alta', 'media', 'baja']}
                                    getOptionLabel={(option) => option.charAt(0).toUpperCase() + option.slice(1)}
                                    value={filterPriority || null}
                                    onChange={(_, newValue) => setFilterPriority(newValue || '')}
                                    clearOnEscape
                                    sx={{ minWidth: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="⚡ Filtrar por Prioridad" placeholder="Filtrar por prioridad" fullWidth />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        {/* Estadísticas */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip
                                icon={<Assignment />}
                                label={`${tareasFiltradas.length} tareas de hoy`}
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
                                border: '2px solid #1976d2',
                                boxShadow: '0 6px 24px rgba(25, 118, 210, 0.15)',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                    color: 'white',
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold">
                                    ✨ Nueva Tarea para Hoy
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Completa los campos para crear la tarea
                                </Typography>
                            </Box>
                            <Box sx={{ p: 4, background: 'white' }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            options={tareas}
                                            getOptionLabel={(option) => `${option.titulo} - ${option.fecha}`}
                                            filterOptions={(options, { inputValue }) =>
                                                options.filter((option) => option.titulo.toLowerCase().includes(inputValue.toLowerCase()))
                                            }
                                            onChange={(_, tarea) => {
                                                if (tarea) {
                                                    // Puedes decidir copiar datos al formulario si quieres
                                                    setNewTaskData((prev) => ({
                                                        ...prev,
                                                        titulo: tarea.titulo,
                                                        descripcion: tarea.descripcion,
                                                        empresa: tarea.empresa,
                                                    }));
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="🔍 Buscar tareas existentes"
                                                    placeholder="Escribe para buscar una tarea similar..."
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="📝 Título"
                                            value={newTaskData.titulo}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, titulo: e.target.value })}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="📅 Fecha"
                                            type="date"
                                            value={newTaskData.fecha}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, fecha: e.target.value })}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={tipos}
                                            getOptionLabel={(option) => option.nombre}
                                            value={tipos.find((t) => t.id === Number(newTaskData.tipo_id)) || null}
                                            onChange={(_, newValue) =>
                                                setNewTaskData({ ...newTaskData, tipo_id: newValue ? String(newValue.id) : '' })
                                            }
                                            sx={{ minWidth: 280 }} // 👈 Aumenta el ancho mínimo
                                            renderInput={(params) => <TextField {...params} label="🏷️ Tipo de tarea" fullWidth />}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset">
                                            <FormLabel>⚡ Prioridad</FormLabel>
                                            <RadioGroup
                                                row
                                                value={newTaskData.prioridad}
                                                onChange={(e) => setNewTaskData({ ...newTaskData, prioridad: e.target.value })}
                                            >
                                                <FormControlLabel value="alta" control={<Radio />} label="Alta" />
                                                <FormControlLabel value="media" control={<Radio />} label="Media" />
                                                <FormControlLabel value="baja" control={<Radio />} label="Baja" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <FormLabel>👥 Asignación</FormLabel>
                                            <RadioGroup
                                                row
                                                value={asignacionTipo}
                                                onChange={(e) => setAsignacionTipo(e.target.value as 'aleatoria' | 'manual')}
                                            >
                                                <FormControlLabel value="aleatoria" control={<Radio />} label="Aleatoria" />
                                                <FormControlLabel value="manual" control={<Radio />} label="Manual" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    {asignacionTipo === 'manual' && (
                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                options={pasantes}
                                                getOptionLabel={(option) => `${option.name} (${option.email})`}
                                                value={pasantes.find((p) => String(p.id) === selectedPasanteId) || null}
                                                onChange={(_, newValue) => setSelectedPasanteId(newValue ? String(newValue.id) : '')}
                                                sx={{ minWidth: 300 }} // 👈 ancho mínimo mejorado
                                                renderInput={(params) => <TextField {...params} label="🧑‍💼 Seleccionar Pasante" fullWidth />}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset">
                                            <FormLabel>🏢 ¿Asignar empresa?</FormLabel>
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
                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                options={empresas}
                                                getOptionLabel={(option) => option.nombre}
                                                value={empresas.find((e) => e.id === Number(newTaskData.company_id)) || null}
                                                onChange={(_, newValue) =>
                                                    setNewTaskData({ ...newTaskData, company_id: newValue ? String(newValue.id) : '' })
                                                }
                                                sx={{ minWidth: 280 }} // 👈 Puedes subir hasta 320 o más si gustas
                                                renderInput={(params) => <TextField {...params} label="🏢 Seleccionar Empresa" fullWidth />}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <TextField
                                            label="📄 Descripción"
                                            multiline
                                            rows={3}
                                            value={newTaskData.descripcion}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, descripcion: e.target.value })}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="📄 Contenido"
                                            multiline
                                            rows={3}
                                            value={newTaskData.empresa}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, empresa: e.target.value })}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={cancelNewTask}
                                            startIcon={<Cancel />}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1,
                                                fontWeight: 'bold',
                                                borderColor: '#9e9e9e',
                                                color: '#424242',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5',
                                                    borderColor: '#616161',
                                                },
                                            }}
                                        >
                                            Cancelar
                                        </Button>

                                        <Button
                                            variant="contained"
                                            onClick={saveNewTask}
                                            disabled={!newTaskData.titulo.trim() || (asignacionTipo === 'manual' && !selectedPasanteId)}
                                            startIcon={<Save />}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1,
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(45deg, #4caf50 0%, #2e7d32 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #388e3c 0%, #1b5e20 100%)',
                                                    transform: 'scale(1.02)',
                                                },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            Crear Tarea
                                        </Button>
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
                                    <Grid item xs={12} md={4}>
                                        <Autocomplete
                                            options={tipos}
                                            getOptionLabel={(option) => option.nombre}
                                            value={tipos.find((t) => t.id === Number(editFormData.tipo_id)) || null}
                                            onChange={(_, newValue) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    tipo_id: newValue ? String(newValue.id) : '',
                                                })
                                            }
                                            sx={{ minWidth: 300 }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="🏷️ Tipo de tarea" placeholder="Selecciona un tipo" fullWidth />
                                            )}
                                        />
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
                                                    label="Alta"
                                                />
                                                <FormControlLabel
                                                    value="media"
                                                    control={<Radio sx={{ color: '#FF9100', '&.Mui-checked': { color: '#FF9100' } }} />}
                                                    label="Media"
                                                />
                                                <FormControlLabel
                                                    value="baja"
                                                    control={<Radio sx={{ color: '#00E676', '&.Mui-checked': { color: '#00E676' } }} />}
                                                    label="Baja"
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
                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                options={empresas}
                                                getOptionLabel={(option) => option.nombre}
                                                value={empresas.find((e) => e.id === Number(editFormData.company_id)) || null}
                                                onChange={(_, newValue) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        company_id: newValue ? String(newValue.id) : '',
                                                    })
                                                }
                                                sx={{ minWidth: 300 }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="🏢 Empresa" placeholder="Selecciona una empresa" fullWidth />
                                                )}
                                            />
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
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="📄 Contenido"
                                            value={editFormData.empresa}
                                            onChange={(e) => setEditFormData({ ...editFormData, empresa: e.target.value })}
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

                {/* Vista de Tareas de Hoy - Lista editable agrupada por usuarios */}
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
                                    📝 No hay tareas para hoy
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 3 }}>
                                    No se encontraron tareas programadas para hoy
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => startNewTask()}
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
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            {/* Header compacto de la tarea */}
                                                            <Box
                                                                onClick={() => toggleTaskExpanded(tarea.id)}
                                                                sx={{
                                                                    p: 2,
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    bgcolor: expandedTasks[tarea.id] ? alpha('#1976d2', 0.02) : 'transparent',
                                                                    '&:hover': {
                                                                        bgcolor: alpha('#1976d2', 0.05),
                                                                    },
                                                                    transition: 'background-color 0.2s ease',
                                                                }}
                                                            >
                                                                <Box sx={{ flexGrow: 1 }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        fontWeight="bold"
                                                                        sx={{
                                                                            mb: 1,
                                                                            color: expandedTasks[tarea.id] ? '#1976d2' : 'text.primary',
                                                                        }}
                                                                    >
                                                                        {tarea.titulo}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                                        <Chip
                                                                            size="small"
                                                                            label={tarea.prioridad.toUpperCase()}
                                                                            sx={{
                                                                                bgcolor: getPriorityColor(tarea.prioridad),
                                                                                color: 'white',
                                                                                fontWeight: 'bold',
                                                                                fontSize: '0.75rem',
                                                                            }}
                                                                        />
                                                                        <Chip
                                                                            size="small"
                                                                            icon={<CalendarTodayIcon fontSize="small" />}
                                                                            label={tarea.fecha}
                                                                            variant="outlined"
                                                                            color="primary"
                                                                        />
                                                                        {tarea.tipo && (
                                                                            <Chip
                                                                                size="small"
                                                                                icon={<CategoryIcon fontSize="small" />}
                                                                                label={tarea.tipo.nombre_tipo}
                                                                                variant="outlined"
                                                                                color="primary"
                                                                            />
                                                                        )}
                                                                        {tarea.company && (
                                                                            <Chip
                                                                                size="small"
                                                                                icon={<BusinessIcon fontSize="small" />}
                                                                                label={tarea.company.name}
                                                                                variant="outlined"
                                                                                color="primary"
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    {/* Botones de acción siempre visibles */}
                                                                    <Tooltip title="Editar tarea">
                                                                        <IconButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                startEditing(tarea);
                                                                            }}
                                                                            size="small"
                                                                            color="primary"
                                                                            sx={{
                                                                                bgcolor: alpha('#1976d2', 0.1),
                                                                                '&:hover': { bgcolor: alpha('#1976d2', 0.2) },
                                                                            }}
                                                                        >
                                                                            <Edit fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    {/* <Tooltip title="Eliminar tarea">
                                                                        <IconButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDelete(tarea.id);
                                                                            }}
                                                                            size="small"
                                                                            color="error"
                                                                            sx={{
                                                                                bgcolor: alpha('#f44336', 0.1),
                                                                                '&:hover': { bgcolor: alpha('#f44336', 0.2) },
                                                                            }}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip> */}

                                                                    {/* Icono de expandir/colapsar */}
                                                                    <IconButton size="small" sx={{ color: '#1976d2' }}>
                                                                        {expandedTasks[tarea.id] ? <ExpandLess /> : <ExpandMore />}
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>

                                                            {/* Contenido expandible de la tarea */}
                                                            <Collapse in={expandedTasks[tarea.id] ?? false}>
                                                                <Box sx={{ px: 3, pb: 3 }}>
                                                                    <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.1)', pt: 2 }}>
                                                                        {/* Sección de asignaciones */}
                                                                        {tarea.asignados.map((asignado) => (
                                                                            <Box
                                                                                key={asignado.id}
                                                                                sx={{
                                                                                    mb: 3,
                                                                                    p: 2,
                                                                                    borderRadius: 2,
                                                                                    bgcolor: alpha('#1976d2', 0.02),
                                                                                    border: '1px solid rgba(25, 118, 210, 0.1)',
                                                                                }}
                                                                            >
                                                                                {/* Estado - Edición en tiempo real */}
                                                                                <Box sx={{ mb: 2 }}>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color="text.secondary"
                                                                                        sx={{
                                                                                            mb: 1,
                                                                                            fontWeight: 'bold',
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            gap: 1,
                                                                                        }}
                                                                                    >
                                                                                        📊 Estado de la tarea:
                                                                                        {savingStates[asignado.id] && (
                                                                                            <Box
                                                                                                sx={{
                                                                                                    width: 16,
                                                                                                    height: 16,
                                                                                                    border: '2px solid #1976d2',
                                                                                                    borderTop: '2px solid transparent',
                                                                                                    borderRadius: '50%',
                                                                                                    animation: 'spin 1s linear infinite',
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </Typography>
                                                                                    <FormControl component="fieldset" size="small">
                                                                                        <RadioGroup
                                                                                            row
                                                                                            value={asignado.estado}
                                                                                            onChange={(e) =>
                                                                                                autoSaveEstado(asignado.id, e.target.value)
                                                                                            }
                                                                                            sx={{ gap: 2, flexWrap: 'wrap' }}
                                                                                        >
                                                                                            <FormControlLabel
                                                                                                value="pendiente"
                                                                                                control={
                                                                                                    <Radio
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                            color: '#FF9100',
                                                                                                            '&.Mui-checked': { color: '#FF9100' },
                                                                                                            '&:hover': {
                                                                                                                bgcolor: alpha('#FF9100', 0.1),
                                                                                                            },
                                                                                                        }}
                                                                                                    />
                                                                                                }
                                                                                                label={
                                                                                                    <Typography
                                                                                                        variant="body2"
                                                                                                        sx={{ fontSize: '0.875rem' }}
                                                                                                    >
                                                                                                        Pendiente
                                                                                                    </Typography>
                                                                                                }
                                                                                            />
                                                                                            <FormControlLabel
                                                                                                value="en_revision"
                                                                                                control={
                                                                                                    <Radio
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                            color: '#2196F3',
                                                                                                            '&.Mui-checked': { color: '#2196F3' },
                                                                                                            '&:hover': {
                                                                                                                bgcolor: alpha('#2196F3', 0.1),
                                                                                                            },
                                                                                                        }}
                                                                                                    />
                                                                                                }
                                                                                                label={
                                                                                                    <Typography
                                                                                                        variant="body2"
                                                                                                        sx={{ fontSize: '0.875rem' }}
                                                                                                    >
                                                                                                        En revisión
                                                                                                    </Typography>
                                                                                                }
                                                                                            />
                                                                                            <FormControlLabel
                                                                                                value="corregir"
                                                                                                control={
                                                                                                    <Radio
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                            color: '#2196F3',
                                                                                                            '&.Mui-checked': { color: '#2196F3' },
                                                                                                            '&:hover': {
                                                                                                                bgcolor: alpha('#2196F3', 0.1),
                                                                                                            },
                                                                                                        }}
                                                                                                    />
                                                                                                }
                                                                                                label={
                                                                                                    <Typography
                                                                                                        variant="body2"
                                                                                                        sx={{ fontSize: '0.875rem' }}
                                                                                                    >
                                                                                                        Corregir
                                                                                                    </Typography>
                                                                                                }
                                                                                            />
                                                                                            <FormControlLabel
                                                                                                value="publicada"
                                                                                                control={
                                                                                                    <Radio
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                            color: '#4CAF50',
                                                                                                            '&.Mui-checked': { color: '#4CAF50' },
                                                                                                            '&:hover': {
                                                                                                                bgcolor: alpha('#4CAF50', 0.1),
                                                                                                            },
                                                                                                        }}
                                                                                                    />
                                                                                                }
                                                                                                label={
                                                                                                    <Typography
                                                                                                        variant="body2"
                                                                                                        sx={{ fontSize: '0.875rem' }}
                                                                                                    >
                                                                                                        Publicada
                                                                                                    </Typography>
                                                                                                }
                                                                                            />
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                </Box>

                                                                                {/* Detalle - Edición en tiempo real */}
                                                                                <Box sx={{ mb: 2 }}>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color="text.secondary"
                                                                                        sx={{
                                                                                            mb: 1,
                                                                                            fontWeight: 'bold',
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            gap: 1,
                                                                                        }}
                                                                                    >
                                                                                        📝 Detalle del progreso:
                                                                                        {savingStates[asignado.id] && (
                                                                                            <Typography
                                                                                                variant="caption"
                                                                                                color="primary"
                                                                                                sx={{ fontStyle: 'italic' }}
                                                                                            >
                                                                                                Guardando...
                                                                                            </Typography>
                                                                                        )}
                                                                                    </Typography>
                                                                                    <TextField
                                                                                        fullWidth
                                                                                        size="small"
                                                                                        multiline
                                                                                        rows={2}
                                                                                        placeholder="Escribe aquí los detalles del progreso..."
                                                                                        defaultValue={asignado.detalle || ''}
                                                                                        onChange={(e) => autoSaveDetalle(asignado.id, e.target.value)}
                                                                                        sx={{
                                                                                            '& .MuiOutlinedInput-root': {
                                                                                                borderRadius: 2,
                                                                                                bgcolor: 'white',
                                                                                                '&:hover': {
                                                                                                    bgcolor: 'white',
                                                                                                    borderColor: '#1976d2',
                                                                                                },
                                                                                                '&.Mui-focused': {
                                                                                                    bgcolor: 'white',
                                                                                                    borderColor: '#1976d2',
                                                                                                },
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            </Box>
                                                                        ))}

                                                                        {/* Descripción de la tarea - Edición en tiempo real */}
                                                                        <Box sx={{ mt: 2 }}>
                                                                            <Typography
                                                                                variant="body2"
                                                                                color="text.secondary"
                                                                                sx={{
                                                                                    mb: 1,
                                                                                    fontWeight: 'bold',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 1,
                                                                                }}
                                                                            >
                                                                                📄 Descripción de la tarea:
                                                                                {savingStates[tarea.id] && (
                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        color="primary"
                                                                                        sx={{ fontStyle: 'italic' }}
                                                                                    >
                                                                                        Guardando...
                                                                                    </Typography>
                                                                                )}
                                                                            </Typography>
                                                                            {editingDescripcion === tarea.id ? (
                                                                                <TextField
                                                                                    fullWidth
                                                                                    multiline
                                                                                    rows={3}
                                                                                    value={tempDescripcion}
                                                                                    onChange={(e) => {
                                                                                        setTempDescripcion(e.target.value);
                                                                                        autoSaveDescripcion(tarea.id, e.target.value);
                                                                                    }}
                                                                                    onBlur={() => setEditingDescripcion(null)}
                                                                                    autoFocus
                                                                                    placeholder="Describe la tarea en detalle..."
                                                                                    sx={{
                                                                                        '& .MuiOutlinedInput-root': {
                                                                                            borderRadius: 2,
                                                                                            bgcolor: 'white',
                                                                                            '&:hover': { borderColor: '#1976d2' },
                                                                                        },
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <Box
                                                                                    onClick={() => startEditingDescripcion(tarea)}
                                                                                    sx={{
                                                                                        p: 2,
                                                                                        borderRadius: 2,
                                                                                        bgcolor: 'white',
                                                                                        border: '1px dashed rgba(25, 118, 210, 0.3)',
                                                                                        cursor: 'pointer',
                                                                                        transition: 'all 0.2s ease',
                                                                                        '&:hover': {
                                                                                            bgcolor: alpha('#1976d2', 0.02),
                                                                                            borderColor: '#1976d2',
                                                                                            borderStyle: 'solid',
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color={tarea.descripcion ? 'text.primary' : 'text.secondary'}
                                                                                        sx={{
                                                                                            fontStyle: tarea.descripcion ? 'normal' : 'italic',
                                                                                            lineHeight: 1.5,
                                                                                        }}
                                                                                    >
                                                                                        {tarea.descripcion ||
                                                                                            'Haz clic para agregar una descripción...'}
                                                                                    </Typography>
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </Collapse>
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
            </Container>
        </AppLayout>
    );

    function groupByUser(tareas: TareaAsignada[]) {
        const grouped: { [key: string]: TareaAsignada[] } = {};
        tareas.forEach((tarea) => {
            tarea.asignados.forEach((asignado) => {
                const userName = asignado.user_name;
                if (!grouped[userName]) {
                    grouped[userName] = [];
                }
                grouped[userName].push(tarea);
            });
        });
        return grouped;
    }
}
