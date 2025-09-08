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
} from '@mui/material';

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

const Edit: React.FC<PageProps> = () => {
    const { informe, companies } = usePage().props as PageProps & {
        informe: FormData & { id: number };
        companies: Company[];
    };

    const { data, setData, put, processing, errors } = useForm<FormData>({
        titulo: informe.titulo,
        estado: informe.estado ?? 'activo',
        fecha_inicio: informe.fecha_inicio,
        fecha_fin: informe.fecha_fin ?? '',
        descripcion: informe.descripcion ?? '',
        company_id: informe.company_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('informes.update', informe.id));
    };

    return (
        <AppLayout>
            <Box maxWidth="md" mx="auto" py={6}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Editar Informe
                    </Typography>
                    <Button
                        component={Link as any}
                        href={route('informes.index')}
                        variant="outlined"
                        color="primary"
                    >
                        ← Volver
                    </Button>
                </Box>

                <Card>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Título */}
                                <Grid item xs={12}>
                                    <TextField
                                        label="Título *"
                                        value={data.titulo}
                                        onChange={e => setData('titulo', e.target.value)}
                                        fullWidth
                                        error={!!errors.titulo}
                                        helperText={errors.titulo}
                                    />
                                </Grid>

                                {/* Estado */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        label="Estado"
                                        value={data.estado}
                                        onChange={e => setData('estado', e.target.value)}
                                        fullWidth
                                        error={!!errors.estado}
                                        helperText={errors.estado}
                                    >
                                        <MenuItem value="activo">Activo</MenuItem>
                                        <MenuItem value="pendiente">Pendiente</MenuItem>
                                        <MenuItem value="en_progreso">En progreso</MenuItem>
                                        <MenuItem value="completado">Completado</MenuItem>
                                    </TextField>
                                </Grid>

                                {/* Fecha Inicio */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Fecha de Inicio *"
                                        type="date"
                                        value={data.fecha_inicio}
                                        onChange={e => setData('fecha_inicio', e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.fecha_inicio}
                                        helperText={errors.fecha_inicio}
                                    />
                                </Grid>

                                {/* Fecha Fin */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Fecha de Fin"
                                        type="date"
                                        value={data.fecha_fin || ''}
                                        onChange={e => setData('fecha_fin', e.target.value)}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.fecha_fin}
                                        helperText={errors.fecha_fin}
                                    />
                                </Grid>

                                {/* Empresa */}
                                <Grid item xs={12} md={6}>
                                    <TextField
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
                                        helperText={errors.company_id}
                                    >
                                        <MenuItem value="">Seleccione una empresa</MenuItem>
                                        {companies.map(company => (
                                            <MenuItem key={company.id} value={company.id}>
                                                {company.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {/* Descripción */}
                                <Grid item xs={12}>
                                    <TextField
                                        label="Descripción"
                                        value={data.descripcion || ''}
                                        onChange={e => setData('descripcion', e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!errors.descripcion}
                                        helperText={errors.descripcion}
                                    />
                                </Grid>

                                {/* Botón */}
                                <Grid item xs={12} display="flex" justifyContent="flex-end">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={processing}
                                    >
                                        Actualizar Informe
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </AppLayout>
    );
};

export default Edit;
