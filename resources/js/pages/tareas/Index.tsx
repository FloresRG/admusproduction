import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    useTheme,
    useMediaQuery,
    Checkbox,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tareas',
        href: '/tareas',
    },
];

export default function TareasIndex() {
    const [tareas, setTareas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTareaTitle, setNewTareaTitle] = useState('');
    const [newTareaDescripcion, setNewTareaDescripcion] = useState('');
    const [newTareaFecha, setNewTareaFecha] = useState('');
    const [newTareaPrioridad, setNewTareaPrioridad] = useState('');
    const [newTareaTipoId, setNewTareaTipoId] = useState('');
    const [newTareaCompanyId, setNewTareaCompanyId] = useState('');
    const [tipos, setTipos] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTareaId, setEditTareaId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchTareas();
        fetchTipos();
        fetchCompanies();
    }, []);

    const fetchTareas = () => {
        axios
            .get('/api/tareas')
            .then((response) => setTareas(response.data))
            .catch((error) => console.error('Error fetching tareas:', error));
    };

    const fetchTipos = () => {
        axios
            .get('/api/tipos')
            .then((response) => setTipos(response.data))
            .catch((error) => console.error('Error fetching tipos:', error));
    };

    const fetchCompanies = () => {
        axios
            .get('/api/companies')
            .then((response) => setCompanies(response.data))
            .catch((error) => console.error('Error fetching companies:', error));
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setNewTareaTitle('');
        setNewTareaDescripcion('');
        setNewTareaFecha('');
        setNewTareaPrioridad('');
        setNewTareaTipoId('');
        setNewTareaCompanyId('');
        setShowModal(true);
    };

    const openEditModal = (tarea) => {
        setIsEditMode(true);
        setEditTareaId(tarea.id);
        setNewTareaTitle(tarea.titulo);
        setNewTareaDescripcion(tarea.descripcion);
        setNewTareaFecha(tarea.fecha);
        setNewTareaPrioridad(tarea.prioridad);
        setNewTareaTipoId(tarea.tipo_id);
        setNewTareaCompanyId(tarea.company_id);
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (
            !newTareaTitle.trim() ||
            !newTareaDescripcion.trim() ||
            !newTareaFecha.trim() ||
            !newTareaPrioridad.trim() ||
            !newTareaTipoId ||
            !newTareaCompanyId
        ) {
            return alert('Todos los campos son obligatorios');
        }

        setLoading(true);

        const payload = {
            titulo: newTareaTitle,
            descripcion: newTareaDescripcion,
            fecha: newTareaFecha,
            prioridad: newTareaPrioridad,
            tipo_id: newTareaTipoId,
            company_id: newTareaCompanyId,
        };

        const request = isEditMode ? axios.put(`/tareas/${editTareaId}`, payload) : axios.post('/tareas', payload);

        request
            .then(() => {
                setShowModal(false);
                fetchTareas();
            })
            .catch((error) => {
                console.error('Error guardando la tarea:', error);
                alert('Hubo un error');
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteTarea = (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;

        axios
            .delete(`/tareas/${id}`)
            .then(() => fetchTareas())
            .catch((error) => {
                console.error('Error al eliminar la tarea:', error);
                alert('Hubo un error al eliminar la tarea');
            });
    };

    // Filtrar tareas por nombre o descripción
    const filteredTareas = tareas.filter(
        (t) =>
            t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tareas" />

            <Box sx={{ padding: 2 }}>
                {/* Buscador */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ marginRight: 2 }}
                        InputProps={{
                            startAdornment: (
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                        onClick={openCreateModal}
                        startIcon={<EditIcon />}
                    >
                        Nueva Tarea
                    </Button>
                </Box>

                {/* Tabla */}
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, overflowX: 'auto' }}>
                    <Table stickyHeader sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Prioridad</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Empresa</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTareas.map((tarea) => (
                                <TableRow key={tarea.id} hover>
                                    <TableCell>{tarea.titulo}</TableCell>
                                    <TableCell>{tarea.prioridad}</TableCell>
                                    <TableCell>{tarea.fecha}</TableCell>
                                    <TableCell>{tarea.tipo?.nombre_tipo}</TableCell>
                                    <TableCell>{tarea.company?.nombre}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => openEditModal(tarea)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteTarea(tarea.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal Material UI */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{isEditMode ? 'Editar Tarea' : 'Crear Nueva Tarea'}</Typography>
                    <IconButton onClick={() => setShowModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Título de la tarea"
                        variant="outlined"
                        fullWidth
                        value={newTareaTitle}
                        onChange={(e) => setNewTareaTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Descripción de la tarea"
                        variant="outlined"
                        fullWidth
                        value={newTareaDescripcion}
                        onChange={(e) => setNewTareaDescripcion(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Fecha de vencimiento"
                        variant="outlined"
                        fullWidth
                        type="date"
                        value={newTareaFecha}
                        onChange={(e) => setNewTareaFecha(e.target.value)}
                        sx={{ mb: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Prioridad"
                        variant="outlined"
                        fullWidth
                        value={newTareaPrioridad}
                        onChange={(e) => setNewTareaPrioridad(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="select-tipo-label">Tipo</InputLabel>
                        <Select
                            labelId="select-tipo-label"
                            value={newTareaTipoId || ''}
                            onChange={(e) => setNewTareaTipoId(e.target.value)}
                        >
                            <MenuItem value="">Seleccionar tipo</MenuItem>
                            {tipos.map((tipo) => (
                                <MenuItem key={tipo.id} value={tipo.id}>
                                    {tipo.nombre_tipo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="select-company-label">Empresa</InputLabel>
                        <Select
                            labelId="select-company-label"
                            value={newTareaCompanyId || ''}
                            onChange={(e) => setNewTareaCompanyId(e.target.value)}
                        >
                            <MenuItem value="">Seleccionar empresa</MenuItem>
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowModal(false)}
                        color="inherit"
                        variant="outlined"
                        disabled={loading}
                        startIcon={<CloseIcon />}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
}
