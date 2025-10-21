import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FC } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Avatar,
    Chip,
    IconButton,
    useTheme,
    alpha,
} from '@mui/material';
import {
    TrendingUp,
    People,
    ShoppingCart,
    AttachMoney,
    Notifications,
    Settings,
} from '@mui/icons-material';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
}

interface JefeVentasDashboardProps {
    user: User;
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const JefeVentasDashboard: FC<JefeVentasDashboardProps> = ({ user }) => {
    const theme = useTheme();


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                    py: 4,
                }}
            >
                <Container maxWidth="xl">
                    {/* Header de Bienvenida */}
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 4,
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                p: 4,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Avatar
                                    src={user.profile_photo_url}
                                    alt={user.name}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        border: `4px solid ${alpha('#fff', 0.3)}`,
                                        boxShadow: theme.shadows[8],
                                    }}
                                >
                                    {user.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                                        Bienvenido, {user.name}
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        Panel de Administrador de Ventas
                                    </Typography>
                                    <Chip
                                        label={user.email}
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            bgcolor: alpha('#fff', 0.2),
                                            color: 'white',
                                            fontWeight: 500,
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton sx={{ color: 'white' }}>
                                    <Notifications />
                                </IconButton>
                                <IconButton sx={{ color: 'white' }}>
                                    <Settings />
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Sección de Contenido Futuro */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            p: 6,
                            textAlign: 'center',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                            }}
                        >
                            <TrendingUp sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Estadísticas y Reportes en Desarrollo


                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Próximamente tendrás acceso a análisis detallados, gráficos interactivos y reportes
                            personalizados para optimizar tu gestión de ventas.
                            
                        </Typography>
                    </Paper>
                </Container>
            </Box>
        </AppLayout>
    );
};

export default JefeVentasDashboard;