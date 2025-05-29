// resources/js/pages/Asignaciones/FechasList.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, CardContent, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

// Mapeo para traducir los días al español
const diasEnEspanol: Record<string, string> = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
};

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
                            const nombreIngles = dayjs(fecha).format('dddd');
                            const dia = (diasEnEspanol[nombreIngles] || nombreIngles).toUpperCase();
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
                                                height: 160,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                                color: '#fff',
                                                transition: 'transform 0.3s, box-shadow 0.3s',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
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
                                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                                    {dia}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
