import React, { useState } from 'react';
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
  Button,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CategoryIcon from '@mui/icons-material/Category';
import MapComponent from './MapComponent'; // Importa el componente MapComponent

const breadcrumbs = [
  { title: 'Inicio', href: '/' },
  { title: 'Tareas', href: '/bookings' },
];

type Props = {
  bookings: any[];
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

  // Estado para controlar la visibilidad del mapa en el modal
  const [openMap, setOpenMap] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null); // Para saber qué compañía ha sido seleccionada

  // Función para abrir el modal del mapa
  const handleOpenMap = (company: string) => {
    setSelectedCompany(company);
    setOpenMap(true);
  };

  // Función para cerrar el modal del mapa
  const handleCloseMap = () => {
    setOpenMap(false);
    setSelectedCompany(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Resumen de Tareas" />

      <Box sx={{ px: { xs: 1, md: 4 }, py: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <SummarizeIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" fontWeight="bold">
            Mis Empresas de la Semana de: <span style={{ color: '#1976d2' }}>{user.name}</span>
          </Typography>
        </Stack>

        {/* Nueva sección superior con información del usuario y día */}
      

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

                    {/* Company Details Section */}
                    <Paper elevation={0} sx={{ mb: 2, p: 2, bgcolor: 'grey.50' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CategoryIcon color="primary" />
                            <b>Categoría:</b> {bookings.find(b => b.company.name === companyName)?.company.category}
                          </Typography>
                        </Grid>
                      
                        <Grid item xs={12}>
                          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <DescriptionIcon color="primary" />
                            <b>Descripción:</b> {bookings.find(b => b.company.name === companyName)?.company.description}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOnIcon color="primary" />
                            <b>Ubicación:</b> {bookings.find(b => b.company.name === companyName)?.company.ubicacion}
                          </Typography>
                        </Grid>
                        
                      </Grid>
                    </Paper>

                    <Divider sx={{ mb: 2 }} />

                    {/* Existing days and shifts section */}
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
                            <Tooltip key={turno} title={`Turno ${turno}: ${count} tarea(s)`} arrow placement="top">
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

                        {/* Botón que abre el modal del mapa */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenMap(companyName)}
                          startIcon={<LocationOnIcon />}
                          fullWidth
                          sx={{ mt: 2 }}
                        >
                          Ver ubicación en el mapa
                        </Button>
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

      {/* Modal con el mapa */}
      <Dialog open={openMap} onClose={handleCloseMap} maxWidth="md" fullWidth>
        <DialogTitle>Ubicación de {selectedCompany}</DialogTitle>
        <DialogContent>
          <MapComponent company={bookings.find(b => b.company.name === selectedCompany)?.company} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMap} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}
