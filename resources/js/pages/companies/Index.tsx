import React, { useState, useMemo } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

Modal.setAppElement('#app');

type Company = {
    id: number;
    name: string;
    category: {
        name: string;
    };
    contract_duration: string;
    availabilityDays: {
        day_of_week: number;
        start_time: string;
        end_time: string;
        turno: string;
    }[];
};

type Props = {
    companies: Company[];
};

const CompaniesIndex = ({ companies }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [companiesList, setCompaniesList] = useState(companies);

    const columns = useMemo<ColumnDef<Company, any>[]>(() => [
        { header: 'Nombre', accessorKey: 'name' },
        { header: 'Categoría', accessorKey: 'category.name' },
        { header: 'Duración del contrato', accessorKey: 'contract_duration' },
        {
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link href={`/companies/${row.original.id}/edit`} className="text-black hover:text-gray-700">Editar</Link>
                    <button className="text-red-600" onClick={() => handleDelete(row.original)}>
                        <FaTrashAlt />
                    </button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: companiesList,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleDelete = (company: Company) => {
        setSelectedCompany(company);
        setModalOpen(true);
    };

    const confirmDelete = async () => {
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
                setCompaniesList(companiesList.filter(c => c.id !== selectedCompany.id));
            } catch (e) {
                setNotification('Error al eliminar la compañía');
            }
            setModalOpen(false);
            setSelectedCompany(null);
        }
    };

    const cancelDelete = () => {
        setModalOpen(false);
        setSelectedCompany(null);
    };

    return (
        <AppLayout>
            {notification && (
                <div className="fixed top-6 right-6 z-50 bg-green-100 text-green-800 border border-green-300 px-6 py-3 rounded-lg shadow-md transition duration-300">
                    {notification}
                </div>
            )}
            <Head title="Compañías" />
            <div className="py-6">
                <div className="mb-4">
                    <Link
                        href="/companies/create"
                        className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
                    >
                        Crear nueva compañía
                    </Link>
                </div>
                <table className="min-w-full table-auto bg-white text-black">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-2 text-left border-b">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-t">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-2">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 text-sm border bg-gray-100 rounded"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<<'}
                        </button>
                        <button
                            className="px-4 py-2 text-sm border bg-gray-100 rounded"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<'}
                        </button>
                        <button
                            className="px-4 py-2 text-sm border bg-gray-100 rounded"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>'}
                        </button>
                        <button
                            className="px-4 py-2 text-sm border bg-gray-100 rounded"
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
                className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full mx-auto border border-black focus:outline-none focus:ring-2 focus:ring-black"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="text-lg text-black">Confirmar eliminación</h2>
                <p className="text-black">¿Estás seguro de que deseas eliminar la compañía "{selectedCompany?.name}"?</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={cancelDelete}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={confirmDelete}
                    >
                        Eliminar
                    </button>
                </div>
            </Modal>


        </AppLayout>
    );
};

export default CompaniesIndex;
