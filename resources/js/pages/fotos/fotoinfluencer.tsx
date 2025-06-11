import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
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

        return () => {
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [photos]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (photos.length === 0) {
            setError('Debes seleccionar al menos una foto');
            return;
        }

        const formData = new FormData();
        photos.forEach((photo) => {
            formData.append('photos[]', photo);
        });

        Inertia.post(`/users/${user.id}/photos`, formData, {
            onError: (errors) => {
                setError(errors.photos || 'Error al subir las fotos');
            },
        });
    };

    const removeImage = (indexToRemove: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== indexToRemove));
    };

    return (
        <AppLayout>
            <Head title={`Subir fotos - ${user.name}`} />
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Typography variant="h5" mb={2}>
                    Subir fotos para {user.name}
                </Typography>

                {flash.success && <Typography color="success.main">{flash.success}</Typography>}
                {error && <Typography color="error.main">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <Paper
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed #ccc',
                            padding: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            mb: 2,
                            bgcolor: '#f9f9f9',
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography variant="body1">Arrastra y suelta tus fotos aquí</Typography>
                        <Button variant="outlined" startIcon={<AddPhotoAlternateIcon />} sx={{ mt: 2 }} onClick={open}>
                            Agregar fotos
                        </Button>
                    </Paper>

                    {previews.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
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

                    <Button type="submit" variant="contained">
                        Subir fotos
                    </Button>
                </form>
            </Box>
        </AppLayout>
    );
}
