'use client';

// resources/js/Pages/tareas/index.tsx

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Add,
    Assignment as AssignmentIcon,
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    Category as CategoryIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ExpandLess,
    ExpandMore,
    FilterList as FilterListIcon,
    Person,
    PriorityHigh,
    Refresh as RefreshIcon,
    TrendingDown,
    TrendingUp,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Collapse,
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

//
// Interfaces para datos de tareas
//
interface Asignado {
    user_id: number;
    user_name: string;
    estado: string;
    detalle: string;
}

interface TareaAsignada {
    id: number;
    titulo: string;
    prioridad: 'alta' | 'media' | 'baja';
    descripcion: string;
    fecha: string; // "YYYY-MM-DD"
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

//
// Tipos para el formulario dentro del modal
//
interface FormData {
    titulo: string;
    prioridad: 'alta' | 'media' | 'baja';
    fecha: string;
    descripcion: string;
    tipo_id: string;
    company_id: string;
}

//
// Constantes de estilo que se reutilizan
//
const BORDER_RADIUS_STYLE = { borderRadius: 2 };
const DIALOG_PAPER_SX = {
    borderRadius: 2,
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
};
const TITLE_SX = {
    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};
const TITLE_TEXT_SX = { fontWeight: 'bold' };
const INPUT_SX = { '& .MuiOutlinedInput-root': { borderRadius: 1 } };

//
// Componente interno: Modal para crear/editar tareas
//
interface TareaDialogProps {
    open: boolean;
    onClose: () => void;
    isEditMode: boolean;
    formLoading: boolean;
    formError: string | null;
    formData: FormData;
    tipos: TipoTarea[];
    empresas: Empresa[];
    asignarEmpresa: 'si' | 'no';
    setAsignarEmpresa: (value: 'si' | 'no') => void;
    setFormData: (data: FormData) => void;
    handleSubmit: () => void;
}

function TareaDialog({
    open,
    onClose,
    isEditMode,
    formLoading,
    formError,
    formData,
    tipos,
    empresas,
    asignarEmpresa,
    setAsignarEmpresa,
    setFormData,
    handleSubmit,
}: TareaDialogProps) {
    const updateField = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handlePrioridadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, prioridad: e.target.value as FormData['prioridad'] });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, fecha: e.target.value });
    };

    const handleAsignarEmpresa = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as 'si' | 'no';
        setAsignarEmpresa(value);
        if (value === 'no') {
            setFormData({ ...formData, company_id: '' });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: DIALOG_PAPER_SX }}>
            <DialogTitle sx={TITLE_SX}>
                <Typography variant="h6" sx={TITLE_TEXT_SX}>
                    {isEditMode ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Divider opcional para separar visualmente */}
            <Divider sx={{ borderColor: 'rgba(0,0,0,0.10)' }} />

            <DialogContent
                sx={{
                    pt: 5, // 5 * 8px = 40px (≈ 1cm) de padding-top
                    px: 3, // padding-left / padding-right = 24px
                    pb: 3, // padding-bottom = 24px
                }}
            >
                {formLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                {formError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {formError}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Título */}
                    <Grid item xs={12}>
                        <TextField
                            label="📝 Título de la tarea"
                            fullWidth
                            value={formData.titulo}
                            onChange={updateField('titulo')}
                            required
                            error={!!formError && !formData.titulo.trim()}
                            sx={INPUT_SX}
                        />
                    </Grid>

                    {/* Prioridad */}
                    <Grid item xs={12} md={6}>
                        <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                                ⚡ Prioridad
                            </FormLabel>
                            <RadioGroup row value={formData.prioridad} onChange={handlePrioridadChange}>
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

                    {/* Fecha */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="📅 Fecha"
                            type="date"
                            fullWidth
                            value={formData.fecha}
                            onChange={handleDateChange}
                            InputLabelProps={{ shrink: true }}
                            sx={INPUT_SX}
                        />
                    </Grid>

                    {/* Descripción */}
                    <Grid item xs={12}>
                        <TextField
                            label="📄 Descripción"
                            fullWidth
                            multiline
                            minRows={3}
                            value={formData.descripcion}
                            onChange={updateField('descripcion')}
                            placeholder="Describe la tarea en detalle..."
                            sx={INPUT_SX}
                        />
                    </Grid>

                    {/* Campo “Tipo” resaltado */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1,
                            p: 2,
                        }}
                    >
                        <FormControl fullWidth>
                            <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>🏷️ Tipo</FormLabel>
                            <TextField
                                select
                                value={formData.tipo_id}
                                onChange={updateField('tipo_id')}
                                placeholder="Seleccionar tipo..."
                                sx={INPUT_SX}
                            >
                                <MenuItem value="">-- Seleccionar tipo --</MenuItem>
                                {tipos.map((tipo) => (
                                    <MenuItem key={tipo.id} value={String(tipo.id)}>
                                        {tipo.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>

                    {/* Campo “¿Asignar empresa?” y “Empresa” resaltado */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1,
                            p: 2,
                        }}
                    >
                        <FormControl fullWidth>
                            <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>🏢 ¿Asignar empresa?</FormLabel>
                            <RadioGroup row value={asignarEmpresa} onChange={handleAsignarEmpresa}>
                                <FormControlLabel value="si" control={<Radio />} label="Sí" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                            {asignarEmpresa === 'si' && (
                                <Box sx={{ mt: 2 }}>
                                    <FormControl fullWidth>
                                        <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>🏢 Empresa</FormLabel>
                                        <TextField
                                            select
                                            value={formData.company_id}
                                            onChange={updateField('company_id')}
                                            placeholder="Seleccionar empresa..."
                                            sx={INPUT_SX}
                                        >
                                            <MenuItem value="">-- Seleccionar empresa --</MenuItem>
                                            {empresas.map((emp) => (
                                                <MenuItem key={emp.id} value={String(emp.id)}>
                                                    {emp.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Box>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button onClick={onClose} variant="outlined" sx={{ ...BORDER_RADIUS_STYLE, minWidth: 100 }}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={formLoading}
                    sx={{
                        ...BORDER_RADIUS_STYLE,
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
    );
}

//
// Componente principal: Página de Tareas
//
export default function Tareas() {
    // Estados principales
    const [tareas, setTareas] = useState<TareaAsignada[]>([]);
    const [tipos, setTipos] = useState<TipoTarea[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

    // Estados del formulario/modal
    const [showModal, setShowModal] = useState(false);
    const [asignarEmpresa, setAsignarEmpresa] = useState<'si' | 'no'>('no');
    const [formData, setFormData] = useState<FormData>({
        titulo: '',
        prioridad: 'media',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        tipo_id: '',
        company_id: '',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // Estados de filtrado
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMode, setFilterMode] = useState<'todos' | 'semana' | 'mes'>('todos');
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [filterUser, setFilterUser] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<'alta' | 'media' | 'baja' | ''>('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Obtener parámetro "fecha" de la URL
    const queryParams = new URLSearchParams(window.location.search);
    const fechaParam = queryParams.get('fecha');

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
    }, [fetchData, fechaParam]);

    // Auxiliar: interpretar "YYYY-MM-DD" como fecha local
    const parseLocalDate = useCallback((dateStr: string): Date => {
        const [year, month, day] = dateStr.split('-').map((p) => parseInt(p, 10));
        return new Date(year, month - 1, day);
    }, []);

    // Chequear si "dateStr" está en la semana actual
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

    // Construir el array de 7 fechas de la semana actual
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

    // Filtrado de tareas
    const filteredTareas = useMemo(() => {
        return tareas.filter((t) => {
            // Búsqueda por título
            if (!t.titulo.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            // Filtro por prioridad
            if (filterPriority && t.prioridad !== filterPriority) {
                return false;
            }
            // Filtro por periodo
            if (filterMode === 'semana') {
                if (!isDateInCurrentWeek(t.fecha)) return false;
                if (selectedDay && t.fecha !== selectedDay) return false;
            } else if (filterMode === 'mes') {
                const date = parseLocalDate(t.fecha);
                const now = new Date();
                if (date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear()) {
                    return false;
                }
            }
            // Filtro por usuario
            if (filterUser && !t.asignados.some((a) => a.user_name === filterUser)) {
                return false;
            }
            return true;
        });
    }, [tareas, searchTerm, filterMode, selectedDay, filterUser, filterPriority, isDateInCurrentWeek, parseLocalDate]);

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

    // Inicializar expandedUsers con todos los usuarios expandidos
    useEffect(() => {
        const initialExpandedState: Record<string, boolean> = {};
        Object.keys(tareasPorUsuario).forEach((userName) => {
            initialExpandedState[userName] = true;
        });
        setExpandedUsers(initialExpandedState);
    }, [tareasPorUsuario]);

    // Funciones de manejo de UI
    const toggleUserExpanded = (userName: string) => {
        setExpandedUsers((prev) => ({
            ...prev,
            [userName]: !prev[userName],
        }));
    };

    // Abrir modal para crear nueva tarea
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditId(null);
        setAsignarEmpresa('no');
        setFormError(null);
        setFormData({
            titulo: '',
            prioridad: 'media',
            descripcion: '',
            fecha: new Date().toISOString().split('T')[0],
            tipo_id: '',
            company_id: '',
        });
        setShowModal(true);
    };

    // Abrir modal para editar tarea existente
    const openEditModal = (tarea: TareaAsignada) => {
        setIsEditMode(true);
        setEditId(tarea.id);
        setFormError(null);
        setFormData({
            titulo: tarea.titulo,
            prioridad: tarea.prioridad,
            descripcion: tarea.descripcion,
            fecha: tarea.fecha,
            tipo_id: tarea.tipo ? String(tarea.tipo.id) : '',
            company_id: tarea.company ? String(tarea.company.id) : '',
        });
        setAsignarEmpresa(tarea.company ? 'si' : 'no');
        setShowModal(true);
    };

    // Enviar datos de formulario (crear o actualizar)
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
            if (isEditMode && editId !== null) {
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

    // Eliminar tarea
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

    // Función para obtener color según prioridad
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

    // Función para color de avatar por nombre
    const getAvatarColor = (name: string) => {
        const colors = ['#1976d2', '#1565c0', '#0d47a1', '#2196f3', '#0288d1', '#01579b', '#03a9f4', '#00b0ff', '#0091ea', '#3f51b5'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Obtener iniciales de un nombre
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    //
    // Renderizado condicional para estado de carga
    //
    if (loading) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Tareas', href: '/tareas' }]}>
                <Head title="Tareas" />
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" height={100} sx={{ mb: 3, borderRadius: 1 }} />
                    {[...Array(3)].map((_, i) => (
                        <Box key={i} sx={{ mb: 3 }}>
                            <Skeleton variant="rectangular" height={50} sx={{ mb: 1, borderRadius: 1 }} />
                            {[...Array(2)].map((_, j) => (
                                <Skeleton key={j} variant="rectangular" height={70} sx={{ mb: 1, ml: 4, borderRadius: 1 }} />
                            ))}
                        </Box>
                    ))}
                </Container>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Tareas', href: '/tareas' }]}>
            <Head title="Tareas" />

            {/* Header con gradiente azul */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                    color: 'white',
                    py: 4,
                    position: 'relative',
                    overflow: 'hidden',
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
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Fade in timeout={800}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                📋 Gestión de Tareas
                            </Typography>
                            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                Organiza y gestiona todas tus tareas de manera eficiente
                            </Typography>
                            {fechaParam && (
                                <Chip label={`Tareas del día: ${fechaParam}`} sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                            )}
                        </Box>
                    </Fade>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 3 }}>
                {/* Mensaje de error global */}
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
                    <Stack spacing={2}>
                        {/* Primera fila: Búsqueda y acciones principales */}
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <TextField
                                placeholder="🔍 Buscar tareas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                sx={{
                                    flexGrow: 1,
                                    minWidth: 200,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        background: 'white',
                                    },
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Mostrar/ocultar filtros">
                                    <IconButton
                                        color={showFilters ? 'primary' : 'default'}
                                        onClick={() => setShowFilters(!showFilters)}
                                        sx={{
                                            bgcolor: showFilters ? 'primary.main' : 'white',
                                            color: showFilters ? 'white' : 'inherit',
                                            '&:hover': { bgcolor: showFilters ? 'primary.dark' : 'grey.100' },
                                        }}
                                    >
                                        <FilterListIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Actualizar">
                                    <IconButton onClick={fetchData} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>

                                <Button
                                    variant="contained"
                                    onClick={openCreateModal}
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

                        {/* Estadísticas rápidas */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip icon={<AssignmentIcon />} label={`${filteredTareas.length} tareas`} color="primary" variant="outlined" />
                            <Chip icon={<Person />} label={`${Object.keys(tareasPorUsuario).length} usuarios`} color="primary" variant="outlined" />
                            <Chip
                                icon={<PriorityHigh />}
                                label={`${filteredTareas.filter((t) => t.prioridad === 'alta').length} alta prioridad`}
                                color="error"
                                variant="outlined"
                            />
                        </Box>
                    </Stack>
                </Paper>

                {/* Filtros colapsables */}
                <Collapse in={showFilters}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            border: '1px solid rgba(25, 118, 210, 0.2)',
                            background: alpha('#1976d2', 0.03),
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FilterListIcon color="primary" fontSize="small" />
                            Filtros Avanzados
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    Periodo de tiempo
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {[
                                        { key: 'todos', label: 'Todas', icon: '📅' },
                                        { key: 'semana', label: 'Esta Semana', icon: '📆' },
                                        { key: 'mes', label: 'Este Mes', icon: '🗓️' },
                                    ].map((option) => (
                                        <Chip
                                            key={option.key}
                                            label={`${option.icon} ${option.label}`}
                                            onClick={() => setFilterMode(option.key as any)}
                                            color={filterMode === option.key ? 'primary' : 'default'}
                                            variant={filterMode === option.key ? 'filled' : 'outlined'}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    label="👤 Usuario"
                                    size="small"
                                    fullWidth
                                    value={filterUser}
                                    onChange={(e) => setFilterUser(e.target.value)}
                                >
                                    <MenuItem value="">Todos los usuarios</MenuItem>
                                    {usuariosUnicos.map((u) => (
                                        <MenuItem key={u} value={u}>
                                            {u}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    select
                                    label="⚡ Prioridad"
                                    size="small"
                                    fullWidth
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value as any)}
                                >
                                    <MenuItem value="">Todas las prioridades</MenuItem>
                                    <MenuItem value="alta">🔴 Alta</MenuItem>
                                    <MenuItem value="media">🟡 Media</MenuItem>
                                    <MenuItem value="baja">🟢 Baja</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        {/* Días de la semana para filtro semanal */}
                        {filterMode === 'semana' && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    Días de la semana
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {weekDates.map((date) => {
                                        const d = parseLocalDate(date);
                                        const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
                                        return (
                                            <Chip
                                                key={date}
                                                label={`${dayName} ${date.slice(8)}`}
                                                onClick={() => setSelectedDay(selectedDay === date ? null : date)}
                                                color={selectedDay === date ? 'primary' : 'default'}
                                                variant={selectedDay === date ? 'filled' : 'outlined'}
                                                sx={{
                                                    cursor: 'pointer',
                                                    textTransform: 'capitalize',
                                                    '&:hover': { transform: 'scale(1.05)' },
                                                    transition: 'transform 0.2s ease',
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Collapse>

                {/* Lista de tareas agrupadas por usuario */}
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
                            📝 No hay tareas que mostrar
                        </Typography>
                        <Typography color="text.secondary">Intenta ajustar los filtros o crear una nueva tarea</Typography>
                    </Paper>
                ) : (
                    <Box sx={{ mb: 4 }}>
                        {Object.entries(tareasPorUsuario).map(([userName, tareas], userIndex) => (
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
                                            <Avatar sx={{ bgcolor: getAvatarColor(userName), fontWeight: 'bold' }}>{getInitials(userName)}</Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {userName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    {tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'} asignadas
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <IconButton sx={{ color: 'white' }}>{expandedUsers[userName] ? <ExpandLess /> : <ExpandMore />}</IconButton>
                                    </Box>

                                    {/* Lista de tareas del usuario */}
                                    <Collapse in={expandedUsers[userName] ?? true}>
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
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
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
                                    </Collapse>
                                </Card>
                            </Fade>
                        ))}
                    </Box>
                )}

                {/* Modal para crear/editar tarea */}
                <TareaDialog
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    isEditMode={isEditMode}
                    formLoading={formLoading}
                    formError={formError}
                    formData={formData}
                    tipos={tipos}
                    empresas={empresas}
                    asignarEmpresa={asignarEmpresa}
                    setAsignarEmpresa={setAsignarEmpresa}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                />
            </Container>
        </AppLayout>
    );
}
