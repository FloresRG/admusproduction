import AppLayout from '@/layouts/app-layout';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { usePage } from '@inertiajs/react';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
};

type AsignacionTarea = {
    id: number;
    estado: string;
    detalle: string;
    user?: User;
};

type Tipo = {
    id: number;
    nombre_tipo: string;
};

type Tarea = {
    id: number;
    titulo: string;
    prioridad: 'alta' | 'media' | 'baja';
    fecha: string;
    descripcion: string;
    tipo?: Tipo;
    asignaciones?: AsignacionTarea[];
};

type Empresa = {
    id: number;
    name?: string;
};

type DiaCalendario = {
    fecha: string;
    empresas: {
        [empresaId: string]: {
            empresa: Empresa;
            tareas: Tarea[];
        };
    };
};

// ------------------ Componente ------------------
const Mes = () => {
    const { semanas } = usePage<{ semanas: DiaCalendario[][] }>().props;
    const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);

    // Convertimos tus datos a eventos para FullCalendar
    const eventos: any[] = [];
    semanas.forEach((semana) =>
        semana.forEach((dia) => {
            Object.values(dia.empresas).forEach((empresaData) => {
                empresaData.tareas.forEach((tarea) => {
                    eventos.push({
                        id: tarea.id.toString(),
                        title: `${empresaData.empresa.name ?? 'Empresa'}: ${tarea.titulo}`,
                        date: dia.fecha,
                        extendedProps: tarea,
                        backgroundColor: tarea.prioridad === 'alta' ? '#f44336' : tarea.prioridad === 'media' ? '#ff9800' : '#4caf50',
                        textColor: '#fff',
                        borderColor: '#fff',
                    });
                });
            });
        }),
    );

    const handleEventClick = (info: any) => {
        setTareaSeleccionada(info.event.extendedProps);
    };

    const getColorPorPrioridad = (prioridad: Tarea['prioridad']) => {
        switch (prioridad) {
            case 'alta':
                return '#f44336';
            case 'media':
                return '#ff9800';
            case 'baja':
                return '#4caf50';
            default:
                return '#9e9e9e';
        }
    };

    return (
        <AppLayout>
            <Typography variant="h4" align="center" gutterBottom>
                📅 Calendario Mensual
            </Typography>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                events={eventos}
                eventClick={handleEventClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay',
                }}
                height="auto"
            />

            {/* Modal de detalle de tarea */}
            <Dialog open={!!tareaSeleccionada} onClose={() => setTareaSeleccionada(null)} maxWidth="sm" fullWidth>
                <DialogTitle>📝 Detalle de la Tarea</DialogTitle>
                <DialogContent dividers>
                    {tareaSeleccionada && (
                        <>
                            <Typography>
                                <strong>Título:</strong> {tareaSeleccionada.titulo}
                            </Typography>
                            <Typography>
                                <strong>Prioridad:</strong>{' '}
                                <Chip
                                    label={tareaSeleccionada.prioridad.toUpperCase()}
                                    size="small"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        backgroundColor: getColorPorPrioridad(tareaSeleccionada.prioridad),
                                    }}
                                />
                            </Typography>
                            <Typography>
                                <strong>Tipo:</strong> {tareaSeleccionada.tipo?.nombre_tipo ?? 'No especificado'}
                            </Typography>
                            <Typography>
                                <strong>Descripción:</strong> {tareaSeleccionada.descripcion || 'Sin descripción'}
                            </Typography>
                            <Typography mt={2} variant="subtitle1">
                                👤 Asignado a:
                            </Typography>
                            {tareaSeleccionada.asignaciones && tareaSeleccionada.asignaciones.length > 0 ? (
                                tareaSeleccionada.asignaciones.map((asg) => (
                                    <div key={asg.id} style={{ marginBottom: '1rem' }}>
                                        <Typography variant="body1">
                                            Usuario: {asg.user?.name ?? 'Sin asignar'}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Estado: {asg.estado}
                                        </Typography>
                                    </div>
                                ))
                            ) : (
                                <Typography>No hay asignaciones para esta tarea.</Typography>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTareaSeleccionada(null)} variant="contained" color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default Mes;
