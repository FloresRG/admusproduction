import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FaUser, FaCalendarAlt, FaClipboard, FaRegClock, FaUsers } from 'react-icons/fa';

type CompanyCategory = {
    id: number;
    name: string;
};

type Company = {
    id: number;
    name: string;
    company_category_id: number;
    contract_duration: string;
    description: string;
    start_date: string | null;
    end_date: string | null;
    availability_days: {
        day_of_week: number;
        start_time: string;
        end_time: string;
        turno: string;
        cantidad?: number | null;
    }[];
};

type Props = {
    company: Company;
    categories: CompanyCategory[];
};

type Availability = {
    day_of_week: number;
    start_time: string;
    end_time: string;
    turno: 'mañana' | 'tarde';
    cantidad?: number | null;
};

function normalizeTime(time: string) {
    if (!time) return '';
    return time.length > 5 ? time.slice(0, 5) : time;
}

export default function Edita({ company, categories }: Props) {
    const initialAvailability = company.availability_days.map(avail => ({
        ...avail,
        start_time: normalizeTime(avail.start_time),
        end_time: normalizeTime(avail.end_time),
        cantidad: avail.cantidad ?? null,
    }));

    const { data, setData, put, processing, errors } = useForm({
        name: company.name,
        company_category_id: company.company_category_id,
        contract_duration: company.contract_duration,
        description: company.description || '',
        start_date: company.start_date || '',
        end_date: company.end_date || '',
        availability: initialAvailability.length > 0 ? initialAvailability : [
            { day_of_week: 1, start_time: '', end_time: '', turno: 'mañana', cantidad: null }
        ],
    });

    const handleAddAvailability = () => {
        setData('availability', [
            ...data.availability,
            { day_of_week: 1, start_time: '', end_time: '', turno: 'mañana', cantidad: null },
        ]);
    };

    const handleRemoveAvailability = (index: number) => {
        if (data.availability.length === 1) return;
        setData('availability', data.availability.filter((_, i) => i !== index));
    };

    const handleAvailabilityChange = (
        index: number,
        field: keyof Availability,
        value: Availability[keyof Availability]
    ) => {
        const updated = [...data.availability];
        if (field === 'start_time' || field === 'end_time') {
            updated[index] = { ...updated[index], [field]: normalizeTime(value as string) };
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        setData('availability', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const cleanedAvailability = data.availability.map(avail => ({
            ...avail,
            start_time: normalizeTime(avail.start_time),
            end_time: normalizeTime(avail.end_time),
        }));

        setData('availability', cleanedAvailability);

        put(`/companies/${company.id}`);
    };

    return (
        <AppLayout>
            <Head title="Editar Compañía" />
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Editar Compañía</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nombre de la compañía"
                            />
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.company_category_id}
                                onChange={e => setData('company_category_id', Number(e.target.value))}
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <FaClipboard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        {errors.company_category_id && <p className="text-red-500 text-sm mt-1">{errors.company_category_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duración del contrato</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.contract_duration}
                                onChange={e => setData('contract_duration', e.target.value)}
                                placeholder="Duración del contrato"
                            />
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        {errors.contract_duration && <p className="text-red-500 text-sm mt-1">{errors.contract_duration}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                        <div className="relative">
                            <textarea
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Descripción de la compañía"
                                rows={4}
                            />
                            <FaClipboard className="absolute left-3 top-3 text-gray-500" />
                        </div>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de inicio del contrato</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.start_date || ''}
                                onChange={e => setData('start_date', e.target.value)}
                            />
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de fin del contrato</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={data.end_date || ''}
                                onChange={e => setData('end_date', e.target.value)}
                            />
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                        {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Días de disponibilidad</label>
                        {data.availability.map((avail, idx) => (
                            <div key={idx} className="grid grid-cols-6 gap-2 mb-2 items-center">
                                <select
                                    className="input border-gray-300 rounded-lg"
                                    value={avail.day_of_week}
                                    onChange={e => handleAvailabilityChange(idx, 'day_of_week', parseInt(e.target.value))}
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
                                {/* Cantidad */}
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Cantidad"
                                    value={avail.cantidad ?? ''}
                                    min={0}
                                    onChange={e =>
                                        handleAvailabilityChange(
                                            idx,
                                            'cantidad',
                                            e.target.value ? parseInt(e.target.value) : null
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="ml-2 text-red-600 font-bold text-xl"
                                    onClick={() => handleRemoveAvailability(idx)}
                                    disabled={data.availability.length === 1}
                                    title="Eliminar este día"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddAvailability}
                            className="text-blue-600 font-semibold mt-2 hover:underline"
                        >
                            + Añadir otro día
                        </button>
                        {Object.keys(errors)
                            .filter(key => key.startsWith('availability'))
                            .map(key => (
                                <p key={key} className="text-red-500 text-sm mt-1">{errors[key as keyof typeof errors]}</p>
                            ))}
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50"
                            disabled={processing}
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

