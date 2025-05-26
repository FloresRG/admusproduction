
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    useTheme,
    useMediaQuery,
    Snackbar,
    Alert,
    TablePagination,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Business as BusinessIcon,
    Category as CategoryIcon,
    DateRange as DateRangeIcon,
    EventAvailable as EventAvailableIcon,
    CalendarToday as CalendarTodayIcon,
    AccessTime as AccessTimeIcon,
    ListAlt as ListAltIcon,
} from '@mui/icons-material';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';

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
    availabilityDays?: AvailabilityDay[];
    availability_days?: AvailabilityDay[];
};
type Props = {
    companies: Company[];
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

const CompaniesIndex = ({ companies }: Props) => {
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
        () =>
            filteredCompanies.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
            ),
        [filteredCompanies, page, rowsPerPage]
    );

    // Conteo de empresas por día
    const dayCounts = useMemo(() => {
        const counts: Record<string, number> = {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
        };
        companiesList.forEach(company => {
            const days = company.availability_days || [];
            // Usar Set para evitar contar dos veces el mismo día en una empresa
            const uniqueDays = new Set(days.map(d => d.day_of_week));
            uniqueDays.forEach(day => {
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
                setCompaniesList(companiesList.filter(c => c.id !== selectedCompany.id));
            } catch (e) {
                setNotification('Error al eliminar la compañía');
            }
            setModalOpen(false);
            setSelectedCompany(null);
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
            <Head title="Compañías" />
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
            <Grid container spacing={2} sx={{ mb: 3, mx: { xs: 0, md: 4 } }}>
                {Object.entries(dayCounts).map(([day, count]) => (
                    <Grid item xs={12} sm={6} md={2.4} key={day}>
                        <Card sx={{ background: theme.palette.grey[100], borderRadius: 2, boxShadow: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {formatDay(day)}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                    {count}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {count === 1 ? 'empresa' : 'empresas'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ py: 6, mx: { xs: 0, md: 4 } }}>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' }, justifyContent: { md: 'space-between' } }}>
                    <Button
                        component={Link}
                        href="/companies/create"
                        variant="contained"
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                        startIcon={<BusinessIcon />}
                    >
                        Crear nueva compañía
                    </Button>
                    <TextField
                        placeholder="Buscar por nombre o categoría..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
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
                                        <BusinessIcon fontSize="small" /> Nombre
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ListAltIcon fontSize="small" /> Duración del contrato
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
                                    <TableCell>{company.category?.name || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Sin categoría</span>}</TableCell>
                                    <TableCell>{company.contract_duration}</TableCell>
                                    <TableCell>{company.start_date || '-'}</TableCell>
                                    <TableCell>{company.end_date || '-'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {(Array.isArray(company.availability_days) && company.availability_days.length > 0) ? (
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
                                        <IconButton
                                            color="primary"
                                            component={Link}
                                            href={`/companies/${company.id}/edit`}
                                            aria-label="Editar"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(company)}
                                            aria-label="Eliminar"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
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
                        ¿Estás seguro de que deseas eliminar la compañía{' '}
                        <b>{selectedCompany?.name}</b>?
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
