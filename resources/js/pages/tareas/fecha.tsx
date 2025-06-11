'use client';

import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Add, ArrowBack, CalendarToday as CalendarTodayIcon, Delete as DeleteIcon, Edit } from '@mui/icons-material';
import { Avatar, Box, Button, Card, Chip, Collapse, Container, Fade, IconButton, Paper, Tooltip, Typography, Zoom } from '@mui/material';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

type Asignacion = {
    id: number;
    estado: string;
    detalle: string;
    tarea: { id: number; titulo: string };
    user_name: string;
};

export default function Fecha() {
    const props = usePage().props as {
        fecha: string;
        tareasAsignadas: Asignacion[];
    };
    const { fecha, tareasAsignadas } = props;

    // --- transformamos el array para agrupar por usuario, igual que en Index 'dia' ---
    const tareasPorUsuario = useMemo(() => {
        const m: Record<string, Asignacion[]> = {};
        tareasAsignadas.forEach((a) => {
            m[a.user_name] ??= [];
            m[a.user_name].push(a);
        });
        return m;
    }, [tareasAsignadas]);

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const init: Record<string, boolean> = {};
        Object.keys(tareasPorUsuario).forEach((u) => (init[u] = true));
        setExpanded(init);
    }, [tareasPorUsuario]);

    const toggle = (u: string) => setExpanded((prev) => ({ ...prev, [u]: !prev[u] }));

    return (
        <AppLayout breadcrumbs={[{ title: 'Tareas', href: route('tareas.index') }]}>
            <Head title={`Tareas del ${fecha}`} />

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Button component={Link} href={route('tareas.index')} startIcon={<ArrowBack />} sx={{ mb: 3, borderRadius: 2 }}>
                    Volver
                </Button>

                <Typography variant="h4" gutterBottom>
                    📅 {fecha}
                </Typography>

                {Object.keys(tareasPorUsuario).length === 0 ? (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 3,
                            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                        }}
                    >
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                            📝 No hay tareas para este día
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Crea una nueva tarea
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => axios.post('/create/tareas', { fecha })}
                            sx={{ borderRadius: 2 }}
                        >
                            Nueva tarea
                        </Button>
                    </Paper>
                ) : (
                    Object.entries(tareasPorUsuario).map(([user, assigns], idx) => (
                        <Fade key={user} in timeout={300 + idx * 100}>
                            <Card
                                sx={{
                                    mb: 3,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 3,
                                        background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => toggle(user)}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}>{user.slice(0, 2).toUpperCase()}</Avatar>
                                        <Typography variant="h6">{user}</Typography>
                                    </Box>
                                    <IconButton sx={{ color: 'white' }}>{expanded[user] ? <ExpandLess /> : <ExpandMore />}</IconButton>
                                </Box>

                                <Collapse in={expanded[user]}>
                                    <Box sx={{ p: 2 }}>
                                        {assigns.map((a, i) => (
                                            <Zoom key={a.id} in style={{ transitionDelay: `${i * 100}ms` }}>
                                                <Card
                                                    sx={{
                                                        mb: 2,
                                                        borderRadius: 2,
                                                        borderLeft: `6px solid ${
                                                            a.estado === 'alta' ? '#FF1744' : a.estado === 'media' ? '#FF9100' : '#00E676'
                                                        }`,
                                                    }}
                                                >
                                                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {a.tarea.titulo}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                                <Chip icon={<CalendarTodayIcon fontSize="small" />} label={fecha} size="small" />
                                                                <Chip label={a.estado.toUpperCase()} size="small" />
                                                            </Box>
                                                            <Typography sx={{ mt: 2 }}>{a.detalle || '—'}</Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="Editar">
                                                                <IconButton>
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Eliminar">
                                                                <IconButton>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Zoom>
                                        ))}
                                    </Box>
                                </Collapse>
                            </Card>
                        </Fade>
                    ))
                )}
            </Container>
        </AppLayout>
    );
}
