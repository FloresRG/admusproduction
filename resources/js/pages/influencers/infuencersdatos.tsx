import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

import {
    Alert,
    Box,
    Checkbox,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    cantidad: number;
};

interface PageProps {
    users: User[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs = [
    {
        title: 'Listado de influencers',
        href: '/infuencersdatos',
    },
];

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
}
function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilized = array.map((el, idx) => [el, idx] as [T, number]);
    stabilized.sort((a, b) => {
        const cmp = comparator(a[0], b[0]);
        if (cmp !== 0) return cmp;
        return a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
}

export default function InfluencersDatos() {
    const theme = useTheme();
    const { users, flash } = usePage<PageProps>().props;
    const [rowData, setRowData] = useState<User[]>(users);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string | number>('');
    const [notification, setNotification] = useState<string | null>(null);

    // Sorting & Selecting state
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('id');
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Actualizar rowData cuando cambien los usuarios (después de operaciones)
    useEffect(() => {
        setRowData(users);
    }, [users]);

    // Manejar mensajes flash
    useEffect(() => {
        if (flash?.success) {
            setNotification(flash.success);
        } else if (flash?.error) {
            setNotification(flash.error);
        }
    }, [flash]);

    // Eliminar usuario
    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
        
        router.delete(`/infuencersdatos/${id}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Editar el campo cantidad y manejar la creación de un nuevo dato si no existe
    const handleEditField = (id: number, field: string, value: string | number) => {
        setEditingId(id);
        setEditingField(field);
        setEditingValue(value);
        if (field === 'cantidad' && !value) {
            setEditingValue(0);
        }
    };

    // Guardar la edición de un campo
    const saveEditField = async () => {
        if (editingValue.toString().trim() === '') {
            setNotification('El campo no puede estar vacío.');
            return;
        }

        const updatedField = {
            [editingField!]: editingValue,
        };

        router.put(`/infuencersdatos/${editingId}`, updatedField, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Actualizar el estado local inmediatamente para mejor UX
                setRowData((prev) => 
                    prev.map((user) => 
                        user.id === editingId 
                            ? { ...user, [editingField!]: editingValue } 
                            : user
                    )
                );
                setEditingId(null);
                setEditingField(null);
                setEditingValue('');
            },
            onError: () => {
                setNotification('Hubo un error al actualizar el campo');
            }
        });
    };

    // Filtrado de búsqueda
    const filtered = useMemo(
        () => rowData.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || String(user.id).includes(search)),
        [rowData, search],
    );

    // Ordenación estable + paginación
    const sortedData = useMemo(() => stableSort(filtered, getComparator(order, orderBy)), [filtered, order, orderBy]);
    const paginatedData = useMemo(() => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [sortedData, page, rowsPerPage]);

    // Sorting & selecting handlers
    const handleRequestSort = (property: keyof User) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(filtered.map((u) => u.id));
        } else {
            setSelected([]);
        }
    };
    const handleClickRow = (id: number) => {
        setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
    };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    // Eliminar múltiples usuarios seleccionados
    const handleDeleteSelected = () => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar ${selected.length} usuario${selected.length > 1 ? 's' : ''}?`)) return;
        
        // Eliminar uno por uno (puedes optimizar esto en el backend para eliminar múltiples)
        selected.forEach((id) => {
            router.delete(`/infuencersdatos/${id}`, {
                preserveState: true,
                preserveScroll: true,
            });
        });
        
        setSelected([]); // Limpiar selección
    };

