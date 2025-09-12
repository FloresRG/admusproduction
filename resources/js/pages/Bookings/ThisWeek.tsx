import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import MapComponent from './MapComponent';

const breadcrumbs = [
    { title: 'Inicio', href: '/' },
    { title: 'Tareas', href: '/bookings' },
];

const dayTranslations: Record<string, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

const turnoColors: Record<string, string> = {
    mañana: 'primary',
    tarde: 'secondary',
    noche: 'info',
};

// Días de la semana ordenados
const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

type Props = {
    bookings: any[];
    user: {
        name: string;
    };
};

export default function BookingsSummary() {
    const { bookings, user } = usePage().props as unknown as Props;

    const summary = bookings.reduce((acc: any, booking) => {
        const company = booking.company.name;
        const day = dayTranslations[booking.day_of_week?.toLowerCase()] || booking.day_of_week;
        const turno = booking.turno?.toLowerCase() || 'Sin turno';

        acc[company] = acc[company] || {};
        acc[company][day] = acc[company][day] || {};
        acc[company][day][turno] = (acc[company][day][turno] || 0) + 1;

        return acc;
    }, {});

    const [openMap, setOpenMap] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);

    const handleOpenMap = (companyName: string) => {
        const foundCompany = bookings.find((b) => b.company.name === companyName)?.company;
        setSelectedCompany(foundCompany);
        setOpenMap(true);
    };

    const handleCloseMap = () => {
        setOpenMap(false);
        setSelectedCompany(null);
    };

    // Función para obtener todas las empresas y turnos para un día específico
    const getCompaniesForDay = (day: string) => {
        const companies = [];

        for (const [companyName, days] of Object.entries(summary)) {
            const dayData = (days as any)[day];
            if (dayData) {
                const company = bookings.find((b) => b.company.name === companyName)?.company;
                companies.push({
                    name: companyName,
                    shifts: dayData,
                    company: company,
                });
            }
        }

        return companies;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Horario Semanal" />
            <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <CalendarTodayIcon color="primary" sx={{ fontSize: 36 }} />
                    <Typography variant="h4" fontWeight="bold">
                        Horario Semanal - <span style={{ color: '#1976d2' }}>{user.name}</span>
                    </Typography>
                </Stack>

                {Object.keys(summary).length === 0 ? (
                    <Box mt={6} textAlign="center">
                        <Avatar sx={{ bgcolor: 'grey.300', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                            <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'grey.600' }} />
                        </Avatar>
                        <Typography variant="h6" color="text.secondary">
                            No hay tareas programadas para esta semana.
                        </Typography>
                    </Box>
                ) : (
                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        {/* Encabezado del calendario */}
                        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
                            <Typography variant="h6" fontWeight="bold" textAlign="center">
                                Calendario Semanal
                            </Typography>
                        </Box>

                        {/* Contenedor del calendario */}
                        <Box sx={{ p: { xs: 1, md: 2 }, background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)', borderRadius: 3 }}>
                            <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                                {weekDays.map((day) => {
                                    const companiesForDay = getCompaniesForDay(day);

                                    return (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            lg={2}
                                            key={day}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'stretch',
                                            }}
                                        >
                                            <Card
                                                elevation={4}
                                                sx={{
                                                    width: '100%',
                                                    minWidth: 170,
                                                    maxWidth: 220,
                                                    height: 295,
                                                    borderRadius: 4,
                                                    border: companiesForDay.length > 0 ? '2.5px solid #1976d2' : '1.5px solid #e0e0e0',
                                                    boxShadow:
                                                        companiesForDay.length > 0
                                                            ? '0 6px 24px 0 rgba(25, 118, 210, 0.10)'
                                                            : '0 2px 8px 0 rgba(0,0,0,0.04)',
                                                    background:
                                                        companiesForDay.length > 0
                                                            ? 'linear-gradient(135deg, #e3f0ff 0%, #f8fafc 100%)'
                                                            : 'linear-gradient(135deg, #f3f4f6 0%, #f8fafc 100%)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    transition: 'transform 0.18s, box-shadow 0.18s',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px) scale(1.03)',
                                                        boxShadow: '0 10px 32px 0 rgba(25, 118, 210, 0.18)',
                                                    },
                                                }}
                                            >
                                                {/* Encabezado del día */}
                                                <Box
                                                    sx={{
                                                        bgcolor: companiesForDay.length > 0 ? 'primary.main' : 'grey.200',
                                                        color: companiesForDay.length > 0 ? 'white' : 'text.secondary',
                                                        p: 1.5,
                                                        textAlign: 'center',
                                                        borderTopLeftRadius: 16,
                                                        borderTopRightRadius: 16,
                                                        boxShadow: companiesForDay.length > 0 ? '0 2px 8px 0 rgba(25, 118, 210, 0.10)' : undefined,
                                                        fontSize: '1.1rem',
                                                        letterSpacing: 1,
                                                    }}
                                                >
                                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                                                        {day}
                                                    </Typography>
                                                </Box>

                                                {/* Contenido del día */}
                                                <CardContent
                                                    sx={{
                                                        p: 1.5,
                                                        flexGrow: 1,
                                                        overflowY: 'auto',
                                                        textAlign: 'center',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: companiesForDay.length === 0 ? 'center' : 'flex-start',
                                                        alignItems: 'center',
                                                        background: 'rgba(255,255,255,0.85)',
                                                        borderBottomLeftRadius: 16,
                                                        borderBottomRightRadius: 16,
                                                    }}
                                                >
                                                    {companiesForDay.length === 0 ? (
                                                        <Box sx={{ textAlign: 'center', py: 3 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Sin empresas
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Stack spacing={1.2} sx={{ width: '100%' }}>
                                                            {companiesForDay.map((item, index) => (
                                                                <Card
                                                                    key={index}
                                                                    elevation={0}
                                                                    sx={{
                                                                        borderRadius: 2,
                                                                        border: '1.5px solid #e3e6f0',
                                                                        background: 'linear-gradient(90deg, #f0f7ff 0%, #f8fafc 100%)',
                                                                        '&:hover': { boxShadow: 2, borderColor: '#1976d2' },
                                                                        width: '100%',
                                                                        mb: 0.5,
                                                                    }}
                                                                >
                                                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                                                        {/* Logo y nombre de la empresa */}
                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            alignItems="center"
                                                                            mb={1}
                                                                            justifyContent="center"
                                                                        >
                                                                            {item.company?.logo ? (
                                                                                <Avatar
                                                                                    src={`/${item.company.logo}`}
                                                                                    variant="rounded"
                                                                                    sx={{ width: 24, height: 24, boxShadow: '0 2px 8px #1976d220' }}
                                                                                />
                                                                            ) : (
                                                                                <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
                                                                                    <BusinessIcon sx={{ fontSize: 14 }} />
                                                                                </Avatar>
                                                                            )}
                                                                            <Typography
                                                                                variant="caption"
                                                                                fontWeight="bold"
                                                                                noWrap
                                                                                sx={{
                                                                                    color: '#1976d2',
                                                                                    fontSize: '0.92rem',
                                                                                    letterSpacing: 0.5,
                                                                                }}
                                                                            >
                                                                                {item.name}
                                                                            </Typography>
                                                                        </Stack>

                                                                        {/* Turnos */}
                                                                        <Stack
                                                                            spacing={0.5}
                                                                            mb={1}
                                                                            justifyContent="center"
                                                                            direction="row"
                                                                            flexWrap="wrap"
                                                                        >
                                                                            {Object.entries(item.shifts).map(([turno, count]: any) => {
                                                                                // Busca el booking para ese turno y empresa
                                                                                const booking = bookings.find(
                                                                                    (b) =>
                                                                                        b.company.name === item.name &&
                                                                                        (dayTranslations[b.day_of_week?.toLowerCase()] ||
                                                                                            b.day_of_week) === day &&
                                                                                        b.turno?.toLowerCase() === turno,
                                                                                );
                                                                                return (
                                                                                    <Box key={turno} sx={{ width: '100%' }}>
                                                                                        <Tooltip
                                                                                            title={`Turno ${turno}: ${count} tarea(s)`}
                                                                                            arrow
                                                                                            placement="top"
                                                                                        >
                                                                                            <Chip
                                                                                                icon={<AccessTimeIcon sx={{ fontSize: 13 }} />}
                                                                                                label={`${turno.charAt(0).toUpperCase() + turno.slice(1)}`}
                                                                                                color={turnoColors[turno] || 'default'}
                                                                                                size="small"
                                                                                                sx={{
                                                                                                    fontWeight: 'bold',
                                                                                                    fontSize: '0.70rem',
                                                                                                    height: 22,
                                                                                                    bgcolor:
                                                                                                        turnoColors[turno] === 'primary'
                                                                                                            ? '#e3f0ff'
                                                                                                            : turnoColors[turno] === 'secondary'
                                                                                                              ? '#fbe9ff'
                                                                                                              : '#e0f7fa',
                                                                                                    color: '#1976d2',
                                                                                                    borderRadius: 2,
                                                                                                    mx: 0.2,
                                                                                                    my: 0.2,
                                                                                                }}
                                                                                            />
                                                                                        </Tooltip>
                                                                                        {/* Mostrar horario debajo del turno */}
                                                                                        {booking && (
                                                                                            <Typography
                                                                                                variant="caption"
                                                                                                color="text.secondary"
                                                                                                sx={{ display: 'block', mt: 0.5 }}
                                                                                            >
                                                                                                {`Inicio: ${booking.start_time?.slice(11, 16) || '--:--'} | Fin: ${booking.end_time?.slice(11, 16) || '--:--'}`}
                                                                                            </Typography>
                                                                                        )}
                                                                                    </Box>
                                                                                );
                                                                            })}
                                                                        </Stack>

                                                                        {/* Botón de ubicación */}
                                                                        <Button
                                                                            variant="contained"
                                                                            size="small"
                                                                            fullWidth
                                                                            sx={{
                                                                                fontSize: '0.70rem',
                                                                                py: 0.5,
                                                                                minHeight: 24,
                                                                                borderRadius: 2,
                                                                                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                                                                                color: '#fff',
                                                                                fontWeight: 700,
                                                                                boxShadow: '0 2px 8px #1976d220',
                                                                                mt: 0.5,
                                                                                '&:hover': {
                                                                                    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                                                                                },
                                                                            }}
                                                                            startIcon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                                                                            onClick={() => handleOpenMap(item.name)}
                                                                        >
                                                                            Ubicación
                                                                        </Button>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </Stack>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    </Paper>
                )}

                <Dialog open={openMap} onClose={handleCloseMap} maxWidth="md" fullWidth>
                    <DialogTitle>Ubicación de la empresa</DialogTitle>
                    <DialogContent>
                        {selectedCompany ? (
                            <MapComponent company={selectedCompany} />
                        ) : (
                            <Typography>No se encontró la empresa seleccionada.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMap} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AppLayout>
    );
}
