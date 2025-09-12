import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { Add, Business, Close, Delete, Person } from '@mui/icons-material';
import {
    Alert,
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
    Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Company {
    id: number;
    name: string;
}

interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface Asignacion {
    id: number;
    user_id: number;
    company_id: number;
    turno: string;
    dia: string;
    fecha: string;
    user: User;
    company: Company;
}

interface PageProps {
    companies: Company[];
    pasantes: User[];
    asignaciones: Record<string, Record<string, Record<string, Asignacion[]>>>;
    currentWeek: Week;
    weeks: Week[];
    diasSemana: string[];
    turnos: string[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const SemanaPasantes = () => {
    const { companies, pasantes, asignaciones, currentWeek, weeks, diasSemana, turnos, flash, filters } = usePage<PageProps>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
    const [selectedTurno, setSelectedTurno] = useState<string>('');
    const [selectedDia, setSelectedDia] = useState<string>('');
    const [selectedPasante, setSelectedPasante] = useState<number | null>(null);
    const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek.id);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState(filters?.search || '');

    // NUEVO: Estado para rastrear la celda sobre la que está el mouse
    const [hoveredCell, setHoveredCell] = useState<{ companyId: number; turno: string; dia: string } | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            '/semana-pasantes',
            {
                week_id: currentWeek.id,
                search: value,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Calcular fechas de la semana
    const weekDates = useMemo(() => {
        const startDate = new Date(currentWeek.start_date);
        const dates: Record<string, string> = {};

        diasSemana.forEach((dia, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);
            dates[dia] = date.toISOString().split('T')[0];
        });

        return dates;
    }, [currentWeek, diasSemana]);

    const handleOpenModal = (companyId: number, turno: string, dia: string) => {
        setSelectedCompany(companyId);
        setSelectedTurno(turno);
        setSelectedDia(dia);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedCompany(null);
        setSelectedTurno('');
        setSelectedDia('');
        setSelectedPasante(null);
    };

    const handleSubmit = async () => {
        if (!selectedPasante || !selectedCompany || !selectedTurno || !selectedDia) {
            return;
        }

        setLoading(true);

        try {
            await router.post('/asignacion-pasantes', {
                user_id: selectedPasante,
                company_id: selectedCompany,
                turno: selectedTurno,
                dia: selectedDia,
                week_id: selectedWeek,
                fecha: weekDates[selectedDia],
            });

            handleCloseModal();
        } catch (error) {
            console.error('Error al asignar pasante:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAsignacion = async (asignacionId: number) => {
        if (confirm('¿Estás seguro de eliminar esta asignación?')) {
            try {
                await router.delete(`/asignacion-pasantes/${asignacionId}`);
            } catch (error) {
                console.error('Error al eliminar asignación:', error);
            }
        }
    };

    const handleWeekChange = (weekId: number) => {
        setSelectedWeek(weekId);
        router.get('/semana-pasantes', { week_id: weekId });
    };

    const getAsignacionesByCompanyTurnoDia = (companyId: number, turno: string, dia: string): Asignacion[] => {
        return asignaciones[companyId]?.[turno]?.[dia] || [];
    };
    const handleGeneratePdf = async () => {
        try {
            // Se usa window.open para que el navegador maneje la descarga del PDF
            // Esto es más simple que manejar la respuesta binaria con fetch
            window.open('/generar-pdf-disponibilidad', '_blank');
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            // Opcional: mostrar un mensaje de error al usuario
            alert('Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.');
        }
    };
    const getFirstName = (fullName: string) => {
        return fullName.split(' ')[0];
    };
    return (
        <AppLayout>
            <Box sx={{ p: 3 }}>
                <Card>
                    <CardHeader
                        title={`Gestión de Camarografos - ${currentWeek.name}`}
                        action={
                            <Stack direction="row" spacing={2}>
                                {/* BOTÓN PARA GENERAR PDF */}
                                <Button variant="contained" color="success" onClick={handleGeneratePdf}>
                                    Generar PDF
                                </Button>

                                {/* CAMPO DE BÚSQUEDA EXISTENTE */}
                                <TextField
                                    size="small"
                                    label="Buscar empresa"
                                    variant="outlined"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </Stack>
                        }
                    />

                    <CardContent>
                        {flash?.success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                {flash.success}
                            </Alert>
                        )}

                        {flash?.error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {flash.error}
                            </Alert>
                        )}

                        <Paper sx={{ maxHeight: '600px', overflow: 'auto' }}>
                            
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                width: 150,
                                                fontWeight: 'bold',
                                                position: 'sticky',
                                                left: 0,
                                                top: 0, // AÑADIDO para fijarlo también en la parte superior
                                                zIndex: 11, // Mayor zIndex para que quede encima
                                                bgcolor: 'background.paper',
                                            }}
                                        >
                                            <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Empresa
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                width: 100,
                                                fontWeight: 'bold',
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 10,
                                                bgcolor: 'background.paper',
                                            }}
                                        >
                                            Turno
                                        </TableCell>
                                        {diasSemana.map((dia) => (
                                            <TableCell
                                                key={dia}
                                                sx={{
                                                    minWidth: 150,
                                                    fontWeight: 'bold',
                                                    position: 'sticky',
                                                    top: 0,
                                                    zIndex: 9,
                                                    bgcolor: 'background.paper',
                                                }}
                                            >
                                                {dia.charAt(0).toUpperCase() + dia.slice(1)}
                                                <br />
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(
                                                        new Date(weekDates[dia]).setDate(new Date(weekDates[dia]).getDate() + 1),
                                                    ).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {companies.map((company) =>
                                        turnos.map((turno, turnoIndex) => (
                                            <TableRow key={`${company.id}-${turno}`}>
                                                {turnoIndex === 0 && (
                                                    <TableCell
                                                        rowSpan={turnos.length}
                                                        sx={{
                                                            verticalAlign: 'top',
                                                            borderRight: 1,
                                                            borderRightColor: 'divider',
                                                            position: 'sticky', // Esto la hace estática
                                                            left: 0, // La pega al lado izquierdo
                                                            zIndex: 5, // Un zIndex menor que el encabezado, pero mayor que el resto de celdas
                                                            bgcolor: 'background.paper', // Fondo para que no se vea transparente
                                                        }}
                                                    >
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {company.name}
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                                <TableCell sx={{ fontWeight: 'medium' }}>
                                                    <Chip
                                                        label={turno.charAt(0).toUpperCase() + turno.slice(1)}
                                                        size="small"
                                                        color={turno === 'mañana' ? 'primary' : turno === 'tarde' ? 'secondary' : 'default'}
                                                    />
                                                </TableCell>
                                                {diasSemana.map((dia) => {
                                                    const asignacionesCelda = getAsignacionesByCompanyTurnoDia(company.id, turno, dia);

                                                    // NUEVO: Comprobar si la celda actual es la celda sobre la que se pasa el mouse
                                                    const isHovered =
                                                        hoveredCell?.companyId === company.id &&
                                                        hoveredCell?.turno === turno &&
                                                        hoveredCell?.dia === dia;

                                                    return (
                                                        // NUEVO: Añadir onMouseEnter y onMouseLeave a la celda
                                                        <TableCell
                                                            key={dia}
                                                            sx={{ verticalAlign: 'top' }}
                                                            onMouseEnter={() => setHoveredCell({ companyId: company.id, turno, dia })}
                                                            onMouseLeave={() => setHoveredCell(null)}
                                                        >
                                                            <Stack spacing={1}>
                                                                {asignacionesCelda.map((asignacion) => (
                                                                    <Box
                                                                        key={asignacion.id}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                            bgcolor: 'grey.100',
                                                                            p: 1,
                                                                            borderRadius: 1,
                                                                            fontSize: '0.875rem',
                                                                        }}
                                                                    >
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Person sx={{ fontSize: 16, mr: 0.5 }} />
                                                                            <Typography variant="body2">
                                                                                {getFirstName(asignacion.user.name)}
                                                                            </Typography>
                                                                        </Box>
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => handleDeleteAsignacion(asignacion.id)}
                                                                        >
                                                                            <Delete sx={{ fontSize: 16 }} />
                                                                        </IconButton>
                                                                    </Box>
                                                                ))}

                                                                {/* CAMBIO: Renderizar el botón solo si la celda está en hover o si ya hay asignaciones (opcional) */}
                                                                {(isHovered || asignacionesCelda.length === 0) && (
                                                                    <Button
                                                                        size="small"
                                                                        startIcon={<Add />}
                                                                        variant="outlined"
                                                                        sx={{
                                                                            mt: 1,
                                                                            // NUEVO: Estilo para la transición de visibilidad.
                                                                            opacity: isHovered ? 1 : 0,
                                                                            transition: 'opacity 0.2s ease-in-out',
                                                                        }}
                                                                        onClick={() => handleOpenModal(company.id, turno, dia)}
                                                                    >
                                                                        Agregar
                                                                    </Button>
                                                                )}
                                                            </Stack>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        )),
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    </CardContent>
                </Card>

                {/* Modal para agregar pasante */}
                <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Agregar Camarografo
                        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <Typography variant="body1">
                                <strong>Empresa:</strong> {companies.find((c) => c.id === selectedCompany)?.name}
                                <br />
                                <strong>Turno:</strong> {selectedTurno}
                                <br />
                                <strong>Día:</strong> {selectedDia}
                                <br />
                            </Typography>

                            <FormControl fullWidth>
                                <InputLabel>Seleccionar Camarografo</InputLabel>
                                <Select
                                    value={selectedPasante || ''}
                                    label="Seleccionar Camarografo"
                                    onChange={(e) => setSelectedPasante(e.target.value as number)}
                                >
                                    {pasantes.map((pasante) => (
                                        <MenuItem key={pasante.id} value={pasante.id}>
                                            {pasante.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit} variant="contained" disabled={!selectedPasante || loading}>
                            {loading ? 'Asignando...' : 'Asignar Camarografo'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AppLayout>
    );
};

export default SemanaPasantes;
