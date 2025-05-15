import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TablePagination,
    Button,
    IconButton,
    Stack,
    Card,
    CardContent,
    CardHeader,
    useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StatusIcon from '@mui/icons-material/CheckCircleOutline';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'weeks', href: '/weeks' },
    { title: 'bookings', href: '#' },
];

interface Booking {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
    turno: string;
    user: { name: string };
    company: { name: string };
}

interface PageProps {
    week: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
    };
    bookings: Booking[];
    [key: string]: unknown;
}

export default function BookingsByWeek() {
    const theme = useTheme();
    const { week, bookings } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    // Filtro de búsqueda
    const filteredBookings = bookings.filter((booking) =>
        booking.user.name.toLowerCase().includes(search.toLowerCase()) ||
        booking.company.name.toLowerCase().includes(search.toLowerCase()) ||
        booking.turno.toLowerCase().includes(search.toLowerCase()) ||
        booking.status.toLowerCase().includes(search.toLowerCase())
    );

    // Manejo de selección de checkboxes
    const handleSelectBooking = (id: number) => {
        setSelectedBookings((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((bookingId) => bookingId !== id)
                : [...prevSelected, id]
        );
        const booking = bookings.find((booking) => booking.id === id);
        setSelectedBooking(booking || null); // Actualiza los detalles del booking seleccionado
    };

    // Paginación
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Estadísticas generales de los bookings
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter((booking) => booking.status === 'Active').length;
    const completedBookings = bookings.filter((booking) => booking.status === 'Completed').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Bookings de ${week.name}`} />
            <Box sx={{ maxWidth: '100%', p: 2 }}>
                <Grid container spacing={3}>
                    {/* Izquierda: Tarjetas estadísticas sobre la semana */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Semana:  Del {week.start_date} al {week.end_date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Del {week.name} 
                        </Typography>

                        <Grid container spacing={2}>
                            {/* Tarjeta de Total de Bookings */}
                            <Grid item xs={12} sm={4}>
                                <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CardHeader
                                        avatar={<PeopleIcon color="primary" />}
                                        title="Total Bookings"
                                        sx={{ backgroundColor: theme.palette.grey[100], textAlign: 'center' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{totalBookings}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Tarjeta de Bookings Activos */}
                            <Grid item xs={12} sm={4}>
                                <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CardHeader
                                        avatar={<StatusIcon color="success" />}
                                        title="Activos"
                                        sx={{ backgroundColor: theme.palette.grey[100], textAlign: 'center' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{activeBookings}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Tarjeta de Bookings Completados */}
                            <Grid item xs={12} sm={4}>
                                <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CardHeader
                                        avatar={<AccessTimeIcon color="secondary" />}
                                        title="Completados"
                                        sx={{ backgroundColor: theme.palette.grey[100], textAlign: 'center' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{completedBookings}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Derecha: Tabla de Bookings */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar Booking..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {/* Tabla de Bookings */}
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>Usuario</TableCell>
                                        <TableCell>Empresa</TableCell>
                                        <TableCell>Turno</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Inicio</TableCell>
                                        <TableCell>Fin</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredBookings
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((booking) => (
                                            <TableRow
                                                key={booking.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedBookings.includes(booking.id)}
                                                        onChange={() => handleSelectBooking(booking.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{booking.user.name}</TableCell>
                                                <TableCell>{booking.company.name}</TableCell>
                                                <TableCell>{booking.turno}</TableCell>
                                                <TableCell>{booking.status}</TableCell>
                                                <TableCell>{booking.start_time}</TableCell>
                                                <TableCell>{booking.end_time}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Paginación */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredBookings.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>

                {/* Derecha: Detalles del Booking seleccionado */}
                {selectedBooking && (
                    <Grid container spacing={2} sx={{ mt: 4 }}>
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardHeader
                                    title="Detalles del Booking"
                                    sx={{ backgroundColor: theme.palette.grey[100] }}
                                />
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold">
                                        Usuario: {selectedBooking.user.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        Empresa: {selectedBooking.company.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        Turno: {selectedBooking.turno}
                                    </Typography>
                                    <Typography variant="body1">
                                        Estado: {selectedBooking.status}
                                    </Typography>
                                    <Typography variant="body1">
                                        Inicio: {selectedBooking.start_time}
                                    </Typography>
                                    <Typography variant="body1">
                                        Fin: {selectedBooking.end_time}
                                    </Typography>
                                </CardContent>
                                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2 }}>
                                    <IconButton color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </AppLayout>
    );
}
