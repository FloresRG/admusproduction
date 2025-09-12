'use client';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Add,
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    Cancel,
    Category as CategoryIcon,
    Edit,
    ExpandLess,
    ExpandMore,
    Save,
    Search,
    SwapHoriz,
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
    Fab,
    Fade,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
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
    id: number;
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
}

interface TipoTarea {
    id: number;
    nombre: string;
}

interface Empresa {
    id: number;
    name: string;
}

interface Usuario {
    id: number;
    name: string;
    email: string;
}

export default function Tareas() {
    // Estados principales
    const [tareas, setTareas] = useState<TareaAsignada[]>([]);
    const [tipos, setTipos] = useState<TipoTarea[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUser, setFilterUser] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('');

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
    const [asignacionTipo, setAsignacionTipo] = useState<'aleatoria' | 'manual'>('aleatoria');
    const [selectedPasanteId, setSelectedPasanteId] = useState<string>('');
    const [asignarEmpresa, setAsignarEmpresa] = useState('no');

    // Estados de edición
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
    const [editarEmpresa, setEditarEmpresa] = useState('no');

    // Estados para cambio de pasante
    const [taskToChange, setTaskToChange] = useState<number | null>(null);
    const [newUserId, setNewUserId] = useState<number | null>(null);

    // Estados de vista
    const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
    const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
    const [savingStates, setSavingStates] = useState<Record<number, boolean>>({});

    // Estados para edición en tiempo real
    const [editingDescripcion, setEditingDescripcion] = useState<number | null>(null);
    const [tempDescripcion, setTempDescripcion] = useState<string>('');

    // Hooks de Material-UI
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Función principal para cargar datos
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [tareasRes, tiposRes, empresasRes, usuariosRes] = await Promise.all([
                axios.get('/tareas-con-asignaciones'),
                axios.get('/api/tipos'),
                axios.get('/api/companies'),
                axios.get('/api/pasantes'),
            ]);

            setTareas(tareasRes.data);
            setTipos(tiposRes.data);
            setEmpresas(empresasRes.data);
            setUsuarios(usuariosRes.data.data);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Hubo un error al cargar los datos. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para auto-guardar estado
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

    // Función para auto-guardar detalle con debounce
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

    // Función para auto-guardar descripción con debounce
    const autoSaveDescripcion = useCallback(
        debounce(async (tareaId: number, nuevaDescripcion: string) => {
            setSavingStates((prev) => ({ ...prev, [tareaId]: true }));

            try {
                await axios.patch(`/tareas/${tareaId}/descripcion`, {
                    descripcion: nuevaDescripcion,
                });
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

    // Filtrado de tareas
    const filteredTareas = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        let result = tareas.filter((t) => t.fecha === today);

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

    // Obtener usuarios únicos
    const usuariosUnicos = useMemo(() => {
        const setNames = new Set<string>();
        tareas.forEach((t) => {
            t.asignados.forEach((a) => {
                setNames.add(a.user_name);
            });
        });
        return Array.from(setNames).sort();
    }, [tareas]);

    // Effects
    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    const toggleTaskExpanded = (taskId: number) => {
        setExpandedTasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    // Funciones de edición
    const handleEdit = (tarea: TareaAsignada) => {
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
                company_id: newTaskData.company_id ? Number(newTaskData.company_id) : null, // ✅ aquí se convierte a número
                asignacion_aleatoria: asignacionTipo === 'aleatoria',
                pasante_id: asignacionTipo === 'manual' ? Number(selectedPasanteId) : null,
            };

            console.log('🟦 Payload que se envía al backend:', payload); // 👈 AQUÍ

            await axios.post('/create/tareas', payload);
            setShowNewTaskForm(false);
            fetchData();
            setAsignacionTipo('aleatoria');
            setSelectedPasanteId('');
        } catch (err) {
            console.error('Error al crear tarea:', err);
            setError('Error al crear la tarea');
        }
    };

    // Funciones para cambio de pasante
    const handleChangeUser = async (taskId: number) => {
        if (!newUserId) return;

        try {
            // Buscar la asignación de esta tarea
            const tarea = tareas.find((t) => t.id === taskId);
            if (!tarea || !tarea.asignados.length) return;

            const asignacionId = tarea.asignados[0].id; // Tomar la primera asignación

            await axios
                .delete(`/asignaciones/reasignar/${asignacionId}`, {
                    data: {
                        user_id: newUserId,
                    },
                })
                .then((res) => {
                    console.log(res.data.message);
                    // refresca la vista si deseas
                })
                .catch((err) => {
                    console.error('Error al reasignar:', err);
                });

            setTaskToChange(null);
            setNewUserId(null);
            fetchData();
        } catch (err) {
            console.error('Error al cambiar editor:', err);
            setError('Error al cambiar el editor');
        }
    };

    // Funciones para edición de descripción
    const startEditingDescripcion = (tarea: TareaAsignada) => {
        setEditingDescripcion(tarea.id);
        setTempDescripcion(tarea.descripcion || '');
    };

    const cancelEditingDescripcion = () => {
        setEditingDescripcion(null);
        setTempDescripcion('');
    };

    // Funciones de utilidad
    const getPriorityColor = (prioridad: string) => {
        switch (prioridad.toLowerCase()) {
            case 'alta':
                return '#FF1744';
            case 'media':
                return '#FF9100';
            case 'baja':
                return '#00E676';
            default:
                return '#9E9E9E';
        }
    };

    const getAvatarColor = (name: string) => {
        const colors = ['#1976d2', '#1565c0', '#0d47a1', '#2196f3', '#0288d1', '#01579b', '#03a9f4', '#00b0ff', '#0091ea', '#3f51b5'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // CSS para animaciones
    const spinKeyframes = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

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
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                📅 Tareas de Hoy
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                Gestiona y edita tus tareas del día de manera eficiente
                            </Typography>
                            {/* Controles principales */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                <Box sx={{ flexGrow: 1 }} />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        onClick={startNewTask}
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
                                        Nueva Tarea Para Hoy
                                    </Button>
                                </Box>
                            </Box>
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
                    </Stack>
                </Paper>

                {/* Formulario para nueva tarea */}
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
                                                options={usuarios}
                                                getOptionLabel={(option) => `${option.name} (${option.email})`}
                                                value={usuarios.find((p) => String(p.id) === selectedPasanteId) || null}
                                                onChange={(_, newValue) => setSelectedPasanteId(newValue ? String(newValue.id) : '')}
                                                sx={{ minWidth: 300 }} // 👈 ancho mínimo mejorado
                                                renderInput={(params) => <TextField {...params} label="🧑‍💼 Seleccionar Usuario" fullWidth />}
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
                                                getOptionLabel={(option) => option.nombre || option.name || ''}
                                                value={empresas.find((e) => e.id === Number(newTaskData.company_id)) || null}
                                                onChange={(_, newValue) =>
                                                    setNewTaskData({
                                                        ...newTaskData,
                                                        company_id: newValue ? String(newValue.id) : '',
                                                    })
                                                }
                                                sx={{ minWidth: 300 }}
                                                renderInput={(params) => <TextField {...params} label="🏢 Seleccionar Empresa" fullWidth />}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <TextField
                                            label="📄 Breve Descripción"
                                            multiline
                                            rows={3}
                                            value={newTaskData.descripcion}
                                            onChange={(e) => setNewTaskData({ ...newTaskData, descripcion: e.target.value })}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="📄 Agrega Contenido"
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
                                            sx={{ borderRadius: 2, px: 3, py: 1 }}
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
                                                background: 'linear-gradient(45deg, #4caf50 0%, #2e7d32 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #388e3c 0%, #1b5e20 100%)',
                                                },
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

                {/* Formulario de edición */}
                {editingTask && (
                    <Zoom in>
                        <Card
                            sx={{
                                mb: 3,
                                borderRadius: 3,
                                border: '3px solid #FF9100',
                                boxShadow: '0 8px 32px rgba(255, 145, 0, 0.2)',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #FF9100 0%, #FF6F00 100%)',
                                    color: 'white',
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold">
                                    ✏️ Editar Tarea
                                </Typography>
                            </Box>
                            <Box sx={{ p: 4 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="📝 Título"
                                            value={editFormData.titulo}
                                            onChange={(e) => setEditFormData({ ...editFormData, titulo: e.target.value })}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            type="date"
                                            fullWidth
                                            label="📅 Fecha"
                                            value={editFormData.fecha}
                                            onChange={(e) => setEditFormData({ ...editFormData, fecha: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
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
                                            renderInput={(params) => <TextField {...params} label="🏷️ Tipo de tarea" fullWidth />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset" fullWidth>
                                            <FormLabel>⚡ Prioridad</FormLabel>
                                            <RadioGroup
                                                row
                                                value={editFormData.prioridad}
                                                onChange={(e) => setEditFormData({ ...editFormData, prioridad: e.target.value })}
                                            >
                                                <FormControlLabel value="alta" control={<Radio />} label="Alta" />
                                                <FormControlLabel value="media" control={<Radio />} label="Media" />
                                                <FormControlLabel value="baja" control={<Radio />} label="Baja" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset" fullWidth>
                                            <FormLabel>🏢 ¿Cambiar empresa?</FormLabel>
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
                                                getOptionLabel={(option) => option.nombre || option.name || ''}
                                                value={empresas.find((e) => e.id === Number(editFormData.company_id)) || null}
                                                onChange={(_, newValue) =>
                                                    setEditFormData({
                                                        ...editFormData,
                                                        company_id: newValue ? String(newValue.id) : '',
                                                    })
                                                }
                                                sx={{ minWidth: 300 }}
                                                renderInput={(params) => <TextField {...params} label="🏢 Seleccionar Empresa" fullWidth />}
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
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button variant="outlined" startIcon={<Cancel />} onClick={cancelEditing}>
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<Save />}
                                                onClick={saveEdit}
                                                disabled={!editFormData.titulo.trim()}
                                                sx={{
                                                    background: 'linear-gradient(45deg, #FF9100 0%, #FF6F00 100%)',
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

                {/* Vista de Tareas */}
                <Fade in>
                    <Box>
                        {Object.keys(tareasPorUsuario).length === 0 ? (
                            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                                    📝 No hay tareas para hoy
                                </Typography>
                                <Button variant="contained" startIcon={<Add />} onClick={startNewTask}>
                                    Crear primera tarea
                                </Button>
                            </Paper>
                        ) : (
                            Object.entries(tareasPorUsuario).map(([userName, tareas], userIndex) => (
                                <Fade key={userName} in timeout={300 + userIndex * 100}>
                                    <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
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
                                                                borderLeft: `6px solid ${getPriorityColor(tarea.prioridad)}`,
                                                            }}
                                                        >
                                                            {/* Header de la tarea */}
                                                            <Box
                                                                onClick={() => toggleTaskExpanded(tarea.id)}
                                                                sx={{
                                                                    p: 2,
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    '&:hover': { bgcolor: alpha('#1976d2', 0.05) },
                                                                }}
                                                            >
                                                                <Box sx={{ flexGrow: 1 }}>
                                                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
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
                                                                    {/* Botones de acción */}
                                                                    <Tooltip title="Editar tarea">
                                                                        <IconButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEdit(tarea);
                                                                            }}
                                                                            size="small"
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

                                                                    <Tooltip title="Cambiar editor">
                                                                        <IconButton
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setTaskToChange(tarea.id);
                                                                            }}
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor: alpha('#4caf50', 0.1),
                                                                                '&:hover': { bgcolor: alpha('#4caf50', 0.2) },
                                                                            }}
                                                                        >
                                                                            <SwapHoriz fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                    <IconButton size="small" sx={{ color: '#1976d2' }}>
                                                                        {expandedTasks[tarea.id] ? <ExpandLess /> : <ExpandMore />}
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>

                                                            {/* Formulario de cambio de pasante */}
                                                            {tarea.id === taskToChange && (
                                                                <Box
                                                                    sx={{
                                                                        p: 3,
                                                                        bgcolor: alpha('#4caf50', 0.05),
                                                                        borderTop: '1px solid rgba(0,0,0,0.1)',
                                                                    }}
                                                                >
                                                                    <Typography variant="h6" sx={{ mb: 2, color: '#4caf50', fontWeight: 'bold' }}>
                                                                        🔄 Cambiar Editor
                                                                    </Typography>
                                                                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                                                        <InputLabel>Seleccionar Nuevo Editor</InputLabel>
                                                                        <Select
                                                                            value={newUserId ?? ''}
                                                                            onChange={(e) => setNewUserId(Number(e.target.value))}
                                                                            label="Seleccionar Nuevo Editor"
                                                                        >
                                                                            {usuarios.map((user) => (
                                                                                <MenuItem key={user.id} value={user.id}>
                                                                                    {user.name} ({user.email})
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            onClick={() => {
                                                                                setTaskToChange(null);
                                                                                setNewUserId(null);
                                                                            }}
                                                                            size="small"
                                                                        >
                                                                            Cancelar
                                                                        </Button>
                                                                        <Button
                                                                            variant="contained"
                                                                            onClick={() => handleChangeUser(tarea.id)}
                                                                            disabled={!newUserId}
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor: '#4caf50',
                                                                                '&:hover': { bgcolor: '#388e3c' },
                                                                            }}
                                                                        >
                                                                            Confirmar cambio
                                                                        </Button>
                                                                    </Box>
                                                                </Box>
                                                            )}

                                                            {/* Contenido expandible */}
                                                            <Collapse in={expandedTasks[tarea.id] ?? false}>
                                                                <Box sx={{ px: 3, pb: 3 }}>
                                                                    <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.1)', pt: 2 }}>
                                                                        {/* Asignaciones */}
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
                                                                                {/* Estado */}
                                                                                <Box sx={{ mb: 2 }}>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color="text.secondary"
                                                                                        sx={{ mb: 1, fontWeight: 'bold' }}
                                                                                    >
                                                                                        📊 Estado de la tarea:
                                                                                        {savingStates[asignado.id] && (
                                                                                            <Box
                                                                                                component="span"
                                                                                                sx={{
                                                                                                    ml: 1,
                                                                                                    display: 'inline-block',
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
                                                                                                control={<Radio size="small" />}
                                                                                                label="Pendiente"
                                                                                            />
                                                                                            <FormControlLabel
                                                                                                value="en_revision"
                                                                                                control={<Radio size="small" />}
                                                                                                label="En revisión"
                                                                                            />
                                                                                            <FormControlLabel
                                                                                                value="corregir"
                                                                                                control={<Radio size="small" />}
                                                                                                label="Corregir"
                                                                                            />
                                                                                            <FormControlLabel
                                                                                                value="publicada"
                                                                                                control={<Radio size="small" />}
                                                                                                label="Publicada"
                                                                                            />
                                                                                        </RadioGroup>
                                                                                    </FormControl>
                                                                                </Box>

                                                                                {/* Detalle */}
                                                                                <Box sx={{ mb: 2 }}>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color="text.secondary"
                                                                                        sx={{ mb: 1, fontWeight: 'bold' }}
                                                                                    >
                                                                                        📝 Detalle del progreso de: {asignado.user_name}
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
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            </Box>
                                                                        ))}

                                                                        {/* Descripción de la tarea */}
                                                                        <Box sx={{ mt: 2 }}>
                                                                            <Typography
                                                                                variant="body2"
                                                                                color="text.secondary"
                                                                                sx={{ mb: 1, fontWeight: 'bold' }}
                                                                            >
                                                                                📄 Descripción de la tarea:
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
                                                                                        '&:hover': {
                                                                                            bgcolor: alpha('#1976d2', 0.02),
                                                                                            borderColor: '#1976d2',
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color={tarea.descripcion ? 'text.primary' : 'text.secondary'}
                                                                                        sx={{
                                                                                            fontStyle: tarea.descripcion ? 'normal' : 'italic',
                                                                                        }}
                                                                                    >
                                                                                        {tarea.descripcion ||
                                                                                            'Haz clic para agregar una descripción...'}
                                                                                    </Typography>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        color={tarea.empresa ? 'text.primary' : 'text.secondary'}
                                                                                        sx={{
                                                                                            fontStyle: tarea.empresa ? 'normal' : 'italic',
                                                                                        }}
                                                                                    >
                                                                                        {tarea.empresa || 'Haz clic para agregar una descripción...'}
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

                {/* Botón flotante */}
                {!showNewTaskForm && !editingTask && (
                    <Fab
                        color="primary"
                        onClick={startNewTask}
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
