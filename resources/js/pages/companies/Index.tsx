// src/pages/companies/Index.tsx

import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
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
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#app');

type AvailabilityDay = {
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
};
type Company = {
    id: number;
    name: string;
    category: { name: string };
    contract_duration: string;
    start_date?: string;
    end_date?: string;
    availability_days?: AvailabilityDay[];
};

type Props = { companies: Company[] };

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function formatDay(day: string) {
    const dayMap: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return dayMap[day] || day;
}


const CompaniesIndex = ({ companies }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // Filtered data
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q ? companiesList.filter((c) => c.name.toLowerCase().includes(q) || c.category.name.toLowerCase().includes(q)) : companiesList;
    }, [search, companiesList]);

    // Sorted & paginated
    const sorted = stableSort<Company>(filtered, getComparator<Company>(order, orderBy));

    const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Handlers
    const handleSort = (prop: keyof Company) => {
        const isAsc = orderBy === prop && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(prop);
    };
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(e.target.checked ? filtered.map((c) => c.id) : []);
    };
    const handleSelectOne = (id: number) => {
        setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
    };
    function promptDelete(c: Company) {
        setSelectedCompany(c);
        setModalOpen(true);
    }
    async function confirmDelete() {
        if (!selectedCompany) return;
        try {
            const res = await fetch(`/companies/${selectedCompany.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await res.json();
            setNotification(data.success || 'Compañía eliminada');
            setCompaniesList((prev) => prev.filter((c) => c.id !== selectedCompany.id));
            setSelected((sel) => sel.filter((id) => id !== selectedCompany.id));
        } catch {
            setNotification('Error al eliminar');
        } finally {
            setModalOpen(false);
            setSelectedCompany(null);
        }
    }
    const cancelDelete = () => {
        setModalOpen(false);
        setSelectedCompany(null);
    };

    useEffect(() => {
        if (!notification) return;
        const t = setTimeout(() => setNotification(null), 4000);
        return () => clearTimeout(t);
    }, [notification]);

    return (
        <AppLayout>
            <Head title="Compañías" />

            {notification && (
                <div className="fixed top-6 right-6 z-50 rounded-lg border border-green-300 bg-green-100 px-6 py-3 text-green-800 shadow-md">
                    {notification}
                </div>
            )}

            <div className="py-6">
                {/* Top bar */}
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:justify-between">
                    <Link
                        href="/companies/create"
                        className="flex items-center gap-1 rounded bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800"
                    >
                        <AddIcon fontSize="small" />
                        Crear nueva compañía
                    </Link>
                    <div className="relative w-full md:w-72">
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Buscar por nombre o categoría..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <Paper sx={{ width: '100%', mb: 2 }}>
                    {selected.length > 0 && (
                        <Toolbar sx={{ bgcolor: 'action.selected' }}>
                            <Typography sx={{ flex: '1 1 100%' }} color="inherit">
                                {selected.length} seleccionado{selected.length > 1 ? 's' : ''}
                            </Typography>
                            <IconButton
                                onClick={() =>
                                    selected.forEach((id) => {
                                        const c = companiesList.find((x) => x.id === id);
                                        if (c) promptDelete(c);
                                    })
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Toolbar>
                    )}

                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < filtered.length}
                                            checked={filtered.length > 0 && selected.length === filtered.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell sortDirection={orderBy === 'name' ? order : false}>
                                        <TableSortLabel
                                            active={orderBy === 'name'}
                                            direction={orderBy === 'name' ? order : 'asc'}
                                            onClick={() => handleSort('name')}
                                        >
                                            Nombre
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Categoría</TableCell>
                                    <TableCell sortDirection={orderBy === 'contract_duration' ? order : false}>
                                        <TableSortLabel
                                            active={orderBy === 'contract_duration'}
                                            direction={orderBy === 'contract_duration' ? order : 'asc'}
                                            onClick={() => handleSort('contract_duration')}
                                        >
                                            Duración del contrato
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sortDirection={orderBy === 'start_date' ? order : false}>
                                        <TableSortLabel
                                            active={orderBy === 'start_date'}
                                            direction={orderBy === 'start_date' ? order : 'asc'}
                                            onClick={() => handleSort('start_date')}
                                        >
                                            Fecha inicio
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sortDirection={orderBy === 'end_date' ? order : false}>
                                        <TableSortLabel
                                            active={orderBy === 'end_date'}
                                            direction={orderBy === 'end_date' ? order : 'asc'}
                                            onClick={() => handleSort('end_date')}
                                        >
                                            Fecha fin
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Días Disponibles</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'gray' }}>
                                            No se encontraron compañías.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((c) => {
                                        const isSel = selected.includes(c.id);
                                        const availability = c.availability_days ?? [];
                                        return (
                                            <TableRow hover key={c.id} selected={isSel} onClick={() => handleSelectOne(c.id)}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isSel} />
                                                </TableCell>
                                                <TableCell>{c.name}</TableCell>
                                                <TableCell>{c.category.name}</TableCell>
                                                <TableCell>{c.contract_duration}</TableCell>
                                                <TableCell>{c.start_date ?? ''}</TableCell>
                                                <TableCell>{c.end_date ?? ''}</TableCell>
                                                <TableCell>
                                                    {availability.length === 0 ? (
                                                        <span className="text-gray-400 italic">Sin disponibilidad</span>
                                                    ) : (
                                                        availability.map((d, i) => (
                                                            <span
                                                                key={i}
                                                                className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                                                                    d.turno === 'mañana'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                } mr-1 mb-1 border border-gray-200`}
                                                            >
                                                                {formatDay(d.day_of_week)}: {d.start_time} - {d.end_time} ({d.turno})
                                                            </span>
                                                        ))
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/companies/${c.id}/edit`}
                                                            className="text-black underline hover:text-gray-700"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Editar
                                                        </Link>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                promptDelete(c);
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filtered.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(_, np) => setPage(np)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </Paper>
            </div>

            {/* Delete confirmation */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={cancelDelete}
                className="mx-auto w-full max-w-xs rounded-lg border border-black bg-white p-6 shadow-lg"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-lg font-bold">Confirmar eliminación</h2>
                <p className="mt-2">
                    ¿Eliminar la compañía “<strong>{selectedCompany?.name}</strong>”?
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={cancelDelete} className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
                        Cancelar
                    </button>
                    <button onClick={confirmDelete} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                        Eliminar
                    </button>
                </div>
            </Modal>

            {/* Notification Snackbar */}
            <Snackbar open={!!notification} message={notification} onClose={() => setNotification(null)} autoHideDuration={4000} />
        </AppLayout>
    );
}
