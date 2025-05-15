import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Booking {
    id: number;
    start_time: string;
    end_time: string;
    status: string;
    turno: string;
    user: { name: string };
    company: { name: string };
}

interface PageProps {
    week: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
    };
    bookings: Booking[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'weeks', href: '/weeks' },
    { title: 'bookings', href: '#' },
];

export default function BookingsByWeek() {
    const { week, bookings } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Bookings de ${week.name}`} />
            <div className="max-w-7xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-4">Bookings de: {week.name}</h1>
                <p className="text-gray-600 mb-6">
                    Del {week.start_date} al {week.end_date}
                </p>

                {bookings.length === 0 ? (
                    <p className="text-gray-500">No hay bookings para esta semana.</p>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                                <th className="px-4 py-2">Usuario</th>
                                <th className="px-4 py-2">Empresa</th>
                                <th className="px-4 py-2">Turno</th>
                                <th className="px-4 py-2">Estado</th>
                                <th className="px-4 py-2">Inicio</th>
                                <th className="px-4 py-2">Fin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-t">
                                    <td className="px-4 py-2">{booking.user.name}</td>
                                    <td className="px-4 py-2">{booking.company.name}</td>
                                    <td className="px-4 py-2">{booking.turno}</td>
                                    <td className="px-4 py-2">{booking.status}</td>
                                    <td className="px-4 py-2">{booking.start_time}</td>
                                    <td className="px-4 py-2">{booking.end_time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AppLayout>
    );
}
