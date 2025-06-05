import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import BusinessIcon from '@mui/icons-material/Business';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import axios from 'axios'; 
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
import { useState } from 'react';

type Empresa = {
    id: number;
    name?: string;
};

type EmpresaConDisponibilidad = {
    empresa: Empresa;
    disponibilidad: {
        [day: string]: string[];
    };
};

type DiaSemana = {
    nombre: string;
    fecha: string;
};

type Influencer = {
    id: number;
    name: string;
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
        'linear-gradient(135deg, #e3f2fd, #bbdefb)',
        'linear-gradient(135deg, #fce4ec, #f8bbd0)',
        'linear-gradient(135deg, #ede7f6, #d1c4e9)',
        'linear-gradient(135deg, #f1f8e9, #dcedc8)',
        'linear-gradient(135deg, #fff3e0, #ffe0b2)',
        'linear-gradient(135deg, #e0f7fa, #b2ebf2)',
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

    return (
        <AppLayout>
            <Box p={3}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    📅 Disponibilidad Semanal por Empresa
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
                                        const turnos = empresaData.disponibilidad[dia.nombre.toLowerCase()] || [];

                                        return (
                                            <TableCell key={j}>
                                                <Stack direction="column" spacing={0.5} alignItems="center">
                                                    {turnos.includes('mañana') && (
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Chip
                                                                label="Mañana"
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: theme.palette.info.light,
                                                                    color: '#fff',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleOpenModal(empresaData.empresa.id, dia.nombre.toLowerCase(), 'mañana')
                                                                }
                                                            >
                                                                Agregar
                                                            </Button>
                                                        </Stack>
                                                    )}
                                                    {turnos.includes('tarde') && (
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Chip
                                                                label="Tarde"
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: theme.palette.secondary.main,
                                                                    color: '#fff',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() =>
                                                                    handleOpenModal(empresaData.empresa.id, dia.nombre.toLowerCase(), 'tarde')
                                                                }
                                                            >
                                                                Agregar
                                                            </Button>
                                                        </Stack>
                                                    )}
                                                    {turnos.length === 0 && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            —
                                                        </Typography>
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
                <DialogTitle sx={{ fontWeight: 'bold' }}>Agregar Influencer</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <Typography>
                            <strong>Día:</strong> {selectedTurno?.dia}
                        </Typography>
                        <Typography>
                            <strong>Turno:</strong> {selectedTurno?.turno}
                        </Typography>

                        <FormControl fullWidth>
                            <InputLabel id="influencer-label">Influencer</InputLabel>
                            <Select
                                labelId="influencer-label"
                                value={selectedInfluencer}
                                label="Influencer"
                                onChange={(e) => setSelectedInfluencer(e.target.value)}
                            >
                                {influencers.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            if (selectedTurno && selectedInfluencer) {
                                try {
                                    await axios.post('/asignar-influencer', {
                                        empresa_id: selectedTurno.empresaId,
                                        dia: selectedTurno.dia,
                                        turno: selectedTurno.turno,
                                        influencer_id: selectedInfluencer,
                                    });

                                    // Cerrar modal al éxito
                                    handleCloseModal();

                                    // Recargar datos desde el servidor si es necesario
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
