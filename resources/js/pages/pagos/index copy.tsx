import AppLayout from '@/layouts/app-layout';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import LinkIcon from '@mui/icons-material/Link';
import NotesIcon from '@mui/icons-material/Notes';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import TitleIcon from '@mui/icons-material/Title';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    InputAdornment,
    MenuItem,
    Modal,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs = [
    { label: 'Dashboard', url: '/' },
    { label: 'Pagos', url: '/pagos' },
];

export default function Pagos() {
    const [comprobantes, setComprobantes] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [newComprobante, setNewComprobante] = useState({
        comprobante: null,
        detalle: '',
        glosa: '',
        company_id: 1, // Este será preseleccionado por defecto con la primera compañía
        mes: '', // Este será preseleccionado por defecto con el mes actual
        link_id: 1, // Este será por defecto y oculto
        tipo: '', // Este será por defecto y oculto
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const tipos = ['Boleta', 'Factura', 'Recibo'];

    // Función para obtener el mes actual en inglés (capitalize)
    const getCurrentMonthName = () => {
        const date = new Date();
        return months[date.getMonth()];
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Establecer valores por defecto al abrir el modal o al cargar la página
    useEffect(() => {
        // Solo establece valores si el modal no está abierto o si las compañías se han cargado
        if (!openModal && companies.length > 0) {
            setNewComprobante((prev) => ({
                ...prev,
                company_id: companies[0].id, // Primera compañía de la API
                mes: getCurrentMonthName(), // Mes actual
                tipo: tipos[0] || '', // Primer tipo por defecto
                link_id: 1, // Link ID por defecto
            }));
        } else if (!openModal && companies.length === 0) {
            // Si las compañías aún no cargan, al menos establece el mes y tipo
            setNewComprobante((prev) => ({
                ...prev,
                mes: getCurrentMonthName(),
                tipo: tipos[0] || '',
                link_id: 1,
            }));
        }
    }, [companies, openModal, tipos]); // Dependencias para re-calcular

    const fetchData = async () => {
        try {
            setLoading(true);
            const [comprobantesResponse, companiesResponse] = await Promise.all([axios.get('/comprobantes'), axios.get('/api/companies')]);
            setComprobantes(comprobantesResponse.data);
            setCompanies(companiesResponse.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        // Resetear a los valores por defecto calculados para la siguiente apertura
        setNewComprobante({
            comprobante: null,
            detalle: '',
            glosa: '',
            company_id: companies.length > 0 ? companies[0].id : '', // Reestablecer a la primera compañía
            mes: getCurrentMonthName(), // Reestablecer al mes actual
            link_id: 1,
            tipo: tipos[0] || '',
        });
        setFormErrors({});
        setSuccessMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewComprobante((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        setNewComprobante((prev) => ({ ...prev, comprobante: e.target.files[0] }));
        if (formErrors.comprobante) {
            setFormErrors((prev) => ({ ...prev, comprobante: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormErrors({});
        setError(null);
        setSuccessMessage('');

        const formData = new FormData();
        for (const key in newComprobante) {
            if (newComprobante[key] !== null && newComprobante[key] !== '') {
                formData.append(key, newComprobante[key]);
            }
        }
        if (!formData.has('tipo')) {
            formData.append('tipo', 'PDF');
        }

        try {
            const response = await axios.post('/comprobante', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccessMessage(response.data.message);
            fetchData();
            handleCloseModal();
        } catch (err) {
            console.error('Error submitting comprobante:', err);
            if (err.response && err.response.data && err.response.data.errors) {
                setFormErrors(err.response.data.errors);
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al crear el comprobante. Por favor, revisa los campos e inténtalo de nuevo.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const getFileName = (filePath) => {
        if (!filePath) return 'Sin archivo';
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    };

    // --- Lógica para Cards ---
    const totalComprobantes = comprobantes.length;
    const totalCompanies = new Set(comprobantes.flatMap((c) => c.company_associations.map((a) => a.company_id))).size;
    const uniqueComprobanteTypes = new Set(comprobantes.map((c) => c.tipo)).size;
    const recentComprobantesCount = comprobantes.filter((c) => {
        const createdAt = new Date(c.created_at);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return createdAt > oneMonthAgo;
    }).length;

    // --- Lógica para DataGrid y Filtros ---
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'tipo', headerName: 'Tipo', width: 120 },
        { field: 'detalle', headerName: 'Detalle', flex: 1, minWidth: 200 },
        { field: 'glosa', headerName: 'Glosa', flex: 1, minWidth: 200 },
        {
            field: 'fileName',
            headerName: 'Archivo',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DescriptionIcon />}
                    href={`/storage/${params.row.comprobante}`}
                    target="_blank"
                    sx={{ textTransform: 'none' }}
                >
                    Ver PDF
                </Button>
            ),
        },
        {
            field: 'companies',
            headerName: 'Empresas Asociadas',
            width: 250,
            renderCell: (params) => {
                const associatedCompanies = params.row.company_associations
                    .map((assoc) => assoc.company?.name || 'Desconocido')
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .join(', ');
                return <Typography variant="body2">{associatedCompanies || 'N/A'}</Typography>;
            },
        },
        {
            field: 'meses',
            headerName: 'Meses Asociados',
            width: 180,
            renderCell: (params) => {
                const associatedMonths = params.row.company_associations
                    .map((assoc) => assoc.mes)
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .join(', ');
                return <Typography variant="body2">{associatedMonths || 'N/A'}</Typography>;
            },
        },
    ];

    const filteredComprobantes = useMemo(() => {
        let currentFiltered = comprobantes;

        if (searchTerm) {
            currentFiltered = currentFiltered.filter(
                (comprobante) =>
                    Object.values(comprobante).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())) ||
                    comprobante.company_associations.some(
                        (assoc) =>
                            String(assoc.company?.name || '')
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                            String(assoc.mes || '')
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()),
                    ),
            );
        }

        if (selectedMonth) {
            currentFiltered = currentFiltered.filter((comprobante) => comprobante.company_associations.some((assoc) => assoc.mes === selectedMonth));
        }

        if (selectedCompany) {
            currentFiltered = currentFiltered.filter((comprobante) =>
                comprobante.company_associations.some((assoc) => assoc.company_id === selectedCompany),
            );
        }

        if (selectedType) {
            currentFiltered = currentFiltered.filter((comprobante) => comprobante.tipo === selectedType);
        }

        return currentFiltered;
    }, [comprobantes, searchTerm, selectedMonth, selectedCompany, selectedType]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Panel de Gestión de <span style={{ color: theme.palette.secondary.main }}>Comprobantes</span>
                </Typography>

                {/* --- Cards de Métricas --- */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            elevation={3}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                bgcolor: theme.palette.info.light,
                                borderRadius: '12px',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' },
                            }}
                        >
                            <FolderOpenIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.info.dark }} />
                            <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
                                <Typography variant="h6" component="div" sx={{ color: theme.palette.info.dark }}>
                                    Total Comprobantes
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.info.dark }}>
                                    {totalComprobantes}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            elevation={3}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                bgcolor: theme.palette.success.light,
                                borderRadius: '12px',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' },
                            }}
                        >
                            <PeopleIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.success.dark }} />
                            <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
                                <Typography variant="h6" component="div" sx={{ color: theme.palette.success.dark }}>
                                    Empresas Asociadas
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.success.dark }}>
                                    {totalCompanies}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            elevation={3}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                bgcolor: theme.palette.warning.light,
                                borderRadius: '12px',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' },
                            }}
                        >
                            <AttachMoneyIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.warning.dark }} />
                            <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
                                <Typography variant="h6" component="div" sx={{ color: theme.palette.warning.dark }}>
                                    Tipos de Comprobantes
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.warning.dark }}>
                                    {uniqueComprobanteTypes}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card
                            elevation={3}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                bgcolor: theme.palette.primary.light,
                                borderRadius: '12px',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'translateY(-5px)' },
                            }}
                        >
                            <CheckCircleOutlineIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.dark }} />
                            <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
                                <Typography variant="h6" component="div" sx={{ color: theme.palette.primary.dark }}>
                                    Comprobantes Recientes
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                                    {recentComprobantesCount}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                    sx={{
                        mb: 3,
                        py: 1.2,
                        px: 3,
                        borderRadius: '8px',
                        boxShadow: theme.shadows[3],
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            transform: 'scale(1.02)',
                        },
                    }}
                >
                    Subir Nuevo Comprobante
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                        {error}
                    </Alert>
                )}
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
                        {successMessage}
                    </Alert>
                )}

                <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', overflow: 'hidden' }}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                        Listado Detallado de <span style={{ color: theme.palette.secondary.main }}>Comprobantes</span>
                    </Typography>

                    {/* --- Filtros y Buscador --- */}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Buscar Comprobante"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ bgcolor: 'background.paper', borderRadius: '8px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                label="Filtrar por Mes"
                                variant="outlined"
                                fullWidth
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                sx={{ bgcolor: 'background.paper', borderRadius: '8px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos los meses</em>
                                </MenuItem>
                                {months.map((month) => (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                label="Filtrar por Compañía"
                                variant="outlined"
                                fullWidth
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                                sx={{ bgcolor: 'background.paper', borderRadius: '8px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BusinessIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todas las compañías</em>
                                </MenuItem>
                                {companies.map((company) => (
                                    <MenuItem key={company.id} value={company.id}>
                                        {company.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                label="Filtrar por Tipo"
                                variant="outlined"
                                fullWidth
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                sx={{ bgcolor: 'background.paper', borderRadius: '8px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionOutlinedIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos los tipos</em>
                                </MenuItem>
                                {tipos.map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, flexDirection: 'column' }}>
                            <CircularProgress size={60} sx={{ mb: 2 }} />
                            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                Cargando comprobantes...
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ height: 600, width: '100%' }}>
                            <DataGrid
                                rows={filteredComprobantes}
                                columns={columns}
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 10, page: 0 },
                                    },
                                }}
                                disableRowSelectionOnClick
                                sx={{
                                    '.MuiDataGrid-columnHeaders': {
                                        backgroundColor: theme.palette.primary.light,
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        color: theme.palette.text.primary,
                                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    },
                                    '.MuiDataGrid-columnHeaderTitle': {
                                        color: theme.palette.text.primary,
                                    },
                                    '.MuiDataGrid-row': {
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                        transition: 'background-color 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.selected,
                                        },
                                    },
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: theme.shadows[1],
                                }}
                                localeText={{
                                    MuiDataGrid: {
                                        noRowsLabel: 'No hay comprobantes para mostrar',
                                        footerRowSelected: (count) => (count !== 1 ? `${count} filas seleccionadas` : `${count} fila seleccionada`),
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Paper>

                {/* Modal para Subir Nuevo Comprobante */}
                <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title" aria-describedby="modal-description">
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '95%', sm: 600, md: 700 },
                            bgcolor: 'background.paper',
                            border: '1px solid #ddd',
                            borderRadius: '12px',
                            boxShadow: 24,
                            p: { xs: 3, sm: 5 },
                            maxHeight: '90vh',
                            overflowY: 'auto',
                        }}
                    >
                        <Typography
                            id="modal-title"
                            variant="h5"
                            component="h2"
                            sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.dark, textAlign: 'center' }}
                        >
                            Subir Nuevo <span style={{ color: theme.palette.secondary.main }}>Comprobante</span>
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        startIcon={<FileUploadIcon />}
                                        sx={{
                                            height: 56,
                                            borderColor: formErrors.comprobante ? theme.palette.error.main : theme.palette.grey[400],
                                            color: theme.palette.text.secondary,
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                color: theme.palette.primary.main,
                                                backgroundColor: theme.palette.action.hover,
                                            },
                                            transition: 'all 0.3s ease',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        {newComprobante.comprobante ? newComprobante.comprobante.name : 'Seleccionar Archivo (PDF, JPG, PNG)'}
                                        <input type="file" hidden name="comprobante" onChange={handleFileChange} required />
                                    </Button>
                                    {formErrors.comprobante && (
                                        <Typography color="error" variant="caption">
                                            {formErrors.comprobante[0]}
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Detalle"
                                        name="detalle"
                                        value={newComprobante.detalle}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={!!formErrors.detalle}
                                        helperText={formErrors.detalle ? formErrors.detalle[0] : ''}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <NotesIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Glosa"
                                        name="glosa"
                                        value={newComprobante.glosa}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={!!formErrors.glosa}
                                        helperText={formErrors.glosa ? formErrors.glosa[0] : ''}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TitleIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Compañía"
                                        name="company_id"
                                        value={newComprobante.company_id}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        disabled // Campo deshabilitado
                                        error={!!formErrors.company_id}
                                        helperText={formErrors.company_id ? formErrors.company_id[0] : ''}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BusinessIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        {/* Renderizar solo la opción de la compañía seleccionada por defecto */}
                                        {newComprobante.company_id && (
                                            <MenuItem key={newComprobante.company_id} value={newComprobante.company_id}>
                                                {companies.find((c) => c.id === newComprobante.company_id)?.name || 'Cargando...'}
                                            </MenuItem>
                                        )}
                                    </TextField>
                                </Grid>
                                {/* Campo "Mes de Asociación" a ancho completo y preseleccionado con el mes actual */}
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        select
                                        label="Mes de Asociación"
                                        name="mes"
                                        value={newComprobante.mes}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={!!formErrors.mes}
                                        helperText={formErrors.mes ? formErrors.mes[0] : ''}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione un mes</em>
                                        </MenuItem>
                                        {months.map((month) => (
                                            <MenuItem key={month} value={month}>
                                                {month}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Campo "Link ID" - Oculto con display: 'none' */}
                                <Grid item xs={12} sm={6} sx={{ display: 'none' }}>
                                    <TextField
                                        label="Link ID"
                                        name="link_id"
                                        type="number"
                                        value={newComprobante.link_id}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        error={!!formErrors.link_id}
                                        helperText={formErrors.link_id ? formErrors.link_id[0] : ''}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LinkIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                {/* Campo "Tipo de Comprobante" - Oculto con display: 'none' */}
                                <Grid item xs={12} sm={6} sx={{ display: 'none' }}>
                                    <TextField
                                        select
                                        label="Tipo de Comprobante"
                                        name="tipo"
                                        value={newComprobante.tipo}
                                        onChange={handleChange}
                                        fullWidth
                                        error={!!formErrors.tipo}
                                        helperText={formErrors.tipo ? formErrors.tipo[0] : ''}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DescriptionOutlinedIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        {tipos.map((tipo) => (
                                            <MenuItem key={tipo} value={tipo}>
                                                {tipo}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                        <Button
                                            onClick={handleCloseModal}
                                            sx={{
                                                mr: 2,
                                                px: 3,
                                                py: 1.2,
                                                borderRadius: '8px',
                                                transition: 'background-color 0.3s ease, transform 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: theme.palette.grey[200],
                                                    transform: 'scale(1.02)',
                                                },
                                            }}
                                            disabled={submitting}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={submitting}
                                            sx={{
                                                px: 3,
                                                py: 1.2,
                                                borderRadius: '8px',
                                                boxShadow: theme.shadows[4],
                                                transition: 'background-color 0.3s ease, transform 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: theme.palette.primary.dark,
                                                    transform: 'scale(1.02)',
                                                },
                                            }}
                                        >
                                            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Subir Comprobante'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Modal>
            </Container>
        </AppLayout>
    );
}
