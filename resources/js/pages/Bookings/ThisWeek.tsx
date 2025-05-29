import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Breadcrumbs,
  Stack,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  Fade,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { type Booking } from '@/types';

const breadcrumbs = [
  { title: 'Inicio', href: '/' },
  { title: 'Tareas', href: '/bookings' },
];

type Props = {
  bookings: Booking[];
  user: {
    name: string;
  };
};

const turnoColors: Record<string, string> = {
  Mañana: 'primary',
  Tarde: 'secondary',
  Noche: 'info',
};

export default function BookingsSummary() {
  const { bookings, user } = usePage().props as unknown as Props;

  // Agrupar por compañía, luego turno y día
  const summary = bookings.reduce((acc: any, booking) => {
    const company = booking.company.name;
    const day = new Date(booking.start_time).toLocaleDateString();
    const turno = booking.turno;

    acc[company] = acc[company] || {};
    acc[company][day] = acc[company][day] || {};
    acc[company][day][turno] = (acc[company][day][turno] || 0) + 1;

    return acc;
  }, {});

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Resumen de Tareas" />

      <Box sx={{ px: { xs: 1, md: 4 }, py: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <SummarizeIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">
            Mis Actividades de la Semana de:  <span style={{ color: '#1976d2' }}>{user.name}</span>
          </Typography>
        </Stack>

        <Breadcrumbs separator={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />} sx={{ mb: 3 }}>
          {breadcrumbs.map((bc, idx) => (
            <Typography
              key={bc.href}
              color={idx === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              sx={{ fontWeight: idx === breadcrumbs.length - 1 ? 'bold' : undefined }}
            >
              {bc.title}
            </Typography>
          ))}
        </Breadcrumbs>

        <Grid container spacing={3}>
          {Object.entries(summary).map(([companyName, days]: any) => (
            <Grid item xs={12} md={6} key={companyName}>
              <Fade in timeout={600}>
                <Card elevation={6} sx={{ borderRadius: 3, border: '1.5px solid #1976d2', bgcolor: 'background.paper' }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        <BusinessIcon fontSize="large" />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" color="primary.dark">
                        {companyName}
                      </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />

                    {Object.entries(days).map(([day, shifts]: any) => (
                      <Paper
                        key={day}
                        elevation={0}
                        sx={{
                          mb: 2,
                          pl: 2,
                          py: 1.5,
                          bgcolor: 'grey.50',
                          borderLeft: '4px solid #1976d2',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontWeight: 'bold',
                            color: 'primary.main',
                            mb: 1,
                          }}
                        >
                          <CalendarTodayIcon fontSize="small" /> {day}
                        </Typography>

                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          {Object.entries(shifts).map(([turno, count]: any) => (
                            <Tooltip
                              key={turno}
                              title={`Turno ${turno}: ${count} tarea(s)`}
                              arrow
                              placement="top"
                            >
                              <Chip
                                icon={<AccessTimeIcon />}
                                label={
                                  <span>
                                    <b>{turno}</b>: {count} <AssignmentTurnedInIcon sx={{ fontSize: 18, ml: 0.5, mb: '-2px' }} />
                                  </span>
                                }
                                color={turnoColors[turno] || 'default'}
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: 15,
                                  px: 1.5,
                                  py: 1,
                                  mb: 1,
                                  bgcolor: turnoColors[turno] ? `${turnoColors[turno]}.light` : 'grey.200',
                                  color: turnoColors[turno] ? `${turnoColors[turno]}.dark` : 'text.primary',
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Stack>
                      </Paper>
                    ))}
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {Object.keys(summary).length === 0 && (
          <Box mt={6} textAlign="center">
            <Avatar sx={{ bgcolor: 'grey.300', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <EventBusyIcon sx={{ fontSize: 40, color: 'grey.600' }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary">
              No hay tareas para mostrar.
            </Typography>
          </Box>
        )}
      </Box>
    </AppLayout>
  );
}
