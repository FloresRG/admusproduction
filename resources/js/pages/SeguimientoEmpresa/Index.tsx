import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';

import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PackageIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Fade,
    FormControl,
    Grid,
    Grow,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Interfaces para tipos de datos
interface Seguimiento {
    id: number;
    nombre_empresa: string;
    id_user: number;
    id_paquete: number;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    descripcion: string | null;
    usuario: { id: number; name: string };
    paquete: { id: number; nombre_paquete: string };
}

interface User {
    id: number;
    name: string;
}

interface Paquete {
    id: number;
    nombre_paquete: string;
}

interface GroupedSeguimiento {
    user: User;
    seguimientos: Seguimiento[];
}

// Colores modernos para los gráficos
const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const Index: React.FC = () => {
    const { seguimientos, seguimientosAll, users, paquetes, filters } = usePage().props as any;

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const { data, setData, post, put, reset } = useForm<Omit<Seguimiento, 'id' | 'usuario' | 'paquete'>>({
        nombre_empresa: '',
        id_user: users.length > 0 ? users[0].id : 0,
        id_paquete: paquetes.length > 0 ? paquetes[0].id : 0,
        estado: '',
        fecha_inicio: '',
        fecha_fin: '',
        descripcion: '',
    });

    const [search, setSearch] = useState(filters.search || '');

    // Datos estadísticos calculados
    const statsData = useMemo(() => {
        const dataSource = seguimientosAll ?? seguimientos.data;

        const totalSeguimientos = dataSource.length;
        const totalUsuarios = new Set(dataSource.map((s: Seguimiento) => s.id_user)).size;
        const totalPaquetes = new Set(dataSource.map((s: Seguimiento) => s.id_paquete)).size;

        const seguimientosPorUsuario = dataSource.reduce((acc: any, seguimiento: Seguimiento) => {
            const userName = seguimiento.usuario.name;
            acc[userName] = (acc[userName] || 0) + 1;
            return acc;
        }, {});

        const barData = Object.entries(seguimientosPorUsuario).map(([name, count]) => ({
            name: name.split(' ').slice(0, 2).join(' '),
            seguimientos: count,
        }));

        const seguimientosPorPaquete = dataSource.reduce((acc: any, seguimiento: Seguimiento) => {
            const paqueteName = seguimiento.paquete?.nombre_paquete || 'Sin paquete';
            acc[paqueteName] = (acc[paqueteName] || 0) + 1;
            return acc;
        }, {});

        const pieData = Object.entries(seguimientosPorPaquete).map(([name, value]) => ({
            name,
            value,
        }));

        return {
            totalSeguimientos,
            totalUsuarios,
            totalPaquetes,
            barData,
            pieData,
        };
    }, [seguimientosAll, seguimientos.data]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        router.get(
            route('seguimiento-empresa.index'),
            { search: value },
            {
                replace: true,
                preserveState: true,
            },
        );
    };

    const handleOpen = (seguimiento?: Seguimiento) => {
        if (seguimiento) {
            setIsEditing(true);
            setCurrentId(seguimiento.id);
            setData({
                nombre_empresa: seguimiento.nombre_empresa,
                id_user: seguimiento.id_user,
                id_paquete: seguimiento.id_paquete,
                estado: seguimiento.estado,
                fecha_inicio: seguimiento.fecha_inicio,
                fecha_fin: seguimiento.fecha_fin || '',
                descripcion: seguimiento.descripcion || '',
            });
        } else {
            setIsEditing(false);
            setCurrentId(null);
            reset();
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reloadAfterClose = () => {
            handleClose();
            window.location.reload();
        };

        if (isEditing && currentId) {
            put(route('seguimiento-empresa.update', currentId), {
                onSuccess: reloadAfterClose,
            });
        } else {
            post(route('seguimiento-empresa.store'), {
                onSuccess: reloadAfterClose,
            });
        }
    };

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este seguimiento?')) {
            destroy(route('seguimiento-empresa.destroy', id));
        }
    };

    const renderPaginationLinks = () => (
        <nav aria-label="Page navigation">
            <ul className="inline-flex items-center -space-x-px">
                {seguimientos.links.map((link: any, key: number) => (
                    <li key={key}>
                        {link.url === null ? (
                            <span
                                className={`rounded-lg border border-gray-300 bg-white px-4 py-2 leading-tight text-gray-500 ${
                                    link.active ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : ''
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <button
                                onClick={() => router.get(link.url, { search }, { preserveState: true })}
                                className={`rounded-lg border border-gray-300 bg-white px-4 py-2 leading-tight text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-700 ${
                                    link.active ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : ''
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );

    const groupedSeguimientos = useMemo(() => {
        const groups: { [key: number]: GroupedSeguimiento } = {};
        seguimientos.data.forEach((seguimiento: Seguimiento) => {
            const userId = seguimiento.usuario.id;
            if (!groups[userId]) {
                groups[userId] = {
                    user: seguimiento.usuario,
                    seguimientos: [],
                };
            }
            groups[userId].seguimientos.push(seguimiento);
        });
        return Object.values(groups);
    }, [seguimientos.data]);

    return (
        <AppLayout
            user={usePage().props.auth.user}
            header={
                <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-2">
                        <TrendingUpIcon className="text-white" />
                    </div>
                    <h2 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-2xl font-bold text-transparent">
                        Seguimiento de Empresas
                    </h2>
                </div>
            }
        >
            <Head title="Seguimiento de Empresas" />
            <div>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        bgcolor: '#f5f7fa',
                        px: 3,
                        py: 2,
                        borderRadius: 2,
                        boxShadow: 1,
                        mb: 2,
                    }}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Empresas"
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%', background: '#fff', padding: 4, boxShadow: '0 2px 8px #eee' }}
                    />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#1a237e',
                            letterSpacing: 1,
                            textShadow: '0 1px 2px #e3e3e3',
                        }}
                    >
                        Seguimiento de tus Empresas Activas
                    </Typography>
                </Box>
            </div>
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Tarjetas de estadísticas */}
                    <Fade in timeout={800}>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(102, 126, 234, 0.3)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    {statsData.totalSeguimientos}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Total Seguimientos
                                                </Typography>
                                            </div>
                                            <BusinessIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: 'white',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(240, 147, 251, 0.3)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    {statsData.totalUsuarios}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Ejecutivos Activos
                                                </Typography>
                                            </div>
                                            <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        color: 'white',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 24px rgba(79, 172, 254, 0.3)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    {statsData.totalPaquetes}
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Paquetes Diferentes
                                                </Typography>
                                            </div>
                                            <PackageIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Fade>

                    {/* Gráficos estadísticos */}
                    <Grow in timeout={1200}>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={8}>
                                <Card
                                    sx={{
                                        p: 3,
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        borderRadius: '16px',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#374151' }}>
                                        Seguimientos por Ejecutivo
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={statsData.barData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(55, 65, 81, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                }}
                                            />
                                            <Bar dataKey="seguimientos" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                                            <defs>
                                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7} />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Card
                                    sx={{
                                        p: 3,
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        borderRadius: '16px',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#374151' }}>
                                        Distribución por Paquetes
                                    </Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={statsData.pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={100}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {statsData.pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(55, 65, 81, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grow>

                    {/* Sección de tabla */}
                    <Fade in timeout={1400}>
                        <Card
                            sx={{
                                overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                borderRadius: '16px',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    <TextField
                                        label="Buscar..."
                                        variant="outlined"
                                        value={search}
                                        onChange={handleSearch}
                                        sx={{
                                            width: { xs: '100%', sm: '350px' },
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                '& fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.3)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.5)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.7)',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgba(255,255,255,0.8)',
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'white',
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<PictureAsPdfIcon />}
                                            onClick={() => {
                                                const pdfUrl = route('seguimiento-empresa.pdf', { search: search });
                                                window.open(pdfUrl, '_blank');
                                            }}
                                            sx={{
                                                borderColor: 'rgba(255,255,255,0.3)',
                                                color: 'white',
                                                '&:hover': {
                                                    borderColor: 'rgba(255,255,255,0.5)',
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                },
                                            }}
                                        >
                                            Generar PDF
                                        </Button>
                                        {/* <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleOpen()}
                                            sx={{
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                                },
                                            }}
                                        >
                                            Nuevo Seguimiento
                                        </Button> */}
                                    </Box>
                                </Box>
                            </Box>

                            <TableContainer sx={{ backgroundColor: 'white' }}>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.95rem' }}>Usuario</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.95rem' }}>Empresa</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.95rem' }}>Paquete</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.95rem' }}>Estado</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.95rem' }}>Fecha Inicio</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.95rem' }}>Fecha Fin</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.95rem' }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {groupedSeguimientos.length > 0 ? (
                                            groupedSeguimientos.map((group) => (
                                                <React.Fragment key={group.user.id}>
                                                    {group.seguimientos.map((row: Seguimiento, rowIndex: number) => (
                                                        <TableRow
                                                            key={row.id}
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: '#f8fafc',
                                                                    transform: 'scale(1.001)',
                                                                    transition: 'all 0.2s ease',
                                                                },
                                                            }}
                                                        >
                                                            {rowIndex === 0 ? (
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    rowSpan={group.seguimientos.length}
                                                                    sx={{
                                                                        borderRight: '3px solid #6366f1',
                                                                        backgroundColor: '#f0f4ff',
                                                                        fontWeight: 'bold',
                                                                        color: '#374151',
                                                                    }}
                                                                >
                                                                    {group.user.name}
                                                                </TableCell>
                                                            ) : null}
                                                            <TableCell sx={{ color: '#374151' }}>{row.nombre_empresa}</TableCell>
                                                            <TableCell sx={{ color: '#374151' }}>{row.paquete?.nombre_paquete}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label="En proceso"
                                                                    sx={{
                                                                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                                                                        color: 'white',
                                                                        fontWeight: 'bold',
                                                                        borderRadius: '20px',
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#374151' }}>{row.fecha_inicio}</TableCell>
                                                            <TableCell sx={{ color: '#6b7280' }}>{row.fecha_fin || 'N/A'}</TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    <IconButton
                                                                        onClick={() => handleOpen(row)}
                                                                        sx={{
                                                                            color: '#6366f1',
                                                                            '&:hover': {
                                                                                backgroundColor: '#e0e7ff',
                                                                                transform: 'scale(1.1)',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => handleDelete(row.id)}
                                                                        sx={{
                                                                            color: '#ef4444',
                                                                            '&:hover': {
                                                                                backgroundColor: '#fef2f2',
                                                                                transform: 'scale(1.1)',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#6b7280' }}>
                                                    <Typography variant="h6">No se encontraron seguimientos.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', backgroundColor: '#fafbfc' }}>{renderPaginationLinks()}</Box>
                        </Card>
                    </Fade>
                </div>
            </div>

            {/* Modal mejorado */}
            <Modal open={open} onClose={handleClose}>
                <Fade in={open}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '95%', sm: 650 },
                            maxHeight: '90vh',
                            overflow: 'auto',
                            bgcolor: 'background.paper',
                            borderRadius: '20px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                            p: 0,
                        }}
                    >
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Header del modal */}
                            <Box
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    p: 3,
                                    borderRadius: '20px 20px 0 0',
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}
                                >
                                    {isEditing ? '✏️ Editar Seguimiento' : '➕ Crear Seguimiento'}
                                </Typography>
                            </Box>

                            {/* Contenido del modal */}
                            <Box sx={{ p: 4 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Nombre de Empresa"
                                            value={data.nombre_empresa}
                                            onChange={(e) => setData('nombre_empresa', e.target.value)}
                                            required
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Usuario</InputLabel>
                                            <Select
                                                value={data.id_user}
                                                label="Usuario"
                                                onChange={(e) => setData('id_user', e.target.value as number)}
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '12px',
                                                }}
                                            >
                                                {users.map((user: User) => (
                                                    <MenuItem key={user.id} value={user.id}>
                                                        {user.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Paquete</InputLabel>
                                            <Select
                                                value={data.id_paquete}
                                                label="Paquete"
                                                onChange={(e) => setData('id_paquete', e.target.value as number)}
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '12px',
                                                }}
                                            >
                                                {paquetes.map((paquete: Paquete) => (
                                                    <MenuItem key={paquete.id} value={paquete.id}>
                                                        {paquete.nombre_paquete}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Estado</InputLabel>
                                            <Select
                                                value={data.estado}
                                                label="Estado"
                                                onChange={(e) => setData('estado', e.target.value as string)}
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '12px',
                                                }}
                                            >
                                                <MenuItem value="En proceso">En proceso</MenuItem>
                                                <MenuItem value="Finalizado">Finalizado</MenuItem>
                                                <MenuItem value="Cancelado">Cancelado</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Fecha de Inicio"
                                            type="date"
                                            value={data.fecha_inicio}
                                            onChange={(e) => setData('fecha_inicio', e.target.value)}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Fecha de Fin"
                                            type="date"
                                            value={data.fecha_fin}
                                            onChange={(e) => setData('fecha_fin', e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Descripción"
                                            value={data.descripcion}
                                            onChange={(e) => setData('descripcion', e.target.value)}
                                            multiline
                                            minRows={2}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Footer del modal */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2,
                                    p: 3,
                                    borderTop: '1px solid #f3f4f6',
                                    borderRadius: '0 0 20px 20px',
                                    background: '#f8fafc',
                                }}
                            >
                                <Button onClick={handleClose} color="secondary" variant="outlined">
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    {isEditing ? 'Guardar Cambios' : 'Crear Seguimiento'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </AppLayout>
    );
};

export default Index;
