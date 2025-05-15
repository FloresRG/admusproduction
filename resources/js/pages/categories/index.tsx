// src/pages/categories/Index.tsx

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

type Category = {
    id: number;
    name: string;
};

const breadcrumbs = [{ title: 'Categories', href: '/categories' }];

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
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <TextField
                    label="Buscar por nombre o ID"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
                    Crear categoría
                </Button>
            </div>

            {/* Toolbar selección */}
            {selected.length > 0 && (
                <Toolbar sx={{ bgcolor: 'action.selected', mb: 1 }}>
                    <Typography sx={{ flex: '1 1 100%' }} color="inherit">
                        {selected.length} seleccionado{selected.length > 1 ? 's' : ''}
                    </Typography>
                    <IconButton onClick={() => selected.forEach((id) => handleDelete(id))}>
                        <DeleteIcon />
                    </IconButton>
                </Toolbar>
            )}

            {/* Tabla */}
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < filtered.length}
                                    checked={filtered.length > 0 && selected.length === filtered.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'id' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'name' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Nombre
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Acciones</TableCell>
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
                                            <span
                                                onDoubleClick={() => startEdit(row.id, row.name)}
                                                style={{ cursor: 'pointer' }}
                                                title="Doble click para editar"
                                            >
                                                {row.name}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
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
            </TableContainer>

            {/* Paginación externa */}
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
            />

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
