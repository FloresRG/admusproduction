import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { startOfWeek, format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Button,
    Grid,
    Typography,
    Box,
    Card,
    CardContent,
    CardHeader,
    useTheme
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';

const breadcrumbs = [
    { title: 'Disponibilidad de Influencers', href: '/influencer-availability' },
];

interface InfluencerAvailability {
    id: number;
    user_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
}

const InfluencerAvailabilityCrud = () => {
    const theme = useTheme();
    const [availabilities, setAvailabilities] = useState<InfluencerAvailability[]>([]);
    const [calendarDates, setCalendarDates] = useState<Date[]>([]);
    const [turnoSelection, setTurnoSelection] = useState<{ [key: string]: string }>({});
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        setCalendarDates(getCurrentWeekDays());
        fetchAvailabilities();
        fetchUserId();
    }, []);

    const fetchUserId = () => {
        axios.get('/api/auth/user')
            .then(response => setUserId(response.data.id))
            .catch(error => console.error('Error al obtener el usuario:', error));
    };

    const getCurrentWeekDays = () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        return Array.from({ length: 5 }, (_, i) => addDays(start, i)); // Lunes a viernes
    };

    const fetchAvailabilities = () => {
        axios.get('/api/influencer-availability')
            .then(response => {
                setAvailabilities(response.data);
                const initial: { [key: string]: string } = {};
                response.data.forEach((avail: InfluencerAvailability) => {
                    initial[avail.day_of_week] = avail.turno;
                });
                setTurnoSelection(initial);
            })
            .catch(error => console.error('Error al obtener disponibilidad:', error));
    };

    const handleTurnoSelection = (day: string, turno: string) => {
        const previous = turnoSelection[day];
        if (previous === turno) {
            deleteAvailability(day, previous);
            return;
        }
        setTurnoSelection(prev => ({ ...prev, [day]: turno }));

        const start_time = turno === 'mañana' ? '09:30' : '14:00';
        const end_time = turno === 'mañana' ? '13:00' : '18:00';

        const existing = availabilities.find(
            (a) => a.day_of_week === day && a.turno === previous
        );
        if (existing) deleteAvailability(day, previous);

        const alreadyExists = availabilities.find(
            (a) => a.day_of_week === day && a.turno === turno
        );
        if (alreadyExists) {
            updateAvailability(alreadyExists.id, start_time, end_time);
        } else {
            createAvailability(day, turno, start_time, end_time);
        }
    };

    const createAvailability = (day: string, turno: string, start: string, end: string) => {
        axios.post('/api/influencer-availability', {
            user_id: userId,
            day_of_week: day,
            turno,
            start_time: start,
            end_time: end
        }).then(fetchAvailabilities)
          .catch(err => console.error('Error al crear disponibilidad:', err));
    };

    const updateAvailability = (id: number, start: string, end: string) => {
        axios.put(`/api/influencer-availability/${id}`, {
            start_time: start,
            end_time: end
        }).then(fetchAvailabilities)
          .catch(err => console.error('Error al actualizar disponibilidad:', err));
    };

    const deleteAvailability = (day: string, turno: string) => {
        const item = availabilities.find((a) => a.day_of_week === day && a.turno === turno);
        if (item) {
            axios.delete(`/api/influencer-availability/${item.id}`)
                .then(fetchAvailabilities)
                .catch(err => console.error('Error al eliminar disponibilidad:', err));
        }
    };

    const isTurnoSelected = (day: string, turno: string) => turnoSelection[day] === turno;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Agregue sus dias disponibles (Lunes a Viernes)
                </Typography>

                <Grid container spacing={3}>
                    {calendarDates.map((date, index) => {
                        const dayOfWeek = format(date, 'EEEE', { locale: es }).toLowerCase(); // ej: 'lunes'
                        const dateLabel = format(date, 'dd MMM', { locale: es });

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        minHeight: 220,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        backgroundColor: theme.palette.background.paper
                                    }}
                                >
                                    <CardHeader
                                        title={dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}
                                        subheader={dateLabel}
                                        sx={{ textAlign: 'center', backgroundColor: theme.palette.grey[100] }}
                                    />
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Button
                                            fullWidth
                                            startIcon={<WbSunnyIcon />}
                                            variant={isTurnoSelected(dayOfWeek, 'mañana') ? 'contained' : 'outlined'}
                                            color="primary"
                                            onClick={() => handleTurnoSelection(dayOfWeek, 'mañana')}
                                            sx={{ mb: 2 }}
                                        >
                                            Turno Mañana
                                        </Button>
                                        <Button
                                            fullWidth
                                            startIcon={<NightsStayIcon />}
                                            variant={isTurnoSelected(dayOfWeek, 'tarde') ? 'contained' : 'outlined'}
                                            color="secondary"
                                            onClick={() => handleTurnoSelection(dayOfWeek, 'tarde')}
                                        >
                                            Turno Tarde
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </AppLayout>
    );
};

export default InfluencerAvailabilityCrud;
