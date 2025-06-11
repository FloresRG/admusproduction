import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FolderOutlined } from '@mui/icons-material';
import { 
    Card, 
    CardContent, 
    Typography, 
    Chip, 
    Box, 
    Grid, 
    Container,
    Paper,
    Avatar,
    alpha,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    debounce
} from '@mui/material';
import { format } from 'date-fns';
import {
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { useState, useCallback } from 'react';
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
                    <Typography variant="h4" className="mb-6" fontWeight="bold">
                        📋 Mis Tareas Asignadas
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        Gestiona y actualiza el estado de tus tareas
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {tareas.map((tarea) => (
                        <Grid item xs={12} md={6} lg={4} key={tarea.id}>
                            <Card 
                                sx={{
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    },
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    borderLeft: `6px solid ${getPriorityColor(tarea.tarea.prioridad)}`
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Header de la tarea */}
                                    <Box className="flex flex-col gap-2 mb-4">
                                        <Box className="flex justify-between items-start">
                                            <Typography variant="h6" className="font-bold">
                                                {tarea.tarea.titulo}
                                            </Typography>
                                            <Chip
                                                label={tarea.tarea.prioridad}
                                                sx={{
                                                    bgcolor: getPriorityColor(tarea.tarea.prioridad),
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        {/* Tipo de tarea */}
                                        {tarea.tarea.tipo && (
                                            <Box className="flex items-center gap-2">
                                                <Chip
                                                    label={tarea.tarea.tipo.nombre_tipo}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha('#1976d2', 0.1),
                                                        color: 'primary.main',
                                                        '& .MuiChip-label': {
                                                            fontWeight: 500
                                                        }
                                                    }}
                                                    icon={<FolderOutlined sx={{ fontSize: 16 }} />}
                                                />
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Descripción */}
                                    <Typography 
                                        className="mb-3" 
                                        sx={{ 
                                            color: 'text.secondary',
                                            p: 2,
                                            bgcolor: alpha('#1976d2', 0.05),
                                            borderRadius: 2,
                                            borderLeft: '4px solid #1976d2',
                                        }}
                                    >
                                        {tarea.tarea.descripcion}
                                    </Typography>

                                    {tarea.tarea.company && (
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip
                                                    icon={<BusinessIcon fontSize="small" />}
                                                    label={tarea.tarea.company.name}
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                />
                                                <Chip
                                                    icon={<CalendarTodayIcon fontSize="small" />}
                                                    label={format(new Date(tarea.fecha), 'dd/MM/yyyy')}
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                />
                                            </Box>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    mt: 1, 
                                                    color: 'text.secondary',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                📍 {tarea.tarea.company.ubicacion}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                🏢 {tarea.tarea.company.direccion}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        mt: 2,
                                        pt: 2,
                                        borderTop: '1px solid rgba(0,0,0,0.1)'
                                    }}>
                                        <Chip
                                            label={tarea.estado || 'Sin estado'}
                                            color={getStatusColor(tarea.estado)}
                                            size="small"
                                            sx={{ fontWeight: 'medium' }}
                                        />
                                    </Box>

                                    {tarea.detalle && (
                                        <Typography 
                                            sx={{ 
                                                mt: 2,
                                                fontSize: '0.875rem',
                                                fontStyle: 'italic',
                                                color: 'text.secondary',
                                                p: 1.5,
                                                bgcolor: alpha('#000', 0.03),
                                                borderRadius: 1
                                            }}
                                        >
                                            ℹ️ {tarea.detalle}
                                        </Typography>
                                    )}

                                    <Box sx={{ 
                                        mt: 3,
                                        p: 2,
                                        bgcolor: alpha('#1976d2', 0.05),
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: alpha('#1976d2', 0.1)
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
                                                    bgcolor: 'white',
                                                    '&:hover': {
                                                        borderColor: 'primary.main'
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

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