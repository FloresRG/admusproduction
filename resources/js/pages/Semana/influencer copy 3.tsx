import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Add, Business, Close, Delete, NightsStay, Person, PictureAsPdf, Schedule, WbSunny } from '@mui/icons-material';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
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
import { BriefcaseBusinessIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

type Empresa = {
    id: number;
    name?: string;
};

type DiaSemana = {
    nombre: string;
    fecha: string;
};

type Influencer = {
    id: number;
    name: string;
    bookingId: number; // ✅ Este lo necesitas
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
interface WeekProps {
    id: number;
    name: string;
}
const Semanainfluencer = () => {
    const theme = useTheme();
    const {
        datosPorEmpresa: datosPorEmpresaProp,
        diasSemana,
        influencers,
        week,
    } = usePage<{
        datosPorEmpresa: EmpresaConDisponibilidad[];
        diasSemana: DiaSemana[];
        influencers: Influencer[];
        week: WeekProps;
    }>().props;

    const [datosPorEmpresa, setDatosPorEmpresa] = useState(datosPorEmpresaProp);

    // Nuevo estado para el buscador
    const [search, setSearch] = useState('');

    // Filtrado de empresas por nombre (ignora mayúsculas/minúsculas y tildes)
    const empresasFiltradas = useMemo(() => {
        if (!search.trim()) return datosPorEmpresa;
        const normalizar = (str: string) =>
            str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();
        return datosPorEmpresa.filter((empresaData) => normalizar(empresaData.empresa.name || '').includes(normalizar(search)));
    }, [search, datosPorEmpresa]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState<{
        empresaId: number;
        dia: string;
        turno: string;
    } | null>(null);
    const [selectedInfluencer, setSelectedInfluencer] = useState<number | ''>('');
    const [agregarOtro, setAgregarOtro] = useState(false);
    const [selectedInfluencerExtra, setSelectedInfluencerExtra] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);

    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
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
        return turno === 'mañana' ? <WbSunny fontSize="small" /> : <NightsStay fontSize="small" />;
    };

    const getTurnoColor = (turno: string) => {
        return turno === 'mañana' ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)';
    };

    const handleOpenModal = (empresaId: number, dia: string, turno: string) => {
        setSelectedTurno({ empresaId, dia, turno });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTurno(null);
        setSelectedInfluencer('');
        setSelectedInfluencerExtra('');
        setAgregarOtro(false);
    };

    /* const handleQuitarInfluencer = async (bookingId: number) => {
        setLoading(true);
        try {
            await axios.post('/quitar-influencer', {
                booking_id: bookingId,
            });

            // Si quieres, recarga la página para reflejar los cambios fácilmente:
            window.location.reload();
        } catch (error: any) {
            console.error('Error al quitar influencer:', error.response?.data || error.message);
            alert('Hubo un error al quitar el influencer');
        } finally {
            setLoading(false);
        }
    }; */
    const handleQuitarInfluencer = async (bookingId: number, empresaId: number, dia: string, turno: string, influencerId: number) => {
        setLoading(true);
        try {
            await axios.post('/quitar-influencer', {
                booking_id: bookingId,
            });

            // ✅ Actualiza el estado local para reflejar el cambio en la UI sin recargar
            setDatosPorEmpresa((prev) =>
                prev.map((empresa) =>
                    empresa.empresa.id === empresaId
                        ? {
                              ...empresa,
                              influencersAsignados: {
                                  ...empresa.influencersAsignados,
                                  [dia]: {
                                      ...empresa.influencersAsignados[dia],
                                      [turno]: empresa.influencersAsignados[dia][turno].filter((inf) => inf.id !== influencerId),
                                  },
                              },
                          }
                        : empresa,
                ),
            );
        } catch (error: any) {
            console.error('Error al quitar influencer:', error.response?.data || error.message);
            alert('Hubo un error al quitar el influencer');
        } finally {
            setLoading(false);
        }
    };

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

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

    const getTotalInfluencersAsignados = () => {
        return datosPorEmpresa.reduce((total, empresa) => {
            return (
                total +
                Object.values(empresa.influencersAsignados).reduce((empresaTotal, dia) => {
                    return (
                        empresaTotal +
                        Object.values(dia).reduce((diaTotal, turno) => {
                            return diaTotal + turno.length;
                        }, 0)
                    );
                }, 0)
            );
        }, 0);
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
                                Asignación de influencers por empresa y turno
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
                                        Asignados
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Stack>

                    <Box mt={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        {/* Botón Generar PDF */}
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
                        <Button
                            variant="contained"
                            color="error"
                            onClick={async () => {
                                if (window.confirm('¿Estás seguro de que deseas eliminar TODAS las disponibilidades de influencers?')) {
                                    try {
                                        const res = await axios.post('/clear-availabilities');
                                        alert(res.data.message);
                                        window.location.reload();
                                    } catch (e) {
                                        alert('Error al limpiar disponibilidades');
                                    }
                                }
                            }}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
                                boxShadow: `0 8px 32px ${alpha('#d50000', 0.3)}`,
                                px: 4,
                                py: 1.5,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #b71c1c 0%, #c62828 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 12px 40px ${alpha('#d50000', 0.4)}`,
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            Limpiar Disponibilidades
                        </Button>
                        {/* Botón Asignar Empresas Masivamente con mensajes */}
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

                            {/* Mensajes debajo */}
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
                                        </Stack>
                                    </TableCell>
                                ))}
                            </TableRow>
                            {/* NUEVA FILA: Influencers disponibles por día */}

                            <TableRow
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
                                <TableCell
                                    rowSpan={2}
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
                                {/* Columna Turno para la fila de influencers */}
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#FFA500',
                                        verticalAlign: 'middle',
                                        background: 'transparent',
                                        borderBottom: '1px solid #e0e0e0',
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <Avatar
                                            sx={{
                                                background: getTurnoColor('mañana'),
                                                width: 20,
                                                height: 20,
                                                fontSize: '1rem',
                                            }}
                                        >
                                            {getTurnoIcon('mañana')}
                                        </Avatar>
                                        <Typography fontWeight="bold" fontSize="0.80rem">
                                            Mañana
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                {diasSemana.map((dia, idx) => {
                                    const disponiblesManana = influencers.filter((inf) =>
                                        inf.availabilities?.some?.(
                                            (a: any) =>
                                                a.day_of_week?.toLowerCase() === dia.nombre.toLowerCase() && a.turno?.toLowerCase() === 'mañana',
                                        ),
                                    );
                                    return (
                                        <TableCell key={idx} align="center">
                                            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" justifyContent="center">
                                                {disponiblesManana.length > 0 ? (
                                                    disponiblesManana.map((inf) => (
                                                        <Chip
                                                            key={`manana-${inf.id}`}
                                                            label={inf.name.split(' ').slice(0, 2).join(' ')}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.68rem',
                                                                bgcolor: alpha(theme.palette.primary.light, 0.15),
                                                                color: theme.palette.primary.dark,
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
                            <TableRow
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
                                {/* Esta celda está vacía porque la de "Influencers disponibles" tiene rowSpan=2 */}
                                {/* Columna Turno para la fila de influencers */}
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#4A90E2',
                                        verticalAlign: 'middle',
                                        background: 'transparent',
                                        borderBottom: '1px solidrgb(232, 11, 11)',
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <Avatar
                                            sx={{
                                                background: getTurnoColor('tarde'),
                                                width: 20,
                                                height: 20,
                                                fontSize: '1rem',
                                            }}
                                        >
                                            {getTurnoIcon('tarde')}
                                        </Avatar>
                                        <Typography fontWeight="bold" fontSize="0.80rem">
                                            Tarde
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                {diasSemana.map((dia, idx) => {
                                    const disponiblesTarde = influencers.filter((inf) =>
                                        inf.availabilities?.some?.(
                                            (a: any) =>
                                                a.day_of_week?.toLowerCase() === dia.nombre.toLowerCase() && a.turno?.toLowerCase() === 'tarde',
                                        ),
                                    );
                                    return (
                                        <TableCell key={idx} align="center">
                                            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" justifyContent="center">
                                                {disponiblesTarde.length > 0 ? (
                                                    disponiblesTarde.map((inf) => (
                                                        <Chip
                                                            key={`tarde-${inf.id}`}
                                                            label={inf.name.split(' ').slice(0, 2).join(' ')}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.68rem',
                                                                bgcolor: alpha(theme.palette.secondary.light, 0.15),
                                                                color: theme.palette.secondary.dark,
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
                        </TableHead>

                        <TableBody>
                            {empresasFiltradas.map((empresaData, idx) =>
                                ['mañana', 'tarde'].map((turno, turnoIdx) => (
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
                                                rowSpan={2}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    pl: 1,
                                                    verticalAlign: 'middle',
                                                    background: empresaColors[idx % empresaColors.length],
                                                    borderBottom: '1px solid #e0e0e0',
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 5,
                                                    borderRight: '1px solid rgba(224,224,224,0.5)',
                                                }}
                                            >
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: alpha('#fff', 0.3),
                                                            color: theme.palette.text.primary,
                                                            width: 28,
                                                            height: 28,
                                                            fontSize: '1rem',
                                                        }}
                                                    >
                                                        <Business fontSize="small" />
                                                    </Avatar>
                                                    <Typography variant="subtitle2" fontWeight="bold" fontSize="0.90rem">
                                                        {empresaData.empresa.name ?? 'Empresa sin nombre'}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        ) : null}
                                        <TableCell
                                            sx={{
                                                fontWeight: 'bold',
                                                color: turno === 'mañana' ? '#FFA500' : '#4A90E2',
                                                verticalAlign: 'middle',
                                                background: empresaColors[idx % empresaColors.length],
                                                borderBottom: turno === 'mañana' ? '1px solid #e0e0e0' : undefined,
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
                                        {diasSemana.map((dia, j) => {
                                            const turnos = empresaData.disponibilidad[dia.nombre.toLowerCase()] || [];
                                            const tieneDisponibilidad = turnos.includes(turno);

                                            return (
                                                <TableCell
                                                    key={j}
                                                    sx={{
                                                        verticalAlign: 'top',
                                                        px: 1,
                                                        position: 'relative',
                                                        '& .agregar-dia-btn': {
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s',
                                                            pointerEvents: 'none',
                                                        },
                                                        '&:hover .agregar-dia-btn': {
                                                            opacity: 1,
                                                            pointerEvents: 'auto',
                                                        },
                                                    }}
                                                >
                                                    {tieneDisponibilidad ? (
                                                        <Card
                                                            sx={{
                                                                width: '100%',
                                                                background: alpha('#fff', 0.95),
                                                                borderRadius: 1,
                                                                border: `1px solid ${turno === 'mañana' ? alpha('#FFD700', 0.2) : alpha('#4A90E2', 0.2)}`,
                                                                boxShadow: 'none',
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            <CardHeader
                                                                avatar={
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
                                                                }
                                                                title={
                                                                    <Typography variant="subtitle2" fontWeight="bold" fontSize="0.80rem">
                                                                        {turno.charAt(0).toUpperCase() + turno.slice(1)}
                                                                    </Typography>
                                                                }
                                                                action={
                                                                    <Stack direction="row" gap={0.5}>
                                                                        {/* Botón agregar influencer */}
                                                                        <Tooltip title="Agregar Influencer">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() =>
                                                                                    handleOpenModal(
                                                                                        empresaData.empresa.id,
                                                                                        dia.nombre.toLowerCase(),
                                                                                        turno,
                                                                                    )
                                                                                }
                                                                                sx={{
                                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                                    '&:hover': {
                                                                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                                        transform: 'scale(1.1)',
                                                                                    },
                                                                                    width: 24,
                                                                                    height: 24,
                                                                                }}
                                                                            >
                                                                                <Add fontSize="inherit" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        {/* Botón quitar día */}
                                                                        <Tooltip title="Quitar Día">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="error"
                                                                                onClick={async () => {
                                                                                    try {
                                                                                        await axios.post('/quitar-disponibilidad-empresa', {
                                                                                            company_id: empresaData.empresa.id,
                                                                                            day_of_week: dia.nombre.toLowerCase(),
                                                                                            turno,
                                                                                        });
                                                                                        window.location.reload();
                                                                                    } catch (e) {
                                                                                        alert('Error al quitar disponibilidad');
                                                                                    }
                                                                                }}
                                                                                sx={{
                                                                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                                                                    '&:hover': {
                                                                                        bgcolor: alpha(theme.palette.error.main, 0.18),
                                                                                        transform: 'scale(1.1)',
                                                                                    },
                                                                                    width: 24,
                                                                                    height: 24,
                                                                                }}
                                                                            >
                                                                                <Delete fontSize="inherit" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                }
                                                                sx={{ py: 0.5, px: 1 }}
                                                            />
                                                            <CardContent sx={{ pt: 0, px: 1, pb: 1 }}>
                                                                <Stack spacing={0.5}>
                                                                    {(
                                                                        empresaData.influencersAsignados?.[dia.nombre.toLowerCase()]?.[turno] ?? []
                                                                    ).map((influencer, i) => (
                                                                        <Fade key={i} in timeout={400 + i * 80}>
                                                                            <Chip
                                                                                avatar={
                                                                                    <Avatar
                                                                                        sx={{
                                                                                            bgcolor: alpha(
                                                                                                turno === 'mañana' ? '#4caf50' : '#2196f3',
                                                                                                0.15,
                                                                                            ),
                                                                                            width: 18,
                                                                                            height: 18,
                                                                                        }}
                                                                                    >
                                                                                        <Person fontSize="inherit" />
                                                                                    </Avatar>
                                                                                }
                                                                                label={
                                                                                    <span style={{ fontSize: '0.75rem' }}>
                                                                                        {influencer.name.split(' ').slice(0, 2).join(' ')}
                                                                                    </span>
                                                                                }
                                                                                deleteIcon={<Close fontSize="inherit" />}
                                                                                onDelete={() =>
                                                                                    handleQuitarInfluencer(
                                                                                        influencer.bookingId, // <- Necesario para el backend
                                                                                        empresaData.empresa.id,
                                                                                        dia.nombre.toLowerCase(),
                                                                                        turno,
                                                                                        influencer.id,
                                                                                    )
                                                                                }
                                                                                variant="outlined"
                                                                                color={turno === 'mañana' ? 'success' : 'info'}
                                                                                sx={{
                                                                                    borderRadius: 1,
                                                                                    height: 24,
                                                                                    fontSize: '0.75rem',
                                                                                    '& .MuiChip-deleteIcon': {
                                                                                        color: theme.palette.error.main,
                                                                                        '&:hover': {
                                                                                            color: theme.palette.error.dark,
                                                                                        },
                                                                                    },
                                                                                }}
                                                                            />
                                                                        </Fade>
                                                                    ))}
                                                                </Stack>
                                                            </CardContent>
                                                        </Card>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="black"
                                                            className="agregar-dia-btn"
                                                            onClick={async () => {
                                                                try {
                                                                    await axios.post('/agregar-disponibilidad-empresa', {
                                                                        company_id: empresaData.empresa.id,
                                                                        day_of_week: dia.nombre.toLowerCase(),
                                                                        turno,
                                                                    });
                                                                    window.location.reload();
                                                                } catch (e) {
                                                                    alert('Error al agregar disponibilidad');
                                                                }
                                                            }}
                                                            sx={{ fontSize: '0.70rem', borderRadius: 2, minWidth: 0, px: 1, py: 0.5 }}
                                                        >
                                                            Agregar Día
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                )),
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            {/* Modal para agregar influencer */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                        color: '#fff',
                        borderRadius: '8px 8px 0 0',
                        boxShadow: '0 3px 10px rgba(37, 117, 252, 0.3)',
                        fontFamily: "'Poppins', sans-serif",
                    }}
                >
                    <BriefcaseBusinessIcon />
                    Agregar Influencer
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        backgroundColor: '#f9faff',
                        fontFamily: "'Poppins', sans-serif",
                        color: '#333',
                        paddingY: 3,
                    }}
                >
                    <Stack spacing={2}>
                        <Typography sx={{ fontWeight: '600' }}>
                            <strong>Día:</strong> <em>{dayOfWeekInSpanish[selectedTurno?.dia ?? ''] ?? selectedTurno?.dia}</em>
                        </Typography>

                        <Typography sx={{ fontWeight: '600' }}>
                            <strong>Turno:</strong> <em>{selectedTurno?.turno}</em>
                        </Typography>
                        <TextField
                            label="Hora de inicio"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                        />
                        <TextField
                            label="Hora de fin"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }}
                        />

                        {/* Select principal con influencers disponibles */}
                        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                            <InputLabel id="influencer-label">Influencer</InputLabel>
                            <Select
                                labelId="influencer-label"
                                value={selectedInfluencer}
                                label="Influencer"
                                onChange={(e) => setSelectedInfluencer(e.target.value)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                {(() => {
                                    const empresaSeleccionada = datosPorEmpresa.find((e) => e.empresa.id === selectedTurno?.empresaId);
                                    const disponibles =
                                        empresaSeleccionada?.influencersDisponibles?.[selectedTurno?.dia]?.[selectedTurno?.turno] || [];

                                    if (disponibles.length === 0) {
                                        return <MenuItem disabled>No hay influencers disponibles</MenuItem>;
                                    }

                                    return disponibles.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name}
                                        </MenuItem>
                                    ));
                                })()}
                            </Select>
                        </FormControl>

                        {/* Switch para mostrar el segundo select */}
                        <FormControlLabel
                            control={<Switch checked={agregarOtro} onChange={(e) => setAgregarOtro(e.target.checked)} color="primary" />}
                            label="Agregar otro influencer (todos)"
                        />

                        {/* Segundo select con TODOS los influencers */}
                        {agregarOtro && (
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="influencer-extra-label">Influencer adicional</InputLabel>
                                <Select
                                    labelId="influencer-extra-label"
                                    value={selectedInfluencerExtra}
                                    label="Influencer adicional"
                                    onChange={(e) => setSelectedInfluencerExtra(e.target.value)}
                                    sx={{
                                        borderRadius: 2,
                                        backgroundColor: '#fff',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    {influencers.length === 0 ? (
                                        <MenuItem disabled>No hay influencers registrados</MenuItem>
                                    ) : (
                                        influencers.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {user.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        backgroundColor: '#f5f7ff',
                        padding: 2,
                        borderRadius: '0 0 8px 8px',
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={handleCloseModal}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            color: '#6a11cb',
                            '&:hover': { backgroundColor: '#e8e0f7' },
                            borderRadius: 2,
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            boxShadow: '0 4px 15px rgba(37,117,252,0.4)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #4b0eb9, #1a56d0)',
                                boxShadow: '0 6px 20px rgba(37,117,252,0.6)',
                            },
                        }}
                        onClick={async () => {
                            if (!selectedTurno) return;

                            const peticiones = [];

                            if (selectedInfluencer) {
                                peticiones.push(
                                    axios.post('/asignar-influencer', {
                                        empresa_id: selectedTurno.empresaId,
                                        dia: selectedTurno.dia,
                                        turno: selectedTurno.turno,
                                        influencer_id: selectedInfluencer,
                                        start_time: startTime,
                                        end_time: endTime,
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
                                        start_time: startTime,
                                        end_time: endTime,
                                    }),
                                );
                            }

                            if (peticiones.length === 0) {
                                alert('Debes seleccionar al menos un influencer.');
                                return;
                            }

                            try {
                                await Promise.all(peticiones);
                                handleCloseModal();
                                window.location.reload();
                            } catch (error) {
                                console.error('Error al asignar influencer(es):', error);
                                alert('Hubo un error al asignar el influencer.');
                            }
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default Semanainfluencer;
