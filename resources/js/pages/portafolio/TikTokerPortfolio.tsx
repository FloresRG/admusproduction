import Header from '@/components/header copy';
import { Head, Link } from '@inertiajs/react';

import { ArrowBackIos, ArrowForwardIos, Favorite, FavoriteBorder, Group, TrendingUp, Verified, Visibility } from '@mui/icons-material';
import { Avatar, Badge, Box, Button, Card, CardContent, Chip, Container, Grid, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import Footer from '../home/footer';

type Influencer = {
    id: number;
    name: string;
    username: string;
    followers: string;
    category: string;
    description: string;
    avatar: string;
    coverImage: string;
    verified: boolean;
    engagement: string;
    rating: string;
    specialties: string[];
    videos: string[];
    gallery: string[];
    price?: string;
    availability?: 'available' | 'busy' | 'offline';
};

interface PageProps {
    influencers: Influencer[];
}

const AvailabilityChip = ({ status }: { status: string }) => {
    const colors = {
        available: { bg: '#00ff41', text: 'EN LÍNEA', glow: '0 0 10px #00ff41' },
        busy: { bg: '#ff6b35', text: 'OCUPADO', glow: '0 0 10px #ff6b35' },
        offline: { bg: '#666', text: 'OFFLINE', glow: '0 0 10px #666' },
    };

    const config = colors[status as keyof typeof colors] || colors.available;

    return (
        <Chip
            label={config.text}
            size="small"
            sx={{
                bgcolor: config.bg,
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.65rem',
                height: 20,
                boxShadow: config.glow,
                '& .MuiChip-label': { px: 1 },
            }}
        />
    );
};

const ImageCarousel = ({ images, name }: { images: string[]; name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images.length) return null;

    return (
        <Box sx={{ position: 'relative', height: 160, overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
            <Box
                component="img"
                src={images[currentIndex]}
                alt={`${name} - ${currentIndex + 1}`}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'all 0.5s ease',
                    filter: 'brightness(0.9) contrast(1.1)',
                }}
            />

            {/* Overlay gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                }}
            />

            {/* Navigation buttons */}
            {images.length > 1 && (
                <>
                    <IconButton
                        onClick={prevImage}
                        sx={{
                            position: 'absolute',
                            left: 4,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: '#ff1744',
                            width: 28,
                            height: 28,
                            '&:hover': { bgcolor: 'rgba(255,23,68,0.2)' },
                        }}
                    >
                        <ArrowBackIos sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton
                        onClick={nextImage}
                        sx={{
                            position: 'absolute',
                            right: 4,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: '#ff1744',
                            width: 28,
                            height: 28,
                            '&:hover': { bgcolor: 'rgba(255,23,68,0.2)' },
                        }}
                    >
                        <ArrowForwardIos sx={{ fontSize: 14 }} />
                    </IconButton>
                </>
            )}

            {/* Image indicators */}
            {images.length > 1 && (
                <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    {images.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: idx === currentIndex ? '#ff1744' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: idx === currentIndex ? '0 0 8px #ff1744' : 'none',
                            }}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default function TikTokerPortfolio({ influencers }: PageProps) {
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    const toggleFavorite = (id: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        setFavorites(newFavorites);
    };

    return (
        <>
            <Header />
            <Box
                sx={{
                    height: '64px',
                    bgcolor: 'rgba(0, 0, 0, 0.95)',
                    zIndex: 75,
                }}
            />

            <Head title="Catálogo de Influencers" />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 25%, #2a1018 50%, #1a0a0f 75%, #0a0a0a 100%)',
                    py: 3,
                }}
            >
                <Container maxWidth="xl">
                    {/* Header Futurista */}
                    <Box
                        sx={{
                            p: 4,
                            mb: 4,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #ff1744 0%, #d50000 50%, #b71c1c 100%)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 0 30px rgba(255,23,68,0.3)',
                        }}
                    >
                        {/* Geometric overlay */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '100%',
                                height: '100%',
                                background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
                                opacity: 0.1,
                            }}
                        />

                        <Typography variant="h3" gutterBottom fontWeight="bold" textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
                            ⚡ CATÁLOGO DE INFLUENCERS
                        </Typography>
                        <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
                            CONECTA CON LOS MEJORES CREADORES DIGITALES
                        </Typography>
                    </Box>

                    {/* Grid de Influencers */}
                    <Grid container spacing={3}>
                        {influencers.map((inf) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={inf.id}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
                                        border: '1px solid #333',
                                        transition: 'all 0.4s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-8px) scale(1.02)',
                                            boxShadow: '0 20px 40px rgba(255,23,68,0.2)',
                                            border: '1px solid #ff1744',
                                        },
                                        position: 'relative',
                                        height: 480,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Carrusel de Imágenes */}
                                    <ImageCarousel images={inf.gallery.length > 0 ? inf.gallery : [inf.coverImage]} name={inf.name} />

                                    {/* Status y Favorito */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            left: 12,
                                            right: 12,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            zIndex: 2,
                                        }}
                                    >
                                        <AvailabilityChip status={inf.availability || 'available'} />
                                        <IconButton
                                            onClick={() => toggleFavorite(inf.id)}
                                            sx={{
                                                bgcolor: 'rgba(0,0,0,0.7)',
                                                color: favorites.has(inf.id) ? '#ff1744' : '#fff',
                                                width: 32,
                                                height: 32,
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,23,68,0.2)',
                                                    transform: 'scale(1.1)',
                                                },
                                            }}
                                        >
                                            {favorites.has(inf.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                                        </IconButton>
                                    </Box>

                                    {/* Contenido de la Card */}
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            p: 2.5,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            bgcolor: '#1a1a1a',
                                        }}
                                    >
                                        {/* Avatar + Info Principal */}
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={inf.verified ? <Verified sx={{ color: '#00ff41', fontSize: 16 }} /> : null}
                                            >
                                                <Avatar
                                                    src={inf.avatar}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        border: '2px solid #ff1744',
                                                        boxShadow: '0 0 15px rgba(255,23,68,0.3)',
                                                    }}
                                                />
                                            </Badge>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="h6" fontWeight="bold" noWrap sx={{ color: '#fff' }}>
                                                    {inf.name}
                                                </Typography>
                                                <Typography variant="body2" noWrap sx={{ color: '#aaa' }}>
                                                    @{inf.username}
                                                </Typography>
                                                <Chip
                                                    label={inf.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#ff1744',
                                                        color: '#fff',
                                                        fontSize: '0.65rem',
                                                        height: 18,
                                                        mt: 0.5,
                                                    }}
                                                />
                                            </Box>
                                        </Stack>

                                        {/* Descripción */}
                                        <Typography
                                            variant="body2"
                                            mb={2}
                                            sx={{
                                                color: '#ccc',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                fontSize: '0.8rem',
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {inf.description}
                                        </Typography>

                                        {/* Métricas Futuristas */}
                                        <Grid container spacing={1.5} mb={2}>
                                            <Grid item xs={6}>
                                                <Box
                                                    sx={{
                                                        bgcolor: '#2a2a2a',
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        border: '1px solid #444',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Group sx={{ fontSize: 18, color: '#00ff41', mb: 0.5 }} />
                                                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#fff', fontSize: '0.9rem' }}>
                                                        {inf.followers}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                                                        SEGUIDORES
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box
                                                    sx={{
                                                        bgcolor: '#2a2a2a',
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        border: '1px solid #444',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <TrendingUp sx={{ fontSize: 18, color: '#ff1744', mb: 0.5 }} />
                                                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#fff', fontSize: '0.9rem' }}>
                                                        {inf.engagement}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem' }}>
                                                        ENGAGEMENT
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        {/* Rating con Progress Bar */}
                                        <Box mb={2}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.5}>
                                                <Typography variant="caption" sx={{ color: '#aaa' }}>
                                                    RATING
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#ff1744' }}>
                                                    {inf.rating}/5.0
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(parseFloat(inf.rating) / 5) * 100}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    bgcolor: '#333',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: '#ff1744',
                                                        boxShadow: '0 0 10px #ff1744',
                                                    },
                                                }}
                                            />
                                        </Box>

                                        {/* Especialidades */}
                                        <Box mb={2}>
                                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                                                {inf.specialties.slice(0, 2).map((esp, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={esp}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#333',
                                                            color: '#fff',
                                                            border: '1px solid #555',
                                                            fontSize: '0.7rem',
                                                            height: 22,
                                                            '&:hover': {
                                                                bgcolor: '#ff1744',
                                                                borderColor: '#ff1744',
                                                                boxShadow: '0 0 8px rgba(255,23,68,0.5)',
                                                            },
                                                        }}
                                                    />
                                                ))}
                                                {inf.specialties.length > 2 && (
                                                    <Chip
                                                        label={`+${inf.specialties.length - 2}`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#ff1744',
                                                            color: '#fff',
                                                            fontSize: '0.7rem',
                                                            height: 22,
                                                            boxShadow: '0 0 8px rgba(255,23,68,0.3)',
                                                        }}
                                                    />
                                                )}
                                            </Stack>
                                        </Box>

                                        {/* Espaciador */}
                                        <Box sx={{ flexGrow: 1 }} />

                                        {/* Precio */}
                                        {inf.price && (
                                            <Box mb={2} textAlign="center">
                                                <Typography variant="h6" sx={{ color: '#00ff41', fontWeight: 'bold' }}>
                                                    {inf.price}
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Botón de Acción */}
                                        <Link href={`/influencers/${inf.id}`}>
                                            <Button
                                                variant="contained"
                                                startIcon={<Visibility />}
                                                fullWidth
                                                sx={{
                                                    borderRadius: 25,
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem',
                                                    background: 'linear-gradient(45deg, #ff1744 30%, #d50000 90%)',
                                                    py: 1.2,
                                                    boxShadow: '0 0 20px rgba(255,23,68,0.3)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #d50000 30%, #b71c1c 90%)',
                                                        boxShadow: '0 0 25px rgba(255,23,68,0.5)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                }}
                                            >
                                                VER PERFIL
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
              {/* Footer con fondo negro */}
                  <div className="bg-black">
                    <Footer />
                  </div>
        </>
    );
}
