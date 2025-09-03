import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FC } from 'react';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    profile_photo_url?: string;
}

interface JefeVentasDashboardProps {
    user: User;
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const JefeVentasDashboard: FC<JefeVentasDashboardProps> = ({ user }) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                {/* Bienvenida */}
                <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-lg">
                    <h1 className="text-4xl font-extrabold">Bienvenido, {user.name}</h1>
                    <p className="mt-2 text-lg text-indigo-100">Este es tu panel de Administrador de Ventas.</p>
                </div>

                {/* Aquí podrías añadir contenido adicional más adelante */}
                <div className="rounded-xl bg-white p-6 text-gray-700 shadow-md">
                    <p className="text-lg">Próximamente verás tus estadísticas y reportes aquí.</p>
                </div>
            </div>
        </AppLayout>
    );
};

export default JefeVentasDashboard;
