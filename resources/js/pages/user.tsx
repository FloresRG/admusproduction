import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    useTheme,
    useMediaQuery,
    Checkbox,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    FormGroup,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios y Roles',
        href: '/users-roles',
    },
];

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

export default function UsersPermissions() {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = () => {
        axios
            .get('/api/users')
            .then((response) => setUsers(response.data))
            .catch((error) => console.error('Error fetching users:', error));
    };

    const fetchRoles = () => {
        axios
            .get('/api/roles')
            .then((response) => setRoles(response.data))
            .catch((error) => console.error('Error fetching roles:', error));
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setSelectedRole('');
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setIsEditMode(true);
        setEditUserId(user.id);
        setNewUserName(user.name);
        setNewUserEmail(user.email);
        setSelectedRole(user.roles[0]?.name || '');
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!newUserName.trim() || !newUserEmail.trim() || (!isEditMode && !newUserPassword.trim()) || !selectedRole) {
            return alert('Todos los campos son obligatorios');
        }

        setLoading(true);

        const payload = {
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
            role: selectedRole,
        };

        const request = isEditMode ? axios.put(`/users/${editUserId}`, payload) : axios.post('/users', payload);

        request
            .then(() => {
                setShowModal(false);
                fetchUsers();
            })
            .catch((error) => {
                console.error('Error guardando el usuario:', error);
                alert('Hubo un error');
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteUser = (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

        axios
            .delete(`/users/${id}`)
            .then(() => fetchUsers())
            .catch((error) => {
                console.error('Error al eliminar el usuario:', error);
                alert('Hubo un error al eliminar el usuario');
            });
    };

    // Filtrar usuarios por nombre o email
    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar selección de filas
    const handleRowCheckbox = (userId: number) => {
        setSelectedRows((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    // Checkbox de cabecera (seleccionar todos)
    const handleHeaderCheckbox = () => {
        if (selectedRows.length === filteredUsers.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredUsers.map((u) => u.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios y Roles" />

            <Box sx={{ padding: 2 }}>
                {/* Buscador */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ marginRight: 2 }}
                        InputProps={{
                            startAdornment: (
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                        onClick={openCreateModal}
                        startIcon={<EditIcon />}
                    >
                        Nuevo Usuario
                    </Button>
                </Box>

                {/* Tabla */}
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        overflowX: 'auto',
                        maxHeight: 'calc(100vh - 200px)',
                    }}
                >
                    <Table stickyHeader sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={filteredUsers.length > 0 && selectedRows.length === filteredUsers.length}
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < filteredUsers.length}
                                        onChange={handleHeaderCheckbox}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    Nombre
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    Rol
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.common.white,
                                        padding: isMobile ? '8px' : '16px',
                                        fontSize: isMobile ? '0.875rem' : '1rem',
                                    }}
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={selectedRows.includes(user.id)}
                                            onChange={() => handleRowCheckbox(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.roles && user.roles.length > 0
                                            ? user.roles.map((r) => r.name).join(', ')
                                            : <span className="italic text-gray-400">Sin rol</span>}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => openEditModal(user)}
                                            aria-label="Editar"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteUser(user.id)}
                                            aria-label="Eliminar"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Modal Material UI */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </Typography>
                    <IconButton onClick={() => setShowModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Nombre del usuario"
                        variant="outlined"
                        fullWidth
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Email del usuario"
                        variant="outlined"
                        fullWidth
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {!isEditMode && (
                        <TextField
                            label="Contraseña"
                            variant="outlined"
                            fullWidth
                            type="password"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    )}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="select-role-label">Rol</InputLabel>
                        <Select
                            labelId="select-role-label"
                            value={selectedRole || ''}
                            label="Rol"
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Seleccionar rol</em>
                            </MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.name}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowModal(false)}
                        color="inherit"
                        variant="outlined"
                        disabled={loading}
                        startIcon={<CloseIcon />}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
}
