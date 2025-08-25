import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Confetti from 'react-confetti'; // Instala con: npm install react-confetti

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
    MenuItem,
    Modal,
    Pagination,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
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

interface EstadoProgressBarProps {
    estado: string;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    maxHeight: '90vh',
    overflowY: 'auto',
};

const getEstadoConfig = (estado: string) => {
    switch (estado) {
        case 'Completado':
            return {
                color: '#4caf50',
                background: 'linear-gradient(135deg, #66bb6a, #4caf50)',
                icon: '✅',
                textColor: '#fff',
            };
        case 'En proceso':
            return {
                color: '#ff9800',
                background: 'linear-gradient(135deg, #ffb74d, #ff9800)',
                icon: '🔄',
                textColor: '#fff',
            };
        case 'Sin exito':
            return {
                color: '#f44336',
                background: 'linear-gradient(135deg, #ef5350, #f44336)',
                icon: '❌',
                textColor: '#fff',
            };
        default:
            return {
                color: '#9e9e9e',
                background: 'linear-gradient(135deg, #bdbdbd, #9e9e9e)',
                icon: '⏳',
                textColor: '#fff',
            };
    }
};

const SeguimientoCard: React.FC<{
    seguimiento: Seguimiento;
    onEdit: (seguimiento: Seguimiento) => void;
    onFinalize: (seguimiento: Seguimiento) => void;
    onCancel: (seguimiento: Seguimiento) => void;
    disabled: boolean;
    sx?: any;
}> = ({ seguimiento, onEdit, onFinalize, onCancel, disabled, sx }) => {
    const estadoConfig = getEstadoConfig(seguimiento.estado);

    return (
        <Card
            sx={{
                height: '480px', // Altura fija en lugar de mínima
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                ...sx,
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: '#3b82f6',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: estadoConfig.background,
                },
            }}
        >
            <CardContent
                sx={{
                    flexGrow: 1,
                    pb: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header con empresa y estado */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, minHeight: '48px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                        <Avatar
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                width: 40,
                                height: 40,
                                flexShrink: 0,
                            }}
                        >
                            <BusinessIcon />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    fontSize: '1.1rem',
                                    lineHeight: 1.3,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {seguimiento.nombre_empresa}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={seguimiento.estado}
                        icon={<span style={{ fontSize: '14px' }}>{estadoConfig.icon}</span>}
                        sx={{
                            background: estadoConfig.background,
                            color: estadoConfig.textColor,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 28,
                            flexShrink: 0,
                            '& .MuiChip-icon': {
                                color: estadoConfig.textColor,
                            },
                        }}
                    />
                </Box>

                {/* Información del paquete */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, minHeight: '32px' }}>
                    <LocalOfferIcon sx={{ fontSize: 18, color: '#6366f1', flexShrink: 0 }} />
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#475569',
                            fontWeight: 600,
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {seguimiento.paquete?.nombre_paquete}
                    </Typography>
                </Box>

                {/* Información de contacto y fecha - Contenedor con scroll */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        mb: 2,
                        pr: 1,
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f5f9',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#cbd5e1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#94a3b8',
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '24px' }}>
                            <CalendarTodayIcon sx={{ fontSize: 16, color: '#059669', flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                                Inicio: {new Date(seguimiento.fecha_inicio).toLocaleDateString('es-ES')}
                            </Typography>
                        </Box>

                        {seguimiento.celular && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '24px' }}>
                                <PhoneIcon sx={{ fontSize: 16, color: '#dc2626', flexShrink: 0 }} />
                                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                                    {seguimiento.celular}
                                </Typography>
                            </Box>
                        )}

                        {seguimiento.descripcion && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <DescriptionIcon sx={{ fontSize: 16, color: '#7c3aed', mt: 0.2, flexShrink: 0 }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#64748b',
                                        fontSize: '0.85rem',
                                        lineHeight: 1.4,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3, // Máximo 3 líneas
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        flex: 1,
                                    }}
                                >
                                    {seguimiento.descripcion}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Progress indicator visual */}
                <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <TrendingUpIcon sx={{ fontSize: 16, color: '#64748b' }} />
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Progreso
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {ESTADOS.map((estado, index) => {
                            const currentIndex = ESTADOS.indexOf(seguimiento.estado);
                            const isActive = index <= currentIndex;
                            const isCurrent = index === currentIndex;

                            return (
                                <Box
                                    key={estado}
                                    sx={{
                                        flex: 1,
                                        height: 6,
                                        borderRadius: 3,
                                        background: isActive
                                            ? isCurrent
                                                ? estadoConfig.background
                                                : 'linear-gradient(135deg, #10b981, #059669)'
                                            : '#e2e8f0',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        '&::after': isCurrent
                                            ? {
                                                  content: '""',
                                                  position: 'absolute',
                                                  top: '50%',
                                                  right: 2,
                                                  width: 8,
                                                  height: 8,
                                                  borderRadius: '50%',
                                                  background: '#fff',
                                                  transform: 'translateY(-50%)',
                                                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                              }
                                            : {},
                                    }}
                                />
                            );
                        })}
                    </Box>
                </Box>
            </CardContent>

            <Divider sx={{ borderColor: '#f1f5f9' }} />

            <CardActions
                sx={{
                    p: 2,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#3b82f6', fontSize: '0.75rem' }}>
                        <PersonIcon sx={{ fontSize: 14 }} />
                    </Avatar>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                        {seguimiento.usuario?.name}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {seguimiento.estado !== 'Completado' && seguimiento.estado !== 'Sin exito' && (
                        <>
                            <Tooltip title="Editar" placement="top">
                                <IconButton
                                    size="small"
                                    onClick={() => onEdit(seguimiento)}
                                    disabled={disabled}
                                    sx={{
                                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                        color: 'white',
                                        width: 36,
                                        height: 36,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                                            transform: 'scale(1.05)',
                                        },
                                        '&:disabled': {
                                            background: '#e2e8f0',
                                            color: '#94a3b8',
                                        },
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Completar" placement="top">
                                <IconButton
                                    size="small"
                                    onClick={() => onFinalize(seguimiento)}
                                    disabled={disabled}
                                    sx={{
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        color: 'white',
                                        width: 36,
                                        height: 36,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #059669, #047857)',
                                            transform: 'scale(1.05)',
                                        },
                                        '&:disabled': {
                                            background: '#e2e8f0',
                                            color: '#94a3b8',
                                        },
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Cancelar" placement="top">
                                <IconButton
                                    size="small"
                                    onClick={() => onCancel(seguimiento)}
                                    disabled={disabled}
                                    sx={{
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        color: 'white',
                                        width: 36,
                                        height: 36,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                            transform: 'scale(1.05)',
                                        },
                                        '&:disabled': {
                                            background: '#e2e8f0',
                                            color: '#94a3b8',
                                        },
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <GridCloseIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}

                    {seguimiento.estado === 'Sin exito' && (
                        <Chip
                            label="Cancelado"
                            size="small"
                            sx={{
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                            }}
                        />
                    )}

                    {seguimiento.estado === 'Completado' && (
                        <Chip
                            label="Finalizado"
                            size="small"
                            sx={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                            }}
                        />
                    )}
                </Box>
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
        if (confirm('¿Estás seguro de que deseas cancelar este empresa?')) {
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

            <div>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        px: 3,
                        py: 3,
                        borderRadius: 3,
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                        mb: 3,
                        color: 'white',
                    }}
                >
                    <Avatar
                        sx={{
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            width: 50,
                            height: 50,
                        }}
                    >
                        <BusinessIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: 0.5,
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                mb: 0.5,
                            }}
                        >
                            Seguimiento de Empresas
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                opacity: 0.9,
                                fontWeight: 500,
                            }}
                        >
                            Gestiona y supervisa el progreso de tus empresas activas
                        </Typography>
                    </Box>
                </Box>
            </div>

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {/* Barra de búsqueda y botón nuevo */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
                            <TextField
                                placeholder="Buscar por empresa, celular o paquete..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{
                                    flexGrow: 1,
                                    maxWidth: 400,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        background: 'linear-gradient(145deg, #f8fafc, #ffffff)',
                                        '&:hover': {
                                            '& > fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    },
                                }}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#64748b' }} />
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
                                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                Agregar Empresa
                            </Button>
                        </Box>

                        {/* Información de resultados */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                Mostrando {paginatedSeguimientos.data.length} de {paginatedSeguimientos.total} seguimientos
                                {search && ` (filtrado por: "${search}")`}
                            </Typography>
                        </Box>
                        

                        {/* Grid de Cards */}
                        {paginatedSeguimientos.data.length > 0 ? (
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {paginatedSeguimientos.data.map((seguimiento: Seguimiento) => (
                                    <Grid item xs={12} md={6} lg={4} key={seguimiento.id} sx={{ display: 'flex', height: '480px' }}>
                                        <SeguimientoCard
                                            seguimiento={seguimiento}
                                            onEdit={handleOpen}
                                            onFinalize={handleFinalize}
                                            onCancel={handleCancel}
                                            disabled={processing || processingFinalize || processingCancel}
                                            sx={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    background: 'linear-gradient(145deg, #f8fafc, #ffffff)',
                                    borderRadius: 3,
                                    border: '2px dashed #cbd5e1',
                                }}
                            >
                                <BusinessIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                                <Typography variant="h5" sx={{ color: '#64748b', mb: 1, fontWeight: 600 }}>
                                    {search ? 'No se encontraron seguimientos' : 'No hay seguimientos registrados'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
                                    {search
                                        ? 'Intenta con diferentes términos de búsqueda'
                                        : 'Crea tu primer seguimiento haciendo clic en "Agregar Empresa"'}
                                </Typography>
                                {!search && (
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleOpen()}
                                        sx={{
                                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                                            },
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        Crear mi primera empresa
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
                                            fontWeight: 600,
                                            '&.Mui-selected': {
                                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                                color: 'white',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                                                },
                                            },
                                            '&:hover': {
                                                backgroundColor: '#f1f5f9',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal mejorado */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        ...modalStyle,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                width: 40,
                                height: 40,
                            }}
                        >
                            <BusinessIcon />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {isEditing ? 'Editar Seguimiento' : 'Crear Seguimiento'}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />

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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& > fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BusinessIcon sx={{ color: '#64748b' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Celular"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                placeholder="Ej: 712345678"
                                error={!!errors.celular}
                                helperText={errors.celular}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& > fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon sx={{ color: '#64748b' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required error={!!errors.id_paquete}>
                                <InputLabel>Paquete</InputLabel>
                                <Select
                                    value={data.id_paquete}
                                    label="Paquete"
                                    onChange={(e) => setData('id_paquete', e.target.value as number)}
                                    sx={{
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& > fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LocalOfferIcon sx={{ color: '#64748b', ml: 1 }} />
                                        </InputAdornment>
                                    }
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
                                    onChange={(e) => setData('estado', e.target.value)}
                                    sx={{
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& > fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <TrendingUpIcon sx={{ color: '#64748b', ml: 1 }} />
                                        </InputAdornment>
                                    }
                                >
                                    {ESTADOS.map((estado) => (
                                        <MenuItem key={estado} value={estado}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <span>{getEstadoConfig(estado).icon}</span>
                                                {estado}
                                            </Box>
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& > fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayIcon sx={{ color: '#64748b' }} />
                                        </InputAdornment>
                                    ),
                                }}
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover': {
                                            '& > fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                            <DescriptionIcon sx={{ color: '#64748b' }} />
                                        </InputAdornment>
                                    ),
                                }}
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: '#3b82f6',
                                                },
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarTodayIcon sx={{ color: '#64748b' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>

                    <Divider sx={{ mt: 4, mb: 3, borderColor: '#f1f5f9' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            disabled={processing}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                borderColor: '#d1d5db',
                                color: '#6b7280',
                                '&:hover': {
                                    borderColor: '#9ca3af',
                                    backgroundColor: '#f9fafb',
                                },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={processing}
                            sx={{
                                background: processing ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                                '&:hover': !processing
                                    ? {
                                          background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                                          transform: 'translateY(-1px)',
                                          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                                      }
                                    : {},
                                '&:disabled': {
                                    transform: 'none',
                                    boxShadow: '0 2px 8px rgba(156, 163, 175, 0.3)',
                                },
                                transition: 'all 0.2s',
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
