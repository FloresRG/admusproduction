import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

type Video = {
    id: number;
    nombre: string;
    semana: string;
    fecha_produccion: string;
    estado_entrega: 'Pendiente' | 'Completado';
    fecha_edicion: string;
    estado_edicion: 'Pendiente' | 'Completado';
    fecha_entrega: string;
    estado_entrega_final: 'Pendiente' | 'Completado';
    estrategia: string;
    retroalimentacion: string;
};

type Props = {
    empresa: { id: number; name: string };
    videos: Video[];
};

export default function SeguimientoVideos({ empresa, videos }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Omit<Video, 'id'>>({
        nombre: '',
        semana: '',
        fecha_produccion: '',
        estado_entrega: 'Pendiente',
        fecha_edicion: '',
        estado_edicion: 'Pendiente',
        fecha_entrega: '',
        estado_entrega_final: 'Pendiente',
        estrategia: '',
        retroalimentacion: '',
    });

    const handleChange = (field: keyof Omit<Video, 'id'>, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            semana: '',
            fecha_produccion: '',
            estado_entrega: 'Pendiente',
            fecha_edicion: '',
            estado_edicion: 'Pendiente',
            fecha_entrega: '',
            estado_entrega_final: 'Pendiente',
            estrategia: '',
            retroalimentacion: '',
        });
    };

    const handleSubmit = () => {
        router.post(
            '/videos',
            {
                ...formData,
                empresa_id: empresa.id,
            },
            {
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                    router.reload({ only: ['videos'] });
                },
            },
        );
    };

    // Función para actualizar el estado cuando se selecciona radio button
    const updateEstado = (
        videoId: number,
        campo: 'estado_entrega' | 'estado_edicion' | 'estado_entrega_final',
        valor: 'Pendiente' | 'Completado',
    ) => {
        router.put(
            `/videos/${videoId}/estado`,
            {
                campo,
                valor,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Podrías actualizar localmente si quieres optimizar la UX
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head title={`Seguimiento de Videos - ${empresa.name}`} />
            <div className="container mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Seguimiento de Videos - {empresa.name}</h1>
                    <button onClick={() => setShowModal(true)} className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                        Crear Video
                    </button>
                </div>

                {/* Tabla con estados usando radio buttons */}
                <table className="min-w-full border border-gray-200 bg-white shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm font-semibold">
                            <th className="px-4 py-2">Semana</th>
                            <th className="px-4 py-2">Nombre</th>
                            <th className="px-4 py-2">Fecha Producción</th>
                            <th className="px-4 py-2">Estado Entrega</th>
                            <th className="px-4 py-2">Fecha Edición</th>
                            <th className="px-4 py-2">Estado Edición</th>
                            <th className="px-4 py-2">Fecha Entrega</th>
                            <th className="px-4 py-2">Estado Entrega Final</th>
                            <th className="px-4 py-2">Estrategia</th>
                            <th className="px-4 py-2">Retroalimentación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map((video) => (
                            <tr key={video.id} className="border-t text-sm">
                                <td className="px-2 py-1">{video.semana}</td>
                                <td className="px-2 py-1">{video.nombre}</td>
                                <td className="px-2 py-1">{video.fecha_produccion}</td>

                                {/* Estado Entrega */}
                                <td className="px-2 py-1">
                                    <RadioGroup
                                        row
                                        value={video.estado_entrega}
                                        onChange={(e) => updateEstado(video.id, 'estado_entrega', e.target.value as 'Pendiente' | 'Completado')}
                                    >
                                        <FormControlLabel value="Pendiente" control={<Radio />} label="Pendiente" />
                                        <FormControlLabel value="Completado" control={<Radio />} label="Completado" />
                                    </RadioGroup>
                                </td>

                                <td className="px-2 py-1">{video.fecha_edicion}</td>

                                {/* Estado Edición */}
                                <td className="px-2 py-1">
                                    <RadioGroup
                                        row
                                        value={video.estado_edicion}
                                        onChange={(e) => updateEstado(video.id, 'estado_edicion', e.target.value as 'Pendiente' | 'Completado')}
                                    >
                                        <FormControlLabel value="Pendiente" control={<Radio />} label="Pendiente" />
                                        <FormControlLabel value="Completado" control={<Radio />} label="Completado" />
                                    </RadioGroup>
                                </td>

                                <td className="px-2 py-1">{video.fecha_entrega}</td>

                                {/* Estado Entrega Final */}
                                <td className="px-2 py-1">
                                    <RadioGroup
                                        row
                                        value={video.estado_entrega_final}
                                        onChange={(e) => updateEstado(video.id, 'estado_entrega_final', e.target.value as 'Pendiente' | 'Completado')}
                                    >
                                        <FormControlLabel value="Pendiente" control={<Radio />} label="Pendiente" />
                                        <FormControlLabel value="Completado" control={<Radio />} label="Completado" />
                                    </RadioGroup>
                                </td>

                                <td className="px-2 py-1">{video.estrategia}</td>
                                <td className="px-2 py-1">{video.retroalimentacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal para creación */}
                {showModal && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                        <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Crear nuevo video</h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Campo Semana modificado */}
                                <div>
                                    <label className="block text-sm font-medium">Semana</label>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-block">Semana</span>
                                        <select
                                            value={formData.semana.replace('Semana ', '') || ''}
                                            onChange={(e) =>
                                                handleChange('semana', `Semana ${e.target.value}`)
                                            }
                                            className="rounded border px-2 py-1 text-sm"
                                        >
                                            <option value="">Selecciona</option>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Otros campos de texto */}
                                {[
                                    { label: 'Nombre', key: 'nombre' },
                                    { label: 'Estrategia', key: 'estrategia' },
                                    { label: 'Retroalimentación', key: 'retroalimentacion' },
                                ].map(({ label, key }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium">{label}</label>
                                        <input
                                            type="text"
                                            value={(formData as any)[key]}
                                            onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
                                            className="w-full rounded border px-2 py-1 text-sm"
                                        />
                                    </div>
                                ))}

                                {/* Inputs tipo fecha */}
                                {[
                                    { label: 'Fecha Producción', key: 'fecha_produccion' },
                                    { label: 'Fecha Edición', key: 'fecha_edicion' },
                                    { label: 'Fecha Entrega', key: 'fecha_entrega' },
                                ].map(({ label, key }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium">{label}</label>
                                        <input
                                            type="date"
                                            value={(formData as any)[key]}
                                            onChange={(e) => handleChange(key as keyof typeof formData, e.target.value)}
                                            className="w-full rounded border px-2 py-1 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button onClick={handleSubmit} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                    Guardar Video
                                </button>
                                
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
