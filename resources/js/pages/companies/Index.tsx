import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#app');
type AvailabilityDay = {
    day_of_week: string;
    start_time: string;
    end_time: string;
    turno: string;
};
type Company = {
    id: number;
    name: string;
    category: {
        name: string;
    };
    contract_duration: string;
    start_date?: string;
    end_date?: string;
    // Acepta ambas variantes
    availabilityDays?: AvailabilityDay[];
    availability_days?: AvailabilityDay[];
};
type Props = {
    companies: Company[];
};

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function formatDay(day: string) {
    const dayMap: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return dayMap[day] || day;
}

const CompaniesIndex = ({ companies }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [companiesList, setCompaniesList] = useState(companies);
    const [search, setSearch] = useState('');

    // Buscador reactivo
    const filteredCompanies = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return companiesList;
        return companiesList.filter((c) => c.name.toLowerCase().includes(s) || c.category?.name?.toLowerCase().includes(s));
    }, [search, companiesList]);

    const columns = useMemo<ColumnDef<Company, any>[]>(
        () => [
            { header: 'Nombre', accessorKey: 'name' },
            { header: 'Categoría', accessorKey: 'category.name' },
            { header: 'Duración del contrato', accessorKey: 'contract_duration' },
            { header: 'Fecha inicio', accessorKey: 'start_date' },
            { header: 'Fecha fin', accessorKey: 'end_date' },
            {
                header: 'Días Disponibles',
                cell: ({ row }) => {
                    // Usa snake_case si así llega desde Laravel
                    const availability = Array.isArray(row.original.availability_days) ? row.original.availability_days : [];
                    return (
                        <div className="flex flex-col gap-1">
                            {availability.length === 0 && <span className="text-gray-400 italic">Sin disponibilidad</span>}
                            {availability.map((d, i) => (
                                <span
                                    key={i}
                                    className={`inline-block rounded px-2 py-1 text-xs font-semibold ${d.turno === 'mañana' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'} border border-gray-200`}
                                >
                                    {formatDay(d.day_of_week)}: {d.start_time} - {d.end_time} ({d.turno})
                                </span>
                            ))}
                        </div>
                    );
                },
            },
            {
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Link href={`/companies/${row.original.id}/edit`} className="text-black underline hover:text-gray-700">
                            Editar
                        </Link>
                        <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(row.original)}>
                            <FaTrashAlt />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const table = useReactTable({
        data: filteredCompanies,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    function handleDelete(company: Company) {
        setSelectedCompany(company);
        setModalOpen(true);
    }

    async function confirmDelete() {
        if (selectedCompany) {
            try {
                const response = await fetch(`/companies/${selectedCompany.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });
                const data = await response.json();
                setNotification(data.success);
                setCompaniesList(companiesList.filter((c) => c.id !== selectedCompany.id));
            } catch (e) {
                setNotification('Error al eliminar la compañía');
            }
            setModalOpen(false);
            setSelectedCompany(null);
        }
    }

    function cancelDelete() {
        setModalOpen(false);
        setSelectedCompany(null);
    }

    return (
        <AppLayout>
            <Head title="Compañías" />
            {notification && (
                <div className="fixed top-6 right-6 z-50 rounded-lg border border-green-300 bg-green-100 px-6 py-3 text-green-800 shadow-md transition duration-300">
                    {notification}
                </div>
            )}
            <div className="py-6">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <Link href="/companies/create" className="rounded bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800">
                        Crear nueva compañía
                    </Link>
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o categoría..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded border py-2 pr-4 pl-10 focus:ring-2 focus:ring-black focus:outline-none"
                        />
                        <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-x-auto rounded border border-gray-200 bg-white shadow">
                    <table className="min-w-full table-auto text-black">
                        <thead className="bg-gray-100">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="border-b px-4 py-2 text-left font-semibold">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="py-8 text-center text-gray-400">
                                        No se encontraron compañías.
                                    </td>
                                </tr>
                            )}
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-t transition hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-2 align-top">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                        <button
                            className="rounded border bg-gray-100 px-4 py-2 text-sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<<'}
                        </button>
                        <button
                            className="rounded border bg-gray-100 px-4 py-2 text-sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<'}
                        </button>
                        <button
                            className="rounded border bg-gray-100 px-4 py-2 text-sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>'}
                        </button>
                        <button
                            className="rounded border bg-gray-100 px-4 py-2 text-sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>>'}
                        </button>
                    </div>
                    <div>
                        <span>
                            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                        </span>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalOpen}
                onRequestClose={cancelDelete}
                className="mx-auto w-full max-w-xs rounded-lg border border-black bg-white p-6 shadow-lg focus:ring-2 focus:ring-black focus:outline-none"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-lg font-bold text-black">Confirmar eliminación</h2>
                <p className="mt-2 text-black">
                    ¿Estás seguro de que deseas eliminar la compañía "<span className="font-semibold">{selectedCompany?.name}</span>"?
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400" onClick={cancelDelete}>
                        Cancelar
                    </button>
                    <button className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700" onClick={confirmDelete}>
                        Eliminar
                    </button>
                </div>
            </Modal>
        </AppLayout>
    );
};

export default CompaniesIndex;
