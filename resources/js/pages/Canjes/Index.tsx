import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, CheckCircle2, Clock, Coins, Gift, History, Lock, Package, Unlock } from 'lucide-react';

interface Premio {
    id: number;
    nombre_premio: string;
    descripcion: string;
    puntos_necesarios: number;
    stock: number | null;
}

interface Canje {
    id: number;
    fecha: string;
    estado: string;
    fecha_recogido: string | null;
    premio: Premio;
}

interface PageProps {
    premios: Premio[];
    puntosUsuario: number;
    canjesRecientes: Canje[];
    success?: string;
}

export default function CanjesIndex({ premios, puntosUsuario, canjesRecientes, success }: PageProps) {
    const { post, processing } = useForm();

    const canjearPremio = (premioId: number) => {
        post(route('canjes.store', { premio_id: premioId }));
    };

    // Separar premios en disponibles y no disponibles
    const premiosDisponibles = premios.filter((premio) => puntosUsuario >= premio.puntos_necesarios);
    const premiosNoDisponibles = premios.filter((premio) => puntosUsuario < premio.puntos_necesarios);

    return (
        <AppLayout>
            <Head title="Canje de Premios" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header con puntos */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Coins className="h-10 w-10" />
                            <div>
                                <h2 className="text-2xl font-bold">Canje de Premios</h2>
                                <p className="text-blue-100">Puntos disponibles para canjear</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">{puntosUsuario}</div>
                            <div className="text-blue-200">puntos</div>
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

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Lista de premios */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Todos los Premios</h2>
                            <span className="text-sm text-gray-500">Total: {premios.length} premios</span>
                        </div>

                        {premios.length === 0 ? (
                            <div className="rounded-xl bg-white p-8 text-center shadow-md">
                                <Gift className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-700">No hay premios disponibles</h3>
                                <p className="text-gray-500">Sigue acumulando puntos para desbloquear premios</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Premios Disponibles */}
                                {premiosDisponibles.length > 0 && (
                                    <div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="flex items-center text-lg font-semibold text-green-600">
                                                <Unlock className="mr-2 h-5 w-5" />
                                                Premios Desbloqueados
                                            </h3>
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                                {premiosDisponibles.length} disponibles
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {premiosDisponibles.map((premio) => (
                                                <div
                                                    key={premio.id}
                                                    className="group overflow-hidden rounded-xl border-2 border-green-200 bg-white shadow-md transition-all hover:border-green-300 hover:shadow-lg"
                                                >
                                                    <div className="p-6">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <h3 className="text-xl font-bold text-gray-900">{premio.nombre_premio}</h3>
                                                            <div className="flex items-center space-x-1 text-green-600">
                                                                <Unlock className="h-4 w-4" />
                                                                <span className="text-sm font-medium">Disponible</span>
                                                            </div>
                                                        </div>
                                                        <p className="mb-4 line-clamp-2 text-gray-600">{premio.descripcion}</p>

                                                        <div className="mb-4 flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <Coins className="h-5 w-5 text-yellow-500" />
                                                                <span className="font-semibold text-gray-700">{premio.puntos_necesarios} puntos</span>
                                                            </div>
                                                            {premio.stock !== null && (
                                                                <span className="text-sm text-green-600">
                                                                    {premio.stock} disponible{premio.stock !== 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => canjearPremio(premio.id)}
                                                            disabled={processing}
                                                            className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 font-medium text-white transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-md disabled:opacity-50 disabled:hover:shadow-none"
                                                        >
                                                            {processing ? 'Procesando...' : 'Canjear Ahora'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Premios No Disponibles */}
                                {premiosNoDisponibles.length > 0 && (
                                    <div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="flex items-center text-lg font-semibold text-gray-500">
                                                <Lock className="mr-2 h-5 w-5" />
                                                Premios Bloqueados
                                            </h3>
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                                                {premiosNoDisponibles.length} bloqueados
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {premiosNoDisponibles.map((premio) => (
                                                <div
                                                    key={premio.id}
                                                    className="group overflow-hidden rounded-xl border-2 border-gray-200 bg-white opacity-90 shadow-md transition-all hover:opacity-100"
                                                >
                                                    <div className="p-6">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <h3 className="text-xl font-bold text-gray-500">{premio.nombre_premio}</h3>
                                                            <div className="flex items-center space-x-1 text-gray-500">
                                                                <Lock className="h-4 w-4" />
                                                                <span className="text-sm font-medium">Bloqueado</span>
                                                            </div>
                                                        </div>
                                                        <p className="mb-4 line-clamp-2 text-gray-400">{premio.descripcion}</p>

                                                        <div className="mb-4 flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <Coins className="h-5 w-5 text-gray-400" />
                                                                <span className="font-semibold text-gray-500">{premio.puntos_necesarios} puntos</span>
                                                            </div>
                                                            {premio.stock !== null && (
                                                                <span className="text-sm text-gray-400">
                                                                    {premio.stock} disponible{premio.stock !== 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="mb-4 space-y-2">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-500">Te faltan:</span>
                                                                <span className="font-semibold text-red-500">
                                                                    {premio.puntos_necesarios - puntosUsuario} puntos
                                                                </span>
                                                            </div>
                                                            <div className="h-2 w-full rounded-full bg-gray-200">
                                                                <div
                                                                    className="h-2 rounded-full bg-red-500 transition-all duration-300"
                                                                    style={{
                                                                        width: `${Math.min((puntosUsuario / premio.puntos_necesarios) * 100, 100)}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <button
                                                            disabled
                                                            className="w-full cursor-not-allowed rounded-lg bg-gray-200 px-4 py-3 font-medium text-gray-500 transition-all"
                                                        >
                                                            Puntos insuficientes
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Panel lateral - Historial reciente */}
                    <div className="space-y-6">
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Canjes Recientes</h2>
                                <Link
                                    href={route('canjes.historial')}
                                    className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    <span>Ver todo</span>
                                    <History className="h-4 w-4" />
                                </Link>
                            </div>

                            {canjesRecientes.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Package className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                    <p className="text-gray-500">Aún no has canjeado premios</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {canjesRecientes.map((canje) => (
                                        <div
                                            key={canje.id}
                                            className={`rounded-r-lg border-l-4 p-4 transition-all ${
                                                canje.estado === 'pendiente'
                                                    ? 'border-orange-500 bg-orange-50 hover:bg-orange-100'
                                                    : 'border-green-500 bg-green-50 hover:bg-green-100'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{canje.premio.nombre_premio}</h4>
                                                    <p className="mb-2 text-sm text-gray-600">
                                                        {new Date(canje.fecha).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-1">
                                                            <Coins className="h-4 w-4 text-yellow-500" />
                                                            <span className="text-sm text-gray-500">-{canje.premio.puntos_necesarios} puntos</span>
                                                        </div>
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                                canje.estado === 'pendiente'
                                                                    ? 'bg-orange-100 text-orange-800'
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}
                                                        >
                                                            {canje.estado === 'pendiente' ? (
                                                                <>
                                                                    <Clock className="mr-1 h-3 w-3" />
                                                                    Pendiente
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                    Recogido
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                    {canje.estado === 'pendiente' && (
                                                        <div className="mt-2 flex items-center space-x-1 text-xs text-orange-600">
                                                            <Package className="h-3 w-3" />
                                                            <span>Reclama tu Premio en ADMUS</span>
                                                        </div>
                                                    )}
                                                    {canje.estado === 'recogido' && canje.fecha_recogido && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            Recogido: {new Date(canje.fecha_recogido).toLocaleDateString('es-ES')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="rounded-xl bg-white p-6 shadow-md">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Estadísticas</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Premios disponibles</span>
                                    <span className="font-semibold text-green-600">{premiosDisponibles.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Premios bloqueados</span>
                                    <span className="font-semibold text-gray-600">{premiosNoDisponibles.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Canjes pendientes</span>
                                    <span className="font-semibold text-orange-600">
                                        {canjesRecientes.filter((c) => c.estado === 'pendiente').length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
