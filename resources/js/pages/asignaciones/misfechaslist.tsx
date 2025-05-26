// resources/js/pages/Asignaciones/MisFechasList.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

export default function MisFechasList() {
  const { fechas } = usePage<{ fechas: string[] }>().props;
  const [filtro, setFiltro] = useState('');

  // Filtrar y ordenar
  const fechasOrdenadas = useMemo(() => {
    return fechas
      .filter((f) =>
        dayjs(f)
          .format('dddd DD MMM YYYY')
          .toLowerCase()
          .includes(filtro.toLowerCase())
      )
      .sort((a, b) => dayjs(a).diff(dayjs(b)));
  }, [fechas, filtro]);

  return (
    <AppLayout>
      <Head title="Mis Fechas de Asignaciones" />

      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          color="secondary"
          mb={4}
        >
          Mis Fechas de Asignaciones
        </Typography>

        {/* Buscador */}
        <Box mb={4}>
          <TextField
            fullWidth
            placeholder="Buscar por día o fecha..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="secondary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Grid responsivo */}
        <Grid container spacing={3} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          {fechasOrdenadas.length > 0 ? (
            fechasOrdenadas.map((fecha) => {
              const dia = dayjs(fecha).format('dddd').toUpperCase();
              const fechaFmt = dayjs(fecha).format('DD MMMM YYYY');

              return (
                <Grid xs={1} key={fecha}>
                  <Link
                    href={route('mis.asignaciones.porFecha', { fecha })}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <Card
                      sx={{
                        width: '100%',
                        height: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: 2,
                        borderColor: 'secondary.main',
                        borderRadius: 2,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                          bgcolor: 'action.selected',
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="secondary"
                          gutterBottom
                        >
                          {dia}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fechaFmt}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              );
            })
          ) : (
            <Grid xs={1}>
              <Typography align="center" color="text.secondary">
                No tienes asignaciones en ninguna fecha.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </AppLayout>
  );
}
