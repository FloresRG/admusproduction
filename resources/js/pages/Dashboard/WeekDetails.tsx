import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import dayjs from 'dayjs';

// Interfaces para los datos de la semana específica (copiadas desde el controlador y DatosInfluencer)
interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface Company {
    id: number;
    name: string;
}

interface SpecificWeekBooking {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
    turno: string;
    day_of_week: string;
    company: Company;
}

interface SpecificWeekDetailsData {
    week: Week;
    bookings: SpecificWeekBooking[];
    unique_days_worked: number;
    companies_in_week: Company[];
}

interface WeekDetailsProps extends PageProps {
    weekData: SpecificWeekDetailsData;
    user: { // Información básica del usuario que la página de detalles puede necesitar
        name: string;
        email: string;
        profile_photo_url?: string;
    };
}

export default function WeekDetails({ weekData, user }: WeekDetailsProps) {
    const breadcrumbs = [
        { label: 'Inicio', href: '/' },
        { label: 'Panel de Control', href: '/dashboard', },
        { label: 'Detalles de Semana', href: route('influencer.week.details', { week: weekData.week.id }) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detalles de Semana: ${weekData.week.name}`} />

            <Box sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                    Detalles de la Semana: {weekData.week.name}
                </Typography>

                <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Periodo:
                            </Typography>
                            <Typography variant="body1">
                                {dayjs(weekData.week.start_date).format('DD MMMM YYYY')} - {dayjs(weekData.week.end_date).format('DD MMMM YYYY')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Días Únicos Trabajados:
                            </Typography>
                            <Chip
                                label={`${weekData.unique_days_worked} día(s)`}
                                color="primary"
                                sx={{ fontSize: '1.1rem', p: 1 }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Empresas Colaboradoras en esta Semana:
                    </Typography>
                    {weekData.companies_in_week.length > 0 ? (
                        <Grid container spacing={1}>
                            {weekData.companies_in_week.map(company => (
                                <Grid item key={company.id}>
                                    <Chip label={company.name} variant="outlined" color="secondary" />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No se registraron colaboraciones con empresas en esta semana.
                        </Typography>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        Tus Reservas Detalladas en esta Semana:
                    </Typography>
                    {weekData.bookings.length > 0 ? (
                        <List>
                            {weekData.bookings.map(booking => (
                                <Paper key={booking.id} elevation={1} sx={{ mb: 2, p: 2 }}>
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" fontWeight="bold">
                                                    {booking.company.name} - {booking.day_of_week}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Horario: {dayjs(booking.start_time).format('HH:mm')} - {dayjs(booking.end_time).format('HH:mm')} ({booking.turno})
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Estado: <Chip label={booking.status} size="small" color={booking.status === 'confirmed' ? 'success' : (booking.status === 'pending' ? 'warning' : 'default')} />
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                </Paper>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No tienes reservas registradas en esta semana.
                        </Typography>
                    )}
                </Paper>
            </Box>
        </AppLayout>
    );
}