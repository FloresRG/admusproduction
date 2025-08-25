import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, CheckCircle, CheckCircle2, ChevronRight, Clock, Coins, Package } from 'lucide-react';

interface Premio {
    id: number;
    nombre_premio: string;
    puntos_necesarios: number;
}

interface Usuario {
    id: number;
    name: string;
    email: string;
}

interface Canje {
    id: number;
    fecha: string;
    estado: string;
    fecha_recogido: string | null;
    premio: Premio;
    usuario: Usuario;
}

interface CanjeRecogido {
    id: number;
    fecha: string;
    fecha_recogido: string;
    premio: Premio;
    usuario: Usuario;
}

interface PageProps {
    canjesPendientes: {
        data: Canje[];
        links: any[];
    };
    canjesRecogidos: {
        data: CanjeRecogido[];
        links: any[];
    };
    success?: string;
}

export default function CanjesPendientes({ canjesPendientes, canjesRecogidos, success }: PageProps) {
    const { post, processing } = useForm();

    const marcarRecogido = (canjeId: number) => {
        post(route('canjes.marcar-recogido', { canje: canjeId }));
    };

    return (
        <AppLayout>
            <Head title="Gestión de Canjes" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 p-3">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Gestión de Canjes</h1>
                                <p className="text-gray-600">Administra la entrega de premios canjeados</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mensaje de éxito */}
                {success && (
                    <div className="mb-6 flex items-center space-x-3 rounded-lg border border-green-200 bg-green-50 p-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-800">{success}</span>
                    </div>
                )}

                {/* Estadísticas generales */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pendientes</p>
                                <p className="text-2xl font-bold text-orange-600">{canjesPendientes.data.length}</p>
                            </div>
                            <div className="rounded-lg bg-orange-100 p-3">
                                <Clock className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Recogidos</p>
                                <p className="text-2xl font-bold text-green-600">{canjesRecogidos.data.length}</p>
                            </div>
                            <div className="rounded-lg bg-green-100 p-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Canjes</p>
                                <p className="text-2xl font-bold text-blue-600">{canjesPendientes.data.length + canjesRecogidos.data.length}</p>
                            </div>
                            <div className="rounded-lg bg-blue-100 p-3">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Canjes Pendientes (Cartas para confirmar) */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Canjes por Confirmar</h2>
                                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                                    {canjesPendientes.data.length} pendientes
                                </span>
                            </div>

                            {canjesPendientes.data.length === 0 ? (
                                <div className="rounded-lg bg-gray-50 p-8 text-center">
                                    <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-300" />
                                    <h3 className="text-lg font-semibold text-gray-600">¡Todo al día!</h3>
                                    <p className="text-gray-500">No hay canjes pendientes</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {canjesPendientes.data.map((canje) => (
                                        <div
                                            key={canje.id}
                                            className="flex flex-col justify-between rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-sm sm:flex-row sm:items-center"
                                        >
                                            {/* Info usuario y premio */}
                                            <div className="flex-1">
                                                <div className="mb-1">
                                                    <p className="font-semibold text-gray-900">Nombre: {canje.usuario.name}</p>
                                                    <p className="text-sm text-gray-500">Email: {canje.usuario.email}</p>
                                                </div>

                                                <p className="text-base font-semibold text-gray-800">Premio: {canje.premio.nombre_premio}</p>
                                            </div>

                                            {/* Info puntos y fecha + botón */}
                                            <div className="mt-3 flex items-center justify-between sm:mt-0 sm:ml-6 sm:w-1/2">
                                                <div className="flex flex-col space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <Coins className="h-4 w-4 text-orange-600" />
                                                        <span>Puntos necesarios para el premio: {canje.premio.puntos_necesarios} pts</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span>Fecha de Solicitud: {new Date(canje.fecha).toLocaleDateString('es-ES')}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => marcarRecogido(canje.id)}
                                                    disabled={processing}
                                                    className="ml-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Paginación para pendientes */}
                            {canjesPendientes.links.length > 3 && (
                                <div className="mt-6">
                                    <nav className="flex justify-center">
                                        {canjesPendientes.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`mx-1 rounded-lg px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-orange-600 text-white'
                                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Canjes Recogidos (Lista simple) */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Historial de Recogidos</h2>
                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                    {canjesRecogidos.data.length} recogidos
                                </span>
                            </div>

                            {canjesRecogidos.data.length === 0 ? (
                                <div className="rounded-lg bg-gray-50 p-8 text-center">
                                    <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                                    <h3 className="text-lg font-semibold text-gray-600">Sin historial</h3>
                                    <p className="text-gray-500">Aún no se han recogido premios</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {canjesRecogidos.data.map((canje) => (
                                        <div key={canje.id} className="py-3">
                                            <div className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium text-gray-900">{canje.usuario.name}</p>
                                                            <p className="truncate text-sm text-gray-500">{canje.premio.nombre_premio}</p>
                                                            <div className="mt-1 flex items-center space-x-4 text-xs text-gray-400">
                                                                <span>{canje.premio.puntos_necesarios} puntos</span>
                                                                <span>•</span>
                                                                <span>Canje: {new Date(canje.fecha).toLocaleDateString('es-ES')}</span>
                                                                <span>•</span>
                                                                <span>Recogido: {new Date(canje.fecha_recogido).toLocaleDateString('es-ES')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Paginación para recogidos */}
                            {canjesRecogidos.links.length > 3 && (
                                <div className="mt-6">
                                    <nav className="flex justify-center">
                                        {canjesRecogidos.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`mx-1 rounded-lg px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
