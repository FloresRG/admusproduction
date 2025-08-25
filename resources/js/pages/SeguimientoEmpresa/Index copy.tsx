import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
};

const Index: React.FC = () => {
    const props = usePage().props as any;
    const seguimientos = props.seguimientos as { data: Seguimiento[] };
    const users = props.users as User[];
    const paquetes = props.paquetes as Paquete[];

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, reset } = useForm<Omit<Seguimiento, 'id' | 'usuario' | 'paquete'>>({
        nombre_empresa: '',
        id_user: users.length > 0 ? users[0].id : 0,
        id_paquete: paquetes.length > 0 ? paquetes[0].id : 0,
        estado: '',
        fecha_inicio: '',
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
            setData('id', seguimiento.id); // Add id for the update route
        } else {
            setIsEditing(false);
            reset();
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
            put(route('seguimiento-empresa.update', data.id), {
                onSuccess: () => {
                    handleClose();
                    window.location.reload(); // Recarga la página
                },
            });
        } else {
            post(route('seguimiento-empresa.store'), {
                onSuccess: () => {
                    handleClose();
                    window.location.reload(); // Recarga la página
                },
            });
        }
    };

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este seguimiento?')) {
            destroy(route('seguimiento-empresa.destroy', id), {
                onSuccess: () => window.location.reload(),
            });
        }
    };

    return (
        <AppLayout
            user={usePage().props.auth.user}
            header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Seguimiento de Empresas</h2>}
        >
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
                                        <TableCell>Usuario</TableCell>
                                        <TableCell>Paquete</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Fecha Inicio</TableCell>
                                        <TableCell>Fecha Fin</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {seguimientos.data.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.nombre_empresa}</TableCell>
                                            <TableCell>{row.usuario?.name}</TableCell>
                                            <TableCell>{row.paquete?.nombre_paquete}</TableCell>
                                            <TableCell>{row.estado}</TableCell>
                                            <TableCell>{row.fecha_inicio}</TableCell>
                                            <TableCell>{row.fecha_fin || 'N/A'}</TableCell>
                                            <TableCell>
                                                <IconButton color="primary" onClick={() => handleOpen(row)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Usuario</InputLabel>
                                <Select value={data.id_user} label="Usuario" onChange={(e) => setData('id_user', e.target.value as number)}>
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Paquete</InputLabel>
                                <Select value={data.id_paquete} label="Paquete" onChange={(e) => setData('id_paquete', e.target.value as number)}>
                                    {paquetes.map((paquete) => (
                                        <MenuItem key={paquete.id} value={paquete.id}>
                                            {paquete.nombre_paquete}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Estado" value={data.estado} onChange={(e) => setData('estado', e.target.value)} required />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Fecha de Fin"
                                type="date"
                                value={data.fecha_fin}
                                onChange={(e) => setData('fecha_fin', e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
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
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                        <Button onClick={handleClose} variant="outlined">
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained">
                            {isEditing ? 'Guardar Cambios' : 'Crear'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AppLayout>
    );
};

export default Index;
