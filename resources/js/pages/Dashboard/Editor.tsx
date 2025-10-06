import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Box, Chip, Grid, LinearProgress, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Íconos de MUI (Simplificamos usando los de MUI para evitar redefinir SVGs)
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

    // Colores y datos adaptados a tus métricas originales
    const statsCards = [
        {
            title: 'Ediciones Pendientes',
            value: estadisticas.pendiente,
            icon: <PendingActionsIcon fontSize="large" />,
            color: '#FF5F6D',
            gradient: 'linear-gradient(135deg, #FF5F6D, #FFC371)',
            description: 'Aún por iniciar o trabajar',
        },
        {
            title: 'En Revisión',
            value: estadisticas.revision,
            icon: <CalendarIcon fontSize="large" />,
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #fcd34d, #fbbf24)',
            description: 'Esperando aprobación',
        },
        {
            title: 'Completadas',
            value: estadisticas.completado,
            icon: <CheckCircleIcon fontSize="large" />,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #6EE7B7, #3B82F6)',
            description: 'Finalizadas con éxito',
        },
        {
            title: 'Total De Ediciones',
            value: totalTareas,
            icon: <FormatListNumberedIcon fontSize="large" />,
            color: '#6366F1',
            gradient: 'linear-gradient(135deg, #C084FC, #6366F1)',
            description: 'Tareas asignadas',
        },
    ];

    // Animaciones de Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } },
        hover: {
            scale: 1.05,
            boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
            transition: { duration: 0.3 },
        },
    };

    // Estilo de papel Glassmorphism
    const glassPaperStyle = {
        p: 4,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.7)', // Menor opacidad para más "vidrio"
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: theme.shadows[10],
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Panel de control', href: '/dashboard' }]}>
            <Head title="Panel de Control" />

            <Box
                sx={{
                    // Fondo de Gradiente y Estilos de la Muestra
                    minHeight: 'calc(100vh - 64px)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Fondo degradado
                    padding: { xs: '2rem 1rem', sm: '3rem 2rem', md: '4rem 3rem' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Elementos Decorativos de Fondo (como en la muestra) */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)',
                        animation: 'float 6s ease-in-out infinite',
                        zIndex: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '60%',
                        right: '15%',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        animation: 'float 8s ease-in-out infinite reverse',
                        zIndex: 0,
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
                                color: 'white',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                mr: 2,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            }}
                        >
                            ¡ Holaaa, {user.name} !
                        </Typography>

                        <Box sx={{ color: 'white', animation: 'bounce 2s infinite' }}>
                            <RocketIcon fontSize="large" />
                        </Box>
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.9)',
                            mb: 3,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            fontWeight: 500,
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
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    backdropFilter: 'blur(10px)',
                                    fontSize: '1rem',
                                    height: 40,
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
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <motion.div variants={itemVariants} whileHover="hover">
                                    <Paper
                                        elevation={12}
                                        sx={{
                                            ...glassPaperStyle,
                                            p: 3,
                                            textAlign: 'center',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {/* Barra superior de color */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 5,
                                                background: stat.gradient,
                                            }}
                                        />

                                        <Box
                                            sx={{
                                                color: stat.color,
                                                mb: 2,
                                                p: 2,
                                                borderRadius: '50%',
                                                background: `${stat.color}20`,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mt: 2,
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>

                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: stat.color,
                                                mb: 1,
                                                textShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
                    <Grid container spacing={3}>
                        {/* Ediciones Semanales y Estado Frecuente */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={glassPaperStyle}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                                    Rendimiento
                                </Typography>

                                {/* Ediciones completadas esta semana */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                                        Ediciones completadas esta semana:
                                    </Typography>
                                    <Chip label={completadasSemana} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                                </Box>

                                {/* Estado de edición más frecuente */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <StarIcon color="warning" sx={{ mr: 1 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                                        Estado más frecuente:
                                    </Typography>
                                    <Chip label={estadoFrecuente ?? 'N/A'} color="warning" size="small" sx={{ fontWeight: 'bold' }} />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Última Edición Completada + Progreso */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={glassPaperStyle}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.secondary.main }}>
                                    Progreso General
                                </Typography>

                                {/* Tasa de Finalización (barra de progreso) */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                        Tasa de Finalización: <strong>{completionRate.toFixed(1)}%</strong>
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={completionRate}
                                        sx={{
                                            height: 12,
                                            borderRadius: 6,
                                            bgcolor: '#eee',
                                            '& .MuiLinearProgress-bar': {
                                                background: 'linear-gradient(90deg, #10b981, #3B82F6)',
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Última edición completada */}
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Última edición completada:
                                        </Typography>
                                    </Box>

                                    {ultimaTarea ? (
                                        <>
                                            <Typography variant="body2" sx={{ ml: 3, fontWeight: 500 }}>
                                                {ultimaTarea.titulo}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                                                {new Date(ultimaTarea.fecha).toLocaleDateString()}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                                            Ninguna completada aún
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </motion.div>

                {/* Action Button (Añadido para completar el estilo de la muestra) */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    style={{ zIndex: 1, marginTop: '2rem' }}
                ></motion.div>

                {/* CSS Animations (necesarias para 'float' y 'bounce') */}
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
