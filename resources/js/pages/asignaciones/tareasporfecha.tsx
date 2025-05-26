// resources/js/pages/Asignaciones/TareasPorFecha.tsx
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Checkbox,
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
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

type Asignacion = {
    id: string;
    estado: string;
    detalle: string;
    tarea: { id: string; titulo: string };
    user: { id: string; name: string; email: string };
};

type TareaOption = { id: string; titulo: string };

export default function TareasPorFecha() {
    const { fecha, tareasAsignadas, todasTareas } = usePage<{
        fecha: string;
        tareasAsignadas: Asignacion[];
        todasTareas: TareaOption[];
    }>().props;

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');

    // Formulario Inertia para crear
    const form = useForm({
        tarea_id: '',
        estado: '',
        detalle: '',
    });

    // Usuarios únicos y filtrados
    const usuarios = useMemo(() => {
        const map = new Map<string, { id: string; name: string; email: string }>();
        tareasAsignadas.forEach((a) => map.set(a.user.id, a.user));
        return Array.from(map.values());
    }, [tareasAsignadas]);

    const usuariosFiltrados = usuarios.filter((u) => u.name.toLowerCase().includes(searchText) || u.email.toLowerCase().includes(searchText));

    // Tareas ya asignadas de usuario y fecha
    const tareasFiltradas = selectedUserId ? tareasAsignadas.filter((a) => a.user.id === selectedUserId) : [];

    return (
        <AppLayout>
            <Head title="Tareas Asignadas por Día" />
            <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Link href={route('asignaciones.fechas')}>← Volver a Fechas</Link>
                    <Typography variant="h4">Tareas – {dayjs(fecha).format('DD MMM YYYY')}</Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* Usuarios + Buscador */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6">Usuarios</Typography>
                        <TextField
                            fullWidth
                            placeholder="Buscar usuario"
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setSelectedUserId(null);
                            }}
                            size="small"
                            sx={{ mb: 2 }}
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
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedUserId === u.id} />
                                            </TableCell>
                                            <TableCell>{u.name}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Tareas y Form para Agregar */}
                    <Grid item xs={12} md={8}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">
                                {selectedUserId ? `Tareas de ${usuarios.find((u) => u.id === selectedUserId)?.name}` : 'Seleccione un usuario'}
                            </Typography>
                            {/* Botón Agregar, solo si hay usuario */}
                            {selectedUserId && (
                                <Button variant="contained" onClick={() => form.setData('tarea_id', '')}>
                                    Agregar Tarea
                                </Button>
                            )}
                        </Box>

                        {/* Formulario inline para crear asignación */}
                        {selectedUserId && (
                            <Box
                                component="form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    form.post(route('asignaciones.store', { fecha, user: selectedUserId }));
                                }}
                                sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}
                            >
                                <FormControl size="small">
                                    <InputLabel id="tarea-label">Tarea</InputLabel>
                                    <Select
                                        labelId="tarea-label"
                                        label="Tarea"
                                        value={form.data.tarea_id}
                                        onChange={(e) => form.setData('tarea_id', e.target.value)}
                                        required
                                    >
                                        {todasTareas.map((t) => (
                                            <MenuItem key={t.id} value={t.id}>
                                                {t.titulo}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Estado"
                                    size="small"
                                    value={form.data.estado}
                                    onChange={(e) => form.setData('estado', e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Detalle"
                                    size="small"
                                    value={form.data.detalle}
                                    onChange={(e) => form.setData('detalle', e.target.value)}
                                />
                                <Button type="submit" variant="contained" disabled={form.processing}>
                                    Guardar
                                </Button>
                            </Box>
                        )}

                        {/* Tabla de tareas asignadas */}
                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
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
                                    {tareasFiltradas.map((a) => (
                                        <TableRow key={a.id} hover>
                                            <TableCell>{a.tarea.titulo}</TableCell>
                                            <TableCell>{a.estado}</TableCell>
                                            <TableCell>{a.detalle}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        if (confirm('¿Eliminar asignación?')) {
                                                            Inertia.delete(route('asignaciones.destroy', a.id));
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Box>
        </AppLayout>
    );
}
