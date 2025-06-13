import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
    user: {
        id: number;
        name: string;
        email: string;
    };
};

export default function FotoInfluencer({ user }: Props) {
    const [photos, setPhotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [videoLinks, setVideoLinks] = useState<string[]>(['']);
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { flash = {} } = usePage().props as any;

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        setPhotos((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: { 'image/*': [] },
        onDrop,
        noClick: true,
        noKeyboard: true,
        multiple: true,
    });

    useEffect(() => {
        const objectUrls = photos.map((file) => URL.createObjectURL(file));
        setPreviews(objectUrls);
        return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
    }, [photos]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // Tipo foto
        if (photos.length > 0) {
            formData.append('tipo_foto', 'foto');
            photos.forEach((photo) => formData.append('photos[]', photo));
        }

        // Tipo video
        const validLinks = videoLinks.filter((link) => link.trim() !== '');
        if (validLinks.length > 0) {
            formData.append('tipo_video', 'video');
            validLinks.forEach((link) => formData.append('video_links[]', link));
        }

        // Tipo datos
        if (nombre || edad || descripcion) {
            formData.append('tipo_datos', 'datos');
            formData.append('nombre', nombre);
            formData.append('edad', edad);
            formData.append('descripcion', descripcion);
        }

        Inertia.post(`/users/${user.id}/photos`, formData, {
            onError: (errors) => {
                setError(
                    errors.photos ||
                    errors.video_links ||
                    errors.nombre ||
                    errors.edad ||
                    errors.descripcion ||
                    'Error al enviar el formulario'
                );
            },
        });
    };

    const removeImage = (indexToRemove: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== indexToRemove));
    };

    const updateVideoLink = (index: number, value: string) => {
        const updated = [...videoLinks];
        updated[index] = value;
        setVideoLinks(updated);
    };

    const addVideoField = () => setVideoLinks([...videoLinks, '']);
    const removeVideoField = (index: number) => {
        setVideoLinks((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <AppLayout>
            <Head title={`Subir contenido - ${user.name}`} />
            <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Typography variant="h5" mb={2}>
                    Subir contenido para {user.name}
                </Typography>

                {flash.success && <Typography color="success.main">{flash.success}</Typography>}
                {error && <Typography color="error.main">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    {/* Card Foto */}
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Fotos</Typography>
                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: '2px dashed #ccc',
                                    padding: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: '#f9f9f9',
                                    mb: 2,
                                }}
                            >
                                <input {...getInputProps()} />
                                <Typography variant="body1">Arrastra y suelta tus fotos aquí</Typography>
                                <Button variant="outlined" startIcon={<AddPhotoAlternateIcon />} sx={{ mt: 2 }} onClick={open}>
                                    Agregar fotos
                                </Button>
                            </Box>

                            {previews.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {previews.map((src, index) => (
                                        <Box key={index} sx={{ position: 'relative' }}>
                                            <img
                                                src={src}
                                                alt={`Preview ${index}`}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: 8,
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => removeImage(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: -10,
                                                    right: -10,
                                                    backgroundColor: 'white',
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Card Video */}
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Videos</Typography>
                            {videoLinks.map((link, index) => (
                                <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                                    <input
                                        type="text"
                                        value={link}
                                        onChange={(e) => updateVideoLink(index, e.target.value)}
                                        placeholder="https://youtube.com/..."
                                        style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeVideoField(index)}
                                        disabled={videoLinks.length === 1}
                                    >
                                        X
                                    </Button>
                                </Box>
                            ))}
                            <Button variant="text" onClick={addVideoField}>
                                + Agregar otro video
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Card Datos */}
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Datos</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" mb={1}>Nombre</Typography>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Nombre"
                                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" mb={1}>Edad</Typography>
                                <input
                                    type="number"
                                    value={edad}
                                    onChange={(e) => setEdad(e.target.value)}
                                    placeholder="Edad"
                                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                                />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" mb={1}>Descripción</Typography>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Descripción"
                                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', minHeight: 80 }}
                                />
                            </Box>
                        </CardContent>
                    </Card>

                    <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                        Enviar todo
                    </Button>
                </form>
            </Box>
        </AppLayout>
    );
}
