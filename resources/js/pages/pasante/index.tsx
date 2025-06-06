import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import PendingIcon from '@mui/icons-material/Pending';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Modal,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';

// Tipos para las tareas
type Asignacion = {
    id: number;
    estado: string;
    detalle: string;
    fecha: string;
    tarea: {
        titulo: string;
        descripcion: string;
        prioridad: string; // alta, media, baja
        tipo: { nombre_tipo: string };
        company: { name: string };
    };
};

type Props = {
    tareas: {
        baja?: Asignacion[];
        media?: Asignacion[];
        alta?: Asignacion[];
    };
    filters: {
        search?: string;
    };
};
///'pendiente', 'en_revision', 'publicada'
const estadoOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_revision', label: 'En revision' },
    { value: 'publicada', label: 'Publicada' },
];

// Color de tarjeta por estado
const getEstadoColor = (estado: string) => {
    if (estado === 'publicada') return 'success.main';
    return 'background.paper';
};

const PRIORITY_LABELS = {
    alta: '🔥 Importantes',
    media: '🟡 Normales',
    baja: '🟢 Básicas',
};

// Modal para editar tarea
function EditTaskModal({
    open,
    onClose,
    tarea,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    tarea: Asignacion | null;
    onSave: (id: number, estado: string, detalle: string) => Promise<void>;
}) {
    const [estado, setEstado] = useState<string>(tarea?.estado || 'pendiente'); // Default to 'pendiente'
    const [detalle, setDetalle] = useState<string>(tarea?.detalle || '');
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (tarea) {
            setEstado(tarea.estado);
            setDetalle(tarea.detalle || '');
        }
    }, [tarea]);

    const handleSave = async () => {
        if (!tarea) return;
        setSaving(true);
        await onSave(tarea.id, estado, detalle);
        setSaving(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute' as const,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Editar Estado y Detalle
                </Typography>
                <TextField fullWidth select label="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} sx={{ mb: 2 }}>
                    {estadoOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    label="Detalle"
                    multiline
                    minRows={3}
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button onClick={onClose} disabled={saving}>
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}>
                        Guardar
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}

const PrioritySection = ({ title, items, onEdit }: { title: string; items?: Asignacion[]; onEdit: (item: Asignacion) => void }) => {
    const [showMoreIds, setShowMoreIds] = useState<Set<number>>(new Set());

    if (!items || items.length === 0) return null;

    const toggleShowMore = (id: number) => {
        setShowMoreIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {title}
            </Typography>
            <Grid container spacing={3}>
                {items.map((item) => {
                    const isCompleted = item.estado === 'publicada';
                    const detalleLargo = item.detalle && item.detalle.length > 100;
                    const mostrarDetalle = !detalleLargo || showMoreIds.has(item.id) ? item.detalle : item.detalle?.slice(0, 100) + '...';

                    return (
                        <Grid item xs={12} md={4} key={item.id}>
                            {' '}
                            {/* Modified this line */}
                            <Card
                                sx={{
                                    bgcolor: getEstadoColor(item.estado),
                                    transition: 'background-color 0.3s',
                                    height: '100%', // Make cards take full height of the grid item
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 1,
                                        }}
                                    >
                                        <Typography variant="h6">{item.tarea.titulo}</Typography>
                                        <Tooltip title="Editar Estado y Detalle">
                                            <IconButton onClick={() => onEdit(item)} size="small" color={isCompleted ? 'success' : 'primary'}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.tarea.descripcion}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Box>
                                        {' '}
                                        {/* Changed Typography to Box here */}
                                        <strong>Tipo:</strong> {item.tarea.tipo?.nombre_tipo || 'N/A'} <br />
                                        <strong>Empresa:</strong> {item.tarea.company?.name || 'N/A'} <br />
                                        <strong>Estado:</strong>
                                    </Box>
                                    <Chip
                                        label={item.estado}
                                        color={isCompleted ? 'success' : 'default'}
                                        size="small"
                                        icon={isCompleted ? <CheckCircleIcon /> : <PendingIcon />}
                                    />{' '}
                                    <Box>
                                        <strong>Detalle:</strong> {mostrarDetalle}{' '}
                                        {detalleLargo && (
                                            <Button size="small" onClick={() => toggleShowMore(item.id)} sx={{ textTransform: 'none', ml: 1 }}>
                                                {showMoreIds.has(item.id) ? 'Ver menos' : 'Ver más'}
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default function Pasante({ tareas, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [editTask, setEditTask] = useState<Asignacion | null>(null);
    const [allTareas, setAllTareas] = useState(tareas); // Store all tasks in a single state
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string | null }>({
        type: null,
        message: null,
    });

    // Function to update tasks after editing
    const updateTask = useCallback(
        (id: number, estado: string, detalle: string) => {
            setAllTareas((prevTareas) => {
                const updatedTareas = { ...prevTareas };
                for (const priority in updatedTareas) {
                    if (updatedTareas[priority]) {
                        // Make sure updatedTareas[priority] is not undefined before mapping
                        updatedTareas[priority] =
                            updatedTareas[priority]?.map((task) => {
                                if (task.id === id) {
                                    return { ...task, estado: estado, detalle: detalle };
                                }
                                return task;
                            }) || []; // Ensure that if updatedTareas[priority] is undefined, it defaults to an empty array
                    }
                }
                return updatedTareas;
            });
        },
        [setAllTareas],
    );

    // Filtrar tareas por search (por título)
    const filteredTareas = useMemo(() => {
        const filterFunc = (item: Asignacion) => item.tarea.titulo.toLowerCase().includes(search.toLowerCase());

        return {
            alta: allTareas.alta?.filter(filterFunc) || [],
            media: allTareas.media?.filter(filterFunc) || [],
            baja: allTareas.baja?.filter(filterFunc) || [],
        };
    }, [search, allTareas]);

    // Totales
    const countTotal = (list?: Asignacion[]) => list?.length || 0;
    const countEstado = (list?: Asignacion[], estado: string) => list?.filter((t) => t.estado === estado).length || 0;

    const totalAlta = countTotal(allTareas.alta);
    const totalMedia = countTotal(allTareas.media);
    const totalBaja = countTotal(allTareas.baja);
    const totalCompletadas =
        countEstado(allTareas.alta, 'publicada') + countEstado(allTareas.media, 'publicada') + countEstado(allTareas.baja, 'publicada');
    const totalPendientes = countTotal(allTareas.alta) + countTotal(allTareas.media) + countTotal(allTareas.baja) - totalCompletadas;

    // Función para guardar cambios al editar tarea
    const handleSaveEdit = async (id: number, estado: string, detalle: string) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const res = await fetch(`/pasante/actualizar/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '', // Include the CSRF token
                },
                body: JSON.stringify({ estado, detalle }),
            });

            if (!res.ok) {
                throw new Error('Error actualizando la tarea');
            }

            updateTask(id, estado, detalle);
            setEditTask(null);
            setAlert({ type: 'success', message: 'Tarea actualizada correctamente' });
        } catch (error: any) {
            setAlert({ type: 'error', message: 'Error actualizando la tarea: ' + error.message });
        }
    };

    const breadcrumbs = [{ title: 'Pasante', href: '/pasante' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tareas del Día" />

            <Box sx={{ px: 2, py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Tareas del Día
                </Typography>

                {/* Contadores */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card sx={{ bgcolor: 'error.light' }}>
                            <CardContent>
                                <Typography variant="h6" color="error.main" align="center">
                                    {totalAlta}
                                </Typography>
                                <Typography variant="body2" align="center" fontWeight="bold" color="error.main">
                                    Importantes
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card sx={{ bgcolor: 'warning.light' }}>
                            <CardContent>
                                <Typography variant="h6" color="warning.main" align="center">
                                    {totalMedia}
                                </Typography>
                                <Typography variant="body2" align="center" fontWeight="bold" color="warning.main">
                                    Normales
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Card sx={{ bgcolor: 'info.light' }}>
                            <CardContent>
                                <Typography variant="h6" color="info.main" align="center">
                                    {totalBaja}
                                </Typography>
                                <Typography variant="body2" align="center" fontWeight="bold" color="info.main">
                                    Básicas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: 'success.light' }}>
                            <CardContent>
                                <Typography variant="h6" color="success.main" align="center">
                                    {totalCompletadas}
                                </Typography>
                                <Typography variant="body2" align="center" fontWeight="bold" color="success.main">
                                    Completadas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: 'grey.300' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" color="text.primary">
                                    {totalPendientes}
                                </Typography>
                                <Typography variant="body2" align="center" fontWeight="bold" color="text.primary">
                                    Pendientes
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Buscador */}
                <TextField
                    label="Buscar tareas por título"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 4 }}
                />

                {/* Alert */}
                {alert.type && (
                    <Alert severity={alert.type} sx={{ mb: 2 }}>
                        {alert.message}
                    </Alert>
                )}

                {/* Secciones de tareas por prioridad */}
                <PrioritySection title={PRIORITY_LABELS.alta} items={filteredTareas.alta} onEdit={setEditTask} />
                <PrioritySection title={PRIORITY_LABELS.media} items={filteredTareas.media} onEdit={setEditTask} />
                <PrioritySection title={PRIORITY_LABELS.baja} items={filteredTareas.baja} onEdit={setEditTask} />
            </Box>

            {/* Modal de edición */}
            <EditTaskModal open={!!editTask} onClose={() => setEditTask(null)} tarea={editTask} onSave={handleSaveEdit} />
        </AppLayout>
    );
}
