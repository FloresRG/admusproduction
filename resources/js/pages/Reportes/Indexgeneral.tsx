import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';

// Importaciones de Material-UI
import {
    Container,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Button,
    Box,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

// Define la interfaz Reporte si no está ya definida en '@/types'
interface Reporte {
    id: number;
    tipo_periodo: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    jefe_ventas?: { name: string } | null;
    // Agrega aquí cualquier otro campo relevante de Reporte
}

export default function Indexgeneral({ reportes }: PageProps<{ reportes: Reporte[] }>) {
    return (
        <AppLayout>
            <Container maxWidth="lg" sx={{ py: 4 }}> {/* Usamos Container para centrar y limitar el ancho */}
                <Typography variant="h4" component="h1" gutterBottom>
                    Todos los Reportes de Ventas
                </Typography>

                <Paper elevation={3} sx={{ mt: 3, overflowX: 'auto' }}> {/* Paper para un fondo elevado y TableContainer */}
                    <TableContainer>
                        <Table aria-label="Tabla de Reportes de Ventas" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">ID</TableCell>
                                    <TableCell align="center">Periodo</TableCell>
                                    <TableCell align="center">Desde</TableCell>
                                    <TableCell align="center">Hasta</TableCell>
                                    <TableCell align="center">Creado</TableCell>
                                    <TableCell align="center">Jefe de Ventas</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportes.map((reporte) => (
                                    <TableRow
                                        key={reporte.id}
                                        hover
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }} // Quitar borde inferior de la última fila
                                    >
                                        <TableCell align="center" component="th" scope="row">
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
                                        <TableCell align="center">
                                            {reporte.jefe_ventas?.name ?? 'Sin usuario'}
                                        </TableCell>

                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                {/* Botón Ver - Usamos el prop component para que MUI use el componente Link de Inertia */}
                                                <Button
                                                    component={Link}
                                                    href={`/reportes/${reporte.id}`}
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<VisibilityIcon />}
                                                >
                                                    Ver
                                                </Button>
                                                {/* Botón Editar */}
                                                <Button
                                                    component={Link}
                                                    href={`/reportes/${reporte.id}/editar`}
                                                    variant="outlined"
                                                    color="warning" // O 'secondary' o un color customizado
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                >
                                                    Editar
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </AppLayout>
    );
}