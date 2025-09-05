'use client';

import Header from '@/components/header copy';
import { Head, Link } from '@inertiajs/react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Box, Card, Container, Fade, Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../home/footer';

// Define la interfaz para los datos de la empresa, tal como vienen de Laravel.
// Agrega aquí todas las propiedades que quieras usar en tu componente.
interface Company {
    id: number;
    name: string;
    logo: string;
    description: string;
}

// Define el tipo para las props del componente.
interface TikTokPortafolioProps {
    companies: Company[];
}

export default function TikTokPortafolio({ companies }: TikTokPortafolioProps) {
    // Maneja la lista de favoritos.
    const [favorites, setFavorites] = useState<Set<number>>(new Set());

    // Al cargar el componente, carga los favoritos del almacenamiento local.
    useEffect(() => {
        const storedFavorites = localStorage.getItem('companyFavorites');
        if (storedFavorites) {
            setFavorites(new Set(JSON.parse(storedFavorites)));
        }
    }, []);

    // Alterna el estado de "favorito" para una empresa.
    const toggleFavorite = (companyId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(companyId)) {
            newFavorites.delete(companyId);
        } else {
            newFavorites.add(companyId);
        }
        setFavorites(newFavorites);
        localStorage.setItem('companyFavorites', JSON.stringify(Array.from(newFavorites)));
    };

    return (
        <>
            <Header />
            <Box sx={{ height: '64px', bgcolor: 'rgba(0, 0, 0, 0.95)', zIndex: 75 }} />

            <Head title="Portafolio de Empresas | Premium Collection" />

            <Box>
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Header mejorado con animaciones */}
                    <Fade in timeout={800}>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    letterSpacing: '0.08em',
                                    lineHeight: 1.1,
                                }}
                            >
                                ✨ NUESTROS PROYECTOS
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
                                EXPLORA LAS EMPRESAS CON LAS QUE HEMOS TRABAJADO
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Grid de Empresas */}
                    <Grid container spacing={3}>
                        {companies.map((company) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
                                <Link href={`/companiesvideos/${company.id}`} style={{ textDecoration: 'none' }}>
                                    <Card
                                        sx={{
                                            height: 300,
                                            aspectRatio: '3/4',
                                            borderRadius: 3,
                                            background: `linear-gradient(
                                                135deg,
                                                rgba(0,0,0,0.3) 0%,
                                                rgba(0,0,0,0.7) 100%
                                            ), url(${company.logo})`,
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
                                                ), url(${company.logo})`,
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
                                                toggleFavorite(company.id);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                bgcolor: 'rgba(0,0,0,0.7)',
                                                backdropFilter: 'blur(10px)',
                                                color: favorites.has(company.id) ? '#ff1744' : '#fff',
                                                width: 36,
                                                height: 36,
                                                zIndex: 2,
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,23,68,0.8)',
                                                    transform: 'scale(1.1)',
                                                },
                                            }}
                                        >
                                            {favorites.has(company.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
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
                                                {company.name}
                                            </Typography>
                                            {company.description && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.9rem',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {company.description}
                                                </Typography>
                                            )}
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
                </Container>
            </Box>

            {/* Footer con fondo negro */}
            <div className="bg-black">
                <Footer />
            </div>
        </>
    );
}