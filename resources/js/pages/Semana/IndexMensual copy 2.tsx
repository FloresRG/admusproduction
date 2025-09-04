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
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<{
        empresa: Empresa;
        tareas: Tarea[];
    } | null>(null);
    const [empresaColores] = useState<Record<number, string>>({});

    const getColorEmpresa = (empresaId: number) => {
        // Si la empresa ya tiene un color asignado, lo retornamos
        if (empresaColores[empresaId]) {
            return empresaColores[empresaId];
        }

        // Si no, generamos uno nuevo y lo guardamos en el estado
        const newColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        empresaColores[empresaId] = newColor;
        return newColor;
    };
    // Convertimos los datos a eventos para FullCalendar
    const eventos: any[] = [];
    semanas.forEach((semana) =>
        semana.forEach((dia) => {
            Object.values(dia.empresas).forEach((empresaData) => {
                // Usamos la nueva función para obtener un color único para la empresa
                const colorEmpresa = getColorEmpresa(empresaData.empresa.id);

                eventos.push({
                    id: `${dia.fecha}-${empresaData.empresa.id}`,
                    title: empresaData.empresa.name ?? 'Empresa',
                    date: dia.fecha,
                    extendedProps: {
                        empresa: empresaData.empresa,
                        tareas: empresaData.tareas,
                    },
                    // El color del fondo ahora es el de la empresa
                    backgroundColor: colorEmpresa,
                    textColor: '#fff',
                    borderColor: '#fff',
                });
            });
        }),
    );

    const handleEventClick = (info: any) => {
        setEmpresaSeleccionada(info.event.extendedProps);
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

            {/* Modal de detalle por empresa */}
            <Dialog open={!!empresaSeleccionada} onClose={() => setEmpresaSeleccionada(null)} maxWidth="md" fullWidth>
                <DialogTitle>🏢 {empresaSeleccionada?.empresa.name}</DialogTitle>
                <DialogContent dividers>
                    {empresaSeleccionada?.tareas.map((tarea) => (
                        <div
                            key={tarea.id}
                            style={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                            }}
                        >
                            <Typography variant="h6">📝 {tarea.titulo}</Typography>
                            <Typography>
                                <strong>Prioridad:</strong>{' '}
                                <Chip
                                    label={tarea.prioridad.toUpperCase()}
                                    size="small"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        backgroundColor: getColorPorPrioridad(tarea.prioridad),
                                    }}
                                />
                            </Typography>
                            <Typography>
                                <strong>Tipo:</strong> {tarea.tipo?.nombre_tipo ?? 'No especificado'}
                            </Typography>
                            <Typography>
                                <strong>Descripción:</strong> {tarea.descripcion || 'Sin descripción'}
                            </Typography>

                            <Typography mt={1} variant="subtitle2">
                                👤 Asignaciones:
                            </Typography>
                            {tarea.asignaciones && tarea.asignaciones.length > 0 ? (
                                tarea.asignaciones.map((asg) => (
                                    <div key={asg.id} style={{ marginLeft: '1rem' }}>
                                        <Typography variant="body1">Usuario: {asg.user?.name ?? 'Sin asignar'}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Estado: {asg.estado}
                                        </Typography>
                                    </div>
                                ))
                            ) : (
                                <Typography>No hay asignaciones para esta tarea.</Typography>
                            )}
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEmpresaSeleccionada(null)} variant="contained" color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default Mes;
