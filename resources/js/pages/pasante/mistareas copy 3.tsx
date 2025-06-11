import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Chip,
    Box,
    Container,
    Typography,
    IconButton,
    Collapse,
    alpha,
    debounce
} from '@mui/material';
import { 
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    ExpandMore as ExpandMoreIcon,
    FolderOutlined,
} from '@mui/icons-material';
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

interface Tarea {
    id: number;
    estado: string | null;
    detalle: string | null;
    fecha: string;
    tarea: {
        titulo: string;
        descripcion: string;
        prioridad: string | null;
        tipo: {
            id: number;
            nombre_tipo: string;
        } | null;
        company: {
            name: string;
            ubicacion: string;
            direccion: string;
        } | null;
    };
}
interface Props {
    tareas: Tarea[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mis Tareas', href: '/pasante/mistareas' },
];

const getPriorityColor = (prioridad: string | null) => {
    if (!prioridad) return '#9E9E9E';
    
    switch (prioridad.toLowerCase()) {
        case 'alta':
            return '#FF1744' // Rojo vibrante
        case 'media':
            return '#FF9100' // Naranja vibrante
        case 'baja':
            return '#00E676' // Verde vibrante
        default:
            return '#9E9E9E'
    }
};

const getStatusColor = (estado: string | null) => {
    if (!estado) return 'default';
    
    switch (estado.toLowerCase()) {
        case 'completada':
            return 'success';
        case 'en progreso':
            return 'primary';
        case 'pendiente':
            return 'warning';
        default:
            return 'default';
    }
};

export default function Mistareas({ tareas: initialTareas }: Props) {
    const [tareas, setTareas] = useState(initialTareas);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    // Debounced function for saving details
    const debouncedSaveDetail = useCallback(
        debounce(async (id: number, detalle: string) => {
            try {
                await axios.patch(`/tareas/actualizar-estado/${id}`, {
                    detalle,
                    estado: tareas.find(t => t.id === id)?.estado || 'pendiente'
                });
            } catch (error) {
                console.error('Error al guardar el detalle:', error);
            }
        }, 1000),
        [tareas]
    );

    // Handle estado change
    const handleEstadoChange = async (id: number, newEstado: string) => {
        try {
            await axios.patch(`/tareas/actualizar-estado/${id}`, {
                estado: newEstado,
                detalle: tareas.find(t => t.id === id)?.detalle || ''
            });

            setTareas(tareas.map(tarea => 
                tarea.id === id ? { ...tarea, estado: newEstado } : tarea
            ));
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    // Handle detalle change
    const handleDetalleChange = (id: number, detalle: string) => {
        setTareas(tareas.map(tarea => 
            tarea.id === id ? { ...tarea, detalle } : tarea
        ));
        debouncedSaveDetail(id, detalle);
    };

    const toggleRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Tareas" />
            
            {/* Header con gradiente */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                    color: 'white',
                    py: 3,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" fontWeight="bold">
                        📋 Mis Tareas Asignadas
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        Gestiona y actualiza el estado de tus tareas
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha('#1976d2', 0.05) }}>
                                <TableCell sx={{ width: '40px' }}></TableCell>
                                <TableCell>Título</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Empresa</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Prioridad</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tareas.map((tarea) => (
                                <>
                                    <TableRow 
                                        key={tarea.id}
                                        sx={{ 
                                            '&:hover': { bgcolor: alpha('#1976d2', 0.02) },
                                            borderLeft: `4px solid ${getPriorityColor(tarea.tarea.prioridad)}`
                                        }}
                                    >
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleRow(tarea.id)}
                                                sx={{
                                                    transform: expandedRow === tarea.id ? 'rotate(180deg)' : 'none',
                                                    transition: 'transform 0.2s'
                                                }}
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {tarea.tarea.titulo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {tarea.tarea.tipo && (
                                                <Chip
                                                    icon={<FolderOutlined sx={{ fontSize: 16 }} />}
                                                    label={tarea.tarea.tipo.nombre_tipo}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha('#1976d2', 0.1),
                                                        color: 'primary.main'
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {tarea.tarea.company && (
                                                <Chip
                                                    icon={<BusinessIcon fontSize="small" />}
                                                    label={tarea.tarea.company.name}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<CalendarTodayIcon fontSize="small" />}
                                                label={format(new Date(tarea.fecha), 'dd/MM/yyyy')}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={tarea.tarea.prioridad}
                                                size="small"
                                                sx={{
                                                    bgcolor: getPriorityColor(tarea.tarea.prioridad),
                                                    color: 'white',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={tarea.estado || 'Sin estado'}
                                                color={getStatusColor(tarea.estado)}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7} sx={{ py: 0 }}>
                                            <Collapse in={expandedRow === tarea.id}>
                                                <Box sx={{ p: 3 }}>
                                                    <Typography 
                                                        variant="subtitle2" 
                                                        color="text.secondary"
                                                        gutterBottom
                                                    >
                                                        Descripción:
                                                    </Typography>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ mb: 3 }}
                                                    >
                                                        {tarea.tarea.descripcion}
                                                    </Typography>

                                                    <Box sx={{ 
                                                        p: 2,
                                                        bgcolor: alpha('#1976d2', 0.05),
                                                        borderRadius: 2,
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                                                            Estado de la tarea
                                                        </Typography>
                                                        
                                                        <RadioGroup
                                                            row
                                                            value={tarea.estado || 'pendiente'}
                                                            onChange={(e) => handleEstadoChange(tarea.id, e.target.value)}
                                                            sx={{ mb: 2 }}
                                                        >
                                                            <FormControlLabel 
                                                                value="completada"
                                                                control={<Radio color="success" />}
                                                                label="Completada"
                                                            />
                                                            <FormControlLabel 
                                                                value="en progreso"
                                                                control={<Radio color="primary" />}
                                                                label="En Progreso"
                                                            />
                                                            <FormControlLabel 
                                                                value="pendiente"
                                                                control={<Radio color="warning" />}
                                                                label="Pendiente"
                                                            />
                                                        </RadioGroup>

                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={2}
                                                            variant="outlined"
                                                            placeholder="Agregar detalles o comentarios sobre la tarea..."
                                                            value={tarea.detalle || ''}
                                                            onChange={(e) => handleDetalleChange(tarea.id, e.target.value)}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    bgcolor: 'white'
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {tareas.length === 0 && (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 3,
                            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                        }}
                    >
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                            📝 No tienes tareas asignadas
                        </Typography>
                        <Typography color="text.secondary">
                            Por el momento no hay tareas asignadas para ti
                        </Typography>
                    </Paper>
                )}
            </Container>
        </AppLayout>
    );
}