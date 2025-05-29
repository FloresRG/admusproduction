import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { AccessTime, CheckCircleOutline, Delete, People } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'weeks', href: '/weeks' },
    { title: 'bookings', href: '' },
];

interface Booking {
    id: number;
    user: { id: number; name: string };
    company: { id: number; name: string };
    day_of_week: string;
    turno: string;
    status: string;
    start_time: string;
    end_time: string;
}

interface Company {
    id: number;
    name: string;
    availabilityDays: { day_of_week: string; turno: string }[];
}

interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface Props {
    week: Week;
    bookings: Booking[];
    companies: Company[];
}

export default function BookingsByWeek() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { week, bookings, companies } = usePage<Props>().props;

    // Estado para el diálogo de Creación
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<{
        userId: number | null;
        companyId: number | '';
        dayOfWeek: string;
        turno: string;
    }>({ userId: null, companyId: '', dayOfWeek: '', turno: '' });

    // Usuarios únicos
    const usuarios = useMemo(() => {
        const map = new Map<number, { id: number; name: string }>();
        bookings.forEach((b) => map.set(b.user.id, b.user));
        return Array.from(map.values());
    }, [bookings]);

    // Usuario seleccionado
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    // Filtrar bookings para el usuario seleccionado
    const userBookings = useMemo(() => {
        return selectedUser ? bookings.filter((b) => b.user.id === selectedUser) : [];
    }, [selectedUser, bookings]);

    // Opciones de día y turno según compañía seleccionada
    const selectedCompany = companies.find((c) => c.id === Number(form.companyId));
    const dayOptions = selectedCompany ? [...new Set(selectedCompany.availabilityDays.map((d) => d.day_of_week))] : [];
    const turnoOptions =
        selectedCompany && form.dayOfWeek
            ? [...new Set(selectedCompany.availabilityDays.filter((d) => d.day_of_week === form.dayOfWeek).map((d) => d.turno))]
            : [];

    // Abrir diálogo (guardamos userId)
    function openDialog(uId: number) {
        setForm({ userId: uId, companyId: '', dayOfWeek: '', turno: '' });
        setOpen(true);
    }
    function closeDialog() {
        setOpen(false);
    }

    // Crear reserva
    function createBooking() {
        if (!(form.userId && form.companyId && form.dayOfWeek && form.turno)) return;
        Inertia.post(
            `/weeks/${week.id}/bookings`,
            {
                user_id: form.userId,
                company_id: form.companyId,
                day_of_week: form.dayOfWeek,
                turno: form.turno,
            },
            {
                onSuccess: () => {
                    closeDialog();
                    Inertia.reload({ only: ['bookings'] });
                },
            },
        );
    }

    // Eliminar reserva
    function deleteBooking(id: number) {
        if (!confirm('¿Eliminar esta reserva?')) return;
        Inertia.delete(`/weeks/${week.id}/bookings/${id}`, { onSuccess: () => Inertia.reload({ only: ['bookings'] }) });
    }

    // Estadísticas
    const total = bookings.length;
    const activos = bookings.filter((b) => b.status === 'Active').length;
    const completos = bookings.filter((b) => b.status === 'Completed').length;

    // src/Pages/BookingsByWeek.tsx (o donde esté tu componente)
    const DAY_TRANSLATIONS: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Bookings — ${week.name}`} />

            <Box p={3} maxWidth={1200} mx="auto">
                {/* Título */}
                <Typography variant="h4" color="primary" gutterBottom>
                    Semanas — {week.start_date} al {week.end_date}
                </Typography>

                {/* Cards de estadística */}
                <Grid container spacing={2} mb={4}>
                    <Grid item xs>
                        <Card>
                            <CardHeader avatar={<People />} title="Total" />
                            <CardContent>
                                <Typography>{total}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card>
                            <CardHeader avatar={<CheckCircleOutline />} title="Activos" />
                            <CardContent>
                                <Typography>{activos}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs>
                        <Card>
                            <CardHeader avatar={<AccessTime />} title="Completados" />
                            <CardContent>
                                <Typography>{completos}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabla de Usuarios */}
                <Typography variant="h6">Numero de Influencer ({usuarios.length})</Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 4 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Nombre</TableCell>
                                <TableCell>Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.map((u) => (
                                <TableRow
                                    key={u.id}
                                    hover
                                    selected={u.id === selectedUser}
                                    onClick={() => setSelectedUser((s) => (s === u.id ? null : u.id))}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={u.id === selectedUser} />
                                    </TableCell>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="text"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDialog(u.id);
                                            }}
                                        >
                                            Agregar Empresa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Tabla de Bookings del usuario */}
                {selectedUser && (
                    <>
                        <Typography variant="h6">Semana de {usuarios.find((u) => u.id === selectedUser)?.name}</Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Día</TableCell>
                                        <TableCell>Empresa</TableCell>
                                        <TableCell>Turno</TableCell>
                                        <TableCell>Estado</TableCell>

                                        <TableCell>Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userBookings.map((b) => (
                                        <TableRow key={b.id} hover>
                                            <TableCell>{DAY_TRANSLATIONS[b.day_of_week] ?? b.day_of_week}</TableCell>
                                            <TableCell>{b.company.name}</TableCell>
                                            <TableCell>{b.turno}</TableCell>
                                            <TableCell>{b.status}</TableCell>

                                            <TableCell>
                                                <IconButton onClick={() => deleteBooking(b.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}

                {/* Diálogo para crear */}
                <Dialog
                    open={open}
                    onClose={closeDialog}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            borderRadius: 3,
                            boxShadow: 6,
                        },
                    }}
                >
                    {/* Encabezado con fondo azul suave */}
                    <DialogTitle
                        sx={{
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                            px: 3,
                            py: 2,
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            Nueva reserva
                        </Typography>
                    </DialogTitle>

                    <DialogContent
                        dividers
                        sx={{
                            px: 3,
                            py: 2,
                            bgcolor: 'grey.50',
                        }}
                    >
                        {/* Empresa */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="label-empresa">Empresa</InputLabel>
                            <Select
                                labelId="label-empresa"
                                value={form.companyId}
                                label="Empresa"
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        companyId: Number(e.target.value),
                                        dayOfWeek: '',
                                        turno: '',
                                    }))
                                }
                            >
                                {companies.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Día y Turno en dos columnas */}
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="dense" disabled={!form.companyId}>
                                    <InputLabel id="label-dia">Día</InputLabel>
                                    <Select
                                        labelId="label-dia"
                                        value={form.dayOfWeek}
                                        label="Día"
                                        onChange={(e) =>
                                            setForm((f) => ({
                                                ...f,
                                                dayOfWeek: e.target.value,
                                                turno: '',
                                            }))
                                        }
                                    >
                                        {dayOptions.map((d) => (
                                            <MenuItem key={d} value={d}>
                                                {DAY_TRANSLATIONS[d] ?? d}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth margin="dense" disabled={!form.dayOfWeek}>
                                    <InputLabel id="label-turno">Turno</InputLabel>
                                    <Select
                                        labelId="label-turno"
                                        value={form.turno}
                                        label="Turno"
                                        onChange={(e) => setForm((f) => ({ ...f, turno: e.target.value }))}
                                    >
                                        {turnoOptions.map((t) => (
                                            <MenuItem key={t} value={t}>
                                                {t}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    {/* Acciones con botones estilizados */}
                    <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={closeDialog}
                            sx={{
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': { backgroundColor: 'primary.light' },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={createBooking}
                            disabled={!(form.userId && form.companyId && form.dayOfWeek && form.turno)}
                            sx={{
                                ml: 2,
                                backgroundColor: 'primary.main',
                                '&:hover': { backgroundColor: 'primary.dark' },
                            }}
                        >
                            Crear
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AppLayout>
    );
}
