import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles y Permisos',
        href: '/roles-permissions',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[]; // Puede ser undefined o un array vacío
}

export default function RolesPermissions() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editRoleId, setEditRoleId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para el buscador
    const [selectedRows, setSelectedRows] = useState<number[]>([]); // Para checkboxes de la tabla
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = () => {
        axios.get('/api/roles')
            .then(response => setRoles(response.data))
            .catch(error => console.error('Error fetching roles:', error));
    };

    const fetchPermissions = () => {
        axios.get('/api/permissions')
            .then(response => setAllPermissions(response.data))
            .catch(error => console.error('Error fetching permissions:', error));
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setNewRoleName('');
        setSelectedPermissions([]);
        setShowModal(true);
    };

    const openEditModal = (role: Role) => {
        setIsEditMode(true);
        setEditRoleId(role.id);
        setNewRoleName(role.name);
        setSelectedPermissions(role.permissions?.map(p => p.name) || []); // Asegurarse de que no sea undefined
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!newRoleName.trim()) return alert('El nombre del rol es obligatorio');

        setLoading(true);
        const payload = { name: newRoleName, permissions: selectedPermissions };

        const request = isEditMode
            ? axios.put(`/roles/${editRoleId}`, payload)
            : axios.post('/create/roles', payload);

        request
            .then(() => {
                setShowModal(false);
                setNewRoleName('');
                setSelectedPermissions([]);
                fetchRoles();
            })
            .catch(error => {
                console.error('Error guardando el rol:', error);
                alert('Hubo un error');
            })
            .finally(() => setLoading(false));
    };

    const handleDeleteRole = (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este rol?')) return;

        axios.delete(`/roles/${id}`)
            .then(() => fetchRoles())
            .catch(error => {
                console.error('Error al eliminar el rol:', error);
                alert('Hubo un error al eliminar el rol');
            });
    };

    // Filtrar roles por nombre
    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar selección de filas
    const handleRowCheckbox = (roleId: number) => {
        setSelectedRows(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    // Checkbox de cabecera (seleccionar todos)
    const handleHeaderCheckbox = () => {
        if (selectedRows.length === filteredRoles.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredRoles.map(role => role.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles y Permisos" />

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
                        Nuevo Rol
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
                                        checked={filteredRoles.length > 0 && selectedRows.length === filteredRoles.length}
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < filteredRoles.length}
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
                                    Permisos
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
                            {filteredRoles.map((role) => (
                                <TableRow key={role.id} hover>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={selectedRows.includes(role.id)}
                                            onChange={() => handleRowCheckbox(role.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{role.name}</TableCell>
                                    <TableCell>
                                        {role.permissions && role.permissions.length > 0 ? (
                                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                {role.permissions.map((p) => (
                                                    <li key={p.id}>{p.name}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="italic text-gray-400">No tiene permisos asignados</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => openEditModal(role)}
                                            aria-label="Editar"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteRole(role.id)}
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

            {/* Modal mejorado con Material UI */}
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {isEditMode ? 'Editar Rol' : 'Crear Nuevo Rol'}
                    </Typography>
                    <IconButton onClick={() => setShowModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Nombre del rol"
                        variant="outlined"
                        fullWidth
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Permisos
                    </Typography>
                    <FormGroup sx={{ maxHeight: 200, overflowY: 'auto', pl: 1 }}>
                        {allPermissions.map((perm) => (
                            <FormControlLabel
                                key={perm.id}
                                control={
                                    <Checkbox
                                        checked={selectedPermissions.includes(perm.name)}
                                        onChange={(e) => {
                                            const { checked } = e.target;
                                            setSelectedPermissions(prev =>
                                                checked
                                                    ? [...prev, perm.name]
                                                    : prev.filter(p => p !== perm.name)
                                            );
                                        }}
                                        value={perm.name}
                                    />
                                }
                                label={perm.name}
                            />
                        ))}
                    </FormGroup>
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
