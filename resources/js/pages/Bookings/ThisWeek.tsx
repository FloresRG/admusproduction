import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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
    const foundCompany = bookings.find(b => b.company.name === companyName)?.company;
    setSelectedCompany(foundCompany);
    setOpenMap(true);
  };

  const handleCloseMap = () => {
    setOpenMap(false);
    setSelectedCompany(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Resumen de Tareas" />
      <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <BusinessIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" fontWeight="bold">
            Mis Empresas - Semana actual de <span style={{ color: '#1976d2' }}>{user.name}</span>
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {Object.entries(summary).map(([companyName, days]: any) => {
            const company = bookings.find(b => b.company.name === companyName)?.company;

            return (
              <Grid item xs={12} md={6} key={companyName}>
                <Card elevation={5} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      {company?.logo ? (
                        <Avatar src={`/${company.logo}`} variant="rounded" sx={{ width: 56, height: 56 }} />
                      ) : (
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                          <BusinessIcon />
                        </Avatar>
                      )}
                      <Typography variant="h6" fontWeight="bold">
                        {companyName}
                      </Typography>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Paper elevation={0} sx={{ mb: 2, p: 2, bgcolor: 'grey.50' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CategoryIcon color="primary" /> <b>Categoría:</b>{' '}
                            {company?.category || 'Sin categoría'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescriptionIcon color="primary" /> <b>Descripción:</b>{' '}
                            {company?.description || 'Sin descripción'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon color="primary" /> <b>Dirección (coordenadas):</b>{' '}
                            {company?.direccion || 'N/D'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>

                    {Object.entries(days).map(([day, shifts]: any) => (
                      <Box key={day} sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', mb: 1 }}
                        >
                          <CalendarTodayIcon fontSize="small" /> {day}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {Object.entries(shifts).map(([turno, count]: any) => (
                            <Tooltip
                              key={turno}
                              title={`Turno ${turno}: ${count} tarea(s)`}
                              arrow
                              placement="top"
                            >
                              <Chip
                                icon={<AccessTimeIcon />}
                                label={`${turno.charAt(0).toUpperCase() + turno.slice(1)}: ${count}`}
                                color={turnoColors[turno] || 'default'}
                                sx={{ fontWeight: 'bold', mb: 1 }}
                              />
                            </Tooltip>
                          ))}
                        </Stack>
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2 }}
                      startIcon={<LocationOnIcon />}
                      onClick={() => handleOpenMap(companyName)}
                    >
                      Ver ubicación en el mapa
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {Object.keys(summary).length === 0 && (
          <Box mt={6} textAlign="center">
            <Avatar sx={{ bgcolor: 'grey.300', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'grey.600' }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary">
              No hay tareas programadas para esta semana.
            </Typography>
          </Box>
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
