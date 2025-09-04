import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { PageProps } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Container,
    Paper,
    Avatar,
    Chip,
    Divider,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    Alert,
} from '@mui/material';
import {
    Description,
    Business,
    DateRange,
    Star,
    Save,
    ArrowBack,
    TipsAndUpdates,
    CreateNewFolder,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface Company {
    id: number;
    name: string;
}

interface FormData {
    titulo: string;
    estado?: string;
    fecha_inicio: string;
    fecha_fin?: string;
    descripcion?: string;
    company_id?: number;
}

// Styled Components usando MUI
const GradientCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    marginBottom: theme.spacing(4),
}));

const ModernTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.primary.main,
    },
}));

const ModernSelect = styled(Select)(({ theme }) => ({
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    borderRadius: 12,
    padding: '12px 32px',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    '&:hover': {
        background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
    },
    transition: 'all 0.3s ease',
}));

const Create: React.FC<PageProps> = () => {
    const { companies } = usePage().props as PageProps & { companies: Company[] };

    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm<FormData>({
        titulo: '',
        estado: 'activo',
        fecha_inicio: today,
        fecha_fin: '',
        descripcion: '',
        company_id: undefined,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('informes.store'));
    };

    const estadoOptions = [
        { value: 'pendiente', label: 'Pendiente', color: 'warning' },
        { value: 'en progreso', label: 'En Progreso', color: 'info' },
        { value: 'completado', label: 'Completado', color: 'success' },
        { value: 'activo', label: 'Activo', color: 'primary' },
    ];

    return (
        <AppLayout>
            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Header */}
                <GradientCard elevation={8}>
                    <CardContent sx={{ p: 4 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <CreateNewFolder fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                                        Crear Nuevo Informe
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        Completa la información para generar tu informe profesional
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                component={Link as any}
                                href={route('informes.index')}
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    color: 'white',
                                    borderRadius: 3,
                                    px: 3,
                                    py: 1.5,
                                    '&:hover': {
                                        borderColor: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                    }
                                }}
                            >
                                Volver
                            </Button>
                        </Box>
                    </CardContent>
                </GradientCard>

                {/* Form Card */}
                <Card elevation={12} sx={{ borderRadius: 4, overflow: 'visible' }}>
                    <Box
                        sx={{
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            p: 3,
                            color: 'white'
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Description fontSize="large" />
                            <Box>
                                <Typography variant="h5" fontWeight="bold">
                                    Información del Informe
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Los campos marcados con * son obligatorios
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={4}>
                                {/* Título */}
                                <Grid item xs={12}>
                                    <Box mb={2}>
                                        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                            📋 Título del Informe
                                        </Typography>
                                    </Box>
                                    <ModernTextField
                                        label="Título *"
                                        placeholder="Ingresa un título descriptivo para tu informe"
                                        value={data.titulo}
                                        onChange={e => setData('titulo', e.target.value)}
                                        fullWidth
                                        error={!!errors.titulo}
                                        helperText={errors.titulo}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Description color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Fechas */}
                                <Grid item xs={12}>
                                    <Box mb={2}>
                                        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                            📅 Período del Informe
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <ModernTextField
                                                label="Fecha de Inicio *"
                                                type="date"
                                                value={data.fecha_inicio}
                                                onChange={e => setData('fecha_inicio', e.target.value)}
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.fecha_inicio}
                                                helperText={errors.fecha_inicio}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <DateRange color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <ModernTextField
                                                label="Fecha de Fin"
                                                type="date"
                                                value={data.fecha_fin || ''}
                                                onChange={e => setData('fecha_fin', e.target.value)}
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.fecha_fin}
                                                helperText={errors.fecha_fin || "Opcional - deja vacío si aún no está definida"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <DateRange color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Estado y Empresa */}
                                <Grid item xs={12}>
                                    <Box mb={2}>
                                        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                            🏢 Clasificación y Estado
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Estado</InputLabel>
                                                <ModernSelect
                                                    value={data.estado || ''}
                                                    onChange={e => setData('estado', e.target.value)}
                                                    label="Estado"
                                                    renderValue={(selected) => {
                                                        if (!selected) return '';
                                                        const option = estadoOptions.find(opt => opt.value === selected);
                                                        return (
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <Chip 
                                                                    label={option?.label} 
                                                                    color={option?.color as any}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </Box>
                                                        );
                                                    }}
                                                >
                                                    {estadoOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            <Box display="flex" alignItems="center" gap={2}>
                                                                <Chip 
                                                                    label={option.label} 
                                                                    color={option.color as any}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </Box>
                                                        </MenuItem>
                                                    ))}
                                                </ModernSelect>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <ModernTextField
                                                select
                                                label="Empresa"
                                                value={data.company_id ?? ''}
                                                onChange={e =>
                                                    setData(
                                                        'company_id',
                                                        e.target.value ? Number(e.target.value) : undefined
                                                    )
                                                }
                                                fullWidth
                                                error={!!errors.company_id}
                                                helperText={errors.company_id || "Selecciona la empresa asociada"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>Selecciona una empresa</em>
                                                </MenuItem>
                                                {companies.map(company => (
                                                    <MenuItem key={company.id} value={company.id}>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                                                <Business fontSize="small" />
                                                            </Avatar>
                                                            {company.name}
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </ModernTextField>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Descripción */}
                                <Grid item xs={12}>
                                    <Box mb={2}>
                                        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                                            📝 Descripción Detallada
                                        </Typography>
                                    </Box>
                                    <ModernTextField
                                        label="Descripción"
                                        placeholder="Describe detalladamente el propósito y contenido de este informe..."
                                        value={data.descripcion || ''}
                                        onChange={e => setData('descripcion', e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={5}
                                        error={!!errors.descripcion}
                                        helperText={errors.descripcion || "Proporciona una descripción clara del informe (opcional)"}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                </Grid>

                                {/* Botones */}
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Button
                                            component={Link as any}
                                            href={route('informes.index')}
                                            variant="outlined"
                                            size="large"
                                            sx={{ borderRadius: 3, px: 4 }}
                                        >
                                            Cancelar
                                        </Button>
                                        <GradientButton
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={processing}
                                            startIcon={processing ? null : <Save />}
                                            endIcon={processing ? (
                                                <Box 
                                                    sx={{ 
                                                        width: 20, 
                                                        height: 20, 
                                                        border: '2px solid rgba(255,255,255,0.3)',
                                                        borderTop: '2px solid white',
                                                        borderRadius: '50%',
                                                        animation: 'spin 1s linear infinite',
                                                        '@keyframes spin': {
                                                            '0%': { transform: 'rotate(0deg)' },
                                                            '100%': { transform: 'rotate(360deg)' }
                                                        }
                                                    }}
                                                />
                                            ) : null}
                                        >
                                            {processing ? 'Guardando...' : 'Guardar Informe'}
                                        </GradientButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>

                {/* Tips Card */}
                <Card 
                    elevation={4} 
                    sx={{ 
                        mt: 4, 
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
                        color: '#2d3436'
                    }}
                >
                </Card>
            </Container>
        </AppLayout>
    );
};

export default Create;