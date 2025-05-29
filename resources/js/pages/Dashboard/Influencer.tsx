import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircleOutline, BarChart, Brush } from '@mui/icons-material';

interface DashboardProps extends PageProps {
    user: {
        name: string;
        email: string;
        profile_photo_path: string | null;
    };
}

const featureIcons = {
    'Marketing Digital': <BarChart className="text-blue-600" sx={{ fontSize: 40 }} />,
    'Diseño y Creatividad': <Brush className="text-pink-500" sx={{ fontSize: 40 }} />,
    'Análisis y Resultados': <CheckCircleOutline className="text-green-600" sx={{ fontSize: 40 }} />,
};

export default function Dashboard({ user }: DashboardProps) {
    const breadcrumbs = [{ title: 'Panel de control', href: '/dashboard' }];

    const features = [
        {
            title: 'Marketing Digital',
            description:
                'Estrategias centradas en resultados: SEO, campañas online y redes sociales para conectar con tu audiencia.',
        },
        {
            title: 'Diseño y Creatividad',
            description:
                'Branding, diseño UI/UX y soluciones gráficas que transforman ideas en impacto visual.',
        },
        {
            title: 'Análisis y Resultados',
            description:
                'Decisiones basadas en datos: medimos y optimizamos el rendimiento de tus campañas.',
        },
    ];

    // Animaciones reusables para stagger y efectos
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.25,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, x: -100 }, // Slide from left
        show: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 50,
                damping: 10,
            },
        },
        hover: { scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.12)', y: -10 },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Control" />

            {/* Fondo con suave degradado */}
            <Box
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                    background:
                        'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
                    padding: '3rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                {/* Logo con animación de entrada */}
                <motion.img
                    src="/Gflores/logo.png"
                    alt="Logotipo de Admus Producción"
                    className="w-32 md:w-40 mb-8 drop-shadow-xl"
                    initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                />

                {/* Saludo personalizado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            color: 'primary.main',
                            mb: 1,
                            letterSpacing: '0.05em',
                            userSelect: 'none',
                        }}
                    >
                        ¡Hola, {user.name}! 👋
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 6, maxWidth: 600, mx: 'auto', lineHeight: 1.5 }}
                    >
                        Bienvenido al panel de Influencer de Admus Producción.
                        Aquí podrás gestionar tus días de colaboración y visualizar el impacto de tus campañas.
                    </Typography>
                </motion.div>

                {/* Botón CTA animado */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    style={{ marginBottom: '3rem' }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        href="/influencers"
                        sx={{
                            fontWeight: 'bold',
                            paddingX: 4,
                            paddingY: 1.5,
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}
                    >
                        Gestionar mis días
                    </Button>
                </motion.div>

                {/* Separador elegante */}
                <Box
                    sx={{
                        width: 80,
                        height: 4,
                        bgcolor: 'primary.main',
                        borderRadius: 2,
                        mb: 6,
                        mx: 'auto',
                        boxShadow: '0 0 8px rgba(33, 150, 243, 0.6)',
                    }}
                />

                {/* Grid con tarjetas animadas */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{ width: '100%', maxWidth: 960 }}
                >
                    <Grid container spacing={5} justifyContent="center">
                        {features.map(({ title, description }, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <motion.div
                                    variants={item}
                                    whileHover="hover"
                                    style={{ height: '100%' }}
                                >
                                    <Paper
                                        elevation={6}
                                        sx={{
                                            p: 5,
                                            height: '100%',
                                            borderRadius: 4,
                                            cursor: 'default',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            textAlign: 'center',
                                            bgcolor: 'background.paper',
                                            transition: 'box-shadow 0.3s ease',
                                        }}
                                    >
                                        {/* Ícono */}
                                        <Box
                                            sx={{
                                                mb: 3,
                                                color:
                                                    title === 'Marketing Digital'
                                                        ? 'primary.main'
                                                        : title === 'Diseño y Creatividad'
                                                        ? 'secondary.main'
                                                        : 'success.main',
                                            }}
                                        >
                                            {featureIcons[title]}
                                        </Box>

                                        {/* Título */}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                mb: 2,
                                                letterSpacing: '0.04em',
                                                color: 'text.primary',
                                            }}
                                        >
                                            {title}
                                        </Typography>

                                        {/* Descripción */}
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {description}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Box>
        </AppLayout>
    );
}
