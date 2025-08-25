import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Confetti from 'react-confetti'; // Instala con: npm install react-confetti

import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    Pagination,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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

const EstadoProgressBar: React.FC<EstadoProgressBarProps> = ({ estado }) => {
    const currentIndex = ESTADOS.indexOf(estado);
    const getEstadoColor = (est: string, idx: number) => {
        if (idx < currentIndex) {
            return 'primary.main';
        }
        if (idx === currentIndex) {
            return 'success.main';
        }
        return 'grey.300';
    };

    return (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            {ESTADOS.map((est, idx) => (
                <Tooltip title={est} key={est}>
                    <Box
                        sx={{
                            flex: 1,
                            height: 12,
                            borderRadius: 2,
                            bgcolor: getEstadoColor(est, idx),
                            border: idx === currentIndex ? '2px solid #388e3c' : '1px solid #ccc',
                            transition: 'background 0.3s, border 0.3s',
                        }}
                    />
                </Tooltip>
            ))}
        </Box>
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
            {showCongrats && (
                <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={300} recycle={false} />
            )}

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
                        bgcolor: '#f5f7fa',
                        px: 3,
                        py: 2,
                        borderRadius: 2,
                        boxShadow: 1,
                        mb: 2,
                    }}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Empresas"
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%', background: '#fff', padding: 4, boxShadow: '0 2px 8px #eee' }}
                    />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#1a237e',
                            letterSpacing: 1,
                            textShadow: '0 1px 2px #e3e3e3',
                        }}
                    >
                        Seguimiento de tus Empresas Activas
                    </Typography>
                </Box>
            </div>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        {/* Barra de búsqueda y botón nuevo */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                            <TextField
                                placeholder="Buscar por empresa,celular o paquete..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ flexGrow: 1, maxWidth: 400 }}
                                size="small"
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
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                                Agrega Nueva Empresa
                            </Button>
                        </Box>

                        {/* Información de resultados */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Mostrando {paginatedSeguimientos.data.length} de {paginatedSeguimientos.total} seguimientos
                                {search && ` (filtrado por: "${search}")`}
                            </Typography>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Empresa</TableCell>
                                        <TableCell>Paquete</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Fecha Inicio</TableCell>
                                        <TableCell>Celular</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedSeguimientos.data.map((row: Seguimiento) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {row.nombre_empresa}
                                                    </Typography>
                                                    {row.descripcion && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                            {row.descripcion.length > 50 ? `${row.descripcion.substring(0, 50)}...` : row.descripcion}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{row.paquete?.nombre_paquete}</TableCell>
                                            <TableCell>
                                                <Box sx={{ width: 120, height: 18, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    {/* Mitad izquierda (naranja) */}
                                                    <Box
                                                        sx={{
                                                            width: '50%',
                                                            height: '100%',
                                                            bgcolor: '#ff9800',
                                                            borderTopLeftRadius: 9,
                                                            borderBottomLeftRadius: 9,
                                                            display: 'inline-block',
                                                            transition: 'background 0.3s',
                                                        }}
                                                    />
                                                    {/* Mitad derecha (gris) */}
                                                    <Box
                                                        sx={{
                                                            width: '50%',
                                                            height: '100%',
                                                            bgcolor: '#e0e0e0',
                                                            borderTopRightRadius: 9,
                                                            borderBottomRightRadius: 9,
                                                            display: 'inline-block',
                                                        }}
                                                    />
                                                    {/* Texto centrado */}
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            position: 'absolute',
                                                            left: '50%',
                                                            top: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            color: '#333',
                                                            fontWeight: 'bold',
                                                            fontSize: 12,
                                                            width: '100%',
                                                            textAlign: 'center',
                                                            pointerEvents: 'none',
                                                        }}
                                                    >
                                                        En proceso
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{row.fecha_inicio}</TableCell>
                                            <TableCell>{row.celular || 'N/A'}</TableCell>
                                            <TableCell>
                                                {row.estado !== 'Completado' && row.estado !== 'Sin exito' && (
                                                    <>
                                                        <Tooltip title="Editar">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => handleOpen(row)}
                                                                disabled={processing || processingFinalize || processingCancel}
                                                                size="small"
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Finalizar">
                                                            <IconButton
                                                                color="success"
                                                                onClick={() => handleFinalize(row)}
                                                                disabled={processing || processingFinalize || processingCancel}
                                                                size="small"
                                                            >
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Cancelar">
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleCancel(row)}
                                                                disabled={processing || processingFinalize || processingCancel}
                                                                size="small"
                                                            >
                                                                <GridCloseIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                                {row.estado === 'Sin exito' && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Cancelado
                                                    </Typography>
                                                )}
                                                {row.estado === 'Completado' && (
                                                    <Typography variant="body2" color="success.main">
                                                        Completado
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {paginatedSeguimientos.data.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    {search ? 'No se encontraron seguimientos' : 'No hay seguimientos registrados'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {search
                                        ? 'Intenta con diferentes términos de búsqueda'
                                        : 'Crea tu primer seguimiento haciendo clic en "Nuevo Seguimiento"'}
                                </Typography>
                            </Box>
                        )}

                        {/* Paginación */}
                        {paginatedSeguimientos.last_page > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Pagination
                                    count={paginatedSeguimientos.last_page}
                                    page={paginatedSeguimientos.current_page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" component="h2" mb={2}>
                        {isEditing ? 'Editar Seguimiento' : 'Crear Seguimiento'}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre de Empresa"
                                value={data.nombre_empresa}
                                onChange={(e) => setData('nombre_empresa', e.target.value)}
                                required
                                error={!!errors.nombre_empresa}
                                helperText={errors.nombre_empresa}
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required error={!!errors.id_paquete}>
                                <InputLabel>Paquete</InputLabel>
                                <Select value={data.id_paquete} label="Paquete" onChange={(e) => setData('id_paquete', e.target.value as number)}>
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
                                <Select value={data.estado} label="Estado" onChange={(e) => setData('estado', e.target.value)}>
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
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                        <Button onClick={handleClose} variant="outlined" disabled={processing}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" disabled={processing}>
                            {processing ? 'Procesando...' : isEditing ? 'Guardar Cambios' : 'Crear'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AppLayout>
    );
};

export default SeguimientoVendedor;
