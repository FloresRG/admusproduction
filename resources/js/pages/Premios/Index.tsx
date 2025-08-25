import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, Trophy } from 'lucide-react';
interface Premio {
    id: number;
    nombre_premio: string;
    descripcion: string | null;
    puntos_necesarios: number | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedPremios {
    data: Premio[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    premios: PaginatedPremios;
    flash?: {
        success?: string;
    };
}

export default function Index({ premios, flash }: Props) {
    const handleDelete = (premio: Premio) => {
        if (confirm(`¿Estás seguro de eliminar el premio "${premio.nombre_premio}"?`)) {
            router.delete(`/premios/${premio.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Premios" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 p-3">
                                    <Trophy className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Premios</h1>
                                    <p className="text-gray-600">Administra los premios disponibles</p>
                                </div>
                            </div>
                            <Link
                                href="/premios/create"
                                className="inline-flex transform items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Nuevo Premio</span>
                            </Link>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700">{flash.success}</div>
                    )}

                    {/* Premios Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {premios.data.map((premio) => (
                            <div
                                key={premio.id}
                                className="transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                                <div className="p-6">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="mb-2 text-xl font-bold text-gray-900">{premio.nombre_premio}</h3>
                                            {premio.descripcion && <p className="mb-3 line-clamp-3 text-sm text-gray-600">{premio.descripcion}</p>}
                                        </div>
                                    </div>

                                    {premio.puntos_necesarios && (
                                        <div className="mb-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-3">
                                            <div className="flex items-center justify-center">
                                                <span className="text-2xl font-bold text-purple-600">{premio.puntos_necesarios}</span>
                                                <span className="ml-1 text-sm text-purple-500">puntos</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/premios/${premio.id}/edit`}
                                            className="inline-flex flex-1 items-center justify-center space-x-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span>Editar</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(premio)}
                                            className="inline-flex items-center justify-center rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {premios.data.length === 0 && (
                        <div className="rounded-xl bg-white p-12 text-center shadow-lg">
                            <div className="mb-4 inline-block rounded-full bg-gray-100 p-4">
                                <Trophy className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">No hay premios disponibles</h3>
                            <p className="mb-6 text-gray-600">Comienza creando tu primer premio</p>
                            <Link
                                href="/premios/create"
                                className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-700"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Crear Primer Premio</span>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {premios.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-2">
                                {premios.prev_page_url && (
                                    <Link
                                        href={premios.prev_page_url}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
                                    >
                                        Anterior
                                    </Link>
                                )}

                                <span className="rounded-lg bg-blue-500 px-4 py-2 text-white">
                                    {premios.current_page} de {premios.last_page}
                                </span>

                                {premios.next_page_url && (
                                    <Link
                                        href={premios.next_page_url}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
                                    >
                                        Siguiente
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
