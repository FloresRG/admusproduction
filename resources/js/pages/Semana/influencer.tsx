import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Add, Business, Close, NightsStay, Person, PictureAsPdf, Schedule, WbSunny } from '@mui/icons-material';
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
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import axios from 'axios';
import { BriefcaseBusinessIcon } from 'lucide-react';
import { useState } from 'react';

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
    const {
        datosPorEmpresa: datosPorEmpresaProp,
        diasSemana,
        influencers,
    } = usePage<{
        datosPorEmpresa: EmpresaConDisponibilidad[];
        diasSemana: DiaSemana[];
        influencers: Influencer[];
    }>().props;
    const [datosPorEmpresa, setDatosPorEmpresa] = useState(datosPorEmpresaProp);

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

    const handleQuitarInfluencer = async (empresaId: number, dia: string, turno: string, influencerId: number) => {
        setLoading(true);
        try {
            await axios.post('/quitar-influencer', {
                empresa_id: empresaId,
                dia,
                turno,
                influencer_id: influencerId,
            });

            // Actualiza el estado local para reflejar el cambio sin recargar
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
        });
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
                    }}
                >
                    <Table sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                                    '& th': {
                                        color: '#fff',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        py: 2,
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            right: 0,
                                            top: '20%',
                                            height: '60%',
                                            width: '1px',
                                            background: alpha('#fff', 0.2),
                                        },
                                    },
                                }}
                            >
                                <TableCell sx={{ width: 200, pl: 3 }}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 32, height: 32 }}>
                                            <Business fontSize="small" />
                                        </Avatar>
                                        Empresa
                                    </Stack>
                                </TableCell>

                                {diasSemana.map((dia, idx) => (
                                    <TableCell key={idx} align="center">
                                        <Stack alignItems="center" gap={0.5}>
                                            <Avatar sx={{ bgcolor: alpha('#fff', 0.2), width: 32, height: 32 }}>
                                                <Schedule fontSize="small" />
                                            </Avatar>
                                            <Typography fontWeight="bold" fontSize="0.9rem">
                                                {dayOfWeekInSpanish[dia.nombre.toLowerCase()] ?? dia.nombre}
                                            </Typography>
                                            <Chip
                                                label={formatDate(dia.fecha)}
                                                size="small"
                                                sx={{
                                                    bgcolor: alpha('#fff', 0.2),
                                                    color: '#fff',
                                                    fontSize: '0.7rem',
                                                    height: 20,
                                                }}
                                            />
                                        </Stack>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {datosPorEmpresa.map((empresaData, idx) => (
                                <TableRow
                                    sx={{
                                        background: empresaColors[idx % empresaColors.length],
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'scale(1.01)',
                                            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                                            zIndex: 1,
                                        },
                                        '& td': {
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: '0.9rem',
                                            py: 2,
                                        },
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 'bold', pl: 3 }}>
                                        <Stack direction="row" alignItems="center" gap={2}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: alpha('#fff', 0.3),
                                                    color: theme.palette.text.primary,
                                                    width: 40,
                                                    height: 40,
                                                }}
                                            >
                                                <Business />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {empresaData.empresa.name ?? 'Empresa sin nombre'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>

                                    {diasSemana.map((dia, j) => {
                                        const turnos = empresaData.disponibilidad[dia.nombre.toLowerCase()] || [];

                                        return (
                                            <TableCell key={j} sx={{ verticalAlign: 'top', px: 2 }}>
                                                <Stack spacing={2} alignItems="center">
                                                    {turnos.includes('mañana') && (
                                                        <Card
                                                            sx={{
                                                                width: '100%',
                                                                background: alpha('#fff', 0.9),
                                                                backdropFilter: 'blur(10px)',
                                                                borderRadius: 2,
                                                                border: `2px solid ${alpha('#FFD700', 0.3)}`,
                                                            }}
                                                        >
                                                            <CardHeader
                                                                avatar={
                                                                    <Avatar
                                                                        sx={{
                                                                            background: getTurnoColor('mañana'),
                                                                            width: 32,
                                                                            height: 32,
                                                                        }}
                                                                    >
                                                                        {getTurnoIcon('mañana')}
                                                                    </Avatar>
                                                                }
                                                                title={
                                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                                        Turno Mañana
                                                                    </Typography>
                                                                }
                                                                action={
                                                                    <Tooltip title="Agregar Influencer">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                handleOpenModal(
                                                                                    empresaData.empresa.id,
                                                                                    dia.nombre.toLowerCase(),
                                                                                    'mañana',
                                                                                )
                                                                            }
                                                                            sx={{
                                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                                '&:hover': {
                                                                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                                    transform: 'scale(1.1)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Add fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }
                                                                sx={{ py: 1, px: 2 }}
                                                            />
                                                            <CardContent sx={{ pt: 0, px: 2, pb: 2 }}>
                                                                <Stack spacing={1}>
                                                                    {(
                                                                        empresaData.influencersAsignados?.[dia.nombre.toLowerCase()]?.['mañana'] ?? []
                                                                    ).map((influencer, i) => (
                                                                        <Fade key={i} in timeout={500 + i * 100}>
                                                                            <Chip
                                                                                avatar={
                                                                                    <Avatar sx={{ bgcolor: alpha('#4caf50', 0.2) }}>
                                                                                        <Person fontSize="small" />
                                                                                    </Avatar>
                                                                                }
                                                                                label={influencer.name}
                                                                                deleteIcon={<Close fontSize="small" />}
                                                                                onDelete={() =>
                                                                                    handleQuitarInfluencer(
                                                                                        empresaData.empresa.id,
                                                                                        dia.nombre.toLowerCase(),
                                                                                        'mañana',
                                                                                        influencer.id,
                                                                                    )
                                                                                }
                                                                                variant="outlined"
                                                                                color="success"
                                                                                sx={{
                                                                                    borderRadius: 2,
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
                                                    )}

                                                    {turnos.includes('tarde') && (
                                                        <Card
                                                            sx={{
                                                                width: '100%',
                                                                background: alpha('#fff', 0.9),
                                                                backdropFilter: 'blur(10px)',
                                                                borderRadius: 2,
                                                                border: `2px solid ${alpha('#4A90E2', 0.3)}`,
                                                            }}
                                                        >
                                                            <CardHeader
                                                                avatar={
                                                                    <Avatar
                                                                        sx={{
                                                                            background: getTurnoColor('tarde'),
                                                                            width: 32,
                                                                            height: 32,
                                                                        }}
                                                                    >
                                                                        {getTurnoIcon('tarde')}
                                                                    </Avatar>
                                                                }
                                                                title={
                                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                                        Turno Tarde
                                                                    </Typography>
                                                                }
                                                                action={
                                                                    <Tooltip title="Agregar Influencer">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                handleOpenModal(
                                                                                    empresaData.empresa.id,
                                                                                    dia.nombre.toLowerCase(),
                                                                                    'tarde',
                                                                                )
                                                                            }
                                                                            sx={{
                                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                                '&:hover': {
                                                                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                                    transform: 'scale(1.1)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <Add fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }
                                                                sx={{ py: 1, px: 2 }}
                                                            />
                                                            <CardContent sx={{ pt: 0, px: 2, pb: 2 }}>
                                                                <Stack spacing={1}>
                                                                    {(
                                                                        empresaData.influencersAsignados?.[dia.nombre.toLowerCase()]?.['tarde'] ?? []
                                                                    ).map((influencer, i) => (
                                                                        <Fade key={i} in timeout={500 + i * 100}>
                                                                            <Chip
                                                                                avatar={
                                                                                    <Avatar sx={{ bgcolor: alpha('#2196f3', 0.2) }}>
                                                                                        <Person fontSize="small" />
                                                                                    </Avatar>
                                                                                }
                                                                                label={influencer.name}
                                                                                deleteIcon={<Close fontSize="small" />}
                                                                                onDelete={() =>
                                                                                    handleQuitarInfluencer(
                                                                                        empresaData.empresa.id,
                                                                                        dia.nombre.toLowerCase(),
                                                                                        'tarde',
                                                                                        influencer.id,
                                                                                    )
                                                                                }
                                                                                variant="outlined"
                                                                                color="info"
                                                                                sx={{
                                                                                    borderRadius: 2,
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
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
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
