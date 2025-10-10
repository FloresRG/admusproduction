import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Chip, Grid, LinearProgress, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Íconos de MUI
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import RocketIcon from '@mui/icons-material/RocketLaunch';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// --- Interfaces ---
interface DashboardProps extends PageProps {
    user: {
        name: string;
    };
    estadisticas: {
        pendiente: number;
        revision: number;
        completado: number;
    };
    totalTareas: number;
    completadasSemana: number;
    ultimaTarea: {
        titulo: string;
        fecha: string;
    } | null;
    estadoFrecuente: string | null;
}

// --- Componente Principal ---

export default function Dashboard({ user, estadisticas, totalTareas, completadasSemana, ultimaTarea, estadoFrecuente }: DashboardProps) {
    const theme = useTheme();
    const completionRate = totalTareas > 0 ? (estadisticas.completado / totalTareas) * 100 : 0;
    const pendienteRate = totalTareas > 0 ? (estadisticas.pendiente / totalTareas) * 100 : 0;

    // Colores y datos con degradados más vibrantes
    const statsCards = [
        {
            title: 'Ediciones Pendientes',
            value: estadisticas.pendiente,
            icon: <PendingActionsIcon fontSize="large" />,
            color: '#FF6B6B',
            gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(255,230,109,0.1) 100%)',
            description: 'Aún por iniciar o trabajar',
        },
        {
            title: 'En Revisión',
            value: estadisticas.revision,
            icon: <CalendarIcon fontSize="large" />,
            color: '#F59E0B',
            gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.1) 100%)',
            description: 'Esperando aprobación',
        },
        {
            title: 'Completadas',
            value: estadisticas.completado,
            icon: <CheckCircleIcon fontSize="large" />,
            color: '#10B981',
            gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.1) 100%)',
            description: 'Finalizadas con éxito',
        },
        {
            title: 'Total De Ediciones',
            value: totalTareas,
            icon: <FormatListNumberedIcon fontSize="large" />,
            color: '#8B5CF6',
            gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            bgGradient: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(236,72,153,0.1) 100%)',
            description: 'Tareas asignadas',
        },
    ];

    // Animaciones de Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } },
        hover: {
            scale: 1.05,
            y: -8,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transition: { duration: 0.3 },
        },
    };

    // Estilo de papel Glassmorphism mejorado
    const glassPaperStyle = {
        p: 4,
        borderRadius: 5,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel de control', href: '/dashboard' }]}>
            <Head title="Panel de Control" />

            <Box
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                    background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                    padding: { xs: '2rem 1rem', sm: '3rem 2rem', md: '4rem 3rem' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Elementos Decorativos de Fondo Mejorados */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                        animation: 'float 6s ease-in-out infinite',
                        zIndex: 0,
                        filter: 'blur(2px)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '60%',
                        right: '15%',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03))',
                        animation: 'float 8s ease-in-out infinite reverse',
                        zIndex: 0,
                        filter: 'blur(2px)',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '20%',
                        left: '20%',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
                        animation: 'float 7s ease-in-out infinite',
                        zIndex: 0,
                        filter: 'blur(3px)',
                    }}
                />

                {/* --- SECCIÓN DE BIENVENIDA --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', marginBottom: '3rem', zIndex: 1, width: '100%', maxWidth: 1000 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                mr: 2,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            }}
                        >
                            ¡ Holaaa, {user.name} !
                        </Typography>

                        <Box sx={{ color: 'white', animation: 'bounce 2s infinite', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
                            <RocketIcon fontSize="large" />
                        </Box>
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            background: 'linear-gradient(135deg, #FFEB3B 0%, #FFC107 50%, #FF9800 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 3,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            fontWeight: 600,
                        }}
                    >
                        Panel de Control Editor - Resumen de tus Videos Editados
                    </Typography>

                    {totalTareas > 0 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}>
                            <Chip
                                icon={<BarChartIcon />}
                                label={`Tasa de Completado: ${completionRate.toFixed(1)}%`}
                                sx={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.15))',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    backdropFilter: 'blur(15px)',
                                    fontSize: '1rem',
                                    height: 45,
                                    px: 2,
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                    '& .MuiChip-icon': { color: 'white' },
                                }}
                            />
                        </motion.div>
                    )}
                </motion.div>

                {/* --- TARJETAS PRINCIPALES (STATS CARDS) --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ width: '100%', maxWidth: 1200, marginBottom: '3rem', zIndex: 1 }}
                >
                    <Grid container spacing={3} justifyContent="center">
                        {statsCards.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div variants={itemVariants} whileHover="hover">
                                    <Paper
                                        elevation={12}
                                        sx={{
                                            ...glassPaperStyle,
                                            p: 3,
                                            textAlign: 'center',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: 'rgba(255,255,255,0.9)',
                                        }}
                                    >
                                        {/* Barra superior de color con gradiente */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 6,
                                                background: stat.gradient,
                                            }}
                                        />

                                        {/* Fondo decorativo */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: stat.bgGradient,
                                                opacity: 0.5,
                                                zIndex: 0,
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    background: stat.gradient,
                                                    mb: 2,
                                                    p: 2,
                                                    borderRadius: '50%',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mt: 2,
                                                    color: 'white',
                                                    boxShadow: `0 8px 20px ${stat.color}40`,
                                                }}
                                            >
                                                {stat.icon}
                                            </Box>

                                            <Typography
                                                variant="h2"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    background: stat.gradient,
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    mb: 1,
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                }}
                                            >
                                                {stat.value}
                                            </Typography>

                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    mb: 1,
                                                }}
                                            >
                                                {stat.title}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontStyle: 'italic',
                                                }}
                                            >
                                                {stat.description}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>

                {/* --- MÉTRICAS ADICIONALES Y PROGRESO --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{ width: '100%', maxWidth: 1200, marginBottom: '3rem', zIndex: 1 }}
                >
                    <Grid container spacing={3} justifyContent="center">
                        {/* Ediciones Semanales y Estado Frecuente */}
                        <Grid item xs={12} md={6} >
                            <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
                                <Paper
                                    sx={{
                                        ...glassPaperStyle,
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Borde superior decorativo */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 5,
                                            background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                        }}
                                    />

                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mt: 1,
                                        }}
                                    >
                                        Rendimiento
                                    </Typography>

                                    {/* Ediciones completadas esta semana */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            p: 2,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                                borderRadius: '50%',
                                                p: 1,
                                                display: 'flex',
                                                mr: 2,
                                            }}
                                        >
                                            <TrendingUpIcon sx={{ color: 'white' }} />
                                        </Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                                            Ediciones completadas esta semana:
                                        </Typography>
                                        <Chip
                                            label={completadasSemana}
                                            sx={{
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                                                color: 'white',
                                            }}
                                            size="small"
                                        />
                                    </Box>

                                    {/* Estado de edición más frecuente */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 2,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                                                borderRadius: '50%',
                                                p: 1,
                                                display: 'flex',
                                                mr: 2,
                                            }}
                                        >
                                            <StarIcon sx={{ color: 'white' }} />
                                        </Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                                            Estado más frecuente:
                                        </Typography>
                                        <Chip
                                            label={estadoFrecuente ?? 'N/A'}
                                            sx={{
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                                                color: 'white',
                                            }}
                                            size="small"
                                        />
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Última Edición Completada + Progreso */}
                        <Grid item xs={12} md={6}>
                            <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.3 }}>
                                <Paper
                                    sx={{
                                        ...glassPaperStyle,
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Borde superior decorativo */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 5,
                                            background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                        }}
                                    />

                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mt: 1,
                                        }}
                                    >
                                        Progreso General
                                    </Typography>

                                    {/* Tasa de Finalización (barra de progreso) */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5 }}>
                                            Tasa de Finalización: <strong>{completionRate.toFixed(1)}%</strong>
                                        </Typography>
                                        <Box sx={{ position: 'relative' }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={completionRate}
                                                sx={{
                                                    height: 14,
                                                    borderRadius: 7,
                                                    bgcolor: 'rgba(139,92,246,0.15)',
                                                    '& .MuiLinearProgress-bar': {
                                                        background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                                        borderRadius: 7,
                                                        boxShadow: '0 2px 8px rgba(139,92,246,0.4)',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Última edición completada */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #000000 0%, #4B0000 30%, #8B0000 60%, #B22222 100%)',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Box
                                                sx={{
                                                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                                                    borderRadius: '50%',
                                                    p: 0.8,
                                                    display: 'flex',
                                                    mr: 1.5,
                                                }}
                                            >
                                                <AccessTimeIcon sx={{ color: 'white', fontSize: 20 }} />
                                            </Box>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                Última edición completada:
                                            </Typography>
                                        </Box>

                                        {ultimaTarea ? (
                                            <>
                                                <Typography variant="body2" sx={{ ml: 5, fontWeight: 500, mb: 0.5 }}>
                                                    {ultimaTarea.titulo}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                                                    {new Date(ultimaTarea.fecha).toLocaleDateString()}
                                                </Typography>
                                            </>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
                                                Ninguna completada aún
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>

                {/* CSS Animations */}
                <style jsx global>{`
                    @keyframes float {
                        0%,
                        100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-20px);
                        }
                    }
                    @keyframes bounce {
                        0%,
                        20%,
                        50%,
                        80%,
                        100% {
                            transform: translateY(0);
                        }
                        40% {
                            transform: translateY(-10px);
                        }
                        60% {
                            transform: translateY(-5px);
                        }
                    }
                `}</style>
            </Box>
        </AppLayout>
    );
}