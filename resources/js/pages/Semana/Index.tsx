import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import WorkIcon from '@mui/icons-material/Build';
import BusinessIcon from '@mui/icons-material/Business';
import DoneIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'; // asegúrate de tener esto importado
import { useState } from 'react';

// ------------------ Tipos ------------------

type User = {
    id: number;
    name: string;
    email: string;
};

type AsignacionTarea = {
    id: number;
    estado: string;
    detalle: string;
    user?: User;
};

type Tipo = {
    id: number;
    nombre_tipo: string;
};

type Tarea = {
    id: number;
    titulo: string;
    prioridad: 'alta' | 'media' | 'baja';
    fecha: string;
    descripcion: string;
    tipo?: Tipo;
    asignaciones?: AsignacionTarea[];
};

type Empresa = {
    id: number;
    name?: string;
};

type EmpresaConTareas = {
    empresa: Empresa;
    tareas: {
        [fecha: string]: Tarea[];
    };
};

type DiaSemana = {
    nombre: string;
    fecha: string;
};

// ------------------ Componente ------------------

const Semana = () => {
    const theme = useTheme();
    const { datosPorEmpresa, diasSemana } = usePage<{
        datosPorEmpresa: EmpresaConTareas[];
        diasSemana: DiaSemana[];
    }>().props;

    const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);

    const getColorPorPrioridad = (prioridad: Tarea['prioridad']): string => {
        switch (prioridad) {
            case 'alta':
                return theme.palette.error.main;
            case 'media':
                return theme.palette.warning.main;
            case 'baja':
                return theme.palette.success.main;
            default:
                return theme.palette.grey[500];
        }
    };

    const rowColors = [
        'linear-gradient(135deg, #e3f2fd, #bbdefb)',
        'linear-gradient(135deg, #fce4ec, #f8bbd0)',
        'linear-gradient(135deg, #ede7f6, #d1c4e9)',
        'linear-gradient(135deg, #f1f8e9, #dcedc8)',
        'linear-gradient(135deg, #fff3e0, #ffe0b2)',
        'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
    ];

    const handleCerrarModal = () => {
        setTareaSeleccionada(null);
    };
    const getIconByEstado = (estado: string | undefined) => {
        switch (estado) {
            case 'pendiente':
                return <PendingIcon fontSize="small" sx={{ ml: 0.5 }} />;
            case 'en_proceso':
                return <WorkIcon fontSize="small" sx={{ ml: 0.5 }} />;
            case 'completada':
                return <DoneIcon fontSize="small" sx={{ ml: 0.5 }} />;
            default:
                return null;
        }
    };
    const dayOfWeekInSpanish: { [key: string]: string } = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return (
        <AppLayout>
            <Box p={3}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    📅 Calendario Semanal por Empresa
                </Typography>

                <Paper elevation={3} sx={{ overflowX: 'auto', borderRadius: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <BusinessIcon color="action" />
                                        <strong>Empresa</strong>
                                    </Stack>
                                </TableCell>
                                {diasSemana.map((dia, idx) => (
                                    <TableCell key={idx}>
                                        <Stack direction="row" alignItems="center" gap={1}>
                                            <WbSunnyIcon fontSize="small" />
                                            <Box>
                                                <Typography fontWeight="bold">
                                                    {dayOfWeekInSpanish[dia.nombre.toLowerCase()] ?? dia.nombre}
                                                </Typography>

                                                <Typography variant="caption">{dia.fecha}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {datosPorEmpresa.map((empresaData, idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{
                                        background: rowColors[idx % rowColors.length],
                                        transition: 'background 0.3s ease-in-out',
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 'bold' }}>{empresaData.empresa.name ?? 'Empresa sin nombre'}</TableCell>

                                    {diasSemana.map((dia, j) => {
                                        const tareas = empresaData.tareas[dia.fecha] || [];

                                        return (
                                            <TableCell key={j}>
                                                {tareas.length > 0 ? (
                                                    <Stack spacing={0.5}>
                                                        {tareas
                                                            .slice()
                                                            .sort((a, b) => {
                                                                const orden: Record<Tarea['prioridad'], number> = {
                                                                    alta: 1,
                                                                    media: 2,
                                                                    baja: 3,
                                                                };
                                                                return (orden[a.prioridad] || 4) - (orden[b.prioridad] || 4);
                                                            })
                                                            .map((tarea) => (
                                                                <Tooltip title={tarea.asignaciones?.[0]?.estado ?? 'Sin estado'}>
                                                                    <Chip
                                                                        key={tarea.id}
                                                                        icon={getIconByEstado(tarea.asignaciones?.[0]?.estado)}
                                                                        label={tarea.titulo}
                                                                        size="small"
                                                                        onClick={() => setTareaSeleccionada(tarea)}
                                                                        sx={{
                                                                            backgroundColor: getColorPorPrioridad(tarea.prioridad),
                                                                            color: '#fff',
                                                                            fontWeight: 'bold',
                                                                            cursor: 'pointer',
                                                                            pl: 1,
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            ))}
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        —
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            {/* Modal de Detalles de Tarea */}
            <Dialog open={!!tareaSeleccionada} onClose={handleCerrarModal} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        fontWeight: 'bold',
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                    }}
                >
                    📝 Detalles de la Tarea
                </DialogTitle>

                <DialogContent dividers sx={{ p: 3 }}>
                    {tareaSeleccionada && (
                        <Box display="flex" flexDirection="column" gap={3}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Título
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {tareaSeleccionada.titulo}
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Prioridad
                                    </Typography>
                                    <Chip
                                        label={tareaSeleccionada.prioridad.toUpperCase()}
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#fff',
                                            backgroundColor: getColorPorPrioridad(tareaSeleccionada.prioridad),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Tipo
                                    </Typography>
                                    <Typography>{tareaSeleccionada.tipo?.nombre_tipo ?? 'No especificado'}</Typography>
                                </Grid>
                            </Grid>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Descripción
                                </Typography>
                                <Typography>{tareaSeleccionada.descripcion || 'Sin descripción'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Descripción
                                </Typography>
                                <Typography>{tareaSeleccionada.descripcion || 'Sin descripción'}</Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    👤 Asignaciones
                                </Typography>

                                {tareaSeleccionada.asignaciones && tareaSeleccionada.asignaciones.length > 0 ? (
                                    <Stack spacing={2}>
                                        {tareaSeleccionada.asignaciones.map((asg) => (
                                            <Paper
                                                key={asg.id}
                                                variant="outlined"
                                                sx={{ p: 2, borderRadius: 2, backgroundColor: theme.palette.grey[50] }}
                                            >
                                                <Typography>
                                                    <strong>Usuario:</strong> {asg.user?.name ?? 'Sin asignar'}
                                                </Typography>
                                                <Typography>
                                                    <strong>Estado:</strong> {asg.estado}
                                                </Typography>
                                                <Typography>
                                                    <strong>Detalle:</strong> {asg.detalle || 'Sin detalle'}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography color="text.secondary">No hay asignaciones para esta tarea.</Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleCerrarModal}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default Semana;