import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Coins, Gift, History } from 'lucide-react';

interface Premio {
    id: number;
    nombre_premio: string;
    descripcion: string;
    puntos_necesarios: number;
}

interface Canje {
    id: number;
    fecha: string;
    premio: Premio;
}

interface PageProps {
    canjes: {
        data: Canje[];
        links: any[];
    };
    puntosUsuario: number;
}

export default function HistorialCanjes({ canjes, puntosUsuario }: PageProps) {
    return (
        <AppLayout>
            <Head title="Historial de Canjes" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 p-3">
                                <History className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Historial de Canjes</h1>
                                <p className="text-gray-600">Todos tus canjes de premios</p>
                            </div>
                        </div>
                        <Link href={route('canjes.index')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-5 w-5" />
                            <span>Volver a Premios</span>
                        </Link>
                    </div>
                </div>

                {/* Puntos del usuario */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Coins className="h-10 w-10" />
                            <div>
                                <h2 className="text-2xl font-bold">Tus Puntos Actuales</h2>
                                <p className="text-blue-100">Después de todos tus canjes</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">{puntosUsuario}</div>
                            <div className="text-blue-200">puntos</div>
                        </div>
                    </div>
                </div>

                {/* Lista de canjes */}
                <div className="overflow-hidden rounded-xl bg-white shadow-md">
                    {canjes.data.length === 0 ? (
                        <div className="p-8 text-center">
                            <Gift className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                            <h3 className="mb-2 text-xl font-semibold text-gray-700">No hay canjes registrados</h3>
                            <p className="text-gray-500">Visita la tienda de premios para hacer tu primer canje</p>
                            <Link
                                href={route('canjes.index')}
                                className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                            >
                                Ver Premios
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {canjes.data.map((canje) => (
                                <div key={canje.id} className="p-6 transition-colors hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{canje.premio.nombre_premio}</h3>
                                            <p className="mt-1 text-gray-600">{canje.premio.descripcion}</p>

                                            <div className="mt-3 flex items-center space-x-4">
                                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {new Date(canje.fecha).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1 text-sm text-yellow-600">
                                                    <Coins className="h-4 w-4" />
                                                    <span>{canje.premio.puntos_necesarios} puntos canjeados</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 text-sm font-medium text-white">
                                                -{canje.premio.puntos_necesarios}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Paginación */}
                    {canjes.links.length > 3 && (
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <nav className="flex items-center justify-between">
                                <div className="hidden sm:block">
                                    <p className="text-sm text-gray-700">Mostrando {canjes.data.length} resultados</p>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    {canjes.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`rounded-md px-3 py-1 text-sm font-medium ${
                                                link.active ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-700'
                                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
