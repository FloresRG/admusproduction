import AppLayout from '@/layouts/app-layout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { Alert, Box, Button, Card, CardContent, Chip, Fade, Grid, Snackbar, Stack, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useEffect, useState } from 'react';

const breadcrumbs = [
    {
        title: 'Agregar Empresas',
        href: '/influencer-availability',
    },
];

interface InfluencerAvailability {
    id: number;
    user_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
}
const dayOfWeekInSpanish: { [key: string]: string } = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
};

const InfluencerAvailabilityCrud = () => {
    const theme = useTheme();
    const [availabilities, setAvailabilities] = useState<InfluencerAvailability[]>([]);
    const [calendarDates, setCalendarDates] = useState<Date[]>([]);
    const [turnoSelection, setTurnoSelection] = useState<{ [key: string]: string }>({});
    const [userId, setUserId] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        setCalendarDates(getCurrentWeekDates());
        fetchAvailabilities();
        fetchUserId();
    }, []);

    const fetchUserId = () => {
        axios.get('/api/auth/user').then((response) => setUserId(response.data.id));
        /* .catch(() => setSnackbar({ open: true, message: 'Error obteniendo usuario', severity: 'error' })); */
    };

    const getCurrentWeekDates = () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = endOfWeek(new Date(), { weekStartsOn: 1 });
        const weekDays: Date[] = [];
        for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
            const currentDay = new Date(day);
            const dayOfWeek = currentDay.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 6) {
                weekDays.push(currentDay);
            }
        }
        return weekDays;
    };

    const fetchAvailabilities = () => {
        axios
            .get('/api/influencer-availability')
            .then((response) => {
                setAvailabilities(response.data);
                const initialTurnoSelection: { [key: string]: string } = {};
                response.data.forEach((avail: InfluencerAvailability) => {
                    initialTurnoSelection[avail.day_of_week] = avail.turno;
                });
                setTurnoSelection(initialTurnoSelection);
            })
            .catch(() => setSnackbar({ open: true, message: 'Error obteniendo disponibilidad', severity: 'error' }));
    };

    const handleTurnoSelection = (day: string, turno: string) => {
        const previousTurno = turnoSelection[day];
        if (previousTurno === turno) {
            deleteAvailability(day, previousTurno);
            return;
        }
        setTurnoSelection((prev) => ({ ...prev, [day]: turno }));
        const start_time = turno === 'mañana' ? '09:30' : '14:00';
        const end_time = turno === 'mañana' ? '13:00' : '18:00';
        const existingAvailability = availabilities.find((avail) => avail.day_of_week === day && avail.turno === previousTurno);
        if (existingAvailability) deleteAvailability(day, previousTurno);
        const existingAvailabilityNewTurno = availabilities.find((avail) => avail.day_of_week === day && avail.turno === turno);
        if (existingAvailabilityNewTurno) {
            updateAvailability(existingAvailabilityNewTurno.id, start_time, end_time);
        } else {
            createAvailability(day, turno, start_time, end_time);
        }
    };

    const createAvailability = (day: string, turno: string, start_time: string, end_time: string) => {
        axios
            .post('/api/influencer-availability', {
                user_id: userId,
                day_of_week: day,
                turno,
                start_time,
                end_time,
            })
            .then(() => {
                setSnackbar({ open: true, message: 'Disponibilidad guardada', severity: 'success' });
                fetchAvailabilities();
            })
            .catch(() => setSnackbar({ open: true, message: 'Error guardando disponibilidad', severity: 'error' }));
    };

    const updateAvailability = (id: number, start_time: string, end_time: string) => {
        axios
            .put(`/api/influencer-availability/${id}`, { start_time, end_time })
            .then(() => {
                setSnackbar({ open: true, message: 'Disponibilidad actualizada', severity: 'success' });
                fetchAvailabilities();
            })
            .catch(() => setSnackbar({ open: true, message: 'Error actualizando disponibilidad', severity: 'error' }));
    };

    const deleteAvailability = (day: string, turno: string) => {
        const existingAvailability = availabilities.find((avail) => avail.day_of_week === day && avail.turno === turno);
        if (existingAvailability) {
            axios
                .delete(`/api/influencer-availability/${existingAvailability.id}`)
                .then(() => {
                    setSnackbar({ open: true, message: 'Disponibilidad eliminada', severity: 'success' });
                    fetchAvailabilities();
                })
                .catch(() => setSnackbar({ open: true, message: 'Error eliminando disponibilidad', severity: 'error' }));
        }
    };

    const isTurnoSelected = (day: string, turno: string) => turnoSelection[day] === turno;

    const handleAsignarEmpresa = async () => {
        try {
            const response = await axios.post(`/api/asignar-empresa`);
            const { empresa_nombre } = response.data;
            setSnackbar({ open: true, message: `Empresas asignadas: ${empresa_nombre}`, severity: 'success' });
            window.open('/api/reporte-empresas-asignadas', '_blank');
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Error desconocido al asignar empresa.',
                severity: 'error',
            });
        }
    };
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Box
                sx={{
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 60%, ${theme.palette.grey[100]})`,
                    boxShadow: 6,
                    p: { xs: 2, md: 4 },
                    mb: 4,
                }}
            >
                <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                    Mi Dias Disponibles
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                    Agrega los días y turnos disponibles para la semana actual
                </Typography>

                <Grid container spacing={3}>
                    {calendarDates
                        .filter((date) => {
                            const dayNum = date.getDay();
                            return dayNum >= 1 && dayNum <= 6;
                        })
                        .map((date, index) => {
                            const dayOfWeek = format(date, 'EEEE').toLowerCase();
                            const dayInSpanish = dayOfWeekInSpanish[dayOfWeek];
                            return (
                                <Grid item xs={12} sm={6} md={2.4} key={index}>
                                    <Fade in timeout={600 + index * 100}>
                                        <Card
                                            elevation={isTurnoSelected(dayOfWeek, 'mañana') || isTurnoSelected(dayOfWeek, 'tarde') ? 8 : 2}
                                            sx={{
                                                borderRadius: 3,
                                                border:
                                                    isTurnoSelected(dayOfWeek, 'mañana') || isTurnoSelected(dayOfWeek, 'tarde')
                                                        ? `2px solid ${theme.palette.primary.main}`
                                                        : `1px solid ${theme.palette.grey[200]}`,
                                                background: isTurnoSelected(dayOfWeek, 'mañana')
                                                    ? 'linear-gradient(135deg, #e3fcec 60%, #b2f2e5)'
                                                    : isTurnoSelected(dayOfWeek, 'tarde')
                                                      ? 'linear-gradient(135deg, #fff3e0 60%, #ffe0b2)'
                                                      : theme.palette.background.paper,
                                                transition: 'all 0.3s',
                                            }}
                                        >
                                            <CardContent>
                                                <Stack alignItems="center" spacing={2}>
                                                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                                                        {dayInSpanish}
                                                    </Typography>
                                                    <Stack direction="row" spacing={2} width="100%">
                                                        <Button
                                                            fullWidth
                                                            variant={isTurnoSelected(dayOfWeek, 'mañana') ? 'contained' : 'outlined'}
                                                            color="success"
                                                            startIcon={<WbSunnyIcon />}
                                                            sx={{
                                                                fontWeight: 600,
                                                                boxShadow: isTurnoSelected(dayOfWeek, 'mañana') ? 3 : 0,
                                                                background: isTurnoSelected(dayOfWeek, 'mañana')
                                                                    ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
                                                                    : undefined,
                                                                color: isTurnoSelected(dayOfWeek, 'mañana') ? '#fff' : undefined,
                                                                borderColor: isTurnoSelected(dayOfWeek, 'mañana')
                                                                    ? theme.palette.success.main
                                                                    : undefined,
                                                                transition: 'all 0.2s',
                                                            }}
                                                            onClick={() => handleTurnoSelection(dayOfWeek, 'mañana')}
                                                        >
                                                            Mañana
                                                        </Button>
                                                        <Button
                                                            fullWidth
                                                            variant={isTurnoSelected(dayOfWeek, 'tarde') ? 'contained' : 'outlined'}
                                                            color="warning"
                                                            startIcon={<Brightness2Icon />}
                                                            sx={{
                                                                fontWeight: 600,
                                                                boxShadow: isTurnoSelected(dayOfWeek, 'tarde') ? 3 : 0,
                                                                background: isTurnoSelected(dayOfWeek, 'tarde')
                                                                    ? 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)'
                                                                    : undefined,
                                                                color: isTurnoSelected(dayOfWeek, 'tarde') ? '#fff' : undefined,
                                                                borderColor: isTurnoSelected(dayOfWeek, 'tarde')
                                                                    ? theme.palette.warning.main
                                                                    : undefined,
                                                                transition: 'all 0.2s',
                                                            }}
                                                            onClick={() => handleTurnoSelection(dayOfWeek, 'tarde')}
                                                        >
                                                            Tarde
                                                        </Button>
                                                    </Stack>
                                                    {/* Chips de horarios seleccionados */}
                                                    {turnoSelection[dayOfWeek] && (
                                                        <Chip
                                                            icon={<AccessTimeIcon />}
                                                            label={turnoSelection[dayOfWeek] === 'mañana' ? '10:30 - 13:00' : '15:00 - 18:00'}
                                                            color={turnoSelection[dayOfWeek] === 'mañana' ? 'success' : 'warning'}
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                    )}
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                            );
                        })}
                </Grid>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppLayout>
    );
};

export default InfluencerAvailabilityCrud;
