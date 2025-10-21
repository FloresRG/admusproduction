import AppLayout from '@/layouts/app-layout';
import { Link, usePage } from '@inertiajs/react';

// Importaciones de Material-UI
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    Grid,
    Chip,
} from '@mui/material';

// Iconos de MUI para mejorar la UX
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BusinessIcon from '@mui/icons-material/Business';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WarningIcon from '@mui/icons-material/Warning';

// Definición de tipos
interface Empresa { id: number; nombre_empresa: string; estado: string; }
interface Actividad { tipo_actividad: string; descripcion: string; fecha_actividad: string; }
interface Estrategia { metodo_estrategia: string; herramientas_usadas: string; resultado_esperado: string; }
interface Resultado { indicador: string; meta_mes: number | string; resultado_real: number | string; }
interface Dificultad { tipo: string; descripcion: string; impacto: string; }
interface Meta { objetivo: string; accion_implementar: string; responsable: string; fecha_cumplimiento: string; }

interface Reporte {
    id: number;
    tipo_periodo: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    observaciones: string | null;
    recomendaciones: string | null;
    empresas: Empresa[];
    actividades: Actividad[];
    estrategias: Estrategia[];
    resultados: Resultado[];
    dificultades: Dificultad[];
    metas: Meta[];
}

export default function Show() {
    const { reporte } = usePage().props as { reporte: Reporte };

    const formattedTipoPeriodo = reporte.tipo_periodo
        ? reporte.tipo_periodo.charAt(0).toUpperCase() + reporte.tipo_periodo.slice(1)
        : 'Desconocido';

    // Componente auxiliar para renderizar cada sección
    const SectionBlock = ({ title, data, renderItem, icon }: {
        title: string;
        data: any[];
        renderItem: (item: any, index: number) => React.ReactNode;
        icon: React.ReactNode;
    }) => (
        <Box sx={{ mb: 4, mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h5" component="h2" sx={{ mr: 1, fontWeight: 'bold' }}>
                    {icon} {title}
                </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {data.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No hay {title.toLowerCase()} registradas.
                </Typography>
            ) : (
                <List dense disablePadding>
                    {data.map(renderItem)}
                </List>
            )}
        </Box>
    );

    return (
        <AppLayout>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={4} sx={{ p: { xs: 2, md: 4 } }}>
                    {/* ENCABEZADO Y ACCIÓN PRINCIPAL */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 4, 
                            flexWrap: 'wrap',
                            gap: 2
                        }}
                    >
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, flexGrow: 1 }}>
                            Reporte #{reporte.id} - {formattedTipoPeriodo}
                        </Typography>
                        
                        {/* Botón Descargar PDF */}
                        <Button
                            href={`/reportes/${reporte.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                            color="error"
                            startIcon={<DownloadIcon />}
                        >
                            Descargar PDF
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* DATOS GENERALES */}
                    {/* CORRECCIÓN: Se mantiene 'container' en el Grid padre */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {/* CORRECCIÓN: Se elimina la prop 'item' y se usan 'xs'/'sm' directamente en los Grids hijos (Grid v2) */}
                        <Grid xs={12} sm={6}> 
                            {/* CORRECCIÓN: Se añade component="div" para evitar anidar <div> dentro de <p> (HTML no válido) */}
                            <Typography variant="body1" component="div">
                                <strong><EventNoteIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Periodo:</strong> {reporte.fecha_inicio} - {reporte.fecha_fin}
                            </Typography>
                        </Grid>
                        {/* CORRECCIÓN: Se elimina la prop 'item' y se usan 'xs'/'sm' directamente en los Grids hijos (Grid v2) */}
                        <Grid xs={12} sm={6}>
                             {/* CORRECCIÓN: Se añade component="div" */}
                            <Typography variant="body1" component="div">
                                <strong>Creado:</strong> {new Date(reporte.created_at).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        {/* CORRECCIÓN: Se elimina la prop 'item' y se usan 'xs' directamente en el Grid hijo (Grid v2) */}
                        <Grid xs={12}>
                             {/* CORRECCIÓN: Se añade component="div" para permitir anidar el Chip (que es un div) */}
                            <Typography variant="body1" component="div"> 
                                <strong>Observaciones:</strong> <Chip label={reporte.observaciones || 'Ninguna'} variant="outlined" />
                            </Typography>
                        </Grid>
                        {/* CORRECCIÓN: Se elimina la prop 'item' y se usan 'xs' directamente en el Grid hijo (Grid v2) */}
                        <Grid xs={12}>
                             {/* CORRECCIÓN: Se añade component="div" para permitir anidar el Chip (que es un div) */}
                            <Typography variant="body1" component="div">
                                <strong>Recomendaciones:</strong> <Chip label={reporte.recomendaciones || 'Ninguna'} variant="outlined" color="primary" />
                            </Typography>
                        </Grid>
                    </Grid>
                    
                    <Divider sx={{ mt: 2, mb: 2 }} />

                    {/* SECCIONES DETALLADAS */}
                    
                    {/* 1. EMPRESAS RELACIONADAS */}
                    <SectionBlock
                        title="Empresas relacionadas"
                        data={reporte.empresas}
                        icon={<BusinessIcon color="primary" />}
                        renderItem={(empresa) => (
                            <ListItem key={empresa.id} divider>
                                <ListItemText 
                                    primary={empresa.nombre_empresa} 
                                    secondary={`Estado: ${empresa.estado}`}
                                />
                            </ListItem>
                        )}
                    />

                    {/* 2. ACTIVIDADES */}
                    <SectionBlock
                        title="Actividades"
                        data={reporte.actividades}
                        icon={<ListAltIcon color="secondary" />}
                        renderItem={(act, i) => (
                            <ListItem key={i} divider>
                                <ListItemText 
                                    primary={`${act.tipo_actividad}: ${act.descripcion}`} 
                                    secondary={`Fecha: ${act.fecha_actividad}`}
                                />
                            </ListItem>
                        )}
                    />

                    {/* 3. ESTRATEGIAS */}
                    <SectionBlock
                        title="Estrategias"
                        data={reporte.estrategias}
                        icon={<MilitaryTechIcon color="success" />}
                        renderItem={(estr, i) => (
                            <ListItem key={i} divider>
                                <ListItemText 
                                    primary={`${estr.metodo_estrategia}: ${estr.herramientas_usadas}`} 
                                    secondary={`Resultado esperado: ${estr.resultado_esperado}`}
                                />
                            </ListItem>
                        )}
                    />

                    {/* 4. RESULTADOS */}
                    <SectionBlock
                        title="Resultados"
                        data={reporte.resultados}
                        icon={<ListAltIcon color="info" />}
                        renderItem={(res, i) => (
                            <ListItem key={i} divider>
                                <ListItemText 
                                    primary={`${res.indicador}`} 
                                    secondary={`Meta: ${res.meta_mes}, Real: ${res.resultado_real}`}
                                />
                            </ListItem>
                        )}
                    />

                    {/* 5. DIFICULTADES */}
                    <SectionBlock
                        title="Dificultades"
                        data={reporte.dificultades}
                        icon={<WarningIcon color="warning" />}
                        renderItem={(dif, i) => (
                            <ListItem key={i} divider>
                                <ListItemText 
                                    primary={`${dif.tipo}: ${dif.descripcion}`} 
                                    secondary={`Impacto: ${dif.impacto}`}
                                />
                            </ListItem>
                        )}
                    />

                    {/* 6. METAS */}
                    <SectionBlock
                        title="Metas"
                        data={reporte.metas}
                        icon={<MilitaryTechIcon color="primary" />}
                        renderItem={(meta, i) => (
                            <ListItem key={i} divider>
                                <ListItemText 
                                    primary={`${meta.objetivo}: ${meta.accion_implementar}`} 
                                    secondary={`Responsable: ${meta.responsable} - Fecha de Cumplimiento: ${meta.fecha_cumplimiento}`}
                                />
                            </ListItem>
                        )}
                    />
                    
                    {/* BOTÓN VOLVER */}
                    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
                        <Button
                            component={Link}
                            href="/reportesgeneral"
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                        >
                            Volver a la lista
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </AppLayout>
    );
}