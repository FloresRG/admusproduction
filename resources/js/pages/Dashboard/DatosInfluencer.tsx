import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Paper, Grid, Button, IconButton, useTheme, List, ListItem, ListItemText } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarMonth, BarChart, Business, AccessTime, PlaylistAddCheck,
    HourglassEmpty, EventNote, TrendingUp, PhotoCamera, Block, WavingHand,
    ArrowDownward, Visibility // Icono de visibilidad para navegar a detalles
} from '@mui/icons-material';
import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { router } from '@inertiajs/react'; // Importamos router para la navegación

// Definición de interfaces (mantienen las mismas)
interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface DaysWorkedData {
    week_id: number;
    week_name: string;
    total_days_worked: number;
}

interface Company {
    id: number;
    name: string;
}

interface Availability {
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
}

interface NextBooking {
    company_name: string;
    start_time: string;
    day_of_week: string;
}

interface DashboardProps extends PageProps {
    user: {
        id: number;
        name: string;
        email: string;
        profile_photo_path: string | null;
    };
    workingWeeks: Week[];
    daysWorkedByWeek: DaysWorkedData[];
    workedCompanies: Company[];
    availabilities: Availability[];
    totalBookings: number;
    bookingStatusCounts: { [key: string]: number };
    totalAvailabilityHours: number;
    nextBooking: NextBooking | null;
    lastWorkedCompany: string;
    averageDaysPerWeek: number;
    totalPhotos: number;
    daysWithoutAvailability: string[];
}

// Variantes para la animación de la bienvenida
const welcomeVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeIn" } },
};

// Variantes para las cards
const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 0.1 + 0.5,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

