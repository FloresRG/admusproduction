import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SearchIcon from '@mui/icons-material/Search';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Paper,
    Snackbar,
    Stack,
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

type Photo = {
    id: number;
    path: string;
    nombre: string;
    tipo?: string;
};
type Video = {
    id: number;
    url: string;
    nombre: string;
    tipo: string;
    influencer_data: {
        nombre: string;
        edad: number;
        descripcion: string;
    };
    created_at?: string;
};
type InfluencerData = {
    nombre: string;
    edad: number;
    descripcion: string;
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

    // Photo Modal State
    const [photoModalOpen, setPhotoModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [photosLoading, setPhotosLoading] = useState(false);

    // 2. Añadir estos estados después de los estados existentes del modal de fotos
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [selectedVideoUserId, setSelectedVideoUserId] = useState<number | null>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [influencerData, setInfluencerData] = useState<InfluencerData>({
        nombre: '',
        edad: 0,
        descripcion: '',
    });
    const [userItems, setUserItems] = useState<any[]>([]);
    const [videoUploadLoading, setVideoUploadLoading] = useState(false);
    const [videosLoading, setVideosLoading] = useState(false);
    const [contentType, setContentType] = useState<'video' | 'datos'>('video');
    const [existingDataId, setExistingDataId] = useState<number | null>(null);

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
                setRowData((prev) => prev.map((user) => (user.id === editingId ? { ...user, [editingField!]: editingValue } : user)));
                setEditingId(null);
                setEditingField(null);
                setEditingValue('');
            },
            onError: () => {
                setNotification('Hubo un error al actualizar el campo');
            },
        });
    };

    // Abrir modal de fotos
    const handleOpenPhotoModal = async (userId: number) => {
        setSelectedUserId(userId);
        setPhotoModalOpen(true);
        await loadUserPhotos(userId);
    };

    // Cargar fotos del usuario
    const loadUserPhotos = async (userId: number) => {
        setPhotosLoading(true);
        try {
            const response = await fetch(`/infuencersdatos/${userId}/photos`);
            const data = await response.json();
            setUserPhotos(data.photos || []);
        } catch (error) {
            setNotification('Error al cargar las fotos');
        } finally {
            setPhotosLoading(false);
        }
    };

    // Cerrar modal de fotos
    const handleClosePhotoModal = () => {
        setPhotoModalOpen(false);
        setSelectedUserId(null);
        setSelectedFiles([]);
        setUserPhotos([]);
    };

    // Manejar selección de archivos
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };

    // Subir fotos
    const handleUploadPhotos = async () => {
        if (!selectedUserId || selectedFiles.length === 0) return;

        setUploadLoading(true);
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('photos[]', file);
        });

        try {
            const response = await fetch(`/infuencersdatos/${selectedUserId}/photos`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setNotification('Fotos subidas exitosamente');
                setSelectedFiles([]);
                await loadUserPhotos(selectedUserId);
            } else {
                setNotification(data.message || 'Error al subir las fotos');
            }
        } catch (error) {
            setNotification('Error al subir las fotos');
        } finally {
            setUploadLoading(false);
        }
    };

    // Eliminar foto
    const handleDeletePhoto = async (photoId: number) => {
        if (!selectedUserId || !window.confirm('¿Estás seguro de que deseas eliminar esta foto?')) return;

        try {
            const response = await fetch(`/infuencersdatos/${selectedUserId}/photos/${photoId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setNotification('Foto eliminada exitosamente');
                await loadUserPhotos(selectedUserId);
            } else {
                setNotification(data.message || 'Error al eliminar la foto');
            }
        } catch (error) {
            setNotification('Error al eliminar la foto');
        }
    };
    // Función modificada para abrir el modal
    const handleOpenVideoModal = async (userId: number) => {
        setSelectedVideoUserId(userId);
        setVideoModalOpen(true);
        setContentType('video'); // Inicializar en video
        await loadUserVideos(userId);
    };

    // Función modificada para cerrar el modal
    const handleCloseVideoModal = () => {
        setVideoModalOpen(false);
        setSelectedVideoUserId(null);
        setVideoUrl('');
        setInfluencerData({ nombre: '', edad: 0, descripcion: '' });
        setUserItems([]);
        setExistingDataId(null);
        setContentType('video');
    };

    // Función para cargar items (usa la misma ruta existente)
    // Modifica loadUserVideos para guardar el id si existe
    const loadUserVideos = async (userId: number) => {
        setVideosLoading(true);
        try {
            const response = await fetch(`/infuencersdatos/${userId}/videos`);
            const data = await response.json();
            setUserItems(data.videos || []);

            // Buscar si hay datos de influencer
            const datosItem = (data.videos || []).find((item: any) => item.tipo === 'datos');
            if (datosItem) {
                setExistingDataId(datosItem.id);
                setInfluencerData(datosItem.influencer_data || { nombre: '', edad: 0, descripcion: '' });
            } else {
                setExistingDataId(null);
                setInfluencerData({ nombre: '', edad: 0, descripcion: '' });
            }
        } catch (error) {
            setNotification('Error al cargar el contenido');
        } finally {
            setVideosLoading(false);
        }
    };

    // Subir video con datos del influencer
    // Función modificada para subir video
    const handleUploadVideo = async () => {
        if (!selectedVideoUserId || !videoUrl.trim()) {
            setNotification('Por favor ingresa una URL válida');
            return;
        }

        setVideoUploadLoading(true);

        try {
            const response = await fetch(`/infuencersdatos/${selectedVideoUserId}/videos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    content_type: 'video',
                    video_url: videoUrl,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification('Video guardado exitosamente');
                setVideoUrl('');
                await loadUserVideos(selectedVideoUserId);
            } else {
                setNotification(data.error || data.message || 'Error al guardar el video');
            }
        } catch (error) {
            setNotification('Error al guardar el video');
        } finally {
            setVideoUploadLoading(false);
        }
    };
    const handleUploadInfluencerData = async () => {
        if (!selectedVideoUserId || !influencerData.nombre.trim() || !influencerData.descripcion.trim()) {
            setNotification('Por favor completa todos los campos requeridos');
            return;
        }

        setVideoUploadLoading(true);

        try {
            let response;
            if (existingDataId) {
                // Actualizar
                response = await fetch(`/infuencersdatos/${selectedVideoUserId}/datos/${existingDataId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        influencer_data: influencerData,
                    }),
                });
            } else {
                // Crear
                response = await fetch(`/infuencersdatos/${selectedVideoUserId}/videos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        content_type: 'datos',
                        influencer_data: influencerData,
                    }),
                });
            }

            const data = await response.json();
            console.log('Respuesta backend:', data);

            if (response.ok) {
                setNotification(existingDataId ? 'Datos actualizados exitosamente' : 'Datos guardados exitosamente');
                setInfluencerData({ nombre: '', edad: 0, descripcion: '' });
                await loadUserVideos(selectedVideoUserId);
            } else {
                setNotification(data.error || data.message || 'Error al guardar los datos');
            }
        } catch (error) {
            setNotification('Error al guardar los datos');
        } finally {
            setVideoUploadLoading(false);
        }
    };

    // Eliminar video
    const handleDeleteVideo = async (itemId: number) => {
        if (!selectedVideoUserId || !window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;

        try {
            const response = await fetch(`/infuencersdatos/${selectedVideoUserId}/videos/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setNotification('Elemento eliminado exitosamente');
                await loadUserVideos(selectedVideoUserId);
            } else {
                setNotification(data.error || 'Error al eliminar el elemento');
            }
        } catch (error) {
            setNotification('Error al eliminar el elemento');
        }
    };

    // Función para extraer ID de video de YouTube
    const getYouTubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
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
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<PhotoCameraIcon />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenPhotoModal(row.id);
                                                }}
                                                sx={{ mr: 1 }}
                                            >
                                                Fotos
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<VideoLibraryIcon />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenVideoModal(row.id);
                                                }}
                                            >
                                                Subir Videos
                                            </Button>
                                        </Box>
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

            {/* Modal de Fotos */}
            <Dialog open={photoModalOpen} onClose={handleClosePhotoModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Gestionar Fotos del Influencer</Typography>
                        <IconButton onClick={handleClosePhotoModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {/* Subir nuevas fotos */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Subir nuevas fotos
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                                Seleccionar Fotos
                                <input type="file" hidden multiple accept="image/*" onChange={handleFileSelect} />
                            </Button>
                            {selectedFiles.length > 0 && (
                                <Typography variant="body2" color="textSecondary">
                                    {selectedFiles.length} archivo{selectedFiles.length > 1 ? 's' : ''} seleccionado
                                    {selectedFiles.length > 1 ? 's' : ''}
                                </Typography>
                            )}
                        </Box>

                        {selectedFiles.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                    Vista previa:
                                </Typography>
                                <Grid container spacing={2}>
                                    {selectedFiles.map((file, index) => (
                                        <Grid item xs={6} sm={4} md={3} key={index}>
                                            <Box sx={{ position: 'relative' }}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '120px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: 'block',
                                                        mt: 1,
                                                        textAlign: 'center',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {file.name}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleUploadPhotos}
                                        disabled={uploadLoading}
                                        startIcon={uploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                    >
                                        {uploadLoading ? 'Subiendo...' : 'Subir Fotos'}
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Fotos existentes */}
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Fotos actuales
                        </Typography>

                        {photosLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : userPhotos.length === 0 ? (
                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                                No hay fotos subidas para este influencer
                            </Typography>
                        ) : (
                            <ImageList cols={3} rowHeight={200} gap={8}>
                                {userPhotos.map((photo) => (
                                    <ImageListItem key={photo.id}>
                                        <img
                                            src={photo.path}
                                            alt={photo.nombre}
                                            loading="lazy"
                                            style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <ImageListItemBar
                                            title={photo.nombre}
                                            actionIcon={
                                                <IconButton
                                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                    onClick={() => handleDeletePhoto(photo.id)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClosePhotoModal}>Cerrar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={videoModalOpen} onClose={handleCloseVideoModal} fullWidth maxWidth="md">
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Gestionar Contenido del Influencer</Typography>
                        <IconButton onClick={handleCloseVideoModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        maxHeight: '75vh',
                        overflowY: 'auto',
                    }}
                >
                    <Grid container spacing={3}>
                        {/* Tipo de contenido */}
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Tipo de Contenido
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant={contentType === 'video' ? 'contained' : 'outlined'}
                                            onClick={() => setContentType('video')}
                                            startIcon={<VideoLibraryIcon />}
                                            fullWidth
                                        >
                                            Video
                                        </Button>
                                        <Button
                                            variant={contentType === 'datos' ? 'contained' : 'outlined'}
                                            onClick={() => setContentType('datos')}
                                            startIcon={<EditIcon />}
                                            fullWidth
                                        >
                                            Datos del Influencer
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Contenido dinámico */}
                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    {contentType === 'video' ? (
                                        <Stack spacing={2}>
                                            <Typography variant="h6">Agregar Video</Typography>

                                            <TextField
                                                fullWidth
                                                label="Link del video"
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                variant="outlined"
                                                value={videoUrl}
                                                onChange={(e) => setVideoUrl(e.target.value)}
                                                error={videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')}
                                                helperText={
                                                    videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')
                                                        ? 'Por favor ingresa una URL válida de YouTube'
                                                        : ''
                                                }
                                            />

                                            {/* Vista previa */}
                                            {videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) && (
                                                <Box>
                                                    <Typography variant="body2">Vista previa:</Typography>
                                                    {(() => {
                                                        const videoId = getYouTubeVideoId(videoUrl);
                                                        return videoId ? (
                                                            <Box
                                                                sx={{
                                                                    position: 'relative',
                                                                    paddingBottom: '56.25%',
                                                                    height: 0,
                                                                    overflow: 'hidden',
                                                                    borderRadius: 1,
                                                                }}
                                                            >
                                                                <iframe
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: '100%',
                                                                        height: '100%',
                                                                    }}
                                                                    src={`https://www.youtube.com/embed/${videoId}`}
                                                                    title="Vista previa del video"
                                                                    frameBorder="0"
                                                                    allowFullScreen
                                                                />
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="error">
                                                                URL de video no válida
                                                            </Typography>
                                                        );
                                                    })()}
                                                </Box>
                                            )}

                                            <Button
                                                variant="contained"
                                                startIcon={videoUploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                                onClick={handleUploadVideo}
                                                disabled={videoUploadLoading || !videoUrl.trim()}
                                                fullWidth
                                            >
                                                {videoUploadLoading ? 'Guardando...' : 'Guardar Video'}
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack spacing={2}>
                                            <Typography variant="h6">Datos del Influencer</Typography>

                                            <TextField
                                                fullWidth
                                                label="Nombre"
                                                value={influencerData.nombre}
                                                onChange={(e) => setInfluencerData((prev) => ({ ...prev, nombre: e.target.value }))}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Edad"
                                                type="number"
                                                value={influencerData.edad || ''}
                                                onChange={(e) =>
                                                    setInfluencerData((prev) => ({
                                                        ...prev,
                                                        edad: parseInt(e.target.value) || 0,
                                                    }))
                                                }
                                                inputProps={{ min: 1, max: 120 }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Descripción"
                                                multiline
                                                rows={4}
                                                value={influencerData.descripcion}
                                                onChange={(e) => setInfluencerData((prev) => ({ ...prev, descripcion: e.target.value }))}
                                            />

                                            <Button
                                                variant="contained"
                                                startIcon={videoUploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                                onClick={handleUploadInfluencerData}
                                                disabled={videoUploadLoading || !influencerData.nombre.trim() || !influencerData.descripcion.trim()}
                                                fullWidth
                                            >
                                                {videoUploadLoading ? 'Guardando...' : 'Guardar Datos'}
                                            </Button>
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Contenido actual */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Contenido Actual
                            </Typography>

                            {videosLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : userItems.length === 0 ? (
                                <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 3 }}>
                                    No hay contenido guardado para este influencer
                                </Typography>
                            ) : (
                                <Grid container spacing={2}>
                                    {userItems.map((item) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    {item.tipo === 'video' ? (
                                                        <>
                                                            {(() => {
                                                                const videoId = getYouTubeVideoId(item.url);
                                                                return videoId ? (
                                                                    <Box
                                                                        sx={{
                                                                            position: 'relative',
                                                                            paddingBottom: '56.25%',
                                                                            height: 0,
                                                                            overflow: 'hidden',
                                                                            borderRadius: 1,
                                                                            mb: 2,
                                                                        }}
                                                                    >
                                                                        <iframe
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: 0,
                                                                                left: 0,
                                                                                width: '100%',
                                                                                height: '100%',
                                                                            }}
                                                                            src={`https://www.youtube.com/embed/${videoId}`}
                                                                            title={item.nombre}
                                                                            frameBorder="0"
                                                                            allowFullScreen
                                                                        />
                                                                    </Box>
                                                                ) : (
                                                                    <Typography variant="body2" color="error">
                                                                        Video no disponible
                                                                    </Typography>
                                                                );
                                                            })()}
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                Video
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {item.nombre}
                                                            </Typography>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                                                <Typography variant="subtitle2" color="primary">
                                                                    DATOS DEL INFLUENCER
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {item.influencer_data?.nombre || 'Sin nombre'}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                Edad: {item.influencer_data?.edad || 'No especificada'}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {item.influencer_data?.descripcion || 'Sin descripción'}
                                                            </Typography>
                                                        </>
                                                    )}

                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                        <IconButton color="error" onClick={() => handleDeleteVideo(item.id)} size="small">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseVideoModal}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notificación */}
            <Snackbar open={!!notification} message={notification} onClose={() => setNotification(null)} autoHideDuration={4000} />
        </AppLayout>
    );
}
