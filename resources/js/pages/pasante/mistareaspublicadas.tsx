import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useState, useCallback, useEffect } from 'react';
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Chip,
    Box,
    Container,
    Typography,
    IconButton,
    Collapse,
    alpha,
    debounce,
    InputAdornment,
    Select,
    MenuItem,
    Pagination,
    FormControl,
    InputLabel,
    Stack
} from '@mui/material';
import { 
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    ExpandMore as ExpandMoreIcon,
    FolderOutlined,
    Search as SearchIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

interface Tarea {
    id: number;
    estado: string | null;
    detalle: string | null;
    fecha: string;
    tarea: {
        titulo: string;
        descripcion: string;
        prioridad: string | null;
        tipo: {
            id: number;
            nombre_tipo: string;
        } | null;
        company: {
            name: string;
            ubicacion: string;
            direccion: string;
        } | null;
    };
}
interface Props {
    tareas: Tarea[];
    total: number;
    perPage: number;
    currentPage: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mis Tareas', href: '/pasante/mistareas' },
];

const getPriorityColor = (prioridad: string | null) => {
    if (!prioridad) return '#9E9E9E';
    
    switch (prioridad.toLowerCase()) {
        case 'alta':
            return '#FF1744' // Rojo vibrante
        case 'media':
            return '#FF9100' // Naranja vibrante
        case 'baja':
            return '#00E676' // Verde vibrante
        default:
            return '#9E9E9E'
    }
};

const getStatusColor = (estado: string | null) => {
    if (!estado) return 'default';
    
    switch (estado.toLowerCase()) {
        case 'publicada':
            return 'success';
        case 'en_revision':
            return 'primary';
        case 'pendiente':
            return 'warning';
        default:
            return 'default';
    }
};

export default function Mistareas({ tareas: initialTareas, total, perPage, currentPage }: Props) {
    const [tareas, setTareas] = useState(initialTareas);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    
    // Nuevos estados para filtros y búsqueda
    const [search, setSearch] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [page, setPage] = useState(currentPage);

    // Debounced function for saving details
    const debouncedSaveDetail = useCallback(
        debounce(async (id: number, detalle: string) => {
            try {
                await axios.patch(`/tareas/actualizar-estado/${id}`, {
                    detalle,
                    estado: tareas.find(t => t.id === id)?.estado || 'pendiente'
                });
            } catch (error) {
                console.error('Error al guardar el detalle:', error);
            }
        }, 1000),
        [tareas]
    );

    // Handle estado change
    const handleEstadoChange = async (id: number, newEstado: string) => {
        try {
            await axios.patch(`/tareas/actualizar-estado/${id}`, {
                estado: newEstado,
                detalle: tareas.find(t => t.id === id)?.detalle || ''
            });

            setTareas(tareas.map(tarea => 
                tarea.id === id ? { ...tarea, estado: newEstado } : tarea
            ));
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    // Handle detalle change
    const handleDetalleChange = (id: number, detalle: string) => {
        setTareas(tareas.map(tarea => 
            tarea.id === id ? { ...tarea, detalle } : tarea
        ));
        debouncedSaveDetail(id, detalle);
    };

    const toggleRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // Modifica la función handleSearch
    const handleSearch = useCallback(
        debounce(async (searchTerm: string, filters: any) => {
            try {
                const response = await axios.get('/pasante/mistareaspublicadas', {
                    params: {
                        search: searchTerm,
                        priority: filters.priority,
                        status: filters.status,
                        type: filters.type,
                        page: filters.page
                    }
                });
                
                setTareas(response.data.tareas);
                // Actualizar el total si cambió
                if (response.data.total !== total) {
                    setPage(1); // Resetear a primera página si cambian los filtros
                }
            } catch (error) {
                console.error('Error al buscar tareas:', error);
            }
        }, 500),
        []
    );

    // Actualiza los manejadores de cambios
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = event.target.value;
        setSearch(newSearch);
        handleSearch(newSearch, {
            priority: filterPriority,
            status: filterStatus,
            type: filterType,
            page: 1 // Reset to first page on search
        });
    };

    const handleFilterChange = (type: string, value: string) => {
        switch(type) {
            case 'priority':
                setFilterPriority(value);
                break;
            case 'status':
                setFilterStatus(value);
                break;
            case 'type':
                setFilterType(value);
                break;
        }

        handleSearch(search, {
            priority: type === 'priority' ? value : filterPriority,
            status: type === 'status' ? value : filterStatus,
            type: type === 'type' ? value : filterType,
            page: 1 // Reset to first page on filter change
        });
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        handleSearch(search, {
            priority: filterPriority,
            status: filterStatus,
            type: filterType,
            page: value
        });
    };

    // Fix the uniqueTypes calculation to handle undefined
    const uniqueTypes = Array.from(
        new Set(
            tareas
                ?.map(t => t.tarea.tipo?.nombre_tipo)
                .filter(Boolean) || []
        )
    );

    // Add loadTareas function
    const loadTareas = async () => {
        try {
            const response = await axios.get('/pasante/mistareaspublicadas', {
                params: {
                    search: '',
                    priority: '',
                    status: '',
                    type: '',
                    page: 1
                }
            });
            
            setTareas(response.data.tareas);
        } catch (error) {
            console.error('Error al cargar tareas:', error);
        }
    };

    // Add useEffect to load tasks on component mount
    useEffect(() => {
        loadTareas();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Tareas" />
            
            {/* Header con gradiente */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                    color: 'white',
                    py: 3,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h4" fontWeight="bold">
                        📋 Mis Tareas Asignadas
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        Gestiona y actualiza el estado de tus tareas
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Añade sección de filtros */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                placeholder="Buscar tareas..."
                                value={search}
                                onChange={handleSearchChange}
                                sx={{ flexGrow: 1 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Prioridad</InputLabel>
                                <Select
                                    value={filterPriority}
                                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                                    label="Prioridad"
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    <MenuItem value="alta">Alta</MenuItem>
                                    <MenuItem value="media">Media</MenuItem>
                                    <MenuItem value="baja">Baja</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={filterStatus}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    label="Estado"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="pendiente">pendiente</MenuItem>
                                    <MenuItem value="en_revision">en_revision</MenuItem>
                                    <MenuItem value="publicada">publicada</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={filterType}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    label="Tipo"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {uniqueTypes.map(type => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                </Paper>

                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha('#1976d2', 0.05) }}>
                                <TableCell sx={{ width: '40px' }}></TableCell>
                                <TableCell>Título</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Empresa</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Prioridad</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tareas?.map((tarea) => (
                                <React.Fragment key={tarea.id}>
                                    <TableRow 
                                        sx={{ 
                                            '&:hover': { bgcolor: alpha('#1976d2', 0.02) },
                                            borderLeft: `4px solid ${getPriorityColor(tarea.tarea.prioridad)}`
                                        }}
                                    >
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => toggleRow(tarea.id)}
                                                sx={{
                                                    transform: expandedRow === tarea.id ? 'rotate(180deg)' : 'none',
                                                    transition: 'transform 0.2s'
                                                }}
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {tarea.tarea.titulo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {tarea.tarea.tipo && (
                                                <Chip
                                                    icon={<FolderOutlined sx={{ fontSize: 16 }} />}
                                                    label={tarea.tarea.tipo.nombre_tipo}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha('#1976d2', 0.1),
                                                        color: 'primary.main'
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {tarea.tarea.company && (
                                                <Chip
                                                    icon={<BusinessIcon fontSize="small" />}
                                                    label={tarea.tarea.company.name}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={<CalendarTodayIcon fontSize="small" />}
                                                label={format(new Date(tarea.fecha), 'dd/MM/yyyy')}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={tarea.tarea.prioridad}
                                                size="small"
                                                sx={{
                                                    bgcolor: getPriorityColor(tarea.tarea.prioridad),
                                                    color: 'white',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={tarea.estado || 'Sin estado'}
                                                color={getStatusColor(tarea.estado)}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key={`detail-${tarea.id}`}>
                                        <TableCell colSpan={7} sx={{ py: 0 }}>
                                            <Collapse in={expandedRow === tarea.id}>
                                                <Box sx={{ p: 3 }}>
                                                    <Typography 
                                                        variant="subtitle2" 
                                                        color="text.secondary"
                                                        gutterBottom
                                                    >
                                                        Descripción:
                                                    </Typography>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ mb: 3 }}
                                                    >
                                                        {tarea.tarea.descripcion}
                                                    </Typography>

                                                    <Box sx={{ 
                                                        p: 2,
                                                        bgcolor: alpha('#1976d2', 0.05),
                                                        borderRadius: 2,
                                                    }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                                                            Estado de la tarea
                                                        </Typography>
                                                        
                                                        <RadioGroup
                                                            row
                                                            value={tarea.estado || 'pendiente'}
                                                            onChange={(e) => handleEstadoChange(tarea.id, e.target.value)}
                                                            sx={{ mb: 2 }}
                                                        >
                                                            <FormControlLabel 
                                                                value="publicada"
                                                                control={<Radio color="success" />}
                                                                label="publicada"
                                                            />
                                                            <FormControlLabel 
                                                                value="en_revision"
                                                                control={<Radio color="primary" />}
                                                                label="en_revision"
                                                            />
                                                            <FormControlLabel 
                                                                value="pendiente"
                                                                control={<Radio color="warning" />}
                                                                label="pendiente"
                                                            />
                                                        </RadioGroup>

                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows={2}
                                                            variant="outlined"
                                                            placeholder="Agregar detalles o comentarios sobre la tarea..."
                                                            value={tarea.detalle || ''}
                                                            onChange={(e) => handleDetalleChange(tarea.id, e.target.value)}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    bgcolor: 'white'
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Show empty state only when tareas is defined and empty */}
                {tareas?.length === 0 && (
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 3,
                            background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                        }}
                    >
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                            📝 No tienes tareas asignadas
                        </Typography>
                        <Typography color="text.secondary">
                            Por el momento no hay tareas asignadas para ti
                        </Typography>
                    </Paper>
                )}

                {/* Only show pagination when we have data */}
                {tareas?.length > 0 && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Pagination 
                            count={Math.ceil(total / perPage)} 
                            page={page} 
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton 
                            showLastButton
                        />
                    </Box>
                )}
            </Container>
        </AppLayout>
    );
}