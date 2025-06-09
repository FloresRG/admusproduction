import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import BusinessIcon from '@mui/icons-material/Business';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import axios from 'axios';
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
    const { datosPorEmpresa, diasSemana, influencers } = usePage<{
        datosPorEmpresa: EmpresaConDisponibilidad[];
        diasSemana: DiaSemana[];
        influencers: Influencer[];
    }>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState<{
        empresaId: number;
        dia: string;
        turno: string;
    } | null>(null);
    const [selectedInfluencer, setSelectedInfluencer] = useState<number | ''>('');

    const rowColors = [
        'linear-gradient(90deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(90deg, #fad0c4 0%, #ffd1ff 100%)',
        'linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(90deg, #cfd9df 0%, #e2ebf0 100%)',
        'linear-gradient(90deg, #fdfbfb 0%, #ebedee 100%)',
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

    const handleOpenModal = (empresaId: number, dia: string, turno: string) => {
        setSelectedTurno({ empresaId, dia, turno });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTurno(null);
        setSelectedInfluencer('');
    };
    const handleQuitarInfluencer = async (empresaId: number, dia: string, turno: string, influencerId: number) => {
        try {
            await axios.post('/quitar-influencer', {
                empresa_id: empresaId,
                dia,
                turno,
                influencer_id: influencerId,
            });

            // Recarga para actualizar la vista (puedes optimizar haciendo un state update)
            window.location.reload();
        } catch (error) {
            console.error('Error al quitar influencer:', error);
            alert('Hubo un error al quitar el influencer');
        }
    };

    return (
        <AppLayout>
            <Box p={3}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    📅 Disponibilidad Semanal por Empresa
                </Typography>

                <Paper elevation={3} sx={{ overflowX: 'auto', borderRadius: 3 }}>
                    <Table sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                                    color: '#fff',
                                    '& th': {
                                        color: '#fff',
                                        borderRight: '1px solid rgba(255,255,255,0.3)',
                                        fontFamily: "'Poppins', sans-serif",
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                    },
                                }}
                            >
                                <TableCell sx={{ width: 200, pl: 2 }}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <BusinessIcon />
                                        Empresa
                                    </Stack>
                                </TableCell>

                                {diasSemana.map((dia, idx) => (
                                    <TableCell key={idx} sx={{ borderRight: '1px solid rgba(255,255,255,0.3)' }}>
                                        <Stack direction="row" alignItems="center" gap={1}>
                                            <WbSunnyIcon fontSize="small" />
                                            <Box>
                                                <Typography fontWeight="bold" fontSize="0.9rem" fontFamily="'Poppins', sans-serif">
                                                    {dayOfWeekInSpanish[dia.nombre.toLowerCase()] ?? dia.nombre}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                    {dia.fecha}
                                                </Typography>
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
                                        borderBottom: '2px solid #ddd',
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd',
                                            cursor: 'pointer',
                                        },
                                        '& td': {
                                            borderRight: '1px solid #ddd',
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: '0.9rem',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 'bold', pl: 2 }}>{empresaData.empresa.name ?? 'Empresa sin nombre'}</TableCell>

                                    {diasSemana.map((dia, j) => {
                                        const turnos = empresaData.disponibilidad[dia.nombre.toLowerCase()] || [];

                                        return (
                                            <TableCell key={j} sx={{ verticalAlign: 'top' }}>
                                                <Stack direction="column" spacing={1} alignItems="center">
                                                    {turnos.includes('mañana') && (
                                                        <Stack direction="column" spacing={0.5} alignItems="center" width="100%" sx={{ mb: 1 }}>
                                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                                                <Chip
                                                                    icon={<WbSunnyIcon fontSize="small" />}
                                                                    label="Mañana"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: '#42a5f5',
                                                                        color: '#fff',
                                                                        fontWeight: 'bold',
                                                                        px: 1.5,
                                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                                                                        borderRadius: 2,
                                                                    }}
                                                                />
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleOpenModal(empresaData.empresa.id, dia.nombre.toLowerCase(), 'mañana')
                                                                    }
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: '600',
                                                                        borderRadius: 2,
                                                                    }}
                                                                >
                                                                    Agregar
                                                                </Button>
                                                            </Stack>

                                                            {(empresaData.influencersAsignados?.[dia.nombre.toLowerCase()]?.['mañana'] ?? []).map(
                                                                (influencer, i) => (
                                                                    <Stack key={i} direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                                                                        <Typography variant="caption" sx={{ color: '#2e7d32' }}>
                                                                            ✅ {influencer.name}
                                                                        </Typography>
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            color="error"
                                                                            onClick={() =>
                                                                                handleQuitarInfluencer(
                                                                                    empresaData.empresa.id,
                                                                                    dia.nombre.toLowerCase(),
                                                                                    'mañana',
                                                                                    influencer.id,
                                                                                )
                                                                            }
                                                                            sx={{
                                                                                textTransform: 'none',
                                                                                fontSize: '0.7rem',
                                                                                borderRadius: 1,
                                                                            }}
                                                                        >
                                                                            Quitar
                                                                        </Button>
                                                                    </Stack>
                                                                ),
                                                            )}
                                                        </Stack>
                                                    )}

                                                    {turnos.includes('tarde') && (
                                                        <Stack direction="column" spacing={0.5} alignItems="center" width="100%">
                                                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                                                <Chip
                                                                    icon={<WbSunnyIcon fontSize="small" />}
                                                                    label="Tarde"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: '#ab47bc',
                                                                        color: '#fff',
                                                                        fontWeight: 'bold',
                                                                        px: 1.5,
                                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                                                                        borderRadius: 2,
                                                                    }}
                                                                />
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleOpenModal(empresaData.empresa.id, dia.nombre.toLowerCase(), 'tarde')
                                                                    }
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: '600',
                                                                        borderRadius: 2,
                                                                    }}
                                                                >
                                                                    Agregar
                                                                </Button>
                                                            </Stack>

                                                            {(empresaData.influencersAsignados?.[dia.nombre.toLowerCase()]?.['tarde'] ?? []).map(
                                                                (influencer, i) => (
                                                                    <Stack key={i} direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                                                                        <Typography variant="caption" sx={{ color: '#6a1b9a' }}>
                                                                            ✅ {influencer.name}
                                                                        </Typography>
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            color="error"
                                                                            onClick={() =>
                                                                                handleQuitarInfluencer(
                                                                                    empresaData.empresa.id,
                                                                                    dia.nombre.toLowerCase(),
                                                                                    'tarde',
                                                                                    influencer.id,
                                                                                )
                                                                            }
                                                                            sx={{
                                                                                textTransform: 'none',
                                                                                fontSize: '0.7rem',
                                                                                borderRadius: 1,
                                                                            }}
                                                                        >
                                                                            Quitar
                                                                        </Button>
                                                                    </Stack>
                                                                ),
                                                            )}
                                                        </Stack>
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
                    <BusinessIcon />
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
                            if (selectedTurno && selectedInfluencer) {
                                try {
                                    await axios.post('/asignar-influencer', {
                                        empresa_id: selectedTurno.empresaId,
                                        dia: selectedTurno.dia,
                                        turno: selectedTurno.turno,
                                        influencer_id: selectedInfluencer,
                                    });

                                    handleCloseModal();
                                    window.location.reload(); // opcional
                                } catch (error) {
                                    console.error('Error al asignar influencer:', error);
                                    alert('Hubo un error al asignar el influencer');
                                }
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
