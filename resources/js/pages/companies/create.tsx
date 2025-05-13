import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

type CompanyCategory = {
    id: number;
    name: string;
};

type Props = {
    categories: CompanyCategory[];
};

type Availability = {
    day_of_week: number;
    start_time: string;
    end_time: string;
    turno: 'mañana' | 'tarde';
};

type AvailabilityField = keyof Availability;

export default function Create({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        company_category_id: string;
        contract_duration: string;
        description: string;
        availability: Availability[];
    }>({
        name: '',
        company_category_id: '',
        contract_duration: '',
        description: '',
        availability: [
            {
                day_of_week: 1,
                start_time: '',
                end_time: '',
                turno: 'mañana',
            },
        ],
    });

    const handleAddAvailability = () => {
        setData('availability', [
            ...data.availability,
            { day_of_week: 1, start_time: '', end_time: '', turno: 'mañana' },
        ]);
    };
    
    const handleAvailabilityChange = (
        index: number,
        field: keyof Availability,
        value: Availability[keyof Availability]
    ) => {
        const updated = [...data.availability];
        (updated[index][field] as typeof value) = value;
        setData('availability', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/companies');
    };

    return (
        <AppLayout>
            <Head title="Crear Compañía" />

            <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Crear nueva compañía</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre de la compañía */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-red-600 mt-1">{errors.name}</div>}
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select
                            className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.company_category_id}
                            onChange={e => setData('company_category_id', e.target.value)}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.company_category_id && (
                            <div className="text-red-600 mt-1">{errors.company_category_id}</div>
                        )}
                    </div>

                    {/* Duración del contrato */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duración del contrato</label>
                        <input
                            type="text"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.contract_duration}
                            onChange={e => setData('contract_duration', e.target.value)}
                        />
                        {errors.contract_duration && (
                            <div className="text-red-600 mt-1">{errors.contract_duration}</div>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                    </div>

                    {/* Disponibilidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Días de disponibilidad</label>
                        {data.availability.map((avail, idx) => (
                            <div key={idx} className="grid grid-cols-4 gap-4 mb-4">
                                {/* Día de la semana */}
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={avail.day_of_week}
                                    onChange={e =>
                                        handleAvailabilityChange(idx, 'day_of_week', parseInt(e.target.value))
                                    }
                                >
                                    <option value={1}>Lunes</option>
                                    <option value={2}>Martes</option>
                                    <option value={3}>Miércoles</option>
                                    <option value={4}>Jueves</option>
                                    <option value={5}>Viernes</option>
                                    <option value={6}>Sábado</option>
                                    <option value={7}>Domingo</option>
                                </select>

                                {/* Horario de inicio */}
                                <input
                                    type="time"
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={avail.start_time}
                                    onChange={e => handleAvailabilityChange(idx, 'start_time', e.target.value)}
                                />

                                {/* Horario de fin */}
                                <input
                                    type="time"
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={avail.end_time}
                                    onChange={e => handleAvailabilityChange(idx, 'end_time', e.target.value)}
                                />

                                {/* Turno */}
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={avail.turno}
                                    onChange={e => handleAvailabilityChange(idx, 'turno', e.target.value)}
                                >
                                    <option value="mañana">Mañana</option>
                                    <option value="tarde">Tarde</option>
                                </select>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddAvailability}
                            className="text-blue-600 font-semibold"
                        >
                            + Añadir otro día
                        </button>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4">
                        <Link href="/companies" className="px-6 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400">
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={processing}
                        >
                            {processing ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
