import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Confetti from 'react-confetti';

import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Modal,
    Pagination,
    Select,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

interface Seguimiento {
    id: number;
    nombre_empresa: string;
    id_user: number;
    id_paquete: number;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    descripcion: string | null;
    celular: string | null;
    usuario: { id: number; name: string };
    paquete: { id: number; nombre_paquete: string };
}

interface User {
    id: number;
    name: string;
}

interface Paquete {
    id: number;
    nombre_paquete: string;
}

interface PaginatedData {
    data: Seguimiento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const ESTADOS = ['Sin exito', 'En proceso', 'Completado'];

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    maxHeight: '90vh',
    overflowY: 'auto',
};

const getEstadoColor = (estado: string) => {
    switch (estado) {
        case 'Completado':
            return { color: 'success', bg: '#e8f5e8', text: '#2e7d32' };
        case 'En proceso':
            return { color: 'warning', bg: '#fff3e0', text: '#ef6c00' };
        case 'Sin exito':
            return { color: 'error', bg: '#ffebee', text: '#c62828' };
        default:
            return { color: 'default', bg: '#f5f5f5', text: '#666' };
    }
};

const getProgressValue = (estado: string) => {
    switch (estado) {
        case 'Completado':
            return 100;
        case 'En proceso':
            return 50;
        case 'Sin exito':
            return 25;
        default:
            return 0;
    }
};

const CompanyCard: React.FC<{
    seguimiento: Seguimiento;
    onEdit: (seg: Seguimiento) => void;
    onFinalize: (seg: Seguimiento) => void;
    onCancel: (seg: Seguimiento) => void;
    disabled: boolean;
}> = ({ seguimiento, onEdit, onFinalize, onCancel, disabled }) => {
    const estadoInfo = getEstadoColor(seguimiento.estado);
    const progress = getProgressValue(seguimiento.estado);
    const [showFullDesc, setShowFullDesc] = useState(false);

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                minWidth: 0, // <-- Añade esto
                wordBreak: 'break-word', // <-- Añade esto
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                },
            }}
        >
            {/* Header con gradiente */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    p: 2,
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 40,
                            height: 40,
                        }}
                    >
                        <BusinessIcon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            }}
                        >
                            {seguimiento.nombre_empresa}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.9,
                                fontSize: '0.85rem',
                            }}
                        >
                            {seguimiento.paquete?.nombre_paquete}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                {/* Estado con barra de progreso */}
                <Box sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Estado del proyecto
                        </Typography>
                        <Chip
                            label={seguimiento.estado}
                            size="small"
                            sx={{
                                bgcolor: estadoInfo.bg,
                                color: estadoInfo.text,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                            }}
                        />
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(0,0,0,0.08)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                bgcolor: estadoInfo.text,
                            },
                        }}
                    />
                </Box>

                {/* Información detallada */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            Inicio:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                            {new Date(seguimiento.fecha_inicio).toLocaleDateString('es-ES')}
                        </Typography>
                    </Box>

                    {seguimiento.celular && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                Contacto:
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {seguimiento.celular}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>

            <Divider />

            <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {seguimiento.estado !== 'Completado' && seguimiento.estado !== 'Sin exito' && (
                        <>
                            <Tooltip title="Editar empresa">
                                <IconButton
                                    size="small"
                                    onClick={() => onEdit(seguimiento)}
                                    disabled={disabled}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Completar contrato">
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<CheckCircleIcon fontSize="small" />}
                                    onClick={() => onFinalize(seguimiento)}
                                    disabled={disabled}
                                    sx={{
                                        bgcolor: 'success.main',
                                        color: 'white',
                                        borderRadius: 2,
                                        textTransform: 'none', // evita mayúsculas automáticas
                                        fontSize: '0.85rem',
                                        '&:hover': {
                                            bgcolor: 'success.dark',
                                        },
                                    }}
                                >
                                    Completar contrato
                                </Button>
                            </Tooltip>

                            <Tooltip title="Cancelar empresa">
                                <IconButton
                                    size="small"
                                    onClick={() => onCancel(seguimiento)}
                                    disabled={disabled}
                                    sx={{
                                        bgcolor: 'error.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'error.dark',
                                        },
                                    }}
                                >
                                    <GridCloseIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>

                {/* Estado visual */}
                {(seguimiento.estado === 'Sin exito' || seguimiento.estado === 'Completado') && (
                    <Chip
                        label={seguimiento.estado === 'Sin exito' ? 'Cancelado' : 'Completado'}
                        size="small"
                        sx={{
                            bgcolor: estadoInfo.bg,
                            color: estadoInfo.text,
                            fontWeight: 600,
                        }}
                    />
                )}
            </CardActions>
        </Card>
    );
};

