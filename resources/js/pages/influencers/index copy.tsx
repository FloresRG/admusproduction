import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout'; // Suponiendo que tienes un layout similar
import { startOfWeek, endOfWeek, format } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

const breadcrumbs = [
    {
        title: 'Disponibilidad de Influencers',
        href: '/influencer-availability',
    },
];

interface InfluencerAvailability {
    id: number;
    user_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
}

const InfluencerAvailabilityCrud = () => {
    const [availabilities, setAvailabilities] = useState<InfluencerAvailability[]>([]);
    const [calendarDates, setCalendarDates] = useState<Date[]>([]); // Para almacenar los 7 días de la semana
    const [turnoSelection, setTurnoSelection] = useState<{ [key: string]: string }>({}); // Para almacenar el turno seleccionado por día
    const [userId, setUserId] = useState<number | null>(null); // Para almacenar el ID del usuario logueado

    useEffect(() => {
        setCalendarDates(getCurrentWeekDates()); // Cargar los días de la semana actual
        fetchAvailabilities();
        fetchUserId(); // Obtener el ID del usuario logueado
    }, []);

    // Función para obtener el ID del usuario logueado
    const fetchUserId = () => {
        axios.get('/api/auth/user') // Aquí supongo que tienes un endpoint para obtener el usuario logueado
            .then(response => {
                setUserId(response.data.id);
            })
            .catch(error => console.error('Error fetching user id:', error));
    };

    // Función para obtener los días de la semana actual (lunes a domingo)
    const getCurrentWeekDates = () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Semana comienza en lunes
        const end = endOfWeek(new Date(), { weekStartsOn: 1 });

        const weekDays = [];
        for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
            weekDays.push(new Date(day));
        }
        return weekDays;
    };

    // Función para obtener las disponibilidades del usuario
    const fetchAvailabilities = () => {
        axios.get('/api/influencer-availability')
            .then(response => {
                setAvailabilities(response.data);
                const initialTurnoSelection: { [key: string]: string } = {};
                response.data.forEach((avail: InfluencerAvailability) => {
                    initialTurnoSelection[avail.day_of_week] = avail.turno;
                });
                setTurnoSelection(initialTurnoSelection); // Establece los turnos seleccionados al cargar los datos
            })
            .catch(error => console.error('Error fetching availabilities:', error));
    };

    // Función para manejar la selección de turno y guardar en base de datos
    const handleTurnoSelection = (day: string, turno: string) => {
        const previousTurno = turnoSelection[day];

        if (previousTurno === turno) {
            // Si el turno ya está seleccionado, lo eliminamos (deseleccionamos)
            deleteAvailability(day, previousTurno);
            return;
        }

        // Si no estaba seleccionado, lo seleccionamos
        setTurnoSelection((prev) => ({
            ...prev,
            [day]: turno,
        }));

        // Asignar las horas dependiendo del turno
        const start_time = turno === 'mañana' ? '09:30' : '14:00';
        const end_time = turno === 'mañana' ? '13:00' : '18:00';

        // Si ya había un turno, lo eliminamos antes de agregar el nuevo
        const existingAvailability = availabilities.find(
            (avail) => avail.day_of_week === day && avail.turno === previousTurno
        );

        if (existingAvailability) {
            // Eliminar la disponibilidad anterior si se cambia de turno
            deleteAvailability(day, previousTurno);
        }

        // Crear o actualizar la disponibilidad en la base de datos
        const existingAvailabilityNewTurno = availabilities.find(
            (avail) => avail.day_of_week === day && avail.turno === turno
        );

        if (existingAvailabilityNewTurno) {
            // Si existe, actualizamos
            updateAvailability(existingAvailabilityNewTurno.id, start_time, end_time);
        } else {
            // Si no existe, creamos una nueva disponibilidad
            createAvailability(day, turno, start_time, end_time);
        }
    };

    // Crear una nueva disponibilidad
    const createAvailability = (day: string, turno: string, start_time: string, end_time: string) => {
        axios.post('/api/influencer-availability', {
            user_id: userId,
            day_of_week: day,
            turno,
            start_time,
            end_time
        })
        .then(() => fetchAvailabilities())
        .catch(error => console.error('Error creating availability:', error));
    };

    // Actualizar una disponibilidad existente
    const updateAvailability = (id: number, start_time: string, end_time: string) => {
        axios.put(`/api/influencer-availability/${id}`, { start_time, end_time })
            .then(() => fetchAvailabilities())
            .catch(error => console.error('Error updating availability:', error));
    };

    // Eliminar una disponibilidad
    const deleteAvailability = (day: string, turno: string) => {
        const existingAvailability = availabilities.find(
            (avail) => avail.day_of_week === day && avail.turno === turno
        );

        if (existingAvailability) {
            axios.delete(`/api/influencer-availability/${existingAvailability.id}`)
                .then(() => fetchAvailabilities()) // Refrescar después de eliminar
                .catch(error => console.error('Error deleting availability:', error));
        }
    };

    // Verificar si un día y turno están seleccionados
    const isTurnoSelected = (day: string, turno: string) => {
        return turnoSelection[day] === turno;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
                        Disponibilidad de Influencers
                    </h1>
                </div>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl  tracking-tight text-gray-800">
                        Agregar los dias y turnos disponibles
                    </h2>
                </div>
                

                <div className="bg-white border rounded-lg shadow overflow-x-auto p-6">
                    <div className="grid grid-cols-7 gap-4">
                        {calendarDates.map((date, index) => {
                            const dayOfWeek = format(date, 'EEEE').toLowerCase(); // Ejemplo: 'lunes', 'martes', etc.
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center p-4 border border-gray-300 rounded-lg"
                                >
                                    <div className="font-semibold text-center mb-4">
                                        {format(date, 'dd MMM')} {/* Muestra la fecha */}
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => handleTurnoSelection(dayOfWeek, 'mañana')}
                                            className={`px-4 py-2 rounded-md ${
                                                isTurnoSelected(dayOfWeek, 'mañana')
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-200'
                                            }`}
                                        >
                                            Mañana (09:30 - 13:00)
                                        </button>
                                        <button
                                            onClick={() => handleTurnoSelection(dayOfWeek, 'tarde')}
                                            className={`px-4 py-2 rounded-md ${
                                                isTurnoSelected(dayOfWeek, 'tarde')
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-gray-200'
                                            }`}
                                        >
                                            Tarde (14:00 - 18:00)
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default InfluencerAvailabilityCrud;
