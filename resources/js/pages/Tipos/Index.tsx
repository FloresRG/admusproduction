import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Add as AddIcon,
    AssignmentInd as AssignmentIndIcon,
    Close as CloseIcon,
    Label as LabelIcon,
    Person as PersonIcon,
    Search as SearchIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {
    Alert,
    Autocomplete,
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Grow,
    IconButton,
    InputAdornment,
    Modal,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Tipo {
    id: number;
    nombre_tipo: string;
}

interface Props {
    users: User[];
    tipos: Tipo[];
}

export default function Tipos({ users, tipos: initialTipos }: Props) {
    const [search, setSearch] = useState('');
    const [openTipoModal, setOpenTipoModal] = useState(false);
    const [openUserModal, setOpenUserModal] = useState(false);
    const [newTipo, setNewTipo] = useState('');
    const [tipos, setTipos] = useState<Tipo[]>(initialTipos);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userTipos, setUserTipos] = useState<number[]>([]);
    const [loadingUserTipos, setLoadingUserTipos] = useState(false);
    const [savingUserTipos, setSavingUserTipos] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    // Filtrar usuarios por búsqueda
    const filteredUsers = users.filter(
        (user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()),
    );

    // Modal para crear tipo
    const handleOpenTipoModal = () => setOpenTipoModal(true);
    const handleCloseTipoModal = () => {
        setOpenTipoModal(false);
        setNewTipo('');
    };

    // Crear nuevo tipo
    const handleCreateTipo = async () => {
        if (!newTipo.trim()) return;
        try {
            const res = await axios.post('/tipos', { nombre_tipo: newTipo });
            setTipos((prev) => [...prev, res.data.tipo]);
            setSnackbar({ open: true, message: 'Tipo creado con éxito', severity: 'success' });
            handleCloseTipoModal();
        } catch {
            setSnackbar({ open: true, message: 'Error al crear tipo', severity: 'error' });
        }
    };

    // Modal para asignar tipos a usuario
    const handleOpenUserModal = async (user: User) => {
        setSelectedUser(user);
        setLoadingUserTipos(true);
        try {
            const res = await axios.get(`/tipos/${user.id}/tipos`);
            setUserTipos(res.data.map((t: Tipo) => t.id));
        } catch {
            setUserTipos([]);
        }
        setLoadingUserTipos(false);
        setOpenUserModal(true);
    };
    const handleCloseUserModal = () => {
        setOpenUserModal(false);
        setSelectedUser(null);
        setUserTipos([]);
    };

    // Agregar o quitar tipo del usuario
    const toggleTipoForUser = (tipoId: number) => {
        setUserTipos((prev) => (prev.includes(tipoId) ? prev.filter((id) => id !== tipoId) : [...prev, tipoId]));
    };

    // Guardar tipos asignados al usuario
    const handleSaveUserTipos = async () => {
        if (!selectedUser) return;
        setSavingUserTipos(true);
        try {
            await axios.put(`/tipos/${selectedUser.id}/tipos`, { tipos: userTipos });
            setSnackbar({ open: true, message: 'Tipos actualizados', severity: 'success' });
            handleCloseUserModal();
        } catch {
            setSnackbar({ open: true, message: 'Error al actualizar tipos', severity: 'error' });
        }
        setSavingUserTipos(false);
    };

    const chipColors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];
    const handleDeleteTipo = async (tipoId: number) => {
        if (!window.confirm('¿Seguro que deseas eliminar este tipo?')) return;
        try {
            await axios.delete(`/tipos/${tipoId}`);
            setTipos((prev) => prev.filter((t) => t.id !== tipoId));
            setSnackbar({ open: true, message: 'Tipo eliminado con éxito', severity: 'success' });
        } catch {
            setSnackbar({ open: true, message: 'Error al eliminar tipo', severity: 'error' });
        }
    };
    return (
        <AppLayout breadcrumbs={[{ title: 'Tipos', href: '/tipos' }]}>
            <Head title="Tipos" />
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom color="primary.main" sx={{ letterSpacing: 1 }}>
                    <AssignmentIndIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 36 }} />
                    Gestión de Personal
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack
                    direction="row"
                    spacing={2} // Más separación entre chips
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ mb: 2, gap: 2 }} // gap adicional para separación vertical
                >
                    {tipos.map((tipo, idx) => (
                        <Grow in key={tipo.id} timeout={400 + idx * 80}>
                            <Box display="flex" alignItems="center">
                                <Chip
                                    icon={<LabelIcon />}
                                    label={tipo.nombre_tipo}
                                    color={chipColors[idx % chipColors.length] as any}
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: 15,
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        px: 2,
                                        py: 1,
                                        mb: 1,
                                    }}
                                />
                                <IconButton
                                    aria-label="Eliminar tipo"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDeleteTipo(tipo.id)}
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Grow>
                    ))}
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenTipoModal}
                    sx={{
                        ml: 1,
                        height: 40,
                        borderRadius: 2,
                        boxShadow: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                    }}
                >
                    Nuevo Tipo
                </Button>
            </Box>

            {/* Modal crear tipo */}
            <Modal open={openTipoModal} onClose={handleCloseTipoModal} closeAfterTransition BackdropProps={{ timeout: 500 }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                    }}
                >
                    <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                        <LabelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Crear Nuevo Tipo
                    </Typography>
                    <TextField
                        label="Nombre del Tipo"
                        variant="outlined"
                        fullWidth
                        value={newTipo}
                        onChange={(e) => setNewTipo(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCreateTipo}
                        disabled={!newTipo.trim()}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                        Crear
                    </Button>
                </Box>
            </Modal>

            {/* Buscador */}
            <TextField
                label="Buscar Personl"
                variant="outlined"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}
            />

            {/* Usuarios */}
            <Grid container spacing={4}>
                {filteredUsers.map((user, idx) => (
                    <Grow in key={user.id} timeout={400 + idx * 80}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                elevation={6}
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: 6,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'scale(1.025)', boxShadow: 12 },
                                    mb: 2,
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <CardContent>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'primary.main',
                                                width: 48,
                                                height: 48,
                                                fontWeight: 700,
                                                fontSize: 22,
                                                boxShadow: 2,
                                            }}
                                        >
                                            <PersonIcon fontSize="large" />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight={700} color="text.primary">
                                                {user.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                                <CardActions sx={{ pt: 0 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenUserModal(user)}
                                        fullWidth
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            py: 1,
                                            letterSpacing: 0.5,
                                        }}
                                        startIcon={<AssignmentIndIcon />}
                                    >
                                        Gestionar Tipos
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grow>
                ))}
            </Grid>

            {/* Modal asignar tipos a usuario */}
            <Modal open={openUserModal} onClose={handleCloseUserModal} closeAfterTransition BackdropProps={{ timeout: 500 }}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 440,
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Tipos de {selectedUser?.name}
                        </Typography>
                        <IconButton onClick={handleCloseUserModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {loadingUserTipos ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {/* Select con buscador para agregar tipo */}
                            <Autocomplete
                                options={tipos.filter((tipo) => !userTipos.includes(tipo.id))}
                                getOptionLabel={(option) => option.nombre_tipo}
                                renderInput={(params) => <TextField {...params} label="Agregar tipo" variant="outlined" />}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.nombre_tipo}
                                    </li>
                                )}
                                onChange={(_, value) => {
                                    if (value) toggleTipoForUser(value.id);
                                }}
                                sx={{ mb: 3 }}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                noOptionsText="No hay tipos para agregar"
                            />
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                                Tipos asignados
                            </Typography>
                            <Stack spacing={1} sx={{ mb: 2 }}>
                                {tipos
                                    .filter((tipo) => userTipos.includes(tipo.id))
                                    .map((tipo, idx) => (
                                        <Grow in key={tipo.id} timeout={400 + idx * 60}>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'primary.light',
                                                    borderRadius: 2,
                                                    px: 2,
                                                    py: 1,
                                                    bgcolor: 'primary.50',
                                                    boxShadow: 1,
                                                }}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: 'primary.light',
                                                            width: 32,
                                                            height: 32,
                                                            fontSize: 18,
                                                        }}
                                                    >
                                                        <LabelIcon fontSize="small" />
                                                    </Avatar>
                                                    <Typography fontWeight={600}>{tipo.nombre_tipo}</Typography>
                                                </Stack>
                                                <Tooltip title="Quitar tipo">
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => toggleTipoForUser(tipo.id)}
                                                        sx={{ borderRadius: 2, fontWeight: 600 }}
                                                    >
                                                        Quitar
                                                    </Button>
                                                </Tooltip>
                                            </Box>
                                        </Grow>
                                    ))}
                                {tipos.filter((tipo) => userTipos.includes(tipo.id)).length === 0 && (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No hay tipos asignados.
                                    </Typography>
                                )}
                            </Stack>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveUserTipos}
                                disabled={savingUserTipos}
                                fullWidth
                                sx={{ borderRadius: 2, fontWeight: 700, py: 1.2, fontSize: 16 }}
                                startIcon={<AssignmentIndIcon />}
                            >
                                {savingUserTipos ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>

            {/* Snackbar mensajes */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppLayout>
    );
}
