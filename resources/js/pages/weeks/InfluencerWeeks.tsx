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
    { title: 'influencer view', href: '#' },
];

export default function InfluencerWeeks() {
    const { week, bookings } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Influencer - ${week.name}`} />

            <div className="max-w-7xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-4">Influencer - Bookings de: {week.name}</h1>
                <p className="text-gray-600 mb-6">
                    Semana del <strong>{week.start_date}</strong> al <strong>{week.end_date}</strong>
                </p>

                {bookings.length === 0 ? (
                    <p className="text-gray-500">No hay bookings disponibles para esta semana.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-md shadow-sm">
                            <thead>
                                <tr className="bg-blue-100 text-sm text-left text-gray-700 font-semibold">
                                    <th className="px-4 py-2">Turno</th>
                                    <th className="px-4 py-2">Estado</th>
                                    <th className="px-4 py-2">Inicio</th>
                                    <th className="px-4 py-2">Fin</th>
                                    <th className="px-4 py-2">Empresa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2">{booking.turno}</td>
                                        <td className="px-4 py-2">{booking.status}</td>
                                        <td className="px-4 py-2">{booking.start_time}</td>
                                        <td className="px-4 py-2">{booking.end_time}</td>
                                        <td className="px-4 py-2">{booking.company.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
