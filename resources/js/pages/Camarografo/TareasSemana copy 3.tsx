import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import MovieIcon from '@mui/icons-material/Movie';
import CommentIcon from '@mui/icons-material/Comment';
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Typography,
    Card,
    CardContent,
    Chip,
    Box,
    IconButton,
    Divider,
    Stack
} from '@mui/material';
import { useState } from 'react';
import MapComponent from './MapComponent';

type Tarea = {
    id: number;
    titulo: string;
    fecha_produccion: string;
    empresa: {
        id: number;
        name: string;
        direccion: string;
        descripcion?: string;
        ubicacion?: string;
        contract_duration?: string;
        start_date?: string;
        end_date?: string;
    };
    estado_produccion: string;
    estrategia: string;
    guion: string;
    comentario: string;
};

type Props = PageProps<{
    tareas: Record<string, Tarea[]>;
}>;

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getFechasSemana = (): string[] => {
    const hoy = new Date();
    const primerDia = new Date(hoy);
    const day = hoy.getDay();
    const diferencia = day === 0 ? -6 : 1 - day;
    primerDia.setDate(hoy.getDate() + diferencia);

    const fechas: string[] = [];
    for (let i = 0; i < 6; i++) {
        const fecha = new Date(primerDia);
        fecha.setDate(primerDia.getDate() + i);
        fechas.push(fecha.toISOString().split('T')[0]);
    }
    return fechas;
};

const TareasSemana = ({ tareas }: Props) => {
    const fechasSemana = getFechasSemana();

    const [openMap, setOpenMap] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Tarea['empresa'] | null>(null);

    const handleOpenMap = (empresa: Tarea['empresa']) => {
        if (empresa && empresa.direccion) {
            setSelectedCompany(empresa);
            setOpenMap(true);
        }
    };

    const handleCloseMap = () => {
        setOpenMap(false);
        setSelectedCompany(null);
    };

    const gradientColors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];

    return (
        <AppLayout>
            <Head title="Tareas de la Semana" />
            <Box sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                p: 4
            }}>
                <Box sx={{ 
                    maxWidth: '1400px', 
                    mx: 'auto',
                    mb: 4
                }}>
                    <Box sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3,
                        p: 4,
                        mb: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <CalendarTodayIcon sx={{ fontSize: 40, color: 'white' }} />
                            <Typography variant="h3" sx={{ 
                                fontWeight: 700,
                                color: 'white',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                Grabaciones de la Semana
                            </Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)'
                        },
                        gap: 3
                    }}>
                        {fechasSemana.map((fecha, index) => {
                            const diaSemana = diasSemana[index];
                            const tareasDelDia = tareas[fecha] ?? [];

                            return (
                                <Card 
                                    key={fecha} 
                                    sx={{ 
                                        borderRadius: 3,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                                        },
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box sx={{ 
                                        background: gradientColors[index],
                                        p: 2.5,
                                        color: 'white'
                                    }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {diaSemana}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {fecha}
                                        </Typography>
                                        <Chip 
                                            label={`${tareasDelDia.length} tarea${tareasDelDia.length !== 1 ? 's' : ''}`}
                                            size="small"
                                            sx={{ 
                                                mt: 1,
                                                bgcolor: 'rgba(255,255,255,0.3)',
                                                color: 'white',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>

                                    <CardContent sx={{ p: 2 }}>
                                        {tareasDelDia.length === 0 ? (
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ textAlign: 'center', py: 3 }}
                                            >
                                                No hay tareas programadas
                                            </Typography>
                                        ) : (
                                            <Stack spacing={2}>
                                                {tareasDelDia.map((tarea) => (
                                                    <Card 
                                                        key={tarea.id}
                                                        variant="outlined"
                                                        sx={{ 
                                                            borderRadius: 2,
                                                            border: '2px solid',
                                                            borderColor: tarea.estado_produccion === 'completado' 
                                                                ? '#4caf50' 
                                                                : '#ff9800',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                            }
                                                        }}
                                                    >
                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                            <Stack spacing={1.5}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Typography 
                                                                        variant="subtitle1" 
                                                                        sx={{ 
                                                                            fontWeight: 700,
                                                                            color: '#333',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 1
                                                                        }}
                                                                    >
                                                                        <MovieIcon sx={{ fontSize: 20, color: '#667eea' }} />
                                                                        {tarea.titulo}
                                                                    </Typography>
                                                                    {tarea.estado_produccion === 'completado' ? (
                                                                        <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 24 }} />
                                                                    ) : (
                                                                        <PendingIcon sx={{ color: '#ff9800', fontSize: 24 }} />
                                                                    )}
                                                                </Box>

                                                                <Divider />

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <BusinessIcon sx={{ fontSize: 18, color: '#666' }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Empresa:</strong> {tarea.empresa.name}
                                                                    </Typography>
                                                                </Box>

                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    startIcon={<LocationOnIcon />}
                                                                    sx={{ 
                                                                        textTransform: 'none',
                                                                        borderRadius: 2,
                                                                        borderColor: '#667eea',
                                                                        color: '#667eea',
                                                                        '&:hover': {
                                                                            borderColor: '#764ba2',
                                                                            bgcolor: 'rgba(102, 126, 234, 0.05)'
                                                                        }
                                                                    }}
                                                                    onClick={() => handleOpenMap(tarea.empresa)}
                                                                >
                                                                    Ver ubicación
                                                                </Button>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Chip 
                                                                        label={tarea.estado_produccion}
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: tarea.estado_produccion === 'completado' 
                                                                                ? '#e8f5e9' 
                                                                                : '#fff3e0',
                                                                            color: tarea.estado_produccion === 'completado' 
                                                                                ? '#2e7d32' 
                                                                                : '#e65100',
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                </Box>

                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                                    <DescriptionIcon sx={{ fontSize: 18, color: '#666', mt: 0.3 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Estrategia:</strong> {tarea.estrategia}
                                                                    </Typography>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                                    <MovieIcon sx={{ fontSize: 18, color: '#666', mt: 0.3 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Guion:</strong> {tarea.guion}
                                                                    </Typography>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                                    <CommentIcon sx={{ fontSize: 18, color: '#666', mt: 0.3 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Comentario:</strong> {tarea.comentario}
                                                                    </Typography>
                                                                </Box>

                                                                {tarea.estado_produccion !== 'completado' && (
                                                                    <Button
                                                                        variant="contained"
                                                                        size="small"
                                                                        startIcon={<CheckCircleIcon />}
                                                                        sx={{ 
                                                                            mt: 1,
                                                                            textTransform: 'none',
                                                                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                                                            boxShadow: '0 4px 12px rgba(67, 233, 123, 0.3)',
                                                                            fontWeight: 600,
                                                                            '&:hover': {
                                                                                background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
                                                                                boxShadow: '0 6px 16px rgba(67, 233, 123, 0.4)',
                                                                            }
                                                                        }}
                                                                        onClick={() => {
                                                                            if (confirm('¿Estás seguro que quieres marcar esta tarea como completada?')) {
                                                                                router.put(route('tareas.completar', tarea.id));
                                                                            }
                                                                        }}
                                                                    >
                                                                        Marcar como completada
                                                                    </Button>
                                                                )}
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Stack>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                </Box>
            </Box>

            <Dialog 
                open={openMap} 
                onClose={handleCloseMap} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 600
                }}>
                    <LocationOnIcon />
                    Ubicación de la empresa
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedCompany ? (
                        <MapComponent company={selectedCompany} />
                    ) : (
                        <Typography>No se pudo cargar la empresa.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={handleCloseMap}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            }
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default TareasSemana;