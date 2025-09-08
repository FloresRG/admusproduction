'use client';

import Header from '@/components/header copy';
import { Head, Link } from '@inertiajs/react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Box, Card, Container, Fade, Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../home/footer';
// Importa motion desde framer-motion
import { motion } from 'framer-motion';

// Define la interfaz para los datos de la empresa, tal como vienen de Laravel.
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

    // Duplicamos los logos para simular un carrusel infinito.
    const allLogos = [...companies, ...companies, ...companies];

    return (
        <>
            <Header />
            <Box sx={{ height: '64px', bgcolor: 'rgba(0, 0, 0, 0.95)', zIndex: 75 }} />

            <Head title="Portafolio de Empresas | Premium Collection" />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#1a1a1a',
                    color: '#fff',
                    py: 8,
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Sección de Título */}
                    <Fade in timeout={800}>
                        <Box sx={{ textAlign: 'center', mb: 8, pt: 4 }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '2.8rem', sm: '4rem', md: '5.5rem' },
                                    fontWeight: 'extrabold',
                                    color: '#e0e0e0',
                                    textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                                    letterSpacing: '0.1em',
                                    lineHeight: 1.1,
                                    mb: 2,
                                    background: 'linear-gradient(90deg, #ff007f 0%, #ff6f61 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                 NUESTROS PROYECTOS 
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'rgba(255,255,255,0.85)',
                                    fontWeight: 'light',
                                    letterSpacing: '0.08em',
                                    maxWidth: 800,
                                    mx: 'auto',
                                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                                }}
                            >
                                EXPLORA LAS EMPRESAS CON LAS QUE HEMOS TRABAJADO EN EL MUNDO DIGITAL Y CREATIVO.
                            </Typography>
                        </Box>
                    </Fade>

                    {/* --- Carrusel de Logos --- */}
                    <Fade in timeout={1200}>
                        <Box sx={{ my: 6, py: 4, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
                            <Typography variant="h4" sx={{ textAlign: 'center', color: '#fff', mb: 3, fontWeight: 'bold' }}>
                                Nuestras Empresas Colaboradoras
                            </Typography>
                            <div className="overflow-hidden whitespace-nowrap">
                                <motion.div
                                    className="inline-block"
                                    animate={{
                                        x: ['0%', '-100%'],
                                        transition: {
                                            x: {
                                                repeat: Infinity,
                                                repeatType: 'loop',
                                                duration: 30, // Velocidad de la animación (en segundos)
                                                ease: 'linear',
                                            },
                                        },
                                    }}
                                >
                                    {allLogos.map((company, index) => (
                                        <Box
                                            key={index} // Se usa el índice como key aquí porque los elementos se duplican
                                            component="img"
                                            src={company.logo}
                                            alt={company.name}
                                            sx={{
                                                maxWidth: '120px',
                                                maxHeight: '80px',
                                                width: 'auto',
                                                height: 'auto',
                                                filter: 'grayscale(100%) brightness(150%)',
                                                transition: 'filter 0.3s ease-in-out',
                                                display: 'inline-block',
                                                mx: 2, // Espacio entre logos
                                                '&:hover': {
                                                    filter: 'grayscale(0%) brightness(100%)',
                                                },
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </div>
                        </Box>
                    </Fade>
                    {/* --- Fin del Carrusel --- */}

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
            <Box className="bg-black" sx={{ mt: 8 }}>
                <Footer />
            </Box>
        </>
    );
}
