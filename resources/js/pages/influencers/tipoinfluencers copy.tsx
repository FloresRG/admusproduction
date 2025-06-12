import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Avatar, Button, Grid, Box, Typography, ImageList, ImageListItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mi Perfil', href: '/tiposinfluencers' },
];

export default function InfluencerProfile() {
    const [profileData, setProfileData] = useState({
        user: {},
        datos: {},
        tipos: [],
        photos: [],
        availabilities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/influencer/profile');
                setProfileData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi Perfil" />
            
            <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
                {/* Portada y Foto de Perfil */}
                <Card sx={{ position: 'relative', mb: 4 }}>
                    <Box
                        sx={{
                            height: 250,
                            bgcolor: 'grey.300',
                            position: 'relative'
                        }}
                    >
                        {profileData.photos?.[0]?.url && (
                            <img
                                src={profileData.photos[0].url}
                                alt="Portada"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                        <Button
                            startIcon={<PhotoCamera />}
                            variant="contained"
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16
                            }}
                        >
                            Cambiar Portada
                        </Button>
                    </Box>
                    
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end' }}>
                        <Avatar
                            sx={{
                                width: 150,
                                height: 150,
                                border: '4px solid white',
                                marginTop: '-75px'
                            }}
                            src={profileData.user?.avatar}
                        />
                        <Box sx={{ ml: 3 }}>
                            <Typography variant="h4">
                                {profileData.user?.name}
                            </Typography>
                            <Typography color="textSecondary">
                                {profileData.datos?.biografia || 'Sin biografía'}
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                <Grid container spacing={3}>
                    {/* Información Personal */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Información Personal
                                <Button
                                    startIcon={<EditIcon />}
                                    size="small"
                                    sx={{ float: 'right' }}
                                >
                                    Editar
                                </Button>
                            </Typography>
                            <Typography><strong>Email:</strong> {profileData.user?.email}</Typography>
                            <Typography><strong>Teléfono:</strong> {profileData.datos?.telefono}</Typography>
                            <Typography><strong>Ciudad:</strong> {profileData.datos?.ciudad}</Typography>
                        </Card>

                        {/* Tipos de Influencer */}
                        <Card sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Categorías
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {profileData.tipos?.map((tipo: any) => (
                                    <Button
                                        key={tipo.id}
                                        variant="outlined"
                                        size="small"
                                    >
                                        {tipo.nombre}
                                    </Button>
                                ))}
                            </Box>
                        </Card>
                    </Grid>

                    {/* Galería de Fotos */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Galería
                                <Button
                                    startIcon={<PhotoCamera />}
                                    size="small"
                                    sx={{ float: 'right' }}
                                >
                                    Agregar Fotos
                                </Button>
                            </Typography>
                            <ImageList sx={{ width: '100%' }} cols={3} rowHeight={200}>
                                {profileData.photos?.map((photo: any) => (
                                    <ImageListItem key={photo.id}>
                                        <img
                                            src={photo.url}
                                            alt={photo.nombre}
                                            loading="lazy"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Card>

                        {/* Disponibilidad */}
                        <Card sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Disponibilidad
                                <Button
                                    startIcon={<CalendarMonthIcon />}
                                    size="small"
                                    sx={{ float: 'right' }}
                                >
                                    Gestionar
                                </Button>
                            </Typography>
                            {profileData.availabilities?.map((availability: any) => (
                                <Box key={availability.id} sx={{ mb: 1 }}>
                                    <Typography>
                                        {new Date(availability.date).toLocaleDateString()} - 
                                        {availability.time_start} a {availability.time_end}
                                    </Typography>
                                </Box>
                            ))}
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </AppLayout>
    );
}