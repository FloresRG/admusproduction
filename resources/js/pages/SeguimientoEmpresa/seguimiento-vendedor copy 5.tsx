import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
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
import React, { useState } from 'react';

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
    const { seguimientos, paquetes, auth } = usePage().props as any;

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSeguimiento, setCurrentSeguimiento] = useState<Seguimiento | null>(null);

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
        if (confirm('¿Estás seguro de que deseas finalizar este contrato?')) {
            putFinalize(route('seguimiento-empresa-vendedor.finalize', seguimiento.id), {
                onSuccess: () => {
                    // La página se recargará automáticamente por Inertia
                },
                onError: (errors) => {
                    console.error('Error al finalizar:', errors);
                },
            });
        }
    };

    const handleCancel = (seguimiento: Seguimiento) => {
        if (confirm('¿Estás seguro de que deseas cancelar este seguimiento? El estado se cambiará a "Sin exito" y no se mostrará en la lista.')) {
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

    return (
        <AppLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Seguimiento de Empresas</h2>}>
            <Head title="Seguimiento de Empresas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                                Nuevo Seguimiento
                            </Button>
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
                                    {seguimientos.data.map((row: Seguimiento) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.nombre_empresa}</TableCell>
                                            <TableCell>{row.paquete?.nombre_paquete}</TableCell>
                                            <TableCell>
                                                <EstadoProgressBar estado={row.estado} />
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
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Finalizar">
                                                            <IconButton 
                                                                color="success" 
                                                                onClick={() => handleFinalize(row)}
                                                                disabled={processing || processingFinalize || processingCancel}
                                                            >
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Cancelar">
                                                            <IconButton 
                                                                color="error" 
                                                                onClick={() => handleCancel(row)}
                                                                disabled={processing || processingFinalize || processingCancel}
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

                        {seguimientos.data.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No hay seguimientos registrados
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Crea tu primer seguimiento haciendo clic en "Nuevo Seguimiento"
                                </Typography>
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
                                <Select 
                                    value={data.id_paquete} 
                                    label="Paquete" 
                                    onChange={(e) => setData('id_paquete', e.target.value as number)}
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
                            />
                        </Grid>
                        {isEditing && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Descripción"
                                        multiline
                                        rows={4}
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        error={!!errors.descripcion}
                                        helperText={errors.descripcion}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                        <Button onClick={handleClose} variant="outlined" disabled={processing}>
                            Cancelarr
                        </Button>
                        <Button type="submit" variant="contained" disabled={processing}>
                            {processing ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Crear')}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AppLayout>
    );
};

export default SeguimientoVendedor;