export default function DatosInfluencer({
    auth,
    workingWeeks,
    daysWorkedByWeek,
    workedCompanies,
    availabilities,
    totalBookings,
    bookingStatusCounts,
    totalAvailabilityHours,
    nextBooking,
    }: DashboardProps) {
    const theme = useTheme();
    const [showWelcome, setShowWelcome] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 3000);

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setShowWelcome(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToContent = () => {
        if (contentRef.current) {
            setShowWelcome(false);
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Función para navegar a la nueva página de detalles de la semana
    const navigateToWeekDetails = (weekId: number) => {
        router.visit(route('influencer.week.details', { week: weekId }));
    };

    const breadcrumbs = [
        { label: 'Inicio', href: '/' },
        { label: 'Panel de Control', href: '/dashboard' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Control" />

            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        key="welcome-section"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={welcomeVariants}
                        style={{
                            minHeight: 'calc(100vh - 64px)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: theme.spacing(4),
                            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                            color: theme.palette.common.white,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.1)', filter: 'blur(50px)', zIndex: 0 }}
                        />
                        <Box sx={{ zIndex: 1 }}>
                            <motion.div
                                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <WavingHand sx={{ fontSize: 120, mb: 2 }} />
                            </motion.div>
                            <Typography variant="h3" component="h1" gutterBottom>
                                ¡Hola, {auth.user.name}!
                            </Typography>
                            <Typography variant="h5" component="p" sx={{ mb: 4 }}>
                                Bienvenido a tu centro de gestión de influencer.
                            </Typography>
                            <Typography variant="h6" component="p" sx={{ mb: 6 }}>
                                Aquí tienes un resumen rápido de tu actividad.
                            </Typography>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5, duration: 0.8 }}
                            >
                                <IconButton
                                    color="inherit"
                                    onClick={scrollToContent}
                                    sx={{
                                        border: `2px solid ${theme.palette.common.white}`,
                                        p: 1,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                >
                                    <ArrowDownward sx={{ fontSize: 32 }} />
                                </IconButton>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Desplázate para ver tus datos
                                </Typography>
                            </motion.div>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            <Box ref={contentRef} sx={{ p: 4, pt: showWelcome ? 0 : 4, opacity: showWelcome ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
                <Grid container spacing={4}>
                    {/* Card 1: Semanas Trabajando - Ahora con botón para navegar */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={0} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <CalendarMonth color="primary" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Semanas en Curso
                                </Typography>
                                {workingWeeks.length > 0 ? (
                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', textAlign: 'center' }}>
                                        {workingWeeks.slice(0, 3).map(week => (
                                            <ListItem
                                                key={week.id}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="details" onClick={() => navigateToWeekDetails(week.id)}>
                                                        <Visibility />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={week.name}
                                                    secondary={`${dayjs(week.start_date).format('DD MMM')} - ${dayjs(week.end_date).format('DD MMM')}`}
                                                    primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
                                                    secondaryTypographyProps={{ style: { fontSize: '0.8rem' } }}
                                                />
                                            </ListItem>
                                        ))}
                                        {workingWeeks.length > 3 && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                ...y {workingWeeks.length - 3} más.
                                            </Typography>
                                        )}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No tienes semanas asignadas actualmente.
                                    </Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* Resto de las Cards (2-12) - Mismo código que antes */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={1} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <BarChart color="secondary" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Días Trabajados por Semana
                                </Typography>
                                {daysWorkedByWeek.length > 0 ? (
                                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
                                        {daysWorkedByWeek.map((data, index) => (
                                            <li key={index}>
                                                <Typography variant="body2">
                                                    <strong>{data.week_name}</strong>: {data.total_days_worked} día(s)
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No hay registros de días trabajados por semana.
                                    </Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={2} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <Business color="error" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Empresas Colaboradoras
                                </Typography>
                                {workedCompanies.length > 0 ? (
                                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
                                        {workedCompanies.map(company => (
                                            <li key={company.id}>
                                                <Typography variant="body2">{company.name}</Typography>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Aún no has colaborado con ninguna empresa.
                                    </Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={3} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <AccessTime color="warning" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Tu Disponibilidad
                                </Typography>
                                {availabilities.length > 0 ? (
                                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
                                        {availabilities.slice(0, 3).map(availability => (
                                            <li key={availability.id}>
                                                <Typography variant="body2">
                                                    <strong>{availability.day_of_week}</strong>: {availability.start_time} - {availability.end_time}
                                                </Typography>
                                            </li>
                                        ))}
                                        {availabilities.length > 3 && (
                                            <Typography variant="body2" color="text.secondary">
                                                ...y {availabilities.length - 3} más
                                            </Typography>
                                        )}
                                    </ul>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No has registrado tu disponibilidad.
                                    </Typography>
                                )}
                                <Button variant="contained" size="small" sx={{ mt: 2 }}>
                                    Gestionar
                                </Button>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={4} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <PlaylistAddCheck color="info" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Total de Reservas
                                </Typography>
                                <Typography variant="h4" component="p" color="text.primary" align="center">
                                    {totalBookings}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Reservas en total.
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={5} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <HourglassEmpty color="action" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Reservas por Estado
                                </Typography>
                                {Object.keys(bookingStatusCounts).length > 0 ? (
                                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
                                        {Object.entries(bookingStatusCounts).map(([status, count]) => (
                                            <li key={status}>
                                                <Typography variant="body2">
                                                    <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>: {count}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No hay reservas registradas.
                                    </Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={6} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <AccessTime color="success" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Horas Disponibles
                                </Typography>
                                <Typography variant="h4" component="p" color="text.primary" align="center">
                                    {totalAvailabilityHours}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Horas marcadas como disponibles.
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={7} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <EventNote color="primary" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Próxima Reserva
                                </Typography>
                                {nextBooking ? (
                                    <>
                                        <Typography variant="body1" align="center" fontWeight="bold">
                                            {nextBooking.company_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            {nextBooking.day_of_week} | {nextBooking.start_time}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No tienes próximas reservas.
                                    </Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>

                    {/* El resto de las cards van aquí igual que antes */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={8} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <Business color="info" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Última Empresa
                                </Typography>
                                <Typography variant="h5" component="p" color="text.primary" align="center">
                                    {/* Suponiendo que 'lastWorkedCompany' está en las props del DashboardProps */}
                                    {(props as DashboardProps).lastWorkedCompany}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Con la que colaboraste recientemente.
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={9} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <TrendingUp color="secondary" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Promedio Días/Semana
                                </Typography>
                                <Typography variant="h4" component="p" color="text.primary" align="center">
                                    {(props as DashboardProps).averageDaysPerWeek}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Días de trabajo por semana.
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={10} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <PhotoCamera color="action" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Tus Fotos
                                </Typography>
                                <Typography variant="h4" component="p" color="text.primary" align="center">
                                    {(props as DashboardProps).totalPhotos}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Fotos subidas a tu perfil.
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div initial="hidden" animate="visible" custom={11} variants={cardVariants}>
                            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 200, justifyContent: 'center' }}>
                                <Block color="error" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" component="h3" gutterBottom align="center">
                                    Días Sin Disponibilidad
                                </Typography>
                                {(props as DashboardProps).daysWithoutAvailability.length > 0 ? (
                                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center' }}>
                                        {(props as DashboardProps).daysWithoutAvailability.map((day, index) => (
                                            <li key={index}>
                                                <Typography variant="body2">
                                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        ¡Has registrado disponibilidad para todos los días!
                                    </Typography>
                                )}
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Box>
        </AppLayout>
    );
}