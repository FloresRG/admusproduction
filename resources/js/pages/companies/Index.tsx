import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    Category as CategoryIcon,
    Close as CloseIcon,
    DateRange as DateRangeIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    EventAvailable as EventAvailableIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    Alert,
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';

type AvailabilityDay = {
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
};
type Company = {
    id: number;
    name: string;
    category: {
        name: string;
    };
    contract_duration: string;
    start_date?: string;
    end_date?: string;
    estado: 'activo' | 'inactivo';
    availabilityDays?: AvailabilityDay[];
    availability_days?: AvailabilityDay[];
};
type Props = {
    companies: Company[];
    influencersByDay: {
        [day: string]: { empresa: string; influencer: string }[];
    };
};

function formatDay(day: string) {
    const dayMap: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };
    return dayMap[day] || day;
}

const CompaniesIndex = ({ companies, influencersByDay }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [companiesList, setCompaniesList] = useState(companies);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Buscador reactivo
    const filteredCompanies = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return companiesList;
        return companiesList.filter((c) => c.name.toLowerCase().includes(s) || c.category?.name?.toLowerCase().includes(s));
    }, [search, companiesList]);

    // Paginación
    const paginatedCompanies = useMemo(
        () => filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredCompanies, page, rowsPerPage],
    );

    // Conteo de empresas por día
    const dayCounts = useMemo(() => {
        const counts: Record<string, number> = {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
        };
        companiesList.forEach((company) => {
            const days = company.availability_days || [];
            // Usar Set para evitar contar dos veces el mismo día en una empresa
            const uniqueDays = new Set(days.map((d) => d.day_of_week));
            uniqueDays.forEach((day) => {
                if (counts[day] !== undefined) counts[day]++;
            });
        });
        return counts;
    }, [companiesList]);

    function handleDelete(company: Company) {
        setSelectedCompany(company);
        setModalOpen(true);
    }

    async function confirmDelete() {
        if (selectedCompany) {
            try {
                const response = await fetch(`/companies/${selectedCompany.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });
                const data = await response.json();
                setNotification(data.success || 'Compañía eliminada');
                setCompaniesList(companiesList.filter((c) => c.id !== selectedCompany.id));
            } catch (e) {
                setNotification('Error al eliminar la compañía');
            }
            setModalOpen(false);
            setSelectedCompany(null);
        }
    }
    async function toggleEstado(company: Company) {
        try {
            const response = await fetch(`/companies/${company.id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                // Eliminar la actualización del estado local
                // const updatedCompany = await response.json();
                // setCompaniesList((prev) => prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c)));

                // 💡 Recarga COMPLETA de la página para obtener los nuevos datos desde Laravel.
                window.location.reload();

                // setNotification(`Estado actualizado: ${updatedCompany.estado}`); // Esta línea no se ejecutará antes de la recarga.
            } else {
                setNotification('Error al cambiar estado');
            }
        } catch (error) {
            setNotification('Error al cambiar estado');
        }
    }

    function cancelDelete() {
        setModalOpen(false);
        setSelectedCompany(null);
    }

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <AppLayout>
            <Head title="Empresas" />
            <Snackbar
                open={!!notification}
                autoHideDuration={4000}
                onClose={() => setNotification(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setNotification(null)} severity="success" sx={{ width: '100%' }}>
                    {notification}
                </Alert>
            </Snackbar>
            {/* Conteo de empresas por día */}
            <Grid container spacing={2} sx={{ mb: 3, mx: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 } }} justifyContent="center">
                {Object.entries(dayCounts).map(([day, count]) => (
                    <Grid
                        item
                        xs={6} // 2 tarjetas por fila en móvil
                        sm={4} // 3 tarjetas por fila en tablet pequeño
                        md={3} // 4 tarjetas por fila en tablet
                        lg={2.4} // 5 tarjetas por fila en desktop
                        xl={2} // 6 tarjetas por fila en pantallas grandes
                        key={day}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Card
                            sx={{
                                width: {
                                    xs: 160, // Más estrecho en móvil
                                    sm: 170, // Compacto en tablet pequeño
                                    md: 190, // Medio en desktop
                                    lg: 210, // Desktop grande
                                    xl: 230, // Pantallas XL
                                },
                                height: 'auto', // Altura automática para adaptarse al contenido
                                minHeight: {
                                    xs: 280, // Más bajo en móvil
                                    sm: 300, // Tablet pequeño
                                    md: 320, // Desktop
                                    lg: 340, // Desktop grande
                                    xl: 360, // XL
                                },
                                maxWidth: {
                                    xs: 160, // Límite máximo en móvil
                                    sm: 170, // Tablet pequeño
                                    md: 190, // Desktop
                                    lg: 210, // Desktop grande
                                    xl: 230, // XL
                                },
                                flexShrink: 0, // No se encoge
                                flexGrow: 0, // No crece
                                borderRadius: { xs: 3, md: 4 },
                                // Degradado azul formal
                                background: 'linear-gradient(135deg, #a18cd1 10%, #66a6ff 100%)',

                                // Borde azul más oscuro
                                border: '2px solid rgba(0,91,168,0.6)',

                                boxShadow: {
                                    xs: '0 4px 12px rgba(37,117,252,0.15), 0 2px 4px rgba(0,0,0,0.1)',
                                    md: '0 8px 24px rgba(37,117,252,0.2), 0 4px 8px rgba(0,0,0,0.1)',
                                },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: { xs: 1, sm: 1.2, md: 1.5 },
                                overflow: 'visible',
                                '&:hover': {
                                    transform: {
                                        xs: 'translateY(-4px) scale(1.02)',
                                        md: 'translateY(-6px) scale(1.03)',
                                    },
                                    boxShadow: {
                                        xs: '0 12px 32px rgba(37,117,252,0.25), 0 6px 12px rgba(0,0,0,0.15)',
                                        md: '0 16px 48px rgba(37,117,252,0.3), 0 8px 16px rgba(0,0,0,0.2)',
                                    },
                                },
                            }}
                        >
                            {/* Encabezado de la tarjeta */}
                            <Box sx={{ textAlign: 'center', mb: { xs: 1, md: 1.5 }, width: '100%' }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: { xs: 0.5, md: 1 },
                                        color: 'white',
                                        letterSpacing: 1.2,
                                        fontSize: {
                                            xs: '0.85rem',
                                            sm: '0.9rem',
                                            md: '1rem',
                                        },
                                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {formatDay(day)}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 900,
                                        fontSize: {
                                            xs: '1.5rem',
                                            sm: '1.75rem',
                                            md: '2rem',
                                        },
                                        color: 'white',
                                        textShadow: '0 3px 12px rgba(0,0,0,0.4)',
                                    }}
                                >
                                    {count}{' '}
                                    <Box
                                        component="span"
                                        sx={{
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            color: 'rgba(255,255,255,0.9)',
                                        }}
                                    >
                                        {count === 1 ? 'Empresa' : 'Empresas'}
                                    </Box>
                                </Typography>
                            </Box>

                            {/* Lista de empresas - Versión mejorada */}
                            <Box
                                sx={{
                                    width: '100%',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: { xs: 0.5, sm: 0.6, md: 0.7 },
                                    px: { xs: 0.5, sm: 0.7, md: 1 },
                                    overflowY: 'auto',
                                    maxHeight: { xs: 180, sm: 200, md: 220 },
                                    '&::-webkit-scrollbar': {
                                        width: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: theme.palette.primary.dark,
                                        borderRadius: '2px',
                                    },
                                }}
                            >
                                {Array.isArray(influencersByDay?.[day]) && influencersByDay[day].length > 0 ? (
                                    influencersByDay[day].map((item, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                background: 'rgba(255,255,255,0.95)',
                                                borderRadius: 1,
                                                p: { xs: 0.5, sm: 0.6, md: 0.7 },
                                                borderLeft: `3px solid ${theme.palette.secondary.main}`,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    color: theme.palette.primary.main,
                                                    fontSize: {
                                                        xs: '0.65rem',
                                                        sm: '0.7rem',
                                                        md: '0.75rem',
                                                    },
                                                    fontWeight: 600,
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                <Box component="span" sx={{ fontWeight: 'bold' }}>
                                                    {item.influencer.split(' ')[0]}
                                                </Box>
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        color: theme.palette.secondary.main,
                                                        wordBreak: 'break-word',
                                                        whiteSpace: 'normal',
                                                    }}
                                                >
                                                    {item.empresa}
                                                </Box>
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            visibility: 'hidden',
                                            height: { xs: 20, sm: 25, md: 30 },
                                        }}
                                    >
                                        Placeholder
                                    </Typography>
                                )}
                            </Box>

                            {/* Contador de empresas adicionales */}
                            {Array.isArray(influencersByDay?.[day]) && influencersByDay[day].length > 4 && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: '0.6rem',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontStyle: 'italic',
                                        mt: 0.5,
                                        textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    +{influencersByDay[day].length - 4} más
                                </Typography>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ py: 6, mx: { xs: 0, md: 4 } }}>
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
                    <Button
                        component={Link}
                        href="/companies/create"
                        variant="contained"
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                        startIcon={<BusinessIcon />}
                    >
                        Crear nueva Empresa
                    </Button>
                    <TextField
                        placeholder="Buscar por nombre o categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                </Box>
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        overflowX: 'auto',
                        border: '1px solid #e0e0e0',
                        background: theme.palette.background.paper,
                        mx: { xs: 0, md: 2 },
                    }}
                >
                    <Table stickyHeader sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BusinessIcon fontSize="small" /> Nombre de la empresa
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CategoryIcon fontSize="small" /> Categoría
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Estado</Box>
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DateRangeIcon fontSize="small" /> Fecha inicio
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon fontSize="small" /> Fecha fin
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventAvailableIcon fontSize="small" /> Días Disponibles
                                    </Box>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EditIcon fontSize="small" /> / <DeleteIcon fontSize="small" /> Acciones
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedCompanies.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        No se encontraron compañías.
                                    </TableCell>
                                </TableRow>
                            )}
                            {paginatedCompanies.map((company) => (
                                <TableRow key={company.id} hover>
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell>
                                        {company.category?.name || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Sin categoría</span>}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                color: company.estado === 'activo' ? 'green' : 'red',
                                            }}
                                        >
                                            {company.estado}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{company.start_date || '-'}</TableCell>
                                    <TableCell>{company.end_date || '-'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {Array.isArray(company.availability_days) && company.availability_days.length > 0 ? (
                                                company.availability_days.map((d, i) => (
                                                    <Box
                                                        key={i}
                                                        sx={{
                                                            display: 'inline-block',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            bgcolor: d.turno === 'mañana' ? 'blue.100' : 'yellow.100',
                                                            color: d.turno === 'mañana' ? 'blue.800' : 'yellow.800',
                                                            border: '1px solid',
                                                            borderColor: 'grey.200',
                                                        }}
                                                    >
                                                        {formatDay(d.day_of_week)}: {d.start_time} - {d.end_time} ({d.turno})
                                                    </Box>
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                    Sin disponibilidad
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {/* Botón de Editar */}
                                        <Tooltip title="Editar Empresa">
                                            <IconButton color="primary" component={Link} href={`/companies/${company.id}/edit`} aria-label="Editar">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {/* Botón de Eliminar */}
                                        {/* <Tooltip title="Eliminar Empresa">
                                            <IconButton color="error" onClick={() => handleDelete(company)} aria-label="Eliminar">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip> */}

                                        {/* Botón de Activar/Desactivar */}
                                        <Tooltip title={company.estado === 'activo' ? 'Desactivar Empresa' : 'Activar Empresa'}>
                                            <IconButton
                                                color={company.estado === 'activo' ? 'warning' : 'success'}
                                                onClick={() => toggleEstado(company)}
                                                aria-label={company.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                            >
                                                {company.estado === 'activo' ? <BlockIcon /> : <CheckCircleIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={filteredCompanies.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Filas por página"
                    />
                </TableContainer>
            </Box>
            {/* Modal de confirmación */}
            <Dialog open={modalOpen} onClose={cancelDelete} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Confirmar eliminación</Typography>
                    <IconButton onClick={cancelDelete}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar la compañía <b>{selectedCompany?.name}</b>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="inherit" variant="outlined" startIcon={<CloseIcon />}>
                        Cancelar
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained" startIcon={<DeleteIcon />}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default CompaniesIndex;
