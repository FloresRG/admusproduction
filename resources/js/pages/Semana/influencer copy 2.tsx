import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Add, Brightness3, Business, Close, Delete, NightsStay, Person, PictureAsPdf, Schedule, WbSunny } from '@mui/icons-material';
import {
    alpha,
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
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import axios from 'axios';
import { useMemo, useState } from 'react';

type Empresa = {
    id: number;
    name?: string;
};

type DiaSemana = {
    nombre: string;
    fecha: string;
};

interface Availability {
    day_of_week: string;
    turno: string;
}

interface Influencer {
    id: number;
    name: string;
    availabilities?: Availability[];
}

type Pasante = {
    id: number;
    name: string;
    email: string;
};

type AsignacionPasante = {
    id: number;
    user_id: number;
    company_id: number;
    turno: string;
    dia: string;
    fecha: string;
    user: Pasante;
    company: Empresa;
};

type EmpresaConDisponibilidad = {
    empresa: Empresa;
    disponibilidad: {
        [day: string]: string[];
    };
    influencersDisponibles: {
        [day: string]: {
            [turno: string]: Influencer[];
        };
    };
    influencersAsignados: {
        [day: string]: {
            [turno: string]: Influencer[];
        };
    };
};

const Semanainfluencer = () => {
    const theme = useTheme();
    
    // Manejo seguro de props con valores por defecto
    const pageProps = usePage().props as {
        datosPorEmpresa?: EmpresaConDisponibilidad[];
        diasSemana?: DiaSemana[];
        influencers?: Influencer[];
        pasantes?: Pasante[];
        asignacionesPasantes?: Record<string, Record<string, Record<string, AsignacionPasante[]>>>;
        currentWeek?: { id: number; name: string };
    };

    const {
        datosPorEmpresa: datosPorEmpresaProp = [],
        diasSemana = [],
        influencers = [],
        pasantes = [],
        asignacionesPasantes = {},
        currentWeek = { id: 0, name: '' },
    } = pageProps;

    const [datosPorEmpresa, setDatosPorEmpresa] = useState(datosPorEmpresaProp);

    // Estado para el buscador
    const [search, setSearch] = useState('');

    // Modal states para influencers
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState<{
        empresaId: number;
        dia: string;
        turno: string;
    } | null>(null);
    const [selectedInfluencer, setSelectedInfluencer] = useState<number | ''>('');
    const [agregarOtro, setAgregarOtro] = useState(false);
    const [selectedInfluencerExtra, setSelectedInfluencerExtra] = useState<number | ''>('');

    // Modal states para pasantes
    const [modalPasanteOpen, setModalPasanteOpen] = useState(false);
    const [selectedPasante, setSelectedPasante] = useState<number | ''>('');

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Estados para tabs
    const [tabValue, setTabValue] = useState(0);

    // Filtrado de empresas por nombre (ignora mayúsculas/minúsculas y tildes)
    const empresasFiltradas = useMemo(() => {
        if (!search.trim()) return datosPorEmpresa;
        const normalizar = (str: string) =>
            str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();
        return datosPorEmpresa.filter((empresaData) => 
            normalizar(empresaData?.empresa?.name || '').includes(normalizar(search))
        );
    }, [search, datosPorEmpresa]);

    const empresaColors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ];

    const dayOfWeekInSpanish: { [key: string]: string } = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    const getTurnoIcon = (turno: string) => {
        switch (turno) {
            case 'mañana':
                return <WbSunny fontSize="small" />;
            case 'tarde':
                return <NightsStay fontSize="small" />;
            case 'noche':
                return <Brightness3 fontSize="small" />;
            default:
                return <WbSunny fontSize="small" />;
        }
    };

    const getTurnoColor = (turno: string) => {
        switch (turno) {
            case 'mañana':
                return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
            case 'tarde':
                return 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)';
            case 'noche':
                return 'linear-gradient(135deg, #2C3E50 0%, #4A148C 100%)';
            default:
                return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
        }
    };

    // Funciones para influencers
    const handleOpenModal = (empresaId: number, dia: string, turno: string) => {
        setSelectedTurno({ empresaId, dia, turno });
        setModalOpen(true);
        setTabValue(0);
    };

    // Funciones para pasantes
    const handleOpenModalPasante = (empresaId: number, dia: string, turno: string) => {
        setSelectedTurno({ empresaId, dia, turno });
        setModalPasanteOpen(true);
        setTabValue(1);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalPasanteOpen(false);
        setSelectedTurno(null);
        setSelectedInfluencer('');
        setSelectedInfluencerExtra('');
        setSelectedPasante('');
        setAgregarOtro(false);
    };

    const handleQuitarInfluencer = async (empresaId: number, dia: string, turno: string, influencerId: number) => {
        setLoading(true);
        try {
            await axios.post('/quitar-influencer', {
                empresa_id: empresaId,
                dia,
                turno,
                influencer_id: influencerId,
            });

            setDatosPorEmpresa((prev) =>
                prev.map((empresa) =>
                    empresa.empresa.id === empresaId
                        ? {
                              ...empresa,
                              influencersAsignados: {
                                  ...empresa.influencersAsignados,
                                  [dia]: {
                                      ...empresa.influencersAsignados[dia],
                                      [turno]: empresa.influencersAsignados[dia][turno].filter((inf: any) => inf.id !== influencerId),
                                  },
                              },
                          }
                        : empresa,
                ),
            );
        } catch (error) {
            console.error('Error al quitar influencer:', error);
            alert('Hubo un error al quitar el influencer');
        } finally {
            setLoading(false);
        }
    };

    const handleQuitarPasante = async (asignacionId: number) => {
        setLoading(true);
        try {
            await axios.delete(`/asignacion-pasantes/${asignacionId}`);
            window.location.reload();
        } catch (error) {
            console.error('Error al quitar pasante:', error);
            alert('Hubo un error al quitar el pasante');
        } finally {
            setLoading(false);
        }
    };

    const handleAsignarInfluencer = async () => {
        if (!selectedTurno) return;

        const peticiones = [];

        if (selectedInfluencer) {
            peticiones.push(
                axios.post('/asignar-influencer', {
                    empresa_id: selectedTurno.empresaId,
                    dia: selectedTurno.dia,
                    turno: selectedTurno.turno,
                    influencer_id: selectedInfluencer,
                }),
            );
        }

        if (agregarOtro && selectedInfluencerExtra) {
            peticiones.push(
                axios.post('/asignar-influencer', {
                    empresa_id: selectedTurno.empresaId,
                    dia: selectedTurno.dia,
                    turno: selectedTurno.turno,
                    influencer_id: selectedInfluencerExtra,
                }),
            );
        }

        if (peticiones.length === 0) {
            alert('Debes seleccionar al menos un influencer.');
            return;
        }

        setLoading(true);
        try {
            await Promise.all(peticiones);
            handleCloseModal();
            window.location.reload();
        } catch (error) {
            console.error('Error al asignar influencer(es):', error);
            alert('Hubo un error al asignar el influencer.');
        } finally {
            setLoading(false);
        }
    };

    const handleAsignarPasante = async () => {
        if (!selectedTurno || !selectedPasante) {
            alert('Debes seleccionar un pasante.');
            return;
        }

        setLoading(true);
        try {
            const weekDates = calculateWeekDates();
            const fecha = weekDates[selectedTurno.dia];

            await axios.post('/asignacion-pasantes', {
                user_id: selectedPasante,
                company_id: selectedTurno.empresaId,
                turno: selectedTurno.turno,
                dia: selectedTurno.dia,
                week_id: currentWeek.id,
                fecha: fecha,
            });

            handleCloseModal();
            window.location.reload();
        } catch (error) {
            console.error('Error al asignar pasante:', error);
            alert('Hubo un error al asignar el pasante.');
        } finally {
            setLoading(false);
        }
    };

    const calculateWeekDates = () => {
        const dates: Record<string, string> = {};
        if (diasSemana.length > 0) {
            diasSemana.forEach((dia, index) => {
                dates[dia.nombre.toLowerCase()] = dia.fecha;
            });
        }
        return dates;
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
            });
        } catch (error) {
            return dateString;
        }
    };

    const getTotalInfluencersAsignados = () => {
        return datosPorEmpresa.reduce((total, empresa) => {
            return (
                total +
                Object.values(empresa?.influencersAsignados || {}).reduce((empresaTotal, dia) => {
                    return (
                        empresaTotal +
                        Object.values(dia || {}).reduce((diaTotal, turno) => {
                            return diaTotal + (turno?.length || 0);
                        }, 0)
                    );
                }, 0)
            );
        }, 0);
    };

    const getTotalPasantesAsignados = () => {
        let total = 0;
        Object.values(asignacionesPasantes || {}).forEach((empresa) => {
            Object.values(empresa || {}).forEach((turno) => {
                Object.values(turno || {}).forEach((dia) => {
                    total += dia?.length || 0;
                });
            });
        });
        return total;
    };

    const getAsignacionesPasantesByCompanyTurnoDia = (companyId: number, turno: string, dia: string): AsignacionPasante[] => {
        return asignacionesPasantes?.[companyId]?.[turno]?.[dia] || [];
    };

    const handleAsignarEmpresas = async () => {
        setLoading(true);
        setMensaje(null);
        setError(null);

        try {
            const response = await axios.post('/asignar-empresas-masivamente');
            setMensaje(response.data.message);
            console.log('Detalle de asignaciones:', response.data.detalle);
            window.location.reload();
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Ocurrió un error inesperado al asignar empresas.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getFirstName = (fullName: string) => {
        return fullName ? fullName.split(' ')[0] : '';
    };

    // Extender los turnos para incluir "noche"
    const turnosCompletos = ['mañana', 'tarde', 'noche'];

    // Renderizado condicional si no hay datos
    if (!diasSemana || diasSemana.length === 0) {
        return (
            <AppLayout>
                <Box p={3}>
                    <Typography variant="h4">Cargando datos...</Typography>
                </Box>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Box
                p={3}
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
                    minHeight: '100vh',
                }}
            >
                {/* Header Mejorado */}
                <Box mb={4}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1,
                                }}
                            >
                                📅 Gestión Semanal
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Asignación de influencers y pasantes por empresa y turno
                            </Typography>
                        </Box>
                        <Box mb={2} display="flex" alignItems="center" gap={2}>
                            <TextField
                                label="Buscar empresa"
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ minWidth: 280, background: '#fff', borderRadius: 2 }}
                            />
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Card sx={{ minWidth: 120 }}>
                                <CardContent sx={{ py: 1.5, px: 2, textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {datosPorEmpresa.length}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Empresas
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{ minWidth: 120 }}>
                                <CardContent sx={{ py: 1.5, px: 2, textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight="bold" color="secondary">
                                        {getTotalInfluencersAsignados()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Influencers
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{ minWidth: 120 }}>
                                <CardContent sx={{ py: 1.5, px: 2, textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight="bold" color="success">
                                        {getTotalPasantesAsignados()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Pasantes
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Stack>

                    <Box mt={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <Button
                            variant="contained"
                            startIcon={<PictureAsPdf />}
                            onClick={() => window.open('/disponibilidad-semanal-pdf', '_blank')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                boxShadow: `0 8px 32px ${alpha('#2575fc', 0.3)}`,
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4b0eb9 0%, #1a56d0 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 12px 40px ${alpha('#2575fc', 0.4)}`,
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            Generar Reporte PDF
                        </Button>

                        <Box>
                            <Button
                                variant="contained"
                                onClick={handleAsignarEmpresas}
                                disabled={loading}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)',
                                    boxShadow: `0 8px 32px ${alpha('#218838', 0.3)}`,
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1e7e34 0%, #1c7430 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 12px 40px ${alpha('#218838', 0.4)}`,
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                {loading ? 'Asignando...' : 'Asignar Empresas Masivamente'}
                            </Button>

                            {mensaje && (
                                <Typography mt={1} color="success.main" fontWeight="medium">
                                    {mensaje}
                                </Typography>
                            )}
                            {error && (
                                <Typography mt={1} color="error.main" fontWeight="medium">
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Tabla Principal Mejorada */}
                <Paper
                    elevation={0}
                    sx={{
                        overflowX: 'auto',
                        borderRadius: 4,
                        background: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        position: 'relative',
                    }}
                >
                    <Table sx={{ borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.80rem' }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                    '& th': {
                                        color: '#fff',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontWeight: '600',
                                        fontSize: '0.90rem',
                                        py: 1,
                                        px: 1,
                                    },
                                }}
                            >
                                <TableCell
                                    sx={{
                                        width: 120,
                                        pl: 1,
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 10,
                                        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                        borderRight: '1px solid rgba(255,255,255,0.2)',
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" gap={0.5}>
                                        <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 24, height: 24 }}>
                                            <Business fontSize="small" />
                                        </Avatar>
                                        <span style={{ fontSize: '0.95rem' }}>Empresa</span>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ width: 80, pl: 1, fontWeight: 'bold' }}>Turno</TableCell>
                                {diasSemana.map((dia, idx) => (
                                    <TableCell key={idx} align="center">
                                        <Stack alignItems="center" gap={0.2}>
                                            <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 20, height: 20 }}>
                                                <Schedule fontSize="inherit" />
                                            </Avatar>
                                            <Typography fontWeight="bold" fontSize="0.80rem">
                                                {dayOfWeekInSpanish[dia.nombre.toLowerCase()] ?? dia.nombre}
                                            </Typography>
                                            <Chip
                                                label={formatDate(dia.fecha)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha('#fff', 0.2),
                                                    color: '#fff',
                                                    fontSize: '0.65rem',
                                                    height: 18,
                                                    px: 0.5,
                                                }}
                                            />
                                        </Stack>
                                    </TableCell>
                                ))}
                            </TableRow>

                            {/* Filas de disponibilidad de influencers por turno */}
                            {turnosCompletos.map((turno) => (
                                <TableRow
                                    key={`disponibilidad-${turno}`}
                                    sx={{
                                        background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)',
                                        '& td': {
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: '0.75rem',
                                            py: 0.5,
                                            px: 1,
                                            color: '#333',
                                            borderBottom: '1px solid #e0e0e0',
                                        },
                                    }}
                                >
                                    {turno === 'mañana' && (
                                        <TableCell
                                            rowSpan={3}
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#666',
                                                background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)',
                                                verticalAlign: 'middle',
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 10,
                                                borderRight: '1px solid rgba(224,224,224,0.5)',
                                            }}
                                        >
                                            Influencers disponibles
                                        </TableCell>
                                    )}
                                    <TableCell
                                        sx={{
                                            fontWeight: 'bold',
                                            color: turno === 'mañana' ? '#FFA500' : turno === 'tarde' ? '#4A90E2' : '#2C3E50',
                                            verticalAlign: 'middle',
                                            background: 'transparent',
                                            borderBottom: '1px solid #e0e0e0',
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" gap={1}>
                                            <Avatar
                                                sx={{
                                                    background: getTurnoColor(turno),
                                                    width: 20,
                                                    height: 20,
                                                    fontSize: '1rem',
                                                }}
                                            >
                                                {getTurnoIcon(turno)}
                                            </Avatar>
                                            <Typography fontWeight="bold" fontSize="0.80rem">
                                                {turno.charAt(0).toUpperCase() + turno.slice(1)}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    {diasSemana.map((dia, idx) => {
                                        // FIX: Corrección del filtro de influencers disponibles
                                        const disponibles = influencers.filter(
                                            (inf) =>
                                                inf.availabilities && 
                                                inf.availabilities.some(
                                                    (a: Availability) =>
                                                        a.day_of_week?.toLowerCase() === dia.nombre.toLowerCase() && 
                                                        a.turno?.toLowerCase() === turno,
                                                ),
                                        );
                                        return (
                                            <TableCell key={idx} align="center">
                                                <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" justifyContent="center">
                                                    {disponibles.length > 0 ? (
                                                        disponibles.map((inf) => (
                                                            <Chip
                                                                key={`${turno}-${inf.id}`}
                                                                label={getFirstName(inf.name)}
                                                                size="small"
                                                                sx={{
                                                                    fontSize: '0.68rem',
                                                                    bgcolor: alpha(
                                                                        turno === 'mañana'
                                                                            ? theme.palette.primary.light
                                                                            : turno === 'tarde'
                                                                              ? theme.palette.secondary.light
                                                                              : theme.palette.info.light,
                                                                        0.15,
                                                                    ),
                                                                    color:
                                                                        turno === 'mañana'
                                                                            ? theme.palette.primary.dark
                                                                            : turno === 'tarde'
                                                                              ? theme.palette.secondary.dark
                                                                              : theme.palette.info.dark,
                                                                    mb: 0.1,
                                                                }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                                                            -
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHead>

                        <TableBody>
                            {empresasFiltradas.map((empresaData, idx) =>
                                turnosCompletos.map((turno, turnoIdx) => (
                                    <TableRow
                                        key={`${empresaData.empresa.id}-${turno}`}
                                        sx={{
                                            background: empresaColors[idx % empresaColors.length],
                                            '& td': {
                                                fontFamily: "'Poppins', sans-serif",
                                                fontSize: '0.80rem',
                                                py: 1,
                                                px: 1,
                                            },
                                        }}
                                    >
                                        {turnoIdx === 0 ? (
                                            <TableCell
                                                rowSpan={3}
                                                sx={{
                                                    // ...existing code...
                                                // Avatar y nombre de la empresa
                                                fontWeight: 'bold',
                                                color: '#fff',
                                                background: empresaColors[idx % empresaColors.length],
                                                verticalAlign: 'middle',
                                                position: 'sticky',
                                                left: 0,
                                                zIndex: 10,
                                                borderRight: '1px solid rgba(224,224,224,0.5)',
                                            }}
                                        >
                                            <Stack direction="row" alignItems="center" gap={1}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: alpha('#fff', 0.25),
                                                        color: '#333',
                                                        width: 28,
                                                        height: 28,
                                                        fontWeight: 'bold',
                                                        fontSize: '1.1rem',
                                                    }}
                                                >
                                                    <Business fontSize="small" />
                                                </Avatar>
                                                <Typography fontWeight="bold" fontSize="1rem">
                                                    {empresaData.empresa.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        ) : null}
                                        <TableCell
                                            sx={{
                                                fontWeight: 'bold',
                                                color: turno === 'mañana' ? '#FFA500' : turno === 'tarde' ? '#4A90E2' : '#2C3E50',
                                                verticalAlign: 'middle',
                                                background: 'transparent',
                                                borderBottom: '1px solid #e0e0e0',
                                            }}
                                        >
                                            <Stack direction="row" alignItems="center" gap={1}>
                                                <Avatar
                                                    sx={{
                                                        background: getTurnoColor(turno),
                                                        width: 20,
                                                        height: 20,
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    {getTurnoIcon(turno)}
                                                </Avatar>
                                                <Typography fontWeight="bold" fontSize="0.80rem">
                                                    {turno.charAt(0).toUpperCase() + turno.slice(1)}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        {diasSemana.map((dia, diaIdx) => {
                                            const asignados = empresaData.influencersAsignados?.[dia.nombre.toLowerCase()]?.[turno] || [];
                                            const pasantesAsignados = getAsignacionesPasantesByCompanyTurnoDia(
                                                empresaData.empresa.id,
                                                turno,
                                                dia.nombre.toLowerCase()
                                            );
                                            return (
                                                <TableCell key={diaIdx} align="center">
                                                    <Stack direction="column" spacing={0.5} alignItems="center" justifyContent="center">
                                                        {/* Influencers asignados */}
                                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center">
                                                            {asignados.length > 0 ? (
                                                                asignados.map((inf) => (
                                                                    <Chip
                                                                        key={inf.id}
                                                                        label={getFirstName(inf.name)}
                                                                        size="small"
                                                                        color="primary"
                                                                        sx={{
                                                                            fontSize: '0.70rem',
                                                                            bgcolor: alpha('#fff', 0.25),
                                                                            color: '#333',
                                                                            mb: 0.2,
                                                                        }}
                                                                        onDelete={() =>
                                                                            handleQuitarInfluencer(
                                                                                empresaData.empresa.id,
                                                                                dia.nombre.toLowerCase(),
                                                                                turno,
                                                                                inf.id
                                                                            )
                                                                        }
                                                                        deleteIcon={<Delete fontSize="small" />}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                                                                    -
                                                                </Typography>
                                                            )}
                                                            <Tooltip title="Asignar influencer">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() =>
                                                                        handleOpenModal(
                                                                            empresaData.empresa.id,
                                                                            dia.nombre.toLowerCase(),
                                                                            turno
                                                                        )
                                                                    }
                                                                    sx={{ ml: 0.5 }}
                                                                >
                                                                    <Add fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                        {/* Pasantes asignados */}
                                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center" mt={0.5}>
                                                            {pasantesAsignados.length > 0 ? (
                                                                pasantesAsignados.map((asig) => (
                                                                    <Chip
                                                                        key={asig.id}
                                                                        label={getFirstName(asig.user.name)}
                                                                        size="small"
                                                                        color="success"
                                                                        sx={{
                                                                            fontSize: '0.70rem',
                                                                            bgcolor: alpha('#fff', 0.18),
                                                                            color: '#333',
                                                                            mb: 0.2,
                                                                        }}
                                                                        onDelete={() => handleQuitarPasante(asig.id)}
                                                                        deleteIcon={<Delete fontSize="small" />}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <></>
                                                            )}
                                                            <Tooltip title="Asignar pasante">
                                                                <IconButton
                                                                    size="small"
                                                                    color="success"
                                                                    onClick={() =>
                                                                        handleOpenModalPasante(
                                                                            empresaData.empresa.id,
                                                                            dia.nombre.toLowerCase(),
                                                                            turno
                                                                        )
                                                                    }
                                                                    sx={{ ml: 0.5 }}
                                                                >
                                                                    <Person fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </Stack>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                {/* Modal para asignar influencer */}
                <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
                    <DialogTitle>
                        Asignar Influencer
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Influencer</InputLabel>
                            <Select
                                value={selectedInfluencer}
                                onChange={(e) => setSelectedInfluencer(e.target.value as number)}
                                label="Influencer"
                            >
                                {influencers.map((inf) => (
                                    <MenuItem key={inf.id} value={inf.id}>
                                        {inf.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={agregarOtro}
                                    onChange={(e) => setAgregarOtro(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Agregar otro influencer"
                        />
                        {agregarOtro && (
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Influencer extra</InputLabel>
                                <Select
                                    value={selectedInfluencerExtra}
                                    onChange={(e) => setSelectedInfluencerExtra(e.target.value as number)}
                                    label="Influencer extra"
                                >
                                    {influencers
                                        .filter((inf) => inf.id !== selectedInfluencer)
                                        .map((inf) => (
                                            <MenuItem key={inf.id} value={inf.id}>
                                                {inf.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                        <Button
                            onClick={handleAsignarInfluencer}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            Asignar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Modal para asignar pasante */}
                <Dialog open={modalPasanteOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
                    <DialogTitle>
                        Asignar Pasante
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth>
                            <InputLabel>Pasante</InputLabel>
                            <Select
                                value={selectedPasante}
                                onChange={(e) => setSelectedPasante(e.target.value as number)}
                                label="Pasante"
                            >
                                {pasantes.map((pas) => (
                                    <MenuItem key={pas.id} value={pas.id}>
                                        {pas.name} ({pas.email})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                        <Button
                            onClick={handleAsignarPasante}
                            variant="contained"
                            color="success"
                            disabled={loading}
                        >
                            Asignar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AppLayout>
    );
};

export default Semanainfluencer;
