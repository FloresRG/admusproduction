import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Add, Business, Close, Person } from '@mui/icons-material';
import {
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
    FormControl,
    IconButton,
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
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useMemo, useState } from 'react';

const SemanaPasantes = () => {
    const { datosPorEmpresa: datosPorEmpresaProp, diasSemana, pasantes } = usePage().props;

    const [datosPorEmpresa, setDatosPorEmpresa] = useState(datosPorEmpresaProp);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState(null);
    const [selectedPasante, setSelectedPasante] = useState('');
    const [loading, setLoading] = useState(false);

    // Filtrado de empresas por nombre
    const empresasFiltradas = useMemo(() => {
        if (!search.trim()) return datosPorEmpresa;
        const normalizar = (str) =>
            str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();
        return datosPorEmpresa.filter((empresaData) => normalizar(empresaData.empresa.name || '').includes(normalizar(search)));
    }, [search, datosPorEmpresa]);

    const dayOfWeekInSpanish = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    const getTurnoColor = (turno) => {
        switch (turno) {
            case 'mañana':
                return '#FFD700';
            case 'tarde':
                return '#4A90E2';
            case 'noche':
                return '#8E44AD';
            default:
                return '#999';
        }
    };

    const handleOpenModal = (empresaId, dia, turno) => {
        setSelectedTurno({ empresaId, dia, turno });
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTurno(null);
        setSelectedPasante('');
    };

    const handleAsignarPasante = async () => {
        if (!selectedTurno || !selectedPasante) {
            alert('Debes seleccionar un pasante.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/asignar-pasante', {
                empresa_id: selectedTurno.empresaId,
                dia: selectedTurno.dia,
                turno: selectedTurno.turno,
                pasante_id: selectedPasante,
            });
            handleCloseModal();
            window.location.reload();
        } catch (error) {
            console.error('Error al asignar pasante:', error);
            alert(error.response?.data?.message || 'Error al asignar pasante.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuitarPasante = async (empresaId, dia, turno, pasanteId) => {
        setLoading(true);
        try {
            await axios.post('/quitar-pasante', {
                empresa_id: empresaId,
                dia,
                turno,
                pasante_id: pasanteId,
            });

            // Actualizar estado local
            setDatosPorEmpresa((prev) =>
                prev.map((empresa) =>
                    empresa.empresa.id === empresaId
                        ? {
                              ...empresa,
                              pasantesAsignados: {
                                  ...empresa.pasantesAsignados,
                                  [dia]: {
                                      ...empresa.pasantesAsignados[dia],
                                      [turno]: empresa.pasantesAsignados[dia][turno].filter((p) => p.id !== pasanteId),
                                  },
                              },
                          }
                        : empresa,
                ),
            );
        } catch (error) {
            console.error('Error al quitar pasante:', error);
            alert('Error al quitar el pasante');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
        });
    };

    const getTotalPasantesAsignados = () => {
        return datosPorEmpresa.reduce((total, empresa) => {
            return (
                total +
                Object.values(empresa.pasantesAsignados).reduce((empresaTotal, dia) => {
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

    return (
        <AppLayout>
            <Box p={3}>
                {/* Header */}
                <Box mb={4}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>
                                📋 Gestión Semanal - Pasantes
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Asignación de pasantes por empresa y turno
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                            <TextField
                                label="Buscar empresa"
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ minWidth: 280 }}
                            />
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Card>
                                <CardContent sx={{ py: 1.5, px: 2, textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight="bold" color="primary">
                                        {datosPorEmpresa.length}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Empresas
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent sx={{ py: 1.5, px: 2, textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight="bold" color="secondary">
                                        {getTotalPasantesAsignados()}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Asignados
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Stack>
                </Box>

                {/* Tabla Principal */}
                <Paper elevation={2} sx={{ overflowX: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Empresa</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Turno</TableCell>
                                {diasSemana.map((dia, idx) => (
                                    <TableCell key={idx} align="center" sx={{ fontWeight: 'bold' }}>
                                        <Stack alignItems="center" gap={0.5}>
                                            <Typography fontWeight="bold" fontSize="0.9rem">
                                                {dayOfWeekInSpanish[dia.nombre.toLowerCase()] ?? dia.nombre}
                                            </Typography>
                                            <Chip label={formatDate(dia.fecha)} size="small" variant="outlined" />
                                        </Stack>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {empresasFiltradas.map((empresaData, idx) =>
                                ['mañana', 'tarde', 'noche'].map((turno, turnoIdx) => (
                                    <TableRow key={`${empresaData.empresa.id}-${turno}`}>
                                        {turnoIdx === 0 ? (
                                            <TableCell
                                                rowSpan={3}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    verticalAlign: 'middle',
                                                    backgroundColor: '#fafafa',
                                                }}
                                            >
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Business />
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {empresaData.empresa.name}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        ) : null}

                                        <TableCell sx={{ fontWeight: 'bold', color: getTurnoColor(turno) }}>
                                            <Typography fontWeight="bold">{turno.charAt(0).toUpperCase() + turno.slice(1)}</Typography>
                                        </TableCell>

                                        {diasSemana.map((dia, j) => (
                                            <TableCell key={j} sx={{ verticalAlign: 'top', px: 1 }}>
                                                <Card variant="outlined" sx={{ minHeight: 60 }}>
                                                    <CardHeader
                                                        title={
                                                            <Typography variant="caption" fontWeight="bold">
                                                                {turno.charAt(0).toUpperCase() + turno.slice(1)}
                                                            </Typography>
                                                        }
                                                        action={
                                                            <Tooltip title="Agregar Pasante">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleOpenModal(empresaData.empresa.id, dia.nombre.toLowerCase(), turno)
                                                                    }
                                                                >
                                                                    <Add fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        sx={{ py: 0.5, px: 1 }}
                                                    />
                                                    <CardContent sx={{ pt: 0, px: 1, pb: 1 }}>
                                                        <Stack spacing={0.5}>
                                                            {(empresaData.pasantesAsignados?.[dia.nombre.toLowerCase()]?.[turno] ?? []).map(
                                                                (pasante, i) => (
                                                                    <Chip
                                                                        key={i}
                                                                        avatar={<Person />}
                                                                        label={pasante.name.split(' ')[0]}
                                                                        deleteIcon={<Close />}
                                                                        onDelete={() =>
                                                                            handleQuitarPasante(
                                                                                empresaData.empresa.id,
                                                                                dia.nombre.toLowerCase(),
                                                                                turno,
                                                                                pasante.id,
                                                                            )
                                                                        }
                                                                        variant="outlined"
                                                                        size="small"
                                                                        sx={{
                                                                            borderColor: getTurnoColor(turno),
                                                                            color: getTurnoColor(turno),
                                                                        }}
                                                                    />
                                                                ),
                                                            )}
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )),
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            {/* Modal para agregar pasante */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Agregar Pasante</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={2}>
                        <Typography>
                            <strong>Día:</strong> {dayOfWeekInSpanish[selectedTurno?.dia ?? ''] ?? selectedTurno?.dia}
                        </Typography>
                        <Typography>
                            <strong>Turno:</strong> {selectedTurno?.turno}
                        </Typography>

                        <FormControl fullWidth>
                            <InputLabel>Pasante</InputLabel>
                            <Select value={selectedPasante} label="Pasante" onChange={(e) => setSelectedPasante(e.target.value)}>
                                {pasantes.length === 0 ? (
                                    <MenuItem disabled>No hay pasantes registrados</MenuItem>
                                ) : (
                                    pasantes.map((pasante) => (
                                        <MenuItem key={pasante.id} value={pasante.id}>
                                            {pasante.name}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancelar</Button>
                    <Button variant="contained" onClick={handleAsignarPasante} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default SemanaPasantes;
