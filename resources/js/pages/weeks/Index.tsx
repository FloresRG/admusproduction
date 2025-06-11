import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    Info, 
    ArrowForwardIos, 
    CalendarToday, 
    Search,
    TrendingUp,
    Schedule
} from '@mui/icons-material';
import { 
    Box, 
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader, 
    Stack, 
    TextField, 
    Typography, 
    useTheme,
    Chip,
    Avatar,
    Fade,
    Grow,
    alpha,
    Paper,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'weeks',
        href: '/weeks',
    },
];

interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface PageProps {
    weeks: {
        data: Week[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    search: string;
    [key: string]: unknown;
}

export default function WeeksIndex() {
    const theme = useTheme();
    const { weeks, search: initialSearch } = usePage<PageProps>().props;
    const [search, setSearch] = useState(initialSearch || '');

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get('/weeks', { search }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    const goToPage = (url: string | null) => {
        if (url) {
            router.visit(url, { preserveState: true });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getWeekStatus = (startDate: string, endDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (now < start) return { label: 'Próxima', color: 'info' as const };
        if (now > end) return { label: 'Finalizada', color: 'default' as const };
        return { label: 'Activa', color: 'success' as const };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Weeks" />

            <Box 
                display="flex" 
                flexDirection="column" 
                minHeight="100vh" 
                px={{ xs: 2, sm: 3, md: 4 }} 
                py={4}
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
                }}
            >
                {/* Hero Card con Estadísticas */}
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            marginBottom: 4,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                backdropFilter: 'blur(10px)',
                            }
                        }}
                    >
                        <CardHeader
                            avatar={
                                <Avatar sx={{ 
                                    bgcolor: alpha(theme.palette.common.white, 0.2),
                                    backdropFilter: 'blur(10px)',
                                }}>
                                    <TrendingUp sx={{ color: 'white' }} />
                                </Avatar>
                            }
                            title={
                                <Typography variant="h5" fontWeight="bold" color="white">
                                    Dashboard de Semanas
                                </Typography>
                            }
                            subheader={
                                <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                                    Gestión completa de influencers por semana
                                </Typography>
                            }
                            sx={{ position: 'relative', zIndex: 1 }}
                        />
                        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                            <Stack direction="row" spacing={3} alignItems="center">
                                <Box textAlign="center">
                                    <Typography variant="h3" fontWeight="bold" color="white">
                                        {weeks.data.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                                        Semanas Totales
                                    </Typography>
                                </Box>
                                <Box textAlign="center">
                                    <Typography variant="h6" fontWeight="bold" color="white">
                                        {formatDate(weeks.data[0]?.start_date || '')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                                        Primera Semana
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Paper>
                </Fade>

                {/* Título Principal */}
                <Fade in timeout={1000}>
                    <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        gutterBottom 
                        sx={{
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textAlign: 'center',
                            mb: 4
                        }}
                    >
                        Semanas de Influencers
                    </Typography>
                </Fade>

                {/* Barra de Búsqueda Mejorada */}
                <Fade in timeout={1200}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 4,
                            maxWidth: 500,
                            mx: 'auto',
                            background: alpha(theme.palette.common.white, 0.8),
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar semanas por nombre o fecha..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: search && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setSearch('')}
                                        >
                                            ×
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }
                            }}
                        />
                    </Paper>
                </Fade>

                {/* Grid de Cards Mejorado */}
                <Box
                    flexGrow={1}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    }}
                    gap={3}
                    mb={4}
                >
                    {weeks.data.map((week, index) => {
                        const status = getWeekStatus(week.start_date, week.end_date);
                        
                        return (
                            <Grow
                                key={week.id}
                                in
                                timeout={800 + (index * 100)}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        border: 'none',
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                                            '&::before': {
                                                opacity: 1,
                                            }
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '4px',
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            opacity: 0.7,
                                            transition: 'opacity 0.3s ease',
                                        }
                                    }}
                                >
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                            }}>
                                                <CalendarToday />
                                            </Avatar>
                                        }
                                        title={
                                            <Typography variant="h6" fontWeight="bold">
                                                {week.name}
                                            </Typography>
                                        }
                                        action={
                                            <Chip
                                                label={status.label}
                                                color={status.color}
                                                size="small"
                                                variant="outlined"
                                            />
                                        }
                                        sx={{ pb: 1 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                                        <Stack spacing={2}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Schedule fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    Inicio: <strong>{formatDate(week.start_date)}</strong>
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Schedule fontSize="small" color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    Fin: <strong>{formatDate(week.end_date)}</strong>
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                    <CardActions sx={{ 
                                        justifyContent: 'flex-end', 
                                        pt: 0,
                                        pb: 2,
                                        px: 2
                                    }}>
                                        <Button
                                            size="small"
                                            href={`/semanainfluencer?week_id=${week.id}`}
                                            endIcon={<ArrowForwardIos fontSize="small" />}
                                            variant="contained"
                                            sx={{
                                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                                '&:hover': {
                                                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                    transform: 'scale(1.02)',
                                                }
                                            }}
                                        >
                                            Ver Influencers
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grow>
                        );
                    })}
                </Box>

                {/* Paginación Mejorada */}
                <Fade in timeout={1400}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                            {weeks.links.map((link, index) => (
                                <Button
                                    key={`${index}-${link.label}`}
                                    onClick={() => goToPage(link.url)}
                                    disabled={!link.url}
                                    variant={link.active ? 'contained' : 'outlined'}
                                    size="small"
                                    sx={{
                                        minWidth: 40,
                                        borderRadius: 2,
                                        ...(link.active && {
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        }),
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        }
                                    }}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </Stack>
                    </Paper>
                </Fade>
            </Box>
        </AppLayout>
    );
}