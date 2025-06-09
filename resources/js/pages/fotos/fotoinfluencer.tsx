import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

type Props = {
    user: {
        id: number;
        name: string;
        email: string;
    };
};

export default function FotoInfluencer({ user }: Props) {
    const [photos, setPhotos] = useState<File[]>([]); // Array de fotos
    const [previews, setPreviews] = useState<string[]>([]); // URLs de previsualización
    const [error, setError] = useState<string | null>(null);

    const { flash = {} } = usePage().props as any;

    useEffect(() => {
        if (photos.length === 0) {
            setPreviews([]);
            return;
        }

        // Generar URLs para todas las fotos seleccionadas
        const objectUrls = photos.map((photo) => URL.createObjectURL(photo));
        setPreviews(objectUrls);

        // Limpiar URLs al desmontar o cambiar fotos
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
            formData.append('photos[]', photo); // Array en el backend: photos[]
        });

        Inertia.post(`/users/${user.id}/photos`, formData, {
            onError: (errors) => {
                setError(errors.photos || 'Error al subir las fotos');
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Subir fotos - ${user.name}`} />
            <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
                <Typography variant="h5" mb={2}>
                    Subir fotos para {user.name}
                </Typography>

                {flash.success && <Typography color="success.main">{flash.success}</Typography>}
                {error && <Typography color="error.main">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <input type="file" accept="image/*" multiple onChange={(e) => setPhotos(e.target.files ? Array.from(e.target.files) : [])} />

                    <Box sx={{ mt: 2, mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {previews.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Vista previa ${index + 1}`}
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                            />
                        ))}
                    </Box>

                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Subir fotos
                    </Button>
                </form>
            </Box>
        </AppLayout>
    );
}
