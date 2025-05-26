import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, CardContent, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

export default function FechasList() {
    const { fechas } = usePage<{ fechas: string[] }>().props;
    const [filtro, setFiltro] = useState('');

    // 1. Filtrar ➝ 2. Ordenar por fecha ascendente
    const fechasOrdenadas = useMemo(() => {
        return fechas
            .filter((f) => dayjs(f).format('dddd DD MMM YYYY').toLowerCase().includes(filtro.toLowerCase()))
            .sort((a, b) => dayjs(a).diff(dayjs(b)));
    }, [fechas, filtro]);

    return (
        <AppLayout>
            <Head title="Fechas con Asignaciones" />

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
                <Typography variant="h4" align="center" fontWeight="bold" color="primary" mb={4}>
                    Fechas con Asignaciones
                </Typography>

                <Box mb={4} display="flex" justifyContent="center">
                    <TextField
                        variant="outlined"
                        placeholder="Buscar por día o fecha..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        sx={{ width: '100%', maxWidth: 500 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    {fechasOrdenadas.length > 0 ? (
                        fechasOrdenadas.map((fecha) => {
                            const dia = dayjs(fecha).format('dddd').toUpperCase();
                            const fechaFmt = dayjs(fecha).format('DD MMMM YYYY');

                            return (
                                <Grid
                                    item
                                    key={fecha}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Link href={route('asignaciones.porFecha', { fecha })} style={{ textDecoration: 'none', width: 240 }}>
                                        <Card
                                            sx={{
                                                width: 240,
                                                height: 140,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                border: 2,
                                                borderColor: 'primary.main',
                                                borderRadius: 2,
                                                transition: '0.3s',
                                                '&:hover': {
                                                    transform: 'translateY(-6px)',
                                                    boxShadow: 6,
                                                    bgcolor: 'action.hover',
                                                },
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    px: 1,
                                                }}
                                            >
                                                <Typography variant="h6" fontWeight={700} color="primary" gutterBottom>
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
                        <Grid item xs={12}>
                            <Typography align="center" color="text.secondary">
                                No se encontraron asignaciones para esa fecha.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </AppLayout>
    );
}