const SeguimientoVendedor: React.FC = () => {
    const { seguimientos, paquetes, auth, filters } = usePage().props as any;
    const paginatedSeguimientos = seguimientos as PaginatedData;

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSeguimiento, setCurrentSeguimiento] = useState<Seguimiento | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [showCongrats, setShowCongrats] = useState(false);

    const today = new Date().toISOString().slice(0, 10);

    // Formulario principal para crear/editar
    const { data, setData, post, put, reset, processing, errors } = useForm({
        nombre_empresa: '',
        id_user: auth.user.id,
        id_paquete: paquetes.length > 0 ? paquetes[0].id : 0,
        estado: 'En proceso',
        fecha_inicio: today,
        fecha_fin: '',
        descripcion: '',
        celular: '',
    });

    // Formularios separados para finalizar y cancelar
    const { put: putFinalize, processing: processingFinalize } = useForm();
    const { put: putCancel, processing: processingCancel } = useForm();

    // Debounce para búsqueda
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters?.search) {
                router.get(
                    route('seguimiento-empresa-vendedor.index'),
                    { search: search },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                );
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleOpen = (seguimiento?: Seguimiento) => {
        if (seguimiento) {
            setIsEditing(true);
            setCurrentSeguimiento(seguimiento);
            setData({
                nombre_empresa: seguimiento.nombre_empresa,
                id_user: seguimiento.id_user,
                id_paquete: seguimiento.id_paquete,
                estado: seguimiento.estado,
                fecha_inicio: seguimiento.fecha_inicio,
                fecha_fin: seguimiento.fecha_fin || '',
                descripcion: seguimiento.descripcion || '',
                celular: seguimiento.celular || '',
            });
        } else {
            setIsEditing(false);
            setCurrentSeguimiento(null);
            reset();
            setData({
                nombre_empresa: '',
                id_user: auth.user.id,
                id_paquete: paquetes.length > 0 ? paquetes[0].id : 0,
                estado: 'En proceso',
                fecha_inicio: today,
                fecha_fin: '',
                descripcion: '',
                celular: '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentSeguimiento(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && currentSeguimiento) {
            put(route('seguimiento-empresa-vendedor.update', currentSeguimiento.id), {
                onSuccess: () => {
                    handleClose();
                },
                onError: (errors) => {
                    console.error('Error al actualizar:', errors);
                },
            });
        } else {
            post(route('seguimiento-empresa-vendedor.store'), {
                onSuccess: () => {
                    handleClose();
                },
                onError: (errors) => {
                    console.error('Error al crear:', errors);
                },
            });
        }
    };

    const handleFinalize = (seguimiento: Seguimiento) => {
        if (confirm('¿Estás seguro de que deseas completar este contrato?')) {
            putFinalize(route('seguimiento-empresa-vendedor.finalize', seguimiento.id), {
                onSuccess: () => {
                    setShowCongrats(true);
                },
                onError: (errors) => {
                    console.error('Error al finalizar:', errors);
                },
            });
        }
    };

    const handleCancel = (seguimiento: Seguimiento) => {
        if (confirm('¿Estás seguro de que deseas cancelar esta empresa?')) {
            putCancel(route('seguimiento-empresa-vendedor.cancel', seguimiento.id), {
                onSuccess: () => {
                    // La página se recargará automáticamente por Inertia
                },
                onError: (errors) => {
                    console.error('Error al cancelar:', errors);
                },
            });
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        router.get(
            route('seguimiento-empresa-vendedor.index'),
            {
                page: page,
                search: search,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearSearch = () => {
        setSearch('');
        router.get(
            route('seguimiento-empresa-vendedor.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Seguimiento de Empresas</h2>}>
            <Head title="Seguimiento de Empresas" />

            {/* Confetti effect */}
            {showCongrats && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} recycle={false} />}

            {/* Snackbar Alert */}
            <Snackbar
                open={showCongrats}
                autoHideDuration={4000}
                onClose={() => setShowCongrats(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setShowCongrats(false)}
                    severity="success"
                    icon={<CelebrationIcon fontSize="inherit" />}
                    sx={{ fontSize: 18, alignItems: 'center' }}
                >
                    ¡Felicidades! Has finalizado un contrato exitosamente 🎉
                </MuiAlert>
            </Snackbar>

            {/* Header mejorado */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 60,
                                height: 60,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <TrendingUpIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                    mb: 0.5,
                                }}
                            >
                                Seguimiento de Empresas
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    opacity: 0.9,
                                    fontWeight: 400,
                                }}
                            >
                                Gestiona y monitorea tus contratos activos
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Elementos decorativos */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        opacity: 0.5,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -30,
                        left: -30,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        opacity: 0.3,
                    }}
                />
            </Box>

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Barra de búsqueda y botón nuevo */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                            <TextField
                                placeholder="Buscar por empresa, celular o paquete..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{
                                    flexGrow: 1,
                                    maxWidth: 500,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: 'white',
                                        '&:hover': {
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: search && (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="limpiar búsqueda" onClick={clearSearch} edge="end" size="small">
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpen()}
                                sx={{
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                                        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                                    },
                                }}
                            >
                                Nueva Empresa
                            </Button>
                        </Box>

                        {/* Información de resultados */}
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Mostrando {paginatedSeguimientos.data.length} de {paginatedSeguimientos.total} empresas
                            {search && ` (filtrado por: "${search}")`}
                        </Typography>
                    </Box>

                    {/* Grid de Cards */}
                    <Grid container spacing={3} sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {paginatedSeguimientos.data.map((seguimiento: Seguimiento) => (
                            <Grid item xs={12} sm={6} lg={4} key={seguimiento.id} sx={{ display: 'flex' }}>
                                <CompanyCard
                                    seguimiento={seguimiento}
                                    onEdit={handleOpen}
                                    onFinalize={handleFinalize}
                                    onCancel={handleCancel}
                                    disabled={processing || processingFinalize || processingCancel}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Estado vacío */}
                    {paginatedSeguimientos.data.length === 0 && (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                bgcolor: 'white',
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            }}
                        >
                            <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h5" color="text.primary" fontWeight={600} mb={1}>
                                {search ? 'No se encontraron empresas' : 'No hay empresas registradas'}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" mb={3}>
                                {search ? 'Intenta con diferentes términos de búsqueda' : 'Crea tu primera empresa haciendo clic en "Nueva Empresa"'}
                            </Typography>
                            {!search && (
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpen()}
                                    sx={{
                                        borderRadius: 3,
                                        px: 4,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                    }}
                                >
                                    Crear Primera Empresa
                                </Button>
                            )}
                        </Box>
                    )}

                    {/* Paginación */}
                    {paginatedSeguimientos.last_page > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={paginatedSeguimientos.last_page}
                                page={paginatedSeguimientos.current_page}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>
                    )}
                </div>
            </div>

            {/* Modal para crear/editar */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" component="h2" mb={3} fontWeight={600}>
                        {isEditing ? 'Editar Empresa' : 'Crear Nueva Empresa'}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre de Empresa"
                                value={data.nombre_empresa}
                                onChange={(e) => setData('nombre_empresa', e.target.value)}
                                required
                                error={!!errors.nombre_empresa}
                                helperText={errors.nombre_empresa}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Celular"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                placeholder="Ej: +591 70000000"
                                error={!!errors.celular}
                                helperText={errors.celular}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required error={!!errors.id_paquete}>
                                <InputLabel>Paquete</InputLabel>
                                <Select
                                    value={data.id_paquete}
                                    label="Paquete"
                                    onChange={(e) => setData('id_paquete', e.target.value as number)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    {paquetes.map((paquete: Paquete) => (
                                        <MenuItem key={paquete.id} value={paquete.id}>
                                            {paquete.nombre_paquete}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.id_paquete && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                        {errors.id_paquete}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required error={!!errors.estado}>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={data.estado}
                                    label="Estado"
                                    disabled // 🔹 Aquí lo haces solo visible
                                    sx={{ borderRadius: 2 }}
                                >
                                    {ESTADOS.map((estado) => (
                                        <MenuItem key={estado} value={estado}>
                                            {estado}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.estado && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                        {errors.estado}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fecha de Inicio"
                                type="date"
                                value={data.fecha_inicio}
                                onChange={(e) => setData('fecha_inicio', e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                error={!!errors.fecha_inicio}
                                helperText={errors.fecha_inicio}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descripción"
                                multiline
                                rows={4}
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                placeholder="Describe detalles del seguimiento, contactos, notas importantes..."
                                error={!!errors.descripcion}
                                helperText={errors.descripcion}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        {isEditing && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Fecha de Fin"
                                    type="date"
                                    value={data.fecha_fin}
                                    onChange={(e) => setData('fecha_fin', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={!!errors.fecha_fin}
                                    helperText={errors.fecha_fin || 'Solo completar si el seguimiento ya ha finalizado'}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            disabled={processing}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 500,
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                                },
                            }}
                        >
                            {processing ? 'Procesando...' : isEditing ? 'Guardar Cambios' : 'Crear Empresa'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AppLayout>
    );
};

export default SeguimientoVendedor;
