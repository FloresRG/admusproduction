'use client';

import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Tarea = {
    id: number;
    titulo: string;
    descripcion: string | null;
    prioridad: string | null;
    fecha: string;
    tipo: {
        id: number;
        nombre_tipo: string;
    } | null;
    company: {
        id: number;
        name: string;
    } | null;
};

type TareasSemanaResponse = {
    inicio: string;
    fin: string;
    dias: Record<string, Tarea[]>;
};

export default function SemanaTareas() {
    const [datosSemana, setDatosSemana] = useState<TareasSemanaResponse | null>(null);
    const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios
            .get('/tareas-semana')
            .then((res) => {
                console.log('RESPUESTA:', res.data);
                setDatosSemana(res.data);
                const primerDia = Object.keys(res.data.dias)[0] || null;
                console.log('Primer día:', primerDia);
                setDiaSeleccionado(primerDia);
            })
            .catch((error) => {
                console.error('ERROR AL CARGAR DATOS', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const tareasDia = diaSeleccionado && datosSemana?.dias ? datosSemana.dias[diaSeleccionado] || [] : [];

    return (
        <Box sx={{ py: 4, minHeight: '100vh', background: '#0a0a0a' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h4"
                    sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        mb: 4,
                    }}
                >
                    Tareas de la Semana
                </Typography>

                {loading && <Typography sx={{ color: '#ccc' }}>Cargando tareas...</Typography>}

                {!loading && datosSemana && (
                    <>
                        <Typography variant="subtitle1" sx={{ color: '#aaa', mb: 2 }}>
                            Semana del {datosSemana.inicio} al {datosSemana.fin}
                        </Typography>

                        {/* Botones de días */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                            {Object.keys(datosSemana.dias).map((fecha) => (
                                <Button
                                    key={fecha}
                                    variant={diaSeleccionado === fecha ? 'contained' : 'outlined'}
                                    color="error"
                                    onClick={() => setDiaSeleccionado(fecha)}
                                >
                                    {new Date(fecha).toLocaleDateString('es-ES', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short',
                                    })}
                                </Button>
                            ))}
                        </Box>

                        {/* Tareas del día */}
                        <Box>
                            {tareasDia.length === 0 && <Typography sx={{ color: '#ccc' }}>No hay tareas para este día.</Typography>}

                            <Grid container spacing={3}>
                                {tareasDia.map((tarea) => (
                                    <Grid item xs={12} sm={6} md={4} key={tarea.id}>
                                        <Card
                                            sx={{
                                                height: 200,
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: '#fff',
                                                backdropFilter: 'blur(10px)',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 10px 20px rgba(255,23,68,0.3)',
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 1 }}>
                                                    {tarea.titulo}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    {tarea.descripcion || '-'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#ff1744' }}>
                                                    Prioridad: {tarea.prioridad || 'Sin prioridad'}
                                                </Typography>
                                                <Typography variant="body2">Tipo: {tarea.tipo?.nombre_tipo || 'Sin tipo'}</Typography>
                                                <Typography variant="body2">Empresa: {tarea.company?.name || 'Sin empresa'}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </>
                )}
            </Container>
        </Box>
    );
}
