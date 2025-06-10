// resources/js/Pages/Asignaciones/MisTareasPorFecha.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';

type Asignacion = {
    id: number;
    estado: string;
    detalle: string;
    tarea: { id: number; titulo: string };
};

export default function MisTareasPorFecha() {
    const { fecha, tareasAsignadas } = usePage<{
        fecha: string;
        tareasAsignadas: Asignacion[];
    }>().props;

    return (
        <AppLayout>
            <Head title="Mis Tareas por Fecha" />

            <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
                {/* Encabezado con link de vuelta */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Link href={route('mis.asignaciones.fechas')} style={{ textDecoration: 'none' }}>
                        <Typography variant="subtitle1" color="secondary">
                            ← Volverddd a Mis Fechas
                        </Typography>
                    </Link>
                    <Typography variant="h4" color="secondary">
                        Mis Taredddddas – {dayjs(fecha).format('DD MMM YYYY')}
                    </Typography>
                </Box>

                {/* Tabla de sólo lectura */}
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'secondary.light' }}>
                                <TableCell>
                                    <strong>Tarea</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Estado</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Detalle</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tareasAsignadas.length > 0 ? (
                                tareasAsignadas.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>{a.tarea.titulo}</TableCell>
                                        <TableCell>
                                            <Typography>{a.estado.charAt(0).toUpperCase() + a.estado.slice(1)}</Typography>
                                        </TableCell>
                                        <TableCell>{a.detalle || '—'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No tienes tareas en esta fecha.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </AppLayout>
    );
}
