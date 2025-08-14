import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';
import { CalendarToday as CalendarIcon, FilterList as FilterIcon, PictureAsPdf as PdfIcon, Search as SearchIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import { PageProps } from '@/types';

type Tipo = { id: number; nombre_tipo: string };
type Company = { id: number; name: string };
type Tarea = { id: number; titulo: string; prioridad: string; descripcion: string; fecha: string; tipo: Tipo; company: Company };
type User = { id: number; name: string; email: string };
type Asignacion = { id: number; user: User; tarea: Tarea; estado: string; detalle: string; fecha: string };

const getPrioridadColor = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
        case 'alta':
            return 'error';
        case 'media':
            return 'warning';
        case 'baja':
            return 'success';
        default:
            return 'default';
    }
};

const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
        case 'completado':
            return 'success';
        case 'en progreso':
            return 'info';
        case 'pendiente':
            return 'warning';
        case 'cancelado':
            return 'error';
        default:
            return 'default';
    }
};

export default function Reporte() {
    const { asignaciones, filters } = usePage<PageProps<{ asignaciones: Asignacion[]; filters: any }>>().props;

    // Estados para filtros
    const [fechaInicio, setFechaInicio] = useState(filters.fecha_inicio || '');
    const [fechaFin, setFechaFin] = useState(filters.fecha_fin || '');
    const [mes, setMes] = useState(filters.mes || '');

    // Estados para búsqueda y paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filtrado y búsqueda de datos
    const filteredAsignaciones = useMemo(() => {
        return asignaciones.filter((asignacion) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                asignacion.user.name.toLowerCase().includes(searchLower) ||
                asignacion.tarea.titulo.toLowerCase().includes(searchLower) ||
                asignacion.tarea.prioridad.toLowerCase().includes(searchLower) ||
                asignacion.tarea.tipo?.nombre_tipo.toLowerCase().includes(searchLower) ||
                asignacion.tarea.company?.name.toLowerCase().includes(searchLower) ||
                asignacion.estado.toLowerCase().includes(searchLower) ||
                asignacion.detalle.toLowerCase().includes(searchLower)
            );
        });
    }, [asignaciones, searchTerm]);

    // Datos paginados
    const paginatedAsignaciones = useMemo(() => {
        return filteredAsignaciones.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredAsignaciones, page, rowsPerPage]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/reportetareas',
            {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                mes: mes,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const generarPdf = () => {
        const params = new URLSearchParams({
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
        }).toString();
        window.open(`/reportetareas/pdf?${params}`, '_blank');
    };

    const generarPdfmes = () => {
        const params = new URLSearchParams({
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
        }).toString();
        window.open(`/reportetareas/pdfmes?${params}`, '_blank');
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const clearFilters = () => {
        setFechaInicio('');
        setFechaFin('');
        setMes('');
        setSearchTerm('');
        setPage(0);
    };

    return (
        <AppLayout>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                        Reporte de Tareas Asignadas
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Gestiona y visualiza todas las asignaciones de tareas
                    </Typography>
                </Box>

                {/* Botones de PDF */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <Button variant="contained" color="error" startIcon={<PdfIcon />} onClick={generarPdf} sx={{ borderRadius: 2 }}>
                        Generar PDF
                    </Button>
                    <Button variant="contained" color="primary" startIcon={<PdfIcon />} onClick={generarPdfmes} sx={{ borderRadius: 2 }}>
                        Generar PDF Mensual
                    </Button>
                </Stack>

                {/* Card de Filtros Mejorado */}
                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(to right, #f0f4ff, #f9fbff)',
                        boxShadow: 3,
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" color="primary">
                                Filtros
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleFilter}>
                            <Grid container spacing={3} alignItems="flex-end">
                                {/* Fecha Inicio */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Fecha Inicio"
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Fecha Fin */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Fecha Fin"
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Mes</InputLabel>
                                        <Select
                                            value={mes}
                                            label="Mes"
                                            onChange={(e) => setMes(e.target.value)}
                                            sx={{
                                                px: 3,
                                                fontWeight: 500,
                                                backgroundColor: 'white',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <MenuItem value="">-- Todos los meses --</MenuItem>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <MenuItem key={i + 1} value={i + 1}>
                                                    {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Botones */}
                                <Grid item xs={12} sm={6} md={2}>
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<FilterIcon />}
                                            fullWidth
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Filtrar
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={clearFilters} fullWidth sx={{ borderRadius: 2 }}>
                                            Limpiar
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>

                {/* Buscador */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar por usuario, tarea, prioridad, tipo, empresa, estado o detalle..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0); // Reset page when searching
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ borderRadius: 2 }}
                    />
                </Box>

                {/* Información de resultados */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Mostrando {paginatedAsignaciones.length} de {filteredAsignaciones.length} resultados
                        {searchTerm && ` para "${searchTerm}"`}
                    </Typography>
                </Box>

                {/* Tabla */}
                <Paper
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        background: 'linear-gradient(to right, #f9fafb, #ebf8ff)',
                                    }}
                                >
                                    {['Usuario', 'Tarea', 'Prioridad', 'Tipo', 'Empresa', 'Fecha Asignación', 'Estado', 'Detalle'].map((header) => (
                                        <TableCell
                                            key={header}
                                            sx={{
                                                fontWeight: 'bold',
                                                color: 'grey.800',
                                                borderBottom: '2px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedAsignaciones.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No se encontraron asignaciones
                                                {searchTerm && ` que coincidan con "${searchTerm}"`}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedAsignaciones.map((asignacion, index) => (
                                        <TableRow
                                            key={asignacion.id}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? 'white' : 'rgba(243, 244, 246, 0.5)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(219, 234, 254, 0.5)',
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {asignacion.user.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {asignacion.user.email}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {asignacion.tarea.titulo}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={asignacion.tarea.prioridad}
                                                    color={getPrioridadColor(asignacion.tarea.prioridad) as any}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>

                                            <TableCell>{asignacion.tarea.tipo?.nombre_tipo || 'N/A'}</TableCell>

                                            <TableCell>{asignacion.tarea.company?.name || 'N/A'}</TableCell>

                                            <TableCell>
                                                <Typography variant="body2">{new Date(asignacion.fecha).toLocaleDateString('es-ES')}</Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip label={asignacion.estado} color={getEstadoColor(asignacion.estado) as any} size="small" />
                                            </TableCell>

                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                    title={asignacion.detalle}
                                                >
                                                    {asignacion.detalle}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Paginación */}
                    {filteredAsignaciones.length > 0 && (
                        <TablePagination
                            component="div"
                            count={filteredAsignaciones.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Filas por página:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                            sx={{
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'grey.50',
                            }}
                        />
                    )}
                </Paper>
            </Box>
        </AppLayout>
    );
}
