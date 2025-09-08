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
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                    color: '#fff',
                    py: { xs: 4, md: 8 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(255, 0, 127, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(255, 111, 97, 0.05) 0%, transparent 50%)
                        `,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Sección de Título */}
                    <Fade in timeout={800}>
                        <Box sx={{ 
                            textAlign: 'center', 
                            mb: { xs: 4, md: 8 }, 
                            pt: { xs: 2, md: 4 },
                            px: { xs: 2, sm: 0 }
                        }}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '2rem', sm: '3rem', md: '4.5rem', lg: '5.5rem' },
                                        fontWeight: 900,
                                        color: '#e0e0e0',
                                        textShadow: '0 0 30px rgba(255, 0, 127, 0.3), 0 0 60px rgba(255, 111, 97, 0.2)',
                                        letterSpacing: { xs: '0.05em', md: '0.1em' },
                                        lineHeight: { xs: 1.2, md: 1.1 },
                                        mb: { xs: 1, md: 2 },
                                        background: 'linear-gradient(135deg, #ff007f 0%, #ff6f61 50%, #7877c6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradientShift 6s ease-in-out infinite',
                                        '@keyframes gradientShift': {
                                            '0%, 100%': { backgroundPosition: '0% 50%' },
                                            '50%': { backgroundPosition: '100% 50%' },
                                        }
                                    }}
                                >
                                    NUESTROS PROYECTOS
                                </Typography>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'rgba(255,255,255,0.9)',
                                        fontWeight: 300,
                                        letterSpacing: { xs: '0.03em', md: '0.08em' },
                                        maxWidth: { xs: '100%', md: 800 },
                                        mx: 'auto',
                                        fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.3rem', lg: '1.4rem' },
                                        lineHeight: { xs: 1.4, md: 1.5 },
                                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    EXPLORA LAS EMPRESAS CON LAS QUE HEMOS TRABAJADO EN EL MUNDO DIGITAL Y CREATIVO.
                                </Typography>
                            </motion.div>
                        </Box>
                    </Fade>

                    {/* --- Carrusel de Logos --- */}
                    <Fade in timeout={1200}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <Box sx={{ 
                                my: { xs: 3, md: 6 }, 
                                py: { xs: 3, md: 4 }, 
                                mx: { xs: 1, sm: 0 },
                                background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(26,26,46,0.7) 100%)',
                                borderRadius: { xs: 2, md: 3 },
                                boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                overflow: 'hidden',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: 'linear-gradient(90deg, transparent, #ff007f, #ff6f61, transparent)',
                                }
                            }}>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        textAlign: 'center', 
                                        color: '#fff', 
                                        mb: { xs: 2, md: 3 }, 
                                        fontWeight: 700,
                                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                        px: { xs: 2, sm: 0 }
                                    }}
                                >
                                    Nuestras Empresas Colaboradoras
                                </Typography>
                                <Box sx={{ 
                                    overflow: 'hidden', 
                                    whiteSpace: 'nowrap',
                                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                                }}>
                                    <motion.div
                                        className="inline-block"
                                        animate={{
                                            x: ['0%', '-100%'],
                                            transition: {
                                                x: {
                                                    repeat: Infinity,
                                                    repeatType: 'loop',
                                                    duration: 30,
                                                    ease: 'linear',
                                                },
                                            },
                                        }}
                                    >
                                        {allLogos.map((company, index) => (
                                            <Box
                                                key={index}
                                                component="img"
                                                src={company.logo}
                                                alt={company.name}
                                                sx={{
                                                    maxWidth: { xs: '80px', sm: '100px', md: '120px' },
                                                    maxHeight: { xs: '50px', sm: '65px', md: '80px' },
                                                    width: 'auto',
                                                    height: 'auto',
                                                    filter: 'grayscale(70%) brightness(130%) contrast(120%)',
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    display: 'inline-block',
                                                    mx: { xs: 1.5, sm: 2, md: 2.5 },
                                                    '&:hover': {
                                                        filter: 'grayscale(0%) brightness(110%) contrast(110%)',
                                                        transform: 'scale(1.1)',
                                                    },
                                                }}
                                            />
                                        ))}
                                    </motion.div>
                                </Box>
                            </Box>
                        </motion.div>
                    </Fade>
                    {/* --- Fin del Carrusel --- */}

                    {/* Grid de Empresas */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} sx={{ px: { xs: 1, sm: 0 } }}>
                            {companies.map((company, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            duration: 0.6, 
                                            delay: 0.8 + (index * 0.1),
                                            ease: "easeOut"
                                        }}
                                        whileHover={{ y: -12, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link href={`/companiesvideos/${company.id}`} style={{ textDecoration: 'none' }}>
                                            <Card
                                                sx={{
                                                    height: { xs: 280, sm: 320, md: 340 },
                                                    aspectRatio: { xs: '4/3', sm: '3/4' },
                                                    borderRadius: { xs: 2, md: 3 },
                                                    background: `linear-gradient(
                                                        135deg,
                                                        rgba(0,0,0,0.4) 0%,
                                                        rgba(26,26,46,0.6) 50%,
                                                        rgba(0,0,0,0.7) 100%
                                                    ), url(${company.logo})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backdropFilter: 'blur(5px)',
                                                    border: '1px solid rgba(255,255,255,0.15)',
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'flex-end',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'linear-gradient(135deg, transparent 30%, rgba(255,0,127,0.1) 70%)',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s ease',
                                                        zIndex: 1,
                                                    },
                                                    '&:hover': {
                                                        boxShadow: '0 25px 50px rgba(255,0,127,0.2), 0 0 0 1px rgba(255,0,127,0.3)',
                                                        border: '1px solid rgba(255,0,127,0.5)',
                                                        background: `linear-gradient(
                                                            135deg,
                                                            rgba(0,0,0,0.3) 0%,
                                                            rgba(26,26,46,0.5) 50%,
                                                            rgba(0,0,0,0.6) 100%
                                                        ), url(${company.logo})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        '&::before': {
                                                            opacity: 1,
                                                        },
                                                        '& .name-overlay': {
                                                            background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(26,26,46,0.95) 100%)',
                                                            backdropFilter: 'blur(20px)',
                                                            transform: 'translateY(-2px)',
                                                        },
                                                        '& .company-name': {
                                                            color: '#ff007f',
                                                            textShadow: '0 0 20px rgba(255,0,127,0.5)',
                                                        }
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
                                                        top: { xs: 8, md: 12 },
                                                        right: { xs: 8, md: 12 },
                                                        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(26,26,46,0.9) 100%)',
                                                        backdropFilter: 'blur(15px)',
                                                        color: favorites.has(company.id) ? '#ff1744' : 'rgba(255,255,255,0.8)',
                                                        width: { xs: 32, md: 40 },
                                                        height: { xs: 32, md: 40 },
                                                        zIndex: 10,
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': {
                                                            background: favorites.has(company.id) 
                                                                ? 'linear-gradient(135deg, rgba(255,23,68,0.9) 0%, rgba(255,0,127,0.9) 100%)'
                                                                : 'linear-gradient(135deg, rgba(255,0,127,0.8) 0%, rgba(255,23,68,0.8) 100%)',
                                                            transform: 'scale(1.1)',
                                                            boxShadow: favorites.has(company.id) 
                                                                ? '0 0 20px rgba(255,23,68,0.6)' 
                                                                : '0 0 20px rgba(255,0,127,0.6)',
                                                            color: '#fff',
                                                        },
                                                    }}
                                                >
                                                    {favorites.has(company.id) ? 
                                                        <Favorite sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} /> : 
                                                        <FavoriteBorder sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }} />
                                                    }
                                                </IconButton>

                                                {/* Overlay de información en la parte inferior */}
                                                <Box
                                                    className="name-overlay"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(26,26,46,0.9) 100%)',
                                                        backdropFilter: 'blur(15px)',
                                                        p: { xs: 2, md: 2.5 },
                                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        borderTop: '1px solid rgba(255,255,255,0.1)',
                                                        zIndex: 5,
                                                    }}
                                                >
                                                    <Typography
                                                        className="company-name"
                                                        variant="h6"
                                                        fontWeight="bold"
                                                        sx={{
                                                            color: '#fff',
                                                            fontSize: { xs: '1rem', md: '1.1rem' },
                                                            lineHeight: 1.2,
                                                            mb: 0.5,
                                                            textAlign: 'center',
                                                            transition: 'all 0.3s ease',
                                                            textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                                                        }}
                                                    >
                                                        {company.name}
                                                    </Typography>
                                                    {company.description && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'rgba(255,255,255,0.8)',
                                                                fontSize: { xs: '0.8rem', md: '0.9rem' },
                                                                textAlign: 'center',
                                                                lineHeight: 1.3,
                                                                textShadow: '0 1px 5px rgba(0,0,0,0.7)',
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
                                                        zIndex: 2,
                                                    }}
                                                />
                                            </Card>
                                        </Link>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </motion.div>
                </Container>
            </Box>
            <Box className="bg-black" sx={{ mt: { xs: 4, md: 8 } }}>
                <Footer />
            </Box>
        </>
    );
}