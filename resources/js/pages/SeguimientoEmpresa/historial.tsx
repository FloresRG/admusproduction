import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';

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

// Interfaces for data types
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

// Estructura para los datos agrupados
interface GroupedSeguimiento {
    user: User;
    seguimientos: Seguimiento[];
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
    // Mantener la desestructuración de las props como la tienes originalmente
    const { seguimientos, users, paquetes, filters } = usePage().props as any;

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const { data, setData, post, put, reset } = useForm<Omit<Seguimiento, 'id' | 'usuario' | 'paquete'>>({
        nombre_empresa: '',
        id_user: users.length > 0 ? users[0].id : 0,
        id_paquete: paquetes.length > 0 ? paquetes[0].id : 0,
        estado: '',
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: '',
    });

    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        router.get(
            route('seguimiento-empresa.index'),
            { search: value },
            {
                replace: true,
                preserveState: true,
            },
        );
    };

    const handleOpen = (seguimiento?: Seguimiento) => {
        if (seguimiento) {
            setIsEditing(true);
            setCurrentId(seguimiento.id);
            setData({
                nombre_empresa: seguimiento.nombre_empresa,
                id_user: seguimiento.id_user,
                id_paquete: seguimiento.id_paquete,
                estado: seguimiento.estado,
                fecha_inicio: seguimiento.fecha_inicio,
                fecha_fin: seguimiento.fecha_fin || '',
                descripcion: seguimiento.descripcion || '',
            });
        } else {
            setIsEditing(false);
            setCurrentId(null);
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
        const reloadAfterClose = () => {
            handleClose();
            window.location.reload(); // recargar la página después de cerrar
        };

        if (isEditing && currentId) {
            put(route('seguimiento-empresa.update', currentId), {
                onSuccess: reloadAfterClose,
            });
        } else {
            post(route('seguimiento-empresa.store'), {
                onSuccess: reloadAfterClose,
            });
        }
    };

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este seguimiento?')) {
            destroy(route('seguimiento-empresa.destroy', id));
        }
    };

    const renderPaginationLinks = () => (
        <nav aria-label="Page navigation">
            <ul className="inline-flex items-center -space-x-px">
                {seguimientos.links.map((link: any, key: number) => (
                    <li key={key}>
                        {link.url === null ? (
                            <span
                                className={`border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 ${
                                    link.active ? 'bg-blue-50 text-blue-600' : ''
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <button
                                onClick={() => router.get(link.url, { search }, { preserveState: true })}
                                className={`border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                                    link.active ? 'bg-blue-50 text-blue-600' : ''
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );

    // --- NUEVO CÓDIGO ---
    // Agrupa los seguimientos por usuario usando useMemo para optimización
    const groupedSeguimientos = useMemo(() => {
        const groups: { [key: number]: GroupedSeguimiento } = {};
        seguimientos.data.forEach((seguimiento: Seguimiento) => {
            const userId = seguimiento.usuario.id;
            if (!groups[userId]) {
                groups[userId] = {
                    user: seguimiento.usuario,
                    seguimientos: [],
                };
            }
            groups[userId].seguimientos.push(seguimiento);
        });
        return Object.values(groups);
    }, [seguimientos.data]);

    return (
        <AppLayout
            user={usePage().props.auth.user}
            header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Seguimiento de Empresas</h2>}
        >
            <Head title="Seguimiento de Empresas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <TextField label="Buscar..." variant="outlined" value={search} onChange={handleSearch} sx={{ width: '300px' }} />
                            {/* Nuevo botón para generar PDF */}
                            <Button
                                variant="contained"
                                color="secondary"
                                // 🚀 AQUI ESTA LA MODIFICACION
                                onClick={() => {
                                    const pdfUrl = route('seguimiento-empresa.pdf', { search: search });
                                    window.open(pdfUrl, '_blank');
                                }}
                                sx={{ ml: 2 }}
                            >
                                Generar PDF
                            </Button>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                                Nuevo Seguimiento
                            </Button>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Empresa</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Paquete</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Inicio</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Fin</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupedSeguimientos.length > 0 ? (
                                        groupedSeguimientos.map((group, groupIndex) => (
                                            <React.Fragment key={group.user.id}>
                                                {group.seguimientos.map((row: Seguimiento, rowIndex: number) => (
                                                    <TableRow key={row.id}>
                                                        {/* Muestra el nombre del usuario solo en la primera fila de cada grupo */}
                                                        {rowIndex === 0 ? (
                                                            <TableCell component="th" scope="row" rowSpan={group.seguimientos.length}>
                                                                {group.user.name}
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell style={{ display: 'none' }} />
                                                        )}
                                                        <TableCell>{row.nombre_empresa}</TableCell>
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
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No se encontraron seguimientos.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>{renderPaginationLinks()}</Box>
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                    }}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            textAlign: 'center',
                            mb: 1,
                        }}
                    >
                        {isEditing ? 'Editar Seguimiento' : 'Crear Seguimiento'}
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Campos principales en un diseño más compacto */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre de Empresa"
                                value={data.nombre_empresa}
                                onChange={(e) => setData('nombre_empresa', e.target.value)}
                                required
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Usuario</InputLabel>
                                <Select
                                    value={data.id_user}
                                    label="Usuario"
                                    onChange={(e) => setData('id_user', e.target.value as number)}
                                    variant="outlined"
                                >
                                    {users.map((user: User) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Paquete</InputLabel>
                                <Select
                                    value={data.id_paquete}
                                    label="Paquete"
                                    onChange={(e) => setData('id_paquete', e.target.value as number)}
                                    variant="outlined"
                                >
                                    {paquetes.map((paquete: Paquete) => (
                                        <MenuItem key={paquete.id} value={paquete.id}>
                                            {paquete.nombre_paquete}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Campo de Estado - Mantenemos la lógica pero mejoramos los estilos */}
                        <Grid item xs={12}>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    label="Estado"
                                    value={data.estado}
                                    disabled
                                    variant="outlined"
                                    sx={{
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            '-webkit-text-fill-color': 'text.primary',
                                        },
                                    }}
                                />
                            ) : (
                                <FormControl fullWidth required>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={data.estado}
                                        label="Estado"
                                        onChange={(e) => setData('estado', e.target.value as string)}
                                        variant="outlined"
                                    >
                                        <MenuItem value={'En proceso'}>En proceso</MenuItem>
                                        <MenuItem value={'Completado'}>Completado</MenuItem>
                                        <MenuItem value={'Sin exito'}>Sin éxito</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        </Grid>

                        {/* Campos de Fecha en una misma fila, con espaciado mejorado */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Fecha de Inicio"
                                type="date"
                                value={data.fecha_inicio}
                                onChange={(e) => setData('fecha_inicio', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Fecha de Fin"
                                type="date"
                                value={data.fecha_fin}
                                onChange={(e) => setData('fecha_fin', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
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
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>

                    {/* Botones con estilos actualizados */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            sx={{
                                borderRadius: '8px',
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    borderColor: 'primary.light',
                                },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                borderRadius: '8px',
                                backgroundColor: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            }}
                        >
                            {isEditing ? 'Guardar Cambios' : 'Crear'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </AppLayout>
    );
};

export default Index;
