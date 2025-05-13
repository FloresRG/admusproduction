import React, { useMemo, useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type Category = {
  id: number;
  name: string;
};

const breadcrumbs = [
  {
    title: 'Categories',
    href: '/categories',
  },
];

export default function Index({ categories }: { categories: Category[] }) {
  const [rowData, setRowData] = useState(categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [search, setSearch] = useState('');

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      fetch(`/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
      })
        .then(() => {
          setRowData((prevData) => prevData.filter((category) => category.id !== id));
          setNotification('Categoría eliminada exitosamente');
        })
        .catch((error) => {
          console.error('Error deleting category:', error);
          setNotification('Hubo un error al eliminar la categoría');
        });
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEdit = async (id: number) => {
    if (!editingName.trim()) {
      setNotification('El nombre de la categoría es obligatorio.');
      return;
    }
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch(`/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({ name: editingName }),
      });
      if (!response.ok) throw new Error('Error al actualizar la categoría');
      const updated = await response.json();
      setRowData(prev =>
        prev.map(cat => (cat.id === id ? { ...cat, name: updated.name } : cat))
      );
      setNotification('Categoría actualizada exitosamente');
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      setNotification('Hubo un error al actualizar la categoría');
    }
  };

  const columns = useMemo<ColumnDef<Category, any>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
      },
      {
        header: 'Nombre',
        cell: ({ row }) => {
          const isEditing = editingId === row.original.id;
          return isEditing ? (
            <input
              value={editingName}
              autoFocus
              onChange={e => setEditingName(e.target.value)}
              onBlur={() => saveEdit(row.original.id)}
              onKeyDown={e => {
                if (e.key === 'Enter') saveEdit(row.original.id);
                if (e.key === 'Escape') setEditingId(null);
              }}
              className="border px-2 py-1 rounded w-full"
            />
          ) : (
            <span
              onDoubleClick={() => handleEdit(row.original.id, row.original.name)}
              className="cursor-pointer"
              title="Doble click para editar"
            >
              {row.original.name}
            </span>
          );
        },
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleDelete(row.original.id)}
              className="text-gray-600 hover:text-gray-800"
              title="Eliminar"
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
      },
    ],
    [editingId, editingName]
  );

  // Filtrado por búsqueda
  const filteredData = useMemo(
    () =>
      rowData.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        String(cat.id).includes(search)
      ),
    [rowData, search]
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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      setNotification('El nombre de la categoría es obligatorio.');
      return;
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    try {
      const response = await fetch('/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la categoría');
      }

      const newCategory = await response.json();
      setRowData((prevData) => [...prevData, newCategory]);
      setNotification('Categoría creada exitosamente');
      setNewCategoryName('');
      closeModal();
    } catch (error) {
      console.error('Error creating category:', error);
      setNotification('Hubo un error al crear la categoría');
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Categorías" />

      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg shadow-md transition duration-300">
          {notification}
        </div>
      )}

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Categorías</h1>

        <div className="flex items-center mb-4 gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o ID..."
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
          />
          <button
            onClick={openModal}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded"
          >
            + Crear nueva categoría
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-2 text-left cursor-pointer">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Anterior
          </button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Crear Categoría"
        ariaHideApp={false}
        className="max-w-md mx-auto mt-24 bg-white p-6 rounded-lg shadow-lg border border-gray-300"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Nueva Categoría</h2>

        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre de la categoría"
          className="w-full px-4 py-2 mb-4 bg-white text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex justify-end space-x-3">
          <button onClick={createCategory} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Crear
          </button>
          <button onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">
            Cancelar
          </button>
        </div>
      </Modal>
    </AppLayout>
  );
}
