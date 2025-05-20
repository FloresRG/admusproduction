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
        direccion: string;
        start_date: string;
        end_date: string;
        availability: Availability[];
    }>({
        name: '',
        company_category_id: '',
        contract_duration: '',
        description: '',
        direccion: '',
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
            <Head title="Crear Empresa" />

            <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold">Crear nueva Empresa</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
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
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    </div>

                    {/* Dirección (ancho completo) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <textarea
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.direccion}
                            onChange={(e) => setData('direccion', e.target.value)}
                        />
                    </div>

                    {/* Descripción (ancho completo) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    {/* Disponibilidad (como la tienes, sin cambios grandes) */}
                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Días de disponibilidad</label>

                        {data.availability.map((avail, idx) => (
                            <div key={idx} className="mb-4 flex justify-center">
                                <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
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
                                    </select>

                                    {/* Turno */}
                                    <select
                                        className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={avail.turno}
                                        onChange={(e) => {
                                            const turno = e.target.value as 'mañana' | 'tarde';
                                            let start_time = '';
                                            let end_time = '';
                                            if (turno === 'mañana') {
                                                start_time = '09:30';
                                                end_time = '13:00';
                                            } else {
                                                start_time = '14:00';
                                                end_time = '18:00';
                                            }
                                            const updated = [...data.availability];
                                            updated[idx] = { ...updated[idx], turno, start_time, end_time };
                                            setData('availability', updated);
                                        }}
                                    >
                                        <option value="mañana">Mañana</option>
                                        <option value="tarde">Tarde</option>
                                    </select>

                                    {/* Botón eliminar */}
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="text-xl font-bold text-red-600"
                                            onClick={() => handleRemoveAvailability(idx)}
                                            disabled={data.availability.length === 1}
                                            title="Eliminar este día"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Botón añadir */}
                        <div className="mt-2 flex justify-center">
                            <button type="button" onClick={handleAddAvailability} className="font-semibold text-blue-600">
                                + Añadir otro día
                            </button>
                        </div>

                        {/* Errores de disponibilidad */}
                        {Object.keys(errors)
                            .filter((key) => key.startsWith('availability'))
                            .map((key) => (
                                <div key={key} className="text-center text-red-600">
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
