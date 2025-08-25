import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import PackageIcon from '@mui/icons-material/Inventory2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Fade,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
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

const ESTADOS = ['Pendiente', 'En Contacto', 'Negociación', 'Venta Cerrada', 'Completado'];

interface EstadoProgressBarProps {
    estado: string;
    onChange: (nuevoEstado: string) => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: 600 },
    maxWidth: '600px',
    bgcolor: 'background.paper',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    p: { xs: 3, sm: 4 },
    borderRadius: '16px',
    maxHeight: '90vh',
    overflow: 'auto',
};

const getEstadoColor = (estado: string) => {
    const colors = {
        Pendiente: '#f59e0b',
        'En Contacto': '#3b82f6',
        Negociación: '#8b5cf6',
        'Venta Cerrada': '#10b981',
        Completado: '#059669',
    };
    return colors[estado as keyof typeof colors] || '#6b7280';
};

const getCardGradient = (estado: string) => {
    const gradients = {
        Pendiente: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'En Contacto': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        Negociación: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
        'Venta Cerrada': 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
        Completado: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    };
    return gradients[estado as keyof typeof gradients] || 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)';
};

const EstadoProgressBar: React.FC<EstadoProgressBarProps> = ({ estado, onChange }) => {
    const currentIndex = ESTADOS.indexOf(estado);

    return (
        <Box sx={{ display: 'flex', gap: 0.5, cursor: 'pointer', mb: 1 }}>
            {ESTADOS.map((est, idx) => (
                <Tooltip title={est} key={est}>
                    <Box
                        onClick={() => onChange(est)}
                        sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            background: idx <= currentIndex ? getCardGradient(est) : '#e5e7eb',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            },
                        }}
                    />
                </Tooltip>
            ))}
        </Box>
    );
};

