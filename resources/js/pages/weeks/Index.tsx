import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
    Box,
    Typography,
    TextField,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Button,
    Stack,
    useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Info } from '@mui/icons-material'; // Icono de información para el card superior

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Weeks" />

            <Box
                display="flex"
                flexDirection="column"
                minHeight="100vh"
                px={{ xs: 2, sm: 3, md: 4 }}
                py={4}
            >
                {/* Card Superior con Datos */}
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader
                        avatar={<Info color="action" />}
                        title="Resumen de Semanas"
                        titleTypographyProps={{
                            fontWeight: 'bold',
                            color: theme.palette.grey[900],
                        }}
                        sx={{
                            backgroundColor: theme.palette.grey[300],
                            py: 1,
                        }}
                    />
                    <CardContent>
                        <Typography variant="body1" color="text.primary">
                            Hay un total de <strong>{weeks.data.length}</strong> semanas disponibles.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            La fecha de inicio de la primera semana es {weeks.data[0]?.start_date || 'N/A'}.
                        </Typography>
                    </CardContent>
                   
                </Card>

                <Typography variant="h4" fontWeight="bold" gutterBottom color="grey.900">
                    Listado de Semanas de todos los Influencers
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mb={4} maxWidth={400}>
                    <SearchIcon color="action" />
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar semanas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            input: {
                                color: theme.palette.grey[900],
                            },
                        }}
                    />
                </Box>

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
                    {weeks.data.map((week) => (
                        <Card
                            key={week.id}
                            variant="outlined"
                            sx={{
                                backgroundColor: theme.palette.grey[100],
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <CardHeader
                                avatar={<CalendarTodayIcon color="action" />}
                                title={week.name}
                                titleTypographyProps={{
                                    fontWeight: 'bold',
                                    color: theme.palette.grey[900],
                                }}
                                sx={{
                                    backgroundColor: theme.palette.grey[300],
                                    py: 1,
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Inicio de semana: {week.start_date}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Fin de semana: {week.end_date}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <Button
                                    size="small"
                                    href={`/weeks/${week.id}/bookings`}
                                    endIcon={<ArrowForwardIosIcon fontSize="small" />}
                                    variant="outlined"
                                    color="inherit"
                                >
                                    ver los influencers de la semana
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>

                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                    {weeks.links.map((link, index) => (
                        <Button
                            key={`${index}-${link.label}`}
                            onClick={() => goToPage(link.url)}
                            disabled={!link.url}
                            variant={link.active ? 'contained' : 'outlined'}
                            color="inherit"
                            size="small"
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    ))}
                </Stack>
            </Box>
        </AppLayout>
    );
}
