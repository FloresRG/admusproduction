import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Card, Avatar, Button, Grid, Box, Typography, 
    ImageList, ImageListItem, Divider, Container,
    Chip, Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useTheme } from '@mui/material/styles';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel de Control', href: '/' },
    { title: 'Perfil de Influencer', href: '/tiposinfluencers' },
];

export default function InfluencerProfile() {
    const theme = useTheme();
    const sampleData = {
        user: {
            name: "Alexandra Thompson",
            email: "alexandra.t@empresa.com",
            avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        datos: {
            biografia: "Creadora de contenido digital especializada en tecnología y estilo de vida | +750k seguidores en redes sociales | Embajadora de marcas premium | Experta en marketing digital y tendencias",
            telefono: "+34 612 345 678",
            ciudad: "Barcelona, España",
            redesSociales: {
                instagram: "@alexandra.tech",
                youtube: "AlexandraTech",
                tiktok: "@alex.trending"
            }
        },
        tipos: [
            { id: 1, nombre: "Tecnología", color: "#2196f3" },
            { id: 2, nombre: "Lifestyle", color: "#4caf50" },
            { id: 3, nombre: "Marketing Digital", color: "#9c27b0" },
            { id: 4, nombre: "Moda Sostenible", color: "#ff9800" }
        ],
        photos: [
            {
                id: 1,
                url: "https://images.unsplash.com/photo-1614786269829-d24616faf56d",
                nombre: "Sesión Tech Review"
            },
            {
                id: 2,
                url: "https://images.unsplash.com/photo-1589216532372-1c2a367900d9",
                nombre: "Lifestyle Workspace"
            },
            {
                id: 3,
                url: "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381",
                nombre: "Digital Marketing"
            },
            {
                id: 4,
                url: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e",
                nombre: "Sustainable Fashion"
            },
            {
                id: 5,
                url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
                nombre: "Tech Workshop"
            },
            {
                id: 6,
                url: "https://images.unsplash.com/photo-1540331547168-8b63109225b7",
                nombre: "Creative Space"
            }
        ],
        availabilities: [
            {
                id: 1,
                date: "2025-06-15",
                time_start: "09:00",
                time_end: "12:00",
                status: "disponible"
            },
            {
                id: 2,
                date: "2025-06-16",
                time_start: "14:00",
                time_end: "18:00",
                status: "reservado"
            },
            {
                id: 3,
                date: "2025-06-17",
                time_start: "10:00",
                time_end: "15:00",
                status: "disponible"
            }
        ]
    };

    const [profileData, setProfileData] = useState(sampleData);
    const [loading, setLoading] = useState(false);

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil de Influencer" />
            
            <Box sx={{ 
                bgcolor: 'background.default',
                minHeight: '100vh',
                position: 'relative'
            }}>
                {/* Portada */}
                <Box
                    sx={{
                        height: 400,
                        width: '100%',
                        position: 'relative',
                        backgroundImage: `url(${profileData.photos[0].url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(2px)'
                        }
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
                        zIndex: 2
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

                    <Grid container spacing={3}>
                        
                        <Grid item xs={12} md={9}>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 2,
                                    bgcolor: 'background.paper',
                                    mb: 3
                                }}
                            >
                                <Typography variant="h5" gutterBottom>
                                    Biografía
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {profileData.datos.biografia}
                                </Typography>

                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} md={4}>
                                        <Box display="flex" alignItems="center">
                                            <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Typography>{profileData.user.email}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box display="flex" alignItems="center">
                                            <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Typography>{profileData.datos.telefono}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Box display="flex" alignItems="center">
                                            <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                                            <Typography>{profileData.datos.ciudad}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Galería */}
                            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h5">
                                        Portafolio
                                    </Typography>
                                    <Button
                                        startIcon={<PhotoCamera />}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Añadir Contenido
                                    </Button>
                                </Box>
                                <Box sx={{ 
                                    '.slick-slide': { px: 1 },
                                    '.slick-dots': { bottom: -45 },
                                    pb: 5
                                }}>
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
                                                            transition: 'transform 0.3s ease-in-out'
                                                        }
                                                    }}
                                                >
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.nombre}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
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
                                                            p: 2
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1">
                                                            {photo.nombre}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        ))}
                                    </Slider>
                                </Box>
                            </Paper>

                            {/* Calendario */}
                            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h5">
                                        Disponibilidad
                                    </Typography>
                                    <Button
                                        startIcon={<CalendarMonthIcon />}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Gestionar Horarios
                                    </Button>
                                </Box>
                                <Grid container spacing={2}>
                                    {profileData.availabilities.map((slot) => (
                                        <Grid item xs={12} md={4} key={slot.id}>
                                            <Paper
                                                variant="outlined"
                                                sx={{ 
                                                    p: 2,
                                                    bgcolor: slot.status === 'disponible' ? 'success.light' : 'warning.light',
                                                    height: '100%'
                                                }}
                                            >
                                                <Typography variant="h6" gutterBottom>
                                                    {new Date(slot.date).toLocaleDateString('es-ES', { 
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                                <Typography>
                                                    {slot.time_start} - {slot.time_end}
                                                </Typography>
                                                <Chip 
                                                    label={slot.status}
                                                    color={slot.status === 'disponible' ? 'success' : 'warning'}
                                                    sx={{ mt: 1 }}
                                                />
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </AppLayout>
    );
}