const SeguimientoVendedor: React.FC = () => {
    const { seguimientos, paquetes, auth } = usePage().props as any;
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const today = new Date().toISOString().slice(0, 10);

    const { data, setData, post, put, reset } = useForm<Omit<Seguimiento, 'id' | 'usuario' | 'paquete'>>({
        nombre_empresa: '',
        id_user: auth.user.id,
        id_paquete: paquetes.length > 0 ? paquetes[0].id : 0,
        estado: 'Pendiente',
        fecha_inicio: today,
        fecha_fin: '',
        descripcion: '',
    });

    const handleOpen = (seguimiento?: Seguimiento) => {
        if (seguimiento) {
            setIsEditing(true);
            setData({
                nombre_empresa: seguimiento.nombre_empresa,
                id_user: seguimiento.id_user,
                id_paquete: seguimiento.id_paquete,
                estado: seguimiento.estado,
                fecha_inicio: seguimiento.fecha_inicio,
                fecha_fin: seguimiento.fecha_fin || '',
                descripcion: seguimiento.descripcion || '',
            });
            setData('id', seguimiento.id);
        } else {
            setIsEditing(false);
            reset();
            setData({
                ...data,
                nombre_empresa: '',
                id_user: auth.user.id,
                id_paquete: paquetes.length > 0 ? paquetes[0].id : 0,
                estado: 'Pendiente',
                fecha_inicio: today,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(route('seguimiento-empresa-vendedor.update', data.id), {
                onSuccess: () => {
                    handleClose();
                    window.location.reload();
                },
            });
        } else {
            post(route('seguimiento-empresa-vendedor.store'), {
                onSuccess: () => {
                    handleClose();
                    window.location.reload();
                },
            });
        }
    };

    const { delete: destroy } = useForm();
    const { put: putFinalize } = useForm();

    const {
        data: statusData,
        setData: setStatusData,
        put: putStatus,
        processing,
    } = useForm({
        id: null,
        estado: '',
    });

    const handleFinalize = (seguimiento: Seguimiento) => {
        if (confirm('¿Estás seguro de que deseas finalizar este contrato?')) {
            putFinalize(route('seguimiento-empresa-vendedor.finalize', seguimiento.id), {
                data: {
                    estado: 'Completado',
                    fecha_fin: today,
                },
                onSuccess: () => window.location.reload(),
            });
        }
    };

    useEffect(() => {
        if (statusData.id && statusData.estado) {
            putStatus(route('seguimiento-empresa-vendedor.update-status', statusData.id), {
                onSuccess: () => {},
                onError: (errors) => {
                    console.error('Error al actualizar el estado:', errors);
                },
            });
        }
    }, [statusData.id, statusData.estado]);

    const handleEstadoChange = (seguimiento: Seguimiento, nuevoEstado: string) => {
        if (seguimiento.estado === nuevoEstado) {
            return;
        }
        setStatusData({
            id: seguimiento.id,
            estado: nuevoEstado,
        });
    };

    return (
        <AppLayout
            user={auth.user}
            header={
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        p: 3,
                        borderRadius: 2,
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            textAlign: 'center',
                        }}
                    >
                        📈 Seguimiento de Empresas
                    </Typography>
                </Box>
            }
        >
            <Head title="Seguimiento de Empresas" />

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: 4,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 3,
                            px: 3,
                            py: 1.5,
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Nuevo Seguimiento
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {seguimientos.data.map((seguimiento: Seguimiento, index: number) => (
                        <Grid item xs={12} sm={6} lg={4} key={seguimiento.id}>
                            <Fade in timeout={300 + index * 100}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 4,
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 4,
                                            background: getCardGradient(seguimiento.estado),
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 3, pb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Box
                                                sx={{
                                                    background: getCardGradient(seguimiento.estado),
                                                    borderRadius: 2,
                                                    p: 1,
                                                    mr: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <BusinessIcon sx={{ color: 'white', fontSize: 20 }} />
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#1f2937',
                                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                {seguimiento.nombre_empresa}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <PackageIcon sx={{ color: '#6b7280', fontSize: 18, mr: 1 }} />
                                                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                                    Paquete
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#374151',
                                                    fontWeight: 600,
                                                    pl: 2.5,
                                                }}
                                            >
                                                {seguimiento.paquete?.nombre_paquete}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <TrendingUpIcon sx={{ color: '#6b7280', fontSize: 18, mr: 1 }} />
                                                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                                    Estado
                                                </Typography>
                                            </Box>
                                            <Box sx={{ pl: 2.5 }}>
                                                <Chip
                                                    label={seguimiento.estado}
                                                    sx={{
                                                        background: getCardGradient(seguimiento.estado),
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem',
                                                        mb: 1,
                                                    }}
                                                />
                                                <EstadoProgressBar
                                                    estado={seguimiento.estado}
                                                    onChange={(nuevoEstado) => handleEstadoChange(seguimiento, nuevoEstado)}
                                                />
                                            </Box>
                                        </Box>

                                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <CalendarIcon sx={{ color: '#10b981', fontSize: 16, mr: 0.5 }} />
                                                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                                        Inicio
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#374151',
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    {seguimiento.fecha_inicio}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <CalendarIcon sx={{ color: '#ef4444', fontSize: 16, mr: 0.5 }} />
                                                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                                        Fin
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: seguimiento.fecha_fin ? '#374151' : '#9ca3af',
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
                                                    }}
                                                >
                                                    {seguimiento.fecha_fin || 'Pendiente'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>

                                    <CardActions
                                        sx={{
                                            p: 2,
                                            pt: 0,
                                            justifyContent: 'flex-end',
                                            gap: 1,
                                        }}
                                    >
                                        {seguimiento.estado !== 'Completado' && (
                                            <>
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        onClick={() => handleOpen(seguimiento)}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                                            color: 'white',
                                                            width: 40,
                                                            height: 40,
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                                                transform: 'scale(1.1)',
                                                            },
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Finalizar">
                                                    <IconButton
                                                        onClick={() => handleFinalize(seguimiento)}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                            color: 'white',
                                                            width: 40,
                                                            height: 40,
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                                                transform: 'scale(1.1)',
                                                            },
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    >
                                                        <CheckCircleIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </CardActions>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {seguimientos.data.length === 0 && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                            borderRadius: 4,
                            border: '2px dashed #cbd5e1',
                        }}
                    >
                        <BusinessIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                            No hay seguimientos disponibles
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            Comienza creando tu primer seguimiento de empresa
                        </Typography>
                    </Box>
                )}
            </Container>

            <Modal open={open} onClose={handleClose}>
                <Fade in={open}>
                    <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                mb: 3,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center',
                            }}
                        >
                            {isEditing ? '✏️ Editar Seguimiento' : '➕ Crear Seguimiento'}
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre de Empresa"
                                    value={data.nombre_empresa}
                                    onChange={(e) => setData('nombre_empresa', e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#667eea',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#667eea',
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Paquete</InputLabel>
                                    <Select
                                        value={data.id_paquete}
                                        label="Paquete"
                                        onChange={(e) => setData('id_paquete', e.target.value as number)}
                                        sx={{
                                            borderRadius: 2,
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#667eea',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#667eea',
                                            },
                                        }}
                                    >
                                        {paquetes.map((paquete: Paquete) => (
                                            <MenuItem key={paquete.id} value={paquete.id}>
                                                {paquete.nombre_paquete}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Estado"
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#667eea',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#667eea',
                                            },
                                        },
                                    }}
                                />
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
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: '#667eea',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#667eea',
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            {isEditing && (
                                <>
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': {
                                                        borderColor: '#667eea',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#667eea',
                                                    },
                                                },
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    '&:hover fieldset': {
                                                        borderColor: '#667eea',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#667eea',
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    borderColor: '#d1d5db',
                                    color: '#6b7280',
                                    '&:hover': {
                                        borderColor: '#9ca3af',
                                        background: '#f9fafb',
                                    },
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                            >
                                {isEditing ? 'Guardar Cambios' : 'Crear'}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </AppLayout>
    );
};

export default SeguimientoVendedor;
