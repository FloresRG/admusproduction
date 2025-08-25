import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Save, Trophy } from 'lucide-react';
import React from 'react';

interface Premio {
    id: number;
    nombre_premio: string;
    descripcion: string | null;
    puntos_necesarios: number | null;
    created_at: string;
    updated_at: string;
}

interface FormData {
    nombre_premio: string;
    descripcion: string;
    puntos_necesarios: string;
}

interface Props {
    premio: Premio;
}

export default function EditPremio({ premio }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        nombre_premio: premio.nombre_premio,
        descripcion: premio.descripcion || '',
        puntos_necesarios: premio.puntos_necesarios?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/premios/${premio.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Editar Premio - ${premio.nombre_premio}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <Link href="/premios" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                                <ArrowLeft className="h-6 w-6 text-gray-600" />
                            </Link>
                            <div className="rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 p-3">
                                <Edit className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Editar Premio</h1>
                                <p className="text-gray-600">Modifica la información del premio</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="rounded-xl bg-white p-8 shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombre del Premio */}
                            <div>
                                <label htmlFor="nombre_premio" className="mb-2 block text-sm font-bold text-gray-700">
                                    Nombre del Premio *
                                </label>
                                <input
                                    type="text"
                                    id="nombre_premio"
                                    value={data.nombre_premio}
                                    onChange={(e) => setData('nombre_premio', e.target.value)}
                                    className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                                        errors.nombre_premio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: iPhone 15 Pro Max"
                                />
                                {errors.nombre_premio && <p className="mt-1 text-sm text-red-600">{errors.nombre_premio}</p>}
                            </div>

                            {/* Descripción */}
                            <div>
                                <label htmlFor="descripcion" className="mb-2 block text-sm font-bold text-gray-700">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    rows={4}
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className={`w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                                        errors.descripcion ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Describe el premio, sus características, condiciones, etc."
                                />
                                {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
                            </div>

                            {/* Puntos Necesarios */}
                            <div>
                                <label htmlFor="puntos_necesarios" className="mb-2 block text-sm font-bold text-gray-700">
                                    Puntos Necesarios
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="puntos_necesarios"
                                        min="0"
                                        value={data.puntos_necesarios}
                                        onChange={(e) => setData('puntos_necesarios', e.target.value)}
                                        className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
                                            errors.puntos_necesarios ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="1000"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-sm text-gray-500">pts</span>
                                    </div>
                                </div>
                                {errors.puntos_necesarios && <p className="mt-1 text-sm text-red-600">{errors.puntos_necesarios}</p>}
                            </div>

                            {/* Preview Card */}
                            <div className="rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Vista Previa de los Cambios</h3>
                                <div className="rounded-lg bg-white p-4 shadow-md">
                                    <h4 className="mb-2 font-bold text-gray-900">{data.nombre_premio || 'Nombre del premio'}</h4>
                                    {data.descripcion && <p className="mb-3 text-sm text-gray-600">{data.descripcion}</p>}
                                    {data.puntos_necesarios && (
                                        <div className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-3 text-center">
                                            <span className="text-xl font-bold text-purple-600">{data.puntos_necesarios}</span>
                                            <span className="ml-1 text-sm text-purple-500">puntos</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Information Card */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <div className="flex items-center space-x-2">
                                    <Trophy className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-blue-800">
                                            <strong>Premio ID:</strong> {premio.id}
                                        </p>
                                        <p className="text-sm text-blue-600">Creado el: {new Date(premio.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-4 pt-6">
                                <Link
                                    href="/premios"
                                    className="inline-flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300"
                                >
                                    <span>Cancelar</span>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
                                >
                                    <Save className="h-5 w-5" />
                                    <span>{processing ? 'Guardando...' : 'Guardar Cambios'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
