import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Card, CardContent, Typography, Breadcrumbs, Stack, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { type Booking } from '@/types'; // Asegúrate de definir esto correctamente

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

      <Box sx={{ px: 4, py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Resumen de Tareas para {user.name}
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(summary).map(([companyName, days]: any) => (
            <Grid item xs={12} md={6} key={companyName}>
              <Card elevation={3}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <BusinessIcon />
                    </Avatar>
                    <Typography variant="h6">{companyName}</Typography>
                  </Stack>

                  {Object.entries(days).map(([day, shifts]: any) => (
                    <Box key={day} sx={{ mb: 2, pl: 2 }}>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon fontSize="small" /> {day}
                      </Typography>

                      {Object.entries(shifts).map(([turno, count]: any) => (
                        <Typography key={turno} sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
                          <AccessTimeIcon fontSize="small" /> Turno {turno}: {count} tarea(s)
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {Object.keys(summary).length === 0 && (
          <Typography variant="body1" color="text.secondary" mt={4}>
            No hay tareas para mostrar.
          </Typography>
        )}
      </Box>
    </AppLayout>
  );
}
