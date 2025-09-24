import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
type CompanyData = {
    id: number;
    name: string;
    company_category_id: number;
    contract_duration: string | null;
    start_date: string;
    end_date: string;
    celular: string | null;
    paquete_id: number;
    nombre_cliente: string | null;
    especificaciones: string | null;
    seguidores_inicio: number | null;
    seguidores_fin: number | null;
};
type Props = {
    empresa: CompanyData; // Usamos el nuevo tipo
    videos: Video[];
};

export default function SeguimientoVideos({ empresa, videos }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingVideoId, setEditingVideoId] = useState<number | null>(null);
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
        setEditingVideoId(null);
    };

    const handleSubmit = () => {
        if (editingVideoId) {
            router.put(
                `/videos/${editingVideoId}`,
                {
                    ...formData,
                    empresa_id: empresa.id,
                },
                {
                    onSuccess: () => {
                        setShowModal(false);
                        resetForm();
                    },
                },
            );
        } else {
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
                    },
                },
            );
        }
    };

    const handleEdit = (video: Video) => {
        setEditingVideoId(video.id);
        setFormData({
            nombre: video.nombre,
            semana: video.semana,
            fecha_produccion: video.fecha_produccion,
            estado_entrega: video.estado_entrega,
            fecha_edicion: video.fecha_edicion,
            estado_edicion: video.estado_edicion,
            fecha_entrega: video.fecha_entrega,
            estado_entrega_final: video.estado_entrega_final,
            estrategia: video.estrategia,
            retroalimentacion: video.retroalimentacion,
        });
        setShowModal(true);
    };

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
            },
        );
    };

    // --- LÓGICA DE AGRUPACIÓN ---
    const videosAgrupados = useMemo(() => {
        const grupos: { [key: string]: Video[] } = {};
        videos.forEach((video) => {
            if (!grupos[video.semana]) {
                grupos[video.semana] = [];
            }
            grupos[video.semana].push(video);
        });

        return Object.keys(grupos)
            .sort((a, b) => {
                const numA = parseInt(a.replace('Semana ', ''));
                const numB = parseInt(b.replace('Semana ', ''));
                return numA - numB;
            })
            .reduce(
                (obj, key) => {
                    obj[key] = grupos[key];
                    return obj;
                },
                {} as { [key: string]: Video[] },
            );
    }, [videos]);

    // --- Lógica para obtener el año y mes actual ---
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.toLocaleString('es-ES', { month: 'long' });

    return (
        <AppLayout>
            <Head title={`Seguimiento de Videos - ${empresa.name}`} />
            <div className="container mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Seguimiento de Videos - {empresa.name}</h1>
                    <button
                        onClick={() => {
                            setShowModal(true);
                            resetForm();
                        }}
                        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        Crear Video
                    </button>
                    <button
                        onClick={() => {
                            window.open(`/videos/${empresa.id}/pdf`, '_blank');
                        }}
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        Descargar PDF
                    </button>
                </div>
                <div className="mb-6 rounded-lg bg-gray-50 p-4 shadow-md">
                    <h2 className="mb-2 text-xl font-semibold">Datos de la Empresa</h2>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                        <p>
                            <strong>Categoría:</strong> {empresa.company_category_id}
                        </p>
                        <p>
                            <strong>Duración del contrato:</strong> {empresa.contract_duration}
                        </p>
                        <p>
                            <strong>Inicio del contrato:</strong> {empresa.start_date}
                        </p>
                        <p>
                            <strong>Fin del contrato:</strong> {empresa.end_date}
                        </p>
                        <p>
                            <strong>Celular:</strong> {empresa.celular}
                        </p>
                        <p>
                            <strong>Paquete ID:</strong> {empresa.paquete_id}
                        </p>
                        <p>
                            <strong>Nombre del Cliente:</strong> {empresa.nombre_cliente}
                        </p>
                        <p>
                            <strong>Seguidores (Inicio):</strong> {empresa.seguidores_inicio}
                        </p>
                        <p>
                            <strong>Seguidores (Fin):</strong> {empresa.seguidores_fin}
                        </p>
                        <p className="col-span-1 md:col-span-2 lg:col-span-3">
                            <strong>Especificaciones:</strong> {empresa.especificaciones}
                        </p>
                    </div>
                </div>

                {/* * LÍNEA AGREGADA
                 * Muestra el año y el mes actual encima de la tabla
                 */}
                <div className="mb-4 text-center">
                    <h2 className="text-xl font-bold">
                        {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} {currentYear}
                    </h2>
                </div>

                {Object.keys(videosAgrupados).length > 0 ? (
                    Object.keys(videosAgrupados).map((semana) => (
                        <div key={semana} className="mb-8">
                            <h2 className="mb-4 rounded-t-md border-b-2 border-gray-300 bg-gray-200 p-2 text-xl font-semibold">{semana}</h2>
                            <table className="min-w-full border border-gray-200 bg-white shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left text-sm font-semibold">
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Fecha Producción</th>
                                        <th className="px-4 py-2">Estado Entrega</th>
                                        <th className="px-4 py-2">Fecha Edición</th>
                                        <th className="px-4 py-2">Estado Edición</th>
                                        <th className="px-4 py-2">Fecha Entrega</th>
                                        <th className="px-4 py-2">Estado Entrega Final</th>
                                        <th className="px-4 py-2">Estrategia</th>
                                        <th className="px-4 py-2">Retroalimentación</th>
                                        <th className="px-4 py-2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videosAgrupados[semana].map((video) => (
                                        <tr key={video.id} className="border-t text-sm">
                                            <td className="px-2 py-1">{video.nombre}</td>
                                            <td className="px-2 py-1">{video.fecha_produccion}</td>
                                            <td className="px-2 py-1">
                                                <RadioGroup
                                                    row
                                                    value={video.estado_entrega}
                                                    onChange={(e) =>
                                                        updateEstado(video.id, 'estado_entrega', e.target.value as 'Pendiente' | 'Completado')
                                                    }
                                                >
                                                    <FormControlLabel value="Pendiente" control={<Radio size="small" />} label="Pendiente" />
                                                    <FormControlLabel value="Completado" control={<Radio size="small" />} label="Completado" />
                                                </RadioGroup>
                                            </td>
                                            <td className="px-2 py-1">{video.fecha_edicion}</td>
                                            <td className="px-2 py-1">
                                                <RadioGroup
                                                    row
                                                    value={video.estado_edicion}
                                                    onChange={(e) =>
                                                        updateEstado(video.id, 'estado_edicion', e.target.value as 'Pendiente' | 'Completado')
                                                    }
                                                >
                                                    <FormControlLabel value="Pendiente" control={<Radio size="small" />} label="Pendiente" />
                                                    <FormControlLabel value="Completado" control={<Radio size="small" />} label="Completado" />
                                                </RadioGroup>
                                            </td>
                                            <td className="px-2 py-1">{video.fecha_entrega}</td>
                                            <td className="px-2 py-1">
                                                <RadioGroup
                                                    row
                                                    value={video.estado_entrega_final}
                                                    onChange={(e) =>
                                                        updateEstado(video.id, 'estado_entrega_final', e.target.value as 'Pendiente' | 'Completado')
                                                    }
                                                >
                                                    <FormControlLabel value="Pendiente" control={<Radio size="small" />} label="Pendiente" />
                                                    <FormControlLabel value="Completado" control={<Radio size="small" />} label="Completado" />
                                                </RadioGroup>
                                            </td>
                                            <td className="px-2 py-1">{video.estrategia}</td>
                                            <td className="px-2 py-1">{video.retroalimentacion}</td>
                                            <td className="px-2 py-1">
                                                <button
                                                    onClick={() => handleEdit(video)}
                                                    className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center text-gray-500">No hay videos de seguimiento registrados para esta empresa.</div>
                )}

                {showModal && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                        <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">{editingVideoId ? 'Editar Video' : 'Crear nuevo video'}</h2>
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
                                <div>
                                    <label className="block text-sm font-medium">Semana</label>
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-block">Semana</span>
                                        <select
                                            value={formData.semana.replace('Semana ', '') || ''}
                                            onChange={(e) => handleChange('semana', `Semana ${e.target.value}`)}
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

                                {!editingVideoId && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium">Estado Entrega</label>
                                            <RadioGroup
                                                row
                                                value={formData.estado_entrega}
                                                onChange={(e) => handleChange('estado_entrega', e.target.value)}
                                            >
                                                <FormControlLabel value="Pendiente" control={<Radio size="small" />} label="Pendiente" />
                                                <FormControlLabel value="Completado" control={<Radio size="small" />} label="Completado" />
                                            </RadioGroup>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Estado Edición</label>
                                            <RadioGroup
                                                row
                                                value={formData.estado_edicion}
                                                onChange={(e) => handleChange('estado_edicion', e.target.value)}
                                            >
                                                <FormControlLabel value="Pendiente" control={<Radio size="small" />} label="Pendiente" />
                                                <FormControlLabel value="Completado" control={<Radio size="small" />} label="Completado" />
                                            </RadioGroup>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Estado Entrega Final</label>
                                            <RadioGroup
                                                row
                                                value={formData.estado_entrega_final}
                                                onChange={(e) => handleChange('estado_entrega_final', e.target.value)}
                                            >
                                                <FormControlLabel value="Pendiente" control={<Radio size="small" />} label="Pendiente" />
                                                <FormControlLabel value="Completado" control={<Radio size="small" />} label="Completado" />
                                            </RadioGroup>
                                        </div>
                                    </>
                                )}
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
                                    {editingVideoId ? 'Actualizar Video' : 'Guardar Video'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
