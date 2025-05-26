import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    tipo?: { nombre_tipo: string };
    company?: { name: string };
}

const gradientColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
    'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
];

export default function Tareas() {
    const [fechas, setFechas] = useState<string[]>([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
    const [tareas, setTareas] = useState<Tarea[]>([]);

    useEffect(() => {
        axios
            .get('/api/vertareas')
            .then((res) => setFechas(res.data))
            .catch((err) => console.error('Error al cargar fechas:', err));
    }, []);

    const handleFechaClick = (fecha: string) => {
        router.visit(`/tareas?fecha=${fecha}`);
    };
    const formatFechaConDia = (fechaStr: string): string => {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tareas', href: '/tareas' }]}>
            <Head title="Tareas" />
            <Box sx={{ padding: 3 }}>
                {!fechaSeleccionada && (
                    <>
                        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                            Fechas disponibles
                        </Typography>
                        <Grid container spacing={2}>
                            {fechas.map((fecha, index) => (
                                <Grid item xs={12} sm={6} md={4} key={fecha}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            background: gradientColors[index % gradientColors.length],
                                            color: '#fff',
                                            transition: 'transform 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.03)',
                                            },
                                        }}
                                        onClick={() => handleFechaClick(fecha)}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" align="center">
                                                 {formatFechaConDia(fecha)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {fechaSeleccionada && (
                    <>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                            Tareas del día: {fechaSeleccionada}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: '#e0e0e0',
                                    '&:hover': {
                                        backgroundColor: '#d5d5d5',
                                    },
                                }}
                                onClick={() => setFechaSeleccionada(null)}
                            >
                                <CardContent>
                                    <Typography variant="body2">🔙 Volver a fechas</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                        {tareas.length === 0 ? (
                            <Typography>No hay tareas para esta fecha.</Typography>
                        ) : (
                            tareas.map((tarea) => (
                                <Card key={tarea.id} sx={{ mb: 2, backgroundColor: '#fafafa' }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {tarea.titulo}
                                        </Typography>
                                        <Typography>📅 {tarea.fecha}</Typography>
                                        <Typography>📝 {tarea.descripcion}</Typography>
                                        <Typography>🏷️ Tipo: {tarea.tipo?.nombre_tipo || '—'}</Typography>
                                        <Typography>🏢 Empresa: {tarea.company?.name || '—'}</Typography>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </>
                )}
            </Box>
        </AppLayout>
    );
}
