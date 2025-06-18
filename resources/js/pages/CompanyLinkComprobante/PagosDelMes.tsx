'use client';

import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Assessment, AttachMoney, CalendarToday, Cancel, CheckCircle, FilterList, GetApp, Schedule, Search, Visibility } from '@mui/icons-material';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Container,
    Fade,
    Grid,
    IconButton,
    InputAdornment,
    LinearProgress,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Tooltip,
    Typography,
    Zoom,
} from '@mui/material';
import { useMemo, useState } from 'react';

type LinkComprobante = {
    comprobante_id: number | null;
    mes: string;
};

type Empresa = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    link_comprobantes: LinkComprobante[];
};

interface PagosDelMesProps {
    empresas: Empresa[];
    mesActual: string;
}

type SortField = 'name' | 'start_date' | 'status';
type SortDirection = 'asc' | 'desc';

export default function PagosDelMes({ empresas, mesActual }: PagosDelMesProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pagado' | 'no_pagado'>('all');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Procesar datos de empresas
    const empresasConEstado = useMemo(() => {
        return empresas.map((empresa) => {
            const pagado = empresa.link_comprobantes.some((lc) => lc.comprobante_id !== null && lc.mes.toLowerCase() === mesActual.toLowerCase());
            return { ...empresa, pagado };
        });
    }, [empresas, mesActual]);

    // Filtrar y ordenar empresas
    const empresasFiltradas = useMemo(() => {
        let filtered = empresasConEstado;

        // Filtro por búsqueda
        if (searchTerm) {
            filtered = filtered.filter((empresa) => empresa.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Filtro por estado
        if (filterStatus !== 'all') {
            filtered = filtered.filter((empresa) => (filterStatus === 'pagado' ? empresa.pagado : !empresa.pagado));
        }

        // Ordenamiento
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortField) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'start_date':
                    aValue = new Date(a.start_date);
                    bValue = new Date(b.start_date);
                    break;
                case 'status':
                    aValue = a.pagado ? 1 : 0;
                    bValue = b.pagado ? 1 : 0;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [empresasConEstado, searchTerm, filterStatus, sortField, sortDirection]);

    // Estadísticas
    const stats = useMemo(() => {
        const total = empresasConEstado.length;
        const pagadas = empresasConEstado.filter((e) => e.pagado).length;
        const noPagadas = total - pagadas;
        const porcentajePagado = total > 0 ? (pagadas / total) * 100 : 0;

        return { total, pagadas, noPagadas, porcentajePagado };
    }, [empresasConEstado]);

    // Función para manejar ordenamiento
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Función para obtener color del avatar
    const getAvatarColor = (name: string) => {
        const colors = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c2185b', '#00796b', '#5d4037', '#455a64', '#e64a19', '#1565c0'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Función para obtener iniciales
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Función para formatear fechas
    const formatDateRange = (startDate: string, endDate: string) => {
        const start = new Date(startDate).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
        });
        const end = new Date(endDate).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
        return `${start} - ${end}`;
    };

    return (
        <AppLayout>
            <Head title={`Pagos del mes: ${mesActual}`} />

            {/* Header mejorado */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 25%, #00bcd4 50%, #4caf50 75%, #8bc34a 100%)',
                    color: 'white',
                    py: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        pointerEvents: 'none',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        pointerEvents: 'none',
                    },
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Fade in timeout={800}>
                        <Box>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                gutterBottom
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                }}
                            >
                                💰 Pagos de Empresas - {mesActual}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    opacity: 0.95,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                }}
                            >
                                🏢 Gestión y seguimiento de pagos empresariales
                            </Typography>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Panel de estadísticas compacto */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={6} sm={3}>
                        <Zoom in timeout={300}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    p: 2,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                    },
                                }}
                            >
                                <Typography variant="h4" fontWeight="bold">
                                    {stats.total}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Total
                                </Typography>
                            </Card>
                        </Zoom>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <Zoom in timeout={400}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    p: 2,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                                    },
                                }}
                            >
                                <Typography variant="h4" fontWeight="bold">
                                    {stats.pagadas}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Pagadas
                                </Typography>
                            </Card>
                        </Zoom>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <Zoom in timeout={500}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    p: 2,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(244, 67, 54, 0.4)',
                                    },
                                }}
                            >
                                <Typography variant="h4" fontWeight="bold">
                                    {stats.noPagadas}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Pendientes
                                </Typography>
                            </Card>
                        </Zoom>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <Zoom in timeout={600}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    p: 2,
                                    textAlign: 'center',
                                    boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                                    },
                                }}
                            >
                                <Typography variant="h4" fontWeight="bold">
                                    {Math.round(stats.porcentajePagado)}%
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                    Completado
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={stats.porcentajePagado}
                                    sx={{
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: 'white',
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Card>
                        </Zoom>
                    </Grid>
                </Grid>

                {/* Panel de filtros y acciones */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 50%, #e3f2fd 100%)',
                        border: '2px solid rgba(25, 118, 210, 0.1)',
                        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
                    }}
                >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                placeholder="🔍 Buscar empresa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: '#1976d2' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                select
                                fullWidth
                                label="📊 Estado"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="pagado">✅ Pagadas</MenuItem>
                                <MenuItem value="no_pagado">❌ Pendientes</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Mostrando
                                </Typography>
                                <Chip label={`${empresasFiltradas.length} de ${stats.total}`} color="primary" sx={{ fontWeight: 'bold' }} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="outlined"
                                startIcon={<GetApp />}
                                fullWidth
                                sx={{
                                    borderRadius: 3,
                                    borderColor: '#1976d2',
                                    color: '#1976d2',
                                    '&:hover': {
                                        borderColor: '#1565c0',
                                        bgcolor: alpha('#1976d2', 0.1),
                                    },
                                }}
                            >
                                Exportar
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tabla mejorada */}
                <Fade in timeout={800}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(25, 118, 210, 0.2)',
                        }}
                    >
                        {/* Header de la tabla con gradiente */}
                        <Box
                            sx={{
                                background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 25%, #00bcd4 50%, #4caf50 75%, #8bc34a 100%)',
                                color: 'white',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="h5" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                📋 Lista de Empresas
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FilterList />
                                <Typography variant="body1">{empresasFiltradas.length} resultados</Typography>
                            </Box>
                        </Box>

                        <Table sx={{ minWidth: 650 }}>
                            <TableHead
                                sx={{
                                    bgcolor: alpha('#1976d2', 0.05),
                                }}
                            >
                                <TableRow>
                                    <TableCell sx={{ py: 2, px: 3 }}>
                                        <TableSortLabel
                                            active={sortField === 'name'}
                                            direction={sortField === 'name' ? sortDirection : 'asc'}
                                            onClick={() => handleSort('name')}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                color: '#1976d2',
                                                '& .MuiTableSortLabel-icon': {
                                                    color: '#1976d2 !important',
                                                },
                                            }}
                                        >
                                            🏢 Empresa
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ py: 2, px: 3 }}>
                                        <TableSortLabel
                                            active={sortField === 'start_date'}
                                            direction={sortField === 'start_date' ? sortDirection : 'asc'}
                                            onClick={() => handleSort('start_date')}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                color: '#1976d2',
                                                '& .MuiTableSortLabel-icon': {
                                                    color: '#1976d2 !important',
                                                },
                                            }}
                                        >
                                            📅 Vigencia
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ py: 2, px: 3 }}>
                                        <TableSortLabel
                                            active={sortField === 'status'}
                                            direction={sortField === 'status' ? sortDirection : 'asc'}
                                            onClick={() => handleSort('status')}
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                color: '#1976d2',
                                                '& .MuiTableSortLabel-icon': {
                                                    color: '#1976d2 !important',
                                                },
                                            }}
                                        >
                                            📊 Estado
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ py: 2, px: 3, textAlign: 'center' }}>
                                        <Typography variant="body1" fontWeight="bold" color="#1976d2">
                                            🔧 Acciones
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {empresasFiltradas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ py: 8, textAlign: 'center' }}>
                                            <Box>
                                                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                    🔍 No se encontraron empresas
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Intenta ajustar los filtros de búsqueda
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    empresasFiltradas.map((empresa, index) => (
                                        <Zoom key={empresa.id} in timeout={200 + index * 50}>
                                            <TableRow
                                                sx={{
                                                    '&:nth-of-type(odd)': {
                                                        bgcolor: alpha('#1976d2', 0.02),
                                                    },
                                                    '&:hover': {
                                                        bgcolor: alpha('#1976d2', 0.08),
                                                        transform: 'scale(1.01)',
                                                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
                                                    },
                                                    transition: 'all 0.3s ease',
                                                    borderLeft: `4px solid ${empresa.pagado ? '#4caf50' : '#f44336'}`,
                                                }}
                                            >
                                                {/* Columna Empresa */}
                                                <TableCell sx={{ py: 3, px: 3 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: getAvatarColor(empresa.name),
                                                                width: 48,
                                                                height: 48,
                                                                fontSize: '1rem',
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                            }}
                                                        >
                                                            {getInitials(empresa.name)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                                                {empresa.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {empresa.id}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* Columna Vigencia */}
                                                <TableCell sx={{ py: 3, px: 3 }}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            p: 2,
                                                            bgcolor: alpha('#1976d2', 0.05),
                                                            borderRadius: 2,
                                                            border: `1px solid ${alpha('#1976d2', 0.2)}`,
                                                        }}
                                                    >
                                                        <CalendarToday sx={{ fontSize: 20, color: '#1976d2' }} />
                                                        <Box>
                                                            <Typography variant="body1" fontWeight="bold">
                                                                {formatDateRange(empresa.start_date, empresa.end_date)}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Período activo
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                {/* Columna Estado */}
                                                <TableCell sx={{ py: 3, px: 3 }}>
                                                    <Chip
                                                        icon={empresa.pagado ? <CheckCircle /> : <Cancel />}
                                                        label={empresa.pagado ? '✅ PAGADO' : '❌ PENDIENTE'}
                                                        sx={{
                                                            bgcolor: empresa.pagado ? '#e8f5e8' : '#ffebee',
                                                            color: empresa.pagado ? '#2e7d32' : '#c62828',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.9rem',
                                                            px: 2,
                                                            py: 1,
                                                            height: 'auto',
                                                            '& .MuiChip-icon': {
                                                                color: empresa.pagado ? '#2e7d32' : '#c62828',
                                                            },
                                                            boxShadow: empresa.pagado
                                                                ? '0 2px 8px rgba(46, 125, 50, 0.3)'
                                                                : '0 2px 8px rgba(198, 40, 40, 0.3)',
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* Columna Acciones */}
                                                <TableCell sx={{ py: 3, px: 3, textAlign: 'center' }}>
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                        <Tooltip title="Ver detalles">
                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha('#1976d2', 0.1),
                                                                    color: '#1976d2',
                                                                    '&:hover': {
                                                                        bgcolor: alpha('#1976d2', 0.2),
                                                                        transform: 'scale(1.1)',
                                                                    },
                                                                    transition: 'all 0.3s ease',
                                                                }}
                                                            >
                                                                <Visibility fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Historial">
                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha('#4caf50', 0.1),
                                                                    color: '#4caf50',
                                                                    '&:hover': {
                                                                        bgcolor: alpha('#4caf50', 0.2),
                                                                        transform: 'scale(1.1)',
                                                                    },
                                                                    transition: 'all 0.3s ease',
                                                                }}
                                                            >
                                                                <Assessment fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Pagos">
                                                            <IconButton
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha('#ff9800', 0.1),
                                                                    color: '#ff9800',
                                                                    '&:hover': {
                                                                        bgcolor: alpha('#ff9800', 0.2),
                                                                        transform: 'scale(1.1)',
                                                                    },
                                                                    transition: 'all 0.3s ease',
                                                                }}
                                                            >
                                                                <AttachMoney fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </Zoom>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Fade>

                {/* Resumen final */}
                {empresasFiltradas.length > 0 && (
                    <Fade in timeout={1000}>
                        <Paper
                            sx={{
                                mt: 4,
                                p: 3,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                border: '1px solid rgba(25, 118, 210, 0.3)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                <Schedule sx={{ color: '#1976d2', fontSize: 28 }} />
                                <Typography variant="h6" fontWeight="bold" color="#1976d2">
                                    📊 Resumen: {stats.pagadas} de {stats.total} empresas han completado el pago del mes {mesActual}
                                </Typography>
                            </Box>
                        </Paper>
                    </Fade>
                )}
            </Container>
        </AppLayout>
    );
}
