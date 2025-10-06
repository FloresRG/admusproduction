import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

type Tarea = {
    id: number;
    titulo: string;
    fecha_produccion: string;
    empresa: {
        id: number;
        name: string;
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

// Función para obtener las fechas de lunes a sábado de la semana actual
const getFechasSemana = (): string[] => {
    const hoy = new Date();
    const primerDia = new Date(hoy);
    const day = hoy.getDay(); // 0 (Domingo) - 6 (Sábado)

    // Ajustar para que comience en lunes
    const diferencia = day === 0 ? -6 : 1 - day;
    primerDia.setDate(hoy.getDate() + diferencia);

    const fechas: string[] = [];

    for (let i = 0; i < 6; i++) { // Solo lunes a sábado
        const fecha = new Date(primerDia);
        fecha.setDate(primerDia.getDate() + i);
        fechas.push(fecha.toISOString().split('T')[0]); // YYYY-MM-DD
    }

    return fechas;
};

const TareasSemana = ({ tareas }: Props) => {
    const fechasSemana = getFechasSemana();

    return (
        <AppLayout>
            <Head title="Tareas de la Semana" />
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Tareas Pendientes Esta Semana</h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fechasSemana.map((fecha, index) => {
                        const fechaObj = new Date(fecha);
                        const diaSemana = diasSemana[index]; // del 0 al 5, lunes a sábado
                        const tareasDelDia = tareas[fecha] ?? [];

                        return (
                            <div key={fecha} className="rounded bg-white p-4 shadow">
                                <h2 className="mb-2 text-lg font-semibold">
                                    {diaSemana} ({fecha})
                                </h2>

                                {tareasDelDia.length === 0 ? (
                                    <p className="text-green-600">Libre</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {tareasDelDia.map((tarea) => (
                                            <li key={tarea.id} className="rounded border p-2">
                                                <strong>{tarea.titulo}</strong>
                                                <br />
                                                Empresa: {tarea.empresa.name}
                                                <br />
                                                Estado: {tarea.estado_produccion}
                                                <br />
                                                Estrategia: {tarea.estrategia}
                                                <br />
                                                Guion: {tarea.guion}
                                                <br />
                                                Comentario: {tarea.comentario}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
};

export default TareasSemana;
