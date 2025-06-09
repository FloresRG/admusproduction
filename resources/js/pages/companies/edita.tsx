import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import CompanyMapInput from './CompanyMapInput';

type CompanyCategory = {
    id: number;
    name: string;
};

type Availability = {
    day_of_week: number;
    start_time: string;
    end_time: string;
    turno: 'mañana' | 'tarde';
    cantidad?: number | null;
};

type Company = {
    id: number;
    name: string;
    company_category_id: string;
    contract_duration: string;
    description: string;
    ubicacion: string;
    direccion: string;
    start_date: string;
    end_date: string;
};

type Props = {
    company: Company;
    categories: CompanyCategory[];
    availability: Availability[];
};

// Utilidad para crear disponibilidad vacía
const createEmptyAvailability = (): Availability => ({
    day_of_week: 1,
    start_time: '',
    end_time: '',
    turno: 'mañana',
    cantidad: null,
});

export default function Edit({ company, categories, availability }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name,
        company_category_id: company.company_category_id,
        contract_duration: company.contract_duration,
        description: company.description || '',
        ubicacion: company.ubicacion || '',
        direccion: company.direccion || '',
        start_date: company.start_date || '',
        end_date: company.end_date || '',
        availability: availability.length ? availability : [createEmptyAvailability()],
    });

    const handleAddAvailability = () => {
        setData('availability', [...data.availability, createEmptyAvailability()]);
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
        put(`/companies/${company.id}`);
    };

    return (
        <AppLayout>
            <Head title="Editar Empresa" />
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold">Editar Empresa</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                        <input
                            type="text"
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.ubicacion}
                            onChange={(e) => setData('ubicacion', e.target.value)}
                        />
                        {errors.ubicacion && <div className="mt-1 text-red-600">{errors.ubicacion}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Seleccionar ubicación en el mapa</label>
                        <CompanyMapInput
                            value={data.direccion}
                            onChange={(value) => setData('direccion', value)}
                        />
                        {errors.direccion && <div className="mt-1 text-red-600">{errors.direccion}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                        />
                        {errors.description && <div className="mt-1 text-red-600">{errors.description}</div>}
                    </div>

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Días de disponibilidad</label>

                        {data.availability.map((avail, idx) => (
                            <div key={idx} className="mb-4 flex justify-center">
                                <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-4">
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

                                    <select
                                        className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={avail.turno}
                                        onChange={(e) => {
                                            const turno = e.target.value as 'mañana' | 'tarde';
                                            const times =
                                                turno === 'mañana'
                                                    ? { start_time: '09:30', end_time: '13:00' }
                                                    : { start_time: '14:00', end_time: '18:00' };

                                            handleAvailabilityChange(idx, 'turno', turno);
                                            handleAvailabilityChange(idx, 'start_time', times.start_time);
                                            handleAvailabilityChange(idx, 'end_time', times.end_time);
                                        }}
                                    >
                                        <option value="mañana">Mañana</option>
                                        <option value="tarde">Tarde</option>
                                    </select>

                                    {/* Cantidad */}
                                    <div className="col-span-1">
                                        <label className="sr-only">Cantidad</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Cantidad"
                                            value={avail.cantidad ?? ''}
                                            onChange={(e) =>
                                                handleAvailabilityChange(idx, 'cantidad', e.target.value === '' ? null : parseInt(e.target.value, 10))
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="text-xl font-bold text-red-600 hover:text-red-800"
                                            onClick={() => handleRemoveAvailability(idx)}
                                            disabled={data.availability.length === 1}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-2 flex justify-center">
                            <button
                                type="button"
                                onClick={handleAddAvailability}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                + Añadir otro día
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/companies"
                            className="rounded-md bg-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-400"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
