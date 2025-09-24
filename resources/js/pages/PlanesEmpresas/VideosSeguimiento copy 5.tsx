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
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        Seguimiento de Videos - {empresa.name}
                    </h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                setShowModal(true);
                                resetForm();
                            }}
                            className="rounded-full bg-emerald-600 px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            ➕ Crear Video
                        </button>
                        <button
                            onClick={() => {
                                window.open(`/videos/${empresa.id}/pdf`, '_blank');
                            }}
                            className="rounded-full bg-red-600 px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            ⬇️ Descargar PDF
                        </button>
                    </div>
                </div>

                <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                        Datos de la Empresa
                    </h2>
                    <div className="grid grid-cols-1 gap-6 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-3">
                        <p>
                            <strong className="text-gray-800">Categoría:</strong>{' '}
                            {empresa.company_category_id}
                        </p>
                        <p>
                            <strong className="text-gray-800">Duración del contrato:</strong>{' '}
                            {empresa.contract_duration}
                        </p>
                        <p>
                            <strong className="text-gray-800">Inicio del contrato:</strong>{' '}
                            {empresa.start_date}
                        </p>
                        <p>
                            <strong className="text-gray-800">Fin del contrato:</strong>{' '}
                            {empresa.end_date}
                        </p>
                        <p>
                            <strong className="text-gray-800">Celular:</strong> {empresa.celular}
                        </p>
                        <p>
                            <strong className="text-gray-800">Paquete ID:</strong>{' '}
                            {empresa.paquete_id}
                        </p>
                        <p>
                            <strong className="text-gray-800">Nombre del Cliente:</strong>{' '}
                            {empresa.nombre_cliente}
                        </p>
                        <p>
                            <strong className="text-gray-800">Seguidores (Inicio):</strong>{' '}
                            {empresa.seguidores_inicio}
                        </p>
                        <p>
                            <strong className="text-gray-800">Seguidores (Fin):</strong>{' '}
                            {empresa.seguidores_fin}
                        </p>
                        <p className="col-span-1 md:col-span-2 lg:col-span-3">
                            <strong className="text-gray-800">Especificaciones:</strong>{' '}
                            {empresa.especificaciones}
                        </p>
                    </div>
                </div>

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)} {currentYear}
                    </h2>
                </div>

                {Object.keys(videosAgrupados).length > 0 ? (
                    Object.keys(videosAgrupados).map((semana) => (
                        <div key={semana} className="mb-8">
                            <h2 className="bg-gray-100 p-4 text-xl font-semibold text-gray-700 shadow-sm">
                                {semana}
                            </h2>
                            <div className="overflow-x-auto shadow-md">
                                <table className="min-w-full border-collapse bg-white">
                                    <thead>
                                        <tr className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                                            <th className="px-4 py-3">Nombre</th>
                                            <th className="px-4 py-3">Fecha Prod.</th>
                                            <th className="px-4 py-3">Estado Entrega</th>
                                            <th className="px-4 py-3">Fecha Edic.</th>
                                            <th className="px-4 py-3">Estado Edición</th>
                                            <th className="px-4 py-3">Fecha Entrega</th>
                                            <th className="px-4 py-3">Estado Final</th>
                                            <th className="px-4 py-3">Estrategia</th>
                                            <th className="px-4 py-3">Retro.</th>
                                            <th className="px-4 py-3">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {videosAgrupados[semana].map((video) => (
                                            <tr
                                                key={video.id}
                                                className="text-sm transition-colors duration-150 hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-2">{video.nombre}</td>
                                                <td className="px-4 py-2">
                                                    {video.fecha_produccion}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <RadioGroup
                                                        row
                                                        value={video.estado_entrega}
                                                        onChange={(e) =>
                                                            updateEstado(
                                                                video.id,
                                                                'estado_entrega',
                                                                e.target.value as
                                                                    | 'Pendiente'
                                                                    | 'Completado',
                                                            )
                                                        }
                                                    >
                                                        <FormControlLabel
                                                            value="Pendiente"
                                                            control={
                                                                <Radio
                                                                    size="small"
                                                                    color="warning"
                                                                />
                                                            }
                                                            label="Pendiente"
                                                        />
                                                        <FormControlLabel
                                                            value="Completado"
                                                            control={
                                                                <Radio
                                                                    size="small"
                                                                    color="success"
                                                                />
                                                            }
                                                            label="Completado"
                                                        />
                                                    </RadioGroup>
                                                </td>
                                                <td className="px-4 py-2">{video.fecha_edicion}</td>
                                                <td className="px-4 py-2">
                                                    <RadioGroup
                                                        row
                                                        value={video.estado_edicion}
                                                        onChange={(e) =>
                                                            updateEstado(
                                                                video.id,
                                                                'estado_edicion',
                                                                e.target.value as
                                                                    | 'Pendiente'
                                                                    | 'Completado',
                                                            )
                                                        }
                                                    >
                                                        <FormControlLabel
                                                            value="Pendiente"
                                                            control={
                                                                <Radio
                                                                    size="small"
                                                                    color="warning"
                                                                />
                                                            }
                                                            label="Pendiente"
                                                        />
                                                        <FormControlLabel
                                                            value="Completado"
                                                            control={
                                                                <Radio
                                                                    size="small"
                                                                    color="success"
                                                                />
                                                            }
                                                            label="Completado"
                                                        />
                                                    </RadioGroup>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {video.fecha_entrega}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <RadioGroup
                                                        row
                                                        value={video.estado_entrega_final}
                                                        onChange={(e) =>
                                                            updateEstado(
                                                                video.id,
                                                                'estado_entrega_final',
                                                                e.target.value as
                                                                    | 'Pendiente'
                                                                    | 'Completado',
                                                            )
                                                        }
                                                    >
                                                        <FormControlLabel
                                                            value="Pendiente"
                                                            control={
                                                                <Radio
                                                                    size="small"
                                                                    color="warning"
                                                                />
                                                            }
                                                            label="Pendiente"
                                                        />
                                                        <FormControlLabel
                                                            value="Completado"
                                                            control={
                                                                <Radio
                                                                    size="small"
                                                                    color="success"
                                                                />
                                                            }
                                                            label="Completado"
                                                        />
                                                    </RadioGroup>
                                                </td>
                                                <td className="px-4 py-2">{video.estrategia}</td>
                                                <td className="px-4 py-2">
                                                    {video.retroalimentacion}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => handleEdit(video)}
                                                        className="rounded bg-blue-500 px-3 py-1 text-xs text-white transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        ✏️ Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-md bg-white p-10 text-center text-lg font-medium text-gray-500 shadow-md">
                        <p>
                            No hay videos de seguimiento registrados para esta empresa. 😔
                            <br />
                            ¡Crea el primer video para empezar!
                        </p>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 transition-opacity duration-300">
                        <div
                            className="w-full max-w-4xl transform rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 ease-in-out"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {editingVideoId ? '📝 Editar Video' : '➕ Crear Nuevo Video'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-2xl text-gray-500 transition-colors duration-200 hover:text-gray-900"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Campos de texto e input */}
                                <div className="space-y-4">
                                    {[
                                        { label: 'Nombre', key: 'nombre' },
                                        { label: 'Estrategia', key: 'estrategia' },
                                        { label: 'Retroalimentación', key: 'retroalimentacion' },
                                    ].map(({ label, key }) => (
                                        <div key={key}>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                {label}
                                            </label>
                                            <input
                                                type="text"
                                                value={(formData as any)[key]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        key as keyof typeof formData,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-md border-gray-300 p-2 text-sm shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Semana
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-500">Semana</span>
                                            <select
                                                value={
                                                    formData.semana.replace('Semana ', '') || ''
                                                }
                                                onChange={(e) =>
                                                    handleChange('semana', `Semana ${e.target.value}`)
                                                }
                                                className="rounded-md border-gray-300 p-2 text-sm shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
                                </div>

                                {/* Campos de fecha y radio buttons */}
                                <div className="space-y-4">
                                    {[
                                        { label: 'Fecha Producción', key: 'fecha_produccion' },
                                        { label: 'Fecha Edición', key: 'fecha_edicion' },
                                        { label: 'Fecha Entrega', key: 'fecha_entrega' },
                                    ].map(({ label, key }) => (
                                        <div key={key}>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                {label}
                                            </label>
                                            <input
                                                type="date"
                                                value={(formData as any)[key]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        key as keyof typeof formData,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-md border-gray-300 p-2 text-sm shadow-sm transition-colors duration-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                        </div>
                                    ))}

                                    {!editingVideoId && (
                                        <>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Estado de Entrega
                                                </label>
                                                <RadioGroup
                                                    row
                                                    value={formData.estado_entrega}
                                                    onChange={(e) =>
                                                        handleChange('estado_entrega', e.target.value)
                                                    }
                                                >
                                                    <FormControlLabel
                                                        value="Pendiente"
                                                        control={<Radio size="small" />}
                                                        label="Pendiente"
                                                    />
                                                    <FormControlLabel
                                                        value="Completado"
                                                        control={<Radio size="small" />}
                                                        label="Completado"
                                                    />
                                                </RadioGroup>
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Estado de Edición
                                                </label>
                                                <RadioGroup
                                                    row
                                                    value={formData.estado_edicion}
                                                    onChange={(e) =>
                                                        handleChange('estado_edicion', e.target.value)
                                                    }
                                                >
                                                    <FormControlLabel
                                                        value="Pendiente"
                                                        control={<Radio size="small" />}
                                                        label="Pendiente"
                                                    />
                                                    <FormControlLabel
                                                        value="Completado"
                                                        control={<Radio size="small" />}
                                                        label="Completado"
                                                    />
                                                </RadioGroup>
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                    Estado de Entrega Final
                                                </label>
                                                <RadioGroup
                                                    row
                                                    value={formData.estado_entrega_final}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'estado_entrega_final',
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <FormControlLabel
                                                        value="Pendiente"
                                                        control={<Radio size="small" />}
                                                        label="Pendiente"
                                                    />
                                                    <FormControlLabel
                                                        value="Completado"
                                                        control={<Radio size="small" />}
                                                        label="Completado"
                                                    />
                                                </RadioGroup>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="rounded-full border border-gray-300 bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                >
                                    Cancelar
                                    
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
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