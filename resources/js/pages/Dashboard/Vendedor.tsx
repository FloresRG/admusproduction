import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    ChartBarIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    XCircleIcon,
} from '@heroicons/react/24/solid';
import { FC } from 'react';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
}

interface Estadisticas {
    total: number;
    completado: number;
    en_proceso: number;
    sin_exito: number;
}

interface EmpresaDashboardProps {
    user: User;
    estadisticas: Estadisticas;
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const EmpresaDashboard: FC<EmpresaDashboardProps> = ({ user, estadisticas }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                {/* Bienvenida */}
                <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-lg">
                    <h1 className="text-4xl font-extrabold">Bienvenido, {user.name}</h1>
                    <p className="mt-2 text-lg text-indigo-100">Este es tu panel de seguimiento de empresa.</p>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total */}
                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <p className="text-sm font-medium text-gray-500">Total de Seguimientos</p>
                        <p className="mt-1 text-3xl font-bold text-blue-700">{estadisticas.total}</p>
                        <ChartBarIcon className="mt-4 h-8 w-8 text-blue-400" />
                    </div>

                    {/* En Proceso */}
                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <p className="text-sm font-medium text-gray-500">En Proceso</p>
                        <p className="mt-1 text-3xl font-bold text-yellow-600">{estadisticas.en_proceso}</p>
                        <ArrowPathIcon className="mt-4 h-8 w-8 text-yellow-400" />
                    </div>

                    {/* Completados */}
                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <p className="text-sm font-medium text-gray-500">Completados</p>
                        <p className="mt-1 text-3xl font-bold text-green-600">{estadisticas.completado}</p>
                        <CheckCircleIcon className="mt-4 h-8 w-8 text-green-400" />
                    </div>

                    {/* Sin Éxito */}
                    <div className="rounded-xl bg-white p-6 shadow-md">
                        <p className="text-sm font-medium text-gray-500">Sin Éxito</p>
                        <p className="mt-1 text-3xl font-bold text-red-600">{estadisticas.sin_exito}</p>
                        <XCircleIcon className="mt-4 h-8 w-8 text-red-400" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default EmpresaDashboard;
