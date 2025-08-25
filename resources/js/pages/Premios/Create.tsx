import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Trophy } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
interface FormData {
    nombre_premio: string;
    descripcion: string;
    puntos_necesarios: string;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        nombre_premio: '',
        descripcion: '',
        puntos_necesarios: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/premios');
    };

    return (
        <AppLayout>
            <Head title="Crear Premio" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/premios"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </Link>
                            <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Premio</h1>
                                <p className="text-gray-600">Agrega un nuevo premio al catálogo</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombre del Premio */}
                            <div>
                                <label htmlFor="nombre_premio" className="block text-sm font-bold text-gray-700 mb-2">
                                    Nombre del Premio *
                                </label>
                                <input
                                    type="text"
                                    id="nombre_premio"
                                    value={data.nombre_premio}
                                    onChange={(e) => setData('nombre_premio', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.nombre_premio ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: iPhone 15 Pro Max"
                                />
                                {errors.nombre_premio && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombre_premio}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-bold text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    rows={4}
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                                        errors.descripcion ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Describe el premio, sus características, condiciones, etc."
                                />
                                {errors.descripcion && (
                                    <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                                )}
                            </div>

                            {/* Puntos Necesarios */}
                            <div>
                                <label htmlFor="puntos_necesarios" className="block text-sm font-bold text-gray-700 mb-2">
                                    Puntos Necesarios
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="puntos_necesarios"
                                        min="0"
                                        value={data.puntos_necesarios}
                                        onChange={(e) => setData('puntos_necesarios', e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.puntos_necesarios ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="1000"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-sm">pts</span>
                                    </div>
                                </div>
                                {errors.puntos_necesarios && (
                                    <p className="mt-1 text-sm text-red-600">{errors.puntos_necesarios}</p>
                                )}
                            </div>

                            {/* Preview Card */}
                            {(data.nombre_premio || data.descripcion || data.puntos_necesarios) && (
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
                                    <div className="bg-white rounded-lg shadow-md p-4">
                                        <h4 className="font-bold text-gray-900 mb-2">
                                            {data.nombre_premio || 'Nombre del premio'}
                                        </h4>
                                        {data.descripcion && (
                                            <p className="text-gray-600 text-sm mb-3">{data.descripcion}</p>
                                        )}
                                        {data.puntos_necesarios && (
                                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                                                <span className="text-xl font-bold text-purple-600">
                                                    {data.puntos_necesarios}
                                                </span>
                                                <span className="text-sm text-purple-500 ml-1">puntos</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex space-x-4 pt-6">
                                <Link
                                    href="/premios"
                                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <span>Cancelar</span>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>{processing ? 'Guardando...' : 'Guardar Premio'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}