    // Notificaciones
    useEffect(() => {
        if (!notification) return;
        const t = setTimeout(() => setNotification(null), 4000);
        return () => clearTimeout(t);
    }, [notification]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Influencer" />

            <Typography variant="h4" color="primary" gutterBottom>
                Agregar la cantidad de videos que tendrá el influencer
            </Typography>

            {/* Buscador */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField
                    label="Buscar por nombre o ID"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ maxWidth: 320 }}
                    InputProps={{
                        startAdornment: (
                            <IconButton tabIndex={-1}>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Box>

            {/* Toolbar selección */}
            {selected.length > 0 && (
                <Toolbar sx={{ bgcolor: 'action.selected', mb: 1, borderRadius: 2 }}>
                    <Typography sx={{ flex: '1 1 100%' }} color="inherit">
                        {selected.length} seleccionado{selected.length > 1 ? 's' : ''}
                    </Typography>
                    <IconButton color="error" onClick={handleDeleteSelected}>
                        <DeleteIcon />
                    </IconButton>
                </Toolbar>
            )}

            {/* Tabla */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    overflowX: 'auto',
                    border: '1px solid #e0e0e0',
                    background: theme.palette.background.paper,
                    mx: { xs: 0, md: 2 },
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                padding="checkbox"
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.common.white,
                                }}
                            >
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < filtered.length}
                                    checked={filtered.length > 0 && selected.length === filtered.length}
                                    onChange={handleSelectAllClick}
                                    sx={{ color: theme.palette.common.white }}
                                />
                            </TableCell>
                            <TableCell
                                sortDirection={orderBy === 'id' ? order : false}
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.common.white,
                                }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('id')}
                                    sx={{ color: theme.palette.common.white, '&.Mui-active': { color: theme.palette.common.white } }}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                sortDirection={orderBy === 'name' ? order : false}
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.common.white,
                                }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                    sx={{ color: theme.palette.common.white, '&.Mui-active': { color: theme.palette.common.white } }}
                                >
                                    Nombre
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                sortDirection={orderBy === 'email' ? order : false}
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.common.white,
                                }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'email'}
                                    direction={orderBy === 'email' ? order : 'asc'}
                                    onClick={() => handleRequestSort('email')}
                                    sx={{ color: theme.palette.common.white, '&.Mui-active': { color: theme.palette.common.white } }}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                sortDirection={orderBy === 'cantidad' ? order : false}
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.common.white,
                                }}
                            >
                                <TableSortLabel
                                    active={orderBy === 'cantidad'}
                                    direction={orderBy === 'cantidad' ? order : 'asc'}
                                    onClick={() => handleRequestSort('cantidad')}
                                    sx={{ color: theme.palette.common.white, '&.Mui-active': { color: theme.palette.common.white } }}
                                >
                                    Cantidad de videos asignados
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.common.white,
                                }}
                            >
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => {
                            const isItemSelected = isSelected(row.id);
                            return (
                                <TableRow hover key={row.id} selected={isItemSelected} onClick={() => handleClickRow(row.id)}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isItemSelected} />
                                    </TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>
                                        {editingId === row.id && editingField === 'name' ? (
                                            <TextField
                                                value={editingValue}
                                                size="small"
                                                autoFocus
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onBlur={saveEditField}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEditField();
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                            />
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EditIcon
                                                    fontSize="small"
                                                    color="action"
                                                    sx={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditField(row.id, 'name', row.name);
                                                    }}
                                                />
                                                <span
                                                    onDoubleClick={() => handleEditField(row.id, 'name', row.name)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Doble click para editar"
                                                >
                                                    {row.name}
                                                </span>
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === row.id && editingField === 'email' ? (
                                            <TextField
                                                value={editingValue}
                                                size="small"
                                                autoFocus
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onBlur={saveEditField}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEditField();
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                            />
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EditIcon
                                                    fontSize="small"
                                                    color="action"
                                                    sx={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditField(row.id, 'email', row.email);
                                                    }}
                                                />
                                                <span
                                                    onDoubleClick={() => handleEditField(row.id, 'email', row.email)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Doble click para editar"
                                                >
                                                    {row.email}
                                                </span>
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === row.id && editingField === 'cantidad' ? (
                                            <TextField
                                                type="number"
                                                value={editingValue}
                                                size="small"
                                                autoFocus
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onBlur={saveEditField}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEditField();
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                            />
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EditIcon
                                                    fontSize="small"
                                                    color="action"
                                                    sx={{ cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditField(row.id, 'cantidad', row.cantidad);
                                                    }}
                                                />
                                                <span
                                                    onDoubleClick={() => handleEditField(row.id, 'cantidad', row.cantidad)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Doble click para editar"
                                                >
                                                    {row.cantidad}
                                                </span>
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            sx={{ mr: 1 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.visit(`/users/${row.id}/photos/upload`);
                                            }}
                                        >
                                            Subir foto
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(row.id);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filtered.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Filas por página"
                />
            </TableContainer>

            {/* Snackbar Notificación */}
            <Snackbar open={!!notification} message={notification} onClose={() => setNotification(null)} autoHideDuration={4000} />
        </AppLayout>
    );
}