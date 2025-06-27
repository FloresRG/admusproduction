'use client';

import Header from '@/components/header copy';
import { Head, Link } from '@inertiajs/react';
import { Favorite, FavoriteBorder, Search, Star, TrendingUp } from '@mui/icons-material';
import { Box, Card, Chip, Container, Fade, Grid, IconButton, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Footer from '../home/footer';

type Video = {
    id: number;
    title: string;
    url: string;
    thumbnail: string;
    views: number;
    likes: number;
    comments: number;
    duration: string;
};

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
    videos: Video[];
    gallery: string[];
    price?: string;
    availability?: 'available' | 'busy' | 'offline';
    rawData?: Record<string, string | number>;
};

interface PageProps {
    influencers: Influencer[];
}

export default function TikTokerPortfolio({ influencers }: PageProps) {
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Simular loading inicial
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const toggleFavorite = (id: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);
        } else {
            newFavorites.add(id);
        }
        setFavorites(newFavorites);
    };

    // Obtener categorías únicas
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(influencers.map((inf) => inf.category))];
        return uniqueCategories;
    }, [influencers]);

    // Función mejorada para filtrar influencers
    const filteredInfluencers = useMemo(() => {
        return influencers.filter((inf) => {
            const matchesSearch =
                inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inf.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inf.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inf.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = !selectedCategory || inf.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [influencers, searchTerm, selectedCategory]);

    // Función para obtener color de disponibilidad
    const getAvailabilityColor = (availability?: string) => {
        switch (availability) {
            case 'available':
                return '#4caf50';
            case 'busy':
                return '#ff9800';
            case 'offline':
                return '#f44336';
            default:
                return '#9e9e9e';
        }
    };

    // Función para formatear seguidores
    const formatFollowers = (followers: string) => {
        const num = parseFloat(followers.replace(/[^\d.]/g, ''));
        if (followers.includes('M')) return `${num}M`;
        if (followers.includes('K')) return `${num}K`;
        return followers;
    };

    if (loading) {
        return (
            <>
                <Header />
                <Box sx={{ height: '64px', bgcolor: 'rgba(0, 0, 0, 0.95)' }} />
                <Box
                    sx={{
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 25%, #2a1018 50%, #1a0a0f 75%, #0a0a0a 100%)',
                        py: 4,
                    }}
                >
                    <Container maxWidth="xl">
                        <Grid container spacing={3}>
                            {[...Array(8)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <Skeleton
                                        variant="rectangular"
                                        height={320}
                                        sx={{
                                            borderRadius: 3,
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            </>
        );
    }

    return (
        <>
            <Header />
            <Box sx={{ height: '64px', bgcolor: 'rgba(0, 0, 0, 0.95)', zIndex: 75 }} />

            <Head title="Catálogo de Influencers | Premium Collection" />

            <Box
                sx={{
                    minHeight: '100vh',
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(255, 23, 68, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
                        linear-gradient(135deg, #0a0a0a 0%, #1a0a0f 25%, #2a1018 50%, #1a0a0f 75%, #0a0a0a 100%)
                    `,
                    py: 4,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.3,
                        zIndex: 0,
                    },
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Header mejorado con animaciones */}
                    <Fade in timeout={800}>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 900,
                                    background: 'linear-gradient(45deg, #ff1744 0%, #d50000 25%, #ff6b35 50%, #ff1744 75%, #d50000 100%)',
                                    backgroundSize: '400% 400%',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    animation: 'gradient 8s ease infinite',
                                    textShadow: '0 0 50px rgba(255,23,68,0.5)',
                                    mb: 2,
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                    letterSpacing: '0.1em',
                                    '@keyframes gradient': {
                                        '0%': { backgroundPosition: '0% 50%' },
                                        '50%': { backgroundPosition: '100% 50%' },
                                        '100%': { backgroundPosition: '0% 50%' },
                                    },
                                }}
                            >
                                ⚡ INFLUENCERS ELITE
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'rgba(255,255,255,0.8)',
                                    fontWeight: '300',
                                    letterSpacing: '0.05em',
                                    mb: 1,
                                }}
                            >
                                CONECTA CON LOS MEJORES CREADORES DIGITALES
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                                <Chip
                                    icon={<Star sx={{ color: '#ffeb3b !important' }} />}
                                    label={`${influencers.length} Creadores Premium`}
                                    sx={{
                                        bgcolor: 'rgba(255,235,59,0.1)',
                                        color: '#ffeb3b',
                                        border: '1px solid rgba(255,235,59,0.3)',
                                    }}
                                />
                                <Chip
                                    icon={<TrendingUp sx={{ color: '#4caf50 !important' }} />}
                                    label="Trending Now"
                                    sx={{
                                        bgcolor: 'rgba(76,175,80,0.1)',
                                        color: '#4caf50',
                                        border: '1px solid rgba(76,175,80,0.3)',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Fade>

                    {/* Controles de búsqueda y filtros mejorados */}
                    <Fade in timeout={1000}>
                        <Box sx={{ mb: 4 }}>
                            {/* Barra de búsqueda principal */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <TextField
                                    placeholder="Buscar por nombre, usuario o especialidad..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search sx={{ color: '#ff1744', fontSize: 24 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        maxWidth: 500,
                                        width: '100%',
                                        '& .MuiOutlinedInput-root': {
                                            height: 50,
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            backdropFilter: 'blur(20px)',
                                            borderRadius: 25,
                                            color: '#fff',
                                            fontSize: '1rem',
                                            border: '1px solid rgba(255,23,68,0.3)',
                                            '& fieldset': { border: 'none' },
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.12)',
                                                border: '1px solid rgba(255,23,68,0.5)',
                                            },
                                            '&.Mui-focused': {
                                                bgcolor: 'rgba(255,255,255,0.15)',
                                                border: '1px solid #ff1744',
                                                boxShadow: '0 0 20px rgba(255,23,68,0.3)',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            padding: '12px 16px',
                                            '&::placeholder': {
                                                color: 'rgba(255,255,255,0.6)',
                                                fontSize: '1rem',
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            {/* Filtros por categoría */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                    label="Todos"
                                    onClick={() => setSelectedCategory('')}
                                    variant={selectedCategory === '' ? 'filled' : 'outlined'}
                                    sx={{
                                        bgcolor: selectedCategory === '' ? '#ff1744' : 'transparent',
                                        color: selectedCategory === '' ? '#fff' : 'rgba(255,255,255,0.7)',
                                        border: '1px solid rgba(255,23,68,0.5)',
                                        '&:hover': {
                                            bgcolor: selectedCategory === '' ? '#d50000' : 'rgba(255,23,68,0.1)',
                                        },
                                    }}
                                />
                                {categories.map((category) => (
                                    <Chip
                                        key={category}
                                        label={category}
                                        onClick={() => setSelectedCategory(category)}
                                        variant={selectedCategory === category ? 'filled' : 'outlined'}
                                        sx={{
                                            bgcolor: selectedCategory === category ? '#ff1744' : 'transparent',
                                            color: selectedCategory === category ? '#fff' : 'rgba(255,255,255,0.7)',
                                            border: '1px solid rgba(255,23,68,0.5)',
                                            '&:hover': {
                                                bgcolor: selectedCategory === category ? '#d50000' : 'rgba(255,23,68,0.1)',
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Fade>

                    {/* Grid de Influencers mejorado */}
                    {/* Grid de Influencers */}
                    <Grid container spacing={3}>
                        {filteredInfluencers.map((inf) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={inf.id}>
                                <Link href={`/influencers/${inf.id}`} style={{ textDecoration: 'none' }}>
                                    <Card
                                        sx={{
                                            height: 300, // Altura fija uniforme
                                            aspectRatio: '3/4', // Proporción consistente
                                            borderRadius: 3,
                                            background: `linear-gradient(
                                                135deg,
                                                rgba(0,0,0,0.3) 0%,
                                                rgba(0,0,0,0.7) 100%
                                              ), url(${inf.avatar})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            transition: 'all 0.3s ease-in-out',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-8px) scale(1.02)',
                                                boxShadow: '0 20px 40px rgba(255,23,68,0.3)',
                                                border: '1px solid rgba(255,23,68,0.8)',
                                                background: `linear-gradient(
                                                  135deg,
                                                  rgba(0,0,0,0.2) 0%,
                                                  rgba(0,0,0,0.6) 100%
                                                ), url(${inf.avatar})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                '& .name-overlay': {
                                                    background: 'rgba(0,0,0,0.9)',
                                                    backdropFilter: 'blur(15px)',
                                                },
                                            },
                                        }}
                                    >
                                        {/* Botón de favorito */}
                                        <IconButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite(inf.id);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                bgcolor: 'rgba(0,0,0,0.7)',
                                                backdropFilter: 'blur(10px)',
                                                color: favorites.has(inf.id) ? '#ff1744' : '#fff',
                                                width: 36,
                                                height: 36,
                                                zIndex: 2,
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,23,68,0.8)',
                                                    transform: 'scale(1.1)',
                                                },
                                            }}
                                        >
                                            {favorites.has(inf.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                                        </IconButton>

                                        {/* Overlay de información en la parte inferior */}
                                        <Box
                                            className="name-overlay"
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'rgba(0,0,0,0.8)',
                                                backdropFilter: 'blur(10px)',
                                                p: 2.5,
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                sx={{
                                                    color: '#fff',
                                                    fontSize: '1.1rem',
                                                    lineHeight: 1.2,
                                                    mb: 0.5,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {inf.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.8)',
                                                    fontSize: '0.9rem',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                @{inf.username}
                                            </Typography>
                                        </Box>

                                        {/* Efecto de brillo sutil */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                                                opacity: 0,
                                                transition: 'opacity 0.3s ease',
                                                pointerEvents: 'none',
                                                '&:hover': {
                                                    opacity: 1,
                                                },
                                            }}
                                        />
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Mensaje cuando no hay resultados mejorado */}
                    {filteredInfluencers.length === 0 && (
                        <Fade in timeout={500}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    py: 8,
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: 4,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <Search sx={{ fontSize: 80, mb: 3, color: '#ff1744', opacity: 0.7 }} />
                                <Typography variant="h4" mb={2} sx={{ color: '#fff', fontWeight: 'bold' }}>
                                    No se encontraron influencers
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                                    Intenta con otro término de búsqueda o cambia los filtros
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        Sugerencias:
                                    </Typography>
                                    {['Gaming', 'Lifestyle', 'Tech', 'Fashion'].map((suggestion) => (
                                        <Chip
                                            key={suggestion}
                                            label={suggestion}
                                            size="small"
                                            onClick={() => setSearchTerm(suggestion)}
                                            sx={{
                                                bgcolor: 'rgba(255,23,68,0.1)',
                                                color: '#ff1744',
                                                border: '1px solid rgba(255,23,68,0.3)',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,23,68,0.2)',
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Fade>
                    )}
                </Container>
            </Box>

            {/* Footer con fondo negro */}
            <div className="bg-black">
                <Footer />
            </div>
        </>
    );
}
