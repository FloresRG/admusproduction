import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

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
    cantidad?: number | null;
};

export default function Create({ categories }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        company_category_id: string;
        contract_duration: string;
        description: string;
        start_date: string;
        end_date: string;
        availability: Availability[];
    }>({
        name: '',
        company_category_id: '',
        contract_duration: '',
        description: '',
        start_date: '',
        end_date: '',
        availability: [
            {
                day_of_week: 1,
                start_time: '',
                end_time: '',
                turno: 'mañana',
                cantidad: null,
            },
        ],
    });

    const handleAddAvailability = () => {
        setData('availability', [...data.availability, { day_of_week: 1, start_time: '', end_time: '', turno: 'mañana', cantidad: null }]);
    };

    const handleAvailabilityChange = (index: number, field: keyof Availability, value: Availability[keyof Availability]) => {
        const updated = [...data.availability];
        updated[index] = { ...updated[index], [field]: value };
        setData('availability', updated);
    };

    const handleRemoveAvailability = (index: number) => {
        if (data.availability.length === 1) return;
        setData(
            'availability',
            data.availability.filter((_, i) => i !== index),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/companies');
    };

    return (
        <AppLayout>
            <Head title="Crear Compañía" />

            <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold">Crear nueva compañía</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="mt-1 text-red-600">{errors.name}</div>}
                    </div>
                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.company_category_id}
                            onChange={(e) => setData('company_category_id', e.target.value)}
                        >
                            <option value="">Seleccione una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.company_category_id && <div className="mt-1 text-red-600">{errors.company_category_id}</div>}
                    </div>
                    {/* Duración del contrato */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duración del contrato</label>
                        <input
                            type="text"
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.contract_duration}
                            onChange={(e) => setData('contract_duration', e.target.value)}
                        />
                        {errors.contract_duration && <div className="mt-1 text-red-600">{errors.contract_duration}</div>}
                    </div>
                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    {/* Fecha de inicio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
                        <input
                            type="date"
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                        />
                        {errors.start_date && <div className="mt-1 text-red-600">{errors.start_date}</div>}
                    </div>
                    {/* Fecha de fin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de fin</label>
                        <input
                            type="date"
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                        />
                        {errors.end_date && <div className="mt-1 text-red-600">{errors.end_date}</div>}
                    </div>
                    {/* Disponibilidad */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Días de disponibilidad</label>
                        {data.availability.map((avail, idx) => (
                            <div key={idx} className="mb-4 grid grid-cols-5 items-center gap-4">
                                {/* Día de la semana */}
                                <select
                                    className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={avail.day_of_week}
                                    onChange={(e) => handleAvailabilityChange(idx, 'day_of_week', parseInt(e.target.value))}
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
                                    className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={avail.start_time}
                                    onChange={(e) => handleAvailabilityChange(idx, 'start_time', e.target.value)}
                                />
                                {/* Horario de fin */}
                                <input
                                    type="time"
                                    className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={avail.end_time}
                                    onChange={(e) => handleAvailabilityChange(idx, 'end_time', e.target.value)}
                                />
                                {/* Turno */}
                                <select
                                    className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={avail.turno}
                                    onChange={(e) => handleAvailabilityChange(idx, 'turno', e.target.value)}
                                >
                                    <option value="mañana">Mañana</option>
                                    <option value="tarde">Tarde</option>
                                </select>
                                {/* Cantidad */}
                                <input
                                    type="number"
                                    className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Cantidad"
                                    value={avail.cantidad ?? ''}
                                    min={0}
                                    onChange={(e) => handleAvailabilityChange(idx, 'cantidad', e.target.value ? parseInt(e.target.value) : null)}
                                />
                                {/* Eliminar día */}
                                <button
                                    type="button"
                                    className="ml-2 font-bold text-red-600"
                                    onClick={() => handleRemoveAvailability(idx)}
                                    disabled={data.availability.length === 1}
                                    title="Eliminar este día"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddAvailability} className="font-semibold text-blue-600">
                            + Añadir otro día
                        </button>
                        {Object.keys(errors)
                            .filter((key) => key.startsWith('availability'))
                            .map((key) => (
                                <div key={key} className="text-red-600">
                                    {errors[key as keyof typeof errors]}
                                </div>
                            ))}
                    </div>
                    {/* Botones */}
                    <div className="flex justify-end space-x-4">
                        <Link href="/companies" className="rounded-md bg-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-400">
                            Cancelar
                        </Link>
                        <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700" disabled={processing}>
                            {processing ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
