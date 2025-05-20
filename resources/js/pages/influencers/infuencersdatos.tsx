import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    cantidad: number;
};

const breadcrumbs = [
    {
        title: 'Listado de influencers',
        href: '/infuencersdatos',
    },
];

export default function UserList() {
    const [rowData, setRowData] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string | number>('');
    const [notification, setNotification] = useState<string | null>(null);

    // Cargar usuarios desde la API
    useEffect(() => {
        fetch('/api/infuencersdatos')
            .then((response) => response.json())
            .then((data) => setRowData(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    // Eliminar usuario
    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            fetch(`/infuencersdatos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            })
                .then(() => {
                    setRowData((prevData) => prevData.filter((user) => user.id !== id));
                    setNotification('Usuario eliminado exitosamente');
                })
                .catch((error) => {
                    console.error('Error deleting user:', error);
                    setNotification('Hubo un error al eliminar el usuario');
                });
        }
    };

    // Editar el campo cantidad y manejar la creación de un nuevo dato si no existe
    const handleEditField = (id: number, field: string, value: string | number) => {
        setEditingId(id);
        setEditingField(field);
        setEditingValue(value);
        if (field === 'cantidad' && !value) {
            // Si no hay valor para la cantidad, creemos un nuevo registro en la tabla 'datos'
            setEditingValue(0); // Inicia con un valor por defecto si es vacío
        }
    };

    // Guardar la edición de un campo
    const saveEditField = async () => {
        if (editingValue.toString().trim() === '') {
            setNotification('El campo no puede estar vacío.');
            return;
        }

        const updatedField = {
            [editingField!]: editingValue,
        };

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/infuencersdatos/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(updatedField), // Asegúrate de incluir el campo cantidad
            });
            if (!response.ok) throw new Error('Error al actualizar el campo');
            const updatedUser = await response.json();
            setRowData((prev) => prev.map((user) => (user.id === editingId ? { ...user, [editingField!]: editingValue } : user)));
            setNotification('Campo actualizado exitosamente');
            setEditingId(null);
            setEditingField(null);
            setEditingValue('');
        } catch (error) {
            setNotification('Hubo un error al actualizar el campo');
        }
    };

    const columns = useMemo<ColumnDef<User, any>[]>(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Nombre',
                cell: ({ row }) => {
                    const isEditing = editingId === row.original.id && editingField === 'name';
                    return isEditing ? (
                        <input
                            value={editingValue}
                            autoFocus
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={saveEditField}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditField();
                                if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="w-full rounded border px-2 py-1"
                        />
                    ) : (
                        <span
                            onDoubleClick={() => handleEditField(row.original.id, 'name', row.original.name)}
                            className="cursor-pointer"
                            title="Doble click para editar"
                        >
                            {row.original.name}
                        </span>
                    );
                },
            },
            {
                header: 'Email',
                cell: ({ row }) => {
                    const isEditing = editingId === row.original.id && editingField === 'email';
                    return isEditing ? (
                        <input
                            value={editingValue}
                            autoFocus
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={saveEditField}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditField();
                                if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="w-full rounded border px-2 py-1"
                        />
                    ) : (
                        <span
                            onDoubleClick={() => handleEditField(row.original.id, 'email', row.original.email)}
                            className="cursor-pointer"
                            title="Doble click para editar"
                        >
                            {row.original.email}
                        </span>
                    );
                },
            },
            {
                header: 'Cantidad de videos asignados',
                cell: ({ row }) => {
                    const isEditing = editingId === row.original.id && editingField === 'cantidad';
                    return isEditing ? (
                        <input
                            type="number"
                            value={editingValue}
                            autoFocus
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={saveEditField}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditField();
                                if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="w-full rounded border px-2 py-1"
                        />
                    ) : (
                        <span
                            onDoubleClick={() => handleEditField(row.original.id, 'cantidad', row.original.cantidad)}
                            className="cursor-pointer"
                            title="Doble click para editar"
                        >
                            {row.original.cantidad}
                        </span>
                    );
                },
            },
            /* {
                header: 'Acciones',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button onClick={() => handleDelete(row.original.id)} className="text-gray-600 hover:text-gray-800" title="Eliminar">
                            <FaTrashAlt />
                        </button>
                    </div>
                ),
            }, */
        ],
        [editingId, editingField, editingValue],
    );

    const filteredData = useMemo(
        () => rowData.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || String(user.id).includes(search)),
        [rowData, search],
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Influencer" />
            {notification && (
                <div className="fixed top-6 right-6 z-50 rounded-lg border border-green-400 bg-green-100 px-6 py-3 text-green-800 shadow-lg transition duration-300">
                    {notification}
                </div>
            )}
            <div className="container mx-auto p-6">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Listado de influencer</h1>

                <div className="mb-6 max-w-sm">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="🔍 Buscar por nombre o ID..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="p-3 text-left text-sm font-semibold tracking-wide text-gray-700 uppercase">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="transition hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3 text-sm text-gray-800">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
