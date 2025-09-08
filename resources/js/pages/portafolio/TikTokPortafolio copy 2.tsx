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

            <Box sx={{
                minHeight: '100vh',
                bgcolor: '#1a1a1a',
                color: '#fff',
                py: 8,
            }}>
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
                                ✨ NUESTROS PROYECTOS ✨
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
                                                }
                                            }}
                                        />
                                    ))}
                                </motion.div>
                                
                            </div>
                        </Box>
                    </Fade>
                    {/* --- Fin del Carrusel --- */}

                    {/* Grid de Empresas */}
                    <Grid container spacing={4} sx={{ mt: 8 }}>
                        {companies.map((company) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
                                <Link href={`/companiesvideos/${company.id}`} style={{ textDecoration: 'none' }}>
                                    <Card
                                        sx={{
                                            height: '320px',
                                            borderRadius: 4,
                                            background: `linear-gradient(
                                                160deg,
                                                rgba(0,0,0,0.5) 0%,
                                                rgba(0,0,0,0.8) 100%
                                            ), url(${company.logo})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                            '&:hover': {
                                                transform: 'translateY(-12px) scale(1.03)',
                                                boxShadow: '0 25px 50px rgba(255,23,68,0.4)',
                                                border: '1px solid rgba(255,23,68,0.9)',
                                                background: `linear-gradient(
                                                    160deg,
                                                    rgba(0,0,0,0.3) 0%,
                                                    rgba(0,0,0,0.7) 100%
                                                ), url(${company.logo})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                '& .name-overlay': {
                                                    background: 'rgba(0,0,0,0.95)',
                                                    backdropFilter: 'blur(20px)',
                                                    transform: 'translateY(0)',
                                                },
                                                '& .hover-effect-shine': {
                                                    opacity: 1,
                                                    transform: 'translateX(100%)',
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
                                                top: 16,
                                                right: 16,
                                                bgcolor: 'rgba(0,0,0,0.6)',
                                                backdropFilter: 'blur(12px)',
                                                color: favorites.has(company.id) ? '#ff4081' : '#f0f0f0',
                                                width: 40,
                                                height: 40,
                                                zIndex: 2,
                                                transition: 'all 0.3s ease',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,64,129,0.9)',
                                                    transform: 'scale(1.15) rotate(5deg)',
                                                    color: '#fff',
                                                },
                                            }}
                                        >
                                            {favorites.has(company.id) ? <Favorite fontSize="medium" /> : <FavoriteBorder fontSize="medium" />}
                                        </IconButton>

                                        {/* Overlay de información en la parte inferior */}
                                        <Box
                                            className="name-overlay"
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.6) 70%, transparent 100%)',
                                                backdropFilter: 'blur(10px)',
                                                p: 3,
                                                transition: 'all 0.4s ease-in-out',
                                                transform: 'translateY(0)',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                sx={{
                                                    color: '#fff',
                                                    fontSize: '1.2rem',
                                                    lineHeight: 1.3,
                                                    mb: 0.8,
                                                    textAlign: 'center',
                                                    textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                                                }}
                                            >
                                                {company.name}
                                            </Typography>
                                            {company.description && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'rgba(255,255,255,0.7)',
                                                        fontSize: '0.95rem',
                                                        textAlign: 'center',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {company.description}
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Efecto de brillo sutil al pasar el mouse */}
                                        <Box
                                            className="hover-effect-shine"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                                                transition: 'transform 0.5s ease-in-out',
                                                opacity: 0,
                                                pointerEvents: 'none',
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