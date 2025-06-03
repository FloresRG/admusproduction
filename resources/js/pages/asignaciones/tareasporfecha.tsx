// resources/js/pages/Asignaciones/TareasPorFecha.tsx
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

type Asignacion = {
    id: number;
    estado: string;
    detalle: string;
    tarea: { id: number; titulo: string };
    user: { id: string; name: string; email: string };
};

type TareaOption = { id: number; titulo: string };

export default function TareasPorFecha() {
    const { fecha, tareasAsignadas, todasTareas } = usePage<{
        fecha: string;
        tareasAsignadas: Asignacion[];
        todasTareas: TareaOption[];
    }>().props;

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');

    // Inertia form para crear nueva asignación
    const form = useForm({
        tarea_id: null as number | null,
        estado: 'pendiente',
        detalle: '',
    });

    // Usuarios únicos extraídos de las asignaciones
    const usuarios = useMemo(() => {
        const map = new Map<string, Asignacion['user']>();
        tareasAsignadas.forEach((a) => map.set(a.user.id, a.user));
        return Array.from(map.values());
    }, [tareasAsignadas]);

    // Filtrado de usuarios por nombre/email
    const usuariosFiltrados = usuarios.filter(
        (u) => u.name.toLowerCase().includes(searchText.toLowerCase()) || u.email.toLowerCase().includes(searchText.toLowerCase()),
    );

    // Sólo las tareas del usuario y fecha seleccionados
    const tareasFiltradas = selectedUserId ? tareasAsignadas.filter((a) => a.user.id === selectedUserId) : [];

    // Actualiza sólo el estado sin recargar
    const handleEstadoChange = (id: number, nuevoEstado: string) => {
        Inertia.patch(route('asignaciones.update', id), { estado: nuevoEstado }, { preserveScroll: true, preserveState: true });
    };

    // Nueva función para actualizar SOLO el 'detalle'
    const handleDetalleChange = (id: number, nuevoDetalle: string) => {
        Inertia.patch(route('asignaciones.update', id), { detalle: nuevoDetalle }, { preserveScroll: true, preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Tareas Asignadas por Día" />

            <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Link href={route('asignaciones.fechas')}>← Volver a Fechas</Link>
                    <Typography variant="h4">Tareas – {dayjs(fecha).format('DD MMM YYYY')}</Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* =============================================== */}
                    {/* Columna izquierda: LISTA DE USUARIOS (md=4)     */}
                    {/* =============================================== */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6">Usuarios</Typography>
                        <TextField
                            fullWidth
                            placeholder="Buscar usuario"
                            size="small"
                            sx={{ mb: 2 }}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setSelectedUserId(null);
                            }}
                        />

                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox" />
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usuariosFiltrados.map((u) => (
                                        <TableRow
                                            key={u.id}
                                            hover
                                            selected={selectedUserId === u.id}
                                            onClick={() => setSelectedUserId((prev) => (prev === u.id ? null : u.id))}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">{selectedUserId === u.id && <Typography>✓</Typography>}</TableCell>
                                            <TableCell>{u.name}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* =============================================== */}
                    {/* Columna derecha: INFORMACIÓN DE TAREAS (md=8)    */}
                    {/* =============================================== */}
                    <Grid item xs={12} md={8}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">
                                {selectedUserId ? `Tareas de ${usuarios.find((u) => u.id === selectedUserId)?.name}` : 'Seleccione un usuario'}
                            </Typography>
                        </Box>

                        {/* Formulario inline para crear nueva asignación */}
                        {selectedUserId && (
                            <Box
                                component="form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    form.post(route('asignaciones.store', { fecha, user: selectedUserId }), {
                                        preserveScroll: true,
                                        preserveState: true,
                                        onSuccess: () => form.reset(),
                                    });
                                }}
                                sx={{
                                    mb: 2,
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                }}
                            >
                                {/* Autocomplete para buscar tarea */}
                                <Autocomplete
                                    options={todasTareas}
                                    getOptionLabel={(t) => t.titulo}
                                    size="small"
                                    sx={{ width: 250 }}
                                    value={todasTareas.find((t) => t.id === form.data.tarea_id) || null}
                                    onChange={(_, v) => form.setData('tarea_id', v?.id || null)}
                                    renderInput={(params) => <TextField {...params} label="Buscar tarea" required />}
                                />

                                {/* Select para estado */}
                                <FormControl size="small" sx={{ width: 160 }}>
                                    <InputLabel id="estado-label">Estado</InputLabel>
                                    <Select
                                        labelId="estado-label"
                                        label="Estado"
                                        value={form.data.estado}
                                        onChange={(e) => form.setData('estado', e.target.value)}
                                        required
                                    >
                                        {['pendiente', 'en_revision', 'publicada'].map((opt) => (
                                            <MenuItem key={opt} value={opt}>
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* TextField para 'detalle' */}
                                <TextField
                                    label="Detalle"
                                    size="small"
                                    value={form.data.detalle}
                                    onChange={(e) => form.setData('detalle', e.target.value)}
                                    sx={{ width: 250 }}
                                />

                                <Button variant="contained" type="submit" disabled={form.processing}>
                                    Añadir
                                </Button>
                            </Box>
                        )}

                        {/* Tabla de tareas asignadas (editable) */}
                        <TableContainer component={Paper} sx={{ maxHeight: 360 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Título</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Detalle</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tareasFiltradas.length > 0 ? (
                                        tareasFiltradas.map((a) => (
                                            <TableRow key={a.id} hover>
                                                {/* Columna Título */}
                                                <TableCell>{a.tarea.titulo}</TableCell>

                                                {/* Columna Estado (editable) */}
                                                <TableCell>
                                                    <FormControl size="small" fullWidth>
                                                        <Select
                                                            value={a.estado}
                                                            onChange={(e) => handleEstadoChange(a.id, e.target.value as string)}
                                                            sx={{ minWidth: 120 }}
                                                        >
                                                            {['pendiente', 'en_revision', 'publicada'].map((opt) => (
                                                                <MenuItem key={opt} value={opt}>
                                                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>

                                                {/* Columna Detalle (editable) */}
                                                <TableCell>
                                                    <TextField
                                                        defaultValue={a.detalle}
                                                        size="small"
                                                        fullWidth
                                                        onBlur={(e) => {
                                                            const valor = e.target.value;
                                                            if (valor !== a.detalle) {
                                                                handleDetalleChange(a.id, valor);
                                                            }
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* Columna Acciones (eliminar) */}
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            if (confirm('¿Eliminar asignación?')) {
                                                                Inertia.delete(route('asignaciones.destroy', a.id), {
                                                                    preserveScroll: true,
                                                                    preserveState: true,
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No hay tareas para este usuario en esta fecha.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Box>
        </AppLayout>
    );
}
