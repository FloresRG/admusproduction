import { useState, useEffect } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Usaremos este tema claro
import Modal from 'react-modal';
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; // Iconos de eliminar y editar

// Importar el módulo ClientSideRowModel
import { ClientSideRowModelModule } from 'ag-grid-community';
import { provideGlobalGridOptions } from 'ag-grid-community';
provideGlobalGridOptions({ theme: "legacy" });

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function Index({ categories }: { categories: Array<{ id: number; name: string }> }) {
    const [rowData, setRowData] = useState(categories);
    const [columnDefs] = useState([
        { headerName: "ID", field: "id", editable: false },
        { headerName: "Nombre", field: "name", editable: true },
        {
            headerName: "Acciones",
            field: "actions",
            cellRendererFramework: (params: any) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleDelete(params.data.id)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Eliminar"
                    >
                        <FaTrashAlt />
                    </button>
                </div>
            ),
            editable: false,
            suppressSizeToFit: true,
        },
    ]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [notification, setNotification] = useState<string | null>(null);

    const onCellValueChanged = (event: { colDef: any; data: any; }) => {
        const { colDef, data } = event;
        if (colDef.field === 'name') {
            fetch(`/categories/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: data.name }),
            })
                .then(response => response.json())
                .then(updatedCategory => {
                    setRowData(prevData =>
                        prevData.map(category =>
                            category.id === updatedCategory.id
                                ? { ...category, name: updatedCategory.name }
                                : category
                        )
                    );
                })
                .catch(error => {
                    console.error('Error updating category:', error);
                });
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const createCategory = async () => {
        if (!newCategoryName.trim()) {
            setNotification("El nombre de la categoría es obligatorio.");
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

            setRowData(prevData => [...prevData, newCategory]);
            setNotification('Categoría creada exitosamente');
            setNewCategoryName('');
            closeModal();
        } catch (error) {
            console.error('Error creating category:', error);
            setNotification('Hubo un error al crear la categoría');
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            fetch(`/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(() => {
                    setRowData(prevData => prevData.filter(category => category.id !== id));
                    setNotification('Categoría eliminada exitosamente');
                })
                .catch(error => {
                    console.error('Error deleting category:', error);
                    setNotification('Hubo un error al eliminar la categoría');
                });
        }
    };

    const handleEdit = (data: any) => {
        // Lógica para editar la categoría
        // Puedes abrir una modal o permitir la edición en línea
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

                <button
                    onClick={openModal}
                    className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded mb-4"
                >
                    + Crear nueva categoría
                </button>

                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        onCellValueChanged={onCellValueChanged}
                        domLayout="autoHeight"
                        modules={[ClientSideRowModelModule]}
                    />
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
                    <button
                        onClick={createCategory}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Crear
                    </button>
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </Modal>
        </AppLayout>
    );
}