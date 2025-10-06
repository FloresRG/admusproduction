import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';
import MapComponent from './MapComponent'; // Ajusta la ruta si está en otro lugar

type Tarea = {
    id: number;
    titulo: string;
    fecha_produccion: string;
    empresa: {
        id: number;
        name: string;
        direccion: string; // debe ser tipo "lat,lng"
        descripcion?: string;
        ubicacion?: string;
        contract_duration?: string;
        start_date?: string;
        end_date?: string;
    };
    estado_produccion: string;
    estrategia: string;
    guion: string;
    comentario: string;
};

type Props = PageProps<{
    tareas: Record<string, Tarea[]>;
}>;

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getFechasSemana = (): string[] => {
    const hoy = new Date();
    const primerDia = new Date(hoy);
    const day = hoy.getDay();
    const diferencia = day === 0 ? -6 : 1 - day;
    primerDia.setDate(hoy.getDate() + diferencia);

    const fechas: string[] = [];
    for (let i = 0; i < 6; i++) {
        const fecha = new Date(primerDia);
        fecha.setDate(primerDia.getDate() + i);
        fechas.push(fecha.toISOString().split('T')[0]);
    }
    return fechas;
};

const TareasSemana = ({ tareas }: Props) => {
    const fechasSemana = getFechasSemana();

    const [openMap, setOpenMap] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Tarea['empresa'] | null>(null);

    const handleOpenMap = (empresa: Tarea['empresa']) => {
        if (empresa && empresa.direccion) {
            setSelectedCompany(empresa);
            setOpenMap(true);
        }
    };

    const handleCloseMap = () => {
        setOpenMap(false);
        setSelectedCompany(null);
    };

    return (
        <AppLayout>
            <Head title="Tareas de la Semana" />
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Tareas Pendientes Esta Semanaa </h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fechasSemana.map((fecha, index) => {
                        const diaSemana = diasSemana[index];
                        const tareasDelDia = tareas[fecha] ?? [];

                        return (
                            <div key={fecha} className="rounded bg-white p-4 shadow">
                                <h2 className="mb-2 text-lg font-semibold">
                                    {diaSemana} ({fecha})
                                </h2>

                                {tareasDelDia.map((tarea) => (
                                    <li key={tarea.id} className="rounded border p-2">
                                        <strong>{tarea.titulo}</strong>
                                        <br />
                                        Empresa: {tarea.empresa.name}
                                        <br />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<LocationOnIcon />}
                                            sx={{ my: 1, fontSize: '0.75rem', textTransform: 'none' }}
                                            onClick={() => handleOpenMap(tarea.empresa)}
                                        >
                                            Ver ubicación
                                        </Button>
                                        <br />
                                        Estado:{' '}
                                        <span className={tarea.estado_produccion === 'completado' ? 'text-green-600' : 'text-yellow-700'}>
                                            {tarea.estado_produccion}
                                        </span>
                                        <br />
                                        Estrategia: {tarea.estrategia}
                                        <br />
                                        Guion: {tarea.guion}
                                        <br />
                                        Comentario: {tarea.comentario}
                                        {/* Botón para completar */}
                                        {tarea.estado_produccion !== 'completado' && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                sx={{ mt: 2, fontSize: '0.75rem', textTransform: 'none' }}
                                                onClick={() => {
                                                    if (confirm('¿Estás seguro que quieres marcar esta tarea como completada?')) {
                                                        router.put(route('tareas.completar', tarea.id));
                                                    }
                                                }}
                                            >
                                                Marcar como completada
                                            </Button>
                                        )}
                                    </li>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal del mapa */}
            <Dialog open={openMap} onClose={handleCloseMap} maxWidth="md" fullWidth>
                <DialogTitle>Ubicación de la empresa</DialogTitle>
                <DialogContent>
                    {selectedCompany ? <MapComponent company={selectedCompany} /> : <Typography>No se pudo cargar la empresa.</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMap}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default TareasSemana;
