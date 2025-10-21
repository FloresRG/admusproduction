import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';

// 1. Importaciones de Material-UI
import {
    Typography,
    Button,
    Box,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Container
} from '@mui/material';

// 2. Iconos de MUI
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Definición de tipos de Reporte (ajustada para el contexto de la tabla)
interface Reporte {
    id: number;
    tipo_periodo: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    observaciones: string | null;
}

export default function Index({ reportes }: PageProps<{ reportes: Reporte[] }>) {
    return (
        <AppLayout>
            {/* Contenedor para limitar el ancho y añadir padding */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                
                {/* Encabezado y Botón de Acción */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                        Mis Reportes de Seguimiento de Empresas
                    </Typography>

                    {/* Botón con estilo MUI */}
                    <Button
                        component={Link}
                        href="/reportes/crear"
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ textDecoration: 'none' }}
                    >
                        Nuevo Reporte
                    </Button>
                </Box>
                
                {/* Contenedor de la Tabla con estilo de Paper/Tarjeta */}
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabla de reportes">
                        {/* Cabecera de la Tabla: Primer Nivel (Título combinado) */}
                        <TableHead>
                            <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[50] }}>
                                {/* Celdas normales */}
                                <TableCell sx={{ fontWeight: 'bold' }} rowSpan={2}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} rowSpan={2} align="center">Periodo</TableCell>

                                {/* Celda combinada (colSpan=2) */}
                                <TableCell 
                                    sx={{ fontWeight: 'bold', borderBottom: 'none' }} 
                                    align="center" 
                                    colSpan={2}
                                >
                                    Actividades Realizadas (Inicio - Fin)
                                </TableCell>
                                
                                {/* Celdas normales */}
                                <TableCell sx={{ fontWeight: 'bold' }} rowSpan={2} align="center">Creado</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} rowSpan={2}>Observaciones</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} rowSpan={2} align="right">Acciones</TableCell>
                            </TableRow>

                            {/* Cabecera de la Tabla: Segundo Nivel (Detalle de fechas) */}
                            <TableRow sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
                                {/* Las celdas con rowSpan ya ocuparon su lugar, así que solo listamos las celdas detalladas */}
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Desde</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Hasta</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        {/* Cuerpo de la Tabla */}
                        <TableBody>
                            {reportes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                        <Typography color="text.secondary">
                                            No hay reportes registrados.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reportes.map((reporte) => (
                                    <TableRow 
                                        key={reporte.id} 
                                        hover 
                                        component={Link}
                                        href={`/reportes/${reporte.id}`} // Enlazar toda la fila al detalle
                                        sx={{ 
                                            textDecoration: 'none', 
                                            cursor: 'pointer',
                                            // Se ajusta para que el borde inferior sea visible
                                            '&:last-child td, &:last-child th': { borderBottom: '1px solid rgba(224, 224, 224, 1)' } 
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {reporte.id}
                                        </TableCell>
                                        <TableCell align="center">
                                            {reporte.tipo_periodo.charAt(0).toUpperCase() + reporte.tipo_periodo.slice(1)}
                                        </TableCell>
                                        <TableCell align="center">{reporte.fecha_inicio}</TableCell>
                                        <TableCell align="center">{reporte.fecha_fin}</TableCell>
                                        <TableCell align="center">
                                            {new Date(reporte.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={reporte.observaciones ? reporte.observaciones.substring(0, 30) + (reporte.observaciones.length > 30 ? '...' : '') : 'Ninguna'} 
                                                size="small"
                                                color={reporte.observaciones ? "default" : "secondary"}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right" onClick={(e) => e.preventDefault()}> 
                                            {/* El e.preventDefault() evita que el Link padre se dispare al hacer clic en el botón */}
                                            <Button
                                                component={Link}
                                                href={`/reportesuser/${reporte.id}`}
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                sx={{ minWidth: 'auto', p: 0.5 }}
                                                onClick={(e) => e.stopPropagation()} // Detener la propagación para evitar doble navegación
                                            >
                                                Ver
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Container>
        </AppLayout>
    );
}