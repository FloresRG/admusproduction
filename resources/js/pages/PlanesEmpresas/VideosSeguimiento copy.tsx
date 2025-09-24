import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Video = {
    nombre: string;
    semana: string;
    fecha_produccion: string;
    estado_entrega: string;
    fecha_edicion: string;
    estado_edicion: string;
    fecha_entrega: string;
    estado_entrega_final: string;
    estrategia: string;
    retroalimentacion: string;
};

type Props = {
    empresa: { id: number; name: string };
    videos: (Video & { id: number })[];
};

export default function SeguimientoVideos({ empresa, videos }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Video>({
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

    const handleChange = (field: keyof Video, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
                                <td className="px-2 py-1">{video.estado_entrega}</td>
                                <td className="px-2 py-1">{video.fecha_edicion}</td>
                                <td className="px-2 py-1">{video.estado_edicion}</td>
                                <td className="px-2 py-1">{video.fecha_entrega}</td>
                                <td className="px-2 py-1">{video.estado_entrega_final}</td>
                                <td className="px-2 py-1">{video.estrategia}</td>
                                <td className="px-2 py-1">{video.retroalimentacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal */}
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
                                {/* Text Inputs */}
                                {[
                                    { label: 'Nombre', key: 'nombre' },
                                    { label: 'Semana', key: 'semana' },
                                    { label: 'Estrategia', key: 'estrategia' },
                                    { label: 'Retroalimentación', key: 'retroalimentacion' },
                                ].map(({ label, key }) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium">{label}</label>
                                        <input
                                            type="text"
                                            value={(formData as any)[key]}
                                            onChange={(e) => handleChange(key as keyof Video, e.target.value)}
                                            className="w-full rounded border px-2 py-1 text-sm"
                                        />
                                    </div>
                                ))}

                                {/* Date Inputs */}
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
                                            onChange={(e) => handleChange(key as keyof Video, e.target.value)}
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
