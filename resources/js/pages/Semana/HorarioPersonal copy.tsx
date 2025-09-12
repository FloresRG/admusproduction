import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

// Definir tipos para TypeScript
interface User {
    id: number;
    name: string;
    email: string;
}

interface Company {
    id: number;
    name: string;
    direccion?: string;
    ubicacion?: string;
}

interface Asignacion {
    company: Company;
    fecha: string;
    asignacion_id: number;
}

interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface Props {
    user: User;
    horarioSemanal: Record<string, Record<string, Asignacion | null>>;
    currentWeek: Week;
    weeks?: Week[];
    diasSemana: Record<string, string>;
    turnos: Record<string, string>;
    totalAsignaciones: number;
}

export default function Index({ user, horarioSemanal, currentWeek, weeks = [], diasSemana, turnos, totalAsignaciones }: Props) {
    const handleWeekChange = (e) => {
        const weekId = e.target.value;
        router.get('/mi-horario', { week_id: weekId });
    };

    const getTurnoColor = (turno) => {
        switch (turno) {
            case 'mañana':
                return 'bg-blue-100 text-blue-800';
            case 'tarde':
                return 'bg-orange-100 text-orange-800';
            case 'noche':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTurnoIcon = (turno) => {
        switch (turno) {
            case 'mañana':
                return '☀️';
            case 'tarde':
                return '🌤️';
            case 'noche':
                return '🌙';
            default:
                return '⏰';
        }
    };

    return (
        <AppLayout>
            <>
                <Head title="Mi Horario Semanal" />

                <div className="min-h-screen bg-gray-50 py-6">
                    <div className="mx-auto max-w-6xl px-4">
                        {/* Header */}
                        <div className="mb-6 rounded-lg bg-white p-6 shadow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Mi Horario Semanal</h1>
                                    <p className="text-gray-600">
                                        Bienvenido, <span className="font-semibold">{user.name}</span>
                                    </p>
                                </div>

                                <div className="mt-4 md:mt-0">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Seleccionar semana:</label>
                                    <select
                                        onChange={handleWeekChange}
                                        value={currentWeek.id}
                                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        {weeks &&
                                            weeks.map((week) => (
                                                <option key={week.id} value={week.id}>
                                                    {week.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Resumen */}
                        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg bg-white p-4 text-center shadow">
                                <div className="text-2xl font-bold text-blue-600">{totalAsignaciones}</div>
                                <div className="text-gray-600">Asignaciones totales</div>
                            </div>
                            <div className="rounded-lg bg-white p-4 text-center shadow">
                                <div className="text-2xl font-bold text-green-600">
                                    {Object.values(horarioSemanal).filter((dia) => Object.values(dia).some((turno) => turno !== null)).length}
                                </div>
                                <div className="text-gray-600">Días con trabajo</div>
                            </div>
                            <div className="rounded-lg bg-white p-4 text-center shadow">
                                <div className="text-2xl font-bold text-purple-600">
                                    {
                                        new Set(
                                            Object.values(horarioSemanal).flatMap((dia) =>
                                                Object.values(dia)
                                                    .filter((asig) => asig)
                                                    .map((asig) => asig.company.id),
                                            ),
                                        ).size
                                    }
                                </div>
                                <div className="text-gray-600">Empresas diferentes</div>
                            </div>
                        </div>

                        {/* Tabla de horario */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="bg-gray-800 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">{currentWeek.name}</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Turno</th>
                                            {Object.entries(diasSemana).map(([dia, nombre]) => (
                                                <th
                                                    key={dia}
                                                    className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                >
                                                    {nombre}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {Object.entries(turnos).map(([turno, descripcion]) => (
                                            <tr key={turno} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div
                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTurnoColor(turno)}`}
                                                    >
                                                        <span className="mr-1">{getTurnoIcon(turno)}</span>
                                                        {turno.charAt(0).toUpperCase() + turno.slice(1)}
                                                    </div>
                                                </td>
                                                {Object.keys(diasSemana).map((dia) => {
                                                    const asignacion = horarioSemanal[dia] && horarioSemanal[dia][turno];
                                                    return (
                                                        <td key={`${dia}-${turno}`} className="px-4 py-4 text-center">
                                                            {asignacion ? (
                                                                <div className="rounded-lg border border-green-200 bg-green-50 p-2">
                                                                    <div className="text-sm font-medium text-green-800">
                                                                        {asignacion.company.name}
                                                                    </div>
                                                                    {asignacion.company.direccion && (
                                                                        <div className="text-xs text-green-600 italic">
                                                                            {asignacion.company.direccion}
                                                                        </div>
                                                                    )}
                                                                    <div className="text-xs text-green-600">
                                                                        {new Date(asignacion.fecha).toLocaleDateString('es-ES', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-400">Libre</div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mensaje si no hay asignaciones */}
                        {totalAsignaciones === 0 && (
                            <div className="mt-6 rounded-lg bg-white p-8 text-center shadow">
                                <div className="mb-4 text-4xl text-gray-400">📅</div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">No tienes asignaciones esta semana</h3>
                                <p className="text-gray-600">No se han programado actividades para ti en la semana seleccionada.</p>
                            </div>
                        )}
                    </div>
                </div>
            </>
        </AppLayout>
    );
}
