import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    Category as CategoryIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ListAlt as ListAltIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableFooter,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Tarea {
    id: number;
    titulo: string;
    prioridad: string;
    descripcion: string;
    fecha: string;
    tipo?: { id: number; nombre_tipo: string };
    company?: { id: number; name: string };
}

export default function Tareas() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [asignarEmpresa, setAsignarEmpresa] = useState('no');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        prioridad: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        tipo_id: '',
        company_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [tipos, setTipos] = useState<{ id: number; nombre: string }[]>([]);
    const [empresas, setEmpresas] = useState<{ id: number; nombre: string }[]>([]);

    // Obtener la fecha desde la URL
    const queryParams = new URLSearchParams(window.location.search);
    const fechaParam = queryParams.get('fecha');
    const today = new Date().toISOString().split('T')[0];
    const esHoy = !fechaParam || fechaParam === today;

    useEffect(() => {
        fetchTareas();
        axios.get('/api/tipos').then((res) => setTipos(res.data));
        axios.get('/api/companies').then((res) => setEmpresas(res.data));
    }, [fechaParam]);

    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    useEffect(() => {
        const maxPage = Math.max(0, Math.ceil(filteredTareas.length / rowsPerPage) - 1);
        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [rowsPerPage, page]);

    const fetchTareas = () => {
        const url = fechaParam ? `/api/tareas-por-fecha?fecha=${fechaParam}` : '/api/tareas';

        axios
            .get(url)
            .then((res) => setTareas(res.data))
            .catch((err) => console.error('Error al cargar tareas:', err));
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setEditId(null);
        setAsignarEmpresa('no');
        setFormData({
            titulo: '',
            prioridad: '',
            descripcion: '',
            fecha: new Date().toISOString().split('T')[0],
            tipo_id: '',
            company_id: '',
        });
        setShowModal(true);
    };

    const openEditModal = (tarea: Tarea) => {
        setIsEditMode(true);
        setEditId(tarea.id);
        setFormData({
            titulo: tarea.titulo,
            prioridad: tarea.prioridad,
            descripcion: tarea.descripcion,
            fecha: tarea.fecha,
            tipo_id: tarea.tipo?.id ? String(tarea.tipo.id) : '',
            company_id: tarea.company?.id ? String(tarea.company.id) : '',
        });
        setAsignarEmpresa(tarea.company ? 'si' : 'no');
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!formData.titulo.trim()) return alert('El título es obligatorio');
        setLoading(true);

        const payload = {
            ...formData,
            tipo_id: formData.tipo_id ? Number(formData.tipo_id) : null,
            company_id: formData.company_id ? Number(formData.company_id) : null,
        };

        const request = isEditMode ? axios.put(`/tareas/${editId}`, payload) : axios.post('/create/tareas', payload);

        request
            .then(() => {
                setShowModal(false);
                fetchTareas();
            })
            .catch((err) => {
                console.error('Error al guardar tarea:', err);
                alert('Hubo un error al guardar la tarea');
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (id: number) => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        axios
            .delete(`/tareas/${id}`)
            .then(() => fetchTareas())
            .catch((err) => {
                console.error('Error al eliminar tarea:', err);
                alert('Hubo un error al eliminar la tarea');
            });
    };

    const filteredTareas = tareas.filter((t) => t.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleRowCheckbox = (id: number) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const handleHeaderCheckbox = () => {
        if (selectedRows.length === filteredTareas.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredTareas.map((t) => t.id));
        }
    };

    const handleAsignarTareas = () => {
        if (!confirm('¿Asignar tareas a cada pasante?')) return;

        axios
            .post('/asignar-tareas')
            .then((res) => {
                alert(res.data.message);
            })
            .catch((err) => {
                console.error('Error al asignar tareas:', err);
                alert(err.response?.data?.message || 'Error al asignar tareas');
            });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tareas', href: '/tareas' }]}>
            <Head title="Tareas" />

            <Box sx={{ py: 6, mx: { xs: 0, md: 4 } }}>
                {fechaParam && (
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Tareas del día: {fechaParam}
                    </Typography>
                )}

                {/* Buscador y botones */}
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 2,
                        alignItems: { md: 'center' },
                        justifyContent: { md: 'space-between' },
                    }}
                >
                    <TextField
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 320 }}
                        InputProps={{
                            startAdornment: (
                                <IconButton tabIndex={-1}>
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="contained" color="primary" onClick={openCreateModal} startIcon={<EditIcon />} sx={{ fontWeight: 'bold' }}>
                            Nueva Tarea
                        </Button>

                        {esHoy && (
                            <Button variant="contained" color="secondary" onClick={handleAsignarTareas} sx={{ fontWeight: 'bold' }}>
                                Asignar Tareas a Pasantes
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Tabla de tareas */}
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        overflowX: 'auto',
                        border: '1px solid #e0e0e0',
                        background: (theme) => theme.palette.background.paper,
                        mx: { xs: 0, md: 2 },
                    }}
                >
                    <Table stickyHeader sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    padding="checkbox"
                                    sx={(theme) => ({
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: { xs: '8px', md: '16px' },
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                    })}
                                >
                                    <Checkbox
                                        checked={filteredTareas.length > 0 && selectedRows.length === filteredTareas.length}
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < filteredTareas.length}
                                        onChange={handleHeaderCheckbox}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={(theme) => ({
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: { xs: '8px', md: '16px' },
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                    })}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon fontSize="small" /> Titulo
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={(theme) => ({
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: { xs: '8px', md: '16px' },
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                    })}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CategoryIcon fontSize="small" /> Prioridad
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={(theme) => ({
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: { xs: '8px', md: '16px' },
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                    })}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon fontSize="small" /> Fecha
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={(theme) => ({
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: { xs: '8px', md: '16px' },
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                    })}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon fontSize="small" /> Descripcion
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={(theme) => ({
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: { xs: '8px', md: '16px' },
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                    })}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ListAltIcon fontSize="small" /> Tipo
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={(theme) => ({
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: { xs: '8px', md: '16px' },
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                    })}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon fontSize="small" /> Empresa
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={(theme) => ({
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: { xs: '8px', md: '16px' },
                                        fontSize: { xs: '0.875rem', md: '1rem' },
                                    })}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EditIcon fontSize="small" /> / <DeleteIcon fontSize="small" /> Acciones
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTareas
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((tarea) => (
                                    <TableRow key={tarea.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox 
                                                checked={selectedRows.includes(tarea.id)} 
                                                onChange={() => handleRowCheckbox(tarea.id)} 
                                            />
                                        </TableCell>
                                        <TableCell>{tarea.titulo}</TableCell>
                                        <TableCell>{tarea.prioridad || '-'}</TableCell>
                                        <TableCell>{tarea.fecha || '-'}</TableCell>
                                        <TableCell>{tarea.descripcion || '-'}</TableCell>
                                        <TableCell>{tarea.tipo?.nombre_tipo || '—'}</TableCell>
                                        <TableCell>{tarea.company?.name || '—'}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => openEditModal(tarea)} aria-label="Editar">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(tarea.id)} aria-label="Eliminar">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {filteredTareas.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        No se encontraron tareas.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={8} sx={{ p: 0 }}>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={filteredTareas.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage="Filas por página:"
                                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                                        sx={{
                                            '.MuiTablePagination-toolbar': {
                                                background: theme.palette.background.paper,
                                            }
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal de Crear/Editar */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}</Typography>
                    <IconButton onClick={() => setShowModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Título"
                        fullWidth
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">Prioridad</FormLabel>
                        <RadioGroup row value={formData.prioridad} onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}>
                            <FormControlLabel
                                value="alta"
                                control={<Radio sx={{ color: 'red', '&.Mui-checked': { color: 'red' } }} />}
                                label="Alta"
                            />
                            <FormControlLabel
                                value="media"
                                control={<Radio sx={{ color: 'orange', '&.Mui-checked': { color: 'orange' } }} />}
                                label="Media"
                            />
                            <FormControlLabel
                                value="baja"
                                control={<Radio sx={{ color: 'green', '&.Mui-checked': { color: 'green' } }} />}
                                label="Baja"
                            />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        label="Fecha"
                        type="date"
                        fullWidth
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Descripción"
                        fullWidth
                        multiline
                        minRows={3}
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        label="Tipo"
                        fullWidth
                        value={formData.tipo_id}
                        onChange={(e) => setFormData({ ...formData, tipo_id: e.target.value })}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="">Sin tipo</MenuItem>
                        {tipos.map((tipo) => (
                            <MenuItem key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">¿Quieres asignarle una empresa?</FormLabel>
                        <RadioGroup
                            row
                            value={asignarEmpresa}
                            onChange={(e) => {
                                setAsignarEmpresa(e.target.value);
                                if (e.target.value === 'no') {
                                    setFormData({ ...formData, company_id: '' });
                                }
                            }}
                        >
                            <FormControlLabel value="si" control={<Radio />} label="Sí" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                    {asignarEmpresa === 'si' && (
                        <TextField
                            select
                            label="Empresa"
                            fullWidth
                            value={formData.company_id}
                            onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="">Sin empresa</MenuItem>
                            {empresas.map((emp) => (
                                <MenuItem key={emp.id} value={emp.id}>
                                    {emp.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)} color="inherit" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
                        {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
}
