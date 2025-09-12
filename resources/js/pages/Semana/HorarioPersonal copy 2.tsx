// HorarioPersonal.tsx (o el nombre que uses)

import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import MapComponent from './MapComponent'; // Ajusta la ruta según tu estructura

// Define tipos

interface User {
    id: number;
    name: string;
    email: string;
}

interface Company {
    id: number;
    name: string;
    direccion?: string;
    ubicacion?: string; // Ejemplo: "-16.504385,-68.132903"
}

interface Asignacion {
    company: Company;
    fecha: string;
    asignacion_id: number;
}

interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface Props {
    user: User;
    horarioSemanal: Record<string, Record<string, Asignacion | null>>;
    currentWeek: Week;
    weeks?: Week[];
    diasSemana: Record<string, string>;
    turnos: Record<string, string>;
    totalAsignaciones: number;
}

export default function HorarioPersonal({ user, horarioSemanal, currentWeek, weeks = [], diasSemana, turnos, totalAsignaciones }: Props) {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const weekId = e.target.value;
        router.get('/mi-horario', { week_id: weekId });
    };

    const handleOpenDialog = (company: Company) => {
        setSelectedCompany(company);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCompany(null);
    };

    const getTurnoColor = (turno: string) => {
        switch (turno) {
            case 'mañana':
                return 'bg-blue-100 text-blue-800';
            case 'tarde':
                return 'bg-orange-100 text-orange-800';
            case 'noche':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTurnoIcon = (turno: string) => {
        switch (turno) {
            case 'mañana':
                return '☀️';
            case 'tarde':
                return '🌤️';
            case 'noche':
                return '🌙';
            default:
                return '⏰';
        }
    };

    return (
        <AppLayout>
            <>
                <Head title="Mi Horario Semanal" />

                <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', py: 6 }}>
                    <Box sx={{ mx: 'auto', maxWidth: '6xl', px: 4 }}>
                        {/* Header */}
                        <Paper elevation={3} sx={{ mb: 6, p: 6 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Mi Horario Semanal
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Bienvenido, <Typography component="span" sx={{ fontWeight: 'semibold' }}>{user.name}</Typography>
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: { xs: 4, md: 0 } }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Seleccionar semana:</Typography>
                                    <select
                                        onChange={handleWeekChange}
                                        value={currentWeek.id}
                                        style={{
                                            borderRadius: 4,
                                            border: '1px solid #CBD5E0',
                                            backgroundColor: 'white',
                                            padding: '8px 12px',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                        }}
                                    >
                                        {weeks && weeks.map((week) => (
                                            <option key={week.id} value={week.id}>
                                                {week.name}
                                            </option>
                                        ))}
                                    </select>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Resumen */}
                        <Grid container spacing={4} sx={{ mb: 6 }}>
                            <Grid item xs={12} md={4}>
                                <Card elevation={2} sx={{ textAlign: 'center', p: 4 }}>
                                    <Typography variant="h3" component="div" color="primary">
                                        {totalAsignaciones}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Asignaciones totales
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card elevation={2} sx={{ textAlign: 'center', p: 4 }}>
                                    <Typography variant="h3" component="div" color="success.main">
                                        {Object.values(horarioSemanal)
                                            .filter((dia) => Object.values(dia).some((turno) => turno !== null))
                                            .length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Días con trabajo
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card elevation={2} sx={{ textAlign: 'center', p: 4 }}>
                                    <Typography variant="h3" component="div" color="purple">
                                        {
                                            new Set(
                                                Object.values(horarioSemanal).flatMap((dia) =>
                                                    Object.values(dia)
                                                        .filter((asig) => asig)
                                                        .map((asig) => asig.company.id),
                                                ),
                                            ).size
                                        }
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Empresas diferentes
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Tabla de horario usando MUI */}
                        <Box sx={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#F3F4F6' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280' }}>Turno</th>
                                        {Object.entries(diasSemana).map(([dia, nombre]) => (
                                            <th
                                                key={dia}
                                                style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280' }}
                                            >
                                                {nombre}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(turnos).map(([turno, descripcion]) => (
                                        <tr key={turno} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '12px' }}>
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        borderRadius: '9999px',
                                                        px: 2,
                                                        py: 1,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'medium',
                                                        ...( turno === 'mañana'
                                                            ? { backgroundColor: '#DBEAFE', color: '#1E40AF' }
                                                            : turno === 'tarde'
                                                                ? { backgroundColor: '#FEF3C7', color: '#92400E' }
                                                                : turno === 'noche'
                                                                    ? { backgroundColor: '#EDE9FE', color: '#5B21B6' }
                                                                    : { backgroundColor: '#E5E7EB', color: '#374151' }
                                                        )
                                                    }}
                                                >
                                                    <span style={{ marginRight: 4 }}>{getTurnoIcon(turno)}</span>
                                                    {turno.charAt(0).toUpperCase() + turno.slice(1)}
                                                </Box>
                                            </td>
                                            {Object.keys(diasSemana).map((dia) => {
                                                const asignacion = horarioSemanal[dia] && horarioSemanal[dia][turno];
                                                return (
                                                    <td key={`${dia}-${turno}`} style={{ padding: '12px', textAlign: 'center', verticalAlign: 'top' }}>
                                                        {asignacion ? (
                                                            <Box sx={{ border: '1px solid #D1FAE5', backgroundColor: '#ECFDF5', p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: 'green.dark' }}>
                                                                    {asignacion.company.name}
                                                                </Typography>
                                                                {asignacion.company.direccion && (
                                                                    <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'green.main' }}>
                                                                        {asignacion.company.direccion}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="caption" sx={{ color: 'green.main' }}>
                                                                    {new Date(asignacion.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                                </Typography>

                                                                {asignacion.company.ubicacion && (
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        startIcon={<LocationOnIcon />}
                                                                        onClick={() => handleOpenDialog(asignacion.company)}
                                                                        sx={{ mt: 1 }}
                                                                    >
                                                                        Ver ubicación
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">Libre</Typography>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>

                        {/* Si no hay asignaciones */}
                        {totalAsignaciones === 0 && (
                            <Box sx={{ mt: 6, textAlign: 'center' }}>
                                <Avatar sx={{ bgcolor: 'grey.300', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                                    <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'grey.600' }} />
                                </Avatar>
                                <Typography variant="h6" color="text.secondary">
                                    No tienes asignaciones esta semana
                                </Typography>
                            </Box>
                        )}

                        {/* Diálogo para ubicación */}
                        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                            <DialogTitle>Ubicación de la empresa</DialogTitle>
                            <DialogContent dividers>
                                {selectedCompany ? (
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                            {selectedCompany.name}
                                        </Typography>
                                        {selectedCompany.direccion && (
                                            <Typography variant="body2" sx={{ mb: 2 }}>
                                                Dirección: {selectedCompany.direccion}
                                            </Typography>
                                        )}
                                        {selectedCompany.ubicacion && (
                                            <MapComponent
                                                ubicacion={selectedCompany.ubicacion}
                                                nombre={selectedCompany.name}
                                                direccion={selectedCompany.direccion}
                                            />
                                        )}
                                    </Box>
                                ) : (
                                    <Typography variant="body2">No se encontró la empresa seleccionada.</Typography>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">
                                    Cerrar
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </Box>
                </Box>
            </>
        </AppLayout>
        
    );
}
