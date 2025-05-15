import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'weeks',
        href: '/weeks',
    },
];

interface Week {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
}

interface PageProps {
    weeks: {
        data: Week[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    search: string;
    [key: string]: unknown;
}

export default function WeeksIndex() {
    const { weeks, search: initialSearch } = usePage<PageProps>().props;
    const [search, setSearch] = useState(initialSearch || '');

    // Manejo del buscador
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get('/weeks', { search }, { preserveState: true, replace: true });
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    // Cambio de página
    const goToPage = (url: string | null) => {
        if (url) {
            router.visit(url, { preserveState: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Weeks" />

            <div className="max-w-7xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-4">Listado de Semanas</h1>

                {/* Buscador */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar semanas..."
                    className="w-full md:w-1/3 mb-6 px-4 py-2 border rounded shadow-sm"
                />

                {/* Grid de semanas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weeks.data.map((week) => (
                        <div
                            key={week.id}
                            className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
                        >
                            <div className="bg-blue-600 text-white text-center py-2 rounded-t font-semibold">
                                {week.name}
                            </div>
                            <div className="p-2 text-sm text-gray-700">
                                <p>Inicio: {week.start_date}</p>
                                <p>Fin: {week.end_date}</p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <a
                                    href={`/weeks/${week.id}/bookings`}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Ver Bookings
                                </a>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Paginación */}
                <div className="mt-6 flex justify-center space-x-1 flex-wrap">
                    {weeks.links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(link.url)}
                            disabled={!link.url}
                            className={`px-3 py-1 rounded text-sm ${link.active
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
