// src/pages/categories/Index.tsx

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    Box,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

type Category = {
    id: number;
    name: string;
};

const breadcrumbs = [{ title: 'Categorías', href: '/categories' }];

// Helpers de ordenación
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

export default function Index({ categories }: { categories: Category[] }) {
    const theme = useTheme();
    // Datos y CRUD
    const [rowData, setRowData] = useState<Category[]>(categories);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [search, setSearch] = useState('');

    // Sorting & Selecting state
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Category>('id');
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Handlers CRUD (idénticos a los tuyos)
    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Seguro que deseas eliminar?')) return;
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            await fetch(`/categories/${id}`, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': csrf } });
            setRowData((prev) => prev.filter((c) => c.id !== id));
            setNotification('Categoría eliminada');
        } catch {
            setNotification('Error al eliminar');
        }
    };
    const startEdit = (id: number, name: string) => {
        setEditingId(id);
        setEditingName(name);
    };
    const saveEdit = async (id: number) => {
        if (!editingName.trim()) {
            setNotification('Nombre obligatorio');
            return;
        }
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch(`/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({ name: editingName }),
            });
            if (!res.ok) throw new Error();
            const upd = await res.json();
            setRowData((prev) => prev.map((c) => (c.id === id ? upd : c)));
            setNotification('Categoría actualizada');
        } catch {
            setNotification('Error al actualizar');
        } finally {
            setEditingId(null);
            setEditingName('');
        }
    };
    const createCategory = async () => {
        if (!newCategoryName.trim()) {
            setNotification('Nombre obligatorio');
            return;
        }
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({ name: newCategoryName }),
            });
            if (!res.ok) throw new Error();
            const cr = await res.json();
            setRowData((prev) => [...prev, cr]);
            setNotification('Categoría creada');
            setNewCategoryName('');
            setDialogOpen(false);
        } catch {
            setNotification('Error al crear');
        }
    };

    // Notificaciones
    useEffect(() => {
        if (!notification) return;
        const t = setTimeout(() => setNotification(null), 4000);
        return () => clearTimeout(t);
    }, [notification]);

    // Filtrado de búsqueda
    const filtered = useMemo(
        () => rowData.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || String(c.id).includes(search)),
        [rowData, search],
    );

    // Ordenación estable + paginación
    const sortedData = useMemo(() => stableSort(filtered, getComparator(order, orderBy)), [filtered, order, orderBy]);
    const paginatedData = useMemo(() => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [sortedData, page, rowsPerPage]);

    // Sorting & selecting handlers
    const handleRequestSort = (property: keyof Category) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(filtered.map((c) => c.id));
        } else {
            setSelected([]);
        }
    };
    const handleClickRow = (id: number) => {
        setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
    };
    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorías" />

            {/* Buscador + Crear */}
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
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                    sx={{ fontWeight: 'bold' }}
                >
                    Crear categoría
                </Button>
            </Box>

            {/* Toolbar selección */}
            {selected.length > 0 && (
                <Toolbar sx={{ bgcolor: 'action.selected', mb: 1, borderRadius: 2 }}>
                    <Typography sx={{ flex: '1 1 100%' }} color="inherit">
                        {selected.length} seleccionado{selected.length > 1 ? 's' : ''}
                    </Typography>
                    <IconButton color="error" onClick={() => selected.forEach((id) => handleDelete(id))}>
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
                            <TableCell padding="checkbox" sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.common.white,
                            }}>
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
                                        {editingId === row.id ? (
                                            <TextField
                                                value={editingName}
                                                size="small"
                                                autoFocus
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onBlur={() => saveEdit(row.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEdit(row.id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                            />
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <EditIcon fontSize="small" color="action" sx={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); startEdit(row.id, row.name); }} />
                                                <span
                                                    onDoubleClick={() => startEdit(row.id, row.name)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Doble click para editar"
                                                >
                                                    {row.name}
                                                </span>
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell>
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

            {/* Dialogo Crear */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Crear Nueva Categoría</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Nombre de la categoría"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={createCategory}>
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notificación */}
            <Snackbar open={!!notification} message={notification} onClose={() => setNotification(null)} autoHideDuration={4000} />
        </AppLayout>
    );
}
