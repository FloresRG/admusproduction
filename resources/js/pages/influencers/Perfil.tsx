import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, Chip, Container, Grid, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Perfil de Influencer', href: '/perfil-influencer' }];

// Definir tipos para TypeScript
interface Photo {
    id: number;
    url: string;
    nombre: string;
}

interface User {
    name: string;
    email: string;
    avatar: string;
}

interface Datos {
    biografia: string;
    telefono: string;
    ciudad: string;
    redesSociales: {
        instagram: string;
        youtube: string;
        tiktok: string;
    };
}

interface Availability {
    id: number;
    date: string;
    time_start: string;
    time_end: string;
    day_of_week: string;
    turno: string;
    status: string;
}

interface Tipo {
    id: number;
    nombre: string;
    color: string;
}

interface ProfileData {
    user: User;
    datos: Datos;
    tipos: Tipo[];
    photos: Photo[];
    availabilities: Availability[];
}

interface Props {
    profileData: ProfileData;
}

export default function InfluencerProfile({ profileData: initialProfileData }: Props) {
    const theme = useTheme();
    const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
    const [loading, setLoading] = useState(false);

    // Obtener las primeras dos fotos para el fondo
    const getBackgroundImages = () => {
        if (profileData.photos.length >= 2) {
            return [profileData.photos[0].url, profileData.photos[1].url];
        } else if (profileData.photos.length === 1) {
            return [profileData.photos[0].url, profileData.photos[0].url];
        } else {
            // Fotos por defecto si no hay fotos del usuario
            return ['https://images.unsplash.com/photo-1614786269829-d24616faf56d', 'https://images.unsplash.com/photo-1589216532372-1c2a367900d9'];
        }
    };

    const backgroundImages = getBackgroundImages();

    const carouselSettings = {
        dots: true,
        infinite: profileData.photos.length > 3,
        speed: 500,
        slidesToShow: Math.min(3, profileData.photos.length),
        slidesToScroll: 1,
        autoplay: profileData.photos.length > 1,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(2, profileData.photos.length),
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const getBackgroundImage = () => {
        return profileData.user.avatar || 'https://images.unsplash.com/photo-1614786269829-d24616faf56d';
    };
    const diasSemana: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil de Influencer" />

            <Box
                sx={{
                    bgcolor: 'background.default',
                    minHeight: '100vh',
                    position: 'relative',
                }}
            >
                {/* Portada con Gradiente de las dos primeras fotos */}
                <Box
                    sx={{
                        height: 400,
                        width: '100%',
                        position: 'relative',
                        background: `linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${getBackgroundImage()}) no-repeat center center / cover`,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            backdropFilter: 'blur(1px)',
                        },
                    }}
                />

                {/* Foto de Perfil Centrada */}
                <Avatar
                    sx={{
                        width: 200,
                        height: 200,
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: 300,
                        border: '4px solid white',
                        boxShadow: theme.shadows[3],
                        zIndex: 2,
                    }}
                    src={profileData.user.avatar}
                />

                {/* Contenido Principal */}
                <Container maxWidth="xl" sx={{ mt: 15, position: 'relative' }}>
                    {/* Nombre y Biografía Centrados */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                            {profileData.user.name}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                            {profileData.datos.biografia}
                        </Typography>
                    </Box>

                    {/* Tipos de Influencer */}
                    {profileData.tipos && profileData.tipos.length > 0 && (
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            {profileData.tipos.map((tipo) => (
                                <Chip
                                    key={tipo.id}
                                    label={tipo.nombre}
                                    sx={{
                                        bgcolor: tipo.color,
                                        color: 'white',
                                        mr: 1,
                                        mb: 1,
                                        fontWeight: 'bold',
                                    }}
                                />
                            ))}
                        </Box>
                    )}

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={9}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    mb: 3,
                                }}
                            >
                                <Typography variant="h5" gutterBottom>
                                    Información de Contacto
                                </Typography>

                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} md={4}>
                                        <Box display="flex" alignItems="center">
                                            <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Typography>{profileData.user.email}</Typography>
                                        </Box>
                                    </Grid>
                                    {profileData.datos.telefono && (
                                        <Grid item xs={12} md={4}>
                                            <Box display="flex" alignItems="center">
                                                <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                                                <Typography>{profileData.datos.telefono}</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                    {profileData.datos.ciudad && (
                                        <Grid item xs={12} md={4}>
                                            <Box display="flex" alignItems="center">
                                                <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                                                <Typography>{profileData.datos.ciudad}</Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>

                                {/* Redes Sociales */}
                                {(profileData.datos.redesSociales.instagram ||
                                    profileData.datos.redesSociales.youtube ||
                                    profileData.datos.redesSociales.tiktok) && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Redes Sociales
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {profileData.datos.redesSociales.instagram && (
                                                <Grid item>
                                                    <Chip
                                                        label={`Instagram: ${profileData.datos.redesSociales.instagram}`}
                                                        color="secondary"
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                            )}
                                            {profileData.datos.redesSociales.youtube && (
                                                <Grid item>
                                                    <Chip
                                                        label={`YouTube: ${profileData.datos.redesSociales.youtube}`}
                                                        color="error"
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                            )}
                                            {profileData.datos.redesSociales.tiktok && (
                                                <Grid item>
                                                    <Chip
                                                        label={`TikTok: ${profileData.datos.redesSociales.tiktok}`}
                                                        color="info"
                                                        variant="outlined"
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>

                            {/* Galería */}
                            {profileData.photos.length > 0 && (
                                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                    <Box
                                        sx={{
                                            '.slick-slide': { px: 1 },
                                            '.slick-dots': { bottom: -45 },
                                            pb: 5,
                                        }}
                                    >
                                        <Slider {...carouselSettings}>
                                            {profileData.photos.map((photo) => (
                                                <Box key={photo.id}>
                                                    <Paper
                                                        elevation={2}
                                                        sx={{
                                                            borderRadius: 2,
                                                            overflow: 'hidden',
                                                            height: 300,
                                                            position: 'relative',
                                                            '&:hover': {
                                                                transform: 'scale(1.02)',
                                                                transition: 'transform 0.3s ease-in-out',
                                                            },
                                                        }}
                                                    >
                                                        <img
                                                            src={photo.url}
                                                            alt={photo.nombre}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bgcolor: 'rgba(0,0,0,0.7)',
                                                                color: 'white',
                                                                p: 2,
                                                            }}
                                                        >
                                                            <Typography variant="subtitle1">{photo.nombre}</Typography>
                                                        </Box>
                                                    </Paper>
                                                </Box>
                                            ))}
                                        </Slider>
                                    </Box>
                                </Paper>
                            )}

                            {/* Disponibilidad */}
                            {profileData.availabilities && profileData.availabilities.length > 0 && (
                                <Paper
                                    elevation={6}
                                    sx={{
                                        p: 4,
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #f0f4ff, #e0f7fa)',
                                        mb: 5,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            Disponibilidad
                                        </Typography>
                                        <Button
                                            startIcon={<CalendarMonthIcon />}
                                            variant="contained"
                                            color="primary"
                                            sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                        >
                                            Gestionar Horarios
                                        </Button>
                                    </Box>

                                    <Grid container spacing={3}>
                                        {profileData.availabilities.map((slot) => (
                                            <Grid item xs={12} md={4} key={slot.id}>
                                                <Paper
                                                    elevation={3}
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: 3,
                                                        background:
                                                            slot.status === 'disponible'
                                                                ? 'linear-gradient(135deg, #e0f7fa, #b2ebf2)'
                                                                : 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                                                        color: 'text.primary',
                                                        transition: 'transform 0.3s',
                                                        '&:hover': {
                                                            transform: 'scale(1.02)',
                                                        },
                                                    }}
                                                >
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                        {diasSemana[slot.day_of_week] ?? slot.day_of_week}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 0.5 }}>
                                                        <strong>Turno:</strong> {slot.turno}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Horario:</strong> {slot.time_start} – {slot.time_end}
                                                    </Typography>

                                                    <Chip
                                                        label={slot.status}
                                                        color={slot.status === 'disponible' ? 'success' : 'warning'}
                                                        variant="filled"
                                                        sx={{ mt: 2 }}
                                                    />
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            )}

                            {/* Mensaje si no hay fotos */}
                            {profileData.photos.length === 0 && (
                                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                                    <PhotoCamera sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                                    <Typography variant="h6" color="textSecondary" gutterBottom>
                                        No tienes fotos en tu portafolio
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                        Añade fotos para mostrar tu trabajo y atraer más clientes
                                    </Typography>
                                    <Button variant="contained" startIcon={<PhotoCamera />} color="primary">
                                        Subir Primera Foto
                                    </Button>
                                </Paper>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </AppLayout>
    );